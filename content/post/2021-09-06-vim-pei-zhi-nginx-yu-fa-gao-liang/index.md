---
title: "vim 配置 nginx 语法高亮"
slug: 2021-09-06-vim-pei-zhi-nginx-yu-fa-gao-liang
description: "当你使用 vim 编辑器编辑 nginx 的配置文件时，vim 编辑器是无法自动识别出 nginx 的相关语"
date: 2021-09-06T07:33:47.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-06-vim-pei-zhi-nginx-yu-fa-gao-liang/cover.jpg
original_url: https://mp.weixin.qq.com/s/bJK0WrP05u5G0wpftqaMPw
categories:
  - 系统底层
tags:
  - Nginx
  - Vim
  - 网络
  - DevOps
---
-   当你使用 vim 编辑器编辑 nginx 的配置文件时，vim 编辑器是无法自动识别出 nginx 的相关语法的。

-   所以，使用 vim 编辑器编辑 nginx 配置文件时，无法实现”语法高亮”功能，也就是说，默认情况下，使用 vim 编辑 nginx 配置文件时，没有彩色的语法着色。

-   对于使用者来说，这样体验不好，nginx 官方很贴心，在源码包中为我们提供了 vim 针对 nginx 的语法高亮配置文件，我们只要把这些文件拷贝到 vim 的对应目录中即可直接使用，方法很简单

如下：

```

# wget http://nginx.org/download/nginx-1.14.2.tar.gz
# tar -xf nginx-1.14.2.tar.gz

进入到源码包解压目录
# cd nginx-1.14.2/
将相应的语法文件拷贝到对应的目录中，即可完成
# cp -r contrib/vim/* /usr/share/vim/vimfiles/

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-09-06-vim-pei-zhi-nginx-yu-fa-gao-liang/001-b77bd5fb.jpg)

参考：https://www.zsythink.net/archives/3091
