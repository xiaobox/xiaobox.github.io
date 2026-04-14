---
title: "不止于工具：PromptPilot如何将AI开发从“手工作坊”推向“工业时代”？"
slug: 2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho
description: "“在AI应用的最后一公里，我们面临一个深刻的悖论：我们拥有了前所未有强大的大模型“引擎”，却常常在如何精确“驾"
date: 2025-08-03T10:09:58.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/cover.jpg
original_url: https://mp.weixin.qq.com/s/x12kuZMJow1zgrBQjdAVrw
categories:
  - AI
tags:
  - LLM
  - RAG
  - Prompt
  - 算法
---
> “
> 
> 在AI应用的最后一公里，我们面临一个深刻的悖论：我们拥有了前所未有强大的大模型“引擎”，却常常在如何精确“驾驶”它这件事上捉襟见肘。我们真正缺的，或许不是更强的模型，而是更准的“缰绳”。

## 概览

最近，火山引擎开了一场发布会，端出了两道“硬菜”：一个是性能更强的豆包大模型1.6，另一个则是我们今天要深挖的主角——PromptPilot。

这篇文章会把这两件事给你一次性讲明白。读完本文，你会清晰地了解到：

1.  为何要关注豆包1.6： 首先，我们会快速过一遍豆包大模型1.6的升级亮点，并列出它在中文处理、成本、长文本等方面的几个硬核优势，让你明白为何它值得被选入你的生产环境。
2.  主角PromptPilot如何解决痛点： 接着，我们会深入本文真正的主角——PromptPilot。带你从头到尾走一遍它的全流程，看它到底是如何通过“生成→调试→评测→优化”的闭环，将写提示词这件“玄学”彻底工程化的。
3.  横向对比： 把它放到市场中，与谷歌、微软等大厂的同类产品做对比，看清它的真实水平和独特价值到底在哪。

## 豆包大模型 1.6

豆包大模型升级了。2025 年 6 月 11 日在火山引擎 FORCE 原动力大会上正式发布豆包大模型 1.6 版本

从原来的 1.5 到现在的 1.6，间隔仅有 140 天（豆包大模型 1.5 版本于 2025 年 1 月 22 日正式发布）。4 个多月出新版本，算得上是很快了。我想团队内部遇到的困难、挑战一定不少，在这些困难下，工程师们交出的结果却一点儿不差，令人尊重。

现在你可以通过 https://www.volcengine.com/experience/ark?model=doubao-seed-1-6-flash-250715 来体验 1.6 版本的模型，会送 50 万 token。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/001-a356184e.png)

大概介绍一下 1.6 模型，主要有以下两个子模型：

-   Doubao-Seed-1.6-thinking｜250715：模型思考能力大幅强化， 对比 Doubao-1.5-thinking-pro，在 Coding、Math、 逻辑推理等基础能力上进一步提升， 支持视觉理解。 支持 256k 上下文窗口，输出长度支持最大 16k tokens。
-   Doubao-Seed-1.6-flash｜250715： 推理速度极致的多模态深度思考模型，TPOT 仅需 10ms； 同时支持文本和视觉理解，文本理解能力超过上一代 lite，纯文本能力大幅提升近 10%。支持 256k 上下文窗口，输出长度支持最大 16k tokens。

从我个人的使用体验上看，1.6 比 1.5 强了很多。据悉，在众多权威评测集上，豆包大模型 1.6 的得分均位居国际第一梯队。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/002-ce42d4ee.png)

可能很多人有这样一个问题：**有那么多模型，我为什么要选择豆包？**

嗯，确实，市面上众多模型，开源的也好，闭源的也罢，除了国民级别的豆包 APP，好像豆包大模型的存在感不太高。然而实际上可能只是你不知道，我来列举一些，你可能真的想在生产应用中使用豆包大模型的原因：

1.  中文准确度必须顶尖（教育、政务、法律），比如在 2025 年高考数学新高考卷实测拿到 144/150，中文复杂推理居国内榜首
2.  国内首个 256 K token 对话模型，单条上下文 > 128 K（长合同、源代码库、历史聊天）
3.  成本：0–32 K 输入只要 ¥0.8/百万 token，综合成本是上一代模型的 1/3
4.  能够“看图说话”或读视频（电商质检、巡检、短视频客服）：60 项公开多模态基准 38 项第一
5.  通过中国网信办算法备案：豆包已完成“网信算备 110108823483901230031”备案，可直接商用

