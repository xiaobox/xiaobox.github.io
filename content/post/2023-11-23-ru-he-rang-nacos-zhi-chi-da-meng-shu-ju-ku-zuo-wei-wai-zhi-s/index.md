---
title: "如何让 Nacos 支持达梦数据库作为外置数据源"
slug: 2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s
description: "Nacos 支持两种数据持久化方式，一种是利用内置的数据，一种是利用外置的数据源。内置数据库支持:Nacos"
date: 2023-11-23T05:08:51.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/cover.jpg
original_url: https://mp.weixin.qq.com/s/iSU4Rg8s2TVlttfjzEKCHQ
categories:
  - 云原生
tags:
  - MySQL
  - PostgreSQL
  - Nacos
  - 多线程
---
Nacos 支持两种数据持久化方式，一种是利用内置的数据，一种是利用外置的数据源。

1.  内置数据库支持:

-   Nacos 默认内置了一些数据存储解决方案，如内嵌的 `Derby` 数据库。
-   这种内置方式主要用于轻量级或测试环境。

3.  外置数据库支持:

-   对于生产环境，Nacos 支持外置数据库以提供更高的可靠性和伸缩性。
-   常见的外置数据库包括 MySQL 等，这些数据库通过标准的 JDBC 接口与 Nacos 集成。

然而 达梦数据库 Nacos 原生是不支持的，或者说不能通过简单配置使  Nacos + 达梦数据库这样的组合生效。

### 达梦数据库 是什么

达梦数据库（DMDB），是一款由中国国内团队自主研发的关系型数据库管理系统（RDBMS）。它旨在提供高性能、高可靠性和高安全性的数据库解决方案，特别是对于在政府、金融、电信等行业的应用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/001-e47e4976.png)

介绍一下达梦数据库的几个关键方面：

1.  自主研发：达梦数据库是由中国国内团队自主研发的，这意味着它在设计和开发过程中更加注重符合国内市场的需求和标准。它的出现也代表了中国在关键技术领域自主创新的重要成果。
2.  高性能：达梦数据库采用了先进的数据库技术，比如高效的存储引擎、智能的查询优化器等，以提供高速的数据处理和查询性能。这使得它适合处理大规模数据和高并发访问，满足企业级应用的需求。
3.  高可靠性：在设计上，达梦数据库强调数据的可靠性和持久性。它提供了严格的事务控制、灾难恢复和备份机制，确保在各种环境下数据的完整性和安全性。
4.  高安全性：达梦数据库特别注重数据安全。它提供了包括数据加密、访问控制、审计日志等多重安全机制，帮助用户防范数据泄露和非法访问。
5.  兼容性和易用性：为了更好地适应现有的企业环境，达梦数据库支持广泛的操作系统和平台，并且与主流的编程语言和开发工具具有良好的兼容性。此外，它还提供了易于使用的管理工具和丰富的文档支持。
6.  应用场景：达梦数据库广泛应用于政府、金融、电信、能源、教育等多个行业，特别是在那些对数据安全性和可靠性有高要求的领域。

### 为什么使用达梦数据库

在数据库的选型方面，通常我们会使用业内广泛使用的产品，如开源的 MySQL, 甚至收费的如 Oracle、SQL Server，直到 “信创” 的到来，打破了这些传统产品在数据库市场的垄断地位。

> “
> 
> “信创”这个词最早来源于“信创工委会”。该组织的全称是：信息技术应用创新工作委员会，是在 2016 年，由 24 家专业从事软硬件关键技术研究及应用的国内单位，共同发起成立的一个非营利性社会组织。
> 
> ”

后来，除了数据安全、网络安全，信创是把之前的一些软硬件等行业放到了一起，重新起了一个名字叫：信息技术应用创新产业，简称“信创”。

也因此，一般来说，信创包括基础硬件、基础软件、应用软件、信息安全四大板块。其中，基础硬件主要包括：芯片、服务器/PC、存储等；基础软件包括：数据库、操作系统、中间件等；应用软件包括：办公软件、ERP 和其它软件等；信息安全包括硬件安全、软件安全、安全服务等各类产品。

针对安全可控，我们国家提出的是“2+8”体系。“2”指党、政；“8”指关于国计民生的八大行业：金融、电力、电信、石油、交通、教育、医疗、航空航天。

发展信创，先在党政等封闭市场进行应用信创产品，打磨产品和生态；接着在产品好用和生态相对成熟之后，进入金融、电力、电信、石油、交通、教育、医疗、航空航天重点行业市场；最后才是将信创产品全面应用到消费市场。

而数据库就是我们常说的  “信创” 四件套（芯片、操作系统 、数据库、中间件）之一。达梦数据库就是这样一个符合 “国产化” 要求的自主研发的数据库。所以，由于国家信息安全的要求，我们的客户需要符合这些要求，也必然要进行软件的替换。

