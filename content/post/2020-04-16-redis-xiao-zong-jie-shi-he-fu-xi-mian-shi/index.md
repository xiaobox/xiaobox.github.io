---
title: "Redis 小总结（适合复习、面试）"
slug: 2020-04-16-redis-xiao-zong-jie-shi-he-fu-xi-mian-shi
description: "Redis全称Remote DIctionary Server"
date: 2020-04-16T15:50:41.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-16-redis-xiao-zong-jie-shi-he-fu-xi-mian-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/XofjFhmmIn4YAidgOnZ87A
categories:
  - 数据库
tags:
  - Redis
  - 缓存
  - 数据结构
  - 面试
  - 架构
  - 多线程
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-16-redis-xiao-zong-jie-shi-he-fu-xi-mian-shi/001-46454814.png)

**Redis全称Remote DIctionary Server**

### 数据结构

![Image](002-e849e23d.png "image.png")

￼

-   string

-   hash

-   list

-   set

-   sortedset

### 持久化

-   RDB Redis DataBase(简称RDB)

-   AOF Append-only file (简称AOF)

RDB 持久化机制，是对 redis 中的数据执行**周期性**的持久化。

AOF：AOF 机制对每条写入命令作为日志，以 `append-only` 的模式写入一个日志文件中，在 redis 重启的时候，可以通过**回放** AOF 日志中的写入指令来重新构建整个数据集。

**RDB 和 AOF 到底该如何选择？**

-   不要仅仅使用 RDB，因为那样会导致你丢失很多数据；

-   也不要仅仅使用 AOF，因为那样有两个问题：第一，你通过 AOF 做冷备，没有 RDB 做冷备来的恢复速度更快；第二，RDB 每次简单粗暴生成数据快照，更加健壮，可以避免 AOF 这种复杂的备份和恢复机制的 bug；

-   redis 支持同时开启开启两种持久化方式，我们可以综合使用 AOF 和 RDB 两种持久化机制，用 AOF 来保证数据不丢失，作为数据恢复的第一选择; 用 RDB 来做不同程度的冷备，在 AOF 文件都丢失或损坏不可用的时候，还可以使用 RDB 来进行快速的数据恢复。

**如果突然机器掉电会怎样?**

取决于aof日志sync属性的配置，如果不要求性能，在每条写指令时都sync一下磁盘，就不会丢失数据。但是在高性能的要求下每次都sync是不现实的，一般都使用定时sync，比如1s1次，这个时候最多就会丢失1s的数据。

### redis 数据淘汰策略

-   volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰

-   volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰

-   volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰

-   allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰

-   allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰

-   no-enviction（驱逐）：禁止驱逐数据

**默认的内存策略是noeviction， 不删除任意数据(但redis还会根据引用计数器进行释放呦~),这时如果内存不够时，会直接返回错误**

### 客户端与 redis 的一次通信过程

![Image](003-cc6d2a81.png "image.png")

-   首先，redis 服务端进程初始化的时候，会将 server socket 的 `AE_READABLE` 事件与连接应答处理器关联。客户端 socket01 向 redis 进程的 server socket 请求建立连接，此时 server socket 会产生一个 `AE_READABLE` 事件，IO 多路复用程序监听到 server socket 产生的事件后，将该 socket 压入队列中。文件事件分派器从队列中获取 socket，交给**连接应答处理器**。连接应答处理器会创建一个能与客户端通信的 socket01，并将该 socket01 的 `AE_READABLE` 事件与命令请求处理器关联。

-   假设此时客户端发送了一个 `set key value` 请求，此时 redis 中的 socket01 会产生 `AE_READABLE` 事件，IO 多路复用程序将 socket01 压入队列，此时事件分派器从队列中获取到 socket01 产生的 `AE_READABLE` 事件，由于前面 socket01 的 `AE_READABLE` 事件已经与命令请求处理器关联，因此事件分派器将事件交给命令请求处理器来处理。命令请求处理器读取 socket01 的 `key value` 并在自己内存中完成 `key value` 的设置。操作完成后，它会将 socket01 的 `AE_WRITABLE` 事件与命令回复处理器关联。

