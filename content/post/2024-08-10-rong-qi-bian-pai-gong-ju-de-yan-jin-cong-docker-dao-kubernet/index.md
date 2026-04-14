---
title: "容器编排工具的演进：从 Docker 到 Kubernetes"
slug: 2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet
description: "在现代应用部署中，Docker 和其他容器引擎为服务器端应用程序的部署提供了极大的便利。"
date: 2024-08-10T05:18:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/cover.jpg
original_url: https://mp.weixin.qq.com/s/DHCzhY8fNYXCGF0n8q0Hzg
categories:
  - 云原生
tags:
  - Kubernetes
  - Docker
  - Linux
  - 缓存
  - 算法
---
在现代应用部署中，Docker 和其他容器引擎为服务器端应用程序的部署提供了极大的便利。然而，随着应用和服务数量的增加，管理这些容器变得越来越困难。这催生了一类被称为容器编排器的工具，其中最为知名的莫过于 Kubernetes。容器编排的历史可以分为 Kubernetes 出现之前和之后两个阶段。

#### 容器的便利与妥协

容器的使用虽然便利，但也带来了一些妥协。严格遵循 Docker 的理念，每个服务都应有其独立的容器，这将导致运行大量的容器。即使是一个简单的数据库网页界面，也可能需要分别运行数据库服务器、应用程序，以及可能包括用于处理静态文件的 Web 服务器、用于终止 SSL/TLS 连接的代理服务器、用作缓存的键值存储，甚至用于处理后台作业和计划任务的第二个应用程序容器。

负责多个此类应用程序的管理员很快就会意识到，需要一个工具来简化管理任务，这时容器编排工具应运而生。容器编排器可以将多个容器作为一个单元来管理，并将多个服务器结合成一个集群，自动分配容器工作负载到集群节点中。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/001-b1b8ce49.png)

#### Docker Compose 与 Swarm

Docker Compose 虽然不完全是一个编排器，但它是 Docker 首次尝试创建的工具，用于更轻松地管理由多个容器组成的应用程序。它使用 YAML 格式的文件，通常命名为`docker-compose.yml`。Compose 读取该文件，并使用 Docker API 创建所需的资源，同时为所有资源添加标签，以便在创建后作为一组进行管理。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/002-eea10afc.png)

Compose 文件中可以定义三种资源：

-   **服务（services）：** 包含要启动的容器声明。每个条目相当于一个`docker run`命令。
-   **网络（networks）：** 声明可以附加到容器的网络。每个条目相当于一个`docker network create`命令。
-   **卷（volumes）：** 定义可以附加到容器的命名卷。每个条目相当于一个`docker volume create`命令。

Compose 提供了一种更方便的方式来管理由多个容器组成的应用程序，但在其最初版本中，它仅支持单个主机；所有创建的容器都在同一台机器上运行。为了扩展到多个主机，Docker 在 2016 年引入了 Swarm 模式。这是 Docker 的第二个名为“Swarm”的产品，前一个产品于 2014 年推出，采用了完全不同的方法在多个主机上运行容器，但现在已不再维护。

Swarm 模式包含在 Docker 中，无需额外的软件即可使用。创建集群只需在初始节点上运行`docker swarm init`，然后在每个其他节点上运行`docker swarm join`。Swarm 集群包含两种类型的节点：管理节点和工作节点。管理节点提供 API 以在集群上启动容器，并使用基于 Raft 一致性算法的协议进行通信，以在所有管理节点之间同步集群状态。工作节点则负责运行容器。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/003-62b1f381.png)

通过 Compose 文件在 Swarm 上部署服务。Swarm 通过为每个服务添加一个`deploy`键扩展了 Compose 格式，该键指定服务应该运行的实例数量及其运行的节点。然而，这导致 Compose 和 Swarm 之间出现了一些分歧，某些选项如 CPU 和内存配额需要根据使用的工具以不同的方式指定。在此分歧期间，为 Swarm 准备的文件被称为“堆栈文件”而非 Compose 文件，幸好这些差异在当前版本的 Swarm 和 Compose 中已被平滑处理，Compose 格式现在有一个开放规范及其 GitHub 组织提供的参考实现。

关于 Swarm 的未来存在一些不确定性。它曾经是名为 Docker Cloud 的服务的骨干，但该服务在 2018 年突然关闭。它还被宣传为 Docker 企业版的关键特性，但该产品已售予另一家公司，现以 Mirantis Kubernetes Engine 的名义进行市场推广。同时，最新版本的 Compose 已经获得了将容器部署到 Amazon 和 Microsoft 托管服务的能力。虽然没有宣布弃用，但最近也没有任何其他类型的公告；在 Docker 网站上搜索“Swarm”一词，仅能找到一些提及。

#### Kubernetes

Kubernetes（有时称为 k8s）是受 Google 内部工具 Borg 启发的项目。Kubernetes 管理资源并协调在多达数千个节点的集群上运行工作负载；它在容器编排领域的统治地位如同 Google 在搜索领域的统治地位。Google 曾在 2014 年希望与 Docker 在 Kubernetes 开发上合作，但 Docker 决定走自己的路，发展 Swarm。相反，Kubernetes 在云原生计算基金会（CNCF）的支持下成长。到 2017 年，Kubernetes 的流行度已高到 Docker 宣布将其集成到 Docker 产品中。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/004-3033a01c.png)

