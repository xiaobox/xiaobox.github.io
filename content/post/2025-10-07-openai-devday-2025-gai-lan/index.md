---
title: "OpenAI DevDay [2025] 概览"
slug: 2025-10-07-openai-devday-2025-gai-lan
date: 2025-10-07T04:46:54.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/cover.jpg
original_url: https://mp.weixin.qq.com/s/VF5qc3o622V3uu0Pq61yUA
categories:
  - AI
tags:
  - ChatGPT
  - Agent
  - MCP
---
> 来源：https://openai.com/devday/   本文我们针对 DevDay[2025] 中涉及的以下内容进行简要介绍

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/001-42653644.png)

# Apps in ChatGPT

Apps in ChatGPT 是 OpenAI 推出的一种新型交互式应用程序，用户可以直接在 ChatGPT 平台内通过自然语言与这些应用进行对话，从而提升创作、学习和生产力。

## 交互式应用集成

用户可以直接在 ChatGPT 对话中与新一代的应用程序进行交互。可以通过直接呼叫应用名称或在相关情境下由 ChatGPT 推荐来启动这些应用。这些应用拥有可在聊天中直接使用的交互式界面。

## 自然语言启动

用户可以通过自然语言指令来使用应用。

例如，直接对 Spotify 说 “**Expedia  帮我订一张明天从北京飞往东京的机票**”。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/002-d6e3e14e.png)

例如，直接对 Canva 说: “**Canva 请帮我做一个宠物商店的海报，要明亮背景**”。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/003-31044252.png)

## 开发者工具 (Apps SDK)

OpenAI 发布了新的 Apps SDK（应用程序开发工具包）预览版，让开发者可以开始构建这些应用。该 SDK 是一个基于模型上下文协议（MCP）的开放标准。

Apps SDK 是开源的，文档和示例可在 https://developers.openai.com/apps-sdk 获取。对开发者来说，可触达超过 8 亿 ChatGPT 用户，并在未来实现变现。

## 首批合作伙伴

●首批上线的应用来自 Booking.com、Canva、Coursera、Expedia、Figma、Spotify 和 Zillow 等合作伙伴。

●即将推出的合作伙伴包括 AllTrails、Peloton、OpenTable、Target、theFork、Uber 等，今年晚些时候上线。它们涵盖了旅行、食物外卖、教育、健身、零售和本地服务等类别，旨在使 ChatGPT 成为处理日常任务的更通用平台。

## 安全与隐私

所有应用都必须遵守 OpenAI 的使用政策。在用户首次使用某款应用时，系统会提示用户进行连接，并明确告知哪些数据可能会被共享。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/004-747704c5.png)![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/005-8f4bc3f1.png)

## 未来规划

未来，OpenAI 计划将应用推广到商业版、企业版和教育版 ChatGPT，并开放应用提交通道，建立专门的应用目录。同时，还将公布关于应用变现的更多细节

# AgentKit

AgentKit 是一套完整工具集，旨在帮助开发者和企业构建、部署和优化代理（agents）。它解决了代理开发中的碎片化问题，如复杂的编排、自定义连接器和手动评估管道。

## 工作原理

AgentKit 提供了一套集成工具，用于简化创建和管理代理的过程。它包括视觉和编程界面，用于设计工作流、嵌入聊天体验以及评估性能，支持拖拽节点、版本控制和自动化优化。

## 主要功能

### Agent Builder

视觉画布，用于创建和版本化多代理工作流，支持拖拽节点、预览运行、内联评估配置，以及预构建模板。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/006-948e0346.png)

可通过 https://platform.openai.com/agent-builder/edit 访问使用。

●截至 2025 年 10 月 7 日（当前日期），Agent Builder 暂不收费。计费将于 2025 年 11 月 1 日开始，在此之前不会产生任何费用。 这意味着在 beta 期间，你可以免费使用它，但使用过程中涉及的 API 调用（如调用模型）会按照标准 API 定价计算（不过目前整体免计费）。

●从 11 月 1 日起，Agent Builder 的使用将基于 API 模型的查询定价，例如 GPT-4o 的搜索定价从每千查询 30 美元起。 定价和功能可能在从 beta 转向正式可用时调整。

#### 与 n8n 、Dify 的区别

以下表格对比三者的核心差异：

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/007-db6054ad.png)

Agent Builder 确实像 n8n 的 “克隆” 版，更注重 OpenAI 内部优化，而 n8n 更通用、集成强；Dify 则更 AI 导向，与 Agent Builder 在代理开发上最相似，但独立于 OpenAI。 如果用过 n8n 或 Dify，切换到 Agent Builder 可能很顺手，但取决于是否需要 OpenAI 的模型深度集成。Coze 危！

### Connector Registry

