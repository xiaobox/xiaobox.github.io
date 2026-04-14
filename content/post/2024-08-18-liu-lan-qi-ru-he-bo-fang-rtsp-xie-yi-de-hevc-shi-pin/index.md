---
title: "浏览器如何播放 RTSP 协议的 HEVC 视频"
slug: 2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin
description: "起因最近接入了一个三方的 API，对方提供的数据中有视频链接，是实时流视频，最开始的时候是 http 协议的，"
date: 2024-08-18T10:44:54.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/cover.jpg
original_url: https://mp.weixin.qq.com/s/IkqBqv3NgcisPzFfscsshw
categories:
  - 系统底层
tags:
  - Nginx
  - 架构
  - 网络
---
## 起因

最近接入了一个三方的 API，对方提供的数据中有视频链接，是实时流视频，最开始的时候是 http 协议的，我一看 http 应该没问题，在本机的视频播放器 IINA 上试了一下能播，又在前端写了个 demo，浏览器也能播放，没什么问题。这个地址的后缀是 .flv

后来数据中出现了 rtsp 协议的地址。最开始没当回事儿，在 IINA 上试了一下可以播就去忙别的了，后来负责开发的小伙伴反馈这玩意在浏览器播不了，这才引起了重视。

## 经过

经过一番研究，果然，rtsp 协议的视频地址是无法直接在浏览器播放的。需要我们自己处理。经过与三方 API 厂商沟通无果后，我们只能硬着头皮自己处理了。虽然最后圆满解决了，但我们也不得不说自己的经验不足，如果一开始我们就确定的知道 rtsp 协议无法直接在浏览器播放，那么我们和 三方 API 对接时候的策略和态度就会完全不一样。在系统解决方案设计时也会完全不一样。现在这个时间点，我们是很被动的。

无论如何，我们是要解决它的。**我们研究了一下发现，要将 rtsp 协议的视频做一个协议转换，然后将转换后的实时视频流推到流视频服务器，播放时，浏览器从这个流视频服务器拉流播放。**

架构上还是比较简单的，于是我们开始搭建实时视频流服务器。

### 流视频服务器

查阅了一些资料后发现用 Nginx 配合一些模块可以解决问题。于是找到了 `nginx-rtmp-module`  https://github.com/arut/nginx-rtmp-module

> “
> 
> NGINX-based Media Streaming Server

原理上是基于 NGINX 做的流视频服务器，把 rtsp 协议的视频转成 rtmp，然后再拉流播放。

它的功能其实也不少：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/001-d74e6e2d.png)

本来想直接做个 demo 搞一下，不过在查阅资料的时候发现了这个模块：`nginx-http-flv-module` https://github.com/winshining/nginx-http-flv-module

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/002-07b7d77b.png)

看了一下功能对比和一些测评，嗯，没有理由不用更好的，你说是吧。于是就开始使用 `nginx-http-flv-module` 来做 demo

`nginx-http-flv-module` 是用源码编译安装的，安装过程也不复杂，大家随便搜一搜就能找到教程，我这里就不废话了。安装完成后就可以参考 `nginx-http-flv-module` 的文档搭建 demo 了。

### ffmpeg 推流

所谓推流，还要用到 ffmpeg ，这个强大的软件我也不用过多介绍，很多视频、音频、图像的处理都可以用到它，强大极了，参数也复杂极了。不过我们本文用到的不复杂：

```
ffmpeg -re -rtsp_transport tcp -i "rtsp://原视频 IP: 端口/live/heihe" -c:v copy -an -f flv "rtmp://127.0.0.1/myapp/livetest"

```

在执行这个命令之前需要我们在本地安装好 nginx 以及相应的 `nginx-http-flv-module`模块 和 `ffmpeg`(ffmpeg 的安装也不赘述了，教程也很多，随便一搜就能搞定）

全部安装好以后启动 Nginx，然后就可以执行上面的命令推流了。

解释下上面的命令，这条命令使用 `ffmpeg`，从一个 RTSP 流中读取视频，并将其以 FLV 格式推送到一个 RTMP 流。下面是每个参数的解释：

-   `ffmpeg`：这是命令本身，调用 FFmpeg 应用程序。
-   `-re`：表示“real-time”，这个选项告诉 FFmpeg 以与源相同的速率读取输入，模拟实时流。
-   `-rtsp_transport tcp`：指定使用 TCP 协议来传输 RTSP 流。RTSP 流可以使用 UDP 或 TCP，此选项强制使用 TCP。
-   `-i "rtsp://原视频 IP: 端口/live/heihe"`：这是输入选项，指定了 RTSP 流的 URL。这个 URL 指向一个特定的视频流。
-   `-c:v copy`：指定视频编码器为“copy”，这意味着视频流将不会被重新编码，而是直接复制到输出流中。
-   `-an`：这个选项表示“no audio”，告诉 FFmpeg 不要处理音频流，即输出中不包括音频。
-   `-f flv`：指定输出格式为 FLV（Flash Video）。FLV 是一种常用于流媒体传输的视频格式。
-   `"rtmp://127.0.0.1/myapp/livetest"`：这是输出选项，指定了 RTMP 流的 URL。在这个例子中，流被推送到本地主机的`myapp`应用下的`livetest`流。

这条命令的作用是从一个 RTSP 流中读取视频（不包括音频），并以实时的方式将其以 FLV 格式推送到一个 RTMP 服务器。这是流媒体传输中的一个常见用法，例如将监控摄像头或直播视频从 RTSP 源转发到 RTMP 流媒体服务器。

### 拉流

到这里活儿就干了一半了，剩下的就是如何在浏览器拉流播放，so easy, 根据 `nginx-http-flv-module` 的文档写个 html 页面就可以测试了

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Video Player</title>
    <script src="https://cdn.jsdelivr.net/npm/flv.js/dist/flv.min.js"></script>
</head>
<body>
    <video id="videoElement" controls width="640" height="360"></video>
    <script>
        
        if (flvjs.isSupported()) {
            var videoElement = document.getElementById('videoElement');
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: 'http://localhost:8080/live?app=myapp&stream=livetest'
            });

            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();

            
        }
    </script>
