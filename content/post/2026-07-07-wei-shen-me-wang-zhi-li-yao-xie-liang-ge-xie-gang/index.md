---
title: "为什么网址里要写两个斜杠？"
slug: 2026-07-07-wei-shen-me-wang-zhi-li-yao-xie-liang-ge-xie-gang
description: ""
date: 2026-07-07T13:15:06.000Z
image:
original_url:
categories:
  - 系统底层
tags:
  - URL
  - HTTP
  - 网络协议
---

![为什么网址里要写两个斜杠封面图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/ab5e96e3-ab03-4aaf-8018-35b4e301081c-1.png)

你打开浏览器，在地址栏里敲下一个网址。

`https://www.google.com`

看到那两个斜杠了吗，就夹在 `https:` 和 `www` 中间的那对 `//`。

你每天都在看它，复制它，粘贴它。但你大概从来没停下来想过，这两道杠到底是干什么的。

咱们把一个完整的网址拆开看看。

`https://www.example.com/path/to/page`

`https` 是协议，告诉浏览器用什么方式去请求资源。

`www.example.com` 是主机名，告诉浏览器去找哪台服务器。

`/path/to/page` 是路径，告诉服务器你具体要哪个东西。

那 `//` 呢？

在 URI 的规范里（RFC 3986），`//` 后面跟着的部分叫 authority，翻译过来就是「谁来响应你这个请求」。`//` 是它的开头标记，用来把协议名和主机名隔开。

你可以把它想成一个路标。路标本身不是目的地，但它告诉你，从这里开始，后面写的是服务器的名字了。

问题在于，这个路标不是非它不可。

1989 年，Tim Berners-Lee 在 CERN 设计 URL 语法。路径部分的斜杠 `/` 直接照搬了 Unix 的文件路径写法，这很自然，用过 Unix 的人一看就懂。

但 `//` 这个双斜杠，不是他自己想出来的。

他从一台叫 Apollo Domain 的工作站上抄来的。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260707212723098.png)

Apollo 是 1980 年代的一款高端工作站。它的操作系统有个在当时很前沿的能力，可以直接在文件路径里访问网络上其他机器的文件，不用额外装什么传输工具。语法长这样，

`//machine_name/path/to/file`

两个斜杠开头，后面跟机器名，再接文件路径。双斜杠的作用是告诉系统，「注意，这不是本地目录，是另一台机器」。

Berners-Lee 在 CERN 接触过这种工作站，觉得这个写法挺清楚的，就直接搬过来用了。他自己后来也说过这件事，原话是「I just copied Apollo」。

于是 `http://` 后面那两个斜杠，就这么定下来了。

你可能会问，那不用 `//` 行不行？

完全可以。

你看 `mailto:someone@example.com`，这也是一个合法的 URI，没有 `//`。因为发邮件不需要去找一台服务器，邮件地址本身就够了。

`tel:+8613800138000`，打电话，也没有。你可以在浏览器里敲这个号码，浏览器会直接呼叫你的电话应用。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260707212820662.png)

`data:text/html,<h1>Hello</h1>`，更极端。你可以把这行直接粘到浏览器地址栏试试。

浏览器会渲染出一个大标题。整个「网页」就是这行地址本身，没有服务器，没有网络请求。

再试这个，

`data:text/html,<marquee>hello world</marquee>`

四个字在屏幕上滚来滚去。`marquee` 是上古时代的 HTML 标签，W3C 早就不推荐了，但浏览器到今天还认它。一个被标准抛弃了二十年的标签，靠一行 URL 复活了。

还有更离谱的，

`data:text/html,<input type="color">`

你会看到一个颜色选择器凭空冒出来。一个可以点击、可以交互的完整控件，藏在一行 URL 里，背后什么都没有。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260707212928724.png)

你可能还听说过 `javascript:` 开头的地址，可以直接在浏览器里跑代码。不过现代浏览器已经不让你从地址栏粘贴 `javascript:` 了，手动敲可以，粘贴会被吞掉。浏览器怕你被人忽悠着粘一段恶意脚本进去。

规律到这里就很清楚了。需要找服务器的协议才有 `//`，HTTP 有，FTP 有，SSH 有。不需要的，mailto 没有，tel 没有，data 没有，javascript 也没有。`//` 不是 URI 的默认配置，而是「我要连一台机器」时才亮的信号灯。

再看一个更逗的，`file:///Users/xxx/Desktop/test.html`。

数一下，三个斜杠。前两个是 `//`，标记 authority 的位置。但本地文件没有远程服务器，authority 是空的，`//` 后面直接接上了路径开头的 `/`。三道杠挤在一起，看着有点滑稽，语法上却完全正确。就好像你写了一个「收件人」，但后面跟的是你自己家地址。

前端开发的同学可能还见过一种更骚的写法，

`<script src="//cdn.jquery.com/jquery.min.js"></script>`

URL 开头直接就是 `//`，连协议名都没有。浏览器看到这种写法会自动继承当前页面的协议，页面是 HTTPS 就用 HTTPS 请求，页面是 HTTP 就用 HTTP。这个技巧在 2010 年前后很流行，当时很多网站在 HTTP 和 HTTPS 之间来回切，写死协议容易出问题。

现在基本见不到了，全世界都上了 HTTPS。但这种写法能存在，恰恰说明 `//` 在 URI 语法里的角色有多独立。它不依附于任何协议名，只做一件事，宣告「后面是服务器」。


有意思的是，现在大多数浏览器已经不显示 `https://` 了。Chrome 藏了，Safari 也藏了。你盯着地址栏看，只能看到一个干净的域名。想看完整的 URL，需要单独设置。

![](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/20260707213204292.png)


当年 Berners-Lee 道歉说，这两个字符浪费了太多纸和墨水。他大概没想到，最后的解法不是从规范里删掉它们，而是在界面上假装它们不存在。