中央管理面板，用于管理 OpenAI 产品中的数据和工具连接，包括预构建连接器如 Dropbox、Google Drive、Sharepoint 和 Microsoft Teams，以及第三方 MCP。

### ChatKit

> 不用自己建聊天 UI，就能做出专业级助手。和 OpenAI 的其他工具无缝连用。

从整体定位看，ChatKit 作为 AgentKit 的一部分，专注于前端聊天界面的快速集成，降低了开发者构建 AI 驱动聊天应用的门槛。它强调无缝嵌入现有产品中，支持从简单聊天到复杂代理工作流的扩展，特别适合企业级应用。

**简单说就是帮你快速在网站或 App 里加一个聊天窗口，让用户能和 AI 聊天办事。它不是从零自己写代码，而是像搭积木一样，轻松嵌入现有的产品里。想象一下，你想在你的网站上加个 AI 助手，能帮用户问问题、上传文件、甚至调用其他工具解决问题 ——ChatKit 就是干这个的。**

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/008-051c36cd.png)

怎么用？

ChatKit 有两种用法：

1.简单方式（推荐）：用 OpenAI 的 “Agent Builder”（另一个工具，像画图一样设计 AI 的工作流程）先搭好后端逻辑，然后把 ChatKit 嵌入前端。OpenAI 帮你管服务器，不用自己操心。

2.高级方式：如果你想自己控制一切，用 Python 代码在自家服务器跑 ChatKit，后端连你自己的 AI 系统。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/009-ae03502c.png)

核心是，它提供现成的聊天界面：用户输入文字、上传文件，AI 回应，还能显示 AI 的 “思考过程”（比如一步步推理），让一切更透明。

**搭建步骤**

更详细内容参考：https://platform.openai.com/docs/guides/chatkit

1.先搭 AI ：用 Agent Builder 设计 AI 的 “工作流程”（比如，如果用户问天气，就调用天气工具）。这步生成一个 ID。

2.设置聊天窗口：在你的服务器上创建 “会话”（用代码生成一个安全令牌），然后在网站前端安装 ChatKit 的 React 组件（一种网页代码框架）。加几行代码，就能看到聊天框了。

3.优化调整：试用后，改改外观、加自定义按钮，或优化 AI 的提示语，让它更聪明

### Evals Capabilities

新功能包括数据集、跟踪评分、自动化提示优化，以及第三方模型支持，用于测量和改进代理性能。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/010-c85280b0.png)

### Reinforcement Fine-Tuning (RFT)

自定义工具调用和自定义评分器，用于增强模型推理，在 OpenAI o4-mini 上可用，并在 GPT-5 的私有 beta 中。

# Sora 2  API

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/011-b127300b.png)

Sora2 API 发布了，可以这样接入：

```python
⚡ python片段from openai import OpenAI

openai = OpenAI()

video = openai.videos.create(
    model="sora-2",
    prompt="A video of a cool cat on a motorcycle in the night",
)

print("Video generation started:", video)

```

目前发布了两个模型：

●sora-2

●sora-2-pro

区别是：

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/012-c931a597.png)

总的来说，如果你只是玩玩或赶工，选 Sora 2；想出精品，Pro 更值。 两者都通过 API 或 app 用，内容有严格限制。

## 使用指南

1.提交任务：用 POST /videos 接口发请求，带上模型（sora-2）、提示语、尺寸（如 1280x720）和时长（如 8 秒）。它会给你一个任务 ID。

2.检查进度：用 GET /videos/{id} 轮询状态，或者设置 webhook（一种自动通知）来收完成或失败的消息。

3.写好提示：要具体！比如描述镜头类型、主体、动作、场景和光线。比如：“广角镜头，一个小孩在草地公园放红风筝，金色夕阳光线，镜头慢慢向上摇。”

4.内容限制：适合 18 岁以下观众，不能用版权角色或音乐，不能生成真人（包括名人），输入图片不能有脸（以后可能有例外）。

5.用图片开头：可以上传图片作为第一帧，支持 JPEG、PNG、WebP 格式，但尺寸要匹配。

6.改视频（Remix）：用已生成的视频 ID 和新提示，针对性调整，比如改颜色或加元素。最好一次只改一件事，避免乱套

# Codex 正式版发布

全球开发者爱用它，包括初创公司如 Duolingo 和 Vanta，大厂如 Cisco 和 Rakuten。甚至 OpenAI 自己内部，几乎所有工程师都靠它干活，比 7 月时多了 50%，每周合并的代码拉取请求（PR）多了 70%，几乎每个 PR 都自动审一遍。

主要新功能有：

●Slack 集成：直接在 Slack 频道或线程里扔任务，比如 “帮我修这个 bug”，它自动拉上下文、选环境、云端干活，然后发链接给你 —— 想合并代码或本地改，就点开继续。超方便，不用切工具。