## 实现方案

首先看一下 Nacos 原生支持的外置数据库有哪些，是否支持达梦？

根据以下 Nacos 官方文档，无论是单机还是集群模式，貌似只支持 `MySQL` 作为外置数据源

-   https://nacos.io/zh-cn/docs/v2/guide/admin/deployment.html
-   https://nacos.io/zh-cn/docs/v2/guide/admin/cluster-mode-quick-start.html

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/002-d112b950.png)

只支持 MySQL 吗？不是说还支持其他像 Oracle 之类的数据库吗？

在调研的过程中，发现 github 上 Nacos 的源码有这样一个功能分支 `feature_multiple_datasource_support`

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/003-32e47164.png)

很明显，它就是用来支持多数据源的，通过源码我们可以看到它支持的多种数据源都有哪些：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/004-2ff5f297.png)

这个分支能够支持的外部数据源分别是：

-   oracle
-   mysql
-   postgresql

我分析了 Nacos 1.0 及 2.0 主要版本，发现 多数据源的这个功能并没有被合并到主要的开发及 `release` 分支上。也就是说 `Nacos` 现有的主要版本的 `release` 并没有多数据源的这个功能，外置数据源只兼容 MySQL。

根据前面的分析我们知道即使是  `feature_multiple_datasource_support` 分支也只支持三个数据源，如果想用非 MySQL 的数据源，比如用 Oracle 就需要自己修改和编译源代码。

```
mvn -Prelease-nacos -Dmaven.test.skip=true -Dcheckstyle.skip=true clean install -U

```

具体修改的部分也主要是配置文件 `application.properties`  没有其他地方了。

Nacos 是支持 Oracle 和  PostgreSQL 的，只不过需要手动修改配置和编译。虽然这种方法可行，但由于功能分支长时间未更新，最新版本的代码未合并过来，可能会造成一些安全和功能上的问题。更重要的是，通过上述的分析我们知道，Nacos 在原生的模式下，确实是不支持达梦数据库的。

### 方案一 修改源代码方式

根据前文我们知道，Nacos 原生是不支持达梦数据库的，所以就要想办法让它 “支持”，直觉上因为是开源软件，我们还是会从源码入手。

既然可以修改源代码，我们就不需要从 `feature_multiple_datasource_support` 分支开始了，可以在流行的 1.x 、2.x 或最新版本代码的基本上修改。

主要涉及到以下内容的修改：

-   com/alibaba/nacos/persistence/datasource/ExternalDataSourceProperties.java
-   console/src/main/resources/application.properties

代码具体的修改方式和内容可以是多样的，下面举几个例子，供参考：

-   https://developer.aliyun.com/article/976299
-   https://www.cnblogs.com/hi-gdl/p/nacos-02.html
-   https://cloud.tencent.com/developer/article/1912024
-   https://codeantenna.com/a/SJdgkqAbZt

核心思路是：由于达梦数据库良好的支持了 JDBC 驱动，所以我们只需要把 jdbcDriver 进行更换就可以了。然后同样手动进行编译，使用自己编译好的构建物进行部署。

这里涉及到的 Nacos 数据库初始化脚本可以参考：https://gitee.com/tangjingshan/nacos/blob/tjs-study-fetch-master/distribution/conf/dm-schema.sql

总结：

1.  源代码修改方案并不复杂，相对比较简单，但需要做好相关功能的完整测试。
2.  使用这种方式不但可以支持达梦数据库也可以在同样原理下支持其他国产数据库，如 `人大金仓`
3.  这种方式的问题是由于自行修改了源代码，在进行版本升级时会比较麻烦，每一次升级都要手动合并最新的代码再进行编译，未来甚至有可能出现 Nacos 官方源码进行大规模重构，自行编译的代码无法合并的情况。虽然也有解决办法，但是个麻烦点。
4.  数据迁移，这个后面我具体再详细说明

### 方案二 多数据源插件

Nacos 从 2.2.0 版本开始，可通过 SPI 机制注入多数据源实现 插件，它的原理是：

在原来的 Config 模块中，所有的 SQL 操作的执行是通过直接使用 JdbcTemplate 执行固定 SQL 语句的形式，使得 SQL 语句与业务逻辑高度耦合，并且只支持 Derby 与 MySQL 两种数据源，原有 Config 模块架构如下。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/005-83c9e702.png)

现在的多数据源插件通过 SPI 机制，将 SQL 操作按照数据表进行抽象出多个 Mapper 接口，Mapper 接口的实现类需要按照不同的数据源编写对应的 SQL 方言实现；现在插件默认提供 Derby 以及 MySQL 的 Mapper 实现，可直接使用；而其他的数据源则需要用户使用数据源插件进行加载，其改造后架构图如下。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/006-5b6348c2.png)

