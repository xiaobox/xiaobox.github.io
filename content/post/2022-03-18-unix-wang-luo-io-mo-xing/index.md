---
title: "Unix 网络 IO 模型"
slug: 2022-03-18-unix-wang-luo-io-mo-xing
description: "前知识文件描述符文件描述符（file descriptor，简称 fd）在形式上是一个非负整数。实际上，它是"
date: 2022-03-18T09:07:31.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/cover.jpg
original_url: https://mp.weixin.qq.com/s/LNu08P4qbh6F9E38zCidyA
categories:
  - 系统底层
tags:
  - Linux
---
## 前知识

### 文件描述符

文件描述符（file descriptor，简称 fd）在形式上是一个非负整数。实际上，它是一个索引值，指向内核为每一个进程所维护的该进程打开文件的记录表。当程序打开一个现有文件或者创建一个新文件时，内核向进程返回一个文件描述符。在程序设计中，一些涉及底层的程序编写往往会围绕着文件描述符展开。但是文件描述符这一概念往往只适用于 UNIX、Linux 这样的操作系统。

Linux 平台万物皆文件

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/001-6dcebfeb.jpg)

在 Linux 中，内核将所有的外部设备都当做一个文件来进行操作，而对一个文件的读写操作会调用内核提供的系统命令，返回一个 fd，对一个 socket 的读写也会有相应的描述符，称为 socketfd（socket 描述符），实际上描述符就是一个数字，它指向内核中的一个结构体（文件路径、数据区等一些属性）。如下图所示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/002-1f91e5d0.jpg)

系统为维护文件描述符，建立了三个表

-   进程级的文件描述符表
-   系统级的文件描述符表
-   文件系统的 i-node 表

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/003-b03b3658.jpg)

实际工作中我们有时会碰到“Too many openfiles”的问题，那很可能就是进程可用的文件描述符过少的原因。然而很多时候，并不是因为进程可用的文件描述符过少，而是因为程序 bug，打开了大量的文件连接（web 连接也会占用文件描述符）而没有释放。程序申请的资源在用完后要及时释放，才是解决“Too many open files”的根本之道。

### 用户空间与内核空间、内核态与用户态

用户空间与内核空间，进程上下文与中断上下文【总结】，大概内容如下：

现在操作系统都是采用虚拟存储器，那么对 32 位操作系统而言，它的寻址空间（虚拟存储空间）为 4G（2 的 32 次方）。操作系统的核心是内核，独立于普通的应用程序，可以访问受保护的内存空间，也有访问底层硬件设备的所有权限。为了保证用户进程不能直接操作内核，保证内核的安全，操作系统将虚拟空间划分为两部分，一部分为内核空间，一部分为用户空间。针对 linux 操作系统而言（以 32 位操作系统为例）

-   将最高的 1G 字节（从虚拟地址 0xC0000000 到 0xFFFFFFFF），供内核使用，称为内核空间；
-   将较低的 3G 字节（从虚拟地址 0x00000000 到 0xBFFFFFFF），供各个进程使用，称为用户空间。

每个进程可以通过系统调用进入内核，因此，Linux 内核由系统内的所有进程共享。于是，从具体进程的角度来看，每个进程可以拥有 4G 字节的虚拟空间。

-   当一个任务（进程）执行系统调用而陷入内核代码中执行时，称进程处于内核运行态（内核态）。此时处理器处于特权级最高的（0 级）内核代码中执行。当进程处于内核态时，执行的内核代码会使用当前进程的内核栈，每个进程都有自己的内核栈；
-   当进程在执行用户自己的代码时，则称其处于用户运行态（用户态）。此时处理器在特权级最低的（3 级）用户代码中运行。当正在执行用户程序而突然被中断程序 中断 时，此时用户程序也可以象征性地称为处于进程的内核态。因为中断处理程序将使用当前进程的内核栈。

## IO 模型

根据 UNIX 网络编程对 IO 模型的分类，UNIX 提供了以下 5 种 IO 模型。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/004-419557d1.jpg)

### 阻塞式 IO(Blocking IO)

最流行的 IO 操作是阻塞式 IO(Blocking IO). 以 UDP 数据报套接字为例，下图是其阻塞 IO 的调用过程：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/005-d758afcb.jpg)

