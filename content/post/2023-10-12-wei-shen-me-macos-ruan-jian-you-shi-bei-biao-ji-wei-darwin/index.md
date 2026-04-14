---
title: "为什么 macOS 软件有时被标记为 “Darwin” ？"
slug: 2023-10-12-wei-shen-me-macos-ruan-jian-you-shi-bei-biao-ji-wei-darwin
description: "如果你是 Mac 用户和开源软件爱好者，你可能见过某些带有“Darwin”标签的应用程序。如果你是 Mac"
date: 2023-10-12T03:59:59.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-12-wei-shen-me-macos-ruan-jian-you-shi-bei-biao-ji-wei-darwin/cover.jpg
original_url: https://mp.weixin.qq.com/s/XzcNhz0LBNZT6Mnq-ggX6w
categories:
  - 工具与效率
tags:
  - macOS
---
如果你是 Mac 用户和开源软件爱好者，你可能见过某些带有“Darwin”标签的应用程序。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-12-wei-shen-me-macos-ruan-jian-you-shi-bei-biao-ji-wei-darwin/001-315f97d3.png)

如果你是 Mac 用户和开源软件爱好者，你可能见过某些带有“Darwin”标签的应用程序。但为什么 macOS 版本的应用程序带有这个名称呢？

因为 macOS 与 iOS 和 tvOS 一样，由一款名为 Darwin 的基于 BSD 的开源软件提供支持。与许多开源操作系统一样，Darwin 甚至有一个吉祥物：鸭嘴兽 Hexley。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-12-wei-shen-me-macos-ruan-jian-you-shi-bei-biao-ji-wei-darwin/002-961d2e77.png)

这不是什么噱头：苹果认真对待开源事情。你现在就可以在 opensource.apple.com 下载所有 Darwin 源代码。您会发现每个 macOS 版本都有不同的下载。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-12-wei-shen-me-macos-ruan-jian-you-shi-bei-biao-ji-wei-darwin/003-e436b8d7.png)

正是由于这一传统，macOS 软件有时被贴上“Darwin”的标签，尤其是被开源爱好者所标记。

等等，开源？这是否意味着我可以免费使用 macOS？

嗯……基本上不行。虽然 Darwin 本身是开源的，但你在想象 macOS 时想到的大多数东西都不是开源的。例如，Aqua 用户界面和 Cocoa API 都是闭源的，没有这些东西，任何 macOS 软件都无法运行。

因此，虽然你可以免费下载 Darwin 的源代码，并且如果你有合适的技能，你也可以编译它，但你永远无法让 macOS 软件运行它——讽刺的是，包括许多标有“darwin”的软件（除非你想花几年和/或几十年的时间对 macOS 的专有部分进行逆向工程）。Darwin 只是 macOS 其余部分构建的基础。

但这并不意味着你不能在 Darwin 上运行任何东西。你可以相对轻松地运行 Darwin 的第三方版本，特别是 PureDarwin。这个志愿者构建的操作系统以 Darwin 作为核心，甚至可以在其上运行开源用户界面。看起来是这样的：
