---
title: "ohmyzsh 新功能解决文件全路径拷贝痛点"
slug: 2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-
description: "今天刚升级了 ohmyzsh 最新版本，发现添加了一个 feature，可以解决文件全路径拷贝的痛点。之前介"
date: 2022-02-28T02:26:52.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-/cover.jpg
original_url: https://mp.weixin.qq.com/s/eD0T4J_UOMTZQF2Bdc53Xg
categories:
  - 工具与效率
tags:
  - macOS
---
今天刚升级了 ohmyzsh 最新版本，发现添加了一个 feature，可以解决文件全路径拷贝的痛点。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-/001-c5b075b2.jpg)

之前介绍过一些方法来解决拷贝文件全路径：

比如：

用 greadlink

`$ brew install coreutils   $ greadlink -f file.txt   ## 显示   /Users/baidu/Desktop/file.txt   `

图形界面下用 path finder

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-/002-1f4abcbe.jpg)

Alfred 插件

在终端打开 Finder ，或在 Finder 跳转到终端

首先要有 Alfred, 这个一般 mac 用户都装过，然后安装插件 ：https://github.com/LeEnno/alfred-terminalfinder

你可以在终端和文件夹自由切换了

ft: open current Finder directory in Terminal tf: open current Terminal directory in Finder fi: open current Finder directory in iTerm if: open current iTerm directory in Finder

下面这些命令需要安装 Path Finder :https://cocoatech.com/#/

pt: open current Path Finder directory in Terminal tp: open current Terminal directory in Path Finder pi: open current Path Finder directory in iTerm ip: open current iTerm directory in Path Finder

相比上面这些方法 ohmyzsh 显得更直接，使用和记忆起来更舒服。

具体要先升级 ohmyzsh 最新版本，然后配置插件

`vi ~/.zshrc   `

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-/003-5dafe9c9.jpg)

文件修改后保存，打开一个新的窗口，执行 copypath 命令就可以把文件的全路径拷贝到剪切板了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-28-ohmyzsh-xin-gong-neng-jie-jue-wen-jian-quan-lu-jing-kao-bei-/004-a6fabdba.jpg)

copypath 命令的使用方法：

``- `copypath`: copies the absolute path of the current directory.      - `copypath <file_or_directory>`: copies the absolute path of the given file.   ``
