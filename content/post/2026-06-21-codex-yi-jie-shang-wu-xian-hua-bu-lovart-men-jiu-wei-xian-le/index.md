---
title: "Codex 一接上无限画布，Lovart 们就危险了"
slug: 2026-06-21-codex-yi-jie-shang-wu-xian-hua-bu-lovart-men-jiu-wei-xian-le
description: ""
date: 2026-06-21T02:55:03.000Z
image: 
original_url: 
categories:
  - 行业与思考
---
![封面图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/00-cover-abstract.png)

我今天把 Cowart 跑通了。

Cowart 是一个 Codex 插件，把 Codex 接到本地无限画布里。

但我跑完之后，第一个反应是，Lovart 这类画布 AI 产品要小心了。

不是说 Cowart 现在已经比 Lovart 强，差得远。

Lovart 官网卖的是 AI Design Partner，Touch Edit，Style Consistency，Text Edit 这些设计工作流。

Cowart 现在更像一个很早期的本地插件。

但危险的地方就在这里，画布 AI 不一定非得是一个封闭产品。

安装也很简单，不要手动折腾配置。既然都有 Codex 了，直接把 Cowart 文档里的这段话丢给 Codex 就行。

```text
请从 https://github.com/zhongerxin/cowart.git 安装 Cowart Codex 插件。
请 clone 仓库到 ~/plugins/cowart，确认 .codex-plugin/plugin.json 存在，
把插件加入 personal marketplace，然后运行 codex plugin add cowart@personal。
安装后请校验插件，并告诉我是否需要开启一个新对话来加载新技能和 MCP 工具。
```

你把安装目标告诉 Codex，它自己 clone，检查 `.codex-plugin/plugin.json`，加入 personal marketplace，跑 `codex plugin add cowart@personal`，最后告诉你要不要开新对话。

装完之后，新开一个 Codex 对话。

然后在项目目录里说一句。

```text
Open the Cowart canvas for this project.
```

Cowart 会启动本地画布，默认地址类似这样。

```text
http://127.0.0.1:43217/
```

到这里，Codex 面前就有了一个工作台。

我用一张「宠物店」海报试了一轮。

先让 GPT Image 生成原图。

![原始宠物店海报](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/01-pet-shop-original.png)

然后把它放进 Cowart 画布。

以前你要改这张图，大概率会在聊天框里写一长串。

现在不用。

你在画布上画箭头，写一句，去掉这只鸟。

![画布上标注去掉小鸟](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260621112322554.png)

然后你可以用截图的方式，也可以直接在左侧用自然语言和 Codex 说，按选择图片的最新标注再修改一下。

Codex 会读标注、箭头和当前图片，然后生成新版本，放到原图旁边。

![按画布标注去掉小鸟](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/02-pet-shop-remove-bird.png)

接着我选中新版本，再标注，去掉这只兔子。

![画布上标注去掉兔子](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260621112536789.png)
它知道这次要基于「已经去掉鸟」的图继续改。

不是从原图重来。

![继续按选中图片的最新标注去掉兔子](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/03-pet-shop-remove-rabbit.png)

这个点才是关键。

画布不是为了好看，它是在帮 Codex 保存空间上下文。

原图在哪，批注在哪，上一版在哪，哪张图才是当前选中版本，这些信息如果都塞进聊天框，会很啰嗦。

但放到画布上，它们自己就站在那里。

所以我说 Lovart 们危险，不是因为 Cowart 现在多成熟。

而是因为这个方向太自然了。

Lovart 的价值，是把生图、编辑、版本、风格一致性、设计流程放到一张画布上。

但 Codex 如果能通过插件接 tldraw、本地文件、图片生成、MCP 工具和项目目录，同一件事就开始变成通用 Agent 的能力。

专门的画布 AI 产品当然还有优势，界面更完整，交互更顺，设计资产管理也更成熟。但用户不一定非要去一个新平台。

如果 Codex 本来就在你的电脑里，本来就能读项目、跑命令、调用图像模型，再给它一张画布，它就能长出一个低配 Lovart。

而且是本地的，可改的，能接你自己工具链的。

对我来说，Cowart 最有价值的不是「生成了一张图」。真正有价值的是，它让 Codex 从「回答问题」往「摆弄材料」又向前走了一步。

代码、截图、报错、设计稿、标注、箭头、版本、结果，全都可以留在一张桌子上。

它是给 Codex 装了一个电子白板。
