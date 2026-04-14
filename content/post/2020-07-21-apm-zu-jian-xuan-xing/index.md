---
title: "APM 组件选型"
slug: 2020-07-21-apm-zu-jian-xuan-xing
description: "监控之 what&why常用监控手段按监控层次分：业务监控、应用监控和基础监控等；按监控日志来源分：基于日志"
date: 2020-07-21T02:27:54.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/cover.jpg
original_url: https://mp.weixin.qq.com/s/XYpFZ2uCGL9Grd3Cb1n2Uw
categories:
  - 云原生
tags:
  - JVM
  - 微服务
  - 架构
---
## 监控之 what&why

常用监控手段

-   按监控层次分：业务监控、应用监控和基础监控等；

-   按监控日志来源分：基于日志文件监控、基于数据库监控和基于网络监控等；

-   按监控领域分：前端监控、后端监控、全链路监控、业务间监控等；

-   按监控目标分：系统故障监控、业务指标监控、应用性能监控、用户行为监控、安全合规监控等。

**监控首先要解决的是目标设定，到底要解决什么问题，关注什么指标。**

**我们的定位是APM 即应用性能监控。**

**解决****微服务架构下：**

-   **服务间依赖关系梳理、查询**

-   **全局依赖关系拓扑**

-   **调用链跟踪、****拓扑、****查询**

-   服务响应时间监测（最长、最短、平均）

-   服务JVM性能监测和告警

-   Dashboard（图表展示）

进而解决

-   服务问题快速诊断、定位

-   对于自己的调用情况，方便作容量规划，同时对于突发的请求也能进行异常告警和应急准备

打造监控闭环：监控不是目的，目的是告警，告警不是目的，目的是解决问题。

## APM

APM被作为一个细分领域的IT解决方案行业被单独提出来还是在近几年的事情，大概在2010年左右。 厂商有：appdynamics、听云、OneAPM等

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/001-2930e3eb.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/002-ae210a12.png)

**APM五大维度**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/003-b8f29cc3.png)

-   **终端用户体验**
    衡量从用户请求到数据再返回的流量传输是捕获最终用户体验（EUE）的一部分。此测量的结果称为实时应用程序监视（又称自顶向下监视），它具有被动和主动两个组件。**被动监控** 通常是使用网络端口镜像实现的无代理设备。**主动监控** 由预定义的合成探针和Web机器人组成，用于报告系统可用性和业务事务（即业务方自行埋点）。

-   **应用架构映射**
    应用程序发现和依赖关系映射（ADDM）解决方案用于自动执行将事务和应用程序映射到底层基础架构组件的过程。

-   **应用事务的分析**
    关注用户定义的事务或对业务社区有一定意义的URL页面定义。

-   **深度应用诊断**
    深度应用诊断（DDCM）需要安装代理，通常针对中间件，侧重于Web，应用程序和消息服务器。

-   **数据分析**
    获得一组通用的度量标准以收集和报告每个应用程序非常重要，然后标准化有关数据并呈现应用程序性能数据的常见视图。

APM被形象的称为应用程序的私人医生，越来越收到企业的青睐，比起通过日志方式记录关键数据显然要更加实用，APM主要包含如下核心功能：

-   **应用系统存活检测**

-   **应用程序性能指标检测(CPU利用率、内存利用率等)**

-   **应用程序关键事件检测**

-   **检测数据持久化存储并能够多维度查询**

-   **服务调用跟踪**

-   **监控告警**

## 一般做法

下面三个维度是有重合部分的，比如JVM监控等。

-   Logging:ELK

-   Metrics:Prometheus

-   tracing:本文选型

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/004-5b600b98.png)

先看一下演进的历史：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/005-9f88728e.png)

由于pinpoint和skywalking从工作原理、性能、功能等方面很像，由于我们不需要追求那么好的UI，以及考虑到社区和apache的背书在这两者中我们选择了skywalking。而Uber的jaeger较新相对来说社区和文档的支持没有前者友好，就不在我们的选型范围了。

我们的选型主要针对 zipkin cat 和skywalking进行

