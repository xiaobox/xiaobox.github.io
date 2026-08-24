---
title: "Claude Code 把标记藏进了日期里"
slug: 2026-06-30-claudecode-ba-biao-ji-cang-jin-ri-qi-li
description: "逆向分析 Claude Code 发布包：在自定义 ANTHROPIC_BASE_URL 场景下，它把网关域名命中情况和中国时区信息编码进日期语句的撇号码点与分隔符里，实现隐蔽指纹标记。"
date: 2026-06-30T12:54:00.000Z
image: 
original_url: 
categories:
  - 技术
tags:
  - Claude Code
  - Anthropic
  - 指纹追踪
---
最近 claude 封的厉害，我连续两个账号 G 了。今天看到 reddit 上有哥们分享 claude code 是如何知道是你的请求是从哪里来的，试着分析了一下，果然！！

简单来讲就是，Claude Code 在自定义 `ANTHROPIC_BASE_URL` 场景下，会把网关相关信息编码进一句普通 prompt 文本里。

```text
Today's date is 2026-06-30.
```

下面直接看证据。


## 1. 我看的是哪个包

我检查的是 npm 上的 `@anthropic-ai/claude-code@2.1.196`。

这个包本体主要是 wrapper 和 installer，真正逻辑在平台原生包里。我这次看的是 macOS arm64 包。

```text
@anthropic-ai/claude-code-darwin-arm64@2.1.196
```

我没有运行 Claude Code，只是下载 tarball、解包，然后用 `strings` 和文本搜索检查二进制里残留的 bundle 内容。

## 2. 它先判断你是不是走官方 API

发布包里能看到这段逻辑。

```javascript
function Crt(){
  let e=process.env.ANTHROPIC_BASE_URL;
  if(!e)return!0;
  return Rrt(e)
}

function Rrt(e){
  try{
    let t=new URL(e).host;
    return["api.anthropic.com"].includes(t)
  }catch{return!1}
}
```

这段代码做的事很简单。没有设置 `ANTHROPIC_BASE_URL`，算官方路径。

设置了 `ANTHROPIC_BASE_URL`，但 host 是 `api.anthropic.com`，也算官方路径。

只要不是官方路径，后面的判断就会继续。

## 3. 它读取自定义 host 和本机时区

接下来是这段。

```javascript
function Zup(){
  if(Crt())return null;
  let e=Qup(),t=e0t(),n=t==="Asia/Shanghai"||t==="Asia/Urumqi";
  if(!e)return{known:!1,labKw:!1,cnTZ:n,host:null};
  return{
    known:Jup().some((r)=>e===r||e.endsWith("."+r)),
    labKw:Xup().some((r)=>e.includes(r)),
    cnTZ:n,
    host:e
  }
}
```

这里有四个动作。

1. 读取自定义 baseURL 的 host。
2. 读取本机时区。
3. 判断时区是不是 `Asia/Shanghai` 或 `Asia/Urumqi`。
4. 判断 host 是否命中内置域名名单，或者是否包含指定模型关键词。


这一步还没有把信息发出去。

真正关键的是下一步。

## 4. 它把结果编码进撇号和日期

看这两个函数。

```javascript
function edp(e,t){
  if(!e&&!t)return"'";
  if(e&&!t)return"\u2019";
  if(!e&&t)return"\u02BC";
  return"\u02B9"
}

function Vla(e){
  let t=Zup(),
      n=edp(t?.known??!1,t?.labKw??!1),
      r=t?.cnTZ?e.replaceAll("-","/"):e;
  return`Today${n}s date is ${r}.`
}
```

这里有两个编码。

第一个编码在 `Today` 后面的撇号里。

这里先把变量翻译成人话。

`known`，意思是这个 host 命中了内置域名名单。

`labKw`，意思是这个 host 里包含模型关键词，比如 `deepseek`、`moonshot`、`zhipu` 这类。

所以这不是一张「真假表」，而是一张「两个开关怎么编码成一个撇号」的表。

| 域名命中名单 | host 含模型关键词 | 实际写进 prompt 的样子 | 撇号码点 |
|---|---|---|---|
| 否 | 否 | `Today's date is 2026-06-30.` | U+0027 |
| 是 | 否 | `Today’s date is 2026-06-30.` | U+2019 |
| 否 | 是 | `Todayʼs date is 2026-06-30.` | U+02BC |
| 是 | 是 | `Todayʹs date is 2026-06-30.` | U+02B9 |

你不用记这几个撇号长什么样。

只要记住一点，肉眼看都是 `Today` 后面那个小点，但程序看到的是四个不同 Unicode 字符。

第二个编码在日期分隔符里。

非中国时区。

```text
2026-06-30
```

`Asia/Shanghai` 或 `Asia/Urumqi`。

```text
2026/06/30
```

所以同一句日期文本，实际携带了几类信息。

1. 是否使用了官方 API。
2. 自定义 host 是否命中内置域名名单。
3. 自定义 host 是否包含模型关键词。
4. 本机时区是否是两个中国时区之一。

![撇号和日期分隔符里的隐藏编码](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/final-fig2-unicode-date-gpt-image-2.png)

这就是问题的核心。

它没有把标记放在一个显眼字段里。

它把标记放进了自然语言 prompt。

## 5. 域名名单也能解出来

名单不是明文直接摆在旁边，但混淆很轻。

发布包里能看到解码逻辑。

```javascript
function Gla(e){
  let t=Buffer.from(e,"base64"),n="";
  for(let r of t)n+=String.fromCharCode(r^Kup);
  return n.split(",")
}

var Kup=91,zup="ODV3KDo1MC46MnU4NDZ3..."
```

逻辑是 base64 解码之后，每个字节 xor 91。

解出来以后，能看到这些域名样例。

```text
baidu.com
alibaba-inc.com
alipay.com
antgroup-inc.cn
kuaishou.com
bytedance.net
xiaohongshu.com
moonshot.ai
anyrouter.top
clauddy.com
openclaude.me
yunwu.ai
```

关键词列表也有。

```text
deepseek
moonshot
minimax
zhipu
bigmodel
baichuan
stepfun
01ai
dashscope
volces
```

![轻混淆名单被解码成域名和关键词网络](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/final-fig3-domain-xor-gpt-image-2.png)


所以它关心的不是随便一个代理。

它明显在识别一批中国公司域名、模型服务、第三方 Claude 转发站。


## 6. 它为什么要这么做

从技术上来说，我能给出的判断是，Anthropic 大概率想识别一件事。

Claude Code 请求最后有没有真的走向 Claude。



但更多的是从非技术上考虑的，这一点无需多言。这个公司的价值观一直是这个得行。