心动吗？ 如果你要做一个 AI 应用，我想以上每一项都对你的模型选型很重要。

## PromptPilot

随着豆包大模型 1.6 更新的，还有今天的主角 `PromptPilot`

众所周知，Prompt（提示词）作为大模型的核心输入指令，直接影响模型的理解准确性和输出质量。优质的 Prompt 能显著提升大语言模型处理复杂任务的能力，如逻辑推理、步骤分解等。

作为 AI 应用的资深玩家，写提示词几乎成了每天必须要做的事情，我不但使用 AI 工具，还开发 AI 产品。就拿最近做的一个 RAG 项目来说，在整个 RAG pipeline 中，有一个很重要的环节就是 “响应生成”。顾名思义，就是通过 prompt 驱动 LLM 生成结果。其实 prompt engineering（提示词工程） 在整个 AI 应用中的性价比是极高的，要知道对整个技术工程进行优化的成本其实是相当大的，而且往往有时候投入产出不成正比，但 prompt engineering 不一样，一个好的提示词返回的结果质量可能比一个差的提示词强 10 倍，这在我们研发团队内部是有共识的。

prompt engineering 看起来是叫“提示词工程”，但在实践中，它缺少传统工程的严谨范式，它不像其他可工程化的技术那样有明确的流程和标准，甚至与传统‘技术’的关联也显得不那么紧密。写提示词不用懂技术，不用会编程，语文和表达力好就够用了。

然而这正是这个问题的症结所在，没法工程化，写提示词不成了管理的玄学了吗？系统、应用可不能由着你的性子玩儿“抽卡”啊，技术上一定要落地，一定要明确才行。但整个 AI 生态上，大家都在忙于开发模型，忙于开发基于模型的应用，或者大家觉得写提示词太简单？ 总之并没有很好地把写提示词这个问题工程化地解决好，对于 prompt engineering ，从我的经验看，至少有以下几个痛点：

-   太容易上手但又不容易写好
-   写出来效果不满意不知道怎么优化
-   没有客观的评价标准，很难说什么是好的提示词
-   经常变更，写了新版忘了旧版，版本和生命周期全靠手动维护

随着我们项目开发的深入，以上这些问题我们也使用了一些办法，比如：

-   利用提示词模板固定提示词，将变量提出，前期手动管理提示词和提示词模板的版本与生命周期，后期开发系统功能来管理。
-   与客户一起编写 Q/A 手册，一来为了将问题和标准回答定义清晰，二来为了验收做准备。研发团队基于 Q/A 可以有的放矢地对整个工程以及提示词进行优化。
-   虽然客户不一定懂 prompt engineering，但知道什么是满意的结果什么是不满意的结果，通过点头 Yes 摇头  No 的方式来逐步固定提示词的衡量标准

其实从项目和工程的角度，诸如以上的办法我们还有一些，但作为一个开发者，这些办法一点儿“技术的味道” 都没有，它很别扭，不是说我们要为了技术而技术，而是技术是确定性的，可落地的，有保障的东西，没有工程来管理这个事儿，总让我不踏实。整个 prompt engineering 的过程可以说一点儿都不丝滑。里面有很多人工、手动、流程和制度的东西，太原始了，啥呀这是，什么时代了，一定有更好的解决办法才对。所以我一直在找，幸运的是我没找太久就看到了 `PromptPilot` ，只一眼，我就知道，就是它了，它能解决我的问题！

### PromptPilot 简介

> “
> 
> 火山引擎出品的 `PromptPilot` 提供全流程智能优化，涵盖生成、调优、评估和管理全阶段。

我引入了官方文档的一句话，我想这句话就够了，一句话就解决了我之前所说的几乎所有痛点。

目前可以通过两个入口使用（**限时免费 90 天** 2025.06.11-2025.09.11）：

-   独立站：https://promptpilot.volcengine.com/home
-   火山方舟：https://console.volcengine.com/ark/region:ark+cn-beijing/autope/startup?

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/003-33005111.png)

下面我分别说一下它是怎么解决我的痛点的。

### 从生成一个 prompt 开始

