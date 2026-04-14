---
title: "提升RAG应用性能：使用智谱AI的GLM-4和Embedding-3模型优化文档检索"
slug: 2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4
date: 2024-10-08T07:59:17.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/cover.jpg
original_url: https://mp.weixin.qq.com/s/dP1sBSjUVz91BKCBZrsSQg
categories:
  - AI
tags:
  - LLM
  - ChatGPT
  - RAG
  - DeepSeek
  - Embedding
  - 网络
---
## 回顾

上文 [提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489761&idx=1&sn=949b3880cfd5c66ee4596c9f1803a420&chksm=eb6da767dc1a2e71f894da379278995c0af04f22eb0137d8b1cee2c6c54ecd712b83ff15f169&scene=21#wechat_redirect) 我们介绍了如何通过 DeepSeek 的 API 调用 `DeepSeek v2.5` 模型 替换通过 Ollama 调用本地下载好的 `Qwen2.5` 模型。

这样做的目的是想通过 API 调用远程部署好的 LLM 给我们的 RAG 应用提提速。不然由于本地个人电脑计算资源的不足（我的电脑没有 GPU）会导致 RAG 应用运行缓慢。

在我们的 RAG 应用中分别使用了两个模型 ，一个是 `embedding` 模型，它的作用有这么几点：

1.  文档嵌入（Document Embedding）

-   **表示文档**：将文档转换为高维向量（embeddings），这些向量能够捕捉文档的语义信息。
-   **相似度计算**：通过计算查询和文档嵌入之间的相似度，找到与查询最相关的文档。

3.  查询嵌入（Query Embedding）

-   **表示查询**：将用户的查询转换为高维向量，这些向量能够捕捉查询的语义信息。
-   **检索相关文档**：通过计算查询嵌入和文档嵌入之间的相似度，找到与查询最相关的文档

5.  文档检索（Document Retrieval）

-   **高效检索**：通过向量数据库（如 Faiss、Annoy 等），快速找到与查询最相关的文档。
-   **相关性排序**：根据相似度得分对检索到的文档进行排序，选择最相关的文档作为生成回答的依据。

7.  生成回答（Answer Generation）

-   **融合信息**：将检索到的相关文档与查询结合，生成高质量的回答。
-   **上下文感知**：利用检索到的文档作为上下文，生成更加准确和丰富的回答。

其中第 4 点，要结合 LLM 来完成。所以这也是我们在 RAG 应用中使用第二个模型--大语言模型（LLM） 的意义。

我们再通过回顾 2 张图片来比较直观地了解下 `embedding` 和 `LLM` 在 RAG 中的作用：

-   embedding 过程

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/001-8736f38f.png)

-   RAG

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/002-08ef5269.png)

## 问题

上文遗留的问题很明显，因为我们需要使用的 2 个模型通过 DeekSeek 的 API 只替换了其中的`LLM`，而 `embedding` 模型仍然用的是本地的。没有替换是因为 DeepSeek 的 API 不支持：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/003-94f77b14.png)

引自 deepseek 文档

虽然我们下载的 `embedding` 模型 `BAAI/bge-base-zh-v1.5` 比较小巧，在本地运行的速度也还行，但我还是想试一下调用远程部署好的更大更优秀的 `embedding` 模型后会怎样？

于是我将目光转向了另一个很知名，同样很优秀的国产 AI 公司 `智谱 AI`

## 智谱 AI

这两年 AI 的发展如火如荼，以 ChatGPT 为代表的一众 AIGC 应用深入人心，这些应用的背后都少不了大语言模型的支持。然而对于国内用户使用这些产品仍然有门槛。大家不禁想找到一个能打的国产 AI 产品。

去年秋天我还在迷信 ChatGPT 的能力是“宇宙无敌”，直到我体验了 智谱 AI 旗下的 `智谱清言` 我才觉得国产 AI 产品在中文语料下的能力并不比别人差。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/004-4b36a375.png)

智谱是由清华大学计算机系技术成果转化而来的公司。它的发展很快。目前可供用户使用的各类模型 20 余个。其中包括：

-   大规模语言模型 GLM-4
-   视频生成模型 CogVideoX
-   代码模型 CodeGeeX-4
-   图片生成模型 CogView-3
-   嵌入式模型 Embedding-3
-   ......

智谱在开源领域也做出了极大贡献，上面列举的这些模型都能在 HuggingFace 或 GitHub 上找到开源的版本。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/005-9ff700e7.png)

智谱 AI 最让我们熟悉的产品是其 C 端 AIGC 产品 `智谱清言`

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/006-479e5fdd.png)

**在中文语料下，它的问答质量不比 GPT-4 差！**

## LlamaIndex 集成 Zhipu embedding

通过查看智谱 AI 大模型开放平台的文档得知它有两款 `embedding` 模型可以通过 API 调用

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/007-050f1b24.png)

于是决定将 `Embedding-3` 试着集成到 LlamaIndex 中。

当然，调用 API 首先你要有 API Key 以及可用的 tokens，这个我们在之前的文章我介绍过，一般是需要付费的，智谱 AI 会给新老用户赠送一些 tokens，之前赠送给了我 1000w tokens ，所以下面的示例我就用这些免费的 tokens。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/008-3bbf3053.png)

