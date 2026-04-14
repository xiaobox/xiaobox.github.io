---
title: "Vim 从何而来"
slug: 2023-11-04-vim-cong-he-er-lai
description: "Vim 编辑器的创造者、维护者和终身领导者 Bram Moolenaar 于 2023 年 8 月 3 日因"
date: 2023-11-04T06:38:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/cover.jpg
original_url: https://mp.weixin.qq.com/s/lJpNKAPo2hIkEy-PHWKpaQ
categories:
  - 工具与效率
tags:
  - JVM
  - Linux
  - macOS
  - Vim
---
Vim 编辑器的创造者、维护者和终身领导者 Bram Moolenaar 于 2023 年 8 月 3 日因病去世，享年 62 岁

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/001-f4d5def9.png)为了纪念这位杰出的荷兰程序员，我们今天来聊一聊 Vim 的历史。

Vim 无处不在。它被很多人使用。同时 Vim 可能是世界上 “最难用的软件之一” ，但是又多次被程序员们评价为 最受欢迎的 代码编辑器。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/002-74d85dda.png)

Vim 预装在 Mac OS 上，并且在 Linux 领域拥有大量支持者。即使对于那些讨厌它的人来说，它也很熟悉，因为足够流行的命令行工具会默认将用户带入 Vim。

有一些主要网站，包括 Facebook，当你按 `j` 键时会向下滚动，当你按 `k` 键时会向上滚动 — 这就是通过 Vim 的广泛传播而形成的文化。

然而 Vim 也是一个谜。

例如，与众所周知的由 Facebook 开发和维护的 `React` 不同，Vim 没有明显的赞助商。

尽管它无处不在且很重要，但似乎没有任何类型的委员会或组织对 Vim 做出决策。

你可能会花几分钟浏览 Vim 网站（https://www.vim.org），但无法更好地了解谁创建了 Vim 或为什么创建。

如果你启动 Vim 时没有给它提供文件参数，那么你将看到 Vim 的启动消息，其中显示 Vim 是由“Bram Moolenaar 等人”开发的。但这并不能告诉你太多。布拉姆·穆勒纳尔 (Bram Moolenaar) 是谁？他的合作者又是谁？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/003-4ef42ca2.png)

也许更重要的是，为什么退出 Vim 需要输入 `:wq` ？

当然，这是一个“写入”操作，然后是一个“退出”操作，但这并不是一个特别直观的约定。谁决定复制文本应该被称为“yanking”？为什么 `:%s/foo/bar/gc` 是“查找和替换”的缩写？Vim 的特性似乎太随意了，不可能是虚构的，但它们是从哪里来的呢？

正如通常的情况一样，答案始于古老——贝尔实验室。从某种意义上说，Vim 只是一个软件的最新版本——称之为“wq 文本编辑器”——自 Unix 时代开始以来一直在不断开发和改进。

## Ken Thompson 编写了一个行编辑器

1966 年，贝尔实验室聘请了 Ken Thompson。汤普森刚刚在加州大学伯克利分校获得了电气工程和计算机科学硕士学位。在那里，他使用了一个名为 QED 的文本编辑器，该编辑器是在 1965 年至 1966 年间为伯克利分时系统编写的。

汤普森到达贝尔实验室后做的第一件事就是为麻省理工学院兼容时间重写 QED - 共享系统。后来他为 Multics 项目编写了 QED 的另一个版本。在此过程中，他扩展了该程序，以便用户可以搜索文件中的行并使用正则表达式进行替换。

Multics 项目与伯克利分时系统一样，旨在创建一个商业上可行的分时操作系统，该项目是麻省理工学院、通用电气和贝尔实验室之间的合作项目。AT&T 最终认为该项目毫无进展并退出。

汤普森和贝尔实验室研究员丹尼斯·里奇现在无法访问分时系统，他们开始创建自己的版本，最终被称为 Unix。1969 年 8 月，当他的妻子和年幼的儿子去加利福尼亚度假时，Thompson 组装了新系统的基本组件，“为操作系统、shell、编辑器各分配了一周的时间”。

编辑器将被称为 `ed` 。它基于 QED，但并不是精确的重新实现。Thompson 决定放弃某些 QED 功能。正则表达式支持被削减，以便只能理解相对简单的正则表达式。QED 允许用户通过打开多个缓冲区来一次编辑多个文件，但 `ed` 一次只能使用一个缓冲区。尽管 QED 可以执行包含命令的缓冲区，但 `ed` 不会执行此类操作。可能需要进行这些简化。Dennis Ritchie 表示，没有 QED 的高级正则表达式“并没有多大损失”

`ed` 现在是 POSIX 规范的一部分，因此如果你有兼容 POSIX 的系统，则可以将其安装在你的计算机上。它值得一试，因为许多 `ed` 命令如今已成为 Vim 的一部分。例如，为了将缓冲区写入磁盘，你必须使用 `w` 命令。为了退出编辑器，你必须使用 `q` 命令。这两个命令可以同时在同一行指定 - `wq` 。

