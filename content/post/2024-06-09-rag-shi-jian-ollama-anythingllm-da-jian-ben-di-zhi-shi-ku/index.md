---
title: "RAG 实践-Ollama+AnythingLLM 搭建本地知识库"
slug: 2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku
description: "什么是 RAGRAG，即检索增强生成（Retrieval-Augmented Generation），是一种先"
date: 2024-06-09T02:14:14.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/cover.jpg
original_url: https://mp.weixin.qq.com/s/yadECo4Mtug-5GrRPoybeQ
categories:
  - AI
tags:
  - Docker
  - Linux
  - macOS
  - LLM
  - RAG
  - LangChain
  - 架构
---
## 什么是 RAG

RAG，即检索增强生成（Retrieval-Augmented Generation），是一种先进的自然语言处理技术架构，它旨在克服传统大型语言模型（LLMs）在处理开放域问题时的信息容量限制和时效性不足。RAG的核心机制融合了信息检索系统的精确性和语言模型的强大生成能力，为基于自然语言的任务提供了更为灵活和精准的解决方案。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/001-b94d34ad.png)

### RAG与LLM的关系

RAG不是对LLM的替代，而是对其能力的扩展与升级。传统LLM受限于训练数据的边界，对于未见信息或快速变化的知识难以有效处理。RAG通过动态接入外部资源，使LLM得以即时访问和利用广泛且不断更新的知识库，进而提升模型在问答、对话、文本生成等任务中的表现。此外，RAG框架强调了模型的灵活性和适应性，允许开发者针对不同应用场景定制知识库，从而满足特定领域的需求。

下图是 RAG 的一个大致流程：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/002-6e702258.png)

RAG就像是为大型语言模型（LLM）配备了一个即时查询的“超级知识库”。这个“外挂”不仅扩大了模型的知识覆盖范围，还提高了其回答特定领域问题的准确性和时效性。

想象一下，传统的LLM像是一个博学多才但记忆力有限的学者，它依赖于训练时吸收的信息来回答问题。而RAG，则是这位学者随时可以连线的庞大图书馆和实时资讯网络。当面临复杂或最新的查询时，RAG能让模型即时搜索并引用这些外部资源，就像学者翻阅最新的研究资料或在线数据库一样，从而提供更加精准、全面和最新的答案。这种设计尤其适用于需要高度专业化或快速更新信息的场景，比如医学咨询、法律意见、新闻摘要等。

基于此，RAG 技术特别适合用来做个人或企业的本地知识库应用，利用现有知识库资料结合 LLM 的能力，针对特定领域知识的问题能够提供自然语言对话交互，且答案比单纯用 LLM 准确性要高得多。

## 实践

### 现成方案

现成的方案有很多，比如：

-   https://www.53ai.com/news/gerentixiao/1889.html
-   https://github.com/chatchat-space/Langchain-Chatchat
-   https://www.anjhon.top/llms-mac-local-rag
-   https://github.com/1Panel-dev/MaxKB?tab=readme-ov-file
-   https://www.youtube.com/watch?v=Gh4plFSbW8M
-   https://qanything.ai/

本文将采用  `Ollama + Qwen2.5 +AnythingLLM` 来实现本地知识库

### Ollama 大法

Ollama 与 LLM 的关系可以这样理解：Ollama 本身不是 LLM，而是一个服务于 LLM 的工具。它提供了一个平台和环境，使得开发者和研究人员能够在本地机器上轻松地运行、测试和部署各种大型语言模型

github:https://github.com/ollama/ollama

### 下载安装 Ollama 和大模型

下载地址：https://www.ollama.com/download ，支持 Windows、Mac、Linux。

当然你也可能用 Docker 安装镜像，官方镜像 https://hub.docker.com/r/ollama/ollama更多细节请参考 github 的 Readme:https://github.com/ollama/ollama

当你运行 `ollama --version` 命令成功查询到版本时，表示 Ollama 的安装已经顺利完成。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/003-f4eec502.png)

接下来便可以用 `pull` 命令从在线模型库下载模型，比如：

`ollama pull llama2   `

还有更简单的方法直接使用 `run` 命令，它会在 运行之前自动检查模型是否下载，如果没有会自动下载

`ollama run llama3   `

但是我想搭建的是本地知识库，当然是以中文为主，所以需要对中文支持最好的模型，但是：

Ollama官方提供的模型，对中文支持好的不多，比较好的有：

-   Llama2-Chinese：基于Llama2微调。搜“Chinese”关键词就能找到。
-   Qwen 1.5：阿里的通义千问。一共有6个尺寸，默认是4b。所有尺寸的模型都支持32K的上下文长度。多语言支持。

本想用 智谱的 GLM（ https://huggingface.co/THUDM/chatglm3-6b ），奈何不兼容 Ollama，也没有 `GGUF` 格式文件，于是作罢。巧的是阿里的 `通义Qwen2`模型刚刚开源，正好可以试一下。

