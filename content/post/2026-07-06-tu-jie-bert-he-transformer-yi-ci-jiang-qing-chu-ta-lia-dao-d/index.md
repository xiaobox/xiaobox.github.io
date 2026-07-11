---
title: "图解 BERT 和 Transformer，一次讲清楚它俩到底什么关系"
slug: 2026-07-06-tu-jie-bert-he-transformer-yi-ci-jiang-qing-chu-ta-lia-dao-d
description: ""
date: 2026-07-06T11:27:05.000Z
image:
original_url:
categories:
  - AI
tags:
  - BERT
  - Transformer
  - LLM
  - 面试
---

想必不少小伙伴面试过程中,会遇到这道题,「说说 BERT 和 Transformer 的区别」。

还别说,这问题真挺常问的。前几天有读者私信我说,面试官问了这题,他答了「BERT 用了 Transformer 的架构」,面试官追问「具体用了哪部分,为什么只用那部分」,他就卡住了。

其实这道题一点都不难,关键是你脑子里要有一张清晰的图。

今天咱们就用图把这件事讲透。看完你会知道,Transformer 是一个完整的翻译团队,而 BERT 和 GPT 分别只拿走了这个团队的一半。

![配图 1](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/66d65696-b30b-4697-8648-2b09e6f6c76d-1.png)

## 翻译团队,Transformer 的完整架构

> Transformer 到底长什么样?

2017 年,Google 发了一篇论文叫「Attention Is All You Need」。这篇论文提出了 Transformer 架构,从此改变了整个 NLP 的走向。

Transformer 最初是为了做机器翻译设计的,比如把「我爱你」翻译成「I love you」。

要完成翻译,你需要两个能力,一个是「听懂原文」,一个是「说出译文」。

Transformer 就是按照这个思路设计的,它由两部分组成,

- **Encoder(编码器)**,负责听懂输入
- **Decoder(解码器)**,负责说出输出
我打个比方。

你可以把 Transformer 想象成一个同声传译团队。左边坐着一个「听力官」,他负责听完整段中文,把意思理解透。右边坐着一个「口译官」,他负责根据听力官传过来的理解,一个词一个词地把英文说出来。

听力官和口译官之间有一条「传话通道」,在 Transformer 里这个通道叫 **Cross-Attention**,它让口译官在说每个英文词的时候,都能回头看一眼听力官的笔记,确认自己没理解错。

![配图 2](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/7b0a0530-c545-4f64-9fa5-02236ce58251-1.png)

> 这两个部分内部长什么样?

听力官(Encoder)内部的工作流程是这样的,

1. 先把输入的中文句子转成向量(Input Embedding + Position Encoding)
2. 然后做 Self-Attention,让每个字都看看其他字,搞清楚它们之间的关系
3. 再过一个前馈网络(Feed Forward),做一次非线性变换
4. 以上这套流程重复 N 次(原始论文是 6 次)
口译官(Decoder)的流程类似,但多了一步,

1. 先把已经说出的英文词转成向量
2. 做 Masked Self-Attention,每个词只能看到它左边已经说出的词,不能偷看右边还没说的
3. 做 Cross-Attention,回头看听力官的笔记
4. 过前馈网络
5. 同样重复 N 次

![配图 3](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/5c833985-b2b1-42c0-842b-a89181efa255-1.png)

> 为什么 Decoder 要遮住右边?

这个问题很关键。

想象你在做翻译,你正在说第三个英文词。如果你已经知道了第四个词和第五个词是什么,那这道题就没意义了,因为你直接照抄就行了。

所以 Decoder 必须「遮住右边」,这叫 Masked Attention。每个词在预测的时候,只能看到它前面已经确定的词,不能偷看后面的答案。

这就像考试时用手挡住下面的题,一道一道做。

![配图 4](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/8cad8307-3bec-4d25-af4b-80ab3cdccfb8-1.png)

## 环顾会议室,Self-Attention 机制

> Self-Attention 到底是怎么工作的?

Self-Attention 是 Transformer 最核心的零件,无论是 Encoder 还是 Decoder 里都有它。

我再打一个比方。

想象你在一个会议室里,桌子上坐了 5 个人,分别代表句子里的 5 个词,「我」「爱」「吃」「苹」「果」。

现在轮到「吃」这个词发言了。它要决定,在理解自己的意思时,应该重点关注桌上的哪个人。

「吃」环顾了一圈会议室,

- 看了一眼「我」,觉得还行,跟自己有点关系(谁在吃)
- 看了一眼「爱」,觉得关系不大
- 看了一眼「苹」,觉得关系很大(吃什么)
- 看了一眼「果」,觉得关系也很大
于是「吃」决定,把更多注意力分给「苹」和「果」,少一点给「我」,几乎不理「爱」。

