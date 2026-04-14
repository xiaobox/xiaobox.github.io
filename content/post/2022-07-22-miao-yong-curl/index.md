---
title: "妙用 cURL"
slug: 2022-07-22-miao-yong-curl
description: "认识 cURL“A command line tool and library for transferri"
date: 2022-07-22T12:09:20.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/cover.jpg
original_url: https://mp.weixin.qq.com/s/Gup40NCuJuJB7oZU5_a0Uw
categories:
  - 系统底层
tags:
  - Linux
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/001-3e461837.jpg)

## 认识 cURL

> “
> 
> A command line tool and library for transferring data with URL syntax, supporting DICT, FILE, FTP, FTPS, GOPHER, GOPHERS, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, MQTT, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET and TFTP. libcurl offers a myriad of powerful features
> 
> ”

curl 是常用的开源命令行工具，用来请求 Web 服务器。它的名字就是客户端（client）的 URL 工具的意思。它的功能非常强大，命令行参数多达几十种。它支持包括 FTP、HTTP、HTTPS、FTP、SCP，SFTP 数十种协议。如能熟练使用，可以在很多应用场景下，发挥巨大的价值。

## cURL 的使用

### 代替 Postman ?

```bash
curl https://www.baidu.com

```

如上命令，不带有任何参数时，curl 就是发出 GET 请求，服务器返回的内容会在命令行输出。当然，你还可以为其添加各种参数（如 -A、-b、-c、-d、-e、-F、-H 等等），使得可以完成更多复杂任务；

其实，如果只是简单的 Post、Get 请求，用 cURL 做像接口测试的工作是非常方便的。

有人说了，**Postman 它不香吗？**

是的，挺香的，但是当你在环境受限的情况下，比如 在 linux 服务器上想测试一下接口通不通没有 Postman 怎么办？

这时候 cURL 就体现出它的价值了。此外贴心的 Postman，还为我们提供了各种语言和 cURL 的 snippet，方便你在 Postman 编辑完成后直接拿走开发和调试使用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/002-fc80555c.jpg)

如上图，你直接 copy 内容，然后在命令行执行就可以了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/003-ce2526f6.jpg)

### 小工具了解一下

jsonplaceholder http://jsonplaceholder.typicode.com/

免费的 HTTP 请求假数据接口，前端同学可以了解一下

-   不需引入外部 js 文件。
-   同时支持 http 和 https 请求。
-   同时支持 post 请求和 get 请求。

### 看看 cookie?

```bash
curl -b cookies.txt https://www.youku.com

```

上面命令将服务器的 HTTP 回应所设置 Cookie 写入文本文件 cookies.txt。

### 上传个文件？

网站中上传文件功能很普遍，然而你是怎么调试的呢？

打开页面，选择文件后再点击上传按钮？然后 F12 看看 Request、Response?  或者打开 Postman 进行类似步骤？

可真够麻烦的。**用 cURL 一行命令搞定**

这里先介绍一下 -v 参数：

> “
> 
> 使用 -v 参数使 curl 打印有关请求和响应的详细信息。以 > 为前缀的行是发送给服务器的数据，以 < 为前缀的行是从服务器接收的数据，以 \* 开头的行是杂项信息，如连接信息、SSL 握手信息、协议信息等。
> 
> ”

我们看个例子，搞下百度：

