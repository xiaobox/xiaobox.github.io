---
title: "为什么 sshd、dockerd、systemd 的末尾，都带着一个字母 d？"
slug: 2026-10-29-wei-shen-me-sshd-dockerd-systemd-de-mo-wei-dou-dai-zhe-yi-ge
description: ""
date: 2026-10-29T04:00:00.000Z
image:
original_url:
categories:
  - 系统底层
tags:
  - Linux
  - macOS
---

你在 Linux 上查进程或者重启服务，看到的名字几乎都有同一个后缀。

`sshd`、`httpd`、`mysqld`、`dockerd`、`crond`、`systemd`。

清一色，全以字母 `d` 结尾。

这个 `d` 是 `daemon` 的首字母，中文一般翻成「守护进程」，指那些在后台一直跑着、不跟用户直接交互的程序。

「守护进程」这个名字听着很温和，像个保安。但如果你去查英文原词 `daemon`，它的读音是 `/ˈdiːmən/`，跟英语里的恶魔 `demon` 发音完全一样。

早年 BSD Unix 的吉祥物 Beastie，画出来的样子干脆就是一个长着犄角、脚穿帆布鞋、手拿三叉戟的红色小恶魔。

好端端的系统后台程序，为什么会取一个跟恶魔同音的名字。

这事得算到麻省理工学院（MIT）头上。

1963 年，MIT 的 Project MAC 实验室正在开发最早的分时操作系统 CTSS，带队的人叫 Fernando Corbató，后来拿了 1990 年的图灵奖。

在 CTSS 之前，计算机是批处理机。一个人抱着一摞穿孔卡片进机房，算完把结果打在纸上，人一走，机器就空下来了。

CTSS 改成了分时复用，几十个研究人员通过电传打字机一起连在一台 IBM 7094 主机上干活。大家每天往磁盘上写文件，磁盘容量很小，必须定期把改过的文件备份到磁带上。

靠人手动敲命令去备份太容易忘。Corbató 的团队就写了一类新程序，不挂在任何用户的终端下面，平时在后台待着，趁机器空闲就自己跑起来，把文件抄到磁带上。

![后台程序悄悄把文件备份到磁带，概念插画](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/daemon-background-tape-backup.png)

这种没人操作自己干活的程序，以前没出现过，团队得给它起个名。

MIT 那帮人大多有物理学背景，他们借用了英国物理学家麦克斯韦在 1867 年提出的一个概念，「麦克斯韦妖」（Maxwell's Demon）。

麦克斯韦在讨论热力学第二定律时，设想过一个看不见的小妖怪，守在两个气室中间的门边。它看到运动快的热分子就开门放过去，看到慢的冷分子就挡回来，一直在那分拣分子。

![麦克斯韦妖控制两个气室之间的小门，按分子速度分拣，概念示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/daemon-maxwell-molecular-gate.png)

Corbató 后来回忆这件事，原话是，「We fancifully began to use the word daemon to describe background processes that worked tirelessly to perform system chores.」

意思是，他们觉得后台这些不知疲倦干杂活的程序，跟那个分拣分子的麦克斯韦妖很像，就拿这个词当了名字。

至于为什么拼成 `daemon`，中间多了一个字母 `a`，这是古希腊语里的老拼法。

在古希腊神话里，`daemon` 指介于神和人之间的一种精灵，平时看不见，主要在暗中帮人干活，跟后来西方传说里害人的魔鬼不是一回事。国内早年翻译 Unix 资料的人很讲究，顺着古希腊这层「暗中相助」的意思，把它译成了「守护进程」。

这个 MIT 实验室里的内部黑话，很快传到了贝尔实验室。

当年肯·汤普逊和丹尼斯·里奇都参与过 MIT 主导的 Multics 项目，1969 年俩人回贝尔实验室写 Unix，把 `daemon` 这个词也带了回去。

早期的电传打字机和字符终端很窄，`ps` 命令打出来的进程名就那么几个字母。为了让人扫一眼就能区分哪个是普通命令、哪个是常驻后台的程序，Unix 定了个习惯，后台守护进程的可执行文件，名字末尾统一加个 `d`。

远程登录的客户端叫 `ssh`，后台服务端就叫 `sshd`。管定时任务的叫 `crond`，管网络的叫 `inetd`，一直延续到后来的 `dockerd` 和 `systemd`。

1984 年，当时还在卢卡斯影业计算机部门工作的 John Lasseter（后来创办了皮克斯，拍了《玩具总动员》），给 BSD 画了那只红色小恶魔吉祥物。他在小恶魔手里画了一把三叉戟，也有一层双关。

三叉戟在英文里叫 `fork`。在 Unix 里写一个守护进程，第一步就是调系统函数 `fork()` 把自己复制一份，接着父进程直接退出，留下子进程调用 `setsid()` 脱离原来的终端，自己去后台单过。

所以守护进程在操作系统里的真实身份，其实是「孤儿进程」（Orphan Process）。生它的父进程一出生就不管它了，它只能被系统里进程号为 1 的老祖宗 `init`（现在大多是 `systemd`）收养，一直跑到关机。

这词后来还惹出过一点麻烦。

八十年代 Unix 卖进不少企业和政府机构，一些不懂计算机的采购人员看到文档里到处是 `daemon`，怀疑这帮程序员在系统里塞了什么怪力乱神的私货。《Unix 系统管理手册》的作者 Evi Nemeth 特意在书里解释过一回，说总有人觉得 Unix 跟地下世界有什么联系，纯属误会。

为了少跟外行费口舌，后来有人顺着 `D-A-E-M-O-N` 六个字母，倒推编造了一个全称，叫 `Disk And Execution MONitor`，磁盘与执行监控器。

听着像那么回事，但它是后来硬凑出来的。

那个挂在 `sshd` 和 `dockerd` 尾巴上的字母 `d`，源头不在机房的监控手册里，它在 1867 年的物理课本里。
