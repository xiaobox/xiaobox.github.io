---
title: "JVM最多可以创建多少线程？"
slug: 2020-01-10-jvm-zui-duo-ke-yi-chuang-jian-duo-shao-xian-cheng
description: "具体计算公式如下：(MaxProcessMemory - JVMMemory - ReservedOsMemory) / (ThreadStackSize) = Number of threads"
date: 2020-01-10T23:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-10-jvm-zui-duo-ke-yi-chuang-jian-duo-shao-xian-cheng/cover.jpg
original_url: https://mp.weixin.qq.com/s/vAzIDv4Y2Fsgets3Q7qocw
categories:
  - 后端
tags:
  - Java
  - JVM
  - Linux
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-10-jvm-zui-duo-ke-yi-chuang-jian-duo-shao-xian-cheng/001-e15901a7.jpg)

具体计算公式如下：

**(MaxProcessMemory - JVMMemory - ReservedOsMemory) / (ThreadStackSize) = Number of threads**

-   MaxProcessMemory : 进程的最大寻址空间

-   JVMMemory : JVM内存

-   ReservedOsMemory : 保留的操作系统内存，如Native heap，JNI之类，一般100多M

-   ThreadStackSize : 线程栈的大小，jvm启动时由Xss指定 默认1M

MaxProcessMemory：如32位的linux默认每个进程最多申请3G的地址空间，64位的操作系统可以支持到46位（64TB）的物理地址空间和47位（128T）的进程虚拟地址空间（linux 64位CPU内存限制）。

JVM内存：由Heap区和Perm区组成。通过-Xms和-Xmx可以指定heap区大小，通过-XX:PermSize和-XX:MaxPermSize指定perm区的大小(默认从32MB 到64MB，和JVM版本有关)。

总结下影响Java线程数量的因素：

Java虚拟机本身：-Xms，-Xmx，-Xss；

系统限制：

-       /proc/sys/kernel/pid\_max

-       /proc/sys/kernel/thread-max

-       /max\_user\_process（ulimit -u）

-       /proc/sys/vm/max\_map\_count

**想增加线程数，在JVM内部可以通过减少最大堆或减少栈容量来实现**

* * *

btw 

    看生活大爆炸 谢耳朵说他最喜欢的数字 还挺有意思的![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-10-jvm-zui-duo-ke-yi-chuang-jian-duo-shao-xian-cheng/002-5414ca5a.png)

   ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-10-jvm-zui-duo-ke-yi-chuang-jian-duo-shao-xian-cheng/003-655e369a.jpg) 

    73是第21个素数  反过来   37是第12个素数

    12 vs 21= 7 \* 3

    二进制的73 = 1001001 是一个回文数