Kubernetes 以其复杂性而闻名。手动设置一个新集群是一项繁杂的任务，除了 Kubernetes 本身外，管理员还需选择和配置若干第三方组件。就像 Linux 内核需要结合其他软件以构成完整的操作系统一样，Kubernetes 仅是一个编排器，需结合其他软件以构成完整的集群。它需要容器引擎来运行其容器，还需要网络和持久化卷的插件。

Kubernetes 发行版存在以填补这一空白。像 Linux 发行版一样，Kubernetes 发行版将 Kubernetes 与安装程序和精选的第三方组件捆绑在一起。不同的发行版存在以满足不同的需求；几乎每家规模一定的科技公司都有其自己的发行版和/或托管产品，以迎合企业需求。minikube 项目为开发者提供了一个更简便的本地实验环境。

### Kubernetes 的组成结构

一个 Kubernetes 集群包含多个软件组件。集群中的每个节点都会运行一个称为 kubelet 的代理，以保持集群成员资格并接受来自集群的工作，容器引擎，以及用于启用与其他节点上运行的容器进行网络通信的 kube-proxy。

保持集群状态并对资源分配做出决策的组件被统称为控制平面，这包括一个分布式键值存储（etcd），一个将工作分配给集群节点的调度器，以及一个或多个控制器进程，这些进程对集群状态的变化做出反应，并触发任何必要的操作以使实际状态与所需状态相匹配。用户和集群节点通过 Kubernetes API 服务器与控制平面进行交互。为了实现变更，用户通过 API 服务器设置集群的期望状态，而 kubelet 将每个集群节点的实际状态报告给控制器进程。

Kubernetes 在一个称为 Pod 的抽象中运行容器，Pod 可以包含一个或多个容器，尽管不建议在一个 Pod 中运行多个服务的容器。相反，通常一个 Pod 会有一个提供服务的主容器，可能还有一个或多个“sidecar”容器，用于从主容器中运行的服务收集指标或日志。Pod 中的所有容器都会一起调度在同一台机器上，并共享一个网络命名空间——在同一个 Pod 中运行的容器可以通过回环接口互相通信。每个 Pod 在集群内都会收到一个唯一的 IP 地址。在不同 Pod 中运行的容器可以使用它们的集群 IP 地址相互通信。

一个 Pod 指定了一组要运行的容器，但 Pod 的定义并没有说明要在哪些地方运行这些容器，或运行多久——在没有这些信息的情况下，Kubernetes 会在集群中某处启动容器，但不会在它们退出时重新启动它们，并可能在控制平面决定其他工作负载需要它们使用的资源时突然终止它们。因此，Pod 很少单独使用；相反，Pod 的定义通常被封装在一个 Deployment 对象中，用于定义一个持久化服务。像 Compose 和 Swarm 一样，Kubernetes 管理的对象是在 YAML 中声明的；对于 Kubernetes，这些 YAML 声明通过 kubectl 工具提交到集群。

除了 Pod 和 Deployment，Kubernetes 还可以管理许多其他类型的对象，例如负载均衡器和授权策略。支持的 API 列表在不断演变，且会因运行的 Kubernetes 版本和集群运行的发行版而有所不同。自定义资源可以用来向集群添加 API 以管理其他类型的对象。例如，KubeVirt 增加了 API 以使 Kubernetes 能够运行虚拟机。可以使用 kubectl api-versions 命令发现特定集群支持的 API 的完整列表。

与 Compose 不同的是，每个对象是在一个单独的 YAML 文档中声明的，尽管可以通过在同一文件中用“---”分隔它们内联多个 YAML 文档，如 Kubernetes 文档中所示。一个复杂的应用程序可能由多个对象组成，其定义分布在多个文件中；在维护此类应用程序时保持所有这些定义同步可能相当繁琐。为了使这项工作更容易，一些 Kubernetes 管理员转向了模板工具如 Jsonnet。

#### Helm 与应用部署

Helm 进一步推进了模板化的方法。与 Kubernetes 一样，Helm 的开发在 CNCF 的支持下进行；它被誉为“Kubernetes 的包管理器”。Helm 从一组称为 chart 的模板和变量声明集合中生成 Kubernetes 的 YAML 配置。其模板语言与 Ansible 的 Jinja 模板不同，但看起来非常相似；熟悉 Ansible 角色的人可能会对 Helm 图表感到得心应手。

Helm 图表的集合可以在 Helm 存储库中发布；Artifact Hub 提供了一个公共 Helm 存储库的大型目录。管理员可以将这些存储库添加到他们的 Helm 配置中，并使用现成的 Helm 图表将预打包的流行应用程序版本部署到他们的集群。最近版本的 Helm 还支持将图表推送和拉取到容器注册表中，从而为管理员提供了将图表存储在与容器镜像相同位置的选项。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/005-c4704500.png)

