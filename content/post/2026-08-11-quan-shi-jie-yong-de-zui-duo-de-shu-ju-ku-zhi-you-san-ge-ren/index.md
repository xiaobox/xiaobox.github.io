---
title: "全世界用得最多的数据库，只有三个人在写"
slug: 2026-08-11-quan-shi-jie-yong-de-zui-duo-de-shu-ju-ku-zhi-you-san-ge-ren
description: ""
date: 2026-08-11T04:00:00.000Z
image:
original_url:
categories:
  - 数据库
tags:
  - MySQL
  - PostgreSQL
  - MongoDB
  - Git
  - Chrome
---

你手机里有一个数据库。

你没装过它，没见过它的图标，大概也没听过它的名字。它叫 SQLite。

你手机上几乎每个 App 都在用它存数据。Safari 和 Chrome 拿它存书签和历史记录。微信用它。安卓的系统设置用它。你家电视机的固件里可能有它。你车里的中控屏里可能也有它。

SQLite 的作者 Richard Hipp 说，现在全世界运行中的 SQLite 实例数量超过所有其他数据库引擎加起来的总和。他自己估算超过一万亿个。

Oracle 有十四万员工。MongoDB 有大约三千人。

写 SQLite 的，三个人。

Richard Hipp，Dan Kennedy，Joe Mistachkin。三个人分布在美国北卡罗来纳、东南亚和另一个时区，共同维护这个地球上部署数量最多的数据库。

故事要从一艘军舰说起。

2000 年春天，Hipp 在 General Dynamics 做外包，给美国海军写导弹驱逐舰上的软件。舰上跑的数据库是 Informix，装一次或者升级一次要停掉系统一整天。他要写的程序必须在数据库宕机的时候也能跑。

当时市面上没有合适的嵌入式数据库。

Hipp 想了想，「数据库能有多难？我自己写一个。」

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/sqlite-%E5%86%9B%E8%88%B0%E8%B5%B7%E7%82%B9-v2.png)

2000 年 5 月 29 日，他写下了第一行代码。做完以后放到网上，以为跟自己之前写的开源项目一样，每年五到十个人下载。

然后 Motorola 打来了电话。「我们能买你的技术支持吗？」

Hipp 很困惑。你们为什么要为免费软件买支持？

Motorola 要把 SQLite 装到手机里。那是功能机时代，手机存储空间很小，系统里跑不了 MySQL 或 PostgreSQL 这种大型数据库。SQLite 整个就是一个 C 语言源文件，编译进应用就行了，不需要单独装一个数据库服务器。

诺基亚用了它。摩托罗拉用了它。后来苹果做 iPhone 用了它，Google 做 Android 也用了它。嵌入式数据库这个品类里，SQLite 几乎是唯一一个够成熟、够稳定、法律上你怎么用都不会有问题的东西。

为什么法律上没问题？因为 SQLite 的代码是 public domain。

跟 MIT 许可证、Apache 许可证、GPL 都不一样。那些好歹还是许可证，规定了你能做什么不能做什么。SQLite 直接放弃了版权，进入公共领域。任何人可以拿走做任何事，不需要署名，不需要付钱，不需要通知任何人。

但这个三个人的团队不接受外部代码贡献。

你想给 SQLite 提交一行代码，他们不会合进去，除非你先签一份 affidavit（宣誓书），把你写的东西永久放入公共领域。Hipp 的理是，SQLite 所有代码必须在公共领域里，如果接受了一个贡献者的代码，那个人没把版权真正放弃干净，将来出了法律纠纷，整个项目都会被拖进去。大多数人看到这个要求就算了。

所以二十六年来，基本上就是三个人在写。

代码大约 15.58 万行。

测试代码大约 9200 万行。590 倍。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/sqlite-%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81590%E5%80%8D.png)

这个比例听上去离谱，因为它确实离谱。SQLite 用的测试标准叫 DO-178B，航空安全软件用的那套。你坐飞机时机载电脑跑的代码，就是按这个标准测的。SQLite 做到了 100% 分支覆盖率和 100% MC/DC 覆盖。Hipp 在播客里说过，光把覆盖率从 95% 推到 100%，他花了一整年，每天工作十二小时。

做到这个程度的测试套件，叫 TH3，Test Harness #3。

它是闭源的。要付钱买许可证才能看。

SQLite 的代码是 public domain，你可以免费拿去做任何事。但是能证明这些代码没有问题的那套测试，是专有的。代码免费，质量保证收费。这就是三个人养活自己的方式。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/sqlite-%E4%BB%A3%E7%A0%81%E5%85%8D%E8%B4%B9%E6%B5%8B%E8%AF%95%E6%94%B6%E8%B4%B9.png)

Hipp 后来在 SIGMOD 的采访里说，「如果我当时知道这有多难，我大概永远不会动手写。所以有时候，无知就是力量。」

他说 Mike Stonebraker 当年开始做数据库的时候也说过同样的话。「数据库能有多难？」

他连版本控制工具都不用现成的。SQLite 的代码不在 Git 上管理，用的是 Fossil，一个 Hipp 自己写的分布式版本控制系统。你以为他只是写了个数据库，他顺手还写了个版本控制。

2026 年 6 月，费城，Cesium Developer Conference。Bentley Systems 的创始人 Keith Bentley 把 Bentley 终身成就奖颁给了 Richard Hipp。三个人写了二十六年的数据库，还在写。不知道将来谁能接班。
