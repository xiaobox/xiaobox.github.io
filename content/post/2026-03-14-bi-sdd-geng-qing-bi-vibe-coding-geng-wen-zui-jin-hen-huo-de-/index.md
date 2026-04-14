---
title: "比 SDD 更轻、比 Vibe Coding 更稳：最近很火的 Compound Engineering，到底是什么？"
slug: 2026-03-14-bi-sdd-geng-qing-bi-vibe-coding-geng-wen-zui-jin-hen-huo-de-
description: "比 SDD 更轻、比 Vibe Coding 更稳：最近很火的 Compound Engineering，到底"
date: 2026-03-14T23:30:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-03-14-bi-sdd-geng-qing-bi-vibe-coding-geng-wen-zui-jin-hen-huo-de-/cover.jpg
original_url: https://mp.weixin.qq.com/s/T0o7CU8zvw3eLojhk8M4sw
categories:
  - AI
tags:
  - Claude
  - Codex
  - Gemini
---
# 比 SDD 更轻、比 Vibe Coding 更稳：最近很火的 Compound Engineering，到底是什么？

这两年，AI 编程圈越来越像在两个极端之间摇摆：一边是“想到什么就让 AI 直接写”的 Vibe Coding，速度很快，但经常越写越乱；另一边是像 SDD 这样的重流程方法，先写规格、再做计划、再拆任务，明显更稳，但对很多日常迭代来说又有点重。也正是在这个背景下，Every 提出的 **Compound Engineering** 开始被越来越多人讨论。

Every 对它的定义非常明确：它不是一次性的“让 AI 帮你写代码”，而是一套循环式工作法——**Plan → Work → Review → Compound → Repeat**。Every 特别强调，前面三步很多工程师都熟悉，真正把它和传统开发区分开的，是第四步 Compound：把这次工作的经验、规则和模式沉淀下来，让下一轮更容易、更稳定。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-03-14-bi-sdd-geng-qing-bi-vibe-coding-geng-wen-zui-jin-hen-huo-de-/001-40d82677.png)

我更愿意把 Compound Engineering 翻成 **复利式工程**。因为它想表达的重点，不是“复合”，而是“复利”：今天做完一个需求，不只是产出一段代码，而是顺手把这次有效的方法、踩过的坑、适合你代码库的规则一起沉淀下来。

如果跳过 Compound 这一步，你做的其实还是“带 AI 辅助的传统开发”；只有把经验真正回写到系统里，收益才会不断累积。**复利式工程里，80% 的时间应该花在 Plan 和 Review 上，真正写代码和沉淀反而只占 20%**。这背后的逻辑很简单：AI 写代码越来越快，开发者真正稀缺的能力，不再是手敲速度，而是规划质量和复盘能力。

# 那它和 SDD 的区别到底在哪？

**SDD 的核心是“先把需求和边界说清楚”，复利式工程的核心是“让每一轮开发都为下一轮积累资产”**。

GitHub 在介绍 Spec Kit 时，把 SDD 定义成一种“让 spec 成为工程中心”的方法：不是先写代码、后补文档，而是先写 spec，把它作为共享真相，再由 spec 驱动计划、任务拆解、实现与验证。整个过程是分阶段推进的，而且每一阶段没验证完，不进入下一阶段。这意味着 SDD 更像一套规格驱动的工程方法，而 Compound Engineering 更像一套强调循环、反馈和经验复利的工作法。前者更适合高不确定性的大功能、多人协作和正式项目；后者更适合持续迭代、日常开发、频繁修复和长期演进。

换句话说，SDD 更像“先把地图画清楚再出发”，而 Compound Engineering 更像“每走完一段路，都顺手把路修得更好”。这也是为什么很多人会觉得 SDD “更专业”：因为它天然更正式、更有边界、更适合把复杂需求讲清楚；但复利式工程并不是不专业，它只是没把重心放在“写出一份完整规格”上，而是放在“形成稳定循环，并持续让系统学会更多东西”上。

它的推荐流程是 **Brainstorm → Plan → Work → Review → Compound → Repeat**，并为每一步提供了对应命令，比如

●/ce:brainstorm 用来澄清需求和方案

●/ce:plan 用来形成实施计划

●/ce:work 执行代码改动

●/ce:review 做多代理审查

●/ce:compound 记录经验，让未来的工作更容易。

如果你想试一试，它的上手门槛其实不高。Every 的官方插件可以直接安装到 Claude Code；仓库同时还提供了转换安装方式，能把这套插件能力转换到 Codex、Copilot、Gemini、OpenClaw、Windsurf 等环境中。实际使用时，我建议不要把它理解成“又一个新框架”，而要把它理解成一种固定节奏：

●先 brainstorm，把问题和方案空间摸清；

●再 plan，把变更范围、文件、约束和验证方式写明白；

●接着 work，让 AI 按计划执行；

●然后 review，审查结果和遗漏；

●最后 compound，把这轮真正有效的经验写回规则、命令、技能或文档里

这样做的价值不在于某一次写得多快，而在于代码库会越来越顺手，AI 也会越来越“懂你”

# 优缺点

它的优点很明显。

1.第一，它比纯聊天式 AI 编码稳得多，因为它强制加入了计划和复盘。

2.第二，它又比完整 SDD 轻，尤其适合中小功能、日常修复和产品迭代。

3.第三，它最有价值的地方是“积累性”：不是每次都从零开始，而是让经验沉淀下来，形成真正的团队资产。

缺点也同样清楚：如果团队没有 review 习惯，或者总是赶时间跳过 compound，那它很快就会退化成“稍微有点流程的 Vibe Coding”；另外，它虽然比 SDD 轻，但对开发者判断力要求并不低，因为你得知道哪些经验值得固化，哪些只是一次性的临时解法。

所以，我的结论其实很简单：不要把 Compound Engineering 和 SDD 看成非此即彼。 真正成熟的做法，往往是两者结合。

●大需求、新模块、多人协作，用 SDD 先把规格立住；

●小步迭代、连续修复、长期产品打磨，用复利式工程把循环跑顺。

前者解决“起点要正确”，后者解决“每一步都越来越顺”。**在 AI 编程越来越强的时代，真正拉开差距的，恐怕不再是谁能让模型多写几百行代码，而是谁能把一次次零散输出，组织成一个会持续增值的工程系统**
