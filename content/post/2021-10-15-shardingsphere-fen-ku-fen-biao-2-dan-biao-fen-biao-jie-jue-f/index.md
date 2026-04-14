---
title: "ShardingSphere 分库分表(2)-单表分表解决方案"
slug: 2021-10-15-shardingsphere-fen-ku-fen-biao-2-dan-biao-fen-biao-jie-jue-f
description: "上篇我们讲了单库分表在新业务上的实践 ShardingSphere 分库分表--第（1）篇，相对比较简单，这"
date: 2021-10-15T06:02:14.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-15-shardingsphere-fen-ku-fen-biao-2-dan-biao-fen-biao-jie-jue-f/cover.jpg
original_url: https://mp.weixin.qq.com/s/d-G1Z7jdkQ1b9bCaI-SSiQ
categories:
  - 数据库
tags:
  - MySQL
  - 算法
  - 网络
---
上篇我们讲了单库分表在新业务上的实践 [ShardingSphere 分库分表--第（1）篇](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247485417&idx=1&sn=9534fe090846866bf81bbf810b7a9f88&chksm=eb6db86fdc1a317985cecd1aeb84c5258a78737b1a7248ae4f04bfa643b6faaab85489147f49&scene=21#wechat_redirect)，相对比较简单，这篇我们接着聊。

## 单库分表-老业务

老业务就是原先表设计好了且业务已经在线跑了一段时间了，有历史数据了。

那么就有数据迁移的问题。迁移方向是从单表的老表到多表的新表。

在表结构不变的情况下要注意几个问题：

-   主键 id 问题
-   数据迁移

### 主键 id 问题

老表主键很可能是自增的，新表是分布式 id, 很可能是用雪花算法计算出来的，是不一样的。首先要保证新表的 id 和老表的不重复，当然这个重复的概率比较小。

老表 id 根据情况迁移到新表后可以用原始 id 值，也可以重新生成新的 id。如果你的业务并没有用老表 id 作任何业务操作只是一个主键标识，那么无所谓改不改，如果为了统一也可以重新用算法生成新的 id。而如果老表 id 本身有参与业务，比如你的 SQL 里面有利用这个字段关联表，那么就不要动了，因为成本非常高，改的东西很多，个人认为没有必要。

### 数据迁移

数据迁移或者叫在线扩容，我们这里的场景只针对之前是单库单表变成单库多表的情况。

停机迁移

当然是可以的，停机后将老表数据同步分流到新表上，然后再开机，这样数据不会有不一致的问题。但是要看业务情况，很多业务是 7\*24 小时在线不允许停机的，那就不能进行停机迁移，而如果允许一段时间停机比如某政务系统，给系统用户发个通告停机一段时间，是可以的。

至于具体数据迁移操作可以借用工具或者自己编写程序做，根据不同方法的性能和影响时间进行选择，我们当然期望停机时间越短越好。

不停机迁移

常见的方式是双写，将业务数据双写到老表和新表中，这样能保证从双写开始时点的新数据是一致的，至于老数据再通过程序或工具慢慢迁移，直到迁移完成新老表中的数据一致就可以将应用程序完全切换到新的分表进行操作，停掉对于老表的访问。

### ShardingSphere 提供的迁移工具

上文中有关数据迁移的方案无论是停机还是不停机的都跟 ShardingSphere 没有关系，这里我们看一下 ShardingSphere 提供的方案，或者说利用 ShardingSphere 我们如何做好数据迁移。

Sharding-Proxy+Sharding-Scaling 是专门用于设计处理分库分表扩容数据迁移问题的组件

我们先抛开别的不谈，先针对数据迁移这个动作来说

具体针对本文的例子来说就是把一张单表的数据迁移到具有分表规则的多表中。想一下，其实原理比较简单：就是从单表中把数据读出来然后根据分表规则 insert 到新表中。

来看下用 ShardingSphere-proxy 结合 ShardingSphere-Scaling 怎么做。

软件版本情况：

-   MySQL 8.0
-   ShardingSphere-proxy 5.0-beta
-   ShardingSphere-Scaling 5.0-beta

ShardingSphere-proxy这端比较简单，跟之前文章中介绍的 proxy 配置方法差不多，下文是我的 config-myapp.yaml 的配置：

```yaml

schemaName: my-app

dataSources:
  write_ds:
    url: jdbc:mysql://mysql.local.test.myapp.com:23306/test?allowPublicKeyRetrieval=true&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai&useSSL=false&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
    username: root
    password: nicai
    connectionTimeoutMilliseconds: 3000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
    maintenanceIntervalMilliseconds: 30000
  read_ds_0:
    url: jdbc:mysql://mysql.local.test.read1.myapp.com:23306/test?allowPublicKeyRetrieval=true&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai&useSSL=false&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
    username: root
    password: nicai
    connectionTimeoutMilliseconds: 3000
    idleTimeoutMilliseconds: 60000
    maxLifetimeMilliseconds: 1800000
    maxPoolSize: 50
    minPoolSize: 1
    maintenanceIntervalMilliseconds: 30000

rules:
  - !SHARDING
    tables:
    # 虚拟表名称
      t_order_sharding:
        actualDataNodes: write_ds.t_order_sharding_$->{0..1}
        tableStrategy:
          standard:
          # 分片键
            shardingColumn: order_id
            shardingAlgorithmName: table_inline
        keyGenerateStrategy:
          column: id
          keyGeneratorName: snowflake  #主键生成策略 -- 雪花算法
    shardingAlgorithms:
      table_inline:
        type: INLINE
        props:
          # 数据库表分表规则
          algorithm-expression: t_order_sharding_$->{order_id % 2 }
    keyGenerators:
      snowflake:
        type: SNOWFLAKE
        props:
          worker-id: 123

```

分片规则也很简单，就是 2 个表，用 2 取模。

由于 proxy 和 scaling 都需要连接 zookeeper , 所以在启动 proxy 之前，我先在本地部署了一个 zookepper

```bash
cd apache-zookeeper-3.6.3-bin/
cd conf
cp zoo_sample.cfg zoo.cfg
...
cd bin
./zkServer.sh

```

测试 zookeeper 正常启动，我的笔记本是 macbook 用的 zookeeper 客户端是 prettyZoo(https://github.com/vran-dev/PrettyZoo). 之后将 proxy 无异常的启动起来，用 MySQL 客户端测试连接正常，这步就搞定了。

ShardingSphere-Scaling这里有坑，文档上没写，是这样的，首先 修改 server.xml, 将注册中心的配置打开，配置上我们刚才启动的 zookeeper。

```yaml
scaling:
  port: 8888
  blockQueueSize: 10000
  workerThread: 30

governance:
  name: governance_ds
  registryCenter:
    type: ZooKeeper
    serverLists: localhost:2181

```

然后到 bin 目录下运行 server\_start.sh 就可以正常启动了，但可以看到 bin 目录下还有这些文件：

-   server\_start.bat
-   server\_start.sh
-   server\_stop.sh
-   worker\_start.bat
-   worker\_start.sh
-   worker\_stop.sh

嗯，相信你也觉得 workder\_start 应该有点儿用，于是我就把它用启动起来，可是却给我这样的提示：

```
ERROR: The ShardingSphere-Scaling already started!
PID: 11946
12336

```

开始我以为见文知意，就是那个意思，人家已经启动了，不用再启了，就没管它，可当我来回折腾了一天配置发现怎么都不行于是 download 源码本地 debug 后才知道，不行还是得跑，它是有用的，只不过我是重新 copy 了文件目录，然后修改了端口号再执行的。也就是分别启了两个进程，分别执行了 worker\_start.sh 和 server\_start.sh

还有 2 个地方要注意，官文文档上也提到了：

-   如果后端连接 MySQL 数据库，请下载 mysql-connector-java-5.1.47.jar，并将其放入 ${shardingsphere-scaling}\\lib 目录。
-   MySQL 需要开启 binlog，binlog format 为 Row 模式，且迁移时所使用用户需要赋予 Replication 相关权限。

再之后，是利用 Scaling 的 API 接口请求，新建并开始迁移任务，先看下我的“创建迁移任务”请求：

```bash
curl -X POST \
  http://localhost:8888/scaling/job/start \
  -H 'content-type: application/json' \
  -d '{
        "ruleConfig": {
          "source": {
            "type": "shardingSphereJdbc",
            "parameter": "
                dataSources:
                  write_ds:
                    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
                    jdbcUrl: jdbc:mysql://mysql.local.test.myall.com:23306/test?allowPublicKeyRetrieval=true&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai&useSSL=false&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
                    username: root
                    password: nicai
                rules:
                - !SHARDING
                  tables:
                    # 虚拟表名称
                    t_order_sharding:
                      actualDataNodes: write_ds.t_order_sharding
                      tableStrategy:
                        standard:
                          # 分片键
                          shardingColumn: order_id
                          shardingAlgorithmName: table_inline
                  shardingAlgorithms:
                    default_db_inline:
                      type: INLINE
                      props:
                        algorithm-expression: write_ds
                    table_inline:
                      type: INLINE
                      props:
                        # 数据库表分表规则
                        algorithm-expression: t_order_sharding
                "
          },
          "target": {
              "type": "jdbc",
              "parameter": "
                username: root
                password: root
                jdbcUrl: jdbc:mysql://127.0.0.1:3307/my-app?serverTimezone=UTC&useSSL=false
                "
          }
        },
        "jobConfiguration":{
          "concurrency":"1"
        }
      }'

```

由于我是想从单表迁移数据到多分表，所以 rules 里面配置的都是单表名称，而   target 中的就是我们的 proxy，由于 proxy 中已经配置了分表规则，所以 scaling 能够利用“源（单表）”和“目标（proxy 配置的分表）” 来进行数据的迁移工作。

任务创建好后并执行后可以执行以下请求查看任务进度：

```bash
curl -X GET \
  http://localhost:8888/scaling/job/progress/655462928387932161

```

最后跟的数字就是你的任务 id。也可以查看所有任务和停止某任务，具体请参考官方文档：https://shardingsphere.apache.org/document/5.0.0-beta/cn/user-manual/shardingsphere-scaling/usage/

这是任务从开始执行到结束，我 worker 的后台日志：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-15-shardingsphere-fen-ku-fen-biao-2-dan-biao-fen-biao-jie-jue-f/001-ac824dfa.jpg)

从数据库结果上看，我的单表中的数据也确实按照分表规则被分到了不同的表中。

官方文档说可以利用 shardingsphere-ui 项目可视化的操作迁移任务，我下载并启动了 apache-shardingsphere-5.0.0-alpha-shardingsphere-ui 这个版本，但不知是不是版本的问题，报各种空指针异常，由于时间的关系就没有下源码再分析了，期望后续版本能够正常。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-15-shardingsphere-fen-ku-fen-biao-2-dan-biao-fen-biao-jie-jue-f/002-787de9fa.jpg)

