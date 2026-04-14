---
title: "几个在 Mac 电脑上提高程序员开发效率的小工具"
slug: 2021-11-06-ji-ge-zai-mac-dian-nao-shang-ti-gao-cheng-xu-yuan-kai-fa-xia
description: "快速打开多个 idea 工程 或前端 vscode 工程前提是你安装了 iterm + oh my zsh"
date: 2021-11-06T03:12:08.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-06-ji-ge-zai-mac-dian-nao-shang-ti-gao-cheng-xu-yuan-kai-fa-xia/cover.jpg
original_url: https://mp.weixin.qq.com/s/723JQbncr-PIt5bJiYNVeA
categories:
  - 工具与效率
tags:
  - macOS
  - VSCode
---
### 快速打开多个 idea 工程 或前端 vscode 工程

前提是你安装了 iterm + oh my zsh 这个组合，后面就比较简单了

vscode 比较简单，打开后先 command+shift+p , 然后输入 `shell command` 提示安装 `code` 命令。

安装好后，在 iterm 终端界面，找到想打开的文件或目录，用 `code` 命令加参数打开即可。

idea 需要利用 `open` 命令，比如我在 iterm 终端输入：

`## 用 idea 打开 id_rsa 文件   open -a IntelliJ\ IDEA id_rsa   `

### 显示文件全路径（带文件名）

有时候我们找到一个文件想要把它的全路径复制下来，直接笨的做法是找到文件路径再手动加上文件名，但比较麻烦。

比较快方法是：

mac 下安装过 brew 后用  greadlink 显示带文件名的文件全路径

比如

`$ brew install coreutils   $ greadlink -f file.txt   ## 显示   /Users/baidu/Desktop/file.txt   `

如果你安装了 path finder 自然更简单了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-06-ji-ge-zai-mac-dian-nao-shang-ti-gao-cheng-xu-yuan-kai-fa-xia/001-fd3c3851.jpg)

### 在终端打开 Finder ，或在 Finder 跳转到终端

首先要有 Alfred, 这个一般 mac 用户都装过，然后安装插件 ：https://github.com/LeEnno/alfred-terminalfinder

你可以在终端和文件夹自由切换了

-   ft: open current Finder directory in Terminal
-   tf: open current Terminal directory in Finder
-   fi: open current Finder directory in iTerm
-   if: open current iTerm directory in Finder

下面这些命令需要安装 Path Finder :https://cocoatech.com/#/

-   pt: open current Path Finder directory in Terminal
-   tp: open current Terminal directory in Path Finder
-   pi: open current Path Finder directory in iTerm
-   ip: open current iTerm directory in Path Finder

### Alfred gitlab 插件

这是一个 Alfred 的插件：https://github.com/lukewaite/alfred-gitlab

配置完你司的 gitlab 仓库 token 后，就可以在 Alfred 中使用了，再也不用打开浏览器然后搜索项目了，直接在 Alfred 中输入 gl 即可。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-06-ji-ge-zai-mac-dian-nao-shang-ti-gao-cheng-xu-yuan-kai-fa-xia/002-a2ae404d.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-06-ji-ge-zai-mac-dian-nao-shang-ti-gao-cheng-xu-yuan-kai-fa-xia/003-705524af.jpg)