我经常看到一些刚接触 AI 大模型的伙伴，在起初面对大模型时手足无措，不知道应该怎么写 prompt ，实际上我开始也不太清楚要怎么写，但好在我经常写文章，还有一些经验，至少我能把事儿说明白，大模型给我的反馈也还不错，我把我的这种方法称为 **“白描”**。然而并不是所有的事情都可以通过“白描” 来解决，有时候你用对了一个专业词汇就能够提升 90% 的效果，而正常情况下我们不太可能对所有领域的专业知识都精通，所以用不对词汇，写不好提示词几乎成了常态。

于是我们好像很崇拜那些把提示词写的很好的人，纷纷效仿、分享、学习提示词，比如李继刚，他写的提示词用到了编程语言 Lisp 的一些特点。Lisp? 别说外行了，就是专业的程序员也很少有会的了。

那我们怎么办呢？ 就像你明明来到了装有宝藏的房间大门前，却说不出打开门的咒语，一个劲儿地在那儿：“阿巴阿巴” ，像个傻子一样。

promptpilot 给了我答案，那就是 ：**“用魔法打败魔法，最终实现 prompt 袪魅”**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/004-ee5959c4.png)

这里我输入了一行自己写的 prompt： “判断舆论的内容对出行行业的影响”，点击 “生成 prompt” 就会在右边自己生成一个结构化的 prompt:

```html
你的任务是判断给定舆论内容对出行行业的影响。请仔细阅读以下舆论内容，并根据出行行业的特点进行评估。
舆论内容：
<public_opinion>
{{PUBLIC_OPINION}}
</public_opinion>
在评估舆论对出行行业的影响时，请按照以下步骤进行分析：
1. 仔细阅读整个舆论内容，明确其核心观点和主要信息。
2. 思考出行行业的各个方面，如交通方式、市场需求、企业运营、政策法规等。
3. 分析舆论内容可能对出行行业的这些方面产生的直接或间接影响。
4. 考虑舆论的传播范围、影响力和受众反应，以及这些因素如何放大或缩小对出行行业的影响。
5. 形成初步判断，并再次检查，确保没有遗漏重要细节。

在<思考>标签中详细分析舆论对出行行业的影响，考虑其可能涉及的各个方面。然后在<判断>标签中给出明确的影响判断结果，如“积极影响”“消极影响”“无明显影响”等。最后，在<解释>标签中详细解释你的判断理由。
<思考>
[在此详细分析舆论对出行行业的影响]
</思考>
<判断>
[在此给出明确的影响判断结果]
</判断>
<解释>
[在此详细解释判断的理由]
</解释>
请确保你的判断客观公正，并基于对舆论内容和出行行业的综合分析。如果舆论内容对出行行业的影响模棱两可，请在解释中说明你的考虑过程。

```

promptpilot 不但生成了结构化的 prompt，还自动提取出了变量 `{{PUBLIC_OPINION}}`。此外在现有结构化 prompt 的基础上还可以点击功能按钮持续优化。

这个功能总结来说就是：**“简单描述你的需求，一键生成结构化的 prompt，输入你的修改意见，即刻智能改写。也可以框选局部文字，精准调整每个细节，帮你初步获得一个不错的 prompt”**

不知道是不是我的错觉，因为最近一直在 vibe coding，所以用着用着 promptpilot 总感觉他们产品的很多功能可能就是 AI 写的，哈哈。

我们稍微想一想这个功能的实现原理。我给他一段自己写的 prompt，他给我一段丰富的结构化的 prompt，还能继续优化，这一看就是用提示词让 AI 对我的提示词进行了重写啊。 这不就是 “用魔法打败魔法” 吗？所以对 prompt 袪魅吧朋友们，也没啥难的，但我一直对 AI 是有警觉的，我的意思是工具你可以用，好的工具更可以用，你完全可以放心大胆的使用 promptpilot，但请你看一看这个名字里有个 **pilot**，领航员。看过拉力赛车吧，坐主驾旁边念路书的那哥们，很重要，但是没他人家主驾也能开车。《飞驰人生 2》中张驰在最终的比赛时，能不靠路书心不慌、面对使坏的对手大胆碰撞超车，赢得比赛的胜利,靠的是自己的经验和能力。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/005-95d20dd9.png)

