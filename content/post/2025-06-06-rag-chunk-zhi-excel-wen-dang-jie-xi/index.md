---
title: "Rag chunk 之：Excel 文档解析"
slug: 2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi
description: "前言处理  Excel 文件时会遇到一些独特的挑战。"
date: 2025-06-06T01:39:11.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi/cover.jpg
original_url: https://mp.weixin.qq.com/s/0w-CmkM73WLY7fjOUXuABg
categories:
  - AI
tags:
  - Python
  - RAG
  - LangChain
  - Embedding
  - 算法
---
## 前言

处理  Excel 文件时会遇到一些独特的挑战。与典型的结构化格式不同，由于合并单元格、多个表头、嵌入式图表和非传统的布局（这些布局主要设计用于人阅读而非机器解析）等元素，这些文件在数据提取和处理方面存在障碍。

在处理 Excel 时可能会遇到各种 Excel 文件格式，从现代的 .xlsx 到旧版的.xls 或宏启用版的 .xlsm 文件，每种格式都需要不同的解析方法和库。跨工作表或单个工作表内的数据不一致进一步使过程复杂化。非标准文件通常缺乏统一性，呈现不同的列顺序、不一致的日期格式或列内混合的数据类型，需要强大的错误处理和数据验证机制。

合并单元格对解析算法来说尤其成问题，因为它们可以跨越多行或多列，使数据关联变得复杂。必须编写程序逻辑来准确处理这些合并区域。隐藏的行、列或工作表增加了另一层复杂性，需要彻底检查整个工作簿以确保完整的数据提取。

为应对这些挑战，必须开发稳健、灵活的解析解决方案。这通常涉及结合多种方法，例如使用专门的 Excel 解析库、为特定文件结构实现自定义逻辑，以及采用机器学习技术对半结构化数据进行模式识别。

## 预处理

在分块前处理合并单元格、复杂公式和非表格数据。这些属于预处理。

### 合并单元格问题

在对 Excel 进行分块之前，必须先把「合并单元格导致的信息缺失」消除，否则嵌入时会出现 NaN 或空字符串，严重影响检索召回。

### 为什么要先处理合并单元格？

我们以一个 “功能清单.xlsx” 为例：

-   读取时只保留左上角值：无论 openpyxl 还是 pandas.read\_excel，合并区域内除左上角外其余格值会被置空 。
-   行级分块会丢字段：合并了“模块名称”或“子系统”的行，在转换成文本时会缺列，导致检索无法定位 。
-   RAG 检索依赖元数据：若模块名丢失，metadata\_filter 将失效，回答准确率显著下降（内部测试下降 15–25 pp）。

### 解决方案

思路：

1.  利用 ws.merged\_cells.ranges 拿到所有合并区域
2.  读取左上角值，遍历填充到区域内每个单元格。
3.  调用 ws.unmerge\_cells() 取消合并，再保存临时文件供 pandas / Unstructured 后续处理。

```python
from openpyxl import load_workbook

def explode_merged_cells(path_in: str, path_out: str):
    wb = load_workbook(path_in)
    for ws in wb.worksheets:
        for rng in list(ws.merged_cells.ranges):           # 复制，以免迭代中修改
            ws.unmerge_cells(str(rng))                     # 先解除，否则无法写值
            tl_cell = ws[rng.min_row][rng.min_col - 1]     # 左上角 Cell
            for r in range(rng.min_row, rng.max_row + 1):
                for c in range(rng.min_col, rng.max_col + 1):
                    ws.cell(r, c).value = tl_cell.value
    wb.save(path_out)

```

核心 API 参考：unmerge\_cells() 、merged\_cells

## Chunking 策略

我手头有一些《功能清单》 和 《工时评估表》 就以这些文件为例，讨论一下具体的 chunking 策略，具体来说，是使用 **两级分块**

### 什么是“两级分块”？

两级分块本质固定：父 = 模块/功能域，子 = 行记录。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi/001-a923c989.png)

Azure 官方指南将这种把大块再拆子块的做法称作“层次化 chunking/hierarchical chunking”，可与 Auto-Merging Retrieval 等检索算法天然配合