```html
❯ curl -v  https://www.baidu.com 
*   Trying 110.242.68.3:443...
* Connected to www.baidu.com (110.242.68.3) port 443 (#0)
* ALPN: offers h2
* ALPN: offers http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: C=CN; ST=beijing; L=beijing; OU=service operation department; O=Beijing Baidu Netcom Science Technology Co., Ltd; CN=baidu.com
*  start date: Jul  5 05:16:02 2022 GMT
*  expire date: Aug  6 05:16:01 2023 GMT
*  subjectAltName: host "www.baidu.com" matched cert's "*.baidu.com"
*  issuer: C=BE; O=GlobalSign nv-sa; CN=GlobalSign RSA OV SSL CA 2018
*  SSL certificate verify ok.
> GET / HTTP/1.1
> Host: www.baidu.com
> User-Agent: curl/7.83.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
< Connection: keep-alive
< Content-Length: 2443
< Content-Type: text/html
< Date: Fri, 22 Jul 2022 10:03:09 GMT
< Etag: "588603e2-98b"
< Last-Modified: Mon, 23 Jan 2017 13:23:46 GMT
< Pragma: no-cache
< Server: bfe/1.0.8.18
< Set-Cookie: BDORZ=27315; max-age=86400; domain=.baidu.com; path=/
<
<!DOCTYPE html>
<!--STATUS OK--><html> <head><meta http-equiv=content-type content=text/html;charset=utf-8><meta http-equiv=X-UA-Compatible content=IE=Edge><meta content=always name=referrer><link rel=stylesheet type=text/css href=https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/bdorz/baidu.min.css><title>百度一下，你就知道</title></head> <body link=#0000cc> <div id=wrapper> <div id=head> <div class=head_wrapper> <div class=s_form> <div class=s_form_wrapper> <div id=lg> <img hidefocus=true src=//www.baidu.com/img/bd_logo1.png width=270 height=129> </div> <form id=form name=f action=//www.baidu.com/s class=fm> <input type=hidden name=bdorz_come value=1> <input type=hidden name=ie value=utf-8> <input type=hidden name=f value=8> <input type=hidden name=rsv_bp value=1> <input type=hidden name=rsv_idx value=1> <input type=hidden name=tn value=baidu><span class="bg s_ipt_wr"><input id=kw name=wd class=s_ipt value maxlength=255 autocomplete=off autofocus=autofocus></span><span class="bg s_btn_wr"><input type=submit id=su value=百度一下 class="bg s_btn" autofocus></span> </form> </div> </div> <div id=u1> <a href=http://news.baidu.com name=tj_trnews class=mnav>新闻</a> <a href=https://www.hao123.com name=tj_trhao123 class=mnav>hao123</a> <a href=http://map.baidu.com name=tj_trmap class=mnav>地图</a> <a href=http://v.baidu.com name=tj_trvideo class=mnav>视频</a> <a href=http://tieba.baidu.com name=tj_trtieba class=mnav>贴吧</a> <noscript> <a href=http://www.baidu.com/bdorz/login.gif?login&amp;tpl=mn&amp;u=http%3A%2F%2Fwww.baidu.com%2f%3fbdorz_come%3d1 name=tj_login class=lb>登录</a> </noscript> <script>document.write('<a href="http://www.baidu.com/bdorz/login.gif?login&tpl=mn&u='+ encodeURIComponent(window.location.href+ (window.location.search === "" ? "?" : "&")+ "bdorz_come=1")+ '" name="tj_login" class="lb">登录</a>');
                </script> <a href=//www.baidu.com/more/ name=tj_briicon class=bri style="display: block;">更多产品</a> </div> </div> </div> <div id=ftCon> <div id=ftConw> <p id=lh> <a href=http://home.baidu.com>关于百度</a> <a href=http://ir.baidu.com>About Baidu</a> </p> <p id=cp>&copy;2017&nbsp;Baidu&nbsp;<a href=http://www.baidu.com/duty/>使用百度前必读</a>&nbsp; <a href=http://jianyi.baidu.com/ class=cp-feedback>意见反馈</a>&nbsp; 京 ICP 证 030173 号&nbsp; <img src=//www.baidu.com/img/gs.gif> </p> </div> </div> </div> </body> </html>
* Connection #0 to host www.baidu.com left intact

```

可以看到，包括握手过程、请求、响应信息一应俱全。

加 -v 参数的作用就是就是为了跟踪（trace）一下请求，看看具体细节，这跟你 F12 的目的是一样的。此外，如果你想看到具体的请求、响应时间点可以加入 --trace-time 参数，最后的命令如下：

```bash
curl -v  --trace-time  https://www.baidu.com

```

效果是这样的：

