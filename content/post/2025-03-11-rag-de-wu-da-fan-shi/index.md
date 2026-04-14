---
title: "RAG 的五大范式"
slug: 2025-03-11-rag-de-wu-da-fan-shi
date: 2025-03-11T10:27:02.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/WWL1tV2WJI4Ifit61EYCbg
categories:
  - AI
tags:
  - LLM
  - RAG
  - Agent
  - Embedding
  - 设计模式
---
## Naive RAG (朴素 RAG)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/001-60de0142.png)

### 定义

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/002-c069d345.png)

### 核心思想

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/003-f2404cdd.png)

-   将文档分块、向量化并存入向量数据库
-   用户查询也向量化，并在数据库中检索最相似的文档块
-   最后，将查询和检索到的文档块一起输入 LLM 生成答案

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/004-f551e788.png)

### 优缺点分析

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/005-1c4d478f.png)

## Advanced RAG (高级 RAG)

### 定义

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/006-d415781b.png)

### 核心思想

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/007-a5446396.png)

-   化索引（如滑动窗口、细粒度分割、元数据利用）
-   优化查询（如查询重写、扩展、转换）
-   优化检索结果（如重排序、过滤、压缩）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/008-5927350d.png)

### 优缺点分析

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/009-84a4971c.png)

## Modular RAG (模块化 RAG)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/010-ffc39c97.png)

### 定义

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/011-1f2ebc0a.png)

### 核心思想

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/012-fc3e63a8.png)

-   模块化设计，每个模块可独立实现和替换
-   支持迭代、自适应、递归等多种检索模式
-   通过组合不同模块来适应不同任务需求

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/013-9b25e145.png)

### 优缺点分析

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/014-e97e7e0b.png)

## GraphRAG (图 RAG)

### 定义

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/015-06595be8.png)

### 核心思想

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/016-fe7dfaec.png)

-   建基于图的文档索引
-   利用图数据库和查询语言进行检索
-   将检索到的图信息与文本信息结合，输入 LLM 生成答案

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/017-7e61ba90.png)

### 优缺点分析

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/018-52ac029c.png)

## Agentic RAG (智能体 RAG)

### 定义

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/019-daf01754.png)

### 核心思想

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/020-4287ac73.png)

-   使用 AI 代理管理 RAG 流程
-   利用代理设计模式（反射、规划、工具使用、多代理协作）
-   代理可动态协调 RAG 组件，进行推理，并根据上下文采取行动

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/021-3a77c348.png)

### 优缺点分析

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/022-2d5344d3.png)

## 总结

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-03-11-rag-de-wu-da-fan-shi/023-ef9d66f2.png)

## 参考

-   https://arxiv.org/html/2407.21059v1