上图有个 recvfrom 调用，这是啥？recvfrom 是 C 语言的函数，也就是 linux 内核函数（操作系统也是用编程语言写的嘛），所以可想而知我们上层不管用什么语言写的应用，最终的调用是会执行操作系统内核的函数的。而 recvfrom 函数，大致含义是：从（已连接）套接口上接收数据，并捕获数据发送源的地址。假如套接字上没有消息可以读取，除非套接字已被设置为非阻塞模式，否则接收调用会等待消息的到来。

如上图中所示的一样，recvfrom 使进程阻塞，它是一个阻塞函数。我们以套接字接口为例来讲解此模型，在进程空间中调用 recvfrom, 其系统调用直到数据包到达且被复制到应用进程的缓冲区中或者发生错误时才返回，在此期间一直会等待，进程在从调用 recvfrom 开始到它返回的整段时间内都是被阻塞的，因此被称为阻塞 IO 模型。如上文所述，阻塞 I/O 下请求无法立即完成则保持阻塞。阻塞 I/O 分为如下两个阶段。

-   阶段 1：等待数据就绪。网络 I/O 的情况就是等待远端数据陆续抵达；磁盘 I/O 的情况就是等待磁盘数据从磁盘上读取到内核态内存中。
-   阶段 2：数据拷贝。出于系统安全，用户态的程序没有权限直接读取内核态内存，因此内核负责把内核态内存中的数据拷贝一份到用户态内存中。

传统的阻塞 I/O，对一个文件描述符操作 (FD) 时，如果操作没有响应就会一直等待，直到内核有反馈。缺点就是单线程一次只能操作一个 FD

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/006-a319c744.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/007-ae6d1759.jpg)

### 非阻塞式 IO 模型

非阻塞式 IO 模型，如下图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/008-2dd33373.jpg)

非阻塞 I/O 请求包含如下三个阶段

-   阶段 1：socket 设置为 NONBLOCK（非阻塞）就是告诉内核，当所请求的 I/O 操作无法完成时，不要将线程睡眠，而是返回一个错误码 (EWOULDBLOCK) ，这样请求就不会阻塞。
-   阶段 2：I/O 操作函数将不断的测试数据是否已经准备好，如果没有准备好，继续测试，直到数据准备好为止。整个 I/O 请求的过程中，虽然用户线程每次发起 I/O 请求后可以立即返回，但是为了等到数据，仍需要不断地轮询、重复请求，消耗了大量的 CPU 的资源。
-   阶段 3：数据准备好了，从内核拷贝到用户空间。

总结来说，recvfrom 从应用到内核态时，如果该缓冲区没有数据，就会直接返回 EWOULDBLOCK 错误，一般都对非阻塞 IO 模型进行轮询检查这个状态，看看内核是不是有数据到来也就是说非阻塞的 recvform 系统调用调用之后，进程并没有被阻塞，内核马上返回给进程。如果数据还没准备好，此时会返回一个 error。进程在返回之后，可以干点别的事情，然后再发起 recvform 系统调用。重复上面的过程，循环往复的进行 recvform 系统调用，这个过程通常被称之为轮询。轮询检查内核数据，直到数据准备好，再拷贝数据到进程，进行数据处理。需要注意，拷贝数据整个过程，进程仍然是属于阻塞的状态。

在 Linux 下，可以通过设置 socket 使其变为 non-blocking。非阻塞 IO 过于消耗 CPU 时间，将大部分时间用于轮询。

### IO 多路复用

多路复用实际不是一个技术而是一个理念，在 I/O 多路复用之前就有通讯线路的频分复用和时分复用，大概就是合理的安排每个单位使用资源的时间和位置，看起来所有单位一起在使用原本只能允许少量单位同时使用的资源。

> “
> 
> 多路是指网络连接，复用指的是同一个线程
> 
> ”

I/O multiplexing   multiplexing 一词其实多用于通信领域，为了充分利用通信线路，希望在一个信道中传输多路信号，要想在一个信道中传输多路信号就需要把这多路信号结合为一路，将多路信号组合成一个信号的设备被称为 multiplexer，显然接收方接收到这一路组合后的信号后要恢复原先的多路信号，这个设备被称为 demultiplexer，如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/009-594144db.jpg)

