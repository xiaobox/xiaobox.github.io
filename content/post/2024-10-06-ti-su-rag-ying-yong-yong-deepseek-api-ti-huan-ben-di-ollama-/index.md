---
title: "提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析"
slug: 2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-
description: "本文我们将介绍，如何通过调用国产大模型 DeepSeek 的 API 为我们的 RAG 应用提速，我们将把对本地 Ollama 的模型调用替换成对 DeepSeek API 的调用。"
date: 2024-10-06T13:27:10.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/cover.jpg
original_url: https://mp.weixin.qq.com/s/FpYIqgBLWowgkk36UMVaFg
categories:
  - AI
tags:
  - Python
  - LLM
  - RAG
  - DeepSeek
  - Embedding
  - 网络
---
## 概述

在上一篇文章中 [如何用 30秒和 5 行代码写个 RAG 应用？](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247489727&idx=1&sn=9ff0ec14a1a9c2aa0d52c3ad452b1f03&chksm=eb6da739dc1a2e2f913495acae29cce5460115b6f0a8ad0833d3aac0138c6249e4edc231b771&scene=21#wechat_redirect)，我们介绍了如何利用 LlamaIndex 结合 Ollama 的本地大模型和在 Hugging Face 开源的 embedding 模型用几行 Python 代码轻松构建一个 RAG 应用。

从最终输出的结果上看是满意的，理论上是可以针对本地的知识库内容进行精准的问答。然而执行效率却不尽人意。原因是：无论 LLM 还是 embedding 模型的调用都是在本地，而我本地电脑的性能确属一般（几乎只能利用到 CPU 资源，没有 GPU 资源），这样就导致代码运行速度缓慢。

本文我们将介绍，如何通过调用国产大模型 DeepSeek 的 API 为我们的 RAG 应用提速，我们将把对本地 Ollama 的模型调用替换成对 DeepSeek API 的调用。

对比一下上文和本文的方案：

-   上文：LlamaIndex + `Ollama(Qwen2:7b)`+ embedding（BAAI/bge-base-zh-v1.5）
-   本文：LlamaIndex + `DeepSeek API` + embedding（BAAI/bge-base-zh-v1.5）

## DeepSeek

首先来明确几个问题

### 为什么不用 OpenAI 的 API？

当然可以，而且 LlamaIndex 默认支持的就是通过 API Key 访问 OpenAI 的 API。**问题是成本太高了，有更高性价比的所以不用它。**

### DeepSeek 是什么 ？

DeepSeek 这个词在不同的上下文中有不同的含义，为了避免概念和语义的混淆，我们在这里分别说明一下：

-   **DeepSeek 代表一个公司**：杭州深度求索人工智能基础技术研究有限公司，专注于大模型研发、AI 技术创新和企业解决方案，是幻方量化的子公司。

-   **DeepSeek 代表一个大语言模型** ：具有 236B 参数量（2360 亿个参数）的开源大语言模型。严格上讲，DeepSeek 不只是一个单一的模型，而是包含多个针对不同任务和应用场景的模型系列，这些模型在 DeepSeek 的基础上进行了专门的优化和训练，以满足特定的需求，如：`DeepSeek-Chat`、 `DeepSeek-Math`、`DeepSeek-Coder` 等。

-   **DeepSeek 是一个 API**: 由 DeepSeek 公司开发对外提供付费的大模型功能的接口，支持文本生成、对话系统、文本摘要、问答系统和多模态任务等。

在本文中，我们利用 DeepSeek 的 API 间接调用 DeepSeek 所提供的模型，具体模型是 `DeepSeek V2.5`(*DeepSeek V2 Chat 和 DeepSeek Coder V2 两个模型已经合并升级，升级后的新模型为 DeepSeek V2.5*)

### 为什么用 DeepSeek ？

**使用 DeepSeek 主要出于成本和效果的综合考虑。**

虽然 DeepSeek 是开源大模型（在大模型领域，类似这样的国产中文开源大模型还有许多），但是部署这样的具有大规模参数的模型是需要很多硬件资源的，我们手上的个人电脑没有这个条件。更别说运维和微调这样的模型。所以通过 API 直接调用已经部署好的模型是最便捷的方式，当然，这是有成本的，人家部署和运维这样规模的模型也是需要成本的，所以这些 API 是需要付费使用的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/001-61cee938.png)

**从成本考量**，DeepSeek 几乎是最佳方案，因 DeepSeek API 调用价格之便宜曾被戏称为 “AI 界的拼多多”。在 DeepSeek 价格公开后不久，多家模型厂商卷入价格战，现在的模型调用价格是真真正正的被 “打下来”了。多家公司频繁更新自家模型价格，截止目前，可以说 “没有最低，只有更低”。

