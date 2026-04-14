---
title: "如何用 LlamaIndex 实现 agent"
slug: 2024-10-14-ru-he-yong-llamaindex-shi-xian-agent
date: 2024-10-14T10:13:28.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/cover.jpg
original_url: https://mp.weixin.qq.com/s/nyMcn3cR7NNvjf3X4GLerw
categories:
  - AI
tags:
  - Python
  - LLM
  - RAG
  - Agent
  - Prompt
---
## agent 是什么?

打开市面上流行的AIGC应用，agent 几乎是必备的功能。agent到底是什么呢？

我们先从字面意思理解，看看各家公司做的产品是如何定义 agent 的。

**智谱清言** （https://chatglm.cn） 将 agent 定义为 “智能体”![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/001-1241e8d2.png)

**通义千问** （https://tongyi.aliyun.com/）将 agent 定义为 “智能体”![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/002-8cd4c91b.png)

**Kimi** （https://kimi.moonshot.cn/）将 agent 定义为 “私人助理”![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/003-e31f7075.png)

**扣子**（https://www.coze.cn/） 将 agent 定义为 “智能体”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/004-f857fd86.png)

**文心一言** （https://yiyan.baidu.com/）  将 agent 定义为 “智能体” (无图，拿来凑数)

agent 从英文直译过来是 “代理”，但从国内各AIGIC的产品定义来看，**绝大多数公司将 agent 定义为了 “智能体”**

好，我们再进一步，那什么是智能体呢？

从 “智能体” 使用者的角度看，“智能体” 就像专门完成某一类任务的机器人。智能体的设计目的其实就是为了实现特定的目标或完成特定的任务。

它像是一个专家一样，专门解决某一类的问题，用医生做比喻，agent就像一个专科大夫，比如骨科大夫，只能看骨科相关的病，而大模型LLM 像是一个全科大夫，什么病都能看。

从设计上不一样，使用上自然就要有所区别，比如你要处理和计算复杂的数学公式，那么向专门为解决这类问题而设计的 “智能体” 提问就比直接向LLM 提问得到的答案要准确。

## agent 的创建和使用

我们以 智谱清言 举例，下图是在创建 “智能体” 时的设置页面内容，可以看到有不少的配置。这里面，我要说两个重要的配置。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/005-53244300.png)

第一个重要的配置是：“**配置信息**”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/006-3597b827.png)

看上图你是否觉得很熟悉，是的，如果你看过我之前的文章，就会注意到，这不就是 "prompt" 吗？准确地来说是 **system prompt** 和 **role prompt**

所以，在我最初的认识里，agent 或者叫 “智能体” 简直就是一个 "prompt engineering" 的产物，只需要把 “提示词” 写好，就能创建好一个 agent 了。后来，我了解到，提示词工程确实很重要，但 agent 并不是只包括设置提示词 。

除了上图所示的 “联网能力”、“代码能力” 这些显而易见的功能外。另一个重要的配置就是 “**知识库**” 。加上知识库后，实际上这就是一个 RAG 应用了。这会让 agent 本身外挂一个我们自己上传的知识库，让它学习了我们上传的“知识” 后，再接受提问，就可以更准备地做出回答。

## LlamaIndex

### demo

用 LlamaIndex 实现一个简单的 agent demo 比较容易，看一下具体的代码实现：

```python
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llamaindex_demo.custom.custom_llm_glm import GLM4LLM

def multiply(a: float, b: float) -> float:
    """Multiply two numbers and returns the product"""
    return a * b

def add(a: float, b: float) -> float:
    """Add two numbers and returns the sum"""
    return a + b

def main():

    multiply_tool = FunctionTool.from_defaults(fn=multiply)
    add_tool = FunctionTool.from_defaults(fn=add)

    # 使用GLM-4 Plus模型
    llm = GLM4LLM()
    # 创建ReActAgent实例
    agent = ReActAgent.from_tools([multiply_tool, add_tool], llm=llm, verbose=True)

    response = agent.chat("20+（2*4）等于多少？使用工具计算每一步")

    print(response)

if __name__ == "__main__":
    main()

```

