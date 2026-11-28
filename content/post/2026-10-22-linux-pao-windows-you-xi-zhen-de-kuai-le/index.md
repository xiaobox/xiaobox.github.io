---
title: "Linux 跑 Windows 游戏，真的快了"
slug: 2026-10-22-linux-pao-windows-you-xi-zhen-de-kuai-le
description: ""
date: 2026-10-22T04:00:00.000Z
image:
original_url:
categories:
  - 系统底层
tags:
  - Linux
  - macOS
---

你要是十年前问任何一个玩游戏的人，怎么不在 Linux 上玩，答案就一句话。

没游戏。

不是 Linux 慢，也不是 Linux 难用，是游戏厂商只给 Windows 出版本。一个游戏做完，调的是 Windows 自带的那套图形接口叫 DirectX，从画面到输入到声音都绑死在 Windows 上所以多年来有个默契，写代码用 Linux 或 Mac，到了想开把游戏的那一刻，就切回 Windows。

我自己很多年都是这么过来的。

前几天扫到一份 Wine 11 的测试数据，让我很吃惊。

同一台机器、同一个游戏，Wine 11 把 Dirt 3 跑出 860.7 FPS。同款硬件同款游戏，没用上新方案的旧 Wine 只有 110.6 FPS。

我以为是测试出错了。点进去看了半天，越看越离谱。

Tiny Tina's Wonderlands 130 → 360。
Resident Evil 2 26 → 77。
Call of Juarez 99.8 → 224.1。

Metro 2033 这种已经优化到尽头的老游戏也涨了 21%。

要了解这波优化背后的故事，得先回顾一下 Linux 跑 Windows 游戏的历史。

故事得从一个项目说起。它叫 Wine。

---

Wine 这个名字是「Wine Is Not an Emulator」的递归缩写，1993 年 Bob Amstadt 在 comp.os.linux 邮件列表上起的头，最早只是想在 Linux 上跑 Windows 3.1 的程序。它干的事儿是把 Windows 程序调用的 Win32 API，在 Linux 上重新实现一遍，让 Windows 的 .exe 可以直接在 Linux 上跑。

听起来简单，但 Win32 API 这玩意有上万个函数，覆盖图形、声音、网络、文件、注册表、线程、安全。把它在 Linux 上重新实现一遍，是一个极其困难的工程。Wine 团队就这么慢慢写了 33 年。

到 2017 年底，一个叫 Philip Rebohle 的德国程序员加入战场。他当时在玩一个游戏叫《尼尔机械纪元》，Wine 跑这游戏帧数低得没法忍。他一气之下自己写了个项目叫 DXVK。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/na17092102_vrxk.jpg)

DXVK 解决的是图形那一块。前面说过 Windows 游戏画面用的接口叫 DirectX，跨平台对应的新一代接口叫 Vulkan，是个开放标准，Linux 上是一等公民。Rebohle 的思路是不修 Wine 那个老旧的 DirectX 翻译层了，直接把 DirectX 11 的图形调用翻译成 Vulkan。

2018 年 1 月，他在 Linux 上把《尼尔》跑流畅了。当年 8 月 21 日，Valve 出手了。

Valve 是做 Steam 的那家公司，Steam 又是大多数 PC 玩家买和启动游戏的地方，相当于 PC 游戏圈的 App Store。Valve 把 Wine、DXVK 加上自家一堆补丁打包成一个叫 Proton 的兼容层，焊进 Steam 客户端。Linux 用户在 Steam 上买的 Windows 游戏，点一下就能启动，底下翻译什么自己不用管。Rebohle 也很快被 Valve 全职雇下来。

到 2022 年，Valve 把 Proton 装进了一台叫 Steam Deck 的掌上游戏机。形状像 Switch，但里面跑的是 PC 游戏，操作系统是 Linux。三年下来 IDC 估算累计卖了接近 400 万台。Linux 跑 Windows 游戏这件事，从极客玩具变成了消费电子。