IO 多路复用模型，如下图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/010-d422add4.jpg)

上图中有个 select 函数，我们先来解释下这个函数：

基本原理： select 函数监视的文件描述符分 3 类，分别是 writefds、readfds、和 exceptfds。调用后 select 函数会阻塞，直到有描述符就绪（有数据 可读、可写、或者有 except），或者超时（timeout 指定等待时间，如果立即返回设为 null 即可），函数返回。当 select 函数返回后，可以通过遍历 fdset，来找到就绪的描述符。

```c
// 返回值：做好准备的文件描述符的个数，超时为 0，错误为-1.
#include <sys/select.h>
#include <sys/time.h>

#define FD_SETSIZE 1024
#define NFDBITS (8 * sizeof(unsigned long))
#define __FDSET_LONGS (FD_SETSIZE/NFDBITS)

// 数据结构 (bitmap)
typedef struct {
    unsigned long fds_bits[__FDSET_LONGS];
} fd_set;

// API
int select(
    int max_fd, 
    fd_set *readset, 
    fd_set *writeset, 
    fd_set *exceptset, 
    struct timeval *timeout
)                              // 返回值就绪描述符的数目

FD_ZERO(int fd, fd_set* fds)   // 清空集合
FD_SET(int fd, fd_set* fds)    // 将给定的描述符加入集合
FD_ISSET(int fd, fd_set* fds)  // 判断指定描述符是否在集合中 
FD_CLR(int fd, fd_set* fds)    // 将给定的描述符从文件中删除 

```

Select 总共三部分参数

1.  传入 FD（文件描述符）最大的+1
2.  传入的 FD，分三类

-   1). 监听读
-   2). 监听写
-   3). 监听异常

4.  如果一直没有满足条件的 fd，最多等多久（超时时间）

select 用一个`FD_SETSIZE`位的 BitMap 表示输入参数，`FD_SETSIZE`默认为 1024。因为没有 1024 位那么长的数，所以用一个数组表示，因为数组元素地址连续，所以实际就是一个 1024 位的数，比如第 1 位为 1，表示这次输入有 fd1（标准输出 fd)。这个地方也限制了`select 最多支持 1024 个 fd，并且 fd 的号码不能大于等于 1024。`

一个文件描述集保存在 fd\_set 类型当中，fd\_set 类型变量的每一位代表了一个描述符。我们也可以认为它只是由一个很多二进制位构成的数组

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/011-2d31c194.jpg)

在 Linux 中，我们可以使用 select 函数实现 I/O 端口的复用，传递给 select 函数的参数会告诉内核：

•  我们所关心的文件描述符

•  对每个描述符，我们所关心的状态。（我们是要想从一个文件描述符中读或者写，还是关注一个描述符中是否出现异常）

•  我们要等待多长时间。（我们可以等待无限长的时间，等待固定的一段时间，或者根本就不等待）

从 select 函数返回后，内核告诉我们以下信息：

•  对我们的要求已经做好准备的描述符的个数

•  对于三种条件哪些描述符已经做好准备。（读，写，异常）

select 函数告诉我们，当有读写事件发生的时候，有多少个事件就绪，但是他不会告诉我们具体是哪些事件就绪，需要我们自己去事件集一个一个遍历判断 有了这些返回信息，我们可以调用合适的 I/O 函数（通常是 read 或 write)，并且这些函数不会再阻塞。

select 具有 O(n) 的无差别轮询复杂度，同时处理的流越多，无差别轮询时间就越长。

基本流程如下图

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/012-36375eb8.jpg)

调用顺序如下：sys\_select() → core\_sys\_select() → do\_select() → fop->poll()

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/013-2c1a9050.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/014-a3c2ff99.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/015-fc9abccf.gif)

如果你对上面那一坨理论不感冒的话，那我们简明的总结一下 使用 select 以后最大的优势是用户可以在一个线程内同时处理多个 socket 的 IO 请求。用户可以注册多个 socket，然后不断地调用 select 读取被激活的 socket，即可达到在同一个线程内同时处理多个 IO 请求的目的。而在同步阻塞模型中，必须通过多线程的方式才能达到这个目的

再来看个 select 流程伪代码：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/016-ace560d3.jpg)