LLM 上，我们继续使用之前文章中使用过的 GLM。

我们看一下它的输出

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/007-563ea564.png)

可以看出，它将提问中的计算步骤分别利用了我们自定义的函数 `add` 和 `multiply` ，而不是走大模型。挺有意思的吧，我们可以自定义 agent 中的某些处理流程。**除了使用 prompt 外，我们的控制权更大了。**

### Rag demo

这个 demo 我们来看一下如何把rag 集成到 agent中。也很简单，我们直接上代码：

```python
import os
import sys
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.core.tools import QueryEngineTool
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llamaindex_demo import logger
from llamaindex_demo.custom.custom_llm_glm import GLM4LLM
from llamaindex_demo.custom.custom_embedding_zhipu import ZhipuEmbeddings
from llama_parse import LlamaParse

# 设置环境变量，禁用tokenizers的并行处理
os.environ["TOKENIZERS_PARALLELISM"] = "false"

def toHtml(text: str) -> str:
    """遇到英文单词就用html标签包裹"""
    return re.sub(r"(\b[a-zA-Z]+\b)", r'<span style="color:red;">\1</span>', text)

def run_glm4_query_with_embeddings(query: str):
    # 从指定目录加载文档数据
    documents = SimpleDirectoryReader(input_files=["./data/sample.txt"]).load_data()

    # 设置LLM和嵌入模型
    Settings.llm = GLM4LLM()
    Settings.embed_model = ZhipuEmbeddings()

    # 创建索引和查询引擎 show_progress=True 显示 embedding 进度
    index = VectorStoreIndex.from_documents(documents, show_progress=True)

    query_engine = index.as_query_engine(streaming=True)

    yc_tool = QueryEngineTool.from_defaults(
        query_engine,
        #name="YC 创始人的个人经理",
        #description="关于YC创始人Paul Graham的RAG引擎",
    )

    to_html_tool = FunctionTool.from_defaults(fn=toHtml)

    agent = ReActAgent.from_tools(
        [to_html_tool,yc_tool],
        verbose=True,
    )

    # 执行查询
    logger.info("agent 查询结果：")
    response = agent.chat(query)

    print(response)

    logger.info("\n查询完成")

def main():
    run_glm4_query_with_embeddings("请描述一下作者的求学经历，并将英文用html高亮显示")

if __name__ == "__main__":
    main()

```

可以看到，`yc_tool` 是我们通过加载本地文件自定义的一个RAG 应用，然后我们把它加入到 agent的 from tools中。

以下是加入 RAG 以后的 agent 的输出

