---
title: "上了 istio 的贼船之 API Gateway"
slug: 2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway
date: 2021-06-21T05:02:18.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/cover.jpg
original_url: https://mp.weixin.qq.com/s/VSTvUHfGOgTGuIe8q5yj4Q
categories:
  - 云原生
tags:
  - JavaScript
  - Spring
  - Kubernetes
  - Istio
  - Nginx
  - 微服务
  - 架构
  - 网络
---
# 上了 istio 的贼船之 API Gateway

## 现状

下图是我们系统的架构现状，大致介绍一下：

-   基础设施在华为云上
-   基本上是基于 `istio on k8s` 架构。
-   `istio` 版本为 1.3，所以组件较多（`galley、pilot、citadel、telemetry`......）
-   微服务后端用 `spring boot` 单体，前端有 `nodejs、vue`等
-   应用的链路监控主要基于 `skywalking`, `istio` 的通讯层面利用 `kiali`可视化调用链
-   其他比较传统

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/001-abd5152c.jpg)

历史架构

主要介绍下作为服务通讯基础设施的 `istio` 在这里的作用

1.  服务间通讯，依赖 `envoy sidecar`
2.  注册中心，依赖 `istio` 控制面
3.  服务治理（熔断、超时、重试）*这部分还没有完完全全切干净，还有些 `spring boot` 应用依赖 `hystrix`，后面会全部改成利用 `istio`*。
4.  流量管理（`ingress gateway`、`egress gateway`、负载均衡）
5.  测试（错误注入）

通过将传统微服务架构的这些控制面功能解耦到 istio,可以让微服务应用本身专注于业务开发，是一个比较简的单体 springboot 应用。再结合 k8s 的高扩展性，研发整体的迭代速度和运维效率还是比较高的，缺点是无论是 k8s 还是 istio ，学习成本偏高，需要团队至少 2 人具有专业知识，对于招聘成本、系统升级都有风险。

## 上了贼船

坦白讲，如果系统最初的设计是我来做，是不会用如此“激进”的方案的，会转而用 `spring cloud` 为基础的架构，当然，`k8s` 是非常可能会使用的。但可惜我是中间接手，也想过换架构，但迫于公司业务和迭代的压力，再加上人手有限，再换架构的风险会非常高，所以既然上了 `istio` 的贼船，就只能走下去了，等什么时候时机成熟再并行其他架构，或切换回合适的架构。这里我要强调的是，做架构选择或者选型不是为了技术而技术，一定是要非常适合当时公司的发展现状、业务场景、团队能力、招聘成本等等，综合多种条件而得出的结论。 巧合的是 istio 的 logo 也是一个帆船的样子，果真是上了贼船 ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/002-5ae55d6c.png)

## API Gateway

终于说到本文的重点 `API Gateway` 了，对于这个话题，之前写过一篇文章，读者可以先脱离现在的架构从功能层面来了解下 `API Gateway`。

                     [![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/003-65589640.png)API 网关选型及包含 BFF 的架构设计](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484717&idx=1&sn=8162d7957b29504162490780e8d3763d&chksm=eb6dbaabdc1a33bd14c244069e44e3b84dfea8bae546c09facfa42bb5dbf90c1c70421efa6dc&scene=21#wechat_redirect)

回到我们现在的架构，你会发现，虽然我们有前置的 `openResty`,但应用层这边并没有一个担当 `API Gateway` 角色的服务。而无论是 `openResty` 或者是 `nginx` 对于云原生 `API Gateway` 的需求是不能完全满足的。

当然了解 `istio` 的读者可能会问：

-   `istio ingress gateway` 不也具有网关的功能吗 ？
-   为什么没有用 `nginx ingress controller` ？

首先，我承认基于 `k8s ingress` 实现的各种 `ingress controller` 功能越来越完善，如果我们没有用 `istio` 可能会采用这种方案，但我们使用了，那么再结合 `k8s ingress` 就会有如如何为服务网格选择入口网关[1]中说的如下问题：

-   `K8s Ingress` 是独立在 `Istio` 体系之外的，需要单独采用 `Ingress rule` 进行配置，导致系统入口和内部存在两套互相独立的路由规则配置，运维和管理较为复杂。
-   `K8s Ingress rule` 的功能较弱，不能在入口处实现和网格内部类似的路由规则，也不具备网格 `sidecar` 的其它能力，导致难以从整体上为应用系统实现灰度发布、分布式跟踪等服务管控功能。

其次，没错 `istio ingress gateway` 除了基础的通讯功能之外，还有一些其他的应用层功能。但我们综合来比较下 `k8s ingress`、`istio ingress gateway` 和我们理想中的 `API Gateway`，就会发现它还不够完善,主要是对于 `API` 管理的这部分功能欠缺。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/004-920af72e.jpg)

## 未来

前文已经对各种 `API Gateway`的实现方案进行了讨论，结论是在目前难以找到一个同时具备`API Gateway`和`Isito Ingress`能力的网关。那么再回顾一下我们的需求：

-   我们使用 istio
-   我们需要 API Gateway

所以，经过思考，我们未来的方案设计如下图：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-21-shang-le-istio-de-zei-chuan-zhi-api-gateway/005-af72412a.jpg)

-   仍然利用 `istio ingress gateway`作为入口
-   将 `istio ingress gateway`接到 `LB`
-   将`API Gateway`纳入到`istio cluster`管理的范畴当中，即拥有`sidecar proxy`，可被`istio`控制面控制。`API Gateway`的选型很有可能使用云原生应用网关，如 `API SIX`
-   应用层微服务不会利用如 spring cloud gateway 编码一个服务网关

总结：使用`API Gateway`和`Sidecar Proxy`一起为服务网格提供外部流量入口。

### 还有没有问题？

有的，根据 Service Mesh 和 API Gateway关系深度探讨[2]上述方案的优势在于`API Gateway`和`Sidecar`独立部署，职责明确，架构清晰。但是，和`Service Mesh`使用`sidecar`被质疑多一跳会造成性能开销影响效率一样，`API Gateway`使用`Sidecar`也被同样的质疑：多了一跳……

对了多了这一跳，从整个架构每一段的网络耗时及其作用来看，这一跳多出的时间，几乎可以忽略不计。

### 性能如何？

作为 `sidecar` 的 `envoy`的性能应该是毋庸置疑了。至于`istio ingress gateway`虽然官方给出的数据也不错，但还是要在实践中观察。而作为 `Cloud Native API Gateway`  比如 `API SIX` 我对它有足够的信心，至少在我司现阶段业务体量以及未来百倍增长规模下都不会担心性能问题。

### 参考资料

[1]

如何为服务网格选择入口网关？: *https://zhaohuabing.com/post/2019-03-29-how-to-choose-ingress-for-service-mesh/#k8s-ingress*

[2]

Service Mesh和API Gateway关系深度探讨: *https://www.servicemesher.com/blog/service-mesh-and-api-gateway/*