我们这里详细描述一下原理

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/007-66cf215c.png)

上图是 Nacos 的源码包中 plugin 模块，可以看到在 datasource 包下有不同的数据库实现类。这里其实就是抽象了 Nacos 操作的各个表的 Mapper 接口实现，你可以看到具体的 SQL 语句都在里面。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/008-696a8914.png)

既然有 MySQL、derby 的实现，也可以有我们自己的实现，具体来说就是达梦数据库的实现，我们只需要把这几个类重写就可以了，当然具体重写的内容中的 SQL 要根据达梦数据库的方言情况，修改或者不修改。

那么是否可以直接在源码的基础上添加 DM 的实现类进行开发呢？

理论上当然可以，但既然叫插件就有插件的形式。在 Nacos 源码的基础上开发耦合太重了，这不是插件化的表现形式。

我们要把与多数据源相关的自定义代码专门写一个包，然后在 Nacos 的代码中依赖，这样就解耦了，也与上文 Nacos 插件架构图中的描述相符。

插件化是如何实现的呢，或者说动态替换实现类是如何实现的？

这就要利用到 Java 的 SPI 知识了，由于是基础理论这里就不展开讲了。Nacos 在源码中已然利用 SPI 进行数据源 Mapper 的加载了，可以参考下图：

源码位置：com.alibaba.nacos.plugin.datasource.MapperManager#loadInitial![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/009-cfaeb6e1.png)

我们可以看到，源码是利用 ServiceLoader 加载插件包，而这些实现类也写在 `plugin/datasource/src/main/resources/META-INF/services/com.alibaba.nacos.plugin.datasource.mapper.Mapper`  这个文件里

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/010-d4851c25.png)

那么如果我们也利用 SPI 配置好 DM 的实现类，然后根据数据源参数找到相应的实现类是不是就可以了？

是的，所以源码中也正是这么做的

源码位置：com.alibaba.nacos.plugin.datasource.MapperManager#findMapper![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/011-0eb5b472.png)

这里我们讲一下具体的实现方法：

1 初始化达梦数据库，具体脚本可以参考 ：https://github.com/nacos-group/nacos-plugin/blob/develop/nacos-datasource-plugin-ext/nacos-dm-datasource-plugin-ext/src/main/resources/schema/nacos-dm.sql

2 编写插件包，利用 SPI 的原理，自定义实现各个表的 Mapper 实现类，这里其实 Nacos 的社区 nacos-group 中已经有现成的实现了，可以参考他们的项目和代码，实际上的代码都比较简单，甚至不需要做什么改动，因为基本的 SQL 达梦都是兼容的。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/012-b5df1816.png)

3 插件引入，有两种方式

第一种：

直接用 nacos-group 的现成的实现包，然后用 maven 进行依赖就可以了，例如：

```html
   <dependency>
       <groupId>com.alibaba.nacos</groupId>
       <artifactId>nacos-dm-datasource-plugin-ext</artifactId>
       <version>1.0.0-SNAPSHOT</version>
   </dependency>

```

第二种：

将插件源码打包为 jar 包，将该文件的路径配置到 `startup.sh` 文件中，使用 Nacos 的 `loader.path`机制指定该插件的路径，可修改 `startup.sh` 中的 `loader.path` 参数的位置进行指定。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/013-92ff4969.png)

启动脚本会指定插件包位置为：`-Dloader.path=${BASE_DIR}/plugins` loader.path 机制为打包插件 spring-boot-maven-plugin 提供的，该机制下实际启动类会变成`org.springframework.boot.loader.PropertiesLauncher#main`，且类会由`org.springframework.boot.loader.LaunchedURLClassLoader`这个类加载器加载

4 修改数据库配置文件，在 application.properties 文件中声明 dameng 的配置信息：

```
spring.datasource.platform=dm
  db.url.0=jdbc:dm://127.0.0.1:5236/DMSERVER?schema=NACOS&compatibleMode=mysql&ignoreCase=true&ENCODING=utf-8
  db.user.0=SYSDBA
  db.password.0=SYSDBA
  db.pool.config.driverClassName=dm.jdbc.driver.DmDriver 

```

5  如果用 maven 依赖的方式引入了插件包，就需要源码重新编译，如果使用 loader.path 指定路径的方式就可以重启进行测试了

### 数据迁移

无论使用哪种解决方案很大可能性都需要进行数据迁移，即将旧的非 达梦数据库的数据迁移到达梦数据库。

我们要把 `Nacos` 的数据或者 `SQL` 语句迁移到达梦数据库。借助 `DM 数据迁移工具` ，完成 `Nacos` 配置数据表迁移到达梦数据库。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-11-23-ru-he-rang-nacos-zhi-chi-da-meng-shu-ju-ku-zuo-wei-wai-zhi-s/014-4780c6a9.png)