Kubernetes 在短期内没有失去势头的迹象。它被设计为可以管理任何类型的资源；这种灵活性，如通过 KubeVirt 虚拟机控制器所示，即使容器化工作负载最终失宠，它也有可能保持相关性。开发进展迅速，定期发布新版本。版本支持为期一年；似乎没有长期支持版本。支持集群升级，但一些人更愿意建立一个新集群并迁移他们的服务。

#### Nomad 的简单替代方案

Nomad 是 HashiCorp 推出的编排器，作为 Kubernetes 的简单替代方案进行营销。Nomad 是一个开源项目，像 Docker 和 Kubernetes 一样。它由一个名为 nomad 的二进制文件组成，可用于启动一个称为代理的守护程序，并作为 CLI 与代理进行通信。根据其配置方式，代理进程可以以两种模式之一运行。在服务器模式下运行的代理接受作业并为它们分配集群资源。在客户端模式下运行的代理与服务器联系以接收作业、运行它们，并向服务器报告其状态。代理还可以在开发模式下运行，在这种模式下，它同时承担客户端和服务器的角色，形成一个可用于测试目的的单节点集群。

创建一个 Nomad 集群可能相当简单。在 Nomad 的最基本操作模式下，必须启动初始服务器代理，然后可以使用 nomad server join 命令将其他节点添加到集群中。HashiCorp 还提供了 Consul，这是一种通用服务网格和发现工具。虽然可以单独使用，但 Nomad 与 Consul 结合使用时可能表现最佳。Nomad 代理可以使用 Consul 自动发现和加入集群，并且可以执行健康检查、提供 DNS 记录以及为集群上运行的服务提供 HTTPS 代理。

Nomad 支持复杂的集群拓扑。每个集群分为一个或多个“数据中心”。与 Swarm 类似，单个数据中心内的服务器代理使用一种基于 Raft 的协议进行通信；该协议具有严格的延迟要求，但多个数据中心可以使用一种允许信息在集群中传播的流言协议链接在一起，而无需每个服务器都与每个其他服务器保持直接连接。从用户的角度来看，以这种方式链接在一起的数据中心可以作为一个集群运作。这种架构在扩展到巨大的集群时为 Nomad 带来优势。Kubernetes 官方支持最多 5000 个节点和 300000 个容器，而 Nomad 的文档引用了包含超过 10000 个节点和 200 万个容器的集群示例。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-10-rong-qi-bian-pai-gong-ju-de-yan-jin-cong-docker-dao-kubernet/006-4f3abd38.png)

与 Kubernetes 类似，Nomad 不包括容器引擎或运行时。它使用任务驱动程序来运行作业。使用 Docker 和 Podman 运行容器的任务驱动程序已包含在内；社区支持的驱动程序可用于其他容器引擎。同样与 Kubernetes 类似，Nomad 的野心不限于容器；还有其他类型工作负载的任务驱动程序，包括一个简单地在主机上运行命令的 fork/exec 驱动程序、用于运行虚拟机的 QEMU 驱动程序和用于启动 Java 应用程序的 Java 驱动程序。社区支持的任务驱动程序将 Nomad 连接到其他类型的工作负载。

与 Docker 或 Kubernetes 不同，Nomad 避开了 YAML，而是采用 HashiCorp 配置语言（HCL），该语言最初是为另一个 HashiCorp 项目 Terraform 创建的，用于云资源的配置。HCL 在 HashiCorp 产品线中使用广泛，尽管在其他地方采用有限。用 HCL 编写的文档可以轻松转换为 JSON，但其目标是提供比 JSON 更便于手指输入且比 YAML 更不易出错的语法。

HashiCorp 的 Helm 等效工具称为 Nomad Pack。像 Helm 一样，Nomad Pack 处理包含模板和变量声明的目录以生成作业配置。Nomad 还具有一个社区注册表，用于预打包应用程序，但可用选择远少于 Artifact Hub 的 Helm。

Nomad 没有 Kubernetes 那样的受欢迎程度。像 Swarm 一样，其开发似乎主要由其创建者推动；虽然它已被许多大公司部署，但 HashiCorp 仍然是 Nomad 社区的中心。此时，项目似乎不太可能获得足够的动力以独立于其企业母公司存在。用户或许可以从 HashiCorp 更明确地致力于 Nomad 的开发和推广中找到一些保证，这与 Docker 对 Swarm 的承诺形成鲜明对比。

#### 结论

Swarm、Kubernetes 和 Nomad 并不是唯一的容器编排器，但它们是三个最具生命力的工具。Apache Mesos 也可以用于运行容器，但在 2021 年几乎被搁置；基于 Mesos 的 DC/OS 也面临类似的情况，支持其发展的社区和商业实体正在寻找新的方向。尽管如此，Swarm、Kubernetes 和 Nomad 仍然是当前市场上最受欢迎和最活跃的容器编排解决方案，它们各自提供了不同的功能和优势，以满足不同规模和需求的企业。随着技术的不断进步和市场的变化，这些工具将继续演化，以适应未来的挑战和机遇。
