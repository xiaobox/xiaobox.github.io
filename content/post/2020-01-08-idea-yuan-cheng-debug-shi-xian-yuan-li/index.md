---
title: "IDEA远程debug实现原理"
slug: 2020-01-08-idea-yuan-cheng-debug-shi-xian-yuan-li
description: "IDEA 远程Debug 实现原理"
date: 2020-01-08T02:07:13.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-08-idea-yuan-cheng-debug-shi-xian-yuan-li/cover.jpg
original_url: https://mp.weixin.qq.com/s/3pe1qfl4dwBhtRiGoMOamw
categories:
  - 后端
tags:
  - Java
  - JVM
  - 架构
---
使用IDEA进行远程debug,这个操作大家没用过也听过

它的实现原理为：**本机和远程主机的两个 VM 之间使用 Debug 协议通过 Socket 通信，传递调试指令和调试信息。**

其中，调试的程序常常被称为**debugger**, 而被调试的程序称为 **debuggee**。

在 Debug 领域，JDK 有一套规范与体系来支持，即 Java Platform Debugger Architecture，JPDA 体系。在 JPDA 体系中定义了 三个角色，

每个角色又对应着不同的技术模块支撑，分别为 **JVMTI/JDWP/JDI。**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-08-idea-yuan-cheng-debug-shi-xian-yuan-li/001-7ad3b8ff.jpg)

如上图，从下往上读架构，大致可以解读为：用于调试的程序使用UI，通过Protocol，调用远端JVM进程。

举例来说比如你要远程调试tomcat中的应用，需要在catalina.sh中添加以下脚本，并重启：

```ini
JAVA_OPTS="$JAVA_OPTS -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"

```

**以下为各参数的解释：**

-   -agentlib:jvm参数用于装载本地lib包；其中libname为本地代理库文件名，默认搜索路径为环境变量PATH中的路径，options为传给本地库启动时的参数，多个参数之间用逗号分隔

-   jwdp :Java Debug Wire Protocol的缩写；

-   transport:用于在调试程序和VM使用的进程之间通讯；

-   dt\_socket:套接字传输；

-   server=y/n : VM是否需要作为调试服务器执行；

-   suspend=y/n:是否在调试客户端建立连接立后启动VM;

-   address :调试服务器监听的端口号。
