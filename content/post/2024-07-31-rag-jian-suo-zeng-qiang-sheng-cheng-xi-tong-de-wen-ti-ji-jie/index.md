---
title: "RAG（检索增强生成）系统的问题及解决思路"
slug: 2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie
description: "引言随着大型语言模型（LLM）的出现，人们对更好搜索能力的需求催生了新的搜索方法。"
date: 2024-07-31T03:03:39.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/ZabUL99zhuRwVqbn73aUIQ
categories:
  - AI
tags:
  - LLM
  - RAG
  - Embedding
---
## 引言

随着大型语言模型（LLM）的出现，人们对更好搜索能力的需求催生了新的搜索方法。虽然基于关键字的传统搜索方法和推荐系统在某种程度上是有效的，但 LLM 的出现将搜索能力提升到了一个新的水平。尽管这个话题相对较新，但已经有很多研究成果发表。在这篇文章中，我将尝试总结一些流行的技术，这些技术被用来提升检索增强生成（RAG）系统的性能和输出的相关性。

尽管我会尽量涵盖许多好的想法，但实际上还有更多方法可以用来提高 RAG 系统的质量，比如**利用知识图谱来增强 RAG**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/001-b0153d62.png)

## RAG 存在的问题

**RAG 的概念是由 Lewis 于 2020 年在这篇论文中提出的**：https://arxiv.org/abs/2005.11401?trk=article-ssr-frontend-pulse\_little-text-block。

他建议在知识密集型任务中，利用 LLM 从源文档中检索相关信息，并结合 LLM 理解这些信息的能力来生成搜索结果，这样做是非常有益的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/002-215e1526.png)

简单来说，RAG 系统的基本步骤包括：

1.  用户查询信息；
2.  系统搜索可能包含查询答案的文档并进行检索；
3.  将检索到的文档作为上下文，与搜索查询一起输入 LLM；
4.  LLM 理解提示，吸收文档中的信息，并生成查询的答案。

这个概念解决了一些问题，否则在某些有限数据上训练的 LLM 可能会遇到困难。例如，如果查询中提到的信息是 LLM 从未接触过的，那么提示可能会导致错误的答案。LLM 可能没有查询所需的详细信息。此外，LLM 有时会生成不正确的信息（**称为幻觉**）。如果使用的 LLM 没有根据企业内部信息进行训练，那么针对企业特定问题的查询也可能导致错误答案。

### 幻觉和准确性问题

在研究 RAG 系统的初期，为了增强搜索结果，提出了一种解决方案，即使用额外的文档（例如特定于组织、特定于主题或仅使用最新信息）对 LLM 进行微调。这种技术被称为 **fine-tuning** 。然而，由于多种原因，这一想法很快失去了动力。使用额外文档来训练 LLM 的成本非常高，并不是每个组织都有资源和时间来管理额外的培训。即使组织有能力进行这样的培训，使用最新文档进行重新培训的需求也会变成一个重复的过程，组织将不得不参与不经济的持续 LLM 培训。

RAG 研究的重点是回答以下问题：

1.  检索什么；
2.  如何检索；
3.  检索多少；
4.  如何在检索之前存储这些数据；
5.  如何将检索到的数据馈送到 LLM，包括馈送数据的顺序；
6.  如何生成输出；
7.  如何在最终选择显示答案之前对答案进行排序（如果答案有多个）。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/003-7df18d67.png)

最基本和最早的 RAG 框架专注于索引、检索和生成。索引涉及在输入 LLM 之前如何收集、清理、存储和准备数据。数据可以是多种格式，包括 doc、pdf、jpg、png、mp4 等。数据首先被转换为明文，然后文本被分成小块，比如几个单词、句子或段落，称为 **chunks ，因此称为 process of chunking**。这些块使用标准嵌入模型（embedding）转换为向量表示。最后，文本块和相关向量嵌入在向量数据库中作为键值对进行索引。

检索过程则是用户输入查询作为提示，并将查询转换为向量表示。通过相似度索引，系统识别与查询相似的文档的向量表示，并检索前 K 个文档。

查询和前 K 个文档被馈送到 LLM 系统，以生成查询的适当答案。根据模型的训练，RAG 系统将利用模型的参数记忆来生成答案，或者使用提供的文档来同化和生成答案。

