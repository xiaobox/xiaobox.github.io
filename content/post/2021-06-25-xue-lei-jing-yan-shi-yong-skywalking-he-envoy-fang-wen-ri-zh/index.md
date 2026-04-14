---
title: "血泪经验：使用SkyWalking 和 Envoy 访问日志服务对 istio 进行观察（一）"
slug: 2021-06-25-xue-lei-jing-yan-shi-yong-skywalking-he-envoy-fang-wen-ri-zh
date: 2021-06-25T11:37:02.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-06-25-xue-lei-jing-yan-shi-yong-skywalking-he-envoy-fang-wen-ri-zh/cover.jpg
original_url: https://mp.weixin.qq.com/s/StmA_i11AWYxaUmHOKzg4g
categories:
  - 云原生
tags:
  - Istio
---

![](001-51060090.jpg)

  

### 分享一个宝贵的经验

我们想利用 `skywalking` 收集 `istio` 的 `envoy` 日志，进而利用 `skywalking` 查看 `istio` 的 `trace`、`log`等。

但这里面有个坑，就是 `istio` 和 `skywalking` 的版本问题。我们 `istio` 使用的是1.3版本，`skywalking` 8.3 。

经过华为和 skywalking 核心开发者的确认，版本对应关系如下：

-   `istio` 1.3     不支持生产 `skywalking` 使用
-   `istio` 1.7以上  `skywalking` 链路拓扑可以商用
-   `istio` 1.8     `skywalking` 日志商用
-   `istio` 1.11    `trace` 商用

所以结论是得升级 `istio`，然后再去集成 `skywalking`。

后续随着 `istio` 的升级将继续结合 `skywalking` 进行操作，并输出具有更多细节的文章。

  

![](002-608d629a.gif)

关注公众号 获取更多精彩内容