如果再执行一次会怎样？

重复操作，再执行一次会报错，提示表不为空。于是我推测不能直接做增量迁移。不过 ShardingSphere 是支持增量迁移的，但时机是在总的迁移任务开始以后自动做，如果在迁移的时间段内有新的增量数据进到老表，SharadingSphere-Scaling 是会根据 MySQL 的 binlog 来把这些数据出迁移到新表中的。

### 分布式治理

ShadringSphere 提供了分布式治理的解决方案，它实现的动机如下：

-   配置集中化：越来越多的运行时实例，使得散落的配置难于管理，配置不同步导致的问题十分严重。将配置集中于配置中心，可以更加有效进行管理。

-   配置动态化：配置修改后的分发，是配置中心可以提供的另一个重要能力。它可支持数据源和规则的动态切换。

-   存放运行时的动态/临时状态数据，比如可用的 ShardingSphere 的实例，需要禁用或熔断的数据源等。

-   提供熔断数据库访问程序对数据库的访问和禁用从库的访问的编排治理能力。治理模块仍然有大量未完成的功能（比如流控等）

我们利用分布式治理来实现一个配置动态切换和更新的功能（比如分片规则和数据源）

软件环境：

-   MySQL 8
-   SpringBoot 2
-   ShardingSphere 5.0.0-beta

