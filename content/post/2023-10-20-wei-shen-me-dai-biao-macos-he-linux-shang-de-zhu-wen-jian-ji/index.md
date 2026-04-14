---
title: "为什么 ~ 代表 macOS 和 Linux 上的主文件夹？"
slug: 2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji
description: "无论你是在 Windows 10 上安装了 Linux 子系统还是开始使用 Linux 终端，您都需要学习各"
date: 2023-10-20T15:33:26.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji/cover.jpg
original_url: https://mp.weixin.qq.com/s/x2Y1i93cyiIApUbvkt-liQ
categories:
  - 系统底层
tags:
  - Linux
  - macOS
  - DevOps
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji/001-1cb4f248.png)

无论你是在 Windows 10 上安装了 Linux 子系统还是开始使用 Linux 终端，您都需要学习各种命令简写方式... 但没有一种是直观的。

例如，波浪号

`~   `

它代表你的主文件夹

比如你想 切换到当前用户主目录中的 Documents 文件夹，就这样可以：

`cd ~/Documents   `

不用输入 当前用户主目录的路径+Documents，比如：

`/Users/xiaobox/Documents   `

当然，这是一个方便的快捷方式，但为什么要使用这个特定字符呢？

不管你相信与否，这是因为 20 世纪 70 年代的键盘。

这是 Lear Siegler ADM-3A 终端，于 1975 年首次发货。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji/002-d1e74208.png)

这是一个“哑终端”，意味着它本身不是计算机，而是允许你向计算机输入命令并显示计算机中的数据。ADM-3A 的售价仅为 995 美元，无论你相信与否，这在当时都是一个不错的价格，这意味着机构可以购买多个此类终端来连接到一台中央计算机。直到今天，现代的“终端模拟器”（例如 Linux 和 macOS 中使用的终端模拟器）仍在模仿此类系统的功能。

这是一个具有巨大影响力的硬件；许多早期的软件开发都发生在它上面，这意味着键盘布局影响了一些设计选择。一探究竟：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji/003-18ff1325.png)

注意到什么了吗？这是更清晰的图像。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-20-wei-shen-me-dai-biao-macos-he-linux-shang-de-zhu-wen-jian-ji/004-006b1710.png)

看到右上角的键了吗？这就是 HOME 键，其作用类似于现代键盘上的 Home 键，在编辑文本时将光标移至左上角位置。它也是用于波浪号符号的键，这个关联就足够了。最终它代表了主文件夹。

没错：Linux 和基于 UNIX 的系统使用四十多年前的特定键盘代表 Home

这款键盘中还隐藏着其他细节。看到 H、J、K 和 L 键上的箭头了吗？按住 Control 并按这些键是在终端中移动光标的方式，这就是为什么这些相同的键用于在 vi 中移动光标。这些 vi 键盘快捷键反过来又启发了 Gmail、Twitter 甚至 Facebook 中的键盘快捷键。没错：甚至 Facebook 的键盘快捷键也受到了 1975 年首次销售的“哑终端”的启发。

一种你从未听说过的设备影响了人们在四十多年后仍在使用的软件中使用的设计决策。历史是不是很有意思 ？
