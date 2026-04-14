---
title: "分布式事务：从理论到实践（三）"
slug: 2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san
description: "分布式事务：从理论到实践"
date: 2020-10-29T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/cover.jpg
original_url: https://mp.weixin.qq.com/s/CLupcB0_M7hw43GtUsCxXA
categories:
  - 云原生
tags:
  - 网络
---
# 分布式事务：从理论到实践（三）

[](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484799&idx=1&sn=5be388a7fe885ce4dd26b921a3f86ebe&chksm=eb6dbaf9dc1a33ef372547b3d9f817508e01f7e3d033a58dde3cd155ad3ed26feea637f4daa9&scene=21#wechat_redirect)[分布式事务：从理论到实践（一）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484799&idx=1&sn=5be388a7fe885ce4dd26b921a3f86ebe&chksm=eb6dbaf9dc1a33ef372547b3d9f817508e01f7e3d033a58dde3cd155ad3ed26feea637f4daa9&scene=21#wechat_redirect)
[分布式事务：从理论到实践（二）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484828&idx=1&sn=06b7a0ac80937e7958d15628eb3303d0&chksm=eb6dba1adc1a330c97d2f97575ceedfd592f1186a6ce159a09e63d7879d7353ef8b605e23784&scene=21#wechat_redirect)

接着前面两篇说，下面我们继续对 Seata 的 TCC 模式进行讨论。

## TCC

### 原理回顾

简单回顾一下TCC的原理 参考 蚂蚁金服的博客[1]

正常事务逻辑

1.  try
2.  cancel 或 confirm

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/001-c5a2c9ae.jpg)

允许空回滚

1 未正常 try 2 执行了空 cancel

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/002-2c38ed9d.jpg)TCC 服务在未收到 Try 请求的情况下收到 Cancel 请求，这种场景被称为空回滚；空回滚在生产环境经常出现，用户在实现TCC服务时，应允许允许空回滚的执行，即收到空回滚时返回成功。

防悬挂控制

1.  try超时
2.  cancel成功
3.  try重试
4.  Confirm 或者 Cancel 永远不会得到执行，造成悬挂。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/003-cbb6181f.jpg)

此外，除了上面这些，和AT一样，还是要注意幂等的控制。

### 代码实现

先讲下抽象流程和注意事项![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/004-3c678167.jpg)

-   首先定义事务接口，接口中就是你的tcc三个方法，对应代码中的prepare、commit、rollback。
-   注意加@LocalTCC 注解（必要），适用于SpringCloud+Feign模式下的TCC
-   @TwoPhaseBusinessAction（必要） 注解try方法，name 一般写方法名就行，注意全局唯一，commitMethod对应提交方法名，rollbackMethod对应回滚方法名。
-   BusinessActionContext 就是 seata tcc 的事务上下文，用于存放 tcc 事务的一些关键数据。BusinessActionContext 对象可以直接作为 commit 方法和 rollbakc 方法的参数，Seata 会自动注入参数:

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/005-b38021fd.jpg)

-   @BusinessActionContextParameter 该注解用来修饰 Try 方法的入参，被修饰的入参可以在 Commit 方法和 Rollback 方法中通过 BusinessActionContext 获取![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/006-1843c3a6.jpg)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/007-7fb1fc16.jpg)

我们根据 官方的例子[2]用一个业务场景串一下。

这是一个转账的操作：

接口定义：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/008-8cd167a6.jpg)

在事务调用入口加入 @GlobalTransactional![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/009-efe62a01.jpg)

-   先让扣钱参与者准备扣钱，如果失败，则回滚本地和分布式事务

    看下扣钱的try方法实现：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/010-f0594279.jpg)

-   再让加钱参与者准备加钱，如果失败，则回滚本地和分布式事务 看下加钱的try方法实现：

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/011-50282abf.jpg)

-   如果上面两步都成功，则会分别调用各自的commit方法，如果方法有异常将会重试firstAction 提交扣钱

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/012-2873e8b0.jpg)secondActin 提交加钱![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/013-22fe72aa.jpg)

-   如果firstAction和secondAction的try方法有异常将会自动调用各自的rollback方法：

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/014-26a139fa.jpg)

    ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/015-a3a7f778.jpg)

## 总结

整体来看TCC的模式编码还是比较简单的，不过还是有几点需要注意：

-   根据业务设计好tcc的三个方法

-   接口幂等

-   允许空回滚 比如以订单创建举例，如果try()方法没执行，那么订单一定没创建，所以cancle方法里可以加一个判断，如果上下文中订单编号orderNo不存在或者订单不存在，直接return

  `if(orderNo==null || order==null){       return;     }`

-   防悬挂控制 参考[3]  ） 可以在二阶段执行时插入一条事务控制记录，状态为已回滚，这样当一阶段执行时，先读取该记录，如果记录存在，就认为二阶段回滚操作已经执行，不再执行try方法。

### 参考资料

[1]

蚂蚁金服TCC博客: *https://tech.antfin.com/community/articles/519*

[2]

seata例子: *https://github.com/seata/seata-samples*

[3]

CSDN参考: *https://blog.csdn.net/hosaos/article/details/89136666*

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-10-29-fen-bu-shi-shi-wu-cong-li-lun-dao-shi-jian-san/016-44a5086d.gif)

关注公众号 获取更多精彩内容