首先引入相关依赖

```html
<!-- sharding jdbc 依赖-->
<!--<dependency>-->
    <!--<groupId>org.apache.shardingsphere</groupId>-->
    <!--<artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>-->
    <!--<version>5.0.0-beta</version>-->
<!--</dependency>-->

<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc-governance-spring-boot-starter</artifactId>
    <version>5.0.0-beta</version>
</dependency>

<!-- 使用 ZooKeeper 时，需要引入此模块 -->
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-governance-repository-zookeeper-curator</artifactId>
    <version>5.0.0-beta</version>
</dependency>

```

注意注释掉的部分是之前用 jdbc 的时候写的，如果要用治理功能需要注释掉那部分依赖。

修改 spring 配置文件

```yaml
spring:
  profiles:
    include: common-local

  shardingsphere:
    governance:
      name: governance_ds_test
      overwrite: false
      registry-center:
        server-lists: localhost:2181
        type: Zookeeper

```

这里我们用本地的 zookeeper 作配置和注册中心，本来 ShardingSphere 的老版本 apollo 和 nacos 是支持作配置中心的，但后来给移除了：https://github.com/apache/shardingsphere/issues/9538

根据官方文档提供的数据结构，编写注册中心数据（配置跟之前的非常类似）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-15-shardingsphere-fen-ku-fen-biao-2-dan-biao-fen-biao-jie-jue-f/003-24351431.jpg)

