---
title: "MySQL B+树叶子结点使用单向链表进行串连？错！"
slug: 2022-05-20-mysql-b-shu-ye-zi-jie-dian-shi-yong-dan-xiang-lian-biao-jin-
description: "先看一下上面这个图，大家是不是觉得没什么毛病？如题，就是叶子结点用单向链表连接起来是吧。很多文章是这么讲的，"
date: 2022-05-20T04:15:49.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-05-20-mysql-b-shu-ye-zi-jie-dian-shi-yong-dan-xiang-lian-biao-jin-/cover.jpg
original_url: https://mp.weixin.qq.com/s/zSKUhcJsMM7T-1Ue5Mr9Wg
categories:
  - 数据库
tags:
  - MySQL
  - 数据结构
---

![](001-cca6a65b.jpg)

先看一下上面这个图，大家是不是觉得没什么毛病？

如题，就是叶子结点用单向链表连接起来是吧。

很多文章是这么讲的，很多图也是这么画的，但其实不正确，或者说不严谨。

正确的说法应该是：B+ 树中各个页之间是通过双向链表连接的，叶子节点中的数据是通过单向链表连接的

我们来看下正确的图：

![](002-d1ced06d.jpg)

或者下面这个：

![](003-09674de7.jpg)

希望能够帮到一直对B+tree 有误解的同学。

![](004-ec6e6036.jpg)
