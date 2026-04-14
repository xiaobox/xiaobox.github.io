---
title: "Gemini 3 介绍"
slug: 2025-11-19-gemini-3-jie-shao
description: "Gemini应用每月用户超过6.5亿，超过70%的云服务客户在使用我们的人工智能，1300万开发者基于我们的生"
date: 2025-11-19T13:22:13.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-11-19-gemini-3-jie-shao/cover.jpg
original_url: https://mp.weixin.qq.com/s/2EWWCIQZ8hNN10BOLaOVfg
categories:
  - AI
tags:
  - Linux
  - macOS
  - Claude
  - Cursor
  - Agent
  - Prompt
  - Gemini
  - 架构
---
> Gemini应用每月用户超过6.5亿，超过70%的云服务客户在使用我们的人工智能，1300万开发者基于我们的生成式模型进行了开发，而这仅仅是我们所看到的影响的一小部分。   -- Google CEO Sundar Pichai

每一代 Gemini 都在以往的基础上不断发展，让你能够做更多事情。

●Gemini 1 在原生多模态和长上下文窗口方面的突破，拓展了可处理信息的种类以及数量。

●Gemini 2为智能体能力奠定了基础，并在推理与思考方面突破了前沿，助力完成更复杂的任务和构想，使 Gemini 2.5 Pro在LMArena上占据榜首超过六个月。

今天 ，Google 终于憋出了大招，正式发布了 Gemini 3 系列。Google 这次明显是想通过 “Agentic（代理化）” 和 “Generative UI（生成式 UI）” 这两张牌，彻底改变我们开发和使用 AI 的方式。

## 一、核心模型：不再只是 “陪聊”，而是 “干活” 的

这次发布的重头戏有两个模型版本：

1.Gemini 3 Pro

○定位： 这是新的主力模型，Google 称之为 “最智能的模型”。

○最大亮点 ——“Vibe Coding”：你不需要写精确的 prompt 或者伪代码，只需要用自然语言描述你想要的 “感觉（vibe）” 或功能，它就能生成全栈应用。比如 “做一个复古风格的太空射击游戏，障碍物要随着合成波音乐跳动”，它能直接给你生成带 UI 和交互的成品。

○能力提升： 推理能力大幅增强，官方数据说在 LMArena 上 Elo 分数飙到了 1501（目前榜首）。

○适用场景： 日常高频任务、代码生成、多模态理解（视频/图像/音频）。

2.Gemini 3 Deep Think

○定位： 专门用来 “死磕” 难题的推理模型，仅面向 Google AI Ultra 订阅用户。

○对标对象： 显然是 OpenAI 的 o1 / o3 系列。

○恐怖的数据： 在 Humanity's Last Exam（人类终极考试）这个测试集上，Gemini 3 Pro 得分 37.5%，而 Deep Think 版本能干到 41.0%（作为对比，上一代 Gemini 2.5 Pro 只有 21.6%）。这意味着在数学、科学研究等需要深度思考的领域，它的可靠性会有质的飞跃。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-11-19-gemini-3-jie-shao/001-7f39bd1d.png)

## 二、 AI IDE ：Google Antigravity (反重力)

Google 推出了一个全新的 Agentic IDE，叫 Google Antigravity

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-11-19-gemini-3-jie-shao/002-ad66a4c5.png)

●这是什么？ 别把它想成 VS Code 的插件。这是一个独立的 IDE，专门为 “AI 代理开发” 设计的。

●核心逻辑变了： 以前我们是用 Copilot 写代码（AI 辅助你），现在你是 “架构师”，你定义任务，Antigravity 里的 Agents（代理）去执行。

●它能干嘛？

○全自主干活： 代理可以在编辑器写代码、在终端跑命令、在浏览器里预览调试，三者打通。

○Artifacts（产物）： 代理不仅仅是吐代码，还会生成任务清单、实施计划、甚至截图，让你像验收工作一样去 Check 它的产出。

