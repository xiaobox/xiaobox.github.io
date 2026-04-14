---
title: "SpringBoot + ShardingSphere-JDBC 实现读写分离"
slug: 2021-09-17-springboot-shardingsphere-jdbc-shi-xian-du-xie-fen-li
description: "上一篇我们用 ShardingSphere-Proxy实现了读写分离ShardingSphere 实战之读写"
date: 2021-09-17T11:00:14.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-17-springboot-shardingsphere-jdbc-shi-xian-du-xie-fen-li/cover.jpg
original_url: https://mp.weixin.qq.com/s/lRgJ2MZ2vGzNu6EGVEyBug
categories:
  - 数据库
tags:
  - Spring
  - MySQL
  - 算法
  - 网络
---
上一篇我们用 ShardingSphere-Proxy实现了读写分离

[ShardingSphere 实战之读写分离](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247485338&idx=1&sn=95eec688c252132be244f98f471bfc29&chksm=eb6db81cdc1a310a000dd2513eb65a98c01dd121622a8e2637598624e65f7ab7efc86cd28991&scene=21#wechat_redirect)

这一次我们用 ShardingSphere-JDBC 来实现一下

## 引入依赖

我本地用的是 springboot 2 的版本，引用的 ShardingSphere-JDBC 的`5.0.0-beta` 版本

```html
 <dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>
    <version>5.0.0-beta</version>
</dependency>

```

## 修改配置文件

```yaml
spring:
  profiles:
    include: common-local
  shardingsphere:
    datasource:
      names: write-ds,read-ds-0
      write-ds:
        jdbcUrl: jdbc:mysql://mysql.local.test.myapp.com:23306/test?allowPublicKeyRetrieval=true&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai&useSSL=false&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: nicai
        connectionTimeoutMilliseconds: 3000
        idleTimeoutMilliseconds: 60000
        maxLifetimeMilliseconds: 1800000
        maxPoolSize: 50
        minPoolSize: 1
        maintenanceIntervalMilliseconds: 30000
      read-ds-0:
        jdbcUrl: jdbc:mysql://mysql.local.test.read1.myall.com:23306/test?allowPublicKeyRetrieval=true&useSSL=false&allowMultiQueries=true&serverTimezone=Asia/Shanghai&useSSL=false&autoReconnect=true&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        username: root
        password: nicai
        connectionTimeoutMilliseconds: 3000
        idleTimeoutMilliseconds: 60000
        maxLifetimeMilliseconds: 1800000
        maxPoolSize: 50
        minPoolSize: 1
        maintenanceIntervalMilliseconds: 30000

    rules:
      readwrite-splitting:
        data-sources:
          glapp:
            write-data-source-name: write-ds
            read-data-source-names:
              - read-ds-0
            load-balancer-name: roundRobin # 负载均衡算法名称
        load-balancers:
          roundRobin:
            type: ROUND_ROBIN # 一共两种一种是 RANDOM（随机），一种是 ROUND_ROBIN（轮询）

```

这里主要根据官网的 property 配置文件转的 yaml 文件，需要注意几点：

-   type: com.zaxxer.hikari.HikariDataSource 我用的是 Hikari 连接池，根据你的实际情况来
-   driver-class-name: com.mysql.cj.jdbc.Driver 不同 mysql 版本不一样，根据你的实际情况来，我的是 mysql 8.0
-   jdbcUrl ，官网上写的是 url, 不对，要写成 jdbcUrl

## 遇到的问题

```yaml
Description:

Configuration property name 'spring.shardingsphere.datasource.write_ds' is not valid:

    Invalid characters: '_'
    Bean: org.apache.shardingsphere.spring.boot.ShardingSphereAutoConfiguration
    Reason: Canonical names should be kebab-case ('-' separated), lowercase alpha-numeric characters and must start with a letter

Action:

Modify 'spring.shardingsphere.datasource.write_ds' so that it conforms to the canonical names requirements.

```

之前把配置文件中的某些名字配置用下划线写了，不行，得用中线。

## 测试

所有的改动只有以上这么多，还是比较简单的，以下的读库请求打过来时的监控，证明读请求都过来了，写库没有。

这是写库的：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-17-springboot-shardingsphere-jdbc-shi-xian-du-xie-fen-li/001-06165c31.jpg)

这是读库的：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-17-springboot-shardingsphere-jdbc-shi-xian-du-xie-fen-li/002-e048df72.jpg)

## 参考

-   https://shardingsphere.apache.org/document/5.0.0-beta/
