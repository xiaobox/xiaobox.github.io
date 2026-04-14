---
title: "数据库连接池选型 Druid vs HikariCP"
slug: 2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp
description: "数据库连接池选型 Druid vs HikariCP"
date: 2020-10-21T07:30:56.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/cover.jpg
original_url: https://mp.weixin.qq.com/s/yWJt0ru2rzwl7KREmlkjvQ
categories:
  - 云原生
tags:
  - Spring
  - 架构
  - 多线程
---
# 数据库连接池选型 Druid vs HikariCP

## 这里主要比较HikariCP 和阿里的Druid

这里有来自Druid的竞品对比：https://github.com/alibaba/druid/wiki/Druid%E8%BF%9E%E6%8E%A5%E6%B1%A0%E4%BB%8B%E7%BB%8D

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/001-165063bb.png)

springboot 现在官方默认的数据库连接池是 HikariCP，HikariCP的性能从测试的数据上来看也是最高的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/002-5374bef1.png)

所以我们主要对比Druid和HikariCP

### 先来看下这个著名的issue

-   一个印度小哥提的 issue

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/003-22b7038a.png)

-   brettwooldridge 这边主要针对性能和在中国以外的地方用的少的问题

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/004-1d7dc22c.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/005-b4e32593.png)

-   温绍这边说，由于使用公平锁所以降低了性能，至于为什么是因为在生产环境中遇到的一些问题，使设计使然。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/006-c3497eb5.png)

-   温绍同时也强调我们淘宝体量大，并发高，顺便甩了个带有马爸爸照片的链接，让他了解一下淘宝

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/007-da34b786.png)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/008-2caac427.jpg)

-   brettwooldridge 这边回应 :比量是吧？（内心潜台词）

-   wix.com托管着超过1.09亿个网站，每天处理的请求超过10亿个
-   Atlassian的产品拥有数百万的客户
-   HikariCP是使用Play框架，Slick，JOOS构建的每个应用的默认连接池
-   老子现在是spring boot的默认连接池
-   HikariCP每月从中央Maven存储库中解析超过300,000次。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/009-df9bed93.png)

-   同时也甩了个链接，让你看看我HikariCP的名望

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/010-cccd7c78.png)

### 看完热闹，说回正题

-   功能角度考虑，Druid 功能更全面，除具备连接池基本功能外，还支持sql级监控、扩展、SQL防注入等。最新版甚至有集群监控
-   单从性能角度考虑，从数据上确实HikariCP要强，但Druid有更多、更久的生产实践，它可靠。
-   单从监控角度考虑，如果我们有像skywalking、prometheus等组件是可以将监控能力交给这些的 HikariCP 也可以将metrics暴露出去。

### 总结

由于我们的系统架构上有专门用于监控的系统（skywalking、prometheus），外加使用了阿里云的RDS，RDS也有完整数据库监控指标。所以我们可以将监控的功能交给这些系统，让数据库连接池专心做好连接池的本职工作，所以我们选择性能更好的 HikariCP 做为数据库连接池。由于我们使用了Spring boot ,HikariCP 是内置的，也更方便配置使用，能做到开箱即用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-21-shu-ju-ku-lian-jie-chi-xuan-xing-druid-vs-hikaricp/011-eb93df92.gif)

关注公众号 获取更多精彩内容
