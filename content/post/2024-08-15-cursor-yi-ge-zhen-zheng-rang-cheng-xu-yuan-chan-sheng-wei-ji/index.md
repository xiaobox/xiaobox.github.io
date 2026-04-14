---
title: "Cursor 一个真正让程序员产生危机感的 AI 编程工具"
slug: 2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji
description: "https://www.cursor.com/起初最开始接触 cursor 的时候是在去年年初，openAI"
date: 2024-08-15T09:43:32.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/cover.jpg
original_url: https://mp.weixin.qq.com/s/shmpkeH_FmZ53GZDpKimQw
categories:
  - AI
tags:
  - VSCode
  - LLM
  - ChatGPT
  - Cursor
  - RAG
  - Prompt
  - DeepSeek
  - Embedding
---
https://www.cursor.com/

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/001-489fbf36.png)

## 起初

最开始接触 cursor 的时候是在去年年初，openAI ChatGPT 带火了一批 AI 概念产品。GitHub 的 Copilot 自不用说，很早就在使用，有了大模型的加持当时也是如日中天。我记得 cursor 当时主打的点是：

1.  可以无逢迁移 vscode ，vscode 的所有插件可以直接一键转移到 cursor。连界面都一模一样

2.  轻巧、快速。体量小，启动快，编程效率高

3.  可用免费的 AI 模型进行提示。

当时体验下来发现也确实如宣传所说，是挺快，但是没有那么强的吸引力让我愿意换 vscode 和 idea 。我使用最多的还是 vscode+idea+copilot+chatgpt 。基本上满足我日常开发的需求了。当然后来又加上了 `warp`

## 现在

最近我又体验了一下 cursor ，发现它和原来的版本有很大的不同。而这一次，彻底改变了对它的看法。目前我已将编程工具切换到了 cursor，很心甘情愿的切换了过去。

### 原理

先说最重要的，一切事情有困就有果，有果就有因，cursor 好用的功能有很多，但最重要的我认为只有一个。关于这个功能，我要说明一下它的原理。

其实市面上的 AI 编程助手类工具不止一个，比较好用的有:

-   github 的 copilot
-   字节豆包的 marscode
-   阿里的 通义灵码

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/002-ab589355.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/003-c0225f66.png)

大家都知道，这些工具背后是各家的 LLM ,提示质量的高低主要取决于这些大模型的能力。而所有的工具都只是基于当前文件的。无论是代码解释、优化、生成注释，都是基于当前文件的内容，无论是针对文件、类、方法。你对代码提问的 codeBase 是单文件，上下文自然也是当前打开的这个单文件。

这就是现在的这些 AI 编程工具的运行逻辑，从当前文件中获得代码的上下文再结合你的提问（prompt）,一起发给 LLM，最后得到结果。其实这已经能解决不少问题了，在没有 cursor 之前感觉很不错，写程序确实能提高效率。

我们觉得上面那些工具很不错是因为我们没有用过更好的工具：

-   **cursor 的 codeBase 是整个工程**
-   **cursor 的 codeBase 是整个工程**
-   **cursor 的 codeBase 是整个工程**

可能有的伙伴看到这几个字立刻就懂我是什么意思了，对，就是那个你越想越激动的事情。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/004-9ffd9c4a.png)

cursor 的逻辑是，先将工程内的所有代码进行索引和向量化（Embedding），再之后你的所有提问都是基于整个工程给你答案，它会将你的提问结合整个工程的代码一起提交给 LLM，默认有这些模型：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/005-3bf45d75.png)

注意这里不包含 `deepseek-coder`，那是我自己添加的。

这很像基于 RAG 方法论的系统实现，只不过外挂的知识库是代码库而已。

这就是我认为最重要的功能，我说清楚了它的逻辑，接下来我们来说基于这个功能能做什么，这才是最激动人心的部分

## 能解决的问题

### 代码补全

之前工具的代码补全虽然使用了 LLM，但仍然不那么精准，因为它只能把当前文件作为上下文，而 cursor,它的 codeBase 是基于整个工程的，它的代码补全相当于是分析了你整个工程的代码基础之上给的建议，那是正当的精准啊。这也就是为什么有的朋友说，现在用 cursor 写程序一路 tab 下来就完事儿了，比自己写的还好。简直就是自动化编程。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/006-7d036f6d.png)

### 智能纠错

这代码你就放心写吧，如果你写着写着写错了，cursor 会在你输入的时候自动纠正你的错误![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/007-494f7724.png)

它为啥能纠错，它怎么知道我写错了？对，还是 codeBase，你的整个工程它都了如指掌。

### 聊天

太基础的功能了，然而因为 codebase，它就有了无限可能。首先，你可以在当前文件中针对某一部分来提问，比如你要重构一个方法什么的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/008-6b38b91d.png)

它会重构的比较好，因为它的 codebase 是整个工程。

你也可以单独打开一个聊天窗口

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/009-18a518d9.png)

在这里提问可以仅针对当前文件、文件夹、图片、文档、网络或者整个 codebase

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/010-a064956e.png)

最重要就是这个 `Codebase` 这是可以发挥无限想像的地方。

由于篇幅的原因，我不会把所有的细节全部用图片或视频的形式放出来，因为太多了，但你看我的描述也一定能体会到 cursor 的强大，这里我举几个例子，这些例子我已经测试成功并且在工作中使用了，它很强，很实用：