Self-Attention 干的就是这件事,让每个词都看一圈所有其他词,然后决定谁对自己最重要。

![配图 5](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/5a07189e-0285-4d07-98b1-4e0e2961e13f-1.png)

> 技术上是怎么实现的?

在实际计算中,每个词会被变成三个向量,

- **Q(Query)**,相当于这个词的「提问」,「我想找跟我相关的人」
- **K(Key)**,相当于这个词的「标签」,「我是什么身份」
- **V(Value)**,相当于这个词的「内容」,「我能提供什么信息」
计算过程是,

1. 用 Q 和所有的 K 做点积,算出每对词之间的相关度
2. 把相关度过一个 Softmax,变成 0-1 之间的注意力权重
3. 用注意力权重对 V 做加权求和,得到最终输出
用公式写就是,Attention(Q, K, V) = softmax(QK^T / √d_k) · V

那个 √d_k 是一个缩放因子,防止点积数值太大导致 Softmax 梯度消失。

![配图 6](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/5b51785f-f6da-4313-9c7d-dec7ec1dcd9b-1.png)

> 什么是 Multi-Head Attention?

Transformer 不止用一组 Q/K/V,而是同时用了多组,这叫 Multi-Head Attention。

还是会议室的比喻。如果只有一个视角,「吃」可能只注意到「吃什么」这个关系。但如果同时有 8 个视角(8 个 head),那不同的 head 可以分别关注,

- Head 1 关注「谁在吃」→ 注意力在「我」
- Head 2 关注「吃什么」→ 注意力在「苹果」
- Head 3 关注「什么态度」→ 注意力在「爱」
多个视角拼在一起,理解就更全面了。

![配图 7](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/1fcb3379-93c0-4ee1-a4b1-5f4984b5868a-1.png)

## 只带耳朵的翻译,BERT

> BERT 到底是什么?

2018 年,Google 又发了一篇论文,提出了 BERT(Bidirectional Encoder Representations from Transformers)。

名字挺长,但核心就一句话,BERT 只用了 Transformer 的 Encoder 部分,把 Decoder 整个扔掉了。

为什么?

因为 BERT 的目标不是「翻译」也不是「写作」,它的目标是「理解」。

还是用翻译团队的比喻。BERT 相当于一个只带耳朵的翻译,它不需要开口说话,它的工作就是,听完一段话之后,告诉你「这段话是正面情绪还是负面情绪」「这段话里的人名分别是谁」「这两段话是不是在说同一件事」。

既然不需要说话,那口译官(Decoder)就不需要了。只留听力官(Encoder)就够了。

![配图 8](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/9b8c74c1-5c55-4af5-9e77-85529847c14f-1.png)

> BERT 的注意力和 Transformer 有什么不同?

这是最关键的区别,**BERT 的 Self-Attention 是双向的**。

在原始 Transformer 的 Decoder 里,每个词只能看到左边的词(Masked Attention),这是因为翻译/生成任务要求你一个词一个词地往外蹦,不能偷看后面的。

但 BERT 不需要一个词一个词往外蹦,它的任务是「理解整段话」。理解一段话的时候,当然要前后都看。

比如「苹果发布了新手机」这句话,你要判断「苹果」是水果还是公司,就必须看到后面的「新手机」。只看左边的话,你看到的是「苹果发布了」,没法确定是水果还是公司。

所以 BERT 把 Mask 去掉了,让每个词都能同时看到左边和右边的所有词。

这就是「Bidirectional」这个词的含义,双向。

![配图 9](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/b9b96b4c-870c-435f-b6b4-8ede523b6bf9-1.png)

## 填空题选手,BERT 的训练方式

> BERT 是怎么训练出来的?

BERT 的训练方式非常巧妙,它用了两个任务。

**任务一,Masked Language Model(MLM),做填空题**

训练的时候,随机把句子里 15% 的词遮住,换成一个特殊符号 [MASK],然后让模型猜这个词是什么。

比如原句是「我 爱 吃 苹 果」,遮住之后变成「我 [MASK] 吃 苹 果」,模型要猜出 [MASK] 的位置应该填「爱」。

因为词被随机遮住,模型必须利用前后所有的上下文来猜。这就逼着它学会真正理解语义,而不是只记住一个方向的模式。

![配图 10](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/73e89a0a-81de-40d0-9813-97b12ef29601-1.png)

**任务二,Next Sentence Prediction(NSP),判断两句话是不是连着的**

给模型两句话 A 和 B,让它判断 B 是不是 A 的下一句。

比如,