然而，**上述简单化的方法存在一些弱点。检索过程的精度可能较低，这意味着一些检索到的文档可能是错误的。系统可能无法识别所有相关文档，导致召回率低。** 此外，RAG 系统需要访问最新的文档。如果文档数据库不是最新的，系统将无法给出最佳答案。在生成方面，系统可能会面临更多问题。可能会出现幻觉，如果没有足够的护栏，系统可能会生成不相关、有毒、有偏见或令人反感的内容，这可能会破坏目的。此外，在某些情况下，当检索到不相关的信息并将其提供给 LLM 时，系统可能会生成脱节、重复或不相关的答案。检索到的文档中的语气、时态和第一/第三人称写作风格的差异也会混淆 LLM，导致生成次优答案。

在一些简单的 RAG 系统中，输出可能过度依赖于增强的信息，可能只输出输入上下文的提取，而不是合成以获得更好的输出。此外，选择的前 K 个文档应该不超过上下文窗口的大小，否则可能会引入噪音并失去对相关信息的关注。在一篇论文中(https://arxiv.org/pdf/2310.05029)，作者提出了一种减少上下文窗口但保持高生成有效性的方法。

在一种称为 MemWalker 的方法中，上下文窗口被转换为文档连接摘要节点的树。当 LLM 收到查询时，模型遍历树以识别对回答查询有用的相关摘要。一旦获得相关摘要，模型就会执行查询以生成答案。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/004-682715e1.png)

## 最佳实践

为了设计最佳的 RAG 系统并获得最佳结果，以下实践将有所帮助。

**改进索引**：更好的文档分块可以提高索引的质量。将文档分解为合适大小的块将有助于识别正确的嵌入和索引。存在许多合适大小的分块策略。例如：

1.  所有块都具有相同的大小，例如 100 个标记；
2.  每个页面、段落或句子将是一个块；
3.  混合和匹配，即包括各种大小。

尽管较小的块大小可能会提高检索的准确性，但转换为嵌入和存储的成本会迅速上升。优化分块以匹配 LLM 的功能也很重要。一些 LLM 有更长或更短的接触长度限制。RAG 任务的模式也会影响分块策略。如果 RAG 的目标是回答问题与搜索文档，则分块大小会有所不同。将元数据添加到数据中，比如日期、目的、作者、文档风格（报告、书籍、博客等）、原始语言等，将有助于提高查询的准确性。

**搜索和检索**：除了检索相似的向量之外，我们还可以使用关键字和其他元数据来检索文档，从而丰富馈送到 LLM 的文档上下文。传统的搜索方法也可以用来检索文档。语义搜索也可以用来增强搜索的有效性。当检索到多个文档时，需要使用一些排名机制，以便在生成之前只向系统提供前 K 个文档。此外，在某些情况下，从业者会使用搜索引擎（或其他类似的）系统来检索最新信息，以提供给 RAG 系统。

**图数据库**：为了检索正确的文档，并非所有从业者都喜欢使用向量搜索。一些从业者使用图数据库来查找与相关文档的关系。在图数据库中，文档及其关系被转换为节点和边。这种方法可以更快地检索并提高检索到的文档的相关性。

**微调 LLM**：在某些情况下，从业者通过微调相关信息的 LLM 来提高检索的有效性。例如，在医疗保健应用中，如果 LLM 被微调以理解医疗保健信息，然后用于生成答案，LLM 可以更好地理解提供的上下文，因为它已经针对相关信息进行了微调。

**prompt 优化**：许多用户输入的提示可能包含很多噪音，导致模型理解效率低下。可以使用一个小型 LLM 来清理和重写提示，以增强有效性。这种清理突出了查询的要点，消除了冗余，并压缩了提示的大小。一些从业者也通过使用提示摘要来完成提示清理。

**RAG 融合**：在一篇优秀的博客中，作者谈到了 RAG 融合（https://towardsdatascience.com/forget-rag-the-future-is-rag-fusion-1147298d8ad1），其中从原始提示生成多个提示。这些多个提示突出了焦点的不同视角，也增强了主查询的焦点区域，以丰富提示以获得更好的答案。对于多个查询，可以应用重新排名器来选择更好的查询。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/005-9d1c82eb.png)

**查询路由**：组织将其数据存储在多个数据库中。例如，向量数据库将包含向量化的数据。类似地，还有图形数据库和关系数据库，后者将包含结构化数据。最新和流数据可以收集在高质量的数据湖中。不同类型的数据，如文档、PDF、JPEG、MP4 等，存储在不同的数据库中。当 RAG 融合创建多个查询时，将查询路由到正确的数据源集以进行高效检索是从业者需要做的另一个步骤。

