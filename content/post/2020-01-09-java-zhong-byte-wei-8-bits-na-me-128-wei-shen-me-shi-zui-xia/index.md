---
title: "java中 byte为8 bits,那么-128为什么是最小值？"
slug: 2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia
description: "我们知道java中基本类型byte占8 bits,取值范围是-128到最+127,可 -128为什么是最小值？"
date: 2020-01-09T16:02:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia/cover.jpg
original_url: https://mp.weixin.qq.com/s/wG6B1GDIxnJeMzD5eFN7Kw
categories:
  - 后端
tags:
  - Java
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia/001-368a9741.png)

我们知道java中基本类型byte占8 bits,取值范围是-128到最+127，从这个正负号大家也能看出表示这个范围的二进制数是**有符号位的**，就是第一位。

比如+127是 0111 1111 而 -128是 1000 0000

正数好理解，负数是通过原码取反后+1 生成的补码表示

比如-3的 源码是 **1000 0011** 反码是 **1111 1100**  补码是 **1111 1101**

计算机得到 **1111 1101** 后经过计算就知道是-3了。

**然而这么算的话，最小的负数应该是 -127，原码为：****1111 1111，补码为 1000 0001 ，为什么会是 -128 呢？**

来看0这个数字如何表示,

-   一个 +0 **0000 0000** 

-   一个 -0 **1000 0000** **？**

而数学只有一个0，就把 0000 0000表示为0，多出的这个一个补码 1000 0000 **人为规定为 -128！**

同理，其他边界值比如int的 最小值-231 也是一个道理。

下面是一道很有意思的小题，大家可以试一下，以下是java代码：

```cs
byte i =127;
System.out.println(++i);

```

* * *

btw

一直以来IDEA启动就比较慢（不算项目加载时间，单纯软件的启动时间），不爽它很久了，于是决定优化它，结果发现无论我怎样优化它的软件启动时间都在10秒![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia/002-1659c8e1.png)（不知道正版的用户是不是这样的![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia/003-0a6770e6.png)），据IDEA官方介绍它的2019版本启动时间会更快。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-09-java-zhong-byte-wei-8-bits-na-me-128-wei-shen-me-shi-zui-xia/004-683106fa.jpg)
