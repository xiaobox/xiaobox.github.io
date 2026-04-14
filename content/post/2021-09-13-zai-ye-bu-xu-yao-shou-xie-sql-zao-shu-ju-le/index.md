---
title: "再也不需要手写 SQL 造数据了"
slug: 2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le
description: "背景在我们的日常开发中，一般建好一个数据库表后，需要再插入一些测试数据用来测试。一般情况下是手写 inser"
date: 2021-09-13T09:38:28.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/cover.jpg
original_url: https://mp.weixin.qq.com/s/ggAR0lLKRNucaphpLeoS8g
categories:
  - 后端
tags:
  - Java
  - macOS
  - Agent
  - DevOps
---
## 背景

在我们的日常开发中，一般建好一个数据库表后，需要再插入一些测试数据用来测试。

一般情况下是手写 insert SQL 语句，或者用个单元测试用例跑个程序，总之是比较麻烦。

其实我们的需求很简单，就是能生成测试数据就行了，当然最好能规范点儿，省得生成好了还得再改。

之前使用过的很多数据库客户端都有生成 SQL，DDL，DML 但不能帮我批量生成测试数据。

直到发现了 DBeaver，它的企业版有这个功能！

## DBeaver

DBeaver 是一个功能非常完善的数据库客户端，它有

-   开源免费版本：https://github.com/dbeaver/dbeaver，
-   企业版：https://dbeaver.com/

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/001-4e9705f0.jpg)

### 安装

由于企业版是收费的，所以要想办法 “安装” 它，可以参考：https://juejin.cn/post/6953133069465780232

“安装” 的重点有下面几个

-   安装 jdk 11
-   编译得到 jre

```bash
cd bin/
./jlink --module-path jmods --add-modules java.desktop --output jre

```

-   修改配置文件（下面是我本地 mac 电脑的）

```
-startup
../Eclipse/plugins/org.eclipse.equinox.launcher_1.6.100.v20201223-0822.jar
--launcher.library
../Eclipse/plugins/org.eclipse.equinox.launcher.cocoa.macosx.x86_64_1.2.100.v20210209-1541
-vm
/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home/bin

-vmargs
-XX:+IgnoreUnrecognizedVMOptions
--add-modules=ALL-SYSTEM
-Dosgi.requiredJavaVersion=11
-Xms128m
-Xmx2048m
-XstartOnFirstThread
-javaagent:/Users/leo/soft/dbeaver-agent/dbeaver-agent.jar

```

接下来就可以打开软件了

## 生成 Mock 数据库

建好表后，找到表右击打开如下

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/002-a2a5aeb3.jpg)

点击 “Generate Mock Data”, 可以设置你需要的数据条数

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/003-0fb45576.jpg)

甚至可以修改每一个字段的 Mock 的规则

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/004-23973710.jpg)

一路确定后，数据就生成了，非常规范，非常快

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-13-zai-ye-bu-xu-yao-shou-xie-sql-zao-shu-ju-le/005-89c2d069.jpg)

## 参考

-   https://juejin.cn/post/6953133069465780232