promptpilot 或任何 AI 工具给你的东西，至少你要看一下，最好跟着他学习成长起来，如果渐渐地把自己的主动思考“让渡” 出去，最终你可能会成为个 “废物” ，最简单的提示词你都不会写了，这不是什么危言耸听，看看 《机器人总动员》中，远在宇宙飞船中的人类因为过度依赖机器人自己什么都不干变得又胖又无能的样子，那可能就是你的未来。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/006-bc4602c2.png)

### 调试 prompt

写好了 prompt 以后，我们还需要调试，点击“验证 prompt" , 进入调试界面：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/007-0a7321c5.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/008-edcf7ed5.png)

进入到调试页面后，我们可以设置变量、继续改写与优化 prompt、选择不同的大语言模型，并生成模型回答，总之就是不断调试并查看 prompt 的最终生成效果如何。

在你不断优化 prompt 的过程中无需关心版本的问题，系统会自动记录并管理提示词版本，你可以放心回退：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/009-f9ca6756.png)

### 评测

在完成调试后，接下来就该进行评测了。

评测的目的是：**在不同数据情况下验证 prompt 的效果如何，用各种 case 来检验 prompt 写的有没有问题，进而有针对性的进行优化。**

了解了目的，我想下一步你一定猜到了，那就是准备评测数据。

哎呀，准备数据，这就有点儿烦人了，但没关系，promptpilot 帮你做了一个“AI 生成变量” 功能，之前生成的 prompt 不是已经自动帮我们提取出了变量了吗？ 在此基础上，它还可以再帮我们生成变量的数据，这评测数据不就有了吗？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/010-d83c3d5d.png)

如上图所示，一键生成了三行数据，三个变量自动生成，我们只需要根据自己的实际情况稍微调整一下内容，再点击一下蓝色按钮就可以批量生成模型回答了。

当然你也可以自己做评测数据，根据要求上传个带变量名字段的文件就可以：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/011-cf72d1db.png)

你还可以对模型回答的结果进行评分，就是看回答的内容是否是按照你的提示词要求给的，质量如何。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/012-6231bebb.png)

评分甚至可以让 AI 自动评，评分规则也可以自己写或让 AI 帮你写。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/013-77217d97.png)

可能你注意到了有一列是 “理想回答”，我个人认为这一列非常重要，所谓定标准，就是要告诉人家什么是好的，一个问题问出去，如果你自己都不知道什么是好的答案，那 AI 其实也无能为力，它还没有那么聪明。这一点可能对于大部分 C 端用户不太好接受，因为就像你没有使用苹果手机前你是不知道你想要一个 iPhone 的，长期以来你被创造出来的需求所满足，习惯了，你觉得别人告诉你喜欢什么很正常，你自己不知道也很正常。

对，是很正常，那是因为场景不同。在面对不同客户，不同需求，不同场景下，我们的解决方案也不同。对于 C 端场景可能真的就是那样，商家可以创造需求，创造价值。但对于 B 端客户是需要解决问题、满足需求，不要乱创造你以为的价值。

在 B 端场景下，需求必须是明确的，解决的问题是清晰的，问题的答案是满意还是不满意也一定得是确定的。这是项目落地的必要条件！

就像考试的试题有标准答案一样，当有了标准答案，自然就有清晰的方向和路径来解题了。所以 “理想回答” 这一列的重要性不言而喻。无论对于评分还是后续的智能优化都有极大的帮助，原因很简单，目标有了，剩下的就是如何达到目标的事儿了。

### 智能优化

当你完成了评测，就可以点击右上角的 “智能优化”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/014-ea07c359.png)

大模型将对 Prompt 进行优化（模型回答和评分齐全的数据会用于智能优化），优化完成后你 将获得：1.AI 智能优化后的 Prompt；2. 使用新 Prompt 生成的回答与评分

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/015-dde0c2ab.png)

优化完成后，还将输出一份内容详实的优化报告

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/016-7a062f5a.png)

这一步其实还是对我最初的 prompt 进行优化，只不过因为有了更多的评测数据以及评分作为依据，优化方向更为明确，那么优化结果也一定更切合实际。

### 视觉理解

因为 prompt 是文本，promptpilot 最终生成、优化的也一定是 prompt 文本。也就是说输出是定死了的，就是“文本”，但输入可是多样的，除了文本的理解，promptpilot 还支持视觉理解。别误会，目前只支持图片。

我们来举一个具体的例子，我来一步一步操作一下整个流程。

