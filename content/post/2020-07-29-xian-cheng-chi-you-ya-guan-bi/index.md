---
title: "线程池优雅关闭"
slug: 2020-07-29-xian-cheng-chi-you-ya-guan-bi
description: "你的线程池关闭了吗？"
date: 2020-07-29T02:53:58.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-29-xian-cheng-chi-you-ya-guan-bi/cover.jpg
original_url: https://mp.weixin.qq.com/s/o5MosUfTReRQDfrsSxl3ag
categories:
  - 后端
tags:
  - Java
  - JVM
  - JavaScript
  - 多线程
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-29-xian-cheng-chi-you-ya-guan-bi/001-2d3c59c8.jpg)

## 第一种方法

首先看下源码注释：

-   A pool that is no longer referenced in a program *AND*

-   has no remaining threads will be {@code  shutdown} automatically. If

-   you would like to ensure that unreferenced pools are reclaimed even

-   if users forget to call {@link  #shutdown}, then you must arrange

-   that unused threads eventually die, by setting appropriate

-   keep-alive times, using a lower bound of zero core threads and/or

-   setting {@link  #allowCoreThreadTimeOut(boolean)}.

-

如果程序中不再持有线程池的引用，并且线程池中没有线程时，线程池将会自动关闭。

线程池自动关闭的两个条件：

-   线程池的引用不可达；

-   线程池中没有线程。

这里对于条件2解释一下，线程池中没有线程是指线程池中的所有线程都已运行完自动消亡。然而如果我们ThreadPool的核心线程没有超时策略，线程池并不会自动关闭。

所以需要设置：

```javascript
//线程池在执行完任务后，经过超时时间，将所有空闲的线程都释放掉，进程池这样进程就可以退出
pool.allowCoreThreadTimeOut(true);

```java

## 第二种方法

利用Runtime.*getRuntime**()*.addShutdownHook 和guava的方法优雅关闭

```cs
static {
    Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
      @Override
      public void run() {
        System.out.println("====开始关闭线程池");
        CommonThreadPool.gracefulShutdown(pool, 10, TimeUnit.SECONDS);
        System.out.println("====结束关闭线程池");
      }
    }));
  }
public static boolean gracefulShutdown(ExecutorService threadPool, int shutdownTimeout,
      TimeUnit timeUnit) {
    return threadPool == null || MoreExecutors
        .shutdownAndAwaitTermination(threadPool, shutdownTimeout, timeUnit);
  }

```

## 误区

不要将线程池线程设置为守护线程，虽然**守护线程不会阻止 JVM 退出****，但**这样做有问题，如果有还未执行完的任务就会出现异常了，（任务还没执行完就退出）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-29-xian-cheng-chi-you-ya-guan-bi/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
