---
title: "经典面试题整理（TCP篇）"
slug: 2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian
description: "TCP、UDP区别？UDPTCP是否连接无连接面向连接是否可靠不可靠传输，不使用流量控制和拥塞控制可靠传输，"
date: 2020-03-13T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/cover.jpg
original_url: https://mp.weixin.qq.com/s/CASuC3yfLeLEnk5Q4LiNsA
categories:
  - 系统底层
tags:
  - 面试
  - 网络
---
### TCP、UDP区别？

<table style="visibility: visible;"><tbody style="border-width: 0px; border-style: initial; border-color: initial; outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; font-size: 14px; vertical-align: baseline; visibility: visible;"><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-weight: 700; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); word-break: break-all; visibility: visible;"><br style="visibility: visible;"></td><td style="border-color: rgb(204, 204, 204); visibility: visible;" width="237">UDP</td><td style="outline: 0px; font-weight: 700; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">TCP</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">是否连接</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">无连接</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">面向连接</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">是否可靠</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">不可靠传输，不使用流量控制和拥塞控制</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">可靠传输，使用流量控制和拥塞控制</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">连接对象个数</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">支持一对一，一对多，多对一和多对多交互通信</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">只能是一对一通信</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">传输方式</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">面向报文</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">面向字节流</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">首部开销</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">首部开销小，仅8字节</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">首部最小20字节，最大60字节</p></td></tr><tr style="outline: 0px; font-weight: inherit; font-style: inherit; font-family: inherit; vertical-align: baseline; visibility: visible;"><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;"><p style="visibility: visible;">适用场景</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="237"><p style="visibility: visible;">适用于实时应用（IP电话、视频会议、直播等）</p></td><td style="outline: 0px; font-style: inherit; font-family: inherit; vertical-align: middle; text-align: left; border-color: rgb(204, 204, 204); visibility: visible;" width="213"><p style="visibility: visible;">适用于要求可靠传输的应用，例如文件传输&nbsp;</p></td></tr></tbody></table>

-   TCP要求系统资源较多，UDP较少

-   TCP向上层提供面向连接的可靠服务 ，UDP向上层提供无连接不可靠服务。

-   虽然 UDP 并没有 TCP 传输来的准确，但是也能在很多实时性要求高的地方有所作为

-   对数据准确性要求高，速度可以相对较慢的，可以选用TCP

### TCP实现可靠传输的方法?

-   确认和重传：接收方收到报文就会确认，发送方发送一段时间后没有收到确认就重传。

-   数据校验：TCP报文头有校验和，用于校验报文是否损坏

-   数据合理分片和排序：tcp会按MTU合理分片，接收方会缓存未按序到达的数据，重新排序后再交给应用层。而UDP：IP数据报大于1500字节，大于MTU。这个时候发送方的IP层就需要分片，把数据报分成若干片，是的每一片都小于MTU。而接收方IP层则需要进行数据报的重组。由于UDP的特性，某一片数据丢失时，接收方便无法重组数据报，导致丢弃整个UDP数据报。

-   流量控制：当接收方来不及处理发送方的数据，通过滑动窗口，能提示发送方降低发送的速率，防止包丢失

-   拥塞控制：当网络拥塞时，通过拥塞窗口，减少数据的发送。

### 解释下三次握手、四次挥手

      这个资料可太多了，直接上图吧

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/001-3d5f4083.jpg)

三次握手过程:

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/002-2d997f74.gif)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/003-9044bca1.png)

四次挥手过程：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/004-80b7a8e9.png)

### 为什么要三次握手？两次不行吗？

        如客户端发出连接请求，但因连接请求报文丢失而未收到确认，于是客户端再重传一次连接请求。后来收到了确认，建立了连接。数据传输完毕后，就释放了连接，客户端共发出了两个连接请求报文段，其中第一个丢失，第二个到达了服务端，但是第一个丢失的报文段只是在某些网络结点长时间滞留了，延误到连接释放以后的某个时间才到达服务端，此时服务端误认为客户端又发出一次新的连接请求，于是就向客户端发出确认报文段，同意建立连接，不采用三次握手，只要服务端发出确认，就建立新的连接了，此时客户端忽略服务端发来的确认，也不发送数据，**则服务端一致等待客户端发送数据，浪费资源。**

### 挥手为什么需要四次？

        关闭连接时，当服务端收到FIN报文时，很可能并不会立即关闭SOCKET，所以只能先回复一个ACK报文，告诉客户端，"你发的FIN报文我收到了"。只有等到我服务端所有的报文都发送完了，我才能发送FIN报文。故需要四次挥手。

### 四次挥手释放连接时，为什么要等待2MSL？

-   为了保证客户端发送的最后一个ACK报文段能够到达服务器。因为这个ACK有可能丢失，从而导致处在LAST-ACK状态的服务器收不到对FIN-ACK的确认报文。服务器会超时重传这个FIN-ACK，接着客户端再重传一次确认，重新启动时间等待计时器。最后客户端和服务器都能正常的关闭。假设客户端不等待2MSL，而是在发送完ACK之后直接释放关闭，一但这个ACK丢失的话，服务器就无法正常的进入关闭连接状态。

-       防止“已失效的连接请求报文段”出现在本连接中。客户端在发送完最后一个ACK报文段后，再经过2MSL，就可以使本连接持续的时间内所产生的所有报文段都从网络中消失，使下一个新的连接中不会出现这种旧的连接请求报文段。

###

### SYN攻击是什么？

        SYN攻击就是Client在短时间内伪造大量不存在的IP地址，并向Server不断地发送SYN包，Server则回复确认包，并等待Client确认，由于源地址不存在，因此Server需要不断重发直至超时，这些伪造的SYN包将长时间占用未连接队列，导致正常的SYN请求因为队列满而被丢弃，从而引起网络拥塞甚至系统瘫痪。SYN 攻击是一种典型的 DoS/DDoS 攻击。

参考 ：

-   https://juejin.im/post/5d9c284b518825095879e7a5

-   https://blog.csdn.net/qzcsu/article/details/72861891

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-13-jing-dian-mian-shi-ti-zheng-li-tcp-pian/005-1e73da81.jpg)

关注公众号 获取更多精彩内容
