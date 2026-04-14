---
title: "还在用 top htop? 赶紧换 btop 吧，真香！"
slug: 2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang
date: 2024-09-17T03:35:33.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/Qr-z0-zL44UjnItmDlsMzg
categories:
  - 系统底层
tags:
  - Linux
  - macOS
---
## top

在 Linux 服务器上，或类 Unix 的机器上，一般我们想查看每个进程的 CPU 使用率、内存使用情况以及其他相关信息时会使用 top 命令。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/001-8b55ddd9.png)

top 是一个标准的 Linux/Unix 工具，实际上我从一开始接触 Linux 就一直使用 top , 一般是两种场景：

-   Linux 服务器上用
-   自己的 Mac 电脑上用

top 有一些常用的功能，比如可以动态的显示进程的情况，按照 CPU 、内存使用率排序等。说实话，这么多年了，使用最多的还就是 top ，一来是因为习惯了，工具用惯了很多操作都是肌肉记忆。二来是 top 一般系统自带不用安装，省事儿。

## htop

top 挺好的，但 top 对于初学者和小白用户不太友好，尤其是它的用户界面和操作。于是后来有了 htop

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/002-b91d4627.png)

htop 是 top 的一个增强替代品，提供了更加友好的用户界面和更多的功能。与 top 相比，htop 默认以颜色区分不同的信息，并且支持水平滚动查看更多的进程信息。htop 还允许用户使用方向键来选择进程，并可以直接发送信号给进程（如 SIGKILL）。htop 支持多种视图和配置选项，使得用户可以根据自己的喜好定制显示的内容。

htop 我也用了几年，确实舒服一些，但由于需要安装和我对 top 的肌肉记忆 ，htop 在我的使用中并未完全替代 top。直到 btop 的出现

## btop

现在，我本机使用的是 btop，有了 btop，top 和 htop 一点儿都不想用了，哈哈。

在服务器上有时候因为懒不想安装，一部分时间还是 top，一部分用 btop。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/003-4fc781d1.png)

第一印象是真漂亮啊，然而它不止好看，功能也是很实用，操作还很简单，你说能不喜欢它吗？

说是 btop ，实际上人家真正的名字是 btop++ , 用 C++ 开发的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/004-e864c170.png)

### 安装

btop 支持各种类 Unix 系统，你可以在它的文档中找到对应系统的安装方法 https://github.com/aristocratos/btop

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/005-e7fdf7ee.png)

本文演示，我是用我自己的 Mac 笔记本电脑，用 Mac 安装很简单，用 brew 一行搞定

`brew install btop   `

我的系统情况是这样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/006-1cdea30e.png)

安装完成后，直接运行 `btop` 就可以看到如上图的界面了。

### 功能界面

打开 btop 后不要被它的界面唬住了，其实非常的简单，我们来介绍一下。

打开 btop 后，其实显示的是它给你的 “预置” 界面。默认有 4 个预置界面，你可以按 `p` 键进行切换。命令行界面上会分别显示：

-   preset 0
-   preset 1
-   preset 2
-   preset 3

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/007-f896ac8c.png)

你可能注意到了，这 4 个预置界面中有很多内容是重复的，没错，其实 btop 一共就 4 个模块，预置界面只是把不同的模块拼在一起显示罢了。这 4 个模块分别是：

-   CPU 模块
-   存储 模块
-   网络 模块
-   进程 模块

这 4 个模块对应的快捷键分别就是 `1`，`2`，`3`，`4` 你按一下模块显示，再按一下模块隐藏。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/008-838380bb.png)

所以如果你对预置界面的内容想立刻调整，就可以按快捷键来显示/隐藏 你想要的模块，当然预置界面也是可以通过配置文件调整的，这个我们后面说。

### CPU 模块

CPU 模块可以显示 CPU 型号、各内核的使用率、温度，CPU 整体的负载，以及一个直观的图象，所有数据都是实时显示的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/009-ef0561ee.png)

### 存储 模块

存储模块包括两部分，一个是内存使用情况，一个是磁盘使用情况：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/010-34e5ee3c.png)

因为比较直观，具体内容我就不解释了。

### 网络模块

网络模块可以看下网络的整体负载和吞吐情况，主要包括上行和下行数据汇总，你可以通过按快捷键 `b`和`n` 来切换看不同的网卡。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/011-31fca377.png)

### 进程模块

初始的进程模块可以看到：

-   pid
-   Program: 进程名称
-   Command: 执行命令的路径
-   Threads: 进程包含的线程数
-   User: 启动进程的用户
-   MemB: 进程所占用内存
-   Cpu%: 进程所占用 CPU 百分比

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/012-a3cad264.png)

你可以按快捷键 `e` 显示树状视图：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/013-f647b540.png)

可以按快捷键 `r` 对进行排序，按一下是倒序，再按一下是正序。具体排序列可以按`左右箭头`，根据界面显示进行选择，比如我要按照内存使用排序，那么右上角就是这样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/014-c54dab64.png)

按 `f` 键输入你想过滤的内容然后回车，可以过滤一下界面显示的内容，比如我只想看 chrome 的进程情况：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/015-0f03ba62.png)

还可以通过 上下箭头选中某一个进程按回车查看进程详情，再次按回车可以隐藏详情：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/016-2eecbd46.png)

显示进程详情后可以对进程进行操作，比如 `Kill` 只需要按快捷键 `k` 就可以了，然后会弹出提示：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/017-87c8e117.png)

### 主题

怎么样，是不是很方便，操作简单，上手容易，还好看。关于 btop 的主要操作就这些了，剩下的可以参考 `help` 和 `menu` 中显示的内容自行操作和设置都很简单。

btop 的配置文件默认在这里：`$HOME/.config/btop` ，你可以直接修改配置文件中的详细参数，如我们前文提到的 “预置” 界面以及预置界面内容都可以在配置文件中设置 ：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/018-cbd33297.png)

此外 btop 还有很多好看的主题配色，但默认安装的情况下只带了一个 `Default` 的，如果你想切换用其他的主题，需要先下载这些主题，主题文件在这里：https://github.com/aristocratos/btop/tree/main/themes

下载好以后放到本地对应的文件夹中 `~/.config/btop/themes`

然后你就可以要界面上进行主题的切换了，具体流程是先按快捷键 `m` ，然后选 OPTIONS

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/019-9b019758.png)

接着在 Color theme 中就能看到你当前拥有的 theme 数据，按方向键就可以切换主题配色了：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/020-f1050548.png)

主题有很多，我这里给大家一个完整的预览：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-17-hai-zai-yong-top-htop-gan-jin-huan-btop-ba-zhen-xiang/021-9d21672b.jpg)

我目前使用的就是 `Default` 我觉得最符合我的审美。

## 最后

用了 btop 后你就再也回不去了，一般情况下再也不会想用 htop 和 top 了，大家没有换的可以直接换了