对，就是顾名思义不断去 select 处于可用状态的 socket。你可能会说使用 select 函数进行 IO 请求和同步阻塞模型没有太大的区别，甚至还多了添加监视 socket，以及调用 select 函数的额外操作，效率更差。但是，使用 select 以后最大的优势是用户可以在一个线程内同时处理多个 socket 的 IO 请求。如果你的网络请求量比较大的情况下，这种模式是不是比阻塞式好啊。

总结一下 IO 多路复用模型：IO multiplexing（多路复用）就是我们说的 select，poll，epoll（关于这三个函数的对比和介绍，后文再讲），有些地方也称这种 IO 方式为 event driven （事件驱动）IO。

select/epoll 的好处就在于单个 process 就可以同时处理多个网络连接的 IO。I/O 多路复用技术的最大优势是系统开销小，系统不必创建进程/线程，也不必维护这些进程/线程，从而大大减小了系统的开销。它的基本原理就是 select，poll，epoll 这个 function 会不断的轮询所负责的所有 socket，当某个 socket 有数据到达了，就通知用户进程。

当用户进程调用了 select，那么整个进程会被 block，而同时，kernel 会“监视”所有 select 负责的 socket，当任何一个 socket 中的数据准备好了，select 就会返回。这个时候用户进程再调用 read 操作，将数据从 kernel 拷贝到用户进程。所以，I/O 多路复用的特点是通过一种机制一个进程能同时等待多个文件描述符，而这些文件描述符（套接字描述符）其中的任意一个进入读就绪状态，select() 函数就可以返回。

上面这个图和 blocking IO 的图其实并没有太大的不同，事实上，还更差一些。因为这里需要使用两个 systemcall (select 和 recvfrom)，而 blockingIO 只调用了一个 system call (recvfrom)。但是，用 select 的优势在于它可以同时处理多个 connection。所以，如果处理的连接数不是很高的话，使用 select/epoll 的 web server 不一定比使用 multi-threading + blocking IO 的 web server 性能更好，可能延迟还更大。select/epoll 的优势并不是对于单个连接能处理得更快，而是在于能处理更多的连接。）

在 IO multiplexing Model 中，实际中，对于每一个 socket，一般都设置成为 non-blocking，但是，如上图所示，整个用户的 process 其实是一直被 block 的。只不过 process 是被 select 这个函数 block，而不是被 socket IO 给 block。

select 本质上是通过设置或者检查存放 fd 标志位的数据结构来进行下一步处理。这样所带来的缺点是：

1.  单个进程可监视的 fd 数量被限制，即能监听端口的大小有限。一般来说这个数目和系统内存关系很大，具体数目可以 cat/proc/sys/fs/file-max 查看。32 位机默认是 1024 个。64 位机默认是 2048.
2.  对 socket 进行扫描时是线性扫描，即采用轮询的方法，效率较低：当套接字比较多的时候，每次 select() 都要通过遍历 FD\_SETSIZE 个 Socket 来完成调度，不管哪个 Socket 是活跃的，都遍历一遍。这会浪费很多 CPU 时间。如果能给套接字注册某个回调函数，当他们活跃时，自动完成相关操作，那就避免了轮询，这正是 epoll 与 kqueue 做的。
3.  需要维护一个用来存放大量 fd 的数据结构，这样会使得用户空间和内核空间在传递该结构时复制开销大。

### 信号驱动式 I/O 模型

这种模式一般很少用，所以不重点说了，大概说一下，如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/017-42cef703.jpg)

为了使用该 I/O 模型，需要开启套接字的信号驱动 I/O 功能，并通过 sigaction 系统调用安装一个信号处理函数。sigaction 函数立即返回，我们的进程继续工作，即进程没有被阻塞。当数据报准备好时，内核会为该进程产生一个 SIGIO 信号，这样我们可以在信号处理函数中调用 recvfrom 读取数据报，也可以在主循环中读取数据报。无论如何处理 SIGIO 信号，这种模型的优势在于等待数据报到达期间不被阻塞。

来看下这种模式的缺点：信号 I/O 在大量 IO 操作时可能会因为信号队列溢出导致没法通知。信号驱动 I/O 尽管对于处理 UDP 套接字来说有用，即这种信号通知意味着到达一个数据报，或者返回一个异步错误。但是，对于 TCP 而言，信号驱动的 I/O 方式近乎无用，因为导致这种通知的条件为数众多，每一个来进行判别会消耗很大资源，与前几种方式相比优势尽失。