●Codex SDK：一个工具包，能把 Codex 嵌入你的自定义流程、App 或脚本里（现在支持 TypeScript，更多语言快来了）。它优化了结构化输出和上下文管理，还带 GitHub Action，帮你塞进 CI / CD 管道（比如自动测试代码）。

●管理员工具：给企业用户的新面板，能管环境、监控使用、看分析仪表盘。比如删云环境、设安全默认值、跟踪 CLI/IDE/网页的使用情况。让大团队规模化用得安心。

从 2025 年 10 月 6 日起，ChatGPT Plus、Pro、Business、Edu 和 Enterprise 用户都能用 Slack 集成和 SDK。管理员工具限 Business、Edu 和 Enterprise。从 10 月 20 日起，云任务开始算使用量（之前免费）。

# GPT-5 Pro

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-07-openai-devday-2025-gai-lan/013-2edd2556.png)

GPT-5 Pro 是 OpenAI 的 GPT-5 系列的一个 “加强版” 模型，专为处理难题设计的。它用更多计算资源 “多想一会儿”，输出更准、更靠谱。不同于普通版，它只通过 Responses API 用，支持多轮对话和未来高级功能。现在（2025 年 10 月）正式可用。

核心能力：

●上下文窗口大：能记住 40 万个 token 的上下文（相当于超长对话），输出最多 27.2 万 token（长文没问题）。

●支持模式：文字输入输出都行，图片只能输入（比如分析图），音频和视频暂不支持。

●推理模式：默认 “高强度思考”（reasoning.effort: high），带推理 token 支持，让它一步步推导问题。

●工具集成：能上网搜、搜文件、生成图片，还支持 MCP（模型控制面板）。但不支持代码解释器、电脑操作、流式输出、微调或蒸馏。

●其他：支持函数调用和结构化输出，适合复杂任务。

总之，它像个 “深度思考者”，不光聊天，还能帮你解难题，但专注文字和图片。

定价:

●文字 token：输入 $15/百万 token，输出 $120/百万 token（贵！比 GPT-5 的 $1.25/百万输入贵多了）。

●其他：工具调用额外收费，详情看定价页。比 o3-pro（输入 $20）也贵，适合高价值任务。

# GPT-Realtime-Mini

GPT-Realtime-Mini 是 OpenAI 的一个 “轻量级” 实时 AI 模型，简单说就是个能快速聊天的 “语音助手”，专为低成本、实时互动设计。它能听你说话（或看图片）、实时回复文字或语音，适合建语音 App、客服机器人或游戏对话。

核心能力

●实时互动：通过 WebRTC、WebSocket 或 SIP 连接，处理音频 / 文本输入，瞬间输出回应。像视频通话里的 AI 伙伴。

●支持的东西：文本（输入/输出）、图像（只输入，比如描述图片）、音频（输入/输出，比如语音转文字或合成语音）。视频不支持。

●记忆力：上下文窗口 32,000 tokens（够聊长对话），最大输出 4,096 tokens。

●知识截止：到 2023 年 10 月 1 日（老了点，新事得靠工具补）。

●其他：有 “快照” 版本，能锁住模型不乱变。没高级玩意儿如函数调用、结构化输出、微调或预测。

定价（按百万 tokens）：

●文本：输入 $0.60，缓存输入 $0.06，输出 $2.40。

●音频：输入 $10，缓存 $0.30，输出 $20。

●图像：输入 $0.80，缓存 $0.08。 总的贵在音频上，但比大模型便宜。

# GPT-Image-1-Mini

GPT-Image-1-Mini 是 OpenAI 推出的一款 “经济实惠版” 图像生成模型，能用文字描述或现有图片快速生成或编辑图像。它是 GPT Image 1 的 “小弟”，更便宜、更高效，适合开发者嵌入到 App 里，比如设计工具或内容平台，不用花大钱就能玩转 AI 画图。

核心能力：

●生成新图：输入文字提示，就能吐出高质图片。比如 “一个可爱的猫咪在太空飞翔”，它会懂上下文，画出逼真或搞怪的图。

●编辑旧图：支持 “补画”（inpainting），用面具遮住部分区域改内容，比如加东西、删元素或换颜色。还能用参考图复制风格，确保一致性。

●输入输出：进货是文字 + 图片，出货是新图像。能调质量（低中高）、尺寸（比如 1024×1024 或长宽 1024×1536），还有 “输入保真度” 控制输出多像原图。

定价按 “token” 算（图像也转 token），超便宜：

●文字输入：$2 / 百万 token。

●图像输入（编辑用）：$2.50 / 百万 token。

●图像输出：$8 / 百万 token。 实际一图成本：1024×1024 的低质只要 $0.005，中 $0.011，高 $0.036；大尺寸稍贵点，到 $0.052。比大模型便宜多了！