到这里基本就结束了，可以启动应用看一下能不能正常连接到数据库并操作数据。

接着我们可以将注册中心的数据修改一下，比如你之前没有加入分片规则，那么读的是单表，修改后加入了分片规则就可以让程序去读多表了。这样就实现了我们从 zookeeper 这端更新配置，应用程序那端动态更新了数据源或分片规则。

### 整体方案

基于以上所有，我的整体方案是这样的，大致分三步：

-   先迁移数据
-   再动态更新配置
-   手动补录数据

第一步，修改应用的配置文件，引入 ShardingSphere 分布式治理依赖，将数据库相关配置拆解到 zookeeper 中。但保持老表配置不变，不作分片。最后上线更新应用。这一步由于没改什么东西，对用户和开发都是无感的。

第二步，根据要迁移的表的数据量做好迁移时间的评估，然后挑一个业务量最少的时间段，利用上文的 ShardingSphere-proxy + ShardingSphere-Scaling 方案进行单表到多表的数据迁移，这时数据源连接什么的都不变，所有请求还在老表中。只是数据在迁移，而且利用 ShardingSphere-Scaling 可以将存量和迁移过程中产生的增量数据全部迁移到新表中。

第三步，迁移完成后修改 zookeeper 中的配置，加入分片规则，所有请求将打到新的分片表中。

第四步，在迁移完成到配置切换完成这段时间，可能是几秒或者几分钟，虽然我们已经挑了一个业务量最少的时段进行操作，但仍然有可能会有用户的写请求进来，那么在这个时段产生的数据是会在老表中，不在新表中的。对于这部分数据我们需要人工去查询并尽快补录到新表中。由于这样的数据不会太多，所以操作起来也不会很麻烦，最好提前写好程序到时候跑一下，两边同步就可以了。

以上方案对于应用是完全透明的，不用改一行代码。

## 其他情况

本文的场景是单库单表到单表多表的分表场景实现，其他场景如：

-   单库 多表分片在线扩容（比如原来分了2个表，现在要分4个）
-   多库 多表分片在线扩容 (比如原来分了2个库2个表，现在要分4个库4个表）

有了本文的铺垫，这些场景在处理上就大同小异了，只是不同配置而已。

## 参考

-   https://blog.51cto.com/u\_15057819/2622783
-   https://tech.meituan.com/2016/11/18/dianping-order-db-sharding.html
-   https://shardingsphere.apache.org/document/5.0.0-beta/en/overview/