### 简单 demo

我们先根据文档写一个最简单的模型调用 demo

```python
from zhipuai import ZhipuAI
import os

client = ZhipuAI(api_key=os.getenv("GLM_4_PLUS_API_KEY"))
response = client.embeddings.create(
    model="embedding-3",
    input=[
        "美食非常美味，服务员也很友好。",
        "这部电影既刺激又令人兴奋。",
        "阅读书籍是扩展知识的好方法。",
    ],
)
print(response)

```

它响应的输出是这样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/009-ba223053.png)

这输出的一片数字是啥？

这里简单解释一下：**嵌入是将文字、图像或其他类型的数据转换成一系列数字（向量）的过程。这个向量在高维空间中代表了原始数据的语义信息。你看到的那一长串数字（如 -0.019210815, -0.0023460388, 0.010299683 等）就是嵌入向量的具体值。每个数字代表向量在某个维度上的值，这些数字虽然看起来没有明显意义，但它们在高维空间中编码了输入文本的语义信息。相似的文本会产生相似的向量，这使得我们可以进行语义相似度比较。这种表示方法使得机器能够更好地"理解"和处理文本数据。**

能够正常输出，代表模型调用成功。

### 和 LlamaIndex 集成

在之前的文章中我们已经通过 Custom LLM 的方式将 LlamaIndex 和 GLM-4 集成在一起了，也就是在 RAG 应用中使用的框架是 LlamaIndex ，调用 的 LLM 是 GLM-4。

同理，现在我们要把 `embedding` 模型也同 LlamaIndex 集成起来，这样我们自己写的这个 RAG 应用的技术组合就是 `RAG = LlamaIndex +GLM-4 + Embedding-3`

和 LLM 一样，在 LlamaIndex 文档的 embedding 模型兼容列表中并没有 Zhipu 的 Embedding-3 ，仍然需要通过自定义的方式来实现。

这是文档中给的自定义 embedding 的例子：

```python
from typing import Any, List
from InstructorEmbedding import INSTRUCTOR
from llama_index.core.embeddings import BaseEmbedding

class InstructorEmbeddings(BaseEmbedding):
    def __init__(
        self,
        instructor_model_name: str = "hkunlp/instructor-large",
        instruction: str = "Represent the Computer Science documentation or question:",
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)
        self._model = INSTRUCTOR(instructor_model_name)
        self._instruction = instruction

        def _get_query_embedding(self, query: str) -> List[float]:
            embeddings = self._model.encode([[self._instruction, query]])
            return embeddings[0]

        def _get_text_embedding(self, text: str) -> List[float]:
            embeddings = self._model.encode([[self._instruction, text]])
            return embeddings[0]

        def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
            embeddings = self._model.encode(
                [[self._instruction, text] for text in texts]
            )
            return embeddings

        async def _get_query_embedding(self, query: str) -> List[float]:
            return self._get_query_embedding(query)

        async def _get_text_embedding(self, text: str) -> List[float]:
            return self._get_text_embedding(text)

```

仔细看的话，实际上只需要实现 2 个方法即可，下面的方法都会调用这两个方法：

```
        def _get_query_embedding(self, query: str) -> List[float]:
            embeddings = self._model.encode([[self._instruction, query]])
            return embeddings[0]

        def _get_text_embedding(self, text: str) -> List[float]:
            embeddings = self._model.encode([[self._instruction, text]])
            return embeddings[0]

```

这里我们可以新建一个自定义的 embedding 类：

```
class ZhipuEmbeddings(BaseEmbedding):
    client: ZhipuAI = Field(default_factory=lambda: ZhipuAI(api_key=API_KEY))

    def __init__(
        self,
        model_name: str = "embedding-3",
        **kwargs: Any,
    ) -> None:
        super().__init__(model_name=model_name, **kwargs)
        self._model = model_name

    def invoke_embedding(self, query: str) -> List[float]:
        response = self.client.embeddings.create(model=self._model, input=[query])

        # 检查响应是否成功
        if response.data and len(response.data) > 0:
            return response.data[0].embedding
        else:
            raise ValueError("Failed to get embedding from ZhipuAI API")

    def _get_query_embedding(self, query: str) -> List[float]:
        return self.invoke_embedding(query)

    def _get_text_embedding(self, text: str) -> List[float]:
        return self.invoke_embedding(text)

    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        return [self._get_text_embedding(text) for text in texts]

    async def _aget_query_embedding(self, query: str) -> List[float]:
        return self._get_query_embedding(query)

    async def _aget_text_embedding(self, text: str) -> List[float]:
        return self._get_text_embedding(text)

    async def _aget_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        return self._get_text_embeddings(texts)

```

在利用 LlamaIndex 调用时，将 `embed_model` 设置为自定义类就可以了：

```
  # 设置 LLM 和嵌入模型
    Settings.llm = GLM4LLM()
    Settings.embed_model = ZhipuEmbeddings()

```

这样我们的 RAG 应用就把智谱 AI 的 GLM-4 和 Embedding-3 一起使用上了。