### 异步 IO 模型

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/018-c3b1363f.jpg)

调用 aio\_read 函数（当然 AIO 的 API 不止这一个，如下图还有很多），

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/019-66b8fc0d.jpg)

告诉内核描述字，缓冲区指针，缓冲区大小，文件偏移以及通知的方式，然后立即返回。当内核将数据拷贝到缓冲区后，再通知应用程序。所以异步 I/O 模式下，阶段 1 和阶段 2 全部由内核完成，完成不需要用户线程的参与。

异步 IO 模型和信号驱动的 IO 模型的主要区别在于：信号驱动 IO 是由内核通知我们何时可以启动一个 IO 操作，而异步 IO 模型是由内核通知我们 IO 操作何时完成。

## 比较

到此我们已经分别介绍完了 5 种 IO 模型，来看一下他们的比较：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/020-dce84327.jpg)

可以看到，前四种 I/O 模型的主要区别在于第一个阶段，它们的第二个阶段是一样的：在数据从内核复制到应用进程的缓冲区期间，进程会被阻塞于 recvfrom 系统调用。而异步 I/O 模型则是整个操作完成内核才通知应用进程。

* * *

下面引用知乎上有一个比较生动的例子可以说明这几种模型之间的关系。

老张爱喝茶，废话不说，煮开水。

出场人物：老张，水壶两把（普通水壶，简称水壶；会响的水壶，简称响水壶）。
1 老张把水壶放到火上，立等水开。（同步阻塞）老张觉得自己有点傻
2 老张把水壶放到火上，去客厅看电视，时不时去厨房看看水开没有。（同步非阻塞）老张还是觉得自己有点傻，于是变高端了，买了把会响笛的那种水壶。水开之后，能大声发出嘀~~~~的噪音。
3 老张把响水壶放到火上，立等水开。（异步阻塞）老张觉得这样傻等意义不大
4 老张把响水壶放到火上，去客厅看电视，水壶响之前不再去看它了，响了再去拿壶。（异步非阻塞）老张觉得自己聪明了。

所谓同步异步，只是对于水壶而言。 普通水壶，同步；响水壶，异步。

虽然都能干活，但响水壶可以在自己完工之后，提示老张水开了。这是普通水壶所不能及的。

同步只能让调用者去轮询自己（情况 2 中），造成老张效率的低下。

所谓阻塞非阻塞，仅仅对于老张而言。

立等的老张，阻塞；看电视的老张，非阻塞。

情况 1 和情况 3 中老张就是阻塞的，媳妇喊他都不知道。虽然 3 中响水壶是异步的，可对于立等的老张没有太大的意义。所以一般异步是配合非阻塞使用的，这样才能发挥异步的效用。

* * *

## 多路复用之 select、poll、epoll

上文中提到的多路复用模型的图中只画了 select，实际上这种模型的实现方式是可以基于不同方法有多个实现的。比如基于 `select` 或`poll`或`epoll`方法，那么它们有什么不同呢？

### select

select 函数监视的 fd 分 3 类，分别是 writefds、readfds、和 exceptfds。调用后 select 函数会阻塞，直到有 fd 就绪（有数据 可读、可写、或者有 except），或者超时（timeout 指定等待时间，如果立即返回设为 null 即可），函数返回。当 select 函数返回后，可以通过遍历 fdset，来找到就绪的 fd。

select 目前几乎在所有的平台上支持，其良好跨平台支持也是它的一个优点。select 的一个最大的缺陷就是单个进程对打开的 fd 是有一定限制的，它由 FD\_SETSIZE 限制，默认值是 1024，如果修改的话，就需要重新编译内核，不过这会带来网络效率的下降。

### poll

poll 本质上和 select 没有区别，它将用户传入的数组拷贝到内核空间，然后查询每个 fd 对应的设备状态，如果设备就绪则在设备等待队列中加入一项并继续遍历，如果遍历完所有 fd 后没有发现就绪设备，则挂起当前进程，直到设备就绪或者主动超时，被唤醒后它又要再次遍历 fd。这个过程经历了多次无谓的遍历。它没有最大连接数的限制，原因是它是基于链表来存储的，但是同样以下几个缺点：