```yaml
INFO:llamaindex_demo.config:agent 查询结果：
> Running step 28bfc6bb-5e8a-4d5b-8273-36791b222a90. Step input: 请描述一下作者的求学经历，并将英文用html高亮显示
INFO:httpx:HTTP Request: POST https://open.bigmodel.cn/api/paas/v4/chat/completions "HTTP/1.1 200 OK"
Thought: The current language of the user is: Chinese. I need to use a tool to help me answer the question.
Action: query_engine_tool
Action Input: {'input': '请描述一下作者的求学经历'}
INFO:httpx:HTTP Request: POST https://open.bigmodel.cn/api/paas/v4/embeddings "HTTP/1.1 200 OK"
INFO:httpx:HTTP Request: POST https://open.bigmodel.cn/api/paas/v4/chat/completions "HTTP/1.1 200 OK"
Observation: 作者的求学经历可以概括如下：

1. **研究生阶段**：
   - 作者最初在研究生院学习，但似乎对所选主题（连续性应用程序）并不满意，认为应该选择更有探索空间的宏和嵌入式语言。
   - 作者的主要目标是尽快完成学业，摆脱研究生院。

2. **申请艺术学校**：
   - 在研究生期间，作者同时申请了美国的罗德岛设计学院（RISD）和意大利佛罗伦萨的Accademia di Belli Arti。
   - RISD录取了作者，而Accademia di Belli Arti的回复因邮寄错误延迟。

3. **在RISD的学习**：
   - 作者被RISD视为转学二年级生，需要在夏季完成基础课程，包括绘画、色彩和设计等。
   - 尽管如此，作者在基础课程中表现不错。

......

总体来说，作者的求学经历充满了探索和转变，从研究生院的学术研究到艺术学校的实践学习，再到通过个人项目和工作的经济独立，展现了其对知识和职业发展的不断追求和反思。
> Running step c8f8eee2-ab9b-45c9-a05e-6136f688cae3. Step input: None
INFO:httpx:HTTP Request: POST https://open.bigmodel.cn/api/paas/v4/chat/completions "HTTP/1.1 200 OK"
Thought: The current language of the user is: Chinese. I need to use a tool to help me highlight the English words in the provided text.
Action: toHtml
Action Input: {'text': '作者的求学经历可以概括如下：\n\n1. **研究生阶段**：\n   - 作者最初在研究生院学习，但似乎对所选主题（连续性应用程序）并不满意，认为应该选择更有探索空间的宏和嵌入式语言。\n   - 作者的主要目标是尽快完成学业，摆脱研究生院。\n\n2. **申请艺术学校**：\n   - 在研究生期间，作者同时申请了美国的罗德岛设计学院（RISD）和意大利佛罗伦萨的Accademia di Belli Arti。\n   - RISD录取了作者，而Accademia di Belli Arti的回复因邮寄错误延迟。\n\n3. **在RISD的学习**：\n   - 作者被RISD视为转学二年级生，需要在夏季完成基础课程，包括绘画、色彩和设计等。\n   - 尽管如此，作者在基础课程中表现不错。\n\n4. **意外的Accademia邀请**：\n   - 夏末时，作者意外收到Accademia的入学考试邀请，决定前往佛罗伦萨。\n   - 作者通过节俭生活和之前的咨询工作积蓄，勉强支付了生活和学习的费用。\n\n5. **在Accademia的学习**：\n   - 作者发现Accademia的绘画系存在一种默契，即学生和教职员工互不干涉，维持着19世纪工作室的传统。\n   - 这种教育模式让作者感到失望。\n\n6. **秘密项目与经济独立**：\n   - 在Accademia期间，作者秘密从事《论Lisp》的工作，并获得了出版合同和一笔可观的收入。\n   - 这笔收入帮助作者还清了大学贷款，并积攒了回RISD的费用。\n\n7. **在Interleaf的工作经历**：\n   - 作者在Interleaf公司学到了许多关于科技公司的管理和技术开发的见解。\n   - 最重要的是，作者领悟到“低端吞噬高端”的市场策略。\n\n8. **回到RISD**：\n   - 作者在秋季回到RISD继续学习，发现真正的艺术学校与Accademia没有太大不同。\n   - 作者观察到绘画系的教育相对松散，而其他系如纺织、插画和建筑则更为严格。\n\n总体来说，作者的求学经历充满了探索和转变，从研究生院的学术研究到艺术学校的实践学习，再到通过个人项目和工作的经济独立，展现了其对知识和职业发展的不断追求和反思。'}
Observation: 作者的求学经历可以概括如下：

1. **研究生阶段**：
   - 作者最初在研究生院学习，但似乎对所选主题（连续性应用程序）并不满意，认为应该选择更有探索空间的宏和嵌入式语言。
   - 作者的主要目标是尽快完成学业，摆脱研究生院。

2. **申请艺术学校**：
   - 在研究生期间，作者同时申请了美国的罗德岛设计学院（<span style="color:red;">RISD</span>）和意大利佛罗伦萨的Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> <span style="color:red;">Arti</span>。
   - RISD录取了作者，而Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> Arti的回复因邮寄错误延迟。

3. **在RISD的学习**：
   - 作者被RISD视为转学二年级生，需要在夏季完成基础课程，包括绘画、色彩和设计等。
   - 尽管如此，作者在基础课程中表现不错。

......

总体来说，作者的求学经历充满了探索和转变，从研究生院的学术研究到艺术学校的实践学习，再到通过个人项目和工作的经济独立，展现了其对知识和职业发展的不断追求和反思。
> Running step 649456af-f363-47c9-bd06-3c36d1ff48c6. Step input: None
INFO:httpx:HTTP Request: POST https://open.bigmodel.cn/api/paas/v4/chat/completions "HTTP/1.1 200 OK"
Thought: I can answer without using any more tools. I'll use the user's language to answer.
Answer: 作者的求学经历可以概括如下：

1. **研究生阶段**：
   - 作者最初在研究生院学习，但似乎对所选主题（连续性应用程序）并不满意，认为应该选择更有探索空间的宏和嵌入式语言。
   - 作者的主要目标是尽快完成学业，摆脱研究生院。

2. **申请艺术学校**：
   - 在研究生期间，作者同时申请了美国的罗德岛设计学院（<span style="color:red;">RISD</span>）和意大利佛罗伦萨的Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> <span style="color:red;">Arti</span>。
   - RISD录取了作者，而Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> Arti的回复因邮寄错误延迟。

3. **在RISD的学习**：
   - 作者被RISD视为转学二年级生，需要在夏季完成基础课程，包括绘画、色彩和设计等。
   - 尽管如此，作者在基础课程中表现不错。

......

总体来说，作者的求学经历充满了探索和转变，从研究生院的学术研究到艺术学校的实践学习，再到通过个人项目和工作的经济独立，展现了其对知识和职业发展的不断追求和反思。
作者的求学经历可以概括如下：

1. **研究生阶段**：
   - 作者最初在研究生院学习，但似乎对所选主题（连续性应用程序）并不满意，认为应该选择更有探索空间的宏和嵌入式语言。
   - 作者的主要目标是尽快完成学业，摆脱研究生院。

2. **申请艺术学校**：
   - 在研究生期间，作者同时申请了美国的罗德岛设计学院（<span style="color:red;">RISD</span>）和意大利佛罗伦萨的Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> <span style="color:red;">Arti</span>。
   - RISD录取了作者，而Accademia <span style="color:red;">di</span> <span style="color:red;">Belli</span> Arti的回复因邮寄错误延迟。

3. **在RISD的学习**：
   - 作者被RISD视为转学二年级生，需要在夏季完成基础课程，包括绘画、色彩和设计等。
   - 尽管如此，作者在基础课程中表现不错。

......

总体来说，作者的求学经历充满了探索和转变，从研究生院的学术研究到艺术学校的实践学习，再到通过个人项目和工作的经济独立，展现了其对知识和职业发展的不断追求和反思。
INFO:llamaindex_demo.config:
查询完成

```

