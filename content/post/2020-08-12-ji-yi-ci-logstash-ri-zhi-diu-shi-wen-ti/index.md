---
title: "记一次Logstash日志丢失问题"
slug: 2020-08-12-ji-yi-ci-logstash-ri-zhi-diu-shi-wen-ti
description: "某系统日志架构是在项目中通过配置logback.xml配置双写写本地日志文件写到远程logstash本地没有"
date: 2020-08-12T08:52:47.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-08-12-ji-yi-ci-logstash-ri-zhi-diu-shi-wen-ti/cover.jpg
original_url: https://mp.weixin.qq.com/s/YyeSYRtM-yqfnhqdXkYp2g
categories:
  - 系统底层
tags:
  - JavaScript
  - 架构
  - 网络
  - DevOps
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-08-12-ji-yi-ci-logstash-ri-zhi-diu-shi-wen-ti/001-946c5948.jpg)

某系统日志架构是在项目中通过配置logback.xml配置双写

-   写本地日志文件

-   写到远程logstash

本地没有问题，有问题是logstash，在Kibana上看到有些日志没显示。

开始是怀疑是不是日志丢了，由于使用的是LogstashTcpSocketAppender

查了下官文文档:

**Internally, the TCP appenders are asynchronous (using the LMAX Disruptor RingBuffer).All the encoding and TCP communication is delegated to a single writer thread.There is no need to wrap the TCP appenders with another asynchronous appender (such as AsyncAppender or LoggingEventAsyncDisruptorAppender).**

**The TCP appenders will never block the logging thread. If the RingBuffer is full (e.g. due to slow network, etc), then events will be dropped.**

我得到了以下信息：

-   LogstashTcpSocketAppender和 logback的的异步appender的行为是类似的，也就是说，它也是异步的。

-   使用LogstashTcpSocketAppender ，不需要再外面再包裹任何Logback的appender

-   RingBuffer满了，日志会丢失

关于最后一点，只需修改配置就可以。根据源码看默认是8192 单位是B。且是2的幂次方。

```javascript
<appender name="stash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <ringBufferSize>1048576</ringBufferSize>

```

然而这并没有解决问题，于是仔细看了下logstash的日志，**发现有大量的json解析错误，根据日志情况分析，原因是日志数据传输到logstash之后被截断成了多条数据，于是有的数据就解析异常了，自然无法正常到归集到es的索引文档中。**

知道原因后解决起来就有思路了，查了一下logstash的配置：

```properties
tcp {
    port => 5001
    type => applogs
    codec => json
  }

```

原因就是codec写的是json的问题，应该用json\_lines。

对于日志很长的json，应该使用json\_lines格式，否则会被截断成多条且解析错误。

```properties
tcp {
    port => 5001
    type => applogs
    codec => json_lines
  }

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-08-12-ji-yi-ci-logstash-ri-zhi-diu-shi-wen-ti/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
