---
title: "RAG 实践- Ollama+MaxKB 部署本地知识库"
slug: 2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku
description: "30 分钟内即可上线基于本地大模型的知识库问答系统，并嵌入到第三方业务系统中。"
date: 2024-06-22T09:55:14.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/cover.jpg
original_url: https://mp.weixin.qq.com/s/M333nqovniCj-T80EOyuSg
categories:
  - AI
tags:
  - PostgreSQL
  - Docker
  - LLM
  - RAG
  - 架构
  - 网络
---
## 前言

本文我们介绍另外一种部署本地知识库的方案：

`Ollama + MaxKB`

相对来说，容易安装且功能较完善，30 分钟内即可上线基于本地大模型的知识库问答系统，并嵌入到第三方业务系统中。

缺点是如果你的电脑配置不高，问题回答响应时间较长。

下图为 MaxKB 的产品架构：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/001-08767b01.png)

实现原理上，仍然是应用了 RAG 流程：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/002-4f55ccfd.png)

## 安装 MaxKB

首先我们通过 Docker 安装 MaxKB

`docker run -d --name=maxkb -p 8080:8080 -v ~/.maxkb:/var/lib/postgresql/data cr2.fit2cloud.com/1panel/maxkb   `

注意这里镜像源是 china mainland，走代理的镜像会下载失败。

安装成功后访问：http://localhost:8080/ 登录，初始账号为：

`用户名: admin   密码: MaxKB@123..   `

进入系统后是这样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/003-01b4122a.png)

## 配置模型

接下来我们进行最重要的模型配置

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/004-5751bc9e.png)

可以看到有许多模型的供应商，这里你可以通过 API key 在线去连接大模型

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/005-722d2069.png)

**API key 不同的模型厂商有不同的申请地址，这种方式不是本文采用的方式，本文我们将把通过 Ollama 本地部署的 Qwen2 大模型配置到 MaxKB**

所以，第一步我们添加模型选择 Ollama

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/006-00646cce.png)

第二步配置模型，在模型添加界面有几个点要注意（下图是修改界面，和添加界面差不多）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/007-d7ed64f9.png)

1.  模型名称和基础模型一定要和你在 `ollama list` 中显示的一样，不然可能会导致没有必要的重复下载和连接失败![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/008-ca9df5eb.png)
2.  API 域名，因为 MaxKB 是 Docker 部署的，Ollama 是本机部署的，不在一个网络环境，所以要填 ：http://host.docker.internal:11434
3.  API Key 随便写什么都行

## 创建知识库

模型添加完成，就可以创建知识库了。

这个比较简单，通过界面功能自己就能搞定，我就不多说了![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/009-c0e740af.png)

这里比较好的是，MaxKB 支持选择文件夹，这一点 AnythingLLM 就不行，不过一次上传文件数量有限：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/010-1298aa3c.png)

> “
> 
> 支持格式：TXT、Markdown、PDF、DOCX、HTML 每次最多上传50个文件，每个文件不超过 100MB 若使用【高级分段】建议上传前规范文件的分段标识

## 创建应用

知识库创建完，就可以创建应用进行问答了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/011-c2fb9b46.png)

这里注意除了要为应用添加知识库外，还要进行一下参数设置

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/012-3d44b352.png)

我选择的是第二项，因为我的知识库数据量较小

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/013-61cbad40.png)

设置完成后点击演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/014-76e6c2a8.png)

## 问答效果展示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/015-caa129ab.png)

这里不太好的是没有同时展示引文，更不用说引文的预览了，实际上这个功能基本上是企业应用上的 **刚需**

## 嵌入第三方应用

嵌入三方应用的需求也是比较常见的，比如你可以通过 iframe 或者 js 代码的形式嵌入到你现有的系统中，我们经常看到一些网站右下角的浮窗就是这种形式，在 MaxKB 中支持嵌入三方应用，需要在应用的 “概览” 中点击 “嵌入第三方”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/016-8c062a85.png)

剩下的你只需要把代码集成到你的其他应用中就可以了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-06-22-rag-shi-jian-ollama-maxkb-bu-shu-ben-di-zhi-shi-ku/017-f904d255.png)

## 思考

学习新知识，最好的方式就是直接去应用它，你可能从来都不知道什么是 RAG，但对相关知识有个大概了解后，通过实践，亲自搭建几个可以 run 起来的应用，那些架构里的结构、名词，逐渐全部都能对应得上了。

我笔记本的配置有限，如果所有的东西都部署在配置有性能强较的显卡的服务器上，那么就可以满足企业级应用的需求了，企业可以直接完成私有化部署并开始应用。

## 参考

-   https://github.com/1Panel-dev/MaxKB/wiki
