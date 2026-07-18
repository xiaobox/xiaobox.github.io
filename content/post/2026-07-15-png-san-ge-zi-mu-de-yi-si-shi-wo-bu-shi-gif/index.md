---
title: "PNG 三个字母的意思是「我不是 GIF」"
slug: 2026-07-15-png-san-ge-zi-mu-de-yi-si-shi-wo-bu-shi-gif
description: ""
date: 2026-07-15T07:04:05.000Z
image:
original_url:
categories:
  - 杂谈
tags:
  - PNG
  - GIF
  - 图像格式
  - 互联网史
---

<!-- 封面图（2048x1152，AI 生成，西部决斗风）：https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/png-article-cover.png -->

你手机截个图，默认保存的就是 .png

网上存个表情包，也是 .png。

打开任何一个 App，图标底层大概率还是 .png。

这玩意天天见，你有没有想过，PNG 这三个字母到底啥意思？

png 全称叫 Portable Network Graphics，便携式网络图形。

但这个名字是后来改的。它最早叫 PING。

PING Is Not GIF。

对，递归缩写，跟 GNU（GNU's Not Unix）一个套路。光看名字你就能感觉到，这东西刚出来的时候，带着火药味。

![GIF vs PNG](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/png-gif-split.png)

说到这个就得先聊聊 GIF。

你现在想到 GIF，第一反应肯定是动图，表情包，一只猫从桌上摔下去循环播放那种。

但 1987 年 GIF 刚出来的时候，跟动图没有半毛钱关系。那会儿互联网刚起步，网页上想放一张静态图片，基本就靠 GIF。没有 PNG，没有 WebP，没有 JPEG 普及，它就是网上的图片格式，几乎是唯一的那个。CompuServe 的工程师 Bob Berry 设计了它，用了一种叫 LZW 的压缩算法，压得小，传得快。

问题是，LZW 有专利。

1983 年，Sperry 公司的工程师 Terry Welch 发明了这个算法，顺手申请了美国专利。后来 Sperry 跟 Burroughs 合并，变成了 Unisys。LZW 的专利就落到了 Unisys 手里。

Bob Berry 当年设计 GIF 的时候，压根不知道 LZW 有专利。或者知道，但没当回事。那个年代软件专利这事儿，没人真往心里去。

然后这颗雷就这么埋了七年。

GIF 在网上疯狂普及，浏览器在用，图片编辑器在用，个人主页在用，几乎成了互联网图片的唯一选择。大家用得开开心心，完全没想过脚底下踩着一颗专利炸弹。

1994 年 12 月 28 号，圣诞节刚过两天，Unisys 跟 CompuServe 联合发了一份声明，大意就是，以后开发 GIF 相关软件的，都得向 Unisys 交专利授权费。

这时间点选得很妙，圣诞假期，大家都在休假，消息传开得慢。

但互联网这帮人可不是吃素的。

假期一结束，Usenet 上的 comp.graphics 新闻组直接炸了锅。用 PNG 官方历史文档的原话说，场面可以用「壮观」来形容，到处都是骂声、争吵和各种方案。

![1995 年 comp.graphics 新闻组场景复原](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/usenet_1995.png)

*示意图，按 PNG 官方历史时间线复原的当年新闻组场景，不是原始截图*

1995 年 1 月 4 号，声明发出后不到一周，一个叫 Thomas Boutell 的开发者在 comp.graphics 发了一个帖子。

意思很简单，我们自己造一个新格式。不用 LZW，不交专利费，比 GIF 还好。

来吧。

接下来的事几乎可以用「连夜赶工」来形容。Boutell 发帖当天，就有人提出用 DEFLATE 算法替代 LZW。DEFLATE 就是 ZIP 和 gzip 用的那个压缩算法，没有专利问题。同一天，还有人提出了滤波预处理方案来提升压缩率。

也是同一天，Oliver Fromme 给这个新格式取了那个带火气的名字。

PING Is Not GIF。

到 2 月初，一个月出头，规范已经迭代了七版，格式基本定型。1996 年 10 月 W3C 正式把 PNG 列为推荐标准，浏览器一个接一个跟进。

整件事从起因到落地，一年多。一群人在新闻组上吵着吵着，就把一个新的图片标准给吵出来了。

你想想这事儿其实挺离谱的。

一家公司说你用我的算法得交钱，一群互联网上互不认识的人说，交什么钱，我们自己写一个。然后真写出来了。而且比原来那个还好，支持 1600 万色（GIF 只有 256 色），支持透明通道，压缩率也不差。

这就好比一个小区的物业突然说，以后坐电梯要单独交钱。业主们没去投诉，没去打官司，凑在一起自己焊了一部新电梯。还装了空调。

![PNG vs GIF 真实对比](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/png_vs_gif_compare.png)

*同一张渐变图，左边按 GIF 规格真实量化出来的效果，色带和硬边都是真的，右边是 PNG 原图*

后来的事你也知道了。

Unisys 的 LZW 美国专利 2003 年到期了，GIF 又自由了。但 GIF 没能回到图片标准的位置，因为 PNG 已经把那个坑占得死死的。GIF 倒是找到了自己的第二春，变成了动图和表情包的代名词。

所以今天的格局就是这样，PNG 管静态图，GIF 管动图。一个是专利战争的产物，一个是专利过期后的幸存者。它俩当年是死对头，现在反而各管一摊，互不干涉。


其实 PNG 并不是个例。

当年 MP3 收专利费，社区造了 Ogg Vorbis。H.264 和 H.265 视频编码收费收到离谱，Google 和 Mozilla 几家凑一块儿搞了 AV1。Oracle 买下 MySQL 收紧许可证，MySQL 的亲爹转头 fork 了 MariaDB。再往前推，AT&T 不让大学免费用 Unix，一个芬兰大学生在宿舍里写了 Linux...


理由很简单，你收钱，我就重写一个。