**从效果考量** ，因之前使用过 `deepseek-coder`、和 `deepseek-chat` 两个模型，效果上可以说是在中文模型领域的第一梯队。当然这只是我个人的使用体验。

从权威的角度，通过 `LMSYS Chatbot Arena Leaderboard`（LMSYS Chatbot Arena Leaderboard 是一个大型语言模型的评测排行榜，提供了一个匿名竞技场，用于评估和比较不同模型的性能。） 这个大型语言模型的评测排行榜可以了解 DeepSeek 的能力如何

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/002-46276e80.png)

最近的几个月里，国产模型中与 DeepSeek 排名竞争最激烈的是阿里的 `Qwen2.5`

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/003-f209b64f.png)

### DeepSeek 的使用费用

前文中我们提到 DeepSeek 的 API 是需要付费调用的，所以到底收多少钱是一个关键的问题。

首先，如果你是一个新用户，那么 **DeeepSeek 会送你 500w 个 tokens** （在自然语言处理中，Token 是指将文本分割成的最小单位。这些单位可以是单词、子词、字符等，具体取决于所使用的分词策略）。简单理解就是 500w 个字。需要注意的是，送的 tokens 有有效期，一个月后就过期了。

其次，如果送的 tokens 用完了，就需要花真金白银去充值了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/004-64228f9f.png)

简单说， **10 元 500w tokens**，如果你是个人使用，一个人放开了用，一个月足够了。

### DeepSeek API 的使用

无论是通过赠送还是付费，当你拥有了 tokens，你就可以根据文档创建自己的 API key 并进行 API 调用了。

由于是走网络 API 的这种方式，在编程语言上就没有限制了，你可以选用你觉得合适的语言。DeepSeek 官方也比较贴心的给出了各种语言调用的示例：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/005-205fb89f.png)

这里我用 `Python` 写了一个简单的调用 Demo， 以下是具体代码：

```python
from openai import OpenAI

class DeepSeekChat:
    def __init__(self, api_key, base_url="https://api.deepseek.com"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)

    def chat(
        self,
        system_message,
        user_message,
        model="deepseek-chat",
        max_tokens=1024,
        temperature=0.7,
        stream=True,
    ):

        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream,
        )

        if stream:
            return self._stream_response(response)
        else:
            return response.choices[0].message.content

    def _stream_response(self, response):
        full_response = ""
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                print(content, end="", flush=True)
                full_response += content
        
        print("\r\n===============我是分隔线===============")
        return full_response

# 使用示例
if __name__ == "__main__":
    deepseek_chat = DeepSeekChat(api_key="[你的 API Key]")
    response = deepseek_chat.chat(
        system_message="你是一个聪明的 AI 助手",
        user_message="三国演义中战斗力排名前 10 的武将有谁？",
        stream=True,
    )
    print("完整回答：", response)

```

可以看到我们只引入了 openai  这一个库，原因是 DeepSeek 的 API 和 OpenAI 的 API 是兼容的。

> “
> 
> DeepSeek API 使用与 OpenAI 兼容的 API 格式，通过修改配置，您可以使用 OpenAI SDK 来访问 DeepSeek API，或使用与 OpenAI API 兼容的软件。
> 
> ```
>                                          --源自 DeepSeek 文档
> ```

引入 openai 这个库以后我们不需要再引入其他多余的库就可以进行 API 请求了。

这段代码比较简单，我的问题是 ：“三国演义中战斗力排名前 10 的武将有谁？” 我们来看一下大模型给我的回答：

已关注

Follow

Replay Share Like

Close

**观看更多**

更多

*退出全屏*

[](javascript:;)

*切换到竖屏全屏**退出全屏*

小盒子的技术分享已关注

[](javascript:;)

Share Video

，时长00:19

0/0

00:00/00:19

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:19

00:19

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析

观看更多

Original

,

提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

## RAG

在上一篇文章中我们能够方便地调用 Ollama 进而调用本地下载好的模型，是因为 LlamaIndex 的库封装好了：

```
# 设置语言模型，使用 Ollama 提供的 Qwen2 7B 模型，并设置请求超时时间
Settings.llm = Ollama(model="qwen2:7b", request_timeout=360.0)

```

现在，我们想用在线的模型 DeepSeek，让 LlamaIndex 去调用 DeepSeek API 就不能用之前的方式了。

### LlamaIndex 支持的 LLM 集成方式

通过查看 LlamaIndex 的文档，总结来说，它支持的 LLM 集成方式有三种：

