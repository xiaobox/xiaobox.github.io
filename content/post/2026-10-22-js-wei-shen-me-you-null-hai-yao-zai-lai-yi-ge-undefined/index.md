---
title: "JS 为什么有 null 还要再来一个 undefined"
slug: 2026-10-22-js-wei-shen-me-you-null-hai-yao-zai-lai-yi-ge-undefined
description: ""
date: 2026-10-22T04:00:00.000Z
image:
original_url:
categories:
  - 行业与思考
tags:
  - Java
  - Python
  - JavaScript
  - TypeScript
---

写 JavaScript 的人，应该都有过这么一个时刻。

排线上 bug，发现某个判断分支走错了。回头看代码，写的是 `if (user.role === undefined)`。后端那边返回的是 null。改完之后又开始第二轮，写成 `=== null`，结果另一个接口这次没传字段，又是 undefined。

最后干脆 `== null` 一刀切，两个都判进去，收工。

但很少有人停下来想一下，凭啥这两个东西是分开的。一门语言里有一个「没值」的标记不就够了。Python 只有一个 None，Ruby 只有一个 nil，Go 只有一个 nil。JS 偏要搞两个。

这事儿的源头要追溯至 1995 年。

那年 4 月 3 号，Brendan Eich 入职 Netscape。招他的人当时说得很清楚，让他在浏览器里做一种 Scheme。Eich 是搞 Scheme 出身的，这事对他来说拿手。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/brendaneich25607.web_.jpg)

他到岗大概一个月。5 月 23 号，Sun 发了 Java，Netscape（网景） 当天宣布要把 Java 集成进浏览器。情况一下子变了。

管理层临时给 Eich 改了 需求。新任务是写一种「配套 Java」的脚本语言，而且下了一道死命令，新语言必须 look like Java。

据 Eich 后来回忆，留给他的时间，是 10 个工作日。大概从 5 月 6 号到 5 月 15 号那一周加几天。要在 SGI Indy 工作站上手写一个 lexer，一个递归下降的 parser，一个字节码生成器，再加一个解释器。月底之前要给全公司工程师 demo 一次。（让我现在用 AI 也不一定能搞定啊。）

10 天能做出什么。能做出一个能跑的原型。够拼出几个变量、几个函数、几个对象，够 demo。够让大家看完点头说行，浏览器里能跑脚本了。

null 就是在这 10 天里被加进去的。

加的时候很自然。Java 有 null，新语言要 look like Java，那也加一个 null。语义照抄，表示「在该出现一个对象的位置，没有对象」。

接下来发生的事，影响了后面 30 年所有前端程序员。

Eich 在原型里给每个值都安排了一个 32 位的内部表示。最低 3 位是 tag，标记这是什么类型，object 的 tag 是 000。剩下的位存实际数据。null 这个值他用的是「全零」表示，最低 3 位顺带也是 000。

于是 typeof null 算出来等于 `'object'`。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/Gemini_Generated_Image_vql07avql07avql0.png)

不是因为他觉得 null 应该是 object，是因为 tag bit （这不是脏话）撞上了。Eich 自己 2020 年在那篇 JavaScript 历史论文里承认，这是个 leaky abstraction，原型里图省事的实现 bug。

但等他写完原型，已经晚了。

因为他还得处理另一种情况。函数参数没传值的时候返回什么。访问对象不存在的属性返回什么。变量声明了没赋值返回什么。

这些场景需要一个 marker，意思是「系统告诉你这里没东西」，跟「程序员故意置空」得分开。

null 已经被仿 Java 用掉了，专门表示后者。前者需要一个新词。

于是 undefined 进来了。

到这一刻，null 和 undefined 就分家了。一个是「我特意没给」，一个是「系统也没给你」。


这事儿按理说后来不是没机会修。出个不兼容的大版本，把 null 和 undefined 合一合，就完事了。

但 JS 的另一条铁律是「永远不破坏向后兼容」。一改 typeof null，全世界跑了 30 年的代码立刻有一批失效。一合并 null 和 undefined，所有判空逻辑要重写一遍。所以这两个东西就这么扛到了 2026 年，进了 React、Vue、Node、TypeScript，进了你的生产代码。

TypeScript 那个 strictNullChecks 开关，其实就是用类型系统在外面给 JS 这个洞打补丁。每个 `?.` 操作符也是。可选链 ES2020 才正式进标准，正是因为这两个非值的存在让访问 a.b.c.d 变成了一件随时可能炸的事。

10 天写的语言，30 年都没修干净。

如果这事倒回去再看一眼，会发现一个反讽。Eich 拿到那个需求的时候，原本要做的是 Scheme。Scheme 是一门设计极其干净的语言，只有一个 #f 就够了，连 null 都不需要。

是「look like Java」这道死命令把 null 塞了进来。是 10 天的 deadline 让 null 用了一个 tag bit 撞车的实现。也是因为 JS 自己的兼容性原则让这一切再没法回头。

所以呀，不要让程序员赶进度加班，对谁都不好。
