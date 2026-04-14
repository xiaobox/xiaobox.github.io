---
title: "一文帮你解决 Linux 发行版 “选择困难症”"
slug: 2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe
description: "文章回顾了Linux发行版的选择问题，尤其是在CentOS 7停止维护后，探讨了Anolis OS、Rocky Linux、AlmaLinux等新兴替代品，"
date: 2024-09-12T08:21:56.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/cover.jpg
original_url: https://mp.weixin.qq.com/s/Syo9ixa-l8ZUWiqJgpmjGg
categories:
  - 系统底层
tags:
  - Linux
  - 架构
---
工作关系，今天要买一批云服务器。打开熟悉的阿里云，到选择操作系统这项的时候我停了下来，因为我发现现在的 linux 发行版是真多呀，阿里云默认显示的公共镜像就这么多：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/001-8404d19d.png)

10年前几乎闭眼选择 CentOS 的时代一去不复返了。那么到底应该选择哪个发行版呢？所以干脆写篇文章来盘点一下这些 linux 发行版

对了，你可能发现我直接忽略了 `Windows Server` ，是的，因为 90% 以上的服务器选择安装 linux 操作系统。

### Linux 发行版和 Linux 内核之间的关系

先把最基本的概念弄清楚：

-   Linux 内核是操作系统的核心部分,由 Linus Torvalds 最初开发并持续维护。它负责管理硬件资源、提供系统调用等最基本的功能。
-   Linux 发行版是在 Linux 内核基础上,添加了各种系统软件、应用程序、配置工具等,组成的**完整可用的操作系统**。

发行版的主要工作是 ：1）选择特定版本的 Linux 内核、2）添加各种系统软件和应用程序、 3）开发独特的安装程序和系统管理工具   4）提供技术支持和更新

常见的发行版有 Ubuntu、Fedora、CentOS、Debian 等。所有 Linux 发行版都使用 Linux 内核作为核心,遵循 GNU 通用公共许可证。

## 流行的 Linux 发行版

排名不分先后，虽然前文上图中有阿里云的 `Alibaba Cloud Linux` 但因为云平台自身利益关系，它的排名和推广不代表流行程度，所以我这里忽略它。

### Anolis OS

Anolis OS 可能没有其他发行版那么知名，它是是由阿里云开发，但 AnolisOS 仍然是开源的，遵循开源许可，所以我这里也要提一下，支持开源社区

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/002-f7bdcd78.png)

> “
> 
> Anolis OS 8 是 OpenAnolis 社区推出的完全开源、中立、开放的发行版，它支持多计算架构，也面向云端场景优化，兼容 CentOS 软件生态

简单说，AnolisOS 是基于 CentOS 进行的二次开发，所以如果你更熟悉 CentOS，又讨厌现在 RedHat 对 CentOS 的最新政策，那么可以试一试它。不过选择操作系统还是要谨慎，毕竟基础设施运维起来有坑的话都是大坑，哈哈。

### CentOS

这个我们可得好好说说，可以说是大家最熟悉的 Linux 发行版了。为什么呢？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/003-3a72632d.png)

最初红帽公司开发了企业级付费的 linux 操作系统：Red Hat Enterprise Linux (RHEL)。CentOS 本身是 RHEL 的一个免费开源复制版。这对于广大开发者和系统使用者可是件大好事，因为有企业级付费产品冲在前线做质量保障，CentOS 直接跟在屁股后面复制成果做免费开源，当时的 Red Hat 简直是IT界的赛博菩萨。CentOS 也成为了很多公司服务器操作系统的不二之选 。

然而：

> “
> 
> CentOS 7已于2024年6月30日停止维护，CentOS官方已停止维护CentOS计划。

CentOS 没了？倒也不是，Red Hat 更新了产品策略。旧的 CentOS 确实不再维护了，不是不能用，是不再维护了，如果操作系统有bug 可没人管了哈。所以选择老版本的CentOS需要谨慎。