-   通过 Ollama 调用安装在本地的大模型（一般适用于个人电脑使用）
-   通过 API 调用的免费或付费模型
-   自定义 LLM

我们需要解释一下：

-   **第一种方式**  : Ollama 无需多言。

-   **第二种方式** : API 付费调用不是所有市面上的模型 LlamaIndex 都有现成的集成方式，比如 DeepSeek 就没有，具体支持集成哪些模型，在它的文档中有清单：https://docs.llamaindex.ai/en/stable/module\_guides/models/llms/modules/ 另外，对于付费模型，模型背后的公司都会提供相应的 API，付费购买就可以了，而开源模型虽然本身代码是开源的，但提供模型调用服务的平台是收费的，比如 `Replicate`

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-06-ti-su-rag-ying-yong-yong-deepseek-api-ti-huan-ben-di-ollama-/006-80d17203.png)

    也就是说**第二种方式无论你使用的模型本身是否开源，提供模型调用服务的平台都会收费。**

-   **第三种方式**：自定义 LLM，本文我们使用的就是这种方式 ，这种集成实现方式是 LlamaIndex 留给开发者的一个扩展，我们可以自定义自己需要使用的 LLM 与 LlamaIndex 进行集成。使用这种方式可以实现两类集成：

-   第一类就是类似 DeepSeek 这种已经有 API 但 LlamaIndex 尚未支持的 LLM。
-   第二类就是调用我们本地部署的开源大模型，当然一般是部署在服务器上（如果 PC 有足够的计算资源也可以部署在 PC 上）

### Custom LLM

如何通过 Custom LLM 的方式将 DeepSeek 与 LlamaIndex 进行集成呢？

其实很容易，我们只需要创建一个类并实现三个方法即可（用 python 代码实现）。

文档中给出的代码是这样的：

```python
from typing import Optional, List, Mapping, Any

from llama_index.core import SimpleDirectoryReader, SummaryIndex
from llama_index.core.callbacks import CallbackManager
from llama_index.core.llms import (
    CustomLLM,
    CompletionResponse,
    CompletionResponseGen,
    LLMMetadata,
)
from llama_index.core.llms.callbacks import llm_completion_callback
from llama_index.core import Settings

class OurLLM(CustomLLM):
    context_window: int = 3900
    num_output: int = 256
    model_name: str = "custom"
    dummy_response: str = "My response"

    @property
    def metadata(self) -> LLMMetadata:
        """Get LLM metadata."""
        return LLMMetadata(
            context_window=self.context_window,
            num_output=self.num_output,
            model_name=self.model_name,
        )

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        return CompletionResponse(text=self.dummy_response)

    @llm_completion_callback()
    def stream_complete(
        self, prompt: str, **kwargs: Any
    ) -> CompletionResponseGen:
        response = ""
        for token in self.dummy_response:
            response += token
            yield CompletionResponse(text=response, delta=token)

# define our LLM
Settings.llm = OurLLM()

# define embed model
Settings.embed_model = "local:BAAI/bge-base-en-v1.5"

# Load the your data
documents = SimpleDirectoryReader("./data").load_data()
index = SummaryIndex.from_documents(documents)

# Query and print response
query_engine = index.as_query_engine()
response = query_engine.query("<query_text>")
print(response)

```

OurLLM 就是要创建的类，要实现的三个方法是：

-   metadata
-   complete
-   stream\_complete

实际上一般 metadata 方法可以直接返回  `LLMMetadata()` ，最主要的就是实现后面两个方法。

### 实例

根据上一节 Custom LLM 所述，我将上一篇文章中的 Ollama 模型调用换成自定义的 DeepSeek，以下是主要代码：

```python
import os
import sys
import logging
from openai import OpenAI
from typing import Any, Generator
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.llms import (
    CustomLLM,
    CompletionResponse,
    CompletionResponseGen,
    LLMMetadata,
)
from llama_index.core.llms.callbacks import llm_completion_callback
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from functools import cached_property

# 配置日志 创建一个与当前模块同名的 logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 从环境变量获取 API 密钥
load_dotenv()

API_KEY = os.getenv("DEEPSEEK_API_KEY")
if not API_KEY:
    raise ValueError("DEEPSEEK_API_KEY environment variable is not set")

class DeepSeekChat(BaseModel):
    """DeepSeek 聊天模型的封装类。"""

    api_key: str = Field(default=API_KEY)
    base_url: str = Field(default="https://api.deepseek.com")

    class Config:
        """Pydantic 配置类。"""

        arbitrary_types_allowed = True  # 允许模型接受任意类型的字段
        # 这增加了灵活性，但可能降低类型安全性
        # 在本类中，这可能用于允许使用 OpenAI 客户端等复杂类型

    @cached_property
    def client(self) -> OpenAI:
        """创建并缓存 OpenAI 客户端实例。"""
        return OpenAI(api_key=self.api_key, base_url=self.base_url)

    def chat(
        self,
        system_message: str,
        user_message: str,
        model: str = "deepseek-chat",
        max_tokens: int = 1024,
        temperature: float = 0.7,
        stream: bool = False,
    ) -> Any:
        """
        使用 DeepSeek API 发送聊天请求。

        返回流式响应或完整响应内容。
        """
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message},
                ],
                max_tokens=max_tokens,
                temperature=temperature,
                stream=stream,
            )
            return response if stream else response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in DeepSeek API call: {e}")
            raise

    def _stream_response(self, response) -> Generator[str, None, None]:
        """处理流式响应，逐块生成内容。"""
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

class DeepSeekLLM(CustomLLM):
    """DeepSeek 语言模型的自定义实现。"""

    deep_seek_chat: DeepSeekChat = Field(default_factory=DeepSeekChat)

    @property
    def metadata(self) -> LLMMetadata:
        """返回 LLM 元数据。"""
        return LLMMetadata()

    @llm_completion_callback()
    def complete(self, prompt: str, **kwargs: Any) -> CompletionResponse:
        """执行非流式完成请求。"""
        response = self.deep_seek_chat.chat(
            system_message="你是一个聪明的 AI 助手", user_message=prompt, stream=False
        )
        return CompletionResponse(text=response)

    @llm_completion_callback()
    def stream_complete(self, prompt: str, **kwargs: Any) -> CompletionResponseGen:
        """执行流式完成请求。"""
        response = self.deep_seek_chat.chat(
            system_message="你是一个聪明的 AI 助手", user_message=prompt, stream=True
        )

        def response_generator():
            """生成器函数，用于逐步生成响应内容。"""
            response_content = ""
            for chunk in self.deep_seek_chat._stream_response(response):
                if chunk:
                    response_content += chunk
                    yield CompletionResponse(text=response_content, delta=chunk)

        return response_generator()

# 设置环境变量，禁用 tokenizers 的并行处理，以避免潜在的死锁问题
os.environ["TOKENIZERS_PARALLELISM"] = "false"

def main():
    """主程序函数，演示如何使用 DeepSeekLLM 进行文档查询。"""
    # 从指定目录加载文档数据
    documents = SimpleDirectoryReader("data").load_data()

    # 设置 LLM 和嵌入模型
    Settings.llm = DeepSeekLLM()
    Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-zh-v1.5")

    # 创建索引和查询引擎
    index = VectorStoreIndex.from_documents(documents)
    query_engine = index.as_query_engine(streaming=True)

    # 执行查询
    print("查询结果：")
    response = query_engine.query("作者学习过的编程语言有哪些？")

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

if __name__ == "__main__":
    main()

```

你别看代码写的长，那是因为我做过重构，其实可以实现的更短。不要被篇幅吓到，其实主要执行逻辑与上一篇文章中写的没什么区别，只在自定义 DeepSeekLLM 这里有所不同，如果你把本文从头看到尾，其实其中的第一步分解拆开都有解释过，也比较简单。

我们来看一下效果，测试数据仍然是上一篇文章中的文本内容，问题仍然是 ：“作者学习过的编程语言有哪些？”

已关注

Follow

Replay Share Like

Close

**观看更多**

更多

*退出全屏*

[](javascript:;)

*切换到竖屏全屏**退出全屏*

小盒子的技术分享已关注

[](javascript:;)

Share Video

，时长00:09

0/0

00:00/00:09

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:09

00:09

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析

观看更多

转载

,

提速 RAG 应用：用 DeepSeek API 替换本地 Ollama 模型，LlamaIndex 实战解析

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

## 总结

本文我们介绍了如何通过调用国产大模型 `DeepSeek` 的 API 来提升 `RAG`（检索增强生成）应用的执行效率。相比使用本地 Ollama 模型，DeepSeek 的 API 不仅解决了本地计算资源不足导致的运行速度慢的问题，还保持了高质量的生成结果。DeepSeek 在成本和效果上表现出色，特别适合中文模型的应用。通过自定义 LLM 的方式，我们成功将 DeepSeek 与 `LlamaIndex` 集成，展示了如何实现高效的数据处理和生成。本文提供的方法和示例代码为构建高性能 RAG 应用提供了一种实用的解决方案。
