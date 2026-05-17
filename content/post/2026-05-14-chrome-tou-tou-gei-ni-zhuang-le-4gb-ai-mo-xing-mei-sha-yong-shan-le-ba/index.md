---
title: "Chrome 偷偷给你装了 4GB AI 模型，没啥用，删了吧"
slug: 2026-05-14-chrome-tou-tou-gei-ni-zhuang-le-4gb-ai-mo-xing-mei-sha-yong-shan-le-ba
description: ""
date: 2026-05-14T05:00:00.000Z
image: 
original_url: 
categories:
  - 行业与思考
tags:
  - Chrome
  - Google
  - Gemini Nano
  - 浏览器
  - 隐私
---
嘿朋友，如果你像我一样有定期清理磁盘空间的习惯，最近可能会发现 Chrome 占用的空间突然变大了。

你可以去找一个名字很怪的文件夹。

Windows 用户可以看 `%LOCALAPPDATA%\Google\Chrome\User Data\OptGuideOnDeviceModel`。

macOS 用户可以在 `~/Library/Application Support/Google/Chrome/OptGuideOnDeviceModel` 下面找找。

里面可能躺着一个 `weights.bin`。

三四个 G, 和一个 Linux 桌面版 ISO 差不多大，怎么着？给我塞了个操作系统吗？

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260506231901680.png)

比较离谱的是，我把它删了，过一阵儿又回来了...

于是我去查了查，发现中招的不只我一个。

原因是这样的：Chrome 从 147 版本开始，悄悄给你下载 Gemini Nano 模型权重，也就是 Google 自家的本地大语言模型。

但关键是没经过用户同意啊。网友们说可能违反欧盟的《电子隐私指令》了。Google 目前没正面回应。

在你删那个文件之前，先把两个事澄清一下。

第一，这个 4GB 的文件 跟地址栏那个「AI 模式」按钮没关系。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260506234104675.png)

Chrome 147 在地址栏右边加了个「AI 模式」按钮。你可能会觉得这俩是一对，本地装了模型，旁边是 AI 入口。但其实不是。

「AI 模式」走的是 Google Search 那条线。你点一下，问题被拆成子问题发回 Google 服务器同时搜，再用云端模型拼一个搜索式回答，跟那个 4GB文件没关系。

那这个 4GB 文件是给谁用的呢？

Chrome 自己列过一份清单。

- Help me write，在文本框里写邮件、评论时点「帮我写」
- 页面摘要
- 智能粘贴
- 标签页分组建议
- 设备端反诈骗信息检测

外加给开发者预留的 Prompt API、Summarizer、Writer、Rewriter 这些浏览器内置 AI 接口。

99% 的人日常根本不会触发这些功能。所以你下载了 这个4GB的文件，但大概率用不到。

第二，隐私层面问题不大。

Chrome 文档里写了，Gemini Nano 在本地跑，调用模型时，你的 query 不发给 Google，也不发给第三方。

真正膈应的地方是两件事。一是 Chrome 没征得我的同意就把 这 4GB的文件下到硬盘。二是关掉也挺麻烦，藏的较深。

所以如果你不打算用 Help me write 这些功能，可以关掉。

最简单的方案三平台通用，一分钟搞定。

1. Chrome 地址栏输入 `chrome://flags` 回车
2. 搜 `optimization-guide-on-device-model`，改成 Disabled
3. 同一个页面再搜 `prompt-api-for-gemini-nano`，也改成 Disabled
4. 重启 Chrome
5. 去对应路径把 OptGuideOnDeviceModel 整个文件夹删掉

两个 flag 必须一起关。只关第一个，Prompt API 还可能在后台触发模型下载。

立竿见影。

要注意一点，chrome://flags 这招儿不是 100% 持久。Chrome 后续大版本升级有可能把 flag 重置回去，建议升级后回来扫一眼那个文件夹还在不在。

如果你强迫症，想一次到位永远不被升级覆盖，Windows 用户可以走注册表。这是 Chrome 官方企业 policy 里的开关，写进去就不会被自动升级影响。

1. Win + R 输入 `regedit` 打开注册表编辑器
2. 定位到 `HKEY_LOCAL_MACHINE\SOFTWARE\Policies`
3. 在 Policies 下新建项 `Google`，再在 Google 下新建项 `Chrome`
4. 选中 Chrome 项，右键空白处新建 DWORD (32 位) 值
5. 命名 `GenAILocalFoundationalModelSettings`，数值设为 `1`
6. 重启电脑

重启后 Chrome 不会再下载 Gemini Nano，已有的 weights.bin 也会被自动清理。

Mac 和 Linux 目前没有跟注册表等价的持久方案，只能定期回 chrome://flags 检查一遍。

关掉之后会失去这些功能。

- Help me write
- 页面摘要
- 智能粘贴
- 标签页分组建议
- 设备端反诈骗（这一项要不要保留自己掂量）

不会失去这些。

- Chrome 主体浏览功能完全不影响
- 地址栏的「AI Mode」按钮还能正常用，因为那个本来就走云端
- 常规 Google 搜索结果不变

最后几个注意事项。

第一，再唠叨一遍，这事不是一锤子买卖。Chrome 一年大版本升级好几次，如果只走 chrome://flags，下次升级可能把 flag 默默打开。升级后记得回头看一眼。

第三，Edge、Vivaldi、Brave 这些 Chromium 系浏览器目前没这个问题，Gemini Nano 的下载是 Chrome 主线独有的，可以放心用。

如果你不在乎那 4GB，留着也没事。如果在乎，按上面方法五分钟搞定。

知道电脑里多了什么，它在干嘛，自己有办法处理，这事就算结了。
