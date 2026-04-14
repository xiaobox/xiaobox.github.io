---
title: "AI圈的新宠：Context Engineering"
slug: 2025-07-22-ai-quan-de-xin-chong-context-engineering
description: "AI 的发展真是 “日新月异” ，新概念也是满天飞。"
date: 2025-07-22T03:32:03.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-07-22-ai-quan-de-xin-chong-context-engineering/cover.jpg
original_url: https://mp.weixin.qq.com/s/dTjXCPY9W5JaaJMZArHRVQ
categories:
  - AI
tags:
  - ChatGPT
  - RAG
  - Agent
  - Prompt
  - Gemini
---
AI 的发展真是 “日新月异” ，新概念也是满天飞。去年还在折腾 “提示工程”（Prompt Engineering），今年就整出了 “**上下文工程**”（Context Engineering）

最近看到 大佬们像 Andrej Karpathy、Harrison Chase 都在热议这个词。

Manus 这篇文章《AI 智能体的上下文工程：构建 Manus 的经验教训》 更是对于做 Agent 的同行很有借鉴意义。

## Context Engineering，到底是个啥？

> 想象一下你正在和一个姑娘约会，你只了解了姑娘的基本信息，于是你绞尽脑汁地想话题，想和姑娘接下来聊点儿什么，但你的知识储备、记忆力也一般，于是你买了个 AI 眼镜，但这玩意就像某度一样，问什么答什么，其他没问的一概不知，而且有时候还 “胡说八道”，于是你给姑娘带来了像机器人一样的约会体验，然后就没有然后了。.....

不得不说你是一个有“上进心”的人，觉得不能再给双方如此糟糕的体验了，为了自己的终身大事于是你决定要升级装备，你发现 AI 眼镜有 Plus 版本，你决定再给它一次机会。 下单-约会-实战开始！

> 这一次，你按照 “指南” 提前给设备塞了点儿 “备忘录”——比如你们最近的聊天记录、姑娘的相关资料、甚至工具怎么用。于是你根据姑娘和你的共同喜好，组织了好多双方感兴趣的话题，成功引起了姑娘的兴趣，再深入了解下去发现你们有更多共同的兴趣和朋友，甚至精神层面也有共鸣，你们探讨了最近看的书，三观，以及处世哲学，然后时间不早了，你根据姑娘和你的综合情况在 AI 的帮助下快速选定了一家餐厅，邀请姑娘共进午餐，姑娘欣然接受。

可以说这次约会是成功的，AI 眼镜秒变 神助攻！

这就是 Context Engineering 的本质：**不是简单扔个问题给 AI，而是精心准备一堆“上下文”，让 AI 知道该怎么思考、怎么行动。简单说，它管着 AI“看到”的所有东西：系统提示、聊天历史、从数据库扒出来的数据、工具说明，甚至长期记忆。**

Context Engineering 看起来 比 “提示工程” 靠谱多了

**“提示工程听起来就像日常聊天里随便问问，但工业级 AI 应用里，Context Engineering 才是艺术加科学——怎么塞对信息进上下文窗口，让 AI 一步步干活。”**

而且现在时机成熟了，因为 AI 模型的“记忆窗口”从几千字扩到百万字了（像 GPT-4o 或 gemini-2.5），光靠一个完美提示不够用，得动态管理上下文，避免 AI“迷路”或胡说八道

## 老梗翻新？

老实说，初看起来  Context Engineering 多少有点儿新瓶装旧酒的意思，但细看起来确实有新意。

AI 从简单聊天工具进化到“代理”（agent），这些代理得处理复杂任务，比如帮你分析法律文件、写代码或管客户支持。单纯的提示工程像扔个球给 AI，Context Engineering 则是建个球场、定规则、备道具。

实际上 agent 开发者早就在干这活儿了，提炼出个概念来能吸引更多人注意，推动工具开发。哈哈，炒作的效果。

所以也有人吐槽：

-   “Context Engineering 不就等于语义搜索吗？很多人忘了老排名机制的重要性，非得追新潮。”
-   “dumping 数据进 AI 就算工程了？”

*我发现 coder 这个群体嘴有时候是真臭啊，哈哈。*

不过说的也没毛病，Context Engineering 就是整合了检索增强生成（RAG）、内存管理这些老技术，早期的 RAG 系统就已经在玩儿上下文检索了。所以，它不是从天而降的革命，而是对现有实践的升级包装。

我们做个表格来对比一下  Prompt Engineering 和 Context Engineering

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-07-22-ai-quan-de-xin-chong-context-engineering/001-c511c1f3.png)

## 总结

总之呢，AI 越来越复杂，得从“艺术”转向“工程”。但如果你只是随便玩玩 AI，不用纠结——它更适合开发者或企业。

## 参考

-   manus 的文章： https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
