---
title: "你电脑里每个 .zip 文件的前两个字节，是一个程序员的名字"
slug: 2026-08-09-ni-dian-nao-li-mei-ge-zip-wen-jian-de-qian-liang-ge-zi-jie-s
description: ""
date: 2026-08-09T04:00:00.000Z
image:
original_url:
categories:
  - 行业与思考
tags:
  - Java
  - Docker
  - 算法
---

随便找一个 .zip 文件。

用十六进制编辑器打开它，看前两个字节。

50 4B。

每一个 .zip 文件都是这样开头的。翻成 ASCII 字符，就是 P 和 K。

这不是随机的。P 和 K 是一个人名的缩写。Phil Katz，.zip 格式的发明者。他在格式规范里规定，所有合法的 .zip 文件必须以这两个字节起头，操作系统靠它来识别文件类型。

![每个 zip 文件的前两个字节](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/zip-philkatz-hex-504B-PK.png)

如果你觉得 .zip 文件离自己很远，可以试一个东西。把桌面上任何一个 Word 文档的后缀从 .docx 改成 .zip，然后解压。

能打开。里面是 XML、图片和样式表。2007 年微软设计 Office 新格式的时候，底层选了 .zip。所以 .docx 就是一个压缩包换了个马甲。Excel 的 .xlsx、PowerPoint 的 .pptx 也一样。你安卓手机上每个 .apk 安装包是 .zip 换了后缀。Java 程序的 .jar 文件同理。

这些文件的头两个字节，全是 50 4B。

![它们都是 zip 换了个马甲](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/zip-philkatz-%E6%A0%BC%E5%BC%8F%E6%8D%A2%E9%A9%AC%E7%94%B2.png)

Phil Katz 在 2000 年 4 月被人发现死在密尔沃基一家旅馆的房间里。旅馆叫 Hospitality Inn，房间号 566。他靠在床头柜边上，手边一瓶空的薄荷杜松子酒。法医写的死因是急性胰腺出血，长期酗酒导致。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260809231327572.png)

37 岁。

故事要从一场官司说起。

1986 年，那时候大家靠 BBS 传文件，没有互联网。文件大了传不动，压缩软件是刚需。当时最流行的格式叫 ARC，属于 System Enhancement Associates 这家公司。Phil Katz 看了 ARC 的源码，自己用汇编语言重写了一版兼容工具叫 PKARC，速度快很多。BBS 上的用户很喜欢，传播得很快。

SEA 把他告了。

1988 年法庭请来独立专家对比两边的源码。专家发现 Phil Katz 程序里的注释和 ARC 的注释一模一样，连拼写错误都没改。

他输了，赔了钱，签了和解协议，以后不准再碰 ARC 这个名字。

输完官司，他做了一件当时几乎没有先例的事。

他从头设计了一个全新的压缩格式。算法全换了，性能比 ARC 更好。做完以后，他把整套格式规范公开发布。免费的。任何人都可以用，任何公司都可以做自己的 zip 工具，不用签协议，不用付一分钱。

SEA 把 ARC 格式的规范捂在手里，别人想做兼容工具就面临法律风险。Phil Katz 反过来，直接把规范送给了所有人。


BBS 社区在官司期间就站他这边，觉得 SEA 是大公司欺负小开发者。现在连规范都免费了，.zip 很快把 ARC 挤出了市场。

后面的事大家都知道。Windows 内置了 zip 支持。WinRAR 和 7-Zip 成了装机必备。微软做 Office 文档选了 zip 做底层容器，Google 做安卓安装包选了 zip，Sun 做 Java 包也选了 zip。

一个文件格式能活三十多年还在不断扩散，靠的就是 1989 年那个"谁都可以免费用"的决定。

Phil Katz 自己没能看到这些。

他父亲 1981 年做心脏手术，术后几个小时人就没了。Phil Katz 原本就内向，父亲走后更封闭。密尔沃基当地报纸说过，他喝了酒以后话多一些，笑声也大一些。

到 90 年代末，他创办的 PKWARE 公司里的员工已经不怎么见到他了。有人说他是"自己公司的陌生人"。

他住的公寓被邻居投诉。市政府派人进去检查，看到垃圾堆到膝盖高，地上有腐烂的食物，还有老鼠。光清理费和律师费加起来就花了大约八千美元。

他名下还有几张没处理的逮捕令。酒驾的，弃保潜逃的。

2000 年 4 月 14 日，旅馆前台发现 566 号房间迟迟没有退房。推门进去，看到他一个人坐在地上，靠着床头柜。地上是空酒瓶。

那年他 37 岁。那时候全世界的电脑里已经有几十亿个文件，开头写着他名字的缩写。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/zip-philkatz-%E6%97%85%E9%A6%86%E4%B9%8B%E5%A4%9C.png)
