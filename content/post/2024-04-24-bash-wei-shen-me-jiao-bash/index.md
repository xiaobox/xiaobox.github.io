---
title: "bash 为什么叫 bash？"
slug: 2024-04-24-bash-wei-shen-me-jiao-bash
description: "了解 bash 为什么叫 bash 同时也回顾了一下相关的历史,以后再看到如 bash、sh 这些 shell 感觉又多了一份亲切感，不再是陌生和冰冷的技术字眼 😁"
date: 2024-04-24T10:32:56.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/cover.jpg
original_url: https://mp.weixin.qq.com/s/qRiRQHxyb--wcFVacHiHsA
categories:
  - 工具与效率
tags:
  - Linux
  - macOS
  - 网络
---
## 回顾

一个常规的 `shell` 脚本长这样：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/001-76e1618f.png)

在 [为什么 shell 脚本的开头要写 #!/bin/bash](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247488536&idx=1&sn=0fbb182b30454686b94f2a9d01142a18&chksm=eb6dab9edc1a2288eb629b1cd8ef088e3c8ac08f3af83a7297f4f057bb0c7c387c279cf65ab5&scene=21#wechat_redirect)  这篇文章中我们介绍过第一行，即

`#!/bin/bash`

-   第一行的作用是：**用于指定默认情况下运行指定脚本的解释器**
-   `#!` 有个专有名词叫 “蛇棒”
-   `/bin/bash` 自然就是指定的那个解释器

于是，接下来我有了今天的这个问题: **bash 为什么叫 bash ?**

## bash 名字的由来

### shell

我们知道无论是 `bash` `zsh` `sh` 都是一种 `shell` ,那就要先从 `shell` 讲起了。

> “
> 
> `Shell` 是一个用户与操作系统交互的界面。可以将其视为一个命令行解释器，它提供了用户输入命令的方式，并且可以将这些命令传递给操作系统进行执行。换句话说，它是用户和操作系统之间的桥梁。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/002-5c18756c.png)

如图所示，作为一个 “壳”  `shell` 的命名还是挺生动的。

你的电脑上其实也或多或少安装了一些 `shell` ，比如我的 Mac 电脑上安装了这些：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/003-be030381.png)

这么多 `shell` ,肯定有一个是当前默认正在使用的，也就是说，当你开启一个新的终端会话时，系统将运行此 `shell`。

你可以如下图所示查询默认 `shell` 是哪个：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/004-1395b94d.png)

### bash

介绍完了 `shell`  ，我们回到问题本身

`bash`  当然也是一种 `shell` 程序，那它为什么叫 `bash` 呢 ？百科是这样说的：

> “
> 
> Bash 是 Brian Fox 为 GNU 项目编写的一种 Unix shell 和命令语言，是 Bourne shell 的自由软件替代品。它的名称是 Bourne-Again SHell 的首字母缩写，与它所替代的 Bourne shell 的名字谐音。该 shell 于 1989 年首次发布，一直被用作大多数 Linux 发行版的默认登录 shell，也是 Linus Torvalds 将 GCC 移植到 Linux 的首批程序之一。

解释一下：

-   是 Bourne-Again SHell 的首字母缩写
-   是谐音，这里指的是 Bourne-Again 谐音 **born again** ,即重生的意思，非常符合，因为 bash 是替代者，替代了 Bourne shell

### Bourne Shell

`Bourne Shell` 又是什么呢？

它属实是 “最熟悉的陌生人” ，说 `Bourne shell` 你不知道 ，但要说 `sh` 你可能就明白了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-04-24-bash-wei-shen-me-jiao-bash/005-456f21be.png)

对，就是它

> “
> 
> Bourne shell 由 Stephen Bourne 在贝尔实验室开发，它是 Thompson shell 的替代品。它于 1979 年在第 7 版 Unix 中发布，分发给高校使用。Bourne shell (sh) 是计算机操作系统的 shell 命令行解释器。Bourne shell 是第 7 版 Unix 的默认 shell。即使大多数用户使用其他 shell，类 Unix 系统仍会继续使用 /bin/sh，即 Bourne shell。

虽然 `Bourne shell` 属于 “老古董” 且被 `bash` 替代了，但并不表示它就没有用了。

在大部分的 Linux 系统中，例如 Debian/Ubuntu、Centos/RHEL 和 Fedora 等， 默认的 Shell 是 Bourne Again Shell (bash)。Bash 是 sh 的超集，包含了 sh 的所有特性，并增加了其他一些改进和新特性，但是也有一些系统使用的默认 Shell 不是 bash，如 Solaris 和 FreeBSD，默认的 Shell 是 Bourne Shell(sh)。

**注意：虽然在一些系统中默认 Shell 是 sh，但 sh 很可能仅仅是指向 bash 或其他 Shell 的一个链接，具体可以通过查看 /bin/sh 是连接到的哪个实际的 Shell 程序来确定。**

通常在 Linux 系统中运行 `ls -l /bin/sh` 命令可以查看 sh 实际指向的是哪个 Shell。

*无论默认的 Shell 是什么，在大部分的 Linux 系统中，用户都可以自由选择使用哪个 Shell。这可以通过修改用户的默认 Shell 设置来实现，相关命令是 `chsh -s`*

## 总结

至此我们清楚了 `bash` 为什么叫 `bash` 同时也回顾了一下相关的历史,以后再看到如 `bash`、`sh` 这些 shell 感觉又多了一份亲切感，不再是陌生和冰冷的技术字眼 😁

哦，BTW,我本地一直用的是`zsh` 但服务器上更多的是 `bash` 你呢? 请在评论区告诉我。