> “
> 
> 阿里开源了通义Qwen2模型，可以说是现阶段这个规模最强的开源模型。发布后直接在 Huggingface LLM 开源模型榜单获得第一名，超过了刚发布的 Llama3 和一众开源模型。Qwen2在代表推理能力的代码和数学以及长文本表现尤其突出。推理相关测试及大海捞针测试都取得了很好的成绩。
> 
> 模型概览：Qwen 2 模型组成包括 Qwen2-0.5B、Qwen2-1.5B、Qwen2-7B、Qwen2-57B-A14B和Qwen2-72B。其中Qwen2-57B-A14B为 MoE 模型。
> 
> 模型在中文、英文语料基础上，训练数据中增加了27种语言相关的高质量数据；增大了上下文长度支持，最高达到128K tokens（Qwen2-72B-Instruct）。多个评测基准上的领先表现；代码和数学能力显著提升。
> 
> ”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/004-889f33a8.png)

顺序介绍一下中文大模型，可能通过这个仓库了解：https://github.com/HqWu-HITCS/Awesome-Chinese-LLM

安装并运行 Qwen2 模型，注意这里由于我笔记本配置问题，所以选用的是 `7B` 参数的模型

`ollama run qwen2:7b      `

模型下载的默认路径是：`/Users/${home}/.ollama/models`

以下是我机器的配置，mac intel芯片

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/005-2bb115f2.png)

安装完成后就可以对话了:

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/006-51b62329.png)

#### open web UI

通过命令行交互的方式不算太友好，所以我们需要一个好看好用的 UI 界面来与模型进行交互。

Open Web UI 就是这样一个软件 https://github.com/open-webui/open-webui ，它通过Docker 可以非常容易的进行部署

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/007-999db614.png)

部署完成后，这样使用是不是就友好多了？

但由于我们是要搭建一个个人本地知识库，需要对知识库有更多的掌控，Open Web UI 有些不满足需要，所以我们要用另一个软件。

### AnythingLLM

我们先下载安装 AnythingLLM :https://useanything.com/download

完成安装后大概长这个样子：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/008-9b6de114.png)

然后我们就要开始选择模型了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/009-01cb2396.png)

这里注意，我们要用服务器模式启动 Ollama，Ollama其实有两种模式：

1.  聊天模式
2.  服务器模式

所谓服务器模式，你可以简单理解为，Ollama在后端运行大模型，然后开放一个端口给到别的软件，让那些软件可以调用大模型的能力。要开启服务器模式非常简单。在终端里输入：`ollama serve`

用服务器模式启动 Ollama 后：

-   在AnythingLLM界面中选择  `Ollama`
-   然后在 Base URL中填：http://127.0.0.1:11434
-   模型选择之前下载的 Qwen2.5 7b
-   Token context window 可以先用默认的 4096

完成以上设置后来到下一步

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/010-89529b0e.png)

搭建一个知识库，会涉及到另外两个关键：

1.  Embedding Model，嵌入模型。它负责把高维度的数据转化为低维度的嵌入空间。这个数据处理过程在RAG中非常重要。
2.  Vector Store，向量数据库，专门用来高效处理大规模向量数据。

上图中就是默认的嵌入模型以及向量数据库，我们先使用默认的。

-   然后往下走，下一步是填写个人信息，这步我就省略了。
-   再下一步是给你的 workspace 起名，我也省略

接着你就可以在建好的 workspace 中上传你的个人知识库的内容了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/011-9c8de8fa.png)

你可以上传文件（支持多种格式 pdf word...），甚至是一个外部的网站链接，不太好的是它不能上传一个文件夹，如果你的文件夹是包含多级目录的，那么它无法识别，你需要把所有文件平铺放在同一级目录中再全选上传。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/012-394fc666.png)

数据源也可以是其他知识网站：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/013-d11dd831.png)

你可以根据项目来创建Workspace，一个项目建一个。然后，把关于这个项目的所有文档、所有网页都导入Workspace。聊天模式还有两种可以设置：

1.  对话模式：大模型会根据你给的文档，以及它本来就有的知识储备，综合起来回答。
2.  查询模式：大模型只是简单地针对文档进行回答。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/014-37b4f49b.png)

比如我随便上传了一个 《劳动合同法》 的 pdf 文件，用查询模式进行对话：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/015-9c28527d.png)

虽然不太对，但内容是从我上传的文件里找到的，还可以点击查看源文件。

我将笔记本中的很多计算机相关的 `markdown` 文件作为“知识” 上传后，进行问答：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-09-rag-shi-jian-ollama-anythingllm-da-jian-ben-di-zhi-shi-ku/016-5280e047.png)

至此，我的本地个人知识库就搭建完成了！

## 参考

-   https://sspai.com/post/85193
-   https://medium.com/@huangyihe/中文大模型-本地运行-b30e14d4d6ac