-   功能清单与工时评估表本质是一条条功能点记录；行级粒度最能保持“一问就能命中一行”的高精检索。
-   单纯行级又易丢失上下文，例如“所属子系统”；用业务模块字段先聚合可在召回时带来更丰富的背景。
-   如果某模块非常大，使用递归切分（递归字符或 token 限长）可以在不破坏结构的情况下继续拆分。

具体来说是：模块 → 行 先聚后拆，更适合 Excel 表中已有明确模块列、需要用向量库分区或 metadata 过滤的系统

处理流程上务必：

1.  先处理合并单元格
2.  行文本带列名
3.  metadata 保留 module 字段，以便精准过滤与 Auto-Merging 聚合。 而元数据的处理（模块、行号、sheet 名），决定了查询过滤与答案上下文的可控性。

## 详细说明

两级分块中的 父和子，具体来说是：“摘要型父块 + 行级子块”

### 父块

-   父块的存在价值在于提供业务背景 + 索引锚点。比如 “模块 A：支付结算；记录 426 行” 。
-   父块采用“header + 小块”策略

**为什么父块可只包含结构信息？**

-   父块不包含子行信息，因为子块检索命中后，通过父 ID 回溯获得模块级上下文，提高回答完整度。
-   在层次化 (hierarchical) 分块体系里，“父块 (parent document)” 的核心职责是让检索器知道一批子块属于哪 个业务语境，而不是存放子块的全文内容。
-   通常父块只保存模块级背景（例如模块名、描述、记录数等），不再内嵌每一行子块的具体文本；这样既保上下文，又避免重复嵌入

**代码：父块仅含结构信息的实现**

```python

import pandas as pd
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

df = pd.read_excel("functions_flat.xlsx", engine="openpyxl")

# ➊ 生成父块——只保背景
parent_docs = [
    Document(page_content=f"模块名称: {m}\n总记录数: {len(sub)}",
             metadata={"module": m, "level": "parent"})
    for m, sub in df.groupby("模块")
]

# ➋ 生成子块——行文本
row_docs = []
for _, row in df.iterrows():
    md = "\n".join(f"**{c}**: {v}"for c, v in row.items())
    row_docs.append(Document(page_content=md,
                             metadata={"module": row['模块'], "level": "child"}))

# ➌ 可选：对子块再递归切分，确保 <2048 chars
splitter = RecursiveCharacterTextSplitter(chunk_size=2048, chunk_overlap=256)
child_chunks = splitter.split_documents(row_docs)

```

ParentDocumentRetriever 在检索时会先命中 child\_chunks，随后自动用父 ID 把对应模块摘要拼回上下文。如需“关键列拼接”模式，只需把 row[['ID','Name']] 等字段 join 到父块内容。

### 子块

在“模块 → 行”层次化分块里，子块（child chunk）就是把 Excel 中“一行业务记录”转成能让向量检索与 LLM 都看得懂的最小语义单元。它既要携带行内全部有效信息，又不能冗余到超出模型窗口。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi/002-53406af0.png)

子块典型 Markdown／JSON 结构：

```json
## 模块: 支付结算
**功能ID**: PAY-001  
**功能名称**: 创建收款单  
**功能类型**: 核心  
**COSMIC FP**: 6  

{
  "module": "支付结算",
  "功能ID": "PAY-001",
  "功能名称": "创建收款单",
  "功能类型": "核心",
  "COSMIC_FP": 6
}

```

推荐生成流程（代码片段）:

```python
import pandas as pd
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

df = pd.read_excel("functions_flat.xlsx", engine="openpyxl")

child_docs = []
for idx, row in df.iterrows():
    module = row["模块"]
    # —— 1) 行→Markdown
    body = "\n".join(f"**{c}**: {v}"for c, v in row.items())
    # —— 2) 写入 Document
    child_docs.append(
        Document(
            page_content=f"# 模块: {module}\n{body}",
            metadata={
                "module": module,
                "row_id": idx + 2,           # Excel 行号（含表头补1）
                "sheet": "功能清单"
            }
        )
    )

# 3) 控制长度，避免超窗口
splitter = RecursiveCharacterTextSplitter(
    chunk_size=2048, chunk_overlap=256
)
child_chunks = splitter.split_documents(child_docs)

```

