---
title: "持续演进的Cloud Native (读书笔记04)"
slug: 2020-03-09-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-04
description: "可扩展性设计  性能设计 一致性设计可扩展性设计横向扩展横向扩展（scale out）也叫水平扩展，指用更多"
date: 2020-03-09T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-09-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-04/cover.jpg
original_url: https://mp.weixin.qq.com/s/-6OBoTOAXmHw_Uuy-aP-DQ
categories:
  - 云原生
tags:
  - Redis
  - ZooKeeper
  - 缓存
---
**可扩展性设计  性能设计 一致性设计**

### 可扩展性设计

**横向扩展**

-   横向扩展（scale out）也叫水平扩展，指用更多的节点支撑更大量的请求。例如如果1台机器支撑10 000TPS，那么两台机器是否能支撑20 000TPS？

-   纵向扩展（scale up）也叫垂直扩展，扩展一个点的能力支撑更大的请求，它通常通过提升硬件实现，例如把磁盘升级为SSD。

**如何扩展数据库**

-   主从复制集群

-   分库、垂直分表

-   分片（sharding）

-   区间法（Range-Based）

-   轮流法（Round-Robin）

-   一致性哈希法（Consistent Hash）

**如何扩展数据中心**

-   两地三中心

-   同城多活

-   异地多活

### 性能设计

**比较常见的性能问题如下**

-   内存泄漏——导致内存耗尽。

-   过载——突发流量，大量超时重试。

-   网络瓶颈——需要加载的内容太多

-   阻塞——无尽的等待。

-   锁——通过限制。

-   IO繁忙——大量的读写、分布式

-   CPU繁忙——计算型常见问题。

-   长请求拥塞——连接耗尽。

**性能指标**

-   响应时间（Latency），就是发送请求和返回结果的耗时。

-   吞吐量（Throughput），就是单位时间内的响应次数。

树立目标

寻找平衡点

-   我们可以通过一组压力测试数据找到拐点。

定位瓶颈点

-   压力测试

-   日志分析

-   监控工具

服务通信优化

-    同步转异步

-    阻塞转非阻塞

-   序列化优化

通过消息中间件提升写性能

通过缓存提升读性能

-   缓存的常用模式

-   Read Through模式

-   Write Through模式

-   Write Behind Caching模式

-   Cache-Aside模式

-   Cache-As-SoR模式

-   为缓存数据设置合理的过期时间

-   为缓存设置回收策略

-   先预热数据

数据库优化

-   通过执行计划分析瓶颈点

-   为搜索字段创建索引

-   通过慢查询日志分析瓶颈点

-   通过提升硬件能力优化数据库

-   目前各大互联网公司的数据库均使用SSD硬盘或者PCIE-FLASH，据说2012年的时候微博使用PCIE-FLASH支撑了Feed系统在春晚时的3.5万QPS。

简化设计

-   转移复杂度

-   从业务角度优化

### 一致性设计

事务

-   原子性（Atomicity）

-   一致性（Consistency）

-   隔离性（Isolation）

-   未提交读（Read uncommitted）

-   提交读（Read committed）

-   可重复读（Repeatable reads）

-   可序列化（Serializable）

-   隔离级别

-   持久性（Durability）

CAP定理

-   一致性（Consistence）

-   可用性（Availability）

-   分区容错性（Partition tolerance）

分布式系统的一致性分类

-   以数据为中心的一致性模型

-   1.严格一致性（Strict Consistency

-   2.顺序一致性（Sequential Consistency）

-   3.因果一致性（Causal Consistency）

-   4.FIFO一致性（FIFO Consistency）

-   以用户为中心的一致性模型

-   1.单调读一致性（Monotonic-read Consistency）

-   2.单调写一致性（Monotonic-write Consistency）

-   3.写后读一致性（Read-your-writes Consistency）

-   4.读后写一致性（Writes-follow-reads Consistency）

-   业界常用的一致性模型

-   弱一致性

-   最终一致性（Eventual Consistency）

-   强一致性（Strong Consistency）

-   如何实现强一致性

-   两阶段提交

-    三阶段提交（3PC）

-   如何实现最终一致性

-   重试机制

-   本地记录日志

-   可靠事件模式

-    Saga事务模型

-   TCC事务模型

-   分布式锁

-   基于数据库实现悲观锁和乐观锁

-   基于ZooKeeper的分布式锁

-   基于Redis实现分布式锁

-   如何保证幂等性

-   幂等令牌（Idempotency Key）

-   在数据库中实现幂等性

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-09-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-04/001-bf98d7fd.jpg)

关注公众号 获取更多精彩内容