新版的 CentOS 叫 `CentOS Stream` ，别看就多了个 Stream，情况却大不一样。与之前的 RHEL 在前，CentOS 在后相比，这次 Red Hat是这么设计的：CentOS Stream 仍然开源，但它是在第一线的，而 RHEL这次反过来是在 CentOS Stream的后面享受开源的成果。说白了，让社区的开发给 CentOS Stream 提feature 改 bug，RHEL 在后面积累成果卖钱。让大家给 Red Hat 打工。

总结来说：

-   原来 Centos 是 RHEL 的下游复制品。CentOS（在转变前）紧跟 RHEL 的发布节奏
-   现在 CentOS Stream 是 RHEL的 上游产品。

当然工也不是白打，你不也用人家的操作系统了嘛。

相比前后两种策略，大家心里跟明镜似的，越来越多的人不再选择 CentOS 了，虽然出了bug 有社区维护，但相比之前有个靠谱商业付费产品做基础，保障少多了，担心多多了。运维也不想加班呀。

**事情发展到这里还没有结束，因为大家不禁要问，CentOS 一直所坚持的开源精神呢？难道这精神没有继续者吗？**

有！！

Gregory Kurtzer 站了出来。

CentOS 的原始创始人 Gregory Kurtzer 发起了 `Rocky Linux` 项目，目标是创建一个与 RHEL 100% 兼容的下游版本，旨在成为 CentOS 的精神继承者。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/004-2bb83c0c.png)

还有！！

`AlmaLinux` 由 CloudLinux 公司发起，同样旨在提供一个与 RHEL 完全兼容的免费替代品。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/005-410d9f2d.png)

开源的精神没有覆灭，Rocky Linux 和 AlmaLinux 都是 RHEL 的下源产品，如果你想找到一个 CentOS 的替代品，那么这两个发行版可能会很适合你。

### Red Hat Enterprise Linux

红帽公司著名产品：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/006-3f2a7b17.png)

前文多次提到它，收费，稳定，天下没有花钱的不是，一分钱一分货。但确实是贵啊（相比开源免费）。。。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/007-fcb58ee4.png)

### SUSE Linux

又是一个和 RHEL 齐名的付费产品

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/008-c2af8427.png)

但它开始的时候也是一个有志青年，是不收费的。

早期（1992-2003）：SUSE 最初是一个开源项目，提供免费版本。被 Novell 收购后，仍保留了开源版本 openSUSE。从 Novell 分离后，SUSE 成为独立公司，开始更注重商业模式。

现在 ，SUSE Linux Enterprise（SLE）是付费的企业版本。openSUSE 仍然是免费开源的社区版本。

SUSE 和 RHEL 在技术和使用上的区别挺多的，但我感觉最大的区别是 SUSE 在欧洲市场较强，特别是在 SAP 环境中。如果欧洲企业中有使用  OpenStack 和 SAP 的，那么愿意为操作系统付费的企业很可能选择的就是 SUSE。

### Fedora

在 Fedora 7 之前，Fedora 的名字是“Fedora Core”，之后就简称为 Fedora

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/009-ead6550c.png)

Fedora 是一个快速发展的、面向技术爱好者的 Linux 发行版。

Fedora 是 RHEL 的上游项目之一。RHEL 的开发团队会从 Fedora 社区中吸取一些新的特性和改进，然后根据企业的需要进行调整和完善。因此，可以说 Fedora 在某种程度上影响了 RHEL 的发展方向。看了前文的读者读到这里是不是已经熟悉 RedHat 的套路了？所以你在选择操作系统上也要掌握点儿 “反套路” 才行。

### Debian

与 RHEL 不同，Debian 是纯社区驱动的项目。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/010-ab7ecf9d.png)

Debian 有较长的发布周期，注重稳定性，这是它的优势也是劣势。较长的发布周期可能导致软件版本较旧。