</body>
</html>

```

## 问题

本来以为到这里就结束了，因为测试也没发现什么毛病，部署到测试环境也是 OK 的。然而还是出问题了。

**我们拿到的 rtsp 流视频源里有的是 h264 编码的，而有的是 h265 编码的。264 的没问题，而 265 的是播不出来的。**

同样在跟三方沟通无果后，我们也得自己解决这个问题。首先看了一下前端使用的 flv.js ，没错它不支持 HEVC(h265)，没事儿，好在 `mpegts.js` 支持

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/003-51f72fae.png)

但重点不在这里，而是充当流媒体服务器的 `nginx-http-flv-module` 也不支持 H265。

好吧，之前的 demo 白写了，人家不支持。于是又要重新设计方案，找替代品。好在市面上流媒体服务器的项目很多，我们找到了一个相对不错的项目 `SRS` https://ossrs.io/lts/zh-cn/

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/004-e3fa7b66.png)

srs 的安装部署非常简单，参照文档可以很容易的搭建起来。但是注意，**安装时候，源码选择上尽量使用 release 版本 ，develop 版本的源码有 bug 的可能性很高。**

我没有使用 docker 安装，它是支持 docker 安装的。

srs 安装好以后，接下来就是推流和拉流了，推流仍然使用 ffmpeg 命令 ，参考 srs 的文档，地址稍微改一改就可以，推流完成后，srs 还有一个管理页面可以进行播放的测试，简直太贴心了。默认地址是：http://localhost:8080/  （srs 内置了一个 http server ）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-08-18-liu-lan-qi-ru-he-bo-fang-rtsp-xie-yi-de-hevc-shi-pin/005-6f872e9f.png)

可以看到，它还十分贴心的告诉你建议使用什么前端组件来播放什么协议的视频。

### 前端

前端页面是最简单的，我写了一个 demo：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Video Player</title>
    <script src="./mpegts.js"></script>
</head>
<body>
    <video id="videoElement" controls width="640" height="360"></video>

    <video id="videoElement2" controls width="640" height="360"></video>
    <script>
        
        if (mpegts.isSupported()) {
            var videoElement = document.getElementById('videoElement');
            var flvPlayer = mpegts.createPlayer({
                type: 'flv',
                url: 'http://localhost:8088/live/livestream3.flv'
            });

            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
            
        }
    </script>
</body>
</html>

```

## 最后

ffmpeg 命令在我们的系统中是要由程序来控制执行的，我们在原有 java 程序中改了一下，添加了控制 ffmpeg 命令启动的程序，后来又改成执行一个 shell 脚本，因为我想在脚本中添加一点逻辑，比如 srs 如果没启动就把它启动起来，具体可以参考：

```bash
#!/bin/bash

# 检查参数数量是否正确
if [ "$#" -ne 2 ]; then
    echo "用法：$0 <RTSP_URL> <RTMP_URL>"
    echo "示例：$0 rtsp://123.456.543.212:873/live/aabbcc rtmp://localhost/live/aabbcc"
    exit 1
fi

# 获取输入参数
RTSP_URL=$1
RTMP_URL=$2

# 定义要检查的进程命令
FFMPEG_PROCESS_CMD="ffmpeg -re -rtsp_transport tcp -i $RTSP_URL -c:v copy -an -f flv $RTMP_URL"
SRS_PROCESS_CMD="./objs/srs -c conf/srs.conf"
SRS_DIR="/usr/srs/srs-server-6.0-a0/trunk"

# 使用 ps 和 grep 检查进程是否存在
check_process() {
    if ps aux | grep -v grep | grep "$1" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 检查并启动 SRS 进程
if check_process "$SRS_PROCESS_CMD"; then
    echo "SRS 进程已存在，无需启动新进程。"
else
    echo "SRS 进程不存在，正在启动新进程。.."
    cd $SRS_DIR
    $SRS_PROCESS_CMD > /dev/null 2>&1 &
    sleep 2
fi

# 检查并启动 ffmpeg 进程
if check_process "$FFMPEG_PROCESS_CMD"; then
    echo "ffmpeg 进程已存在，无需启动新进程。"
else
    echo "ffmpeg 进程不存在，正在启动新进程。.."
    $FFMPEG_PROCESS_CMD > /dev/null 2>&1 &
fi

```

总的来说，SRS 是很强大的，它能干的事情不止我们这个在浏览器播放 RTSP 协议视频这么简单，而且它的性能也很强。👍 （官方文档介绍比 nginx的方案强一倍）
