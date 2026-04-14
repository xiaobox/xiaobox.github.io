---
title: "我用两句中文，让 Claude Code 帮我画了10张出版级技术图"
slug: 2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1
description: "前两天在写一篇技术文章，写到一半需要配一张微服务架构图。"
date: 2026-04-12T08:38:12.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/cover.jpg
original_url: https://mp.weixin.qq.com/s/G8MEL5mRKE0zpvYKVq1-8w
categories:
  - AI
tags:
  - LLM
  - Claude
  - Agent
  - Prompt
  - 微服务
  - 架构
  - DevOps
---
前两天在写一篇技术文章，写到一半需要配一张微服务架构图。我打开了某在线画图工具，对着空白画布发了十分钟的呆，拖了两个方块，连了一条线，觉得丑，删掉，再拖两个方块。

半小时过去了，图还没画完，文章的灵感已经凉透了。

我相信很多搞技术内容的朋友都有过这种体验。你脑子里其实很清楚这张图应该长什么样，但你就是得花一两个小时在画图工具里对齐、配色、调字号。明明内容才是核心，结果时间全花在了排版上。

然后我发现了一个东西，彻底解决了这个问题。

它叫 fireworks-tech-graph，是一个 Claude Code 的 skill。装上之后，你跟 Claude Code 说一句中文，它就能给你吐出一张出版级别的技术图。SVG 矢量源文件加 1920px 高清 PNG，直接能往文章里塞。

我用它画了10张不同类型的图，从架构图到 ER 图到状态机，从白底极简到暗色霓虹到工程蓝图。每张图从下指令到拿到成品 PNG，平均不超过30秒。

30秒。

我之前在画图工具里对齐一个箭头的时间都不止30秒。

* * *

怎么装呢，你甚至不需要记任何命令。

打开 Claude Code，直接跟它说「帮我安装 fireworks-tech-graph 这个 skill」，它自己就把活干了。装完之后你说「画一个 xxx 图」，它就自动触发。

如果你喜欢手动装也行，就一句 claude skills install fireworks-tech-graph，完事。

触发词非常宽泛，「画图」「帮我画」「做个架构图」「生成一个流程图」「可视化一下」，随便怎么说都行，它都能识别。

* * *

它能画什么？

这个 skill 支持10种有模板的图表类型，外加4种无模板但有规则定义的类型。我挑几个最实用的说一下。

1，架构图。这是用得最多的，画微服务分层、系统组件关系。你告诉它有哪些服务、怎么分层、哪些组件之间有调用关系，它自动帮你排好。我画的那张微服务架构图有5层，右侧还挂了一个观测性旁路，出来的效果跟正经架构文档里的图一模一样。

2，流程图。CI/CD 流水线、审批流、业务决策流。菱形判断节点、圆角矩形处理步骤、失败回环，全都有。你只需要描述「从提交代码到部署生产」中间经过哪些步骤和判断就行。

3，时序图。微服务之间谁先调谁，消息怎么传递。标准的 UML 时序图，有生命线、激活框、alt 分组框。你列出参与者和消息序列，它帮你排好。

4，ER 图。数据库表之间的关系。支持鸦脚记法，PK 自动下划线，FK 标注。你把实体和属性列出来，告诉它哪些是一对多、哪些是多对多，它画出来的东西可以直接放进数据库设计文档。

5，状态机。订单生命周期、工单状态流转这种。每个状态是一个圆角矩形，转换线上标事件名，有初始态的实心圆和终态的同心圆。

6，对比矩阵。横评几个模型、几个方案的时候特别好使。我画了一张 LLM 模型对比表，5个模型7个维度，绿色打勾红色打叉，交替行填充，出来就是一张可以直接发朋友圈的表。

7，时间线。项目路线图、版本规划。甘特图样式，彩色横条加菱形里程碑。

除了这些，还有 Agent 架构图、用例图、数据流图。反正你在技术写作里能用到的图，它基本都覆盖了。

* * *

比较骚的是它有7种视觉风格，每种味道完全不一样。

默认的 Flat Icon 是白底彩色，适合博客和文档。Dark Terminal 是暗色霓虹风，发 GitHub 和技术社区特别帅。Blueprint 是工程蓝图风，深蓝色背景加网格线加角标，那种 CAD 图纸的感觉。Notion Clean 是极简白，一根线一个色。Glassmorphism 是毛玻璃卡片，适合产品官网和 Keynote。最近还加了 Claude Official 和 OpenAI Official 两种风格，分别是 Anthropic 和 OpenAI 的品牌调性。

你指定风格的方式就是在 prompt 里加一句「用蓝图风」或者「Style 3」，就这么简单。

* * *

我觉得这个 skill 最打动我的点，不是它画得多漂亮，而是它把「画图」这件事的心理门槛降到了零。以前我写文章需要配图的时候，经常会想「算了这里用文字描述一下也行吧」，因为打开画图工具、画完、导出、插入这一套流程太重了。现在不一样了，我在 Claude Code 里写着文章，写到需要配图的地方，直接说一句「帮我画一个 xxx」，30秒后图就在本地了。

这种体验就像是，你本来在用文本编辑器写代码，突然有人给你装了一个实时预览插件。功能上没变，但那个「随时能看到效果」的即时反馈感，会让你更愿意去做这件事。

画图也是一样。当成本足够低的时候，你会发现你开始「想画就画」了。

* * *

想试的朋友，打开 Claude Code，说一句「帮我安装 fireworks-tech-graph」，等它装完，再说一句「画一个 xxx 图」。

就这么简单。两句话的事。

下面附一些 demo 图：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/001-a45422ed.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/002-ae30d407.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/003-08fbb303.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/004-4787f3ce.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/005-fc59df47.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/006-5f1611fe.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/007-6052529a.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/008-475c5a2d.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/009-f8934911.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-04-12-wo-yong-liang-ju-zhong-wen-rang-claude-code-bang-wo-hua-le-1/010-2706d92e.png)