但所有这些进步都是在做同一件事，翻译。

Wine 翻译 Windows API。DXVK 翻译 DirectX。VKD3D 翻译 Direct3D 12。每一层都是把 Windows 的指令重新写成 Linux 能听懂的话。翻译可以做得很好，但翻译永远是翻译，总有一些东西译不动。

最难译的那个东西，叫同步原语。

---

Windows NT 内核里有一类对象，event、mutex、semaphore，专门用来做线程之间的协调。游戏里那种「等渲染线程画完这一帧，再让物理线程算下一帧」就是用这套机制做的。一个现代游戏在这些对象上等待的频率，一秒钟轻松上百万次。

Wine 之前的做法是，所有这些等待都送到一个叫 wineserver 的用户态进程里去裁判。一个游戏每跑一帧，要在自己的进程和 wineserver 之间来回切换上百次。游戏越复杂，wineserver 越成为瓶颈。

CodeWeavers 有个工程师叫 Elizabeth Figura，wineserver 这个瓶颈她琢磨了八年。

NTSync 之前她试过两次软方案。先做了一个叫 esync 的，让 Wine 用 Linux 自带的轻量信号机制绕过 wineserver。但 Linux 给每个程序分配的「句柄槽」是有限的，游戏一开多就把这些槽撑爆。她又做了 fsync，换成另一种更轻的锁机制，更快。但 fsync 需要用户自己打内核补丁才能用，普通玩家根本搞不动。

折腾这两轮下来，她明白了，绕不过去，必须直接给 Linux 内核加一个新驱动，让内核帮忙处理 Windows 风格的同步对象。

2023 年 11 月，她在 Linux Plumbers Conference 上做了一场叫《Emulating NT synchronization primitives in Wine》的演讲，把这套设计说了出来。2024 年 1 月，第一版 RFC 发出去，32 个 patch 一口气交上去。社区审了一年。2025 年 3 月，NTSync 跟着 Linux 6.14 合进主线，在 `/dev/ntsync` 这个设备文件后面落了脚。

但内核里有了不等于 Wine 真在用。又过了 9 个月，2026 年 1 月 13 日，Wine 11.0 stable 发布，默认开 NTSync。再过几个月 Proton 11 跟着把这套打进了 Steam Deck。

文章开头那个 Dirt 3 跑分，就是 NTSync 全程跑通后量出来的。

---

我对这件事最感兴趣的不是性能数字。

是这件事的方向。

Wine 苟了 33 年，一直在做的是把 Windows 的概念翻译给 Linux 听。从某种意义上讲，Wine 是 Linux 在 Windows 面前低头，是「我配合你」。

但 NTSync 这一步，方向反过来了。Linux 内核为了跑 Windows 程序，自己长出了一个叫 NT 同步对象的设备。它不是翻译 Windows 概念的接口，它就是 Windows 的概念，被原封不动嫁接到 Linux 内核里。

你电脑上那个 `/dev/ntsync`，名字里那两个字母 NT，是 Windows NT 内核的 NT。

开源社区花了 33 年得出的结论是，与其没完没了地翻译，不如把对方的器官长出来。

---

商业世界过去几十年里讲的故事都是「替代」。Linux 替代 Windows，开源替代闭源，云替代本地。但替代这件事其实很少真的发生，Windows 的桌面市场份额还稳稳压着 Linux。

真正在发生的事情比替代慢，也比替代深。它叫吸收。开源世界一点一点把闭源世界里被验证过好用的概念，磨平专利、剥掉商标、重新实现一遍，焊进自己的代码里。Linux 内核里站着 Windows 风格的同步对象，文件系统里站着从 Solaris 移植来的 ZFS。每一块都是从外面那个世界里抠下来的器官。

那个曾经「装了 Linux 也得切回 Windows 才能玩游戏」的世界，正在悄悄消失。

那个 `/dev/ntsync`，是 1993 年那条邮件列表上「我们也想玩儿游戏」的念头，2026 年长在 Linux 内核里的样子。