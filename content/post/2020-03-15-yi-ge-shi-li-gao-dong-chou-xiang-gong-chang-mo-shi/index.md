---
title: "一个实例搞懂抽象工厂模式"
slug: 2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi
date: 2020-03-15T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/hUOOulONykiH8ixl30earg
categories:
  - 架构与方法
tags:
  - Java
  - 设计模式
---
关于工厂模式三兄弟（简单工厂、工厂方法、抽象工厂），前两个兄弟比较容易懂，基本一看就明白，第三位兄弟初看起来确实有些抽象，网上看到一个例子讲的很好，分享给大家，保证一看就明白。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/001-7131a9a3.png)

文末给出系列文章出处。

Sunny软件公司欲开发一套界面皮肤库，可以对Java桌面软件进行界面美化。为了保护版权，该皮肤库源代码不打算公开，而只向用户提供已打包为jar文件的class字节码文件。用户在使用时可以通过菜单来选择皮肤，不同的皮肤将提供视觉效果不同的按钮、文本框、组合框等界面元素，其结构示意图如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/002-f71d2b7c.jpg)

图1 界面皮肤库结构示意图

该皮肤库需要具备良好的灵活性和可扩展性，用户可以自由选择不同的皮肤，开发人员可以在不修改既有代码的基础上增加新的皮肤。

Sunny软件公司的开发人员针对上述要求，决定使用工厂方法模式进行系统的设计，为了保证系统的灵活性和可扩展性，提供一系列具体工厂来创建按钮、文本框、组合框等界面元素，客户端针对抽象工厂编程，初始结构如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/003-a0a790d3.jpg)

图2 基于**工厂方法模式**的界面皮肤库初始结构图

在图2中，提供了大量工厂来创建具体的界面组件，可以通过配置文件更换具体界面组件从而改变界面风格。但是，此设计方案存在如下问题：

(1) 当需要增加新的皮肤时，虽然不要修改现有代码，但是需要增加大量类，针对每一个新增具体组件都需要增加一个具体工厂，类的个数成对增加，这无疑会导致系统越来越庞大，增加系统的维护成本和运行开销；

(2) 由于同一种风格的具体界面组件通常要一起显示，因此需要为每个组件都选择一个具体工厂，用户在使用时必须逐个进行设置，如果某个具体工厂选择失误将会导致界面显示混乱，虽然我们可以适当增加一些约束语句，但客户端代码和配置文件都较为复杂。

如何减少系统中类的个数并保证客户端每次始终只使用某一种风格的具体界面组件？这是Sunny公司开发人员所面临的两个问题，显然，工厂方法模式无法解决这两个问题，别着急，本文所介绍的抽象工厂模式可以让这些问题迎刃而解。

Sunny公司开发人员使用**抽象工厂模式**来重构界面皮肤库的设计，其基本结构如图所示：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/004-9375ae80.jpg)

如果需要更换皮肤，只需修改配置文件即可，在实际环境中，我们可以提供可视化界面，例如菜单或者窗口来修改配置文件，用户无须直接修改配置文件。如果需要增加新的皮肤，只需增加一族新的具体组件并对应提供一个新的具体工厂，修改配置文件即可使用新的皮肤，原有代码无须修改，符合“开闭原则”。

扩展

> 在真实项目开发中，我们通常会为配置文件提供一个可视化的编辑界面，类似Struts框架中的struts.xml编辑器，大家可以自行开发一个简单的图形化工具来修改配置文件，实现真正的纯界面操作。

本文并没有展开讲抽象工厂模式的方方面面，只是用一个例子，让大家对这个设计模式有个直观的感受，让它“落地”到实例中，建议大家看看下面的系列文章（认真看用不了多久![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/005-7e4a6f2e.png)），我也是从这里摘取的例子。

# 以下为文章参考出处: 《工厂三兄弟之抽象工厂模式》

-   https://github.com/quanke/design-pattern-java/blob/master/%E5%B7%A5%E5%8E%82%E4%B8%89%E5%85%84%E5%BC%9F%E4%B9%8B%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%80%EF%BC%89.md

-   https://github.com/quanke/design-pattern-java/blob/master/%E5%B7%A5%E5%8E%82%E4%B8%89%E5%85%84%E5%BC%9F%E4%B9%8B%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%BA%8C%EF%BC%89.md

-   https://github.com/quanke/design-pattern-java/blob/master/%E5%B7%A5%E5%8E%82%E4%B8%89%E5%85%84%E5%BC%9F%E4%B9%8B%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%B8%89%EF%BC%89.md

-   https://github.com/quanke/design-pattern-java/blob/master/%E5%B7%A5%E5%8E%82%E4%B8%89%E5%85%84%E5%BC%9F%E4%B9%8B%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F%EF%BC%88%E5%9B%9B%EF%BC%89.md

-   https://github.com/quanke/design-pattern-java/blob/master/%E5%B7%A5%E5%8E%82%E4%B8%89%E5%85%84%E5%BC%9F%E4%B9%8B%E6%8A%BD%E8%B1%A1%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F%EF%BC%88%E4%BA%94%EF%BC%89.md

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-15-yi-ge-shi-li-gao-dong-chou-xiang-gong-chang-mo-shi/006-57ddc455.jpg)

关注公众号 获取更多精彩内容
