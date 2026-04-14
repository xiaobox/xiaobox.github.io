---
title: "开源大模型项目，助你效率提高 10 倍"
slug: 2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei
description: "随着 AI 的普及，大家使用 AI 工具的时间越来越长了，尤其因为有了像 GPT-4o 和 Claude 这样"
date: 2024-07-20T10:43:30.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/cover.jpg
original_url: https://mp.weixin.qq.com/s/8xrfsphFffyGEu2p6k4SWA
categories:
  - AI
tags:
  - Python
  - JavaScript
  - LLM
  - ChatGPT
  - Claude
  - RAG
---
随着 AI 的普及，大家使用 AI 工具的时间越来越长了，尤其因为有了像 GPT-4o 和 Claude 这样强大的 LLM。

今天，我将介绍 21 个开源 LLM 项目，它们可以帮助你构建令人兴奋的内容，并将人工智能集成到你的项目中。

## Vanna - 与你的数据库聊天

> “
> 
> 和你的数据库聊天( 利用 大模型和 RAG 技术将文本转换为 SQL 语句)

Vanna 是一个获得 MIT 许可的开源 Python RAG（检索增强生成）框架，用于 SQL 生成。

基本上，它是一个 Python 包，它使用检索增强来帮助你使用 LLMs 为数据库生成准确的 SQL 查询语句。

于像不太喜欢写 SQL 的开发人员来说它是完美的 ！

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/001-637e59cd.png)

Vanna 的工作过程分为两个简单的步骤

-   在你的数据上训练 RAG model
-   提问，返回 SQL 语句。这些 SQL 语句可以设置为在你的数据库上自动运行。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/002-a4bb36e5.png)

你不需要知道这整个东西是如何工作的就可以使用它。

你只需 `train` 一个存储一些元数据的模型，然后将其用于 `ask` 问题。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/003-0c3c1f35.png)

使用以下命令开始：

```
pip install vanna

```

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

，时长00:40

0/0

00:00/00:40

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:40

00:40

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

开源大模型项目，助你效率提高 10 倍

观看更多

Original

,

开源大模型项目，助你效率提高 10 倍

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

他们构建了用户界面，包括 Jupyter Notebook 和 Flask。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/004-dc1f65f9.png)

## Khoj - 你的人工智能第二大脑

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/005-3a8ada8d.png)

Khoj 是一款开源的人工智能搜索助手。无需筛选在线结果或自己的笔记，即可轻松获得答案。

Khoj 可以理解你的 Word、PDF、org-mode、markdown、纯文本文件、GitHub 项目，甚至 Notion 页面。

它有桌面应用程序、Emacs 软件包、Obsidian 插件、Web 应用程序。Obsidian 和 Khoj 可能是最强大的组合！

你可以使用以下命令在几分钟内开始在本地使用 Khoj。

```
pip install khoj-assistant
khoj

```

一些令人兴奋的功能：

-   可以分享你的笔记和文档以扩展你的数字大脑
-   人工智能代理可以访问互联网，让你能够整合实时信息
-   基于文档获得快速、准确的语义搜索
-   代理可以塑造深刻的个人形象并理解你的话，例如，你说：“根据我的兴趣，创作一幅我梦想之家的图片” 它就会画出这个：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/006-91412059.png)

它在 GitHub 上有 12k star，并得到了 YCombinator 的支持。

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

，时长00:33

0/0

00:00/00:33

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:33

00:33

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

开源大模型项目，助你效率提高 10 倍

观看更多

Original

,

开源大模型项目，助你效率提高 10 倍

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

## Flowise - 拖放 UI 来构建您的自定义 LLM 流程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/007-5e3c3881.png)

Flowise 是一款开源 UI 可视化工具，用于构建定制的 LLM 编排流程和 AI 代理。

可以使用以下 npm 命令在几分钟内开始使用 Flowise：

```bash
npm install -g flowise
npx flowise start
OR
npx flowise start --FLOWISE_USERNAME=user --FLOWISE_PASSWORD=1234

```

以下是集成 API 的方式：

```python
import requests

url = "/api/v1/prediction/:id"

def query(payload):
  response = requests.post(
    url,
    json = payload
  )
  return response.json()

output = query({
  question: "hello!"
)}

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-20-kai-yuan-da-mo-xing-xiang-mu-zhu-ni-xiao-l-ti-gao-10-bei/008-72bf61ca.png)

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

，时长00:17

0/0

00:00/00:17

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:17

00:17

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

开源大模型项目，助你效率提高 10 倍

观看更多

Original

,

开源大模型项目，助你效率提高 10 倍

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)