-   如果此时客户端准备好接收返回结果了，那么 redis 中的 socket01 会产生一个 `AE_WRITABLE` 事件，同样压入队列中，事件分派器找到相关联的命令回复处理器，由命令回复处理器对 socket01 输入本次操作的一个结果，比如 `ok`，之后解除 socket01 的 `AE_WRITABLE` 事件与命令回复处理器的关联。

  这样便完成了一次通信。关于 Redis 的一次通信过程

### 高可用

**master/slave + 哨兵 Sentinel**

单机的 redis，能够承载的 QPS 大概就在上万到几万不等。对于缓存来说，一般都是用来支撑**读高并发**的。因此架构做成主从(master-slave)架构，一主多从，主负责写，并且将数据复制到其它的 slave 节点，从节点负责读。所有的**读请求全部走从节点**。这样也可以很轻松实现水平扩容，**支撑读高并发**。

redis 的高可用架构，叫做 `failover` **故障转移**，也可以叫做主备切换。

master node 在故障时，自动检测，并且将某个 slave node 自动切换为 master node 的过程，叫做主备切换。

sentinel，中文名是哨兵。哨兵是 redis 集群架构中非常重要的一个组件，主要有以下功能：

-   集群监控：负责监控 redis master 和 slave 进程是否正常工作。

-   消息通知：如果某个 redis 实例有故障，那么哨兵负责发送消息作为报警通知给管理员。

-   故障转移：如果 master node 挂掉了，会自动转移到 slave node 上。

-   配置中心：如果故障转移发生了，通知 client 客户端新的 master 地址。

![Image](004-813ed517.png "image.png")

**Redis Cluster**

-   Redis Cluster是社区版推出的Redis分布式集群解决方案，主要解决Redis分布式方面的需求，比如，当遇到单机内存，并发和流量等瓶颈的时候，Redis Cluster能起到很好的负载均衡的目的。

-   Redis Cluster集群节点最小配置6个节点以上（3主3从），其中主节点提供读写操作，从节点作为备用节点，不提供请求，只作为故障转移使用。

-   Redis Cluster采用虚拟槽分区，所有的键根据哈希函数映射到0～16383个整数槽内，每个节点负责维护一部分槽以及槽所映射的键值数据。

-   **自动将数据进行分片，每个 master 上放一部分数据**

-   **提供内置的高可用支持，部分 master 不可用时，还是可以继续工作的**

集群由N组主从Redis Instance组成。主可以没有从，但是没有从 意味着主宕机后主负责的Slot读写服务不可用。一个主可以有多个从，主宕机时，某个从会被提升为主，具体哪个从被提升为主，**协议类似于Raft**。

如何检测主宕机？**Redis Cluster采用quorum+心跳的机制**。从节点的角度看，节点会定期给其他所有的节点发送Ping，cluster-node-timeout(可配置，秒级)时间内没有收到对方的回复，则单方面认为对端节点宕机，将该节点标为PFAIL状态。通过节点之间交换信息收集到quorum个节点都认为这个节点为PFAIL，则将该节点标记为FAIL，并且将其发送给其他所有节点，其他所有节点收到后立即认为该节点宕机。从这里可以看出，主宕机后，至少cluster-node-timeout时间内该主所负责的Slot的读写服务不可用。

**Redis Sentinal着眼于高可用，在master宕机时会自动将slave提升为master，继续提供服务。**

**Redis Cluster着眼于扩展性，在单个redis内存不足时，使用Cluster进行分片存储。**

### 缓存穿透

对于系统A，假设一秒 5000 个请求，结果其中 4000 个请求是黑客发出的恶意攻击。

黑客发出的那 4000 个攻击，缓存中查不到，每次你去数据库里查，也查不到。

举个栗子。数据库 id 是从 1 开始的，结果黑客发过来的请求 id 全部都是负数。这样的话，缓存中不会有，请求每次都“**视缓存于无物**”，直接查询数据库。这种恶意攻击场景的缓存穿透就会直接把数据库给打死。