首先我们创建提示词，我的初始提示词是：

```
“为了安全生产，你需要根据生产车间的图片，判断生产车间是否存在违规操作设备和未佩戴安全帽的情况，需要给出违规类别。”

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/017-a42fdace.png)

我看了下右边生成的 prompt 觉得变量名太长，于是我想改一下，把变量名改成 `image_url`，就直接鼠标选中变量名进行改写

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/018-fe1d27d0.png)

改写生成后的 prompt 是这样：

```
你是一位专业的图像分析专家，专注于安全生产领域。你的任务是根据提供的生产车间图片，判断车间是否存在违规操作设备和未佩戴安全帽的情况，并给出违规类别。

## 输入：
- 生产车间图片：{{image_url}}

## 判定标准与违规类别定义：
1. **`是否存在违规操作设备`**: （字符串，"是"/"否")
    - **判定**: 图像中是否存在工人违规操作设备的情况？
    - "是": 至少有一人正在违规操作设备。
    - "否": 无人违规操作设备，或者图像中无人操作设备。
    - **违规类别**: 若判定为“是”，违规类别标记为“违规操作设备”。

2. **`是否存在未佩戴安全帽`**: （字符串，"是"/"否")
    - **判定**: 图像中是否存在工人未佩戴安全帽的情况？
    - "是": 至少有一人未佩戴安全帽。
    - "否": 所有人都佩戴了安全帽，或者图像中无人。
    - **违规类别**: 若判定为“是”，违规类别标记为“未佩戴安全帽”。

## 输出格式：
请按照以下 JSON 格式输出你的判断结果。所有字段的值必须是字符串 “是” 或 “否”，违规类别若存在多个以逗号分隔，若不存在违规则标记为“无”。
{
    "是否存在违规操作设备": "是",
    "是否存在未佩戴安全帽": "否",
    "违规类别": "违规操作设备"
}

```

接着我们开始调试这个视觉理解的 prompt：新建一个内容理解任务，点击加号![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/019-1f5bd5bd.png)

复制之前改写好的完整 prompt 到调试 prompt 栏里面

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/020-5dc1cb27.png)

上传一个图片数据，这里采用 url 上传，并点击确定

```
https://img0.baidu.com/it/u=1094762033,1331895175&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=561

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/021-1939cf50.png)

选择 target model，即：推理模型，多模态选择带 thinking 的模型

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/022-8991229e.png)

保存并生成模型回答

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/023-93c40e1a.png)

获取理想回答：平台对同一个 case，提供了不同模型回答的结果给用户参考，用户可以自由选定好的答案，并基于选定的答案进行反馈拿到理想回答。 这里作为示例，取模型回答 2 的结果，并点击应用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/024-aa13ecd8.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/025-28ea38ed.png)

感觉他的思考过程太重复啰嗦了。因此做如下反馈：

