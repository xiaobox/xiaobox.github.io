---
title: "大模型开发全景图（LLM Deployment Landscape）"
slug: 2025-10-31-da-mo-xing-kai-fa-quan-jing-tu-llm-deployment-landscape
date: 2025-10-31T13:25:17.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-31-da-mo-xing-kai-fa-quan-jing-tu-llm-deployment-landscape/cover.jpg
original_url: https://mp.weixin.qq.com/s/GZKtcU-PO1IaNqwSbVtmfw
categories:
  - AI
tags:
  - Spring
  - LLM
  - Codex
  - Agent
  - Gemini
  - LangChain
---
![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-10-31-da-mo-xing-kai-fa-quan-jing-tu-llm-deployment-landscape/001-7fe920b1.png)

以下分组依据开源生态图Open Source LLM Development Landscape进行整理，原图及项目集合参考：https://github.com/antgroup/llm-oss-landscape   每个条目后附上官网/项目页链接，便于你点开了解。

也可以直接打开 https://antoss-landscape.my.canva.site/  （点击图标就可以直接跳转）

# AI Agent

## **AI Coding**

●Gemini https://ai.google.dev/gemini

●Continue   https://www.continue.dev/

●OpenHands https://github.com/All-Hands-AI/OpenHands

●marimo https://marimo.io/

●Codex CLI https://github.com/microsoft/Codex-CLI

●avante.nvim  https://github.com/yetone/avante.nvim

●Cline  https://github.com/cline/cline

●codename goose  https://block.github.io/goose/

## **Chatbot & Knowledge Management**

●Cherry Studio  https://github.com/CherryHQ/cherry-studio

●Open WebUI  https://openwebui.com/

●Lobe Chat https://github.com/lobehub/lobe-chat

●LibreChat https://github.com/danny-avila/LibreChat

●AstrBot  https://github.com/AstrBotDevs/AstrBot

●SiYuan（思源笔记）https://b3log.org/siyuan/

●Docling https://github.com/DS4SD/docling

●Anything LLM  https://github.com/Mintplex-Labs/anything-llm

## **Embodied Agent**

●GENESIS https://genesis-embodied-ai.github.io/

●xiaozhi-esp32 https://github.com/78/xiaozhi-esp32

## **Agent Workflow Platform**

●Dify  https://dify.ai/

●n8n https://n8n.io/

●RAGFlow https://github.com/infiniflow/ragflow

●Langflow  https://www.langflow.org/

●Mastra https://mastra.ai/

●Activepieces  https://www.activepieces.com/

●MaxKB  https://github.com/1Panel-dev/MaxKB

●FastGPT  https://github.com/labring/FastGPT

●Flowise AI  https://flowiseai.com/

## **Agent Tool / Dev Kit / Protocol**

●LiteLLM  https://docs.litellm.ai/

●Supabase  https://supabase.com/

●Vercel  https://vercel.com/

●ComfyUI  https://github.com/comfyanonymous/ComfyUI

●mem0  https://mem0.ai/

●Browser Use  https://github.com/browser-use/browser-use

●Model Context Protocol  https://modelcontextprotocol.io/

## **Agent Framework**

●LangGraph  https://langchain-ai.github.io/langgraph/

●Pydantic AI  https://ai.pydantic.dev/

●LangChain  https://www.langchain.com/

●Spring AI  https://spring.io/projects/spring-ai

●LlamaIndex  https://www.llamaindex.ai/

●Semantic Kernel  https://github.com/microsoft/semantic-kernel

●Pipecat  https://github.com/pipecat-ai/pipecat

●AutoGen  https://github.com/microsoft/autogen

●LiveKit Agents  https://livekit.io/agents

## **Multi-agent Framework**

●agno  https://github.com/agno-agi/agno

●CAMEL-AI  https://github.com/camel-ai/camel

●OpenAI Agents SDK  https://platform.openai.com/docs/agents

●ELIZA.OS  https://github.com/elizaOS/eliza

●crewAI  https://www.crewai.com/

# AI Infra

## **Model Training, Development and Serving**

**Serving（Inference Deploy）**

●Ollama  https://ollama.com/

●Xorbits Inference  https://github.com/xorbitsai/inference

●ramalama  https://github.com/containers/ramalama

●GPUStack  https://github.com/GPUStack/GPUStack

**Inference Engine**

●vLLM  https://vllm.ai/

●SGLang  https://github.com/sgl-project/sglang

●TensorRT-LLM  https://github.com/NVIDIA/TensorRT-LLM

●OpenVINO  https://docs.openvino.ai/

●llama.cpp  https://github.com/ggml-org/llama.cpp

**Training / Fine-tune**

●SWIFT（ModelScope Swift）https://github.com/modelscope/ms-swift

●Unsloth  https://github.com/unslothai/unsloth

●LLaMA-Factory  https://github.com/hiyouga/LLaMA-Factory

●VERL  https://github.com/volcengine/verl

●OpenRLHF  https://github.com/OpenRLHF/OpenRLHF

**Training Platform / Distributed Training**

●PyTorch  https://pytorch.org/

●PaddlePaddle  https://www.paddlepaddle.org.cn/

●Megatron-LM  https://github.com/NVIDIA/Megatron-LM

●DeepSpeed  https://github.com/microsoft/DeepSpeed

●NVIDIA NeMo  https://github.com/NVIDIA-NeMo/NeMo

**Distributed Compute**

●Ray  https://www.ray.io/

●Apache Spark  https://spark.apache.org/

●Volcano  https://volcano.sh/en/

**AI Compiler**

●Triton  https://github.com/triton-lang/triton

●Modular  https://www.modular.com/

**AI Kernel Library**

●RAPIDS  https://rapids.ai/

●TransformerEngine  https://github.com/NVIDIA/TransformerEngine

●FlashInfer  https://github.com/flashinfer-ai/flashinfer

●MLX  https://github.com/ml-explore/mlx

●FlashAttention  https://github.com/Dao-AILab/flash-attention

●CUTLASS  https://github.com/NVIDIA/cutlass

●DeepEP  https://github.com/deepseek-ai/DeepEP

## LLMOps

●MLflow https://mlflow.org/

●1Panel https://github.com/1Panel-dev/1Panel

●Langfuse https://langfuse.com/

●Weights & Biases https://github.com/wandb/wandb

●Opik https://github.com/comet-ml/opik

●Phoenix https://github.com/Arize-ai/phoenix

●MLRun https://www.mlrun.org/

●promptfoo https://github.com/promptfoo/promptfoo

●Dagger https://dagger.io/

## AI Data

**Data Labeling**

●Label Studio https://labelstud.io/

●CVAT https://cvat.ai/

●Vespa https://vespa.ai/

**App Framework**

●Streamlit  https://streamlit.io/

●Gradio https://gradio.app/

**Data Integration**

●Apache Airflow https://airflow.apache.org/

●Airbyte  https://airbyte.com/

●Dagster https://dagster.io/

**Vector Storage & Search**

●Elasticsearch https://www.elastic.co/elasticsearch/

●Milvus https://milvus.io/

●OpenSearch https://opensearch.org/

●Chroma https://www.trychroma.com/

●Weaviate https://weaviate.io/

●Qdrant https://qdrant.tech/

**Data Governance**

●Apache Iceberg https://iceberg.apache.org/

●Apache Paimon https://paimon.apache.org/

●DataHub https://datahubproject.io/

●Delta Lake https://delta.io/

●OpenMetadata https://open-metadata.org/

●Apache Gravitino https://gravitino.apache.org/

●Apache Hudi https://hudi.apache.org/