<table><tbody><tr><td width="123" valign="top"><br></td><td width="89" valign="top" style="word-break: break-all;">CAT<br></td><td width="131" valign="top" style="word-break: break-all;">Zipkin<br></td><td width="150" valign="top" style="word-break: break-all;">Apache Skywalking</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">调用链可视化<br></td><td width="89" valign="top" style="word-break: break-all;">有<br></td><td width="131" valign="top" style="word-break: break-all;">有</td><td width="150" valign="top" style="word-break: break-all;">有</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">聚合报表<br></td><td width="89" valign="top" style="word-break: break-all;">非常丰富<br></td><td width="131" valign="top" style="word-break: break-all;">少<br></td><td width="150" valign="top" style="word-break: break-all;">较丰富<br></td></tr><tr><td width="123" valign="top" style="word-break: break-all;">服务依赖图</td><td width="89" valign="top" style="word-break: break-all;">简单</td><td width="131" valign="top" style="word-break: break-all;">简单</td><td width="150" valign="top" style="word-break: break-all;">好</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">埋点方式<br></td><td width="89" valign="top" style="word-break: break-all;">侵入</td><td width="131" valign="top" style="word-break: break-all;">侵入</td><td width="150" valign="top" style="word-break: break-all;">非侵入，运行期字节码增强</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">VM指标监控<br></td><td width="89" valign="top" style="word-break: break-all;">好<br></td><td width="131" valign="top" style="word-break: break-all;">无<br></td><td width="150" valign="top" style="word-break: break-all;">有<br></td></tr><tr><td width="123" valign="top" style="word-break: break-all;">告警支持<br></td><td width="89" valign="top" style="word-break: break-all;">有<br></td><td width="131" valign="top" style="word-break: break-all;">无<br></td><td width="150" valign="top" style="word-break: break-all;">有</td></tr><tr><td width="123" valign="top" style="word-break: break-all;">多语言支持<br></td><td width="89" valign="top" style="word-break: break-all;">java/.Net/C/C++/NodeJS/Python/Go等<br></td><td width="131" valign="top" style="word-break: break-all;">丰富<br></td><td width="150" valign="top" style="word-break: break-all;">java/.Net/NodeJS/PHP/Go<br></td></tr><tr><td width="123" valign="top" style="word-break: break-all;">存储机制&nbsp;<br></td><td width="89" valign="top" style="word-break: break-all;">Mysql,本地文件，HDFS（调用链）</td><td width="131" valign="top" style="word-break: break-all;">可选in memory,mysql,ES(生产)，Cassandra(生产)</td><td width="150" valign="top" style="word-break: break-all;">H2，ES（生产），mysql,TIDB等<br></td></tr><tr><td width="123" valign="top" style="word-break: break-all;">社区支持<br></td><td width="89" valign="top" style="word-break: break-all;">主要在国内，点评、美团<br></td><td width="131" valign="top" style="word-break: break-all;">文档丰富，国外主流<br></td><td width="150" valign="top" style="word-break: break-all;">Apache支持，国内社区好<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">国内案例<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;"><p>点评、携程、陆金所、拍拍贷等</p></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="21">京东、阿里定制不开源<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="150"><p>华为、小米、当当、微众银行</p></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">APM<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">Yes<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="21">No<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="150">Yes<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">祖先源头<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">eBay CAL<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="21">Google Dapper<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;" width="150">Google&nbsp;Dapper<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">同类产品<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">暂无<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">Uber&nbsp;jaeger,Spring Cloud Sleuth<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">Naver Pinpoint<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">GitHub starts(2020.7)<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">13.7k<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">13.2k<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">14k<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">亮点<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">企业生产级，报表丰富</td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">社区生态好<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">非侵入，Apache背书<br></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">不足<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">用户体验一般，社区一般<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">APM报表能力弱<br></td><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">时间不长，文档一般<br></td></tr></tbody></table>

基于以上，我的建议是：

-   zipkin欠缺APM报表能力，不建议

-   企业生产级，推荐CAT

-   关注和试点 Skywalking

-   用好调用链监控，难点在于后期的企业定制化和自研能力

参考：

-   https://www.infoq.cn/article/KYxDaw2qiZ7rm\*7Ej3ps

-   https://skywalking.apache.org/zh/blog/2019-03-29-introduction-of-skywalking-and-simple-practice.html

-   https://developer.aliyun.com/article/272142

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-apm-zu-jian-xuan-xing/006-57ddc455.jpg)

关注公众号 获取更多精彩内容