```
❯ curl -v  --trace-time  https://www.baidu.com
18:15:50.680025 *   Trying 110.242.68.4:443...
18:15:50.692744 * Connected to www.baidu.com (110.242.68.4) port 443 (#0)
18:15:50.693142 * ALPN: offers h2
18:15:50.693165 * ALPN: offers http/1.1
18:15:50.706507 * TLSv1.3 (OUT), TLS handshake, Client hello (1):
18:15:50.723346 * TLSv1.3 (IN), TLS handshake, Server hello (2):
18:15:50.723509 * TLSv1.2 (IN), TLS handshake, Certificate (11):
18:15:50.724242 * TLSv1.2 (IN), TLS handshake, Server key exchange (12):
18:15:50.724370 * TLSv1.2 (IN), TLS handshake, Server finished (14):
18:15:50.724572 * TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
18:15:50.724628 * TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
18:15:50.724727 * TLSv1.2 (OUT), TLS handshake, Finished (20):
18:15:50.740045 * TLSv1.2 (IN), TLS handshake, Finished (20):
18:15:50.740086 * SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
18:15:50.740105 * ALPN: server accepted http/1.1
18:15:50.740129 * Server certificate:
18:15:50.740160 *  subject: C=CN; ST=beijing; L=beijing; OU=service operation department; O=Beijing Baidu Netcom Science Technology Co., Ltd; CN=baidu.com
18:15:50.740182 *  start date: Jul  5 05:16:02 2022 GMT
18:15:50.740200 *  expire date: Aug  6 05:16:01 2023 GMT
18:15:50.740256 *  subjectAltName: host "www.baidu.com" matched cert's "*.baidu.com"
18:15:50.740298 *  issuer: C=BE; O=GlobalSign nv-sa; CN=GlobalSign RSA OV SSL CA 2018
18:15:50.740317 *  SSL certificate verify ok.
18:15:50.740391 > GET / HTTP/1.1
18:15:50.740391 > Host: www.baidu.com
18:15:50.740391 > User-Agent: curl/7.83.1
18:15:50.740391 > Accept: */*
18:15:50.740391 >
18:15:50.753580 * Mark bundle as not supporting multiuse
18:15:50.753605 < HTTP/1.1 200 OK
18:15:50.753623 < Accept-Ranges: bytes
18:15:50.753641 < Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
18:15:50.753661 < Connection: keep-alive
18:15:50.753680 < Content-Length: 2443
18:15:50.753703 < Content-Type: text/html
18:15:50.753725 < Date: Fri, 22 Jul 2022 10:15:50 GMT
18:15:50.753762 < Etag: "588603e2-98b"
18:15:50.753789 < Last-Modified: Mon, 23 Jan 2017 13:23:46 GMT
18:15:50.753809 < Pragma: no-cache
18:15:50.753831 < Server: bfe/1.0.8.18
18:15:50.753856 < Set-Cookie: BDORZ=27315; max-age=86400; domain=.baidu.com; path=/
18:15:50.753878 <

```

接下来就是上传的部分了，-F 参数用来向服务器上传二进制文件。

```
❯ curl -v --trace-time  'https://postman-echo.com/post' -F  'fileName=@"/Users/xiaobox/Desktop/cookies.txt"'

```

解释一下这行命令：

-   https://postman-echo.com/post 是我找到的一个公共 API，你可以用来测试上传文件
-   -v --trace 上面讲过了
-   -F 会给 HTTP 请求加上标头 Content-Type: multipart/form-data，然后将我桌面的文件 cookies.txt 作为 file 字段上传。

-F 参数可以指定 MIME 类型，也可以改文件名。

```bash
curl -v --trace-time  'https://postman-echo.com/post' -F  'fileName=@/Users/xiaobox/Desktop/cookies.txt;type=text/plain;filename=me.txt'

```

-   上面命令指定 MIME 类型为 text/plain，否则 curl 会把 MIME 类型设为 application/octet-stream
-   上面命令中，原始文件名为 cookies.txt，但是服务器接收到的文件名为 me.txt。

**最后总结，如果你想用一条 cURL 命令测试上传接口，可以利用类似下面的参数组合：**

```bash
curl -v --trace-time  'https://postman-echo.com/post' -F  'fileName=@/Users/xiaobox/Desktop/cookies.txt;type=text/plain;filename=me.txt'

```

### 弱网测试

顾名思义，就是模拟你的客户端用户在网络较差的环境下，比如 网速很低的时候，网络请求的情况。

