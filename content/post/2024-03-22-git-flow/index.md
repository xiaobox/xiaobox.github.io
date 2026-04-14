---
title: "git flow"
slug: 2024-03-22-git-flow
description: "一  什么是 git flow就像代码需要代码规范一样，代码管理同样需要一个清晰的流程和规范。"
date: 2024-03-22T08:52:42.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/cover.jpg
original_url: https://mp.weixin.qq.com/s/MntUNIRxAP_CpbbSWfn1tA
categories:
  - 工具与效率
tags:
  - Git
  - 多线程
---
## 一  什么是 git flow

就像代码需要代码规范一样，代码管理同样需要一个清晰的流程和规范。Git 作为一个源码管理系统，不可避免涉及到多人协作。协作必须有一个规范的工作流程，让大家有效地合作，使得项目井井有条地发展下去。"工作流程"在英语里，叫做"workflow"或者"flow"，原意是水流，比喻项目像水流那样，顺畅、自然地向前流动，不会发生冲击、对撞、甚至漩涡。

Gitflow 工作流定义了一个围绕项目发布的严格分支模型。 下图能说明整个流程，该模式来自 Nvie

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/001-f3b9593e.png)

解释上图

-   master 默认分支，只能用来包括产品代码（线上生产环境代码），不许提交，只能合并。
-   develop 最新的开发状态 ，是你进行任何新的开发的基础分支。当你开始一个新的功能分支时，它将是\_开发\_的基础。另外，该分支也汇集所有已经完成的功能，并等待被整合到 master 分支中。develop 上的代码总是从 feature 上合并过来的。不许提交，只能合并。
-   master develop 这两个分支被称作为 长期分支。它们会存活在项目的整个生命周期中，而其他的分支，例如针对功能的分支，针对发行的分支，仅仅只是临时存在的
-   feature 开发新功能的分支，基于 develop, 完成后 merge 回 develop
-   release: 准备要发布版本的分支，用来修复 bug. 基于 develop, 完成后 merge 回 develop 和 master
-   hotfix: 修复 master 上的问题，等不及 release 版本就必须马上上线。基于 master, 完成后 merge 回 master 和 develop
-   hotfix 分支是基于 “master” 分支。 这也是和 release 分支最明显的区别，release 分支都是基于 “develop” 分支的

## 二 为什么要使用 git flow

-   虽然大多数团队已由 svn 切换到 git，但代码控制方式仍然是“集中式”的，没有发挥 git 的强大功能。
-   在团队开发中使用版本控制系统时，商定一个统一的工作流程是至关重要的 ，git flow 有着清晰的流程和规范。
-   简单并可定义适合各自团队的 flow

## 三 如何使用

初始分支，所有在 Master 分支上的 Commit 应该 Tag，目前只有 master 角色可提交，其它角色提交不了，被保护了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/002-b3cbcfda.png)

Feature 分支 Feature 分支做完后，必须合并回 Develop 分支，合并完分支后一般会删点这个 Feature 分支，但是我们也可以保留

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/003-0bb54033.png)

Release 分支 Release 分支基于 Develop 分支创建，打完 Release 分之后，我们可以在这个 Release 分支上测试，修改 Bug 等。同时，其它开发人员可以基于开发新的 Feature （记住：一旦打了 Release 分支之后不要从 Develop 分支上合并新的改动到 Release 分支） 发布 Release 分支时，合并 Release 到 Master 和 Develop， 同时在 Master 分支上打个 Tag 记住 Release 版本号，然后可以删除 Release 分支了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/004-1486da11.png)

维护分支 Hotfix hotfix 分支基于 Master 分支创建，开发完后需要合并回 Master 和 Develop 分支，同时在 Master 上打一个 tag

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-03-22-git-flow/005-c9370ce8.png)

## 四 命令规范

|
 |
 |
 |
 |
| --- | --- | --- | --- |
| 分支名称 | 规则 | 示例 | 说明 |
| master |
 | master | 默认不可变 |
| develop |
 | develop | 默认不可变 |
| feature | feature\_\* | feature\_order-detail | \* 为功能简述，如多个单词，中间用横线连接 |
| release | release\_\*.rc | release\_1.0.1.rc | \* 为版本号， 版本号规则如下所述 |
| hotfix | hotfix\_\* | hotfix\_1.0.1 | \* 为版本号， 版本号规则如下所述 |
| tag | （对应项目名，全部大写拼写）\_ tag \_ V \* | JARVISPMS\_tag\_V1.0.1 | \* 为版本号， 版本号规则如下所述 |

1.  大版本号更新表示一次里程碑开发的完成，包含了若干个 feature 的实现。
2.  小版本号更新表示一个 feature 的完成。
3.  补丁号更新表示发布的 feature 不变，只是修改 bug

**举例：**

1.  某次发布是里程碑开发的结束，版本号为 1.0.0
2.  很快，上次发布的版本发现了 bug，紧急修复，再次发布，版本号为 1.0.1
3.  再次发现 bug，修复，重新发布，版本号为 1.0.2
4.  几个星期后，新增了几个功能，再次发布，版本号为 1.1.0
5.  几天后发现新增的功能有 bug，紧急修复，发布，版本号为 1.1.1
6.  再次新增功能发布，版本号为 1.2.0
7.  发现 bug，修复并发布，版本号为 1.2.1
8.  再次完成一次里程碑开发，发布，版本号为 2.0.0
9.  ……以此类推

## 五 code review

由于使用了 git flow ，可以将 code review 机制很好的结合起来，当我们合并代码的时候，是需要 MR（merge request）的，这时候需要向代码审核人提交你的合并请求。具体流程可参考 GitLab Flow 里的最后一部分。

## 六 使用 git flow 开发流程简述

1.  从 develop 打 feature 分支，确定 feature 分支负责人（今后这个分支分出去的其它分支都由他负责，他负责 MR 时的代码评审）。
2.  在 feature 分支上开发，如其它同事的其它 feature 分支合并回了 develop, 会要求通过大家。如需要（一般是公共影响部分）在你自己的 feature 分支上合并 develop 上的代码。
3.  开发完 feature 分支代码，提交合并请求，合并至 develop, 由代码评审人评审通过后合并。合并完成后，删除 feature 分支。
4.  提测前，从 develop 中打出 release 分支给测试使用，如测试通过不需要修改，则合并回 master 和 develop 并删除；如有问题，可以在 release 分支上修改，修改完毕后，再合并回 master,develop, 并删除 release 分支。
5.  上线前，在 maser 分支上打出 tag
6.  线上有 bug，从 master 打出 hotfix 分支修复，完成后，合并回 master 和 develop , 删除 hotfix 分支。
