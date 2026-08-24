---
title: "你浏览器的自我介绍，从 1995 年开始全是假话"
slug: 2026-07-19-ni-liu-lan-qi-de-zi-wo-jie-shao-cong-1995-nian-kai-shi-quan
description: "追溯浏览器 User-Agent 字符串三十年的演化：从 Netscape 自称 Mozilla 到 IE、Safari、Chrome 层层冒充前辈，解释为何每个浏览器的自我介绍都是叠加的谎言。"
date: 2026-07-19T04:00:00.000Z
image:
original_url:
categories:
  - 系统底层
tags:
  - User-Agent
  - 浏览器
  - HTTP
  - 互联网史
---
你有没有在浏览器里按过 F12。

随便打开一个网页，切到 Network 面板，点开一条请求，看 Headers 里面那个 User-Agent。

你会看到一串这样的东西。

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
```

你用的明明是 Chrome。

但这串自我介绍里，Chrome 只出现了一次。Mozilla 出现了，Safari 出现了，AppleWebKit 出现了，还有个 KHTML, like Gecko，你可能连这是什么都没听过。

我第一次认真看这行字的时候完全不知道它在说什么。后来查了一圈才发现，这串东西里面，几乎每个词都是一句谎话。

这事得从 1993 年说起。

那年伊利诺伊大学 NCSA 做了一个浏览器叫 Mosaic，这是很多人第一次上网用的浏览器。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260719175748491.png)

第二年，Mosaic 的核心开发者 Marc Andreessen 出来创业，做了个更好的。内部代号叫 Mozilla，Mosaic Killer 的缩写，意思是「Mosaic 杀手」。

这个浏览器后来正式名叫 Netscape Navigator。但它发给服务器的自我介绍里写的不是 Netscape，而是 Mozilla/1.0。

Netscape 有一个当时很酷的功能叫 frames，可以把网页分成几块同时显示。很多网站管理员觉得不错，但不是所有浏览器都支持，于是在服务器上加了一段代码，先看来的是不是 Mozilla，是就给高级页面，不是就给简版。

这段代码，就是所有谎言的种子。

1995 年，微软做了 Internet Explorer。IE 也支持 frames，但服务器不认它，因为它不叫 Mozilla。

微软怎么办呢。

让 IE 也自称 Mozilla。

于是 IE 的 User-Agent 变成了 Mozilla/1.22 compatible; MSIE 2.0。翻译成人话就是，「我是 Mozilla 哦，不过其实我是 IE，但你就当我是 Mozilla 就行」。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/2d9c705b-d948-4ecf-a00b-90a015f0bfcd-1.png)

从这一刻起，浏览器的自我介绍就再也没真过。

后来 Netscape 开源了，变成 Mozilla 基金会，做出了 Firefox。Firefox 的渲染引擎叫 Gecko。很多网站又开始新一轮判断，看到 Gecko 就给最新页面。

然后 Linux 阵营的 KDE 社区做了一个浏览器叫 Konqueror，用的引擎叫 KHTML。KHTML 和 Gecko 差不多强，但网站不认。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260719180241819.png)

Konqueror 的做法跟当年微软一模一样。在 User-Agent 里加了一句 KHTML, like Gecko。

「我是 KHTML，不过我像 Gecko，你就当我是 Gecko 吧。」

再后来苹果要做 Safari。苹果没自己从头写引擎，把 KHTML 拿来改了改，起了个名字叫 WebKit。但是网站只认 KHTML 啊。

于是 Safari 的 User-Agent 写成了 AppleWebKit (KHTML, like Gecko) Safari。

翻译一下，「我是 Safari，用的是 WebKit，WebKit 其实就是 KHTML，KHTML 像 Gecko，你就当我是 Gecko 吧。」

谎话套谎话，一层摞一层。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/b158635c-a641-481a-97ec-0953d97d332b-1.png)

最后 Google 做 Chrome。Chrome 的引擎来自 WebKit（后来 Google 自己改名叫 Blink，但 User-Agent 没改）。Chrome 想让所有网站都给它最好的页面。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/browser-engine-tree.png)

于是把前面所有人的谎话一口气全抄了一遍。

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
```

你把这串东西翻译成人话就是，「我首先是 Mozilla，我用 AppleWebKit，WebKit 就是 KHTML，KHTML 像 Gecko，我也是 Safari，对了我其实是 Chrome。」

一个浏览器，同时假装自己是另外五个浏览器。

后来微软做 Edge 的时候更离谱。Edge 用的明明是自己的 EdgeHTML 引擎，但 User-Agent 里也塞了 Chrome 和 Safari 的名字。因为那时候风向又变了，网站开始专门给 Chrome 做优化。

不装 Chrome，就拿不到好页面。

所以你现在每次打开一个网页，你的浏览器都在向服务器提交一份攒了三十年的假简历。每一代新浏览器进场，不是把这份简历撕了重写，而是在上面再加一行谎话。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ua-lie-timeline.png)

因为在这个行业里，谁先诚实，谁先吃亏。