我们还是拿百度举例子，你可以用以下一组命令在 1k 和 200B 的不同速度下对比看看响应情况：

```bash

curl -v --trace-time --limit-rate 1k http://www.baidu.com

curl -v --trace-time --limit-rate 200B http://www.baidu.com

```

注意 limit-rate 是同时限制  request 和 response，也就是 请求、响应都限制成一样的速率了。

### 自动重定向

```html
❯ curl  https://www.bilibili.com
Redirecting to <a href="//www.bilibili.com/?rt=V%2FymTlOu4ow%2Fy4xxNWPUZ91QLE3Z%2BfhZ8P5SQVD30Nw%3D">//www.bilibili.com/?rt=V%2FymTlOu4ow%2Fy4xxNWPUZ91QLE3Z%2BfhZ8P5SQVD30Nw%3D</a>.%

```

你看到了 B 站给我们重定向了，我们可以利用 -L 参数让 cURL 自动重定向。

```bash
curl -L httsp://www.bilibili.com

```

注意 是大写的 L

### 科学上网后 cURL 不通？

假设你已经配置了科学上网，我们直接 cURL google 看一下

```
❯ curl -v  https://www.google.com
*   Trying 74.86.151.167:443...
* connect to 74.86.151.167 port 443 failed: Operation timed out
* Failed to connect to www.google.com port 443 after 75400 ms: Operation timed out
* Closing connection 0
curl: (28) Failed to connect to www.google.com port 443 after 75400 ms: Operation timed out

```

一般情况下是失败的

再假设你用的 VPN 客户端是 `clashX` 因为我用的是这个，就用这个举例。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/004-52394518.jpg)

点击 “复制终端代理命令”，然后在你的终端执行一下：

```
❯ export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890

```

再用 cURL, 你会发现就可以成功了。如果你用的不是 `clashX` 其他的 VPN 客户端应该也有类似功能

### 保存响应内容 ？

可以利用 -o 参数将响应的结果保存到文件中：

```bash
 curl -o google.txt https://www.google.com

```

### 下载文件并显示进度？

cURL 可以当 wget 用

-o 参数将服务器的回应保存成文件，等同于 wget 命令

下载文件的同时显示进度可以使用类似下面的命令：

```
❯ curl -# -o pic.jpg https://w.wallhaven.cc/full/pk/wallhaven-pk6993.png

```

### 参数太多，不想拼？

cURL 是好用，但如果我是个 web 应用，需要拼接一堆参数，那太麻烦了，简直劝退。

是的，所以 浏览器也想到了，你可以在浏览器先正常发出请求，然后利用浏览器的工具将 cURL 的命令复制出来。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/005-9bba9b44.jpg)

可以复制单个请求，也可以是页面的所有请求。然后你就可以粘贴到终端执行了。

是不是很方便 ？

### 获取所在地 IP

```bash

curl -L tool.lu/ip
# or
curl -L ip.tool.lu

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/006-7d904cf5.jpg)

### 获取天气预报？

我们看看北京的：

```bash
curl 'wttr.in/Beijing?lang=zh'

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-22-miao-yong-curl/007-cc9598d2.jpg)

### 吐槽苹果

这是一则去年关于 cURL 的旧新闻：https://www.163.com/dy/article/GTOGN8D20544B1XD.html

**curl 作者吐槽苹果把他当做免费工具人**

了解这样的新闻可以帮助你更深刻地认识开源、商业以及整个软件的生态情况。

## 参考

-   https://www.ruanyifeng.com/blog/2019/09/curl-reference.html
-   https://catonmat.net/cookbooks/curl
-   https://mp.weixin.qq.com/s?\_\_biz=MjM5MjAwODM4MA==&mid=2650815877&idx=3&sn=b312574c2c4e5c9bd6fdb6f906df1e2e&chksm=bd584c568a2fc5408e68a2bec8730ab456a4357631616615370c516f202a5d10b1342f3566c1&mpshare=1&scene=1&srcid=07189V82hG1lx6sMFoakJlXA&sharer\_sharetime=1658151024021&sharer\_shareid=8db3fb6c9d4c226a712c1d5f99a37cb0#rd
