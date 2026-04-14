---
title: "ZooKeeper 并没有直接采用 Paxos 算法"
slug: 2022-05-23-zookeeper-bing-mei-you-zhi-jie-cai-yong-paxos-suan-fa
description: "ZooKeeper 并没有直接采用 Paxos 算法，而是采用一种被称为 ZAB（ZooKeeper Ato"
date: 2022-05-23T07:58:58.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-05-23-zookeeper-bing-mei-you-zhi-jie-cai-yong-paxos-suan-fa/cover.jpg
original_url: https://mp.weixin.qq.com/s/C0jIa5ub9QGEo1Lac-NaGg
categories:
  - 中间件
tags:
  - MySQL
  - ZooKeeper
  - 算法
---
ZooKeeper 并没有直接采用 Paxos 算法，而是采用一种被称为 ZAB（ZooKeeper Atomic Broadcast）的一致性协议

Paxos 算法是基于消息传递的分布式一致性算法，很多大型的网络技术公司和开源框架都采用 Paxos 算法作为其各自的底层解决方案，比如 Chubby 、 Megastore 以及 MySQL Group Replication 。Paxos 算法运行在服务器发生宕机故障的时候，能够保证数据的完整性，不要求可靠的消息传递，可容忍消息丢失、延迟、乱序以及重复，保证服务的高可用性。

ZAB 协议并不像 Paxos 算法那样，一种通用的分布式一致性算法，而是一种特别为 ZooKeeper 设计的崩溃可恢复的原子消息广播算法

当 Leader 服务器不可用或者已经不存在过半服务器与该 Leader 服务器保持正常通信时，在重新开始新一轮的原子广播事务操作之前，ZAB 会进入恢复模式选举新的 Leader 服务器，使集群彼此达到一个一致的状态，从消息广播模式进入到崩溃恢复模式。当集群过半机器都与新的 Leader 服务器完成了状态同步操作后 ZAB 协议会退出恢复模式

两者相同之处是，在执行事务会话的处理中，两种算法最开始都需要一台服务器或者线程针对该会话，在集群中发起提案或是投票。只有当集群中的过半数服务器对该提案投票通过后，才能执行接下来的处理。

而 Paxos 算法与 ZAB 协议不同的是，Paxos 算法的发起者可以是一个或多个。当集群中的 Acceptor 服务器中的大多数可以执行会话请求后，提议者服务器只负责发送提交指令，事务的执行实际发生在 Acceptor 服务器。这与 ZooKeeper 服务器上事务的执行发生在 Leader 服务器上不同。Paxos 算法在数据同步阶段，是多台 Acceptor 服务器作为数据源同步给集群中的多台 Learner 服务器，而 ZooKeeper 则是单台 Leader 服务器作为数据源同步给集群中的其他角色服务器。

## 参考

-   https://www.cnblogs.com/aspirant/p/13423780.html
-   https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/ZooKeeper%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%E4%B8%8E%E5%AE%9E%E6%88%98-%E5%AE%8C/30%20ZAB%20%E4%B8%8E%20Paxos%20%E7%AE%97%E6%B3%95%E7%9A%84%E8%81%94%E7%B3%BB%E4%B8%8E%E5%8C%BA%E5%88%AB.md
