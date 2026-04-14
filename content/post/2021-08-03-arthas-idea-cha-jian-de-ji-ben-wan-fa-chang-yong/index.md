---
title: "arthas idea 插件的基本玩法（常用）"
slug: 2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong
description: "Arthas 官方的工具还不够足够的简单，需要记住一些命令，特别是一些扩展性特别强的高级语法，比如 ognl 获取 spring context 为所欲为，watch、trace 不够简单，需要构造一些命令工具的信息，插件是帮助你生成命令的"
date: 2021-08-03T05:47:40.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/cover.jpg
original_url: https://mp.weixin.qq.com/s/_n0jw7PEQTe3eRIf7gMyUg
categories:
  - 后端
tags:
  - JVM
  - Spring
---
## 背景

> “
> 
> `Arthas` 官方的工具还不够足够的简单，需要记住一些命令，特别是一些扩展性特别强的高级语法，比如 `ognl` 获取 `spring context` 为所欲为，`watch`、`trace` 不够简单，需要构造一些命令工具的信息，因此只需要一个能够简单处理字符串信息的插件即可使用。当在处理线上问题的时候需要最快速、最便捷的命令，因此插件还是有存在的意义和价值的。
> 
> ”

`arthas idea plugin` 更简单的使用 `arthas` 的 IDEA 插件,方便的构建各种 `arthas` 命令,复制到剪切板 然后到服务器上启动 `arthas` 执行命令

## 插件安装

可以直接去 idea 插件仓库下载安装 `https://plugins.jetbrains.com/plugin/13581-arthas-idea/`

## 操作说明

将光标放置在具体的类、字段、方法上面 右键选择需要执行的命令，部分会有窗口弹出、根据界面操作获取命令；部分直接获取命令复制到了剪切板 ，自己启动 `arthas` 后粘贴命令即可执行。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/001-57656bbf.jpg)

## 具体命令

由于手拼 `arthas` 的命令很长，很麻烦，所以插件作用的一方面就是帮我们生成这些命令，直接在 `arthas` 执行就好了。

以下命令都是借助 arthas idea 插件直接生成的，不用自己拼

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/002-a5bb3cf8.jpg)![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/003-a8b0550c.jpg)

1 查看具体类中方法的入参、出参、异常

比如 要查看以下方法的执行情况：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/004-da05e93e.jpg)

```
watch com.demo.meal.pc.MealManagerController listMealCategoryByOptions '{params,returnObj,throwExp}'  -n 5  -x 3 

```

也可根据条件表达式来观察，比如

```
## 判断当第一个请求参数为 1 的时候
watch com.demo.meal.pc.MealManagerController listMealCategoryByOptions '{params,returnObj,throwExp}'  "params[0]==1" -n 5 -x 3

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/005-d4a05da4.jpg)

2 trace 跟踪请求链路

```
trace com.demo.meal.pc.MealManagerController listMealCategoryByOptions  -n 5 --skipJDKMethod false 

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/006-3671d9ae.jpg)

3 查看调用栈

```
stack com.demo.meal.pc.MealManagerController listMealCategoryByOptions  -n 5 

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/007-4d6dd313.jpg)

4 监控方法执行情况

```
monitor com.demo.meal.pc.MealManagerController listMealCategoryByOptions  -n 10  --cycle 10 

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/008-4eff0b31.jpg)

5 反编译源码并显示行号

```
jad --source-only com.demo.meal.pc.MealManagerController listCategoryTrainByOptions 

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/009-fca80c5f.jpg)

6 查看 JVM 已加载的类信息

```
sc -d com.demo.meal.pc.MealManagerController

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/010-011a17f9.jpg)

7 查看已加载类的方法信息

```
sm -d com.demo.meal.pc.MealManagerController listCategoryTrainByOptions

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/011-87bdc0dc.jpg)

8 动态修改日志级别

先看一下当前日志信息

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/012-e738b1cd.jpg)

通过命令修改：

```
logger --name ROOT --level debug

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/013-062e2979.jpg)

9 dump 已加载类的 bytecode（.class文件) 到特定目录

```
dump com.demo.meal.pc.MealManagerController -d /Users/hh/logs/arthas/dump

```

10 生成火焰图

什么是火焰图？怎么看懂？参考：`https://www.ruanyifeng.com/blog/2017/09/flame-graph.html`

> “
> 
> y 轴表示调用栈，每一层都是一个函数。调用栈越深，火焰就越高，顶部就是正在执行的函数，下方都是它的父函数。x 轴表示抽样数，如果一个函数在 x 轴占据的宽度越宽，就表示它被抽到的次数多，即执行的时间长。注意，x 轴不代表时间，而是所有的调用栈合并后，按字母顺序排列的。火焰图就是看顶层的哪个函数占据的宽度最大。只要有"平顶"（plateaus），就表示该函数可能存在性能问题。颜色没有特殊含义，因为火焰图表示的是 CPU 的繁忙程度，所以一般选择暖色调。
> 
> ”

```
## 采集 alloc 火焰图 30秒后自动结束
profiler start --event alloc --interval 10000000 --threads --format svg -duration 30 --threads
## 采集 CPU 火焰图 30秒后自动结束
profiler start --event cpu --interval 10000000 --threads --format svg -duration 30 --threads

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-03-arthas-idea-cha-jian-de-ji-ben-wan-fa-chang-yong/014-3104ff52.jpg)

## 参考

-   https://www.yuque.com/arthas-idea-plugin/help/pe6i45
-   https://www.yuque.com/arthas-idea-plugin/help
-   https://www.ruanyifeng.com/blog/2017/09/flame-graph.html