与 Vim 一样， `ed` 是一个模式编辑器；要从命令模式进入输入模式，你可以使用插入命令（ `i` ）、附加命令（ `a` ）或更改命令（ `c` ），取决于你如何转换文本。`ed` 还引入了用于查找和替换（或“替换”）文本的 `s/foo/bar/g` 语法。

鉴于所有这些相似之处，你可能认为普通 Vim 用户使用 `ed` 不会遇到任何问题。但 `ed` 在另一个重要方面与 Vim 完全不同。`ed` 是一个真正的行编辑器。它是在电传打字机时代编写并广泛使用的。当 Ken Thompson 和 Dennis Ritchie 攻克 Unix 时，他们看起来像这样：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/004-b07e8a57.png)

`ed` 不允许你在打开缓冲区的其他行之间编辑行，或移动光标，因为 `ed` 每次都必须重新打印整个文件对其进行了更改。1969 年的时候， `ed` 还没有“清除”屏幕内容的机制，因为屏幕只是一张纸，已经输出的所有内容都是用墨水输出的。必要时，你可以要求 `ed` 使用列表命令 ( `l` ) 为您打印出一系列行。因此，使用 `ed` 有点像试图用功率不足的手电筒在黑暗的房子里寻找出路。你一次只能看到这么多，所以你必须尽力记住所有东西在哪里。

这是 `ed` 会话的示例。我添加了注释（在 # 字符之后）来解释每行的用途

```bash
[tt 09:49 ~]$ ed
i                           # Enter input mode
Hello world!

Isn't it a nice day?
.                           # Finish input
1,2l                        # List lines 1 to 2
Hello world!$
$
2d                          # Delete line 2
,l                          # List entire buffer
Hello world!$
Isn't it a nice day?$
s/nice/terrible/g           # Substitute globally
,l
Hello world!$
Isn't it a terrible day?$
w foo.txt                   # Write to foo.txt
38                          # (bytes written)
q                           # Quit
[sinclairtarget 10:50 ~]$ cat foo.txt
Hello world!
Isn't it a terrible day?

```

## Bill Joy 编写了一个文本编辑器

`ed` 对于 Thompson 和 Ritchie 来说工作得足够好。但其他人发现它很难使用，并且它被认为是 Unix 对新手特别不友好的一个例子。

1975 年，一位名叫 George Coulouris 的人在伦敦玛丽女王学院安装的 Unix 系统上开发了 ed 的改进版本。

与 `ed` 不同，Coulouris 的程序允许用户在屏幕上编辑一行，逐个按键地浏览该行。Coulouris 称他的程序为 em ，或“凡人的编辑器”

1976 年，Coulouris 带着 `em` 来到加州大学伯克利分校，并以客座教授的身份在加州大学伯克利分校度过了一个夏天。此时距离肯·汤普森离开伯克利去贝尔实验室工作整整十年了。在伯克利，Coulouris 遇到了 Bill Joy，他是一名从事 Berkeley Software Distribution (BSD) 工作的研究生。Coulouris 向 Joy 展示了 `em` ，Joy 从 Coulouris 的源代码开始构建了 `ed` 的改进版本，称为 `ex` ，用于“扩展 `ed` 的 1.1 版本与 1978 年 BSD Unix 的第一个版本捆绑在一起。`ex` 很大程度上与 `ed` 兼容，但它增加了两种模式：“open”模式，它启用了单行编辑，就像 `em` 一样，以及“视觉”模式，它接管整个屏幕并启用整个文件的实时编辑，就像我们今天习惯的那样。

1979 年的第二个 BSD 版本，引入了一个名为 `vi` 的可执行文件，它的作用只不过是在可视模式下打开 `ex` 。

`ex / vi` （此后称为 `vi` ）建立了我们现在与 Vim 关联的大部分约定，这些约定尚未成为 `ed` 的一部分。Joy 使用的视频终端是 Lear Siegler ADM-3A，其键盘没有光标键。相反，箭头被绘制在 `h` 、 `j` 、 `k` 和 `l` 键上，这就是 Joy 使用这些键作为光标的原因 vi 中的移动。ADM-3A 键盘上的退出键也是今天我们可以找到 Tab 键的地方。

命令前缀的`:`字符也来自 `vi` ，在常规模式下（即通过运行 `ex` 输入的模式）使用 `:` 作为提示。这解决了长期以来对 `ed` 的抱怨。在可视模式下，保存和退出现在需要输入经典的 `:wq` 。“Yanking”和“putting”、标记以及用于设置选项的 `set` 命令都是原始 `vi` 的一部分。我们今天在 Vim 中进行基本文本编辑过程中使用的功能主要是 `vi` 功能。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-04-vim-cong-he-er-lai/005-73369976.png)

