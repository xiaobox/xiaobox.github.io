---
title: "关于 Redis 的有趣的知识"
slug: 2023-12-01-guan-yu-redis-de-you-qu-de-zhi-shi
description: "有序集合的英文全称明明是 sorted sets，为啥叫 zset 呢？\n\n&nbsp;Redis官网上没有解释，但是在 Github 上有人向作者提问了。\n\n作者是这么回答的：\n\n&nbsp;Hello. Z is as in XYZ, so the idea is, sets with another dimension: the order. It’s a far association… I know 😃\n\n原来前面的 Z 代表的是 XYZ 中的Z，zset 是在说这是比 set 有更多一个维度的 set 😦\n\n是不没道理？\n\n更没道理的还有，Redis 默认端口 6379 ，因为作者喜欢的一个叫 Merz 的女明星，其名字在手机上输入正好对应号码 6379，索性就把 Redis 的默认端口叫 6379 了…"
date: 2023-12-01T08:25:22.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-01-guan-yu-redis-de-you-qu-de-zhi-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/jEy17UfVQRmlslUb8-9lmg
categories:
  - 数据库
tags:
  - Redis
---
# 关于 Redis 的有趣的知识

有序集合的英文全称明明是 sorted sets，为啥叫 zset 呢？

 Redis官网上没有解释，但是在 Github 上有人向作者提问了。

作者是这么回答的：

 Hello. Z is as in XYZ, so the idea is, sets with another dimension: the order. It’s a far association… I know 😃

原来前面的 Z 代表的是 XYZ 中的Z，zset 是在说这是比 set 有更多一个维度的 set 😦

是不没道理？

更没道理的还有，Redis 默认端口 6379 ，因为作者喜欢的一个叫 Merz 的女明星，其名字在手机上输入正好对应号码 6379，索性就把 Redis 的默认端口叫 6379 了…

![](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-01-guan-yu-redis-de-you-qu-de-zhi-shi/001-83277fc0.jpg)

小盒子的技术分享