### 缓存击穿

缓存击穿，就是说某个 key 非常热点，访问非常频繁，处于集中式高并发访问的情况，当这个 key 在失效的瞬间，大量的请求就击穿了缓存，直接请求数据库，就像是在一道屏障上凿开了一个洞。

### 缓存雪崩

对于系统 A，假设每天高峰期每秒 5000 个请求，本来缓存在高峰期可以扛住每秒 4000 个请求，但是缓存机器意外发生了全盘宕机。缓存挂了，此时 1 秒 5000 个请求全部落数据库，数据库必然扛不住，它会报一下警，然后就挂了。此时，如果没有采用什么特别的方案来处理这个故障，DBA 很着急，重启数据库，但是数据库立马又被新的流量给打死了。

缓存雪崩的事前事中事后的解决方案如下：

-   事前：redis 高可用，主从+哨兵，redis cluster，避免全盘崩溃。

-   事中：本地 ehcache 缓存 + hystrix 限流&降级，避免 MySQL 被打死。

-   事后：redis 持久化，一旦重启，自动从磁盘上加载数据，快速恢复缓存数据。

### Cache Aside Pattern

最经典的缓存+数据库读写的模式，就是 Cache Aside Pattern。

-   读的时候，先读缓存，缓存没有的话，就读数据库，然后取出数据后放入缓存，同时返回响应。

-   更新的时候，**先更新数据库，然后再删除缓存**。

### Redis的并发竞争问题

Redis的并发竞争问题，主要是发生在并发写竞争。

-   利用redis自带的incr命令 （Redis 的原子性自增操作）

-   使用乐观锁的方式进行解决（成本较低，非阻塞，性能较高）redis 的命令 watch

-   利用redis的setnx实现内置的锁。

-   zookeeper分布式锁

-   利用消息队列:可以通过消息中间件进行处理,把并行读写进行串行化

### 分区分片

客户端分片

![Image](005-40017dc2.png "image.png")

代理分片,中件间

![Image](006-ba5487b2.png "image.png")

Redis Cluster

![Image](007-8f05da9d.png "image.png")

### 为什么 redis 单线程模型也能效率这么高？

-   纯内存操作。

-   核心是基于非阻塞的 IO 多路复用机制。

-   C 语言实现，一般来说，C 语言实现的程序“距离”操作系统更近，执行速度相对会更快。

-   单线程反而避免了多线程的频繁上下文切换问题，预防了多线程可能产生的竞争问题。

### Redis 常见的性能问题都有哪些？如何解决？

1).Master写内存快照，save命令调度rdbSave函数，会阻塞主线程的工作，当快照比较大时对性能影响是非常大的，会间断性暂停服务，所以Master最好不要写内存快照。

2).Master AOF持久化，如果不重写AOF文件，这个持久化方式对性能的影响是最小的，但是AOF文件会不断增大，AOF文件过大会影响Master重启的恢复速度。Master最好不要做任何持久化工作，包括内存快照和AOF日志文件，特别是不要启用内存快照做持久化,如果数据比较关键，某个Slave开启AOF备份数据，策略为每秒同步一次。

3).Master调用BGREWRITEAOF重写AOF文件，AOF在重写的时候会占大量的CPU和内存资源，导致服务load过高，出现短暂服务暂停现象。

4). Redis主从复制的性能问题，为了主从复制的速度和连接的稳定性，Slave和Master最好在同一个局域网内

### 优化redis内存

-   数据淘汰策略

-   优化序列化

-   缩减键值对象

-   Redis为列表、集合、散列、有序集合提供了一组配置选项，这些选项可以让redis以更节约的方式存储较短的结构。

![Image](008-399f532b.png "image.png")

### 与其它框架的比较

![Image](009-1a9d16b8.png "image.png")

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-16-redis-xiao-zong-jie-shi-he-fu-xi-mian-shi/010-84e813ce.jpg)

关注公众号 获取更多精彩内容
