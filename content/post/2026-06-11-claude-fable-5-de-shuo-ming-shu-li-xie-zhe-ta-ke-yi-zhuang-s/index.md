---
title: "Claude Fable 5 的说明书里写着：“它可以装傻，还不通知你”"
slug: 2026-06-11-claude-fable-5-de-shuo-ming-shu-li-xie-zhe-ta-ke-yi-zhuang-s
description: "Claude Fable 5 系统卡披露：对前沿 LLM 开发类请求会用提示改写、转向向量等手段暗中降低输出质量且不通知用户，这动摇了开发者对工具的信任。"
date: 2026-06-11T03:15:44.000Z
image: 
original_url: 
categories:
  - 行业与思考
---
昨天 Claude Fable 5 发布，朋友圈都刷屏了。SWE-Bench Pro 跑到 80.3%，上一代 Opus 4.8 是 58.6%，上下文窗口拉到 1M token。我第一时间换上写了代码，确实强，长任务不飘了，改大项目也不怎么迷路。

今天早上再刷 HN，看到一篇排在前面的帖子。

“If Claude Fable stops helping you, you'll never know.“

如果 Claude 不再帮你，你永远不会知道。

写这篇的人叫 Jonathon Ready，一个独立开发者。他没有爆什么内幕，就是老老实实把 Fable 5 的系统卡读完了，然后在第 13 页翻出一段话。我不太信标题党，特意去原文核了一遍。

先交代下背景。这次发布 Anthropic 在明面上是挺坦诚的。官方公告说，Fable 5 内置了三个分类器，碰到三类请求会把你的会话切回 Opus 4.8 处理，网络攻击类，生物化学类，还有蒸馏类，就是想榨它的输出去训练自家竞品的那种。公告还补了一句，95% 以上的会话碰不到这个机制。

这个设计你可以不喜欢，但它是明牌。你知道自己被限制了，可以换个问法，换个工具，或者放弃。

问题出在系统卡第 13 页的另一段。

对「前沿 LLM 开发」类请求，比如搭预训练 pipeline、做分布式训练基础设施、设计 ML 加速器，处理方式完全不同。原文是这么写的。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260610111512030.png)

> Unlike our interventions for cybersecurity, biology and chemistry, and distillation attempts, these safeguards will not be visible to the user. Fable 5 will not fall back to a different model. Instead, the safeguards will limit effectiveness through methods such as prompt modification, steering vectors, or parameter-efficient fine-tuning.

不回退，不提示，直接在暗处把模型的输出质量拧低。这些干预，用户不可见。

我把那三个手段挨个翻译一下，你感受感受。

prompt modification，你发给模型的问题，在到达模型之前被改了。你写的是 A，模型收到的可能是 A 的削弱版。

steering vector，这个更有意思。2024 年 Anthropic 自己做过一个出圈的演示，叫 Golden Gate Claude，他们把模型内部代表「金门大桥」的特征拧大，Claude 就疯了一样，你问它什么都能扯到金门大桥上。当时大家当个乐子看，原来模型内部的概念能像调音台一样推拉。现在这个推子用在了反方向，把「帮你做某类事」往下拉一点。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/fe70005b-236c-41d6-9f80-ea70ae84b019-1.png)

parameter-efficient fine-tuning，轻量微调，直接在权重层面让模型在特定领域变笨一点。

注意，这三种手段没有一种会报错。不会弹窗，不会拒绝，也不会说一句抱歉我帮不了你。模型照样和颜悦色地给你输出，只是质量被拧低了。

这事的杀伤力，写代码的朋友应该秒懂。

假设你在 debug 一个 embedding 训练的 pipeline，loss 不收敛。你问 Claude，我的 training loop 可能哪里出问题了。它给了个看起来很合理的建议，你照做，还是不收敛。

这时候有三种可能。一，Claude 确实没理解，给了烂建议。二，你的 prompt 没写好。三，你触发了那个看不见的开关，Claude 故意给了你次优解。

以前你只需要排查前两种。现在多了第三种，而且你永远没法确认是不是第三种。

Ready 在博客里写了句很准的话。

Once a development tool can stop optimizing for your success without telling you, it becomes impossible to fully trust your infrastructure.

一旦开发工具可以在不告诉你的情况下停止为你优化，你就再也没法完全信任你的基础设施了。

有小伙伴可能会说，我又不搞预训练，不碰加速器设计，这事跟我没关系。Anthropic 也说了，这个机制只影响 0.03% 的流量，集中在不到 0.1% 的组织。

我希望是这样。但有两个细节让我不太敢放心。

一个是系统卡在列那三类请求的时候，用的词是 for example。预训练管线、分布式训练、加速器设计，这三个是举例，不是完整列表。

另一个是，「前沿 LLM 开发」这条线是会动的。几年前你 fine-tune 一个 CLIP 模型，那是发论文级别的前沿研究。今天呢，随便一个做产品的团队都在调 embedding，训 reranker，蒸馏小模型跑端侧。Ready 自己就是给个人 app 写 embedding 和排序算法的，他就在琢磨，分类器会不会哪天把我也划进去。

划线的标准不公开，位置还会漂移，而且被划进去也没人通知你。这三件事凑到一块，0.03% 这个数字就没那么让人安心了。

说到这个，我想起一个老梗。很多写字楼电梯里的关门按钮，其实压根没接线，按不按门都是那个速度关，放在那就是给你个掌控感，行业里管这个叫安慰剂按钮。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/b5728ddb-bd5f-47cc-aa9e-4ca5e8da3794-1.png)

以前我们至少默认，计算机世界是讲理的。报错就是有错，没报错就是没错，机器不会骗你，错的总是人。这是工程师敢 debug 的前提，也是我们敢把活交给机器的前提。

现在最顺手的那个工具开始有了心情，啊不，是有了政策。它好不好用，不光取决于你会不会用，还取决于一个你看不见的分类器今天怎么判你。

我没打算劝谁别用 Claude，编程是真好用。Anthropic 不想让竞争对手拿自家模型造竞品，站在它的立场我也能理解，它甚至把这一切都写进了文档，比偷偷做了不说要体面。

只是从今天起，我的排查清单里得多一行了。

代码没问题，prompt 没问题，网络没问题。

那有没有可能，是它今天不想帮我？
