---
title: "Make Jar, Not War."
slug: 2022-07-05-make-jar-not-war
description: "大约在 4 年前，关于 java 应用最终打成 jar 包还是 war 包的选择令我比较疑惑。那时候更多的应"
date: 2022-07-05T09:51:29.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-05-make-jar-not-war/cover.jpg
original_url: https://mp.weixin.qq.com/s/towXN8888oI5jEAJF49XzQ
categories:
  - 云原生
tags:
  - Java
  - Spring
  - Kubernetes
  - Docker
  - Git
  - 微服务
  - DevOps
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-05-make-jar-not-war/001-dd69b2c2.jpg)

大约在 4 年前，关于 java 应用最终打成 `jar` 包还是 `war` 包的选择令我比较疑惑。

那时候更多的应用是打成 `war` 包的，即使我们知道可以打成 `jar` 包，但之前都是打成 `war` 包，并且好像打成 `jar` 包并没有什么特别明显的好处。

但当时令我困惑的是越来越多的实践正在不怎么说明理由的情况下转而打 `jar` 包，于是我开始思考......

## war 包的理由

在某大型 OTA 企业内部，应用仍然打成 `war` 包, PaaS 平台会自动安装并配置好 tomcat，我知道这对于 **web server 的统一配置和运维来说是有好处的**。基于 `war` 背后的一系列 CI/CD 、DevOps 流程都一定有相应的适配，且就算 `jar` 包有我不知道的某些优势也不可能一夜之间在大型企业内部使用，需要平台和系统做出调整。

SpringBoot 在当时并未像现在这样流行，这并不意味着大家不用它，我的意思是相对新的项目来说，企业内部会有非常多 “老系统” 需要维护，我们不能指望一下子把这些老系统都用新的技术栈替换掉，就像你知道现在 `web application` 一般是前后端分离开发，但如果接手一个使用 `jsp` 的老家伙，你还得维护不是？

## jar 的时代

时代不同了，说得好像过了几十年的样子，但其实也就几年光阴而已。不过仅仅是这几年的光阴却足以改变一些事情的面貌。

如今，云原生、微服务大行其道，大家好像已经非常适应这种开发模式，没有人纠结要不要用 SpringBoot，只会讨论使用的版本高还是低。更不用说打包的事情，很自然的会使用 `jar`,虽然这种看起来的 “最佳实践”，在长期开发的过程中会形成 “肌肉记忆”，但我们还是要讨论一下为什么。

### 方便

可运行 Jar 是打包自包含可运行应用程序的便捷方法。这样，我们可以最大限度地减少依赖关系。可以通过 Spring boot Maven 和 Gradle plugin 来管理依赖。

### 云原生友好

在自备容器的情况下（docker,k8s), `jar` 包可以直接作为一个 `single application` 来管理。

在过去我们使用 `war` 是为了让多应用共享 web server，现在是容器的天下，在容器内，一般情况只跑一个应用进程。由于只有一个进程，我们就可以轻松地管理它，比如重启（不会影响其他的应用，因为没有其他应用）。

### 版本控制

利用 `git` 等版本控制软件，可以控制程序运行所需要的一切（比如配置文件）

### 易于扩展

例如，将其复制到另一台服务器，然后“ just run it!” 无需安装和/或配置容器

## 参考

-   https://medium.com/@satyajit.nalavade/make-jar-not-war-josh-long-d6ce5fbb8a23
