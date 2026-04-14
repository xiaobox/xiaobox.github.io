---
title: "什么是零拷贝"
slug: 2020-03-05-shen-me-shi-ling-kao-bei
description: "学习Netty时 看到Netty高性能的原因之一是使用零拷贝技术;学习Kafka时 看到其高性能的原因之一也使用了零拷贝技术。那么到底什么是零拷贝？本文简单做个描述。"
date: 2020-03-05T10:58:37.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/cover.jpg
original_url: https://mp.weixin.qq.com/s/rSEu4mygr1fTmnqwmjjvFg
categories:
  - 系统底层
tags:
  - Java
  - Netty
  - Kafka
  - Linux
  - 缓存
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/001-e7aa8dc3.png)预计阅读时间6分钟![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/002-375cd3dd.png)

学习Netty时 看到Netty高性能的原因之一是使用零拷贝技术

学习Kafka时 看到其高性能的原因之一也使用了零拷贝技术

那么到底什么是零拷贝？本文简单做个描述。

### 先解释几个概念

-   用户态：只能受限地访问内存，不允许访问外围设备。占用 CPU 的能力被剥夺，CPU资源可以被其他程序获取。

-   内核态：CPU可以访问内存中所有的数据，包括外围设备，例如硬盘、网卡，CPU也可以将自己从一个程序切换到另一个程序。

-   DMA (direct memory access):直接内存访问，是一种不经过CPU而直接从内存存取数据的数据交换模式。在DMA模式下，CPU只须向DMA控制器下达指令，让DMA控制器来处理数据的传送，数据传送完毕再把信息反馈给CPU，这样就很大程度上减轻了CPU资源占有率，可以大大节省系统资源 

### 传统的数据拷贝方法

     下图为传统的数据拷贝方法：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/003-7d3200be.jpg)

       上图分别对应传统 I/O 操作的数据读写流程，整个过程涉及 4 次 拷贝，

-   **1 .数据从磁盘读取到内核的read buffer**

-   **2. 数据从内核缓冲区拷贝到用户缓冲区**

-   **3. 数据从用户缓冲区拷贝到内核的socket buffer**

-   **4. 数据从内核的socket buffer拷贝到网卡接口的缓冲区**

        并且在用户态和内核态中间进行了2次切换，无疑也加重了CPU负担。

        在此过程中，我们没有对文件内容做任何修改，那么在内核空间和用户空间来回拷贝数据无疑就是一种浪费，而零拷贝主要就是为了解决这种低效性。

### 解决方案

        **一个很明显的着力点就是减少数据在内核空间和用户空间来回拷贝。**

        **Linux能够做到在数据传输的过程中，避免数据在操作系统内核态buffer和用户态buffer之间进行复制。****Linux中提供类似的系统调用函数主要有mmap()、sendfile()及splice()。下面介绍其中两种。**

-   **mmap
    **

         我们减少拷贝次数的一种方法是调用mmap()来代替read调用：

```makefile
write(sockfd, buf, len);

```

        应用程序调用mmap()，磁盘上的数据会通过DMA被拷贝的内核缓冲区，接着操作系统会把这段内核缓冲区与应用程序共享，这样就不需要把内核缓冲区的内容往用户空间拷贝。应用程序再调用write(),操作系统直接将内核缓冲区的内容拷贝到socket缓冲区中，这一切都发生在内核态，最后，socket缓冲区再把数据发到网卡去。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/004-95800f3c.jpg)
        使用mmap替代read很明显减少了一次拷贝，当拷贝数据量很大时，无疑提升了效率。

-   ##### sendfile 

    ##### 从2.1版内核开始，Linux引入了sendfile来简化操作。

    ```cpp
    #include<sys/sendfile.h>
    ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count);
    ```

        系统调用sendfile()在代表输入文件的描述符in\_fd和代表输出文件的描述符out\_fd之间传送文件内容（字节）。描述符out\_fd必须指向一个套接字，而in\_fd指向的文件必须是可以mmap的。这些局限限制了sendfile的使用，使sendfile只能将数据从文件传递到套接字上，反之则不行。
        使用sendfile不仅减少了数据拷贝的次数，还减少了上下文切换，数据传送始终只发生在kernel space。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/005-5502487c.jpg)

#####

### 方案对比

        限于篇幅原因并没有把所有的零拷贝方式都介绍完整，以下是Linux中各方式的对比

| 拷贝方式 | CPU拷贝 | DMA拷贝 | 系统调用 | 上下文切换 |
| --- | --- | --- | --- | --- |
| 传统方式（read + write） | 2 | 2 | read / write | 4 |
| 内存映射（mmap + write） | 1 | 2 | mmap / write | 4 |
| sendfile | 1 | 2 | sendfile | 2 |
| sendfile + DMA gather copy | 0 | 2 | sendfile | 2 |
| splice | 0 | 2 | splice | 2 |

#####          **Kafka**采用的是Linux系统的函数sendfile()，允许操作系统将数据从Page Cache直接发送到网络，以此来避免数据复制。

        **Netty** 中的零拷贝和上面提到的操作系统层面上的零拷贝不太一样, 我们所说的 Netty 零拷贝完全是基于（Java 层面）用户态的，它的更多的是偏向于数据操作优化这样的概念，具体表现在以下几个方面：

-   Netty 通过 DefaultFileRegion 类对 java.nio.channels.FileChannel 的 tranferTo() 方法进行包装，在文件传输时可以将文件缓冲区的数据直接发送到目的通道（Channel）

-   ByteBuf 可以通过 wrap 操作把字节数组、ByteBuf、ByteBuffer 包装成一个 ByteBuf 对象, 进而避免了拷贝操作

-   ByteBuf 支持 slice 操作, 因此可以将 ByteBuf 分解为多个共享同一个存储区域的 ByteBuf，避免了内存的拷贝

-   Netty 提供了 CompositeByteBuf 类，它可以将多个 ByteBuf 合并为一个逻辑上的 ByteBuf，避免了各个 ByteBuf 之间的拷贝

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/006-ce2ba975.png)

参考 :

-   https://www.jianshu.com/p/fad3339e3448

-   https://segmentfault.com/a/1190000007560884

-   https://juejin.im/post/5d84bd1f6fb9a06b2d780df7

-   https://www.infoq.cn/article/netty-high-performance/

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-05-shen-me-shi-ling-kao-bei/007-04ecede2.jpg)

关注公众号 获取更多精彩内容
