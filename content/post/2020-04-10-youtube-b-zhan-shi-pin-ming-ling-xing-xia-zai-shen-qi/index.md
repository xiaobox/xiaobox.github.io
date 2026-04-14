---
title: "youtube、B站视频命令行下载神器"
slug: 2020-04-10-youtube-b-zhan-shi-pin-ming-ling-xing-xia-zai-shen-qi
description: "最近发现了一个神器，可以用命令行方便地下载youtube和B站视频"
date: 2020-04-10T02:05:44.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-10-youtube-b-zhan-shi-pin-ming-ling-xing-xia-zai-shen-qi/cover.jpg
original_url: https://mp.weixin.qq.com/s/uovrtQlAZUXoyHzxhOrkwg
categories:
  - 工具与效率
tags:
  - JavaScript
  - macOS
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-10-youtube-b-zhan-shi-pin-ming-ling-xing-xia-zai-shen-qi/001-f09530c5.png)

**最近发现了一个神器，可以用命令行方便地下载youtube和B站视频**

这是它的开源地址：

https://github.com/ytdl-org/youtube-dl

具体安装方法上面有，我是MAC电脑就直接 用命令 brew install youtube-dl 安装了，当然如果你没有安装brew要去装一下。

**一般的B站视频这样下载**：

```javascript
youtube-dl 'http://www.bilibili.com/video/av11728123/'

```

**如果要下载youtube视频需要加本机代理（利用各种工具翻墙后）：**

```javascript
 youtube-dl --proxy 127.0.0.1:1087 'https://www.youtube.com/watch\?v\=_fc_TLg3eQ4'

```

**也可以带字幕下载**：

```perl
youtube-dl --proxy 127.0.0.1:1087 --write-auto-sub 'https://www.youtube.com/watch?v=qOv8K-AJ7o0'

```

其他各种骚操作可以参考这里：

https://www.jianshu.com/p/fa4b0724d66c

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-10-youtube-b-zhan-shi-pin-ming-ling-xing-xia-zai-shen-qi/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
