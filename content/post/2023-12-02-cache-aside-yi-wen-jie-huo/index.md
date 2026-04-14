---
title: "Cache Aside 疑问解惑"
slug: 2023-12-02-cache-aside-yi-wen-jie-huo
description: "今天又看了一下 Cache-Aside Pattern“Cache-Aside Pattern，即旁路缓存模"
date: 2023-12-02T08:02:02.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-02-cache-aside-yi-wen-jie-huo/cover.jpg
original_url: https://mp.weixin.qq.com/s/lVqR1DnW8QwcnT_Um_c7XA
categories:
  - AI
tags:
  - ChatGPT
  - 缓存
  - 多线程
  - 网络
---
今天又看了一下 `Cache-Aside Pattern`

> “
> 
> Cache-Aside Pattern，即旁路缓存模式，它的提出是为了尽可能地解决缓存与数据库的数据不一致问题。
> 
> ”

## Cache Aside Pattern

读流程：

1.  读的时候，先读缓存，缓存命中的话，直接返回数据
2.  缓存没有命中的话，就去读数据库，从数据库取出数据，放入缓存后，同时返回响应。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-02-cache-aside-yi-wen-jie-huo/001-a2500610.png)

写流程：

1.  更新的时候，先更新数据库，然后再删除缓存（使缓存失效）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-12-02-cache-aside-yi-wen-jie-huo/002-f1a8c8b0.png)

## 问题

这个模式看起来没什么毛病，但是，为什么更新缓存的动作一定要放在读流程里呢？或者说，为什么不是写完数据库后更新缓存？

跟 `chatGPT` 浪费了不少时间后，还是回到了 Google 上，原因这里已经说明了：https://www.quora.com/Why-does-Facebook-use-delete-to-remove-the-key-value-pair-in-Memcached-instead-of-updating-the-Memcached-during-write-request-to-the-backend

主要是怕两个并发的写操作导致脏数据。

这里你可以自行想像两个并发写请求一前一后的过来，A 刚更新完数据库，B 已经把数据库和缓存全都更新了，这时候 A 才开始更新缓存，导致缓存和数据库数据不一致。

那么，是不是Cache Aside这个就不会有并发问题了？

不是的，比如，一个是读操作，但是没有命中缓存，然后就到数据库中取数据，此时来了一个写操作，写完数据库后，让缓存失效，然后，之前的那个读操作再把老的数据放进去，所以，会造成脏数据。

但，这个case理论上会出现，不过，实际上出现的概率可能非常低，因为这个条件需要发生在读缓存时缓存失效，而且并发着有一个写操作。而实际上数据库的写操作会比读操作慢得多，而且还要锁表，而读操作必需在写操作前进入数据库操作，而又要晚于写操作更新缓存，所有的这些条件都具备的概率基本并不大。

## 参考

-   https://coolshell.cn/articles/17416.html
-   http://www.lzhgy.cn/blog/149
