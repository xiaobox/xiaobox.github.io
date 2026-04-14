---
title: "滴滴一面（高级java）面试题分享"
slug: 2020-05-11-di-di-yi-mian-gao-ji-java-mian-shi-ti-fen-xiang
date: 2020-05-11T07:25:08.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-11-di-di-yi-mian-gao-ji-java-mian-shi-ti-fen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/SzRafkLAXowYeAUNc-gRWg
categories:
  - 后端
tags:
  - Java
  - JVM
  - Spring
  - Dubbo
  - Redis
  - Kafka
  - RocketMQ
  - 面试
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-11-di-di-yi-mian-gao-ji-java-mian-shi-ti-fen-xiang/001-4d881798.jpg)

### 1 说下对 volatile关键字的理解 

-   volatile可以禁止指令重排序优化

-   保证可见性、不保证原子性(也就是说多个线程并发修改某个变量时，依旧会产生多线程问题，但适合使用一个线程写，多个线程读的场合。)

     **以下场景可以使用volatile**

-   运算结果并不依赖变量的当前值，或者能够确保只有单一的线程修改变量的值

-   变量不需要与其他的状态变量共同参与不变约束

  原理：volatile语义中的内存屏障volatile的内存屏障策略非常严格保守，非常悲观且毫无安全感的心态：在每个volatile写操作前插入StoreStore屏障，在写操作后插入StoreLoad屏障；在每个volatile读操作前插入LoadLoad屏障，在读操作后插入LoadStore屏障；由于内存屏障的作用，避免了volatile变量和其它指令重排序、线程之间实现了通信，使得volatile表现出了锁的特性。

### 2 jvm调过优没有，是怎么做的？排查问题时一般会用哪些命令？

-      jps(JVM Process Status):虚拟机进程状况工具 显示虚拟机进程 jps -l

-      jstat(JVM Statistics Monitoring Tool):监控虚拟机各种运行状态

-      jinfo(Configuration Info for Java):java配置信息工具

-      jmap(Memory Map for Java) 堆转储快照

-      jstack(Stack Trace for Java) java堆栈跟踪工具

### 3 AQS 原理大概说一下

    可参考 ： [彻底搞懂AQS](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484343&idx=1&sn=0c0ac16161f09cadd00483addbf6e598&chksm=eb6dbc31dc1a35278931f76fce310d6ead4aba125fc2370aeb52a03b2dc4a78c0d4d95fae420&scene=21#wechat_redirect)

### 4 Redis 高可用实现方式

###     redis cluster 或哨兵机制 

### 5 Kafka 或 RocketMq 实现原理

###     问的太广了，自己知道什么有逻辑的表达一下吧

### 6 spring cloud 和 dubbo区别

     主要是RPC和生态上的区别

### 7 spring cloud 用过哪些组件 ？

###     可参考 ：[spring及spring cloud框架主要组件介绍](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484358&idx=1&sn=f58ad629f83c3222d6eb7b2e4f739879&chksm=eb6dbc40dc1a355673bc17b44f22841ee415c8a592ff8a4e6f725b458325373b7fe5277ffc72&scene=21#wechat_redirect)

### 8 Hystrix 熔断器有哪些模式 

![Image](002-f7d923f8.png "image.png")

-   closed：请求正常时，不使用熔断器；

-   open：统计请求的失败比例，达到阀值时，打开熔断器，请求被降级处理；延时一段时候后（默认休眠时间是5S）会进入halfopen状态；默认失败比例阀值是50%，请求次数最少不低于20次；

-   halfopen：在进入该状态后会放入部分请求；判断请求是否成功，不成功，进入open状态，重新计时，进入halfopen状态；成功，进入closed状态，

### 9 介绍下项目

###

### 10 有什么问题问我的？