`vi` 是除 `ed` 之外唯一与 BSD Unix 捆绑在一起的文本编辑器。当时，Emacs 可能要花费数百美元（这是在 GNU Emacs 之前），因此 `vi` 变得非常流行。但 `vi` 是 `ed` 的直接后代，这意味着如果没有 AT&T 源许可证，则无法修改源代码。这促使一些人创建 `vi` 的开源版本。STEVIE（VI 爱好者的 ST 编辑器）出现于 1987 年，Elvis 出现于 1990 年， nvi 出现于 1994 年。其中一些克隆添加了额外的功能，如语法突出显示和分割窗口。尤其是 Elvis，它的许多功能都被纳入了 Vim，因为许多 Elvis 用户都在推动将其纳入其中。

## Bram Moolenaar 撰写 Vim

“Vim” 现在缩写为“Vi Improve”，最初代表“Vi Imitation”。与许多其他 `vi` 克隆一样，Vim 最初是尝试在不可用的平台上复制 `vi` 。Bram Moolenaar 是一位荷兰软件工程师，在荷兰 Venlo 的一家复印机公司工作，他想要为他全新的 Amiga 2000 使用类似 `vi` 的东西。在 1988 年，Moolenaar 以现有的 STEVIE vi 克隆为起点，开始研究 Vim。

Moolenaar 可以访问 STEVIE，因为 STEVIE 之前曾出现在名为 Fred Fish 磁盘的东西上。Fred Fish 是一位美国程序员，他每个月都会寄出一张软盘，其中包含精选的适用于 Amiga 平台的最佳开源软件。任何人都可以索取磁盘，只需支付邮费即可。Fred Fish 磁盘上发布了 STEVIE 的多个版本。Moolenaar 使用的版本已在 Fred Fish 磁盘 256 上发布。

Moolenaar 喜欢 STEVIE，但很快注意到缺少许多 `vi` 命令。因此，对于 Vim 的第一个版本，Moolenaar 将 `vi` 兼容性作为他的首要任务。其他人编写了一系列 `vi` 宏，Moolenaar 能够让这些宏在 Vim 中运行。1991 年，Vim 首次在 Fred Fish 磁盘 591 上发布，名称为“Vi Imitation”。Moolenaar 添加了一些功能（包括多级撤消和针对编译器错误的“快速修复”模式），这意味着 Vim 已经超越了 `vi` 。但 Vim 一直是“Vi Imitation（模仿）”，直到 1993 年通过 FTP 发布 Vim 2.0。

Moolenaar 在各种互联网合作者的偶尔帮助下，稳定地为 Vim 添加了功能。Vim 2.0 引入了对 `wrap` 选项和水平滚动长行文本的支持。Vim 3.0 添加了对分割窗口和缓冲区的支持，该功能受到 `vi` 克隆 `nvi` 的启发。Vim 现在还将每个缓冲区保存到交换文件中，以便编辑后的文本可以在崩溃时幸存下来。Vimscript 首次出现在 Vim 5.0 中，并支持语法突出显示。与此同时，Vim 的受欢迎程度与日俱增。它被移植到 MS-DOS、Windows、Mac，甚至 Unix，与原始的 `vi` 竞争。

2006 年，Vim 被评选为最受 Linux Journal 读者欢迎的编辑器。如今，根据 Stack Overflow 的 2018 年开发者调查，Vim 是最流行的文本模式（即终端仿真器）编辑器，25.8% 的软件开发人员（以及 40% 的系统管理员/DevOps 人员）使用它。有一段时间，在 20 世纪 80 年代末和整个 90 年代，程序员发动了“编辑器战争”，使 Emacs 用户与 `vi` （最终是 Vim）用户对立。虽然 Emacs 当然仍然有一些追随者，但有些人认为编辑器之战已经结束，Vim 获胜了。2018 年 Stack Overflow 开发者调查表明这是事实；只有 4.1% 的受访者使用 Emacs。

Vim 是如何变得如此成功的？显然人们喜欢 Vim 提供的功能。但我认为，Vim 背后的悠久历史表明，它拥有的优势不仅仅是其功能集。Vim 的代码库可以追溯到 1988 年，当时 Moolenaar 开始研究它。“wq 文本编辑器”有几种不同的具体表达方式，但部分归功于 Bill Joy 和 Bram Moolenaar 对向后兼容性的不同寻常的关注，随着时间的推移，好的想法逐渐积累起来。从这个意义上说，“wq 文本编辑器”是运行时间最长、最成功的开源项目之一，得到了计算世界中一些最伟大思想家的贡献。我不认为“初创公司抛弃所有先例并创造颠覆性新软件”的开发方法一定是坏事，但 Vim 提醒我们，协作和增量方法也可以产生奇迹。
