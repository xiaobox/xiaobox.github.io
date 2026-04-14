---
title: "持续演进的Cloud Native (读书笔记01)"
slug: 2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01
description: "这是《持续演进的Cloud Native:云原生架构下微服务最佳实践》读书笔记的第一篇"
date: 2020-02-29T15:53:59.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/cover.jpg
original_url: https://mp.weixin.qq.com/s/24f53CtBaatDewTsLZ_CfQ
categories:
  - 云原生
tags:
  - 微服务
  - 架构
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/001-d902a95a.png)

**Cloud Naive 定义**

如果非要给Cloud Native下一个定义，那么我认为，Cloud Native是一系列架构、研发流程、团队文化的最佳实践集合，以此支撑更快的创新速度、极致的用户体验、稳定可靠的用户服务、高效的研发效率。

**Cloud Native 组成**

观察任何一个企业都可以从三个角度出发，这三个角度分别是技术、流程、文化，三个方面都做好才能成为伟大的企业。Cloud Native也一样，需要从架构、研发流程、团队文化三个角度来实现，三者需要相互配合，缺一不可。Cloud Native的组成，如图

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/002-cb4cbb88.png)

从架构的角度来讲，Cloud Native是以云和微服务架构为基础构建系统的，这里的云并不一定是公有云，也可以是私有云、混合云，云包含了敏捷基础设施及公共基础服务。除此之外，还需要考虑架构的质量属性。下图为Cloud Native架构的组成

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/003-ccc97bb9.png)

**Cloud Native成熟度模型**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/004-f1d0030d.jpg)

**Cloud Native 原则**

为失败设计原则

-   从架构的角度讲，为失败设计同样重要，因为失败是不可避免的，我们希望失败的结果是我们预料到的，是经过设计的。

-   因为失败是不可避免的，所以设计目标是预测并解决这些故障。

不变性原则

-     实现不变性原则的前提是，基础设施中的每个服务、组件都可以自动安装、部署，不需要人工干预。每个服务或组件在安装、部署完成后将不会发生更改，如果要更改，则丢弃老的服务或组件并部署一个新的服务或组件。替换的速度远远快于修复的速度。

标准化原则

-   如果我们都采用相同的微服务框架，那么服务之间的调用将变得非常容易。而且，团队间发生人员流动，也不再会因为换了一种框架而需要漫长的熟悉时间。当所有的日志打印都遵循某种标准的时候，对于排除故障，日志分析将非常重要。

-   独立自主和标准化是一对互斥的原则，独立代表的是灵活、创新，而标准则代表效率、稳定，两者需要权衡。所谓独立自主是在一定的标准下实现的

速度优先原则

-   效率更像一种“节流”方法，而速度是接近于“开源”的一种手段。当速度和效率发生冲突时，速度优先。

简化设计原则

-   越是基础的服务，越需要稳定，越需要简化设计、简化运维。简化设计也是Amazon和Netflix的软件设计原则。

自动化驱动原则

-   任何重复性的工作都应该自动化，只有真正拥抱自动化的时候，才能做到持续发布，才能做到更好的用户体验。

演进式设计原则

-   架构是持续演进的，并非一蹴而就的。单凭设计阶段很难达到理想的目标，需要不断锤炼。初级阶段应该采用尽可能简单的架构，因为初级阶段对需求、规模等都不是十分确定，可以采用快速迭代的方式进行架构演进。很多互联网公司都强调架构演

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-29-chi-xu-yan-jin-de-cloud-native-du-shu-bi-ji-01/005-1e73da81.jpg)

**关注公众号 获取更多精彩内容**
