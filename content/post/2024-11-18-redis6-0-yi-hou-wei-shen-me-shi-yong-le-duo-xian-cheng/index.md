---
title: "Redis6.0 以后为什么使用了多线程？"
slug: 2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng
date: 2024-11-18T02:04:32.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng/cover.jpg
original_url: https://mp.weixin.qq.com/s/Gzuxd5zX4CI68IdBCWs0ZA
categories:
  - 后端
tags:
  - Redis
  - Linux
  - 多线程
  - 网络
---
Redis 所谓的单线程并不是所有工作都是只有一个线程在执行，而是指 Redis 的网络 IO 和键值对读写是由一个线程来完成的，Redis 在处理客户端的请求时包括获取 (socket 读）、解析、执行、内容返回 (socket 写） 等都由一个顺序串行的主线程处理。

这就是所谓的“**单线程**”。这也是 Redis 对外提供键值存储服务的主要流程。
由于 Redis 在处理命令的时候是单线程作业的，所以会有一个 Socket 队列，每一个到达的服务端命令来了之后都不会马上被执行，而是进入队列，然后被线程的事件分发器逐个执行。如下图：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng/001-b7c0094d.png)

至于 Redis 的其他功能， 比如持久化、异步删除、集群数据同步等等，其实是由额外的线程执行的。 可以这么说，Redis 工作线程是单线程的。但是在 4.0 之后，对于整个 Redis 服务来说，还是多线程运作的。

## 6.0 之前为什么要使用单线程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng/002-55bc246f.png)

-   在使用 Redis 时，Redis 主要受限是在内存和网络上，CPU 几乎没有性能瓶颈的问题。
-   以 Linux 系统为例子，在 Linux 系统上 Redis 通过 pipelining 可以处理 100w 个请求每秒，而应用程序的计算复杂度主要是 O(N) 或 O(log(N)) ，不会消耗太多 CPU。
-   使用了单线程后，提高了可维护性。多线程模型在某些方面表现优异，却增加了程序执行顺序的不确定性，并且带来了并发读写的一系列问题，增加了系统复杂度。同时因为线程切换、加解锁，甚至死锁，造成一定的性能损耗。
-   Redis 通过 AE 事件模型以及 IO 多路复用等技术，拥有超高的处理性能，因此没有使用多线程的必要

## 6.0 之后的多线程主要解决什么问题

近年来底层网络硬件性能越来越好，Redis 的性能瓶颈逐渐体现在网络 I/O 的读写上，单个线程处理网络 I/O 读写的速度跟不上底层网络硬件执行的速度。

Redis 在处理网络数据时，调用 epoll 的过程是阻塞的，这个过程会阻塞线程。如果并发量很高，达到万级别的 QPS，就会形成瓶颈，影响整体吞吐能力

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng/003-e1c54fcd.png)

既然读写网络的 read/write 系统调用占用了 Redis 执行期间大部分 CPU 时间，那么要想真正做到提速，必须改善网络 IO 性能。我们可以从这两个方面来优化：

-   提高网络 IO 性能，典型实现方式比如使用 DPDK 来替代内核网络栈的方式
-   使用多线程，这样可以充分利用多核 CPU，同类实现案例比如 Memcached。

协议栈优化的这种方式跟 Redis 关系不大，所以最便捷高效的方式就是支持多线程。总结起来，redis 支持多线程就是以下两个原因：

-   可以充分利用服务器 CPU 的多核资源，而主线程明显只能利用一个
-   多线程任务可以分摊 Redis 同步 IO 读写负荷，降低耗时

6.0 版本优化之后，主线程和多线程网络 IO 的执行流程如下：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-18-redis6-0-yi-hou-wei-shen-me-shi-yong-le-duo-xian-cheng/004-51bc3556.png)

具体步骤如下：

-   主线程建立连接，并接受数据，并将获取的 socket 数据放入等待队列；
-   通过轮询的方式将 socket 读取出来并分配给 IO 线程；
-   之后主线程保持阻塞，一直等到 IO 线程完成 socket 读取和解析；
-   I/O 线程读取和解析完成之后，返回给主线程 ，主线程开始执行 Redis 命令；
-   执行完 Redis 命令后，主线程阻塞，直到 IO 线程完成 结果回写到 socket 的工作；
-   主线程清空已完成的队列，等待客户端新的请求。

本质上是将主线程 IO 读写的这个操作 独立出来，单独交给一个 I/O 线程组处理。
这样多个 socket 读写可以并行执行，整体效率也就提高了。同时注意 Redis 命令还是主线程串行执行。

利用多核来分担 I/O 读写负荷。在事件处理线程每次获取到可读事件时，会将所有就绪的读事件分配给 I/O 线程，并进行等待，在所有 I/O 线程完成读操作后，事件处理线程开始执行任务处理，在处理结束后，同样将写事件分配给 I/O 线程，等待所有 I/O 线程完成写操作。

```
int handleClientsWithPendingReadsUsingThreads(void) {
    ...
    /* Distribute the clients across N different lists. */
    listIter li;
    listNode *ln;
    listRewind(server.clients_pending_read,&li);
    int item_id = 0;
    // 将等待处理的客户端分配给 I/O 线程
    while((ln = listNext(&li))) {
        client *c = listNodeValue(ln);
        int target_id = item_id % server.io_threads_num;
        listAddNodeTail(io_threads_list[target_id],c);
        item_id++;
    }
    ...
    /* Wait for all the other threads to end their work. */
    // 轮训等待所有 I/O 线程处理完
    while(1) {
        unsigned long pending = 0;
        for (int j = 1; j < server.io_threads_num; j++)
            pending += io_threads_pending[j];
        if (pending == 0) break;
    }
    ...
    return processed;
}

```

本质上是利用多核的多线程让多个 IO 的读写加速。

### 局限性

6.0 版本的多线程并非彻底的多线程，I/O 线程只能同时执行读或者同时执行写操作，期间事件处理线程一直处于等待状态，并非流水线模型，有很多轮训等待开销。