1 大量的 fd 的数组被整体复制于用户态和内核地址空间之间；

2 poll 还有一个特点是【水平触发】，如果报告了 fd 后，没有被处理，那么下次 poll 时会再次报告该 fd；

3 fd 增加时，线性扫描导致性能下降。

select 和 poll 另一个缺陷就是随着 fd 数目的增加，可能只有很少一部分 socket 是活跃的，但是 select/poll 每次调用时都会线性扫描全部的集合，导致效率呈现线性的下降。

### 水平触发和边缘触发

水平触发 (level-trggered)

只要文件描述符关联的读内核缓冲区非空，有数据可以读取，就一直发出可读信号进行通知，当文件描述符关联的内核写缓冲区不满，有空间可以写入，就一直发出可写信号进行通知 LT 模式支持阻塞和非阻塞两种方式。epoll 默认的模式是 LT。

边缘触发 (edge-triggered)

当文件描述符关联的读内核缓冲区由空转化为非空的时候，则发出可读信号进行通知，当文件描述符关联的内核写缓冲区由满转化为不满的时候，则发出可写信号进行通知。两者的区别在哪里呢？水平触发是只要读缓冲区有数据，就会一直触发可读信号，而边缘触发仅仅在空变为非空的时候通知一次，

LT(leveltriggered) 是缺省的工作方式，并且同时支持 block 和 no-blocksocket. 在这种做法中，内核告诉你一个文件描述符是否就绪了，然后你可以对这个就绪的 fd 进行 IO 操作。如果你不做任何操作，内核还是会继续通知你的，所以，这种模式编程出错误可能性要小一点。传统的 select/poll 都是这种模型的代表。

### epoll

epoll 是在 2.6 内核中提出的，是之前的 select 和 poll 的增强版本。相对于 select 和 poll 来说，epoll 更加灵活，没有描述符限制。epoll 使用一个文件描述符管理多个描述符，将用户关系的文件描述符的事件存放到内核的一个事件表中，这样在用户空间和内核空间的 copy 只需一次。

epoll 支持水平触发和边缘触发，最大的特点在于边缘触发，它只告诉进程哪些 fd 变为就绪态，并且只会通知一次。还有一个特点是，epoll 使用【事件】的就绪通知方式，通过 epoll\_ctl 注册 fd，一旦该 fd 就绪，内核就会采用类似 `callback` 的回调机制来激活该 fd，epoll\_wait 便可以收到通知。

一幅图总结一下 epoll 的整个工作流程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/021-b04cbce6.jpg)

epoll 函数接口

```c
#include <sys/epoll.h>

// 数据结构
// 每一个 epoll 对象都有一个独立的 eventpoll 结构体
// 用于存放通过 epoll_ctl 方法向 epoll 对象中添加进来的事件
// epoll_wait 检查是否有事件发生时，只需要检查 eventpoll 对象中的 rdlist 双链表中是否有 epitem 元素即可
struct eventpoll {
    /*红黑树的根节点，这颗树中存储着所有添加到 epoll 中的需要监控的事件*/
    struct rb_root  rbr;
    /*双链表中则存放着将要通过 epoll_wait 返回给用户的满足条件的事件*/
    struct list_head rdlist;
};

// API
int epoll_create(int size); // 内核中间加一个 ep 对象，把所有需要监听的 socket 都放到 ep 对象中
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event); // epoll_ctl 负责把 socket 增加、删除到内核红黑树
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);// epoll_wait 负责检测可读队列，没有可读 socket 则阻塞进程

```

selecat 有三个问题

1.  select 调用需要传入 fd 数组，需要拷贝一份到内核，高并发场景下这样的拷贝消耗的资源是惊人的。（可优化为不复制）
2.  select 在内核层仍然是通过遍历的方式检查文件描述符的就绪状态，是个同步过程，只不过无系统调用切换上下文的开销。（内核层可优化为异步事件通知）
3.  select 仅仅返回可读文件描述符的个数，具体哪个可读还是要用户自己遍历。（可优化为只返回给用户就绪的文件描述符，无需用户做无效的遍历）

所以 epoll 主要就是针对这三点进行了改进。