可以看出，在它的思考过程中，应用了我们的 `toHtml` 方法，将英文单词就用html标签包裹。

### agent 记忆

agent 还有记忆的功能，也就是说之前问过的问题，它会记得，比如我们在一个流程中发起了多次提问

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-14-ru-he-yong-llamaindex-shi-xian-agent/008-83eba778.png)

agent 不会把每次的提问当做一个独立提问，它是知道上下文的，这就是它的记忆功能。

## 附录

附上之前文章的链接方便查阅：

[如何用 30秒和 5 行代码写个 RAG 应用？](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489727&idx=1&sn=9ff0ec14a1a9c2aa0d52c3ad452b1f03&chksm=eb6da739dc1a2e2f913495acae29cce5460115b6f0a8ad0833d3aac0138c6249e4edc231b771&scene=21#wechat_redirect)

[提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489761&idx=1&sn=949b3880cfd5c66ee4596c9f1803a420&chksm=eb6da767dc1a2e71f894da379278995c0af04f22eb0137d8b1cee2c6c54ecd712b83ff15f169&scene=21#wechat_redirect)

[提升RAG应用性能：使用智谱AI的GLM-4和Embedding-3模型优化文档检索](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489798&idx=1&sn=8794c0b35034bfb950730389c36855bf&chksm=eb6da680dc1a2f96b2606d1957aab9b26e572a62b908aa7a242d0db83d836235595032698cae&scene=21#wechat_redirect)

[Milvus实战：如何用一个数据库提升你的AI项目性能](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489820&idx=1&sn=6972e3d5f214530d3fd52216a7e537a9&chksm=eb6da69adc1a2f8c4d7e51fb01b47d5e87097ee7f5e42193147bca7002710432cd8c8fb15639&scene=21#wechat_redirect)
