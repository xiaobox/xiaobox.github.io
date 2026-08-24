---
title: "少打一条下划线，他坐了18个月的牢"
slug: 2026-07-28-shao-da-yi-tiao-xia-hua-xian-ta-zuo-le-18-ge-yue-de-lao
description: "加拿大警方调查时把用户名少打一条下划线，让无辜者 Brandon Klayme 蒙冤入狱 18 个月，借这起案件说明现实流程缺乏代码世界的报错与回滚等纠错机制。"
date: 2026-07-28T04:00:00.000Z
image:
original_url:
categories:
  - 杂谈
---
程序员每天都在打下划线。

`user_name` 和 `user__name`，在代码里是两个完全不同的标识符。IDE 会标红，编译器会报错，数据库查询会返回空。

但在代码之外，没有这层保护。

2026 年 7 月，加拿大新斯科舍省上诉法院推翻了一起案件的全部定罪。一个叫 Brandon Klayme 的男人被无罪释放。在此之前，他已经在监狱里待了 18 个月。

![CBC 报道原文，标题就叫「一条下划线如何让一个无辜的哈利法克斯男人被定罪」](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/underscore-cbc-headline.png)

事情要从一起网络犯罪调查说起。

美国威斯康星州的警方在追踪一个 Kik 账户（加拿大微信）。嫌疑人的用户名是 `fus__ro_dah`，两条下划线。玩过上古卷轴的都知道，这是游戏里龙吼的名字。

调查人员需要向 Kik 调取这个账户的注册邮箱。就是在这一步，有人把用户名打成了 `fus_ro_dah`，少了一条下划线。

平台数据库按这个字符串查了，返回了一个结果。没有报错，也没有「未找到匹配项」。因为 `fus_ro_dah` 这个用户名恰好也存在，属于住在加拿大哈利法克斯的 Brandon Klayme。

![CBC 报道原文段落，fus__ro_dah 两条下划线，fus_ro_dah 一条下划线](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/underscore-cbc-usernames.png)

要命的是这个。

如果打错的用户名不存在，系统会返回空，调查人员会重新核对。偏偏它指向了一个真实的人。

拿到邮箱，调取 IP，IP 指向 Klayme 的家。搜查令批了，警察上了门。2020 年 2 月，Klayme 被逮捕。等了三年多才等到审判。2023 年 4 月，定罪，判了 18 个月监禁加 18 个月缓刑。

流程上每一步都过得去。Kik 查了数据库，邮件服务商查了日志，法官签了搜查令。每个环节都在认真干活。

好像没有人犯一眼能看见的大错。

但因为一个小错，Klayme 白白坐了 18 个月牢。

Klayme 在法庭上说过，那不是他的账号。但「我的用户名多一条下划线」。这句话，在一个没人写过代码的法庭里，听起来跟「不是我干的」差不多。

我看到这个案子，脑子里冒出来的是四个字，错误传播。

写过代码的都见过。一个函数输入错了，它不会自己纠正。它会把错误输入认真处理一遍，吐出一个格式很漂亮的错误结果。下一个函数接着干，继续处理，继续输出。中间每一步都能过 code review，最后结果却离正确答案十万八千里。

![错误像多米诺，从一个小键帽一路推倒到一扇牢门](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/underscore-domino-chain.png)

写代码时我们还不怕这个。单元测试会拦，code review 会抓，灰度会露馅，实在不行还能 rollback。

现实世界的流程没有这些东西。

搜查令没有单元测试。

一个人的自由也没有 rollback。

辩护律师 Zebu Brown 在准备上诉时，才发现那条消失的下划线。上诉法院后来的意思是，如果一开始用的是正确的用户名，后面所有调查步骤都不会指向 Klayme。

线索本该指向加利福尼亚州的某个人。

从被捕到翻案，六年。

你每天写代码的时候，有多少次是靠 IDE 的红色波浪线救回来的？有多少次是靠编译器报了个 error，才发现自己手滑了？

这些保护机制我们早就当成空气了。然而代码之外的世界，一个都没有。

![写代码时有红色波浪线当安全网，代码之外什么都没有](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/underscore-ide-safety-net.png)

顺便说一句，注册账号的时候，用户名别起那种只靠下划线数量来区分的。不是每个人都能一眼看出 `_` 和 `__` 的差别。你不知道屏幕对面那个敲键盘的人，懂不懂什么叫标识符。
