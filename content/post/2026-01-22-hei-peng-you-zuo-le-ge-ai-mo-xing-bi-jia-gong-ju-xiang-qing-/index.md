---
title: "嘿，朋友，做了个 AI 模型比价工具，想请你来试试"
slug: 2026-01-22-hei-peng-you-zuo-le-ge-ai-mo-xing-bi-jia-gong-ju-xiang-qing-
description: "大家好，我是小盒子。这两年 AI 大模型卷得厉害，GPT-4、Claude、Gemini、Llama……模型眼花缭乱，价格也是五花八门。"
date: 2026-01-22T07:51:40.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-22-hei-peng-you-zuo-le-ge-ai-mo-xing-bi-jia-gong-ju-xiang-qing-/cover.jpg
original_url: https://mp.weixin.qq.com/s/gYtmiZ5DXRUK--Pw8RistQ
categories:
  - AI
tags:
  - Python
  - TypeScript
  - LLM
  - ChatGPT
  - Claude
  - Gemini
  - 架构
  - 网络
---
大家好，我是小盒子。

这两年 AI 大模型卷得厉害，GPT-4、Claude、Gemini、Llama……模型眼花缭乱，价格也是五花八门。作为一个经常要调用 API 的开发者，我经常想搞清楚一个问题：**到底谁家的模型便宜？性价比高的是哪个？**

说实话，每次想比较价格，我都得打开一堆浏览器标签页：AWS Bedrock 的定价页、Azure OpenAI 的价格表、OpenAI 官网、还有 OpenRouter……然后手动对比，算汇率，头都大了。更要命的是，这些价格还时不时更新，上周看的数据，这周可能就变了。

不知道你有没有同感：

●想用 Claude 3.5 Sonnet，但不确定是直接调 Anthropic 便宜，还是走 AWS Bedrock 便宜？

●项目预算有限，想找个便宜点的模型先跑通，但不知道该选谁？

●跟老板汇报要说清楚模型成本，却发现各家的计价单位都不一样，有的按 1K tokens，有的按 1M tokens，换算起来很麻烦？

就因为这些"痛点"，前段时间，我干脆撸起袖子，做了一个工具来解决这个问题。

于是，`Model Price` 就这么诞生了。

它的目标很简单：**把各大 AI 服务商的模型价格聚合到一起，让你一眼就能看清谁便宜、谁贵、性价比如何。**

代码都在这儿了，开诚布公，欢迎随时来坐坐：

●**GitHub:** https://github.com/xiaobox/model-price

●**在线演示:** https://modelprice.boxtech.icu

（要是觉得还行，顺手点个 Star，就是对我最大的肯定。）

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-22-hei-peng-you-zuo-le-ge-ai-mo-xing-bi-jia-gong-ju-xiang-qing-/001-3ae3bd24.png)

* * *

# 这把"锤子"，我花了些心思去打磨

我不想只做个"能看"的工具，我希望它能"好用"，甚至让你"爱用"。所以，在几个关键的地方下了功夫。

## 首先，数据要全

目前 Model Price 覆盖了 **6 家主流 AI 服务商，580+ 个模型**：

| 服务商 | 模型数量 | 数据来源 |
| --- | --- | --- |
| AWS Bedrock | 96+ | 公开 API |
| Azure OpenAI | 50+ | 零售价格 API |
| OpenAI | 53+ | 官网爬虫 |
| Google Gemini | 31+ | 官网爬虫 |
| OpenRouter | 339+ | 公开 API |
| xAI (Grok) | 12+ | 官方文档 |

无论你用的是 GPT-4、Claude 3.5、Gemini Pro 还是 Llama，都能在这里找到对应的价格。

## 其次，数据要准

最让我头疼的就是价格变动。所以我给 Model Price 做了自动数据获取机制：

●对于有公开 API 的服务商（如 AWS、Azure、OpenRouter），直接调接口拿最新数据

●对于没有 API 的服务商（如 OpenAI、Google），用 Playwright 爬虫自动抓取官网定价

这样一来，数据基本能保持实时更新，你不用再担心看到的是过时信息。

## 查找要快

580+ 个模型，如果只能翻页查看，那体验也太差了。所以我加了多维度筛选：

●按**提供商**筛选：只看 OpenAI 的？只看 AWS 的？一键切换

●按**模型系列**筛选：只看 GPT-4 系列？只看 Claude 系列？

●按**能力标签**筛选：支持视觉的？支持音频的？支持 Function Call 的？

●按**价格排序**：从低到高、从高到低

基本上，三秒内就能找到你想要的模型。

## 最后，看着要舒服

我做了两种视图模式：

●**卡片视图**：信息展示更直观，适合浏览

●**表格视图**：数据更紧凑，适合对比

每个模型的价格还有一个小的柱状图，让你一眼就能看出谁贵谁便宜。输入输出价格分开展示，Batch API 价格也有，该有的都有。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-01-22-hei-peng-you-zuo-le-ge-ai-mo-xing-bi-jia-gong-ju-xiang-qing-/002-8abb0741.png)

* * *

# 技术栈，给爱折腾的朋友参考

`Model Price` 的技术选型很主流，方便大家二次开发：

**后端：**

●Python 3.11+

●FastAPI（高性能异步框架）

●Playwright（网页爬虫，用于抓取 OpenAI、Google 官网）

●httpx（异步 HTTP 客户端）

●uv（超快的 Python 包管理器）

**前端：**

●React 18

●TypeScript 5

●Vite（构建工具）

●CSS Variables（主题系统）

代码结构清晰，Provider 采用插件架构，想要接入新的服务商，只需要实现一个 `BaseProvider.fetch()` 方法就行。

* * *

# 这只是个开始

## 想邀请你一起来添砖加瓦

现在 `Model Price` 已经能用了，但它离"完美"还差得很远。一个人的力量终究有限，一个好的开源项目，生命力在于社区。

所以，我诚心地邀请你，无论你是谁，都可以来参与这件事：

●**如果你只是想找个工具查价格**：欢迎直接访问 https://modelprice.boxtech.icu 使用。如果能顺手在 GitHub 上点个 Star，我会非常开心。

●**如果你经常用某个服务商，发现数据有误**：欢迎提 Issue 告诉我，我会尽快修复。

●**如果你和我一样，是个爱折腾的开发者**：欢迎来读源码，提 PR。比如接入新的服务商、优化爬虫逻辑、改进 UI 交互……都非常欢迎。

●**如果你有其他想法**：比如想要对比历史价格、想要价格变动提醒、想要导出 Excel……都可以提 Issue，我们一起讨论。

一个优秀的开源项目，就像一场漫长的篝火晚会，需要不断有人添柴，才能一直燃烧下去。

`Model Price` 就是我点起的第一根火柴。

* * *

好了，就说这么多。感谢你耐心听我这个老家伙唠叨。

如果你对 `Model Price` 有一点点兴趣，就去看看吧。期待在 GitHub 上，看到你的身影。

**GitHub 传送门：** https://github.com/xiaobox/model-price
