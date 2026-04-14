---
title: "火山引擎 + DeepSeekR1 + ChatWise"
slug: 2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise
date: 2025-02-14T04:59:28.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/cover.jpg
original_url: https://mp.weixin.qq.com/s/AjbgxRxJsgPPH2xiy7hEZQ
categories:
  - AI
tags:
  - LLM
  - Prompt
  - DeepSeek
---
## 服务器繁忙

由于 DeepSeekR1 是开源的，只要有算力资源就可以独立部署，所以最近各个公司都在推出自己的 DeepSeek R1 模型调用服务。

由于 DeepSeek 官网很不稳定，经常出现 “服务器繁忙”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/001-a93f39ce.png)

所以，不得已，得找备用方案。

所谓 “备用方案” 无非两种形式，一种是产品化的，就是人家已经做好功能页面了，你可以像在 DeepSeek 官网一样直接输入 `prompt` 使用。

提供这种网站或服务的公司越来越多了，原因也很简单，前面说过了，有算力就可以自己部署。先免费开放使用，至少可以借这波流量赚一批用户。

另外一种就是提供 API 服务，用户通过 API 调用。其实只要能够提供这种服务，再稍微加点儿功能就可以提供前面讲的第一种形式的服务。当然，很多公司也是同时提供两种服务，尤其是各大云厂商，如阿里云、腾讯云、火山引擎等等。

### API 不稳定

DeepSeek 自己当然也提供 API 服务，在去年大模型价格战时被称为 “模型界的拼多多” ，可见之前他们家的费用有多低。

不过最近用的人多了，人家 **“涨价了”**，也合情合理，就这你想用还用不了呢。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/002-68c8dc8d.png)

不能充值了。你说气不气。有钱没处花，哈哈。

就算之前充过值，还有余额的，官网 API 的使用体验也好不到哪儿去，因为它很不稳定：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/003-091334a9.png)

## 找个速度快的，稳定的

折腾了一圈儿下来，我发现比较靠谱的产品就是：360 的纳米 AI（https://bot.n.cn/）

最大的优势是：速度快，没有明显的等待时间。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/004-6c4f1c45.png)

其他的，提供类似这种产品化服务的还有几个，比如 ：“秘塔ai” 、“知乎直达” 、“askmanyai” 、“腾讯元宝” 。这些产品都接入了 DeepSeek R1 模型，和自家的产品做了集成。

总体看下来各有千秋吧，你可以自己测试对比一下回复质量。整体对比下来，出现幻觉的情况也是不少的，尤其是在多轮对话的情况下。

**一个确定的结论是：在想让模型生成创造性内容的情况下， R1+联网搜索 同时打开后，其他所有产品的回复质量都不如 DeepSeek 官方的高。**

但是官网不稳定啊，要了命了，所以还是得找找 “平替”。

又找了一圈儿，经过测试发现火山引擎提供的服务又快又稳定，有点儿意思！

## ChatWise

ChatWise 是一个本地的模型应用客户端，可以配置本地 ollama 模型，当然也可以通过各模型厂商的 API 来配置使用。体验了一阵子后觉得很不错就氪金了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/005-63298eef.png)

它支持 “联网搜索”、“Artifacts” 等功能

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/006-2c91b06e.png)

## ChatWise + 火山引擎 + DeepSeek R1

既然火山的服务这么好，当然要体验一下啦，而且它会免费送 50 万 tokens。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/007-6c1e7208.png)

这里我要说一下我浪费时间的两个地方，当然这只是我遇到的问题，也许你在折腾的时候比较顺利。

### 第一，入口

来到火山引擎后，前面的注册、登录、实名认证过程我就不多说了。这一步重要的是找到入口，好像也有人像我一样 “在门口转悠半天，不知道从哪里进入”。

这是入口链接：火山方舟（https://console.volcengine.com/ark）

然后点击左侧菜单的 “在线推理”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/008-1cc3d116.png)

然后点击，创建推理接入点：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/009-04eeb366.png)

然后自己起个名字：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/010-0751a885.png)

模型我选择的是 R1 ，当然你也可以选别的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/011-1edf87f4.png)

创建过程还是很快的，创建成功后，列表上会有显示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/012-bf9f55e3.png)

接下来，就是创建一个 API KEY ，然后放到 ChatWise 配置使用了。

### 第二个，ChatWise 配置

这是我遇到的第二个问题，我在这里浪费了不少时间

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/013-4956468f.png)

可以看到 ChatWise 是直接自定义添加 Provider 的，至少 API BaseURL,我是从文档示例中找到的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/014-65ca8e7e.png)

这个页面是通过点击列表页的 “API 调用” 进入的

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/015-29db1285.png)

然后我下一步就遇到问题了，浪费了好多时间，我填好了 API Base URL和 API Key 以后就点击 “Fetch” ,结果 404，折腾了好半天才反应过来，要点击那个 “New” 自己添加模型，可能是因为使用 google gemini 的时候是自己 Fetch 出来了，有点儿路径依赖，大脑这时候秀逗了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/016-d2e4aa08.png)

这一步最重要的是 ModelID 要填对

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/017-1388db7c.png)

这个 ID 在上图的列表页，接入点名称的下方，人家还贴心的做了复制功能：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/018-d40d541a.png)

### 开始使用

我把我遇到的问题发出来，希望其他人少踩坑。

上面的过程配置完毕后就可以直接使用了。

在 ChatWise 中，尽情发挥吧。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/019-b7d54c95.png)

可以看到我打开了联网功能，点击搜索文章的那个区域，可以看到具体从网络上查找了哪些内容：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-02-14-huo-shan-yin-qing-deepseekr1-chatwise/020-0975d0b0.png)