○模型任选： 这一点很良心，除了 Gemini 3，它居然支持 Anthropic 的 Claude Sonnet 4.5 和 OpenAI 的 GPT - OSS。Google 这次格局打开了，意思是 “用最好的工具解决问题”。

这玩意儿就是冲着 Cursor 来的，而且试图在 “自主性” 上更进一步。建议大家赶紧去下个 Preview 版试试，特别是 Mac/Windows/Linux 都支持。

## 三、 用户体验革命：Generative UI (生成式 UI)

Google 认为：“最好的 UI 是不需要设计的，是生成的。”

Google 认为，AI 的回答不应该只是一堆文字。Gemini 3 引入了 Generative UI（生成式用户界面）

●动态生成组件： 当用户问 “帮我规划去罗马的旅行” 时，它不再只是列个文字清单，而是可能会直接生成一个 “交互式的行程卡片”，或者当你问房贷时，直接生成一个 “房贷计算器组件”。

●底层技术： 依靠 Gemini 3 强大的代码生成能力，即时生成前端代码并在客户端渲染。

●Dynamic View： 在 Gemini App 里，这被称为 “Dynamic View”。它能根据你的意图，现场 “手搓” 一个最适合当前场景的 UI 界面给你。

未来的 AI 应用，界面可能不再是写死的，而是 “流式生成” 的。

## 四、 实战与性能 (Benchmarks)

如果不看跑分就不是科技圈了。简单列几个吓人的数据：

●LMArena Elo: 1501 (目前世界第一)。

●MathArena Apex: 23.4% (这是个新出的超难数学竞赛基准，其他模型基本是个位数，Claude 4.5 是 1.6%，GPT-5.1 是 1.0%... Gemini 3 这个分数有点断层领先的意思)。

●SWE-bench Verified (代码能力): 76.2%。虽然比 Claude 的 77.2% 略低一点点，但在 Antigravity 环境下的综合表现（Agentic coding）可能会更强。

●多模态: 视频理解 (Video-MMMU) 达到了 87.6%，以后扔给它一段长视频让它总结或者找细节，应该会非常准。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-11-19-gemini-3-jie-shao/003-49ccf38a.png)

## 五、 生态整合（这才是 Google 恐怖的地方）

Google 把 Gemini 3 塞进了所有角落：

●Search: 搜索里加了 “AI Mode”，而且支持 “Thinking” 开关。以后搜复杂问题（比如做攻略、查论文），搜索体验会完全不同。

●Android Studio: 安卓开发的同事注意了，Gemini 3 已经进驻，不仅是补全代码，还能帮你写 UI、查 Bug。

●Gemini CLI: 对于运维和后端同事，新的 CLI 允许你在终端里直接用自然语言让 Gemini 3 帮你执行复杂的 Shell 命令组合，甚至排查云端服务的 Log。

●Firebase: 推出了 "Firebase AI Logic"，后端逻辑也能由 AI 驱动了。

## 六、 总结与建议

Gemini 3 无疑是一次 “能力的平权”

Gemini 3 不仅仅是 “更快更强”，它在尝试定义 AI 的下一阶段：

1.从 Chat 到 Agent: 不再是 “一问一答”，而是 “通过代理解决多步骤复杂任务”。

2.从 Text 到 UI: 输出形式从文本扩展到了动态界面。

给产研内部的建议：

●开发同学： 务必尝试 Google Antigravity 和 Gemini CLI。如果它真能像宣传那样自主改 Bug、重构代码，我们的开发效率可能会有质变。

●产品同学： 关注 Generative UI 的交互模式。我们的 AI 产品是否也可以不仅仅吐文字，而是根据用户需求动态生成交互组件？

●模型同学： 重点关注 Deep Think 的推理模式，看看 Google 是如何通过增加推理时间（Test-time compute）来换取高质量输出的。

目前 Gemini 3 Pro 已经在 Gemini App 和 AI Studio 里能用了，Deep Think 还要等几周。大家可以先去玩玩 Pro 版的 “Vibe Coding”