```
思考过程简洁一点

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/026-dd6cf3e7.png)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/027-a919af39.png)

然后就可以保存并添加到评测集了。后面就是添加评测数据，你可以一行一行编辑，也可以直接上传个文件 ，比如

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/028-85569aff.png)

最终的效果类似这样：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/029-65e23efc.png)

然后就可以按照前文一步一步地进行 prompt 调优、打分、智能优化并生成优化报告了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/030-8521df33.png)

你看，总之，图片它也是能够理解的，甚至还有更复杂的任务也可以（不过还处于 beta 状态），比如在一个复杂场景下检查人数：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/031-a5d619a8.png)

### promptpilot 使用流程

前文写的内容有点儿多，这里我们总结一下 promptpilot 的使用流程，我们从官方文档中找个图来说明一下

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/032-926a6334.png)

初看可能有点儿复杂，但只要你真正用几回 promptpilot 再看这个图就会感觉无比的清晰了。

我们通过视频再快速回顾一下 promptpilot 的核心功能

已关注

Follow

Replay Share Like

Close

**观看更多**

更多

*退出全屏*

[](javascript:;)

*切换到竖屏全屏**退出全屏*

小盒子的技术分享已关注

[](javascript:;)

Share Video

，时长01:35

0/0

00:00/01:35

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

01:35

01:35

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

不止于工具：PromptPilot如何将AI开发从“手工作坊”推向“工业时代”？

观看更多

转载

,

不止于工具：PromptPilot如何将AI开发从“手工作坊”推向“工业时代”？

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

## 提示词工程产品对比

### 横向对比

其实还有其他的主流的提示词工程解决方案，比如：

-   Azure Prompt Flow（微软）
-   Vertex AI Studio（谷歌）
-   Amazon Bedrock Prompt Playground（亚马逊）

篇幅限制，我就不一一介绍了，这里简单介绍一下 Vertex AI Studio，通过对比，你会对 PromptPilot 的水平有更深刻地了解。

Google 家的 Vertex AI studio 提供了一个直观界面，让你能够以低代码或甚至无代码的环境来构建 GenAI 应用，你能通过 Prompt, 连接后台，最后反馈结果。

关于提示词工程部分，它的核心功能有：零次提示（Zero-shot prompting）、单次提示（One-shot prompting）和少量提示（Few-shot prompting）。

-   零次提示：是指在不提供任何例子的情况下，直接向模型发出请求，使其适应特定的行为。
-   单次提示：是指向模型提供单个任务示例，以此来引导模型的输出。
-   少量提示：则是提供少量的任务示例。

然后就没有然后了，对，就这些，界面很 google 很简单。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/033-31959af9.png)

我看了一下 Azure Prompt Flow 和 Amazon Bedrock Prompt Playground 感觉产品逻辑和 Vertex AI studio 差不多。

你可能已经发现，与 PromptPilot 相比，谷歌、微软、亚马逊这三大云服务商在提示词工程上的产品功能显得相对单薄。这主要是因为它们的产品方向和侧重点有所不同： **三大云把 Prompt 工程塞进整条 LLM DevOps 流水线，它们把 Prompt 当作 LLM 应用流水线里的一环，仅提供“写＋测”或“写＋存＋跑”，深度要靠开发者自己拼接脚本或流水线。 而 PromptPilot 把“提示词”当作核心产品做了纵深。把  “提示词” 的 写 → 调 → 测 → 版本管理 等全部动作做了深耕。**

因此，当你的主要痛点就是“写好提示词”而非“布好全链路”，PromptPilot 会显得顺手；而当项目需要管部署、监控、成本、接第三方工具时，Prompt Flow 等全栈 IDE 的价值就会凸显出来。

而类似三大云厂商做的那种 LLM 流水线产品可以在**火山引擎**上找到，在 AI 时代，阿里云、腾讯云、火山引擎是我比较喜欢的国内云厂商三巨头。之前也用过华为云，它的市场占有率也很高，但可能客户群体和技术方向的问题，在 AI 时代，它的声音并不多。

### 纵向对比

从深耕提示词工程的角度来说，PromptPilot 身上也有不少优秀产品的影子，比如：promptlayer、Prompt Optimizer 。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/034-54d01c66.png)

有这么多优秀的产品，足以见得提示词工程的需求在一段时间内还是存在的，需要被满足。但对比多家产品，我觉得 PromptPilot 目前做的是最好的，没有之一。

## 最后

PromptPilot 的最大价值在于通过 自动“写+测+改” 把写 Prompt 这件“小事” 完全工程化产品化，让使用者几乎零门槛的使用，无论对于开发者还是小白都非常友好，我猜测将来甚至可以直接集成到企业级 AI 开发流水线中。

另外不得不提一下的是，豆包大模型是商业模型，那么火山引擎作为一个云平台一定会引导用户用自家的大模型，所以构建“护城河” 这个事儿是一个常规操作，很正常。目前除了自家的豆包大模型，promptpilot 也支持 DeepSeek 等其他模型。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-03-bu-zhi-yu-gong-ju-promptpilot-ru-he-jiang-ai-kai-fa-cong-sho/035-73e6c471.png)

我相信未来在模型使用上，火山的策略不会那么激进，而会采用融合、共赢，权重优先的方式，长期允许多模型共存，但一定会在自家模型的推广和销售上大做文章。

最后，我想说，在 AI 领域，未来一定会有越来越多的新产品出现，而所有这些产品都像是一个时代的注脚，你需要明白的是，时代不同了，AI应用开发正在从“炼丹师”式的个人英雄主义，走向体系化的工业生产阶段。在这个过程要解决的问题和相应的机会会很多，但只有真正务实地的解决问题的团队才能够赢得未来，因为他们行动深刻表达了四个字：**“价值创造”**。