以下是完整代码：

```python
import os
import sys
import logging
from zhipuai import ZhipuAI
from typing import Any, List
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.core.embeddings import BaseEmbedding
from llama_index.core.llms import (
    CustomLLM,
    CompletionResponse,
    CompletionResponseGen,
    LLMMetadata,
)
from llama_index.core.llms.callbacks import llm_completion_callback
from dotenv import load_dotenv
from functools import cached_property
from pydantic import Field

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 从环境变量获取 API 密钥
load_dotenv()

API_KEY = os.getenv("GLM_4_PLUS_API_KEY")
if not API_KEY:
    raise ValueError("GLM_4_PLUS_API_KEY environment variable is not set")

class GLM4LLM(CustomLLM):
    @cached_property
    def client(self):
        return ZhipuAI(api_key=API_KEY)

    @property
    def metadata(self) -> LLMMetadata:
        return LLMMetadata()

    def chat_with_glm4(self, system_message, user_message):
        response = self.client.chat.completions.create(
            model="glm-4-plus",
            messages=[
                {
                    "role": "system",
                    "content": system_message,
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
            stream=True,
        )
        return response

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        response = self.chat_with_glm4("你是一个聪明的 AI 助手", prompt)
        full_response = "".join(
            chunk.choices[0].delta.content
            for chunk in response
            if chunk.choices[0].delta.content
        )
        return CompletionResponse(text=full_response)

    @llm_completion_callback()
    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        response = self.chat_with_glm4("你是一个聪明的 AI 助手", prompt)

        def response_generator():
            response_content = ""
            for chunk in response:
                if chunk.choices[0].delta.content:
                    response_content += chunk.choices[0].delta.content
                    yield CompletionResponse(
                        text=response_content, delta=chunk.choices[0].delta.content
                    )

        return response_generator()

class ZhipuEmbeddings(BaseEmbedding):
    client: ZhipuAI = Field(default_factory=lambda: ZhipuAI(api_key=API_KEY))

    def __init__(
        self,
        model_name: str = "embedding-3",
        **kwargs: Any,
    ) -> None:
        super().__init__(model_name=model_name, **kwargs)
        self._model = model_name

    def invoke_embedding(self, query: str) -> List[float]:
        response = self.client.embeddings.create(model=self._model, input=[query])

        # 检查响应是否成功
        if response.data and len(response.data) > 0:
            return response.data[0].embedding
        else:
            raise ValueError("Failed to get embedding from ZhipuAI API")

    def _get_query_embedding(self, query: str) -> List[float]:
        return self.invoke_embedding(query)

    def _get_text_embedding(self, text: str) -> List[float]:
        return self.invoke_embedding(text)

    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        return [self._get_text_embedding(text) for text in texts]

    async def _aget_query_embedding(self, query: str) -> List[float]:
        return self._get_query_embedding(query)

    async def _aget_text_embedding(self, text: str) -> List[float]:
        return self._get_text_embedding(text)

    async def _aget_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        return self._get_text_embeddings(texts)

# 设置环境变量，禁用 tokenizers 的并行处理
os.environ["TOKENIZERS_PARALLELISM"] = "false"

def run_glm4_query_with_embeddings(query: str):
    # 从指定目录加载文档数据
    documents = SimpleDirectoryReader("data").load_data()

    # 设置 LLM 和嵌入模型
    Settings.llm = GLM4LLM()
    Settings.embed_model = ZhipuEmbeddings()

    # 创建索引和查询引擎
    index = VectorStoreIndex.from_documents(documents)
    query_engine = index.as_query_engine(streaming=True)

    # 执行查询
    print("GLM-4 查询结果：")
    response = query_engine.query(query)

    # 处理并输出响应
    if hasattr(response, "response_gen"):
        # 流式输出
        for text in response.response_gen:
            print(text, end="", flush=True)
            sys.stdout.flush()  # 确保立即输出
    else:
        # 非流式输出
        print(response.response, end="", flush=True)

    print("\n 查询完成")

```

## 效果

从最终的使用效果上看，速度上不如之前使用本地 embedding 模型 `BAAI/bge-base-zh-v1.5` 快。因为执行了多次 Http 远程调用：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/010-bbb38cab.png)

所以我又查了一下文档看看有没有办法提提速：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-08-ti-sheng-rag-ying-yong-xing-neng-shi-yong-zhi-pu-ai-de-glm-4/011-79b38b4b.png)

虽然有一个 `dimensions` 参数，虽然我感觉设置的越小维度越小数据也越少，那么速度可能更快，但实际测试下来速度并没有明显变化 。其主要原因还是：它是**同步调用的**

看来从 API 上没办法提速了，只能在编程模型上想办法了，这里就不多说了。这里我认为，**最好的方式还是在一个资源充足的服务器中部署一个开源的 embedding 模型 ，这样方便模型的微调及不限量的调用。速度也会快许多**

## 最后

我已将文章中涉及到的相关代码上传至 ：https://github.com/xiaobox/llamaindex\_test

这个仓库中包含了最新几篇文章中的所有 demo 代码，大家可以自行查看。
