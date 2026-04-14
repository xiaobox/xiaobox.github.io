---
title: "OpenFeign 如何设置动态 URL？"
slug: 2021-10-19-openfeign-ru-he-she-zhi-dong-tai-url
description: "如果你利用 Spring Cloud OpenFeign 进行服务间调用一般会加入这个注解：@FeignCl"
date: 2021-10-19T04:24:07.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-19-openfeign-ru-he-she-zhi-dong-tai-url/cover.jpg
original_url: https://mp.weixin.qq.com/s/DPwSi1TCo4AF3LTPq3yZZw
categories:
  - 后端
tags:
  - Spring
  - 网络
---
如果你利用 Spring Cloud OpenFeign 进行服务间调用一般会加入这个注解：

```
@FeignClient(name = "" ,url = "http://myapp.com",path = "")

```

可以看出其中的 url 参数是一个字符串，上面的配置是把它写“死”在代码中了。

如果我们想根据不同的环境作动态配置，让这个 url 动态的变化应该怎么办呢？

可以这样：

首先修改注解

```
@FeignClient(name = "" ,url = "${feign.client.url.TestUrl}",path = "")

```

然后添加配置文件，比如

在你的 application-dev.yml 文件中

```yaml
feign:
  client:
    url:
      TestUrl: http://dev:dev

```

在你的 application-pre.yml  文件中

```yaml
feign:
  client:
    url:
      TestUrl: http://pre:pre

```

利用 Spring 的 EL 表达式，我们就可以让`url` 根据不同文件的不同值动态获得了。

另外，还可以给这个表达式指定默认值

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-10-19-openfeign-ru-he-she-zhi-dong-tai-url/001-31d9033b.jpg)

也就是当配置文件没有这个配置的时候给一个默认的配置，这样的话，我们的注解要修改成如下：

```
@FeignClient(name = "" ,url = "${feign.client.url.TestUrl ?: 'http://myapp.com'}",path = "")

```

最后给出一个我在实际项目中的例子

```yaml
@FeignClient(name = "idGenerateClient",
    path = "/v1/app/internal/test",
    url = "#{" +
        "('${spring.profiles.active}' eq 'local') ?  " +
        "('${feignclient-url." + APPConstant.APPLICATION_NAME + "}' ?: 'http://${env.domain}' ): " +
        "'http://" + APPConstant.APPLICATION_NAME + "'" +
        "}",
    fallbackFactory = XXXClientFallback.class)

feignclient-url:
  my-app: '127.0.0.1:8805'

```

## 参考

-   https://stackoverflow.com/questions/43733569/how-can-i-change-the-feign-url-during-the-runtime

-   https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions
