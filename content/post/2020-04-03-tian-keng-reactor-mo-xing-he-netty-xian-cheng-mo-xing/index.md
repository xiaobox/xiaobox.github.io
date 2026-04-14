---
title: "填坑Reactor模型和Netty线程模型"
slug: 2020-04-03-tian-keng-reactor-mo-xing-he-netty-xian-cheng-mo-xing
description: "彻底搞懂Reactor模型"
date: 2020-04-03T10:14:57.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-03-tian-keng-reactor-mo-xing-he-netty-xian-cheng-mo-xing/cover.jpg
original_url: https://mp.weixin.qq.com/s/PrquEWiFgoeMIQU5UDgxLA
categories:
  - 后端
tags:
  - Java
  - Netty
  - 多线程
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-03-tian-keng-reactor-mo-xing-he-netty-xian-cheng-mo-xing/001-545043fe.png)

[Java 的I/O、NIO ,Java IO 模型，Unix 网络 IO 模型等相关概念的解析](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483680&idx=1&sn=fd933abbd4f044d8997390b056a3285c&chksm=eb6dbea6dc1a37b0e37d5662811c97e32f7a3571c9efe421340f890b0ade2881008f54f05e65&scene=21#wechat_redirect)

上面这篇幅文章我们讨论了IO相关的问题，文末留了个坑说要说下Netty的线程模型，今天来填坑。

**在高性能的I/O设计中，有两个著名的模型：Reactor模型和Proactor模型，其中Reactor模型用于同步I/O，而Proactor模型运用于异步I/O操作。实际上Netty线程模型就是Reactor模型的一个实现。**

* * *

## Reactor模型

> The reactor design pattern is an event handling pattern for handling service requests delivered concurrently to a service handler by one or more inputs. The service handler then demultiplexes the incoming requests and dispatches them synchronously to the associated request handlers.

以上来自wiki,**我们可以看到以下重点**。

1.  事件驱动（event handling）

2.  可以处理一个或多个输入源（one or more inputs）

3.  通过Service Handler同步的将输入事件（Event）采用多路复用分发给相应的Request Handler（多个）处理

根据大神Doug Lea 在 《Scalable IO in Java 》中的介绍，**Reacotr模型主要分为三个角色**：

1.  **Reactor**：把IO事件分配给对应的handler处理

2.  **Acceptor**：处理客户端连接事件

3.  **Handler**：处理非阻塞的任务

**Reactor处理请求的流程**：

1.  同步的等待多个事件源到达（采用select()实现）

2.  将事件多路分解以及分配相应的事件服务进行处理，这个分派采用server集中处理（dispatch）

3.  分解的事件以及对应的事件服务应用从分派服务中分离出去（handler）

## 为什么使用Reactor？

传统阻塞IO模型的不足

-   每个连接都需要独立线程处理，当并发数大时，创建线程数多，占用资源

-   采用阻塞IO模型，连接建立后，若当前线程没有数据可读，线程会阻塞在读操作上，造成资源浪费

针对传统阻塞IO模型的两个问题，可以采用如下的方案

-   基于池化思想，避免为每个连接创建线程，连接完成后将业务处理交给线程池处理

-   基于IO复用模型，多个连接共用同一个阻塞对象，不用等待所有的连接。遍历到有新数据可以处理时，操作系统会通知程序，线程跳出阻塞状态，进行业务逻辑处理

## Reactor线程模型分类

根据Reactor的数量和处理资源的线程数量的不同，分为三类：

-   单Reactor单线程模型

-   单Reactor多线程模型

-   多Reactor多线程模型

## 单Reactor单线程模型

![Image](002-4965d7f1.png "image.png")

**消息处理流程：**

1.  Reactor对象通过select监控连接事件，收到事件后通过dispatch进行转发。

2.  如果是连接建立的事件，则由acceptor接受连接，并创建handler处理后续事件。

3.  如果不是建立连接事件，则Reactor会分发调用Handler来响应。

4.  handler会完成read->业务处理->send的完整业务流程。

**该线程模型的不足**

1.  仅用一个线程处理请求，对于多核资源机器来说是有点浪费的

2.  当处理读写任务的线程负载过高后，处理速度下降，事件会堆积，严重的会超时，可能导致客户端重新发送请求，性能越来越差

3.  单线程也会有可靠性的问题

针对上面的种种不足，就有了下面的线程模型

## 单Reactor多线程模型

![Image](003-08fd1e13.png "image.png")

**消息处理流程：**

1.  Reactor对象通过Select监控客户端请求事件，收到事件后通过dispatch进行分发。

2.  如果是建立连接请求事件，则由acceptor通过accept处理连接请求，然后创建一个Handler对象处理连接完成后续的各种事件。

3.  如果不是建立连接事件，则Reactor会分发调用连接对应的Handler来响应。

4.  Handler只负责响应事件，不做具体业务处理，通过Read读取数据后，会分发给后面的Worker线程池进行业务处理。

5.  Worker线程池会分配独立的线程完成真正的业务处理，如何将响应结果发给Handler进行处理。

6.  Handler收到响应结果后通过send将响应结果返回给Client。

相对于第一种模型来说，在处理业务逻辑，也就是获取到IO的读写事件之后，交由线程池来处理，handler收到响应后通过send将响应结果返回给客户端。这样可以降低Reactor的性能开销，从而更专注的做事件分发工作了，提升整个应用的吞吐。

但是这个模型存在的问题：

1.  多线程数据共享和访问比较复杂。如果子线程完成业务处理后，把结果传递给主线程Reactor进行发送，就会涉及共享数据的互斥和保护机制。

2.  Reactor承担所有事件的监听和响应，只在主线程中运行，可能会存在性能问题。例如并发百万客户端连接，或者服务端需要对客户端握手进行安全认证，但是认证本身非常损耗性能。

为了解决性能问题，产生了第三种主从Reactor多线程模型。

## 主从Reactor多线程模型

**![Image](004-38747577.png "image.png")**

比起第二种模型，它是将Reactor分成两部分：

1.  mainReactor负责监听server socket，用来处理网络IO连接建立操作，将建立的socketChannel指定注册给subReactor。

2.  subReactor主要做和建立起来的socket做数据交互和事件业务处理操作。通常，subReactor个数上可与CPU个数等同。

**Nginx、Memcached和Netty都是采用这种实现。**

**消息处理流程：**

1.  从主线程池中随机选择一个Reactor线程作为acceptor线程，用于绑定监听端口，接收客户端连接

2.  acceptor线程接收客户端连接请求之后创建新的SocketChannel，将其注册到主线程池的其它Reactor线程上，由其负责接入认证、IP黑白名单过滤、握手等操作

3.  步骤2完成之后，业务层的链路正式建立，将SocketChannel从主线程池的Reactor线程的多路复用器上摘除，重新注册到Sub线程池的线程上，并创建一个Handler用于处理各种连接事件

4.  当有新的事件发生时，SubReactor会调用连接对应的Handler进行响应

5.  Handler通过Read读取数据后，会分发给后面的Worker线程池进行业务处理

6.  Worker线程池会分配独立的线程完成真正的业务处理，如何将响应结果发给Handler进行处理

7.  Handler收到响应结果后通过Send将响应结果返回给Client

**Reactor三种模式形象比喻**

餐厅一般有接待员和服务员，接待员负责在门口接待顾客，服务员负责全程服务顾客

Reactor的三种线程模型可以用接待员和服务员类比

1.  单Reactor单线程模型：接待员和服务员是同一个人，一直为顾客服务。客流量较少适合

2.  单Reactor多线程模型：一个接待员，多个服务员。客流量大，一个人忙不过来，由专门的接待员在门口接待顾客，然后安排好桌子后，由一个服务员一直服务，一般每个服务员负责一片中的几张桌子

3.  多Reactor多线程模型：多个接待员，多个服务员。这种就是客流量太大了，一个接待员忙不过来了

## Netty线程模型

上文说Netty就是采用Reactor模型实现的。下面是Netty使用中很常见的一段代码

```java

public class Server {
    public static void main(String[] args) throws Exception {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childOption(ChannelOption.TCP_NODELAY, true)
                    .childAttr(AttributeKey.newInstance("childAttr"), "childAttrValue")
                    .handler(new ServerHandler())
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                        }
                    });
            ChannelFuture f = b.bind(8888).sync();
            f.channel().closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

```

**boss线程池作用：**

1.  接收客户端的连接，初始化Channel参数。

2.  将链路状态变更时间通知给ChannelPipeline。

**worker线程池作用：**

1.  异步读取通信对端的数据报，发送读事件到ChannelPipeline。

2.  异步发送消息到通信对端，调用ChannelPipeline的消息发送接口。

3.  执行系统调用Task。

4.  执行定时任务Task。

**通过配置boss和worker线程池的线程个数以及是否共享线程池等方式，Netty的线程模型可以在以上三种Reactor模型之间进行切换**。

![Image](005-6a0b4bf6.png "image.png")

netty通过Reactor模型基于多路复用器接收并处理用户请求，内部实现了两个线程池，boss线程池和work线程池，其中boss线程池的线程负责处理请求的accept事件，当接收到accept事件的请求时，把对应的socket封装到一个NioSocketChannel中，并交给work线程池，其中work线程池负责请求的read和write事件 

![Image](006-e7064c36.png "image.png")

## tomcat的线程模型

Tomcat支持四种接收请求的处理方式：BIO、NIO、APR和AIO

-   NIO
    同步非阻塞，比传统BIO能更好的支持大并发，tomcat 8.0 后默认采用该模型。
    使用方法(配置server.xml)：<Connector port="8080" protocol="HTTP/1.1"/> 改为 protocol="org.apache.coyote.http11.Http11NioProtocol"

-   BIO
    阻塞式IO，tomcat7之前默认，采用传统的java IO进行操作，该模型下每个请求都会创建一个线程，适用于并发量小的场景。
    使用方法(配置server.xml)：protocol =" org.apache.coyote.http11.Http11Protocol"

-   APR
    tomcat 以JNI形式调用http服务器的核心动态链接库来处理文件读取或网络传输操作，需要编译安装APR库。
    使用方法(配置server.xml)：protocol ="org.apache.coyote.http11.Http11AprProtocol"

-   AIO
    异步非阻塞 (NIO2)，tomcat8.0后支持。多用于连接数目多且连接比较长（重操作）的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。
    使用方法(配置server.xml)：protocol ="org.apache.coyote.http11.Http11Nio2Protocol"

参考：

https://zhuanlan.zhihu.com/p/69341619

https://cloud.tencent.com/developer/article/1488120

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-03-tian-keng-reactor-mo-xing-he-netty-xian-cheng-mo-xing/007-04ecede2.jpg)

关注公众号 获取更多精彩内容