1.  我是项目主要的开发者，我现在想针对某个功能进行重构，注意不是一个类，一个文件，而是整个功能的重构。我让 cursor 给出我具体的建议和修改的代码。**它实现了，非常具体、清晰、详细、正确率高达 95 % 以上（claude 模型）**
2.  我有一个陈旧的项目，代码中几乎没有注释，也没有接口文档。我现在想从代码中分析出一份 api 接口文档，要包括地址、请求类型、请求和响应字段，以及示例 json。**它也实现了，就是我想要的内容，100% 正确**
3.  我有一个小白同事，刚进项目组，对他要负责的功能模块完全不知道流程是什么，不巧的是整个项目也没有什么文档，需要他去看代码自己梳理。他让 cursor 帮他梳理出项目中有关 oauth2 认证、鉴权的完整流程。从第一个请求开始，到最后一个请求数据返回，包括所有相关的代码片段和执行路径。**cursor 瞬间完成了，正确率 100%**
4.  我有一个测试同事，想写关于某个重要模块的测试用例及测试报告，cursor 基于整个项目的 codebase 帮他一步一步实现了。
5.  我有个前端同事上传了一张别人设计的不错的界面的图片，他让 cursor 帮他根据他 vue2 项目的情况自动生成页面代码,**cursor 瞬间完成了，和图片的相似度达到 85%**
6.  我有个大数据开发同事，他正在重构之前写的 SQL，他把建表语句告诉 cursor 后，让他把一批 sql文件根据他的要求进行了重构，cursor 很快就完成了。
7.  我有个运维同事，他之前把所有运维的工作全部代码化了。在一个仓库里，现在基础设施有一些变动，他让 cursor 根据现有的运维脚本和代码进行重构，**cursor 瞬间就完成了，正确率 90%**
8.  我还有个产品同事，现在不怎么用 Axure 画原型了，他说和 cursor 交流一下基础上就能出前端代码，跟前端学了点儿基础知识，原型几分钟就搞定了。
9.  我有个朋友，现在想将 .net 项目转成 java，他原先估计要组一个团队至少 5 个后端一起干，现在他一个人正在一步一步地用 cursor 帮助他实现。
10.  我还有个朋友。。。。。

我想你应该知道我想说什么了，我想你也知道 cursor 为什么足以让我兴奋了。而所有的这些原因，都是因为它最重要的原理，它的 codebase，它和其他产品不一样的逻辑。

cursor 当然还有一些其他功能我没有介绍到，不过那都不重要，你已经知道了它的逻辑，它的核心原理和功能，剩下的就交给你了，交给你的想象力和创造力了。

## 优点和缺点

以上的内容怎么看都是 cursor 的优点，然而在阅读的过程中你一定想到它还有许多令人担心的问题，没错。首先就是数据安全。虽然 cursor 官方宣称数据是保存在本地的，不会被上传，但是我知道你一定担心。这是个有意思的问题，因为关于这一点无论对方如何承诺你都不会轻信，隐私和方便它永远是问题的两端，我们不可能全都要，所以要做个取舍。

然后就是价格，cursor 前两周是免费使用的，然后再用就要收费了，怎么收费呢？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/011-82956fc6.png)

我说一下重点，如果你使用 cursor 是包含两部分费用的，一部分是软件的费用，这部分比如一个月 `20$` 是付给 cursor 的，另一部分是模型的使用费用，这个是你付给像 openAI 这样的模型提供商的。那么加起来可能一个月你至少有 30$ 以上的成本。不过关于模型这部分，因为 cursor 可以添加 deepseek 的 coder 模型，所以模型使用成本算是打下来了，因为 deepseek 模型的 API 是白菜价

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/012-eb626349.png)

不但是白菜价，首次注册人家还送  500万 tokens

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/013-9b4705c9.png)

总结来说，除了优点都是缺点，包括：

-   成本不低
-   数据安全

这两点加起来对很多人来说就望而却步了，当然还要解决网络的问题。不过我觉得国内的公司一定不会坐以待毙，一定很快就会有类似的产品上线了，到时候网络就不是问题了。

## 未来

正如我标题所写，因为看到了 cursor，这次我真的觉得程序员有危机了，尤其是对于初级的、新手程序员。因为我用工具虽然可能有一点点错误，但它可以瞬间完成一些基础的工作，完全可以替代人了，我不需要招那么多人来干那些 “脏活累活” ，我只需要几个高级并且会使用高级工具的人才就可以了，他们创造的人效是原来的 10 倍以上。

再进一步，自动化编程可以期待了吗？也就是提一个描述得很清晰的需求给 AI，他能自动把程序写好，有公司正在做：https://www.cognition.ai/  原先我觉得他在吹牛，现在，尤其是使用了 cursor 后，我觉得可能不远了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-15-cursor-yi-ge-zhen-zheng-rang-cheng-xu-yuan-chan-sheng-wei-ji/014-330d3b2c.png)

## 思考

我在最近几年思考了一个问题，很多企业没有业务知识库，就算是有，文档也不全，也不及时更新，这个所谓的企业内部的业务知识库也是名存实亡。那如果需要了解业务的时候怎么办？比如需要大版本更新，重大业务调整的时候，怎么办呢？找开发看代码是最准的了，然后这些辛苦的工作又 TMD 转到开发这儿来了。

我想来想去，感觉没有什么非常好的解法。虽然可以用 RAG 来解决一部分的问题，但没有完全解决，因为只要文档不是最新的，文档有问题，一切基于知识库的分析全都是错的。直到 cursor 出现了，我觉得问题可以以另外一种方式来解决了。因为代码是准的，代码就是错那也是代码的 bug。但它是准的，代码写错了，也是准的。代码什么样线上就是什么样，业务就是什么样。

那么整个企业的业务知识就已经在代码里了，只需要从代码仓库提炼就可以了，我们借助 cursor 或者以后什么其他类似的工具再加工一下就完全可以提炼出准确、实时、可用的企业业务知识了。而这个 “知识” 才是企业真正的业务资产。代码就算没了，根据业务重建都可以，反过来，如果你对业务不了解，给你代码也没用。
