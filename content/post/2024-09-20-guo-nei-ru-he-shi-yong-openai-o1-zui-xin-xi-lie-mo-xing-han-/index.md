---
title: "国内如何使用 OpenAI o1 最新系列模型？（含ChatGPT4o）"
slug: 2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-
description: "国内如何使用 OpenAI o1 最新系列模型？（含ChatGPT4o）"
date: 2024-09-20T03:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/cover.jpg
original_url: https://mp.weixin.qq.com/s/w8YPP1p23CCvYQaUgwFSKw
categories:
  - AI
tags:
  - LLM
  - ChatGPT
  - Agent
---
9 月 13 日凌晨，OpenAI 悄然发布了其最新的 o1 系列大模型。目前，o1 模型已经向 ChatGPT Plus 和 Team 用户开放，据说未来也会考虑对免费用户开放。此次推出模型有两个：o1 预览版和 o1mini。而更强的 o1 正式版，目前还没发布。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/001-9b34a917.png)

根据官方发布的消息，这次突然推出的 o1 系列模型提供了中杯、大杯和超大杯三个选择：

-   `o1`：全新的大模型天花板，因过于强大，暂不对外公开。
-   `o1-preview`：o1 的早期版本，适合需要高推理能力的任务，适合科学研究、复杂的数学推理等。
-   `o1-mini`：速度更快、性价比更高，适用于需要推理但无需广泛世界知识的日常任务。

目前国内也已经直接可用！有需要的可以直接点：https://2233.ai/i/AGENT

## 一、OpenAI o1 新的思考方式

CEO 奥特曼表示，此次 o1 模型推出，标志着一种新范式的起点：具备通用复杂推理能力的人工智能。

具体来说，o1 系列是 OpenAI 首个通过强化学习训练的模型，在生成回答之前，会构建一个详尽的思维链，以此提升模型的性能。

换句话说，内部思维链越长，o1 思考的时间越充裕，模型在推理任务上的表现也就越加优异。

所以 OpenAI o1 在输出时，生成时间格外的长

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/002-1bc15ede.png)

## 二、更加强大的能力

在竞争性编程平台 Codeforces 的测试中，GPT4o 的准确率仅为 11.0%，而 o1 系列却表现出色：预览版达到了 62%，正式版更是高达 89%。

在博士级科学问题的 GPQA Diamond 评测中，GPT4o 的正确率为 56.1%，人类专家则为 69.7%，而 o1 则显著提升至 78%。

此外，o1 模型在机器学习基准测试、理化生等各科考试以及化学与生物领域的博士级科学问题上，均明显优于 GPT-4o。这也是首个取得如此成绩的模型。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/003-834cbe93.png)

**在逻辑和推理能力上**：2024 年的 AIME 数学竞赛，GPT4o 的准确率只有 13.4%，o1 预览版一下子跳到了 56.7%，而尚未发布的正式版更是狂飙至 83.3%。

再看**代码竞赛**，GPT4o 的成绩仅为 11.0%，o1 预览版 62%，正式版则飙升至 89%。

最让人震撼的是**博士级科学问题 GPQA Diamond**，GPT4o 的准确率为 56.1%，人类专家是 69.7%，而 o1 直接打破天花板，达到了恐怖的 78%。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/004-1268e36e.png)

## 三、o1 模型的不足与限制

首先，很贵，且限量使用。

**o1 预览版 30 条/每周，o1-mini 版 50 条/每周。**

API 用户则需按量计费：每百万次输入 15 美元，输出则为 60 美元。

如果你已经是 Tier5 用户（消费超过 1000 美元），那么已经可以通过接口直接调用 o1 系列模型了！

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/005-49608a8f.png)

## 四、对比 GPT4o 和 o1 模型的差别

> “
> 
> 下面所展示实例均为 2233.ai 中 ChatGPT 随心用功能（国内直连使用 o1）

此次 o1-preview 和 o1-mini 模型最突出的能力就是数学和编程能力。我们将着重测试 GPT4o、o1-preview 和 o1mini 的数学能力和编程能力。

**2024 阿里巴巴全球数学竞赛预选题原图：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/006-f96a8a6a.png)

**GPT4o 给出的答案：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/007-eac0f459.png)

虽然它最后的答案是正确的，但是其推理是错误的，最后一句话“最少可能要 4 名同学符合这个条件，但是最后给出的答案是 6 名，而不是 4 名”

**o1 模型给出的答案：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/008-b6f542c6.png)

o1 给出的答案正确，而且推理的过程也十分完美，不过就是推理时间长达 3 分钟

当然，我们这些问题还不足以说明 o1 模型有多强，用数学大神陶哲轩的原话来说：**“他向 o1 模型提出一个措辞模糊的数学问题，发现它竟然能成功识别出克莱姆定理”。而且答案是“完全令人满意的”那种。**

同时，我们在找到一道较难的编程题目分别问 GPT-4o 和 o1preview 模型，来看一下它们回答如何。

**原题：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/009-d6775d28.png)

**GPT4o 的设计思路：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/010-3e8bf9a2.png)

**o1 模型的设计思路：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/011-f0be9217.png)

还有一个物理大神可以侧面说明 o1 模型的强大。

2022 年，物理学博士 Kabasares 在《天体物理学杂志》上发表了一篇论文，探讨了利用天文数据建模来测量黑洞质量的方法。实现这段代码是 Kabasares 博士研究中的一个关键突破。o1 模型在 1 小时内生成的 Python 代码。虽然基于合成数据，但其功能与 Kabasares 的实际代码非常相似。

总的来说，此次 OpenAI 推出的 o1-preview 和 o1-mini 模型整体表现很强的！！不过正式版的 o1 模型尚未发布，我们可以期待一下~~

## 五、国内可用 OpenAI o1 方法

-   **最新版本 ChatGPT**：可以使用最新版本的 o1-preview 和 o1-mini 模型，也能任意使用 ChatGPT4o 和 4.0。
-   **原生版本体验**：支持 GPTs、Dallas-E 多模态绘画，甚至无需 APP 直接语音对话。
-   **国内网络直连**：不需要科学上网，可无障碍使用服务。
-   **独立对话**：对话记录相互独立，保证信息安全。
-   **无封号风险**：无需额外注册账号，登录即用，再也不用担心封号问题。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/012-d15450c5.png)

想要体验的小伙伴可以现在就直接去体验：https://2233.ai/i/AGENT

> “
> 
> 注意：填写邀请码能立减 1 美元。邀请码：【AGENT】

不仅可以体验最新版的 o1-preview 和 o1-mini 模型，还能使用之前的 GPT4o 的语音通话功能、绘画功能、上传文件功能、对话功能。ChatGPT 所具有的功能这里全都有。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/013-a765a58e.png)

我使用了这么长时间，确实就原生版本体验。

目前，ChatGPT Plus 套餐最低只需 9.99 美元，比官网便宜了一半。如果使用优惠码【AGENT】，还可以再减 1 美元。

可以直接复制这个链接到浏览器打开：【https://2233.ai/i/AGENT】

## 最后

如果是想要直接订阅 ChatGPT Plus 或者充值 OpenAI API 的，又或者是订阅 Claude 等其他海外软件服务，还可以通过他们的 wildcard 支付会员轻松解决。具体操作就不在这里赘述了，感兴趣的小伙伴可以留言或者后台跟我说，我再出一个详细教程。也可以直接去使用，毕竟操作也不难，用下面的链接一样有优惠：【https://bewildcard.com/i/AGENT】

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-09-20-guo-nei-ru-he-shi-yong-openai-o1-zui-xin-xi-lie-mo-xing-han-/014-edbc0352.png)