- A=「今天天气真好」 B=「适合出去走走」 → 是下一句 ✓
- A=「今天天气真好」 B=「股票又跌了」 → 不是下一句 ✗
这个任务让 BERT 学会理解句子之间的关系,对「问答」「推理」这些需要跨句子理解的任务特别有用。

![配图 11](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/6bd0cd90-6234-4387-a1b2-379659279cc6-1.png)

## 接龙选手,GPT 的训练方式

> GPT 又是怎么训练的?

GPT 的训练方式完全不同。

GPT 只用了 Transformer 的 Decoder 部分(把 Encoder 扔掉了,刚好和 BERT 反过来)。它的训练任务只有一个,**预测下一个词**。

给 GPT 一句话的前面几个词,让它猜下一个词是什么,

- 输入「我」→ 预测「爱」
- 输入「我 爱」→ 预测「吃」
- 输入「我 爱 吃」→ 预测「苹」
- 输入「我 爱 吃 苹」→ 预测「果」
这叫**自回归(Autoregressive)**训练,模型像玩成语接龙一样,一个词一个词地往后接。

因为是往后接,所以每个词只能看到它前面的词,不能偷看后面的。这就是为什么 GPT 用的是 Masked Attention(单向)。

![配图 12](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/7ab08602-2b7a-484a-b45d-80e5222c342c-1.png)

> BERT 做填空,GPT 玩接龙,这两种方式各有什么好处?

填空题(BERT)的好处是,模型必须前后都看,理解更深。坏处是,它不会「说话」,因为它从来没练过一个词一个词往外蹦的能力。

接龙(GPT)的好处是,模型天生就会「说话」,你给它一个开头,它能一直往下写。坏处是,它只能看左边,理解不如 BERT 深。

一句话总结,

**BERT 是考试型选手,做阅读理解特别强,但你让它写作文它不行。**

**GPT 是写作型选手,写东西特别溜,但你让它做细粒度的分类判断,不如 BERT 精准。**

![配图 13](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/2917e341-dbcc-4d4f-9680-9e41af161e45-1.png)

## 谁干什么活,下游任务的分工

> 面试官经常问,BERT 和 GPT 分别适合什么场景?

BERT 这条线(Encoder-only)主要用在「需要理解但不需要生成」的场景,

- **文本分类**,判断一句话是正面还是负面
- **命名实体识别(NER)**,找出句子里的人名、地名、机构名
- **问答系统**,给一段文本和一个问题,找出答案在文本的哪个位置
- **语义相似度**,判断两句话是不是在说同一件事
- **搜索排序**,判断搜索结果和查询词的相关度
GPT 这条线(Decoder-only)主要用在「需要生成」的场景,

- **对话**,ChatGPT、Claude 聊天
- **写作**,写文章、写邮件、写代码
- **翻译**,虽然原始 Transformer 用的是 Encoder-Decoder,但现在大模型靠纯 Decoder 也能翻译得很好
- **代码补全**,GitHub Copilot
有意思的是,今天最火的大语言模型(LLM)全是 GPT 这条线的后代。GPT-4、Claude、LLaMA、千问、DeepSeek,清一色 Decoder-only 架构。

BERT 那条线没有消失,它的后代 RoBERTa、ALBERT、DeBERTa 还活跃在搜索引擎、广告系统、风控系统这些需要「快速精准判断」的场景里。只是不像 GPT 那条线这么出圈。

![配图 14](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/69f428a6-5902-4052-9b00-713617513c6a-1.png)

## 回到面试,一张表记住所有区别

面试被问到的时候,你脑子里有这张表就够了,

| 对比项 | BERT | GPT | 原始 Transformer |
|---|---|---|---|
| 用了哪部分 | 只用 Encoder | 只用 Decoder | Encoder + Decoder |
| 注意力方向 | 双向(左右都看) | 单向(只看左边) | Encoder 双向,Decoder 单向 |
| 训练方式 | 填空(MLM + NSP) | 接龙(预测下一个词) | 翻译(Seq2Seq) |
| 擅长什么 | 理解、分类、NER | 生成、对话、写作 | 翻译、摘要 |
| 代表模型 | BERT/RoBERTa/DeBERTa | GPT-4/Claude/LLaMA | T5/BART |
| 诞生年份 | 2018 | 2018(GPT-1) | 2017 |

![配图 15](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/4f5cc59d-cc2d-4e7b-8278-55c83ae6f6da-1.png)

最后用一句话帮你记住,

**Transformer 是一个完整的翻译团队,BERT 只留了耳朵,GPT 只留了嘴巴。BERT 做填空题练出来的,所以它听得懂但不会说。GPT 玩接龙练出来的,所以它能一直往下说。**

下次面试被问到,先说这句话,再展开讲细节,稳了。

---

*图解系列持续更新,如果你觉得有用,帮我点个赞。*
