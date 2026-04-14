---
title: "istio 原理简介"
slug: 2021-11-19-istio-yuan-li-jian-jie
description: "前导由于 istio 自 1.5 版本以后架构上有了较大变化，控制面从多组件变成了单体的 istiod 组件"
date: 2021-11-19T07:46:22.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/UEwyKf0howTEJgPiIJsWzw
categories:
  - 云原生
tags:
  - Istio
  - 架构
---
## 前导

由于 istio 自 1.5 版本以后架构上有了较大变化，控制面从多组件变成了单体的 istiod 组件，所以下文会先介绍 1.5 之前的架构，再介绍 1.5 之后的，是一个由繁到简的过程。

## istio 1.5 之前架构

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/001-2f8acfd8.jpg)

### Istio 的架构分为控制平面和数据平面

-   数据平面：由一组智能代理（Envoy）以 sidecar 模式部署，协调和控制所有服务之间的网络通信。
-   控制平面：负责管理和配置代理路由流量，以及在运行时执行的政策。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/002-c780b396.jpg)

可以看到控制面（control plane ）组件众多，下图是 1.1 版本所包含的组件：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/003-cbe3c492.jpg)

## istio 工作原理

我们先按照 1.5 版本之前的架构描述

### Sidecar  注入 (envoy)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/004-b660503b.jpg)

详细的注入过程可以参考：https://blog.yingchi.io/posts/2020/6/istio-sidecar-injection.html

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/005-8acc110b.jpg)

### 连接 （pilot）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/006-a038f2bd.jpg)

### 控制 && 观测 （mixer telemetry、mixer policy）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/007-7860d606.jpg)

### 保护（citadel）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/008-3d80397e.jpg)

### 配置

Galley 原来仅负责进行配置验证，1.1 后升级为整个控制面的配置管理中心，除了继续提供配置验证功能外，Galley 还负责配置的管理和分发，Galley 使用 网格配置协议 (Mesh Configuration Protocol) 和其他组件进行配置的交互。

提供 istio 中的配置管理服务，验证 Istio 的 CRD 资源的合法性

## istio 各组件功能及作用

-   istio-polit: 服务发现，向数据平面下发规则，包括 VirtualService、DestinationRule、Gateway、ServicEntry 等流量治理规则，也包括认证授权等安全规则。
-   istio-telemetry: 专门收集遥测数据的 mixer 服务组件。
-   Istio-policy: 另外一个 mixer 服务，可以对接如配额、授权、黑白名单等不同的控制后端，对服务间的访问进行控制。
-   Istio-citadel: 核心安全组件，提供了自动生成、分发、轮换与撤销秘钥和证书的功能。
-   Istio-galley: 配置管理的组件，验证配置信息的格式和内容的正确性，并将这些配置信息提供给管理面的 Pilot 和 Mixer 使用。
-   Istio-sidecar-injector: 负责自动注入的组件。
-   Istio-proxy: 数据面的轻量代理。
-   Istio-ingressgateway: 入口处的 gateway。

## istio 1.5 之后架构

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-11-19-istio-yuan-li-jian-jie/009-ed896fd9.jpg)

之前版本的 istio 对组件进行了很好的解耦，组件们各司其职，当然也带来了组件比较多的问题。可以看到新版本将众多组件包装在了一起叫  istiod

所以新版本 istio 核心组件就只剩下一个：istiod

## 参考

-   https://www.infoq.cn/article/dtfjv1lu8fifvfqxmseh
-   https://blog.yingchi.io/posts/2020/6/istio-sidecar-injection.html
-   https://istio.io/