### 标题行

-   行级子块一定写列名-值对
-   父块按需保存一次表头或仅存摘要

### 父子块生成策略

在 Excel → 向量库的 RAG 管道里，最省事、也最被 LangChain/LlamaIndex/Haystack 等工具链推荐的做法，就是 “**在同一遍遍历中同时生成父块和子块，并用 module 或 parent\_id 把两者关联起来**”。这样既避免二次扫描，又保证所有子块天生带着正确的父信息，检索器便能先召回精确的行级子块，再顺着指针把对应的模块级父块自动补进上下文，实现“精召回 + 背景补全”的最佳组合。

**一遍循环生成父子块的核心流程**

步骤 0：展开合并单元格 用 openpyxl 的 unmerge\_cells 把合并区域拆开，再把左上角值填满整块；或用 pandas.ffill() 向下补齐。这样每行都能拿到正确的 模块 字段

步骤 1：遍历行 → 同时产出父块与子块

```python
import pandas as pd
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

df = pd.read_excel("functions_flat.xlsx", engine="openpyxl").ffill()
parent_seen, parents, children = {}, [], []
splitter = RecursiveCharacterTextSplitter(chunk_size=2048, chunk_overlap=256)  # 控长:contentReference[oaicite:7]{index=7}

for idx, row in df.iterrows():
    mod = row["模块"]              # ① 遇到新模块先建父块
    if mod notin parent_seen:
        parent_seen[mod] = Document(
            page_content=f"模块: {mod}",
            metadata={"module": mod, "level": "parent"}
        )
        parents.append(parent_seen[mod])

    body = "\n".join(f"**{c}**: {v}"for c, v in row.items())  # ② 行→Markdown，保留列名
    child = Document(
        page_content=body,
        metadata={
            "module": mod,
            "parent_id": id(parent_seen[mod]),   # 或直接存 module
            "row": idx + 2
        }
    )
    children.extend(splitter.split_documents([child]))         # 行过长再递归切

```

-   父块 只存简短摘要（如模块名、记录数），避免重复嵌入。
-   子块 带齐列名-值对、行号及父引用，保证可追溯。社区经验贴也强调“列名+值”比裸值更利于语义检索

步骤 2：写入向量库 只向量化 子块，将 module 作为 partition key 或 metadata。父块可放旁路索引，或与子块一同存但不做向量化。

步骤 3：检索时自动拼接 用 LangChain ParentDocumentRetriever、LlamaIndex AutoMergingRetriever 或 Haystack Auto-Merging Retriever：

1.  先做向量检索拿到 k 个子块；
2.  按 parent\_id/module 查父块；
3.  拼 “父摘要 + 命中子块(±近邻)” 送入 LLM。

### 检索流程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi/003-b232c26a.png)

-   过滤：查询时先用 filter={"module": <候选模块>} 做向量库精搜；Milvus 文档示例说明 filtered search 会先裁剪候选集再做 ANN，比全库检索快 2-4×
-   Auto-Merging：若一次命中同模块多行，LlamaIndex/Haystack 会把这些行和父摘要合并，避免窗口碎片化

### 注意事项

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-06-06-rag-chunk-zhi-excel-wen-dang-jie-xi/004-cf4ee85b.png)

## 其他 chunking 策略

-   基于工作表和基于行的分块
-   基于列的拆分
-   混合与滑动窗口技术

## 用于 Excel 分块的工具和库

### pandas

Python 的 pandas 库是许多 Excel 处理任务的核心，为读取 Excel 文件提供了强大的分块支持。 read\_excel() 函数的 chunksize 参数允许进行内存高效、固定大小的分块

### openpyxl

对于更复杂的 Excel 结构，openpyxl 库提供了对 Excel 文件解析的粒度控制，使其适用于基于内容的分块方法，能够有效处理合并单元格、公式和其他非标准元素。

### xlrd

xlrd 库虽然主要针对较旧的.xls 格式，但对于遗留系统仍然具有相关性，并提供快速解析功能，在混合分块方法中，当速度至关重要时，这些功能非常有用。