1.  内核中保存一份文件描述符集合，无需用户每次都重新传入，只需告诉内核修改的部分即可。
2.  内核不再通过轮询的方式找到就绪的文件描述符，而是通过异步 IO 事件唤醒。
3.  内核仅会将有 IO 事件的文件描述符返回给用户，用户也无需遍历整个文件描述符集合。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-03-18-unix-wang-luo-io-mo-xing/022-50352eb0.gif)

具体，操作系统提供了这三个函数。

```
第一步，创建一个 epoll 句柄
int epoll_create(int size);
第二步，向内核添加、修改或删除要监控的文件描述符。
int epoll_ctl(
  int epfd, int op, int fd, struct epoll_event *event);
第三步，类似发起了 select() 调用
int epoll_wait(
  int epfd, struct epoll_event *events, int max events, int timeout);

```

### 三种模型的区别

到这里我们总结一下 select,poll 和 epoll:

-   select 的几大缺点：

-   每次调用 select，都需要把 fd 集合从用户态拷贝到内核态，这个开销在 fd 很多时会很大
-   同时每次调用 select 都需要在内核遍历传递进来的所有 fd，这个开销在 fd 很多时也很大
-   select 支持的文件描述符数量太小了，默认是 1024

-   epoll 的优点：

-   没有最大并发连接的限制，能打开的 FD 的上限远大于 1024（1G 的内存上能监听约 10 万个端口）；
-   效率提升，不是轮询的方式，不会随着 FD 数目的增加效率下降。只有活跃可用的 FD 才会调用 callback 函数；即 Epoll 最大的优点就在于它只管你“活跃”的连接，而跟连接总数无关，因此在实际的网络环境中，Epoll 的效率就会远远高于 select 和 poll。
-   表面上看 epoll 的性能最好，但是在连接数少并且连接都十分活跃的情况下，select 和 poll 的性能可能比 epoll 好，毕竟 epoll 的通知机制需要很多函数回调。

-   select 低效是因为每次它都需要轮询。但低效也是相对的，视情况而定，也可通过良好的设计改善
-   select，poll 实现需要自己不断轮询所有 fd 集合，直到设备就绪，期间可能要睡眠和唤醒多次交替。而 epoll 其实也需要调用 epoll\_wait 不断轮询就绪链表，期间也可能多次睡眠和唤醒交替，但是它是设备就绪时，调用回调函数，把就绪 fd 放入就绪链表中，并唤醒在 epoll\_wait 中进入睡眠的进程。虽然都要睡眠和交替，但是 select 和 poll 在“醒着”的时候要遍历整个 fd 集合，而 epoll 在“醒着”的时候只要判断一下就绪链表是否为空就行了，这节省了大量的 CPU 时间。这就是回调机制带来的性能提升。
-   select，poll 每次调用都要把 fd 集合从用户态往内核态拷贝一次，并且要把 current 往设备等待队列中挂一次，而 epoll 只要一次拷贝，而且把 current 往等待队列上挂也只挂一次（在 epoll\_wait 的开始，注意这里的等待队列并不是设备等待队列，只是一个 epoll 内部定义的等待队列）。这也能节省不少的开销。

|
 | select | poll | epoll |
| --- | --- | --- | --- |
| 操作方式 | 遍历 | 遍历 | 回调 |
| 底层实现 | 数组 | 链表 | 红黑树 |
| IO 效率 | 每次调用都进行线性遍历，时间复杂度为 O(n) | 每次调用都进行线性遍历，时间复杂度为 O(n) | 事件通知方式，每当 fd 就绪，系统注册的回调函数就会被调用，将就绪 fd 放到 readyList 里面，时间复杂度 O(1) |
| 最大连接数 | 1024(x86) 或 2048(x64) | 无上限 | 无上限 |
| fd 拷贝 | 每次调用 select，都需要把 fd 集合从用户态拷贝到内核态 | 每次调用 poll，都需要把 fd 集合从用户态拷贝到内核态 | 调用 epoll\_ctl 时拷贝进内核并保存，之后每次 epoll\_wait 不拷贝 |

## 扩展问题

### 为什么数据库连接池不采用 IO 多路复用？

