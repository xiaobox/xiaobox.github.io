---
title: "前端基础知识之CORS"
slug: 2020-01-12-qian-duan-ji-chu-zhi-shi-zhi-cors
description: "前后端分离后，前端打开控制台一看，怎么有时请求一个后端接口发了两次请求？那个options是啥？"
date: 2020-01-12T09:11:31.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-12-qian-duan-ji-chu-zhi-shi-zhi-cors/cover.jpg
original_url: https://mp.weixin.qq.com/s/QZBeYgV3LkhvAuwzmoVT5Q
categories:
  - 系统底层
tags:
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-12-qian-duan-ji-chu-zhi-shi-zhi-cors/001-ed8fc6e1.jpg)

**前后端分离后，前端打开控制台一看，怎么有时请求一个后端接口发了两次请求？**

**那个options是啥？**

很有可能是因为你发送的是CORS请求(**CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）**)，且是非简单请求。

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两大条件，就属于**简单请求**。

1 请求方法是以下三种方法之一：

-   HEAD

-   GET

-   POST

2 HTTP的头信息不超出以下几种字段：

-   Accept

-   Accept-Language

-   Content-Language

-   Last-Event-ID

Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

**凡是不同时满足上面两个条件，就属于非简单请求。非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求。"预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。**

参考 ：https://www.ruanyifeng.com/blog/2016/04/cors.html

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-12-qian-duan-ji-chu-zhi-shi-zhi-cors/002-f2e7317d.jpg)

**关注公众号 获取更多精彩内容**
