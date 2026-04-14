---
title: "为什么 shell 脚本的开头要写 #!/bin/bash"
slug: 2023-11-09-wei-shen-me-shell-jiao-ben-de-kai-tou-yao-xie-bin-bash
description: "我们通常看到的脚本文件总是有以下这样的开头：#!/bin/bash本文解释一下这是什么，以及为什么要写它。"
date: 2023-11-09T14:11:09.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-09-wei-shen-me-shell-jiao-ben-de-kai-tou-yao-xie-bin-bash/cover.jpg
original_url: https://mp.weixin.qq.com/s/ilKtA4c3_xQK5ZjwrCZIFw
categories:
  - 工具与效率
tags:
  - Linux
---
我们通常看到的脚本文件总是有以下这样的开头：

`#!/bin/bash   `

本文解释一下这是什么，以及为什么要写它。

首先解释一下 `#!` ，因为 `#!`有个专有的名词，叫 `shebang`

发音类似中文的 “蛇棒” 。为什么叫 `shebang` 呢？首先 `#` 的英文是 sharp, 而 感叹号 `!` 经常被引用为炸弹，炸弹爆炸就是 bang , 所以  sharp+bang，简读为 `shebang`

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-09-wei-shen-me-shell-jiao-ben-de-kai-tou-yao-xie-bin-bash/001-d9196731.png)

后面的 `/bin/bash` 就比较熟悉了，它是 Bash Shell 的二进制执行文件路径。是 Unix 类操作系统中最常用的 Shell 程序之一。

所以  `#!/bin/bash`  的作用是：用于指定默认情况下运行指定脚本的解释器

当脚本以 `#!/bin/bash` 开头时，内核就知道用 /bin/bash 这个可执行文件来解释并运行这个脚本。

既然是指定一个解释器，那么这个开头就可以根据你指定的解释器有多种不同写法了，比如：

`#!/bin/sh   #!/bin/bash   #!/usr/bin/perl   #!/usr/bin/tcl   #!/bin/sed -f   #!/usr/awk -f   `

上边每一个脚本头的行都指定了一个命令解释器，注意：#! 后边给出的路径名必须是正确的，否则将会出现一个错误消息，通常是"Command not found"

> “
> 
> 如果是/bin/sh，那么就是默认 shell（在 Linux 系统中默认是 Bash)。使用#!/bin/sh，在大多数商业发行的 UNIX 上，默认是 Bourneshell，这将让你的脚本可以正常的运行在非 Linux 机器上，虽然这将会牺牲 Bash 一些独特的特征
> 
> ”

### 例子

假设我们有一个名为 “shell\_script” 的脚本文件，文件内容如下

`#!/bin/bash   `

然后我们准备执行这个文件

`$ chmod u+x shell_script      $ ./shell_script      `

当我们执行  `./shell_script` 这行命令的时候由于脚本添加了 shebang，相当于在命令行这样执行：

`/bin/bash shell_script   `

你可能会有疑问：我写的脚本里面没有 shebang ，它也能正常执行啊？

是的，这是由于如果你不指定解释器，它就会去找系统默认的 bash ，你可以看一下你系统默认的 bash 是什么

我的是 zsh , 因为这是我设置的 (echo $0 打印当前使用的 shell)

`❯ echo $0   /bin/zsh   `

也就是说，如果我不写 shebang ，那么系统会用正在运行的 zsh 来执行脚本 。

源码的解释是这样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-09-wei-shen-me-shell-jiao-ben-de-kai-tou-yao-xie-bin-bash/002-3b3d4267.png)

### 有趣的地方

有时候 shebang 行不必具有 shell 的可执行文件。它可以是任何东西。

例如，我将`#!/bin/zsh`替换为`#!/bin/cat`，cat 命令将成为 shell 的解释器。

`❯ ./shell_script   #!/bin/cat      hello world      `

这意味着现在这个脚本将使用 cat 命令运行并显示脚本的内容。它将输出脚本所有内容。只要它指向一个可执行命令，它就会工作。如果你随便放一些不存的命令，它会抛出错误。

当然这些逻辑也是 C 函数来实现的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-09-wei-shen-me-shell-jiao-ben-de-kai-tou-yao-xie-bin-bash/003-dd363e6c.png)

## 参考

-   https://blog.twentytwotabs.com/the-smallest-bash-program-in-the-universe/