[https://mp.weixin.qq.com/s/B12jXZTeRDXM\_SB\_eGelUQ](https://mp.weixin.qq.com/s?__biz=MzIyODE5NjUwNQ==&mid=2653344038&idx=1&sn=d0460c3c1ec863a61eb23144b49e6088&scene=21#wechat_redirect)

## 库类

开源 C/C++网络库：

-   ACE                   C++语言 跨平台
-   Boost 的 ASIO  C++语言 跨平台
-   libevent             C 语言   主要支持 linux，新版增加了对 windows 的 IOCP 的支持
-   libev                   C 语言   只支持 linux，只封装了 EPOLL 模型

### ACE

ACE 是一个大型的中间件产品，代码 20 万行左右，过于宏大，一堆的设计模式，架构了一层又一层，使用的时候，要根据情况，看你从那一层来进行使用。支持跨平台。

ACE 网络库在使用中，一直对其中的内存管理搞得一头雾水，分配的内存需要在哪里释放都不知道，ACE 不愧是一个做研究用的库，可以说里面的封装把设计模式这本书中列出的模式都在代码里面实现了一番，用起来感觉是在用 java 一样，如果你想使用 ACE 作为你的网络库，千万不要仅仅把它当成一个网络库使用，你要把它当成一个框架来使用，如果你只想用它的网络库，那大可不必用 ACE, 因为它太庞大了，学习起来太费劲。但是你把它当成一个框架来用，你会感觉用的还真爽，该有的东西都有，比如线程池，内存池，定时器，递归锁等，都很方便的。Boost 的 ASIO，在内存管理方面要直观的多。

### Boost

Boost 的 ASIO 是一个异步 IO 库，封装了对 Socket 的常用操作，简化了基于 socket 程序的开发。支持跨平台。

### libevent

Libevent 是一个用 C 语言编写的、轻量级的开源高性能网络库，主要有以下几个亮点：事件驱动（ event-driven），高性能；轻量级，专注于网络，不如 ACE 那么臃肿庞大；源代码相当精炼、易读；跨平台，支持 Windows、 Linux、 BSD 和 Mac OS；支持多种 I/O 多路复用技术， epoll、 poll、 dev/poll、 select 和 kqueue 等；支持 I/O，定时器和信号等事件；注册事件优先级。

### libev

libev 是一个 C 语言写的，只支持 linux 系统的库，我以前研究的时候只封装了 EPOLL 模型，不知道现在的新版有没有改进。使用方法类似 libevent, 但是非常简洁，代码量是最少的一个库，也就几千行代码。显然这样的代码跨平台肯定是无法支持的了，如果你只需要在 linux 下面运行，那用这个库也是可以的。

## 参考

-   https://journey-c.github.io/io-multiplexing/
-   https://juejin.cn/post/6882984260672847879#heading-7
-   [https://mp.weixin.qq.com/s/3gC-nUnFGv-eoSBsEdSZuA](https://mp.weixin.qq.com/s?__biz=MzAxOTc0NzExNg==&mid=2665525639&idx=1&sn=d0881894cfeca626c4e6b0953a32810b&scene=21#wechat_redirect)
-   https://www.cnblogs.com/flashsun/p/14591563.html
-   [https://mp.weixin.qq.com/s/LhocgdcpbuibfX1sTyzOqw](https://mp.weixin.qq.com/s?__biz=MzUxODAzNDg4NQ==&mid=2247486789&idx=2&sn=75388f27f5db6f11b796df2aa465dba9&scene=21#wechat_redirect)
-   [https://mp.weixin.qq.com/s?\_\_biz=MjM5Njg5NDgwNA==&mid=2247484905&idx=1&sn=a74ed5d7551c4fb80a8abe057405ea5e&chksm=a6e304d291948dc4fd7fe32498daaae715adb5f84ec761c31faf7a6310f4b595f95186647f12&scene=21#wechat\_redirect](https://mp.weixin.qq.com/s?__biz=MjM5Njg5NDgwNA==&mid=2247484905&idx=1&sn=a74ed5d7551c4fb80a8abe057405ea5e&chksm=a6e304d291948dc4fd7fe32498daaae715adb5f84ec761c31faf7a6310f4b595f95186647f12&scene=21#wechat_redirect)
-   http://www.loujunkai.club/network/selece-poll.html
-   http://note.iawen.com/note/programming/net\_libs
