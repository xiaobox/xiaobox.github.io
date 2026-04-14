---
title: "用户主目录下为什么会有这么多乱七八糟的 “点开头”的文件 ？没人管管吗？"
slug: 2023-11-27-yong-hu-zhu-mu-lu-xia-wei-shen-me-hui-you-zhe-me-duo-luan-qi
description: "你的电脑里在 用户主目录（HOME）下是不是也有这么多乱七八糟的以点开头的文件和文件夹呢？"
date: 2023-11-27T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-27-yong-hu-zhu-mu-lu-xia-wei-shen-me-hui-you-zhe-me-duo-luan-qi/cover.jpg
original_url: https://mp.weixin.qq.com/s/BMA2ic_tv2UYDP-bM7M5Zg
categories:
  - 系统底层
tags:
  - Go
  - 缓存
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-27-yong-hu-zhu-mu-lu-xia-wei-shen-me-hui-you-zhe-me-duo-luan-qi/001-5c589949.png)

你的电脑里在 用户主目录（HOME）下是不是也有这么多乱七八糟的以点开头的文件和文件夹呢？

我知道他们都是是各个软件在安装和使用时创建的，这玩意一般看不见，因为以 “.” 开头的是隐藏文件，但是随着软件越装越多，这种 "." 开头的文件也越来越多，感觉好混乱呀。

于是查了一下原因：

> “
> 
> 在类 Unix 系统中，用户主目录下的以点（.）开头的文件夹通常是隐藏文件夹。这种隐藏的命名约定是为了将这些文件和文件夹从普通的目录列表中隐藏起来，以避免视觉上的混乱。这对于存储用户配置文件、缓存或其他应用程序数据非常有用，因为这些文件夹通常包含对用户不直接有用的信息。
> 
> ”

隐藏文件和文件夹的一个重要目的之一就是为了防止用户在正常使用系统时误删除它们。

话虽这么说，但对于有强迫症的我来说，还是感觉没有“秩序” ，还有没有王法了？难道就没有个规矩来规范一下这个行为吗？

你别说，还真有！

> “
> 
> 随着软件的安装和使用，用户主目录下的隐藏文件和文件夹可能会变得相当杂乱。为了解决这个问题，XDG Base Directory Specification 提供了一个标准化的方法，以规范用户数据、配置和缓存文件的存放位置，从而提高系统的整体组织性。这个规范旨在减少用户主目录下以点开头的直接子目录的数量，使之更加清晰和有序。
> 
> ”

XDG ? 这是啥？为什么叫这个名字？

XDG 最初是 "X Desktop Group" 的缩写，指的是一个早期的 X Window System 桌面环境的协作组。这个规范最早由 XDG 组织提出，后来被纳入了 Freedesktop.org，一个致力于协调自由桌面软件项目的合作社区。尽管 "X Desktop Group" 这个名称不再准确反映规范的用途，但 "XDG" 作为一个术语仍然被广泛使用。

### XDG Base Directory Specification

具体的规范内容在这儿：https://specifications.freedesktop.org/basedir-spec/basedir-spec-0.6.html

该规范通过定义一个或多个与文件所在位置相关的基本目录来定义应在何处查找这些文件。

其实就是定义了一套指向应用程序的环境变量，这些变量指明的就是这些程序应该存储的基准目录。而变量的具体值取决于用户，若用户未指定，将由程序本身指向一个默认目录，该默认目录也应该遵从标准，而不是用户主目录。

比如：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-27-yong-hu-zhu-mu-lu-xia-wei-shen-me-hui-you-zhe-me-duo-luan-qi/002-86c6ebb5.png)

当然不同操作系统的位置可能不一样

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-27-yong-hu-zhu-mu-lu-xia-wei-shen-me-hui-you-zhe-me-duo-luan-qi/003-6a6268fe.png)

最主要的就三个要点：

-   在 $XDG\_DATA\_HOME 中写入用户特定数据
-   在 $XDG\_CONFIG\_HOME 中写入配置文件
-   在 $XDG\_CACHE\_HOME 中写入缓存文件

下面是一个简单的示例，演示如何在 Go 语言中使用 XDG 规范：

```go
package main

import (
 "fmt"
 "os"
 "path/filepath"
)

func main() {
 // 获取 XDG_DATA_HOME 环境变量，如果不存在则使用默认值
 xdgDataHome := os.Getenv("XDG_DATA_HOME")
 if xdgDataHome == "" {
  xdgDataHome = filepath.Join(os.Getenv("HOME"), ".local", "share")
 }

 // 获取 XDG_CONFIG_HOME 环境变量，如果不存在则使用默认值
 xdgConfigHome := os.Getenv("XDG_CONFIG_HOME")
 if xdgConfigHome == "" {
  xdgConfigHome = filepath.Join(os.Getenv("HOME"), ".config")
 }

 // 获取 XDG_CACHE_HOME 环境变量，如果不存在则使用默认值
 xdgCacheHome := os.Getenv("XDG_CACHE_HOME")
 if xdgCacheHome == "" {
  xdgCacheHome = filepath.Join(os.Getenv("HOME"), ".cache")
 }

 // 打印结果
 fmt.Printf("XDG_DATA_HOME: %s\n", xdgDataHome)
 fmt.Printf("XDG_CONFIG_HOME: %s\n", xdgConfigHome)
 fmt.Printf("XDG_CACHE_HOME: %s\n", xdgCacheHome)
}

```

然而，仍然存在一些特定的应用程序或开发者选择在用户主目录下创建自己的隐藏文件夹，而不一定遵循 XDG 规范。这可能是因为某些应用程序在 XDG 规范之前就已经存在，或者开发者有其他特定的理由(也许压根就不知道有这个规范)。