Debian 稳定版通常包含较旧但经过充分测试的软件。但 Debian 对新手来说可能不够友好

可能最为人熟知的就是包管理系统

-   Debian 使用 APT（Advanced Package Tool）和 .deb 包格式。
-   CentOS 使用 YUM/DNF 和 .rpm 包格式。

### Ubuntu

这个发行版大家也很熟悉，你看，一般大家比较熟悉的发行版做的都比较好，不然不会有那么多人喜欢它。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-12-yi-wen-bang-ni-jie-jue-linux-fa-xing-ban-xuan-ze-kun-nan-zhe/011-5dcb222f.png)

Ubuntu 是一个基于 Debian 的 Linux 发行版，由 Canonical Ltd. 公司维护和支持。我们上文刚才了 Debian的一些问题，比如发布周期长，对新手不友好等，Ubuntu 就有针对性的解决了这些问题：

> “
> 
> Ubuntu 的目标是提供一个稳定、用户友好的操作系统，并且它特别注重易用性和社区支持。Ubuntu 每六个月发布一个新版本，其中每隔两年会有一个长期支持（LTS）版本，提供长达五年的安全更新和技术支持。

这里我们不禁要比较一下 Debian和 Ubuntu(**我肯定选后者啦**) ：Ubuntu 基于 Debian，因此两者共享许多软件包。然而，Debian 更加注重稳定性和安全性，更新周期更长；而 Ubuntu 则更注重易用性和最新技术的应用。

还是列举一下 Ubuntu的优缺点：

-   更新频繁，软件包较新
-   强大的社区支持
-   良好的桌面和服务器体验
-   丰富的文档和资源

-   与 RHEL 生态系统不兼容

现在，越来越多的运维同学选择 Ubuntu 作为服务器的操作系统，我觉得可能有这么几点原因：

1.  Ubuntu 对各种硬件的支持非常广泛，这对于新的发行版来说是一个重要优势。
2.  Ubuntu 在容器技术和云计算方面有很好的支持
3.  Ubuntu 拥有庞大的用户和开发者社区，这意味着丰富的资源、文档和第三方支持。
4.  Ubuntu 的六个月发布周期和长期支持版本（LTS）提供了良好的平衡，可以根据需要选择稳定性或新特性。
5.  Ubuntu 的 APT 包管理系统强大且用户友好，便于管理和定制软件包。

## 总结

本文我们讨论了在购买云服务器时面临众多 Linux 发行版选择的问题。随着 CentOS 7 的停止维护以及 CentOS Stream 成为 RHEL 的上游版本，过去直接选择 CentOS 的做法已不再适用。我们提到了几个主要的 Linux 发行版，包括：

-   Anolis OS：阿里云开发的开源发行版，基于 CentOS 进行了二次开发，兼容 CentOS 生态。
-   CentOS：曾经作为 RHEL 的下游复制品，现已转变为 RHEL 的上游版本 CentOS Stream，不再作为 RHEL 的直接复制品。
-   Rocky Linux 和 AlmaLinux：作为 CentOS 的精神继承者，这两个发行版提供了与 RHEL 完全兼容的免费替代品。
-   Red Hat Enterprise Linux (RHEL)：商业化的 Linux 发行版，提供企业级支持和服务。
-   SUSE Linux：与 RHEL 类似的商业发行版，在欧洲市场尤其是 SAP 环境中较为流行。
-   Fedora：快速发展的发行版，作为 RHEL 的上游项目，为 RHEL 提供技术创新。
-   Debian：社区驱动的发行版，注重稳定性和安全性，但软件版本可能较旧。
-   Ubuntu：基于 Debian，注重易用性和最新技术的应用，每六个月发布一次新版本，并提供 LTS 版本。

最后我说一下我个人 对 linux 发行版的选择排序：

**Rocky Linux > Ubuntu > AlmaLinux > CentOS Stream**