**查询重写**：用户通常不擅长编写好的、优化的查询。为什么不借助 LLM 重写查询以提高其质量，从而提升检索质量呢？

**RAG 和 GAR**（检索增强生成和生成增强检索）：在一篇论文中（https://arxiv.org/pdf/2305.15294），作者提出了一种创新的方法，迭代增强查询并将其输入 RAG 系统以生成更好的答案，这反过来又用于创建更好的查询，增强查询用于生成更好的答案。

**微调嵌入模型**：使用基于相关数据进行微调的嵌入模型来生成提示和存储数据的嵌入，可以提高检索系统的有效性。例如，在单独根据维基百科数据训练的准系统 LLM 和根据医疗保健信息进行微调的相同模型之间，后者会创建更好的嵌入。

**检索-读取 vs 检索-生成-再读取**：在另一篇论文中(https://arxiv.org/pdf/2209.10063)，作者建议对传统的 LLM 检索和阅读以生成答案的顺序进行改进。在他们的 GenRead 方法中，作者建议首先从检索到的文档中创建上下文，并提供清理后的上下文版本以生成答案。这减少了冗余和噪音。

**假设文档嵌入**：在论文中的另一种引人注目的方法中，作者主张创建一个假设文档，声称包含查询的答案。这个假设文档可能包含答案附近的信息，有时甚至可能有错误。然后这个文档被编码到嵌入向量中。在向量化文档数据库中搜索这个假设文档向量的邻域向量。检索到的向量被输入 LLM 以获得准确的答案。这种方法被称为假设文档检索。作者发现这种方法在各种任务和语言中显示出惊人的准确结果。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-31-rag-jian-suo-zeng-qiang-sheng-cheng-xi-tong-de-wen-ti-ji-jie/006-c5f7030d.png)

**父文档检索器**：在一个博客中，作者主张创建子文档（较大文档的较小块）并对其进行向量化。当子向量被检索时，相关的父文档被访问并馈送到 LLM 中以获得更好的查询响应。

**摘要**：一些从业者还建议在将文档输入系统之前使用摘要。例如，如果检索结果是多个文档，为了节省成本，可以将检索到的文档的摘要版本输入系统，以提供更好的上下文并减少幻觉的可能性。

**“中间迷失”（Lost in the Middle）综合症**：当 LLM 被输入更大的上下文窗口时，它们会表现出一种称为“迷失在中间”的行为，LLM 会更多地关注开始和结束时可用的信息，而中间部分则可能被忽视。为了避免 LIM 综合症，从业者可以在输入系统之前在几次迭代中重新排列数据。

**多样性排名**：文档将按照其内容多样性的顺序提供。文档越多样化，它们就越相互靠近，让 LLM 得到信息的分布。这种方法希望 LLM 生成一个更加平衡和多样化的答案，更接近查询的要求。这里有“中间迷失”（LIM）排名器和多样性排名器的实现。请查看 Cohere Re-ranker 的相关内容。此外，请查看关于检索器和重新排名器的精彩博客。

## 参考

-   https://huyenchip.com/2023/04/11/llm-engineering.html?trk=article-ssr-frontend-pulse\_little-text-block
-   https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1?trk=article-ssr-frontend-pulse\_little-text-block
-   https://blogs.nvidia.com/blog/category/enterprise/deep-learning/
-   https://www.llamaindex.ai/blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b?trk=article-ssr-frontend-pulse\_little-text-block
-   https://github.com/langchain-ai/langchain/blob/master/cookbook/Semi\_structured\_multi\_modal\_RAG\_LLaMA2.ipynb?ref=blog.langchain.dev&trk=article-ssr-frontend-pulse\_little-text-block
-   https://python.langchain.com/v0.1/docs/modules/data\_connection/retrievers/multi\_vector/?ref=blog.langchain.dev&trk=article-ssr-frontend-pulse\_little-text-block
-   https://blog.langchain.dev/semi-structured-multi-modal-rag/?trk=article-ssr-frontend-pulse\_little-text-block
-   https://www.anyscale.com/blog/a-comprehensive-guide-for-building-rag-based-llm-applications-part-1?trk=article-ssr-frontend-pulse\_little-text-block
