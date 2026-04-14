---
title: "10分钟了解7个Java11的新功能"
slug: 2022-08-30-10-fen-zhong-liao-jie-7-ge-java11-de-xin-gong-neng
description: "概述我知道很多公司和个人还在用 Java8，我们不妨梳理下当下的情况目前 Java 最新的 GA（Gener"
date: 2022-08-30T14:00:32.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-30-10-fen-zhong-liao-jie-7-ge-java11-de-xin-gong-neng/cover.jpg
original_url: https://mp.weixin.qq.com/s/v-DpUFdccBec--BPwrKDOA
categories:
  - 后端
tags:
  - Java
  - Spring
  - 网络
---
## 概述

我知道很多公司和个人还在用 Java8，我们不妨梳理下当下的情况

-   目前 Java 最新的 GA（General-Availability） Release 版本是 `JDK 18.0.2.1`
-   `Java 17 LTS` 是 最新长期支持版本。根据 Oracle 免费条款`JDK 18` 和 `JDK 17` 可在生产环境中免费使用，至少在 2024 年 9 月之前
-   `JDK 18` 到 2022 年 9 月它将被 `JDK 19` 取代

日子总要过，我们也不可能抱着 Java 8 用一辈子，我们来一起看看 Java 11 的一些新玩意儿。

本文算是 Java 11 功能的小教程，没有长篇的文字，都是些短小易懂的代码，让我们沉浸在研究代码的快乐中吧。

## 1 局部变量类型推断

Java 10 引入了一个新的语言关键字`var` ，它可以在声明局部变量时选择性地替换类型信息

在 Java 10 之前，我们这样声明变量：

```
String text ="Hello World";

```

现在可以替换`String`为`var`. 编译器从变量的赋值中推断出正确的类型

```
var text = "Hello World";

```

注意：声明的变量\*\*`var`\*\*\*\*仍然是静态类型的。不能将不兼容的类型重新分配给此类变量\*\*，比如下面的代码就无法编译通过

```
var text = "Hello World";
text = 123;

```

当然 你还可以`final`与 结合使用`var`来禁止用另一个值重新分配变量：

```
final var text = "Hello World";
text = "hello";   // Cannot assign a value to final variable 'text'

```

当编译器无法推断变量的正确类型时，也`var`不允许使用。以下所有代码示例都会导致编译器错误：

```java
var a;
var nothing = null;
var lambda = () -> System.out.println("Joe!");
var method = this::someMethod;

```

\*\*有什么直接的好处？\*\*

比如有一个相当冗长的类型`Map<String, List<Integer>>`，可以将其简化为单个`var`关键字，从而避免您输入一坨类型：

```java
var myList = new ArrayList<Map<String, List<Integer>>>();

for (var current : myList) {
    // current is infered to type: Map<String, List<Integer>>
    System.out.println(current);
}

```

从 Java 11 开始，`var`关键字也允许用于 lambda 参数，这使你能够为这些参数添加注释：

```
Predicate<String> predicate = (@Nullable var a) -> true;

```

> “
> 
> 提示：在 Intellij IDEA 中，您可以将鼠标悬停在变量上，同时按住`CMD/CTRL`以显示变量的推断类型
> 
> ”

## 2 Http Client

Java 9 引入了一个新的孵化的`HttpClient`API 来处理 HTTP 请求。从 Java 11 开始，这个 API 现在是最终可用的了，在包`java.net` 中。让我们探索一下这个 API

-   newHttpClient 可以同步或异步使用。同步请求会阻塞当前线程，直到响应可用。
-   BodyHandlers 定义响应主体的预期类型（例如字符串、字节数组或文件）：

```java
  var request = HttpRequest.newBuilder()
                .uri(URI.create("http://jsonplaceholder.typicode.com/users"))
                .GET()
                .build();
  var client = HttpClient.newHttpClient();
  HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
  System.out.println(response.body());

```

可以异步执行相同的请求。调用`sendAsync`不会阻塞当前线程，而是返回一个`CompletableFuture`来构造异步操作流水线。

```
var request = HttpRequest.newBuilder()
    .uri(URI.create("http://jsonplaceholder.typicode.com/users"))
    .build();
var client = HttpClient.newHttpClient();
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
    .thenApply(HttpResponse::body)
    .thenAccept(System.out::println);

```

> “
> 
> 自己跑代码的时候注意，因为是异步的，所以你可以让主线程 sleep 一会儿，不然直接运行啥都没有
> 
> ”

最新的这个 HttpClient 还有一些其他功能就不过多介绍了，如果你使用了 Spring 5 及以上版本，我的建议是可以直接用 WeClient ，那玩意儿谁用谁知道呀。

## 3 Collection

`List`等集合已通过新方法进行了扩展。从给定的参数创建一个新的不可变列表。创建列表的不可变副本

```java
var list = List.of("A", "B", "C");
var copy = List.copyOf(list);
System.out.println(list == copy);   // true

```

注意这里 of 方法返回的是不可变类型，我们看下源码：

```
 static <E> List<E> of(E e1, E e2, E e3) {
        return new ImmutableCollections.ListN<>(e1, e2, e3);
 }

```

因为`list`已经是不可变的，所以实际上不需要创建列表实例的副本，因此`list`和`copy`是同一个实例。但是，如果你想复制一个可变列表，`copy` 则返回一个新实例，因此可以保证在改变原始列表时没有副作用

```java
var list = new ArrayList<String>();
var copy = List.copyOf(list);
System.out.println(list == copy);   // false

```

Map 的 of 方法方便我们直接构造：

```java
var map = Map.of("A", 1, "B", 2);
System.out.println(map);    // {B=2, A=1}

```

注意这里仍然返回的是不可变类型，关于不可变集合的了解可以参考我之前的一篇文章 《 跟着 Guava 学 Java 之 不可变集合》

如果你修改了不可变集合会抛出 `java.lang.UnsupportedOperationException` 异常，IDEA 也会有相应的警告给你标明哪里出了问题。

## 4 Stream

流是在 Java 8 中引入的，现在接收三个新方法。`Stream.ofNullable`从单个元素构造一个流：

```
Stream.ofNullable(null).count()   // 0

```

`dropWhile`和`takeWhile` 是确定要从流中放弃哪些元素。

```
Stream.of(1, 2, 3, 2, 1)
    .dropWhile(n -> n < 3)
    .collect(Collectors.toList());  // [3, 2, 1]

Stream.of(1, 2, 3, 2, 1)
    .takeWhile(n -> n < 3)
    .collect(Collectors.toList());  // [1, 2]

```

-   takeWhile() 方法使用一个断言作为参数，返回给定 Stream 的子集直到断言语句第一次返回 false。如果第一个值不满足断言条件，将返回一个空的 Stream。
-   dropWhile 方法和 takeWhile 作用相反的，使用一个断言作为参数，直到断言语句第一次返回 false 才返回给定 Stream 的子集。

所以上面

-   第一段的意思是放弃取小于 3 的元素，直到遇到第一个不小于 3 的则把后面的全部元素收集起来
-   第二段的意思就是从第一个元素开始收集元素，直到遇到第一个不小于 3 的元素结束

## 5 Optional

Optional 还接收到一些非常方便的新方法，例如，您现在可以简单地将 optional 转换为流或提供另一个 optional 作为空 optional 的后备

```
Optional.of("foo").orElseThrow();     // foo
Optional.of("foo").stream().count();  // 1
Optional.ofNullable(null)
    .or(() -> Optional.of("fallback"))
    .get();                           // fallback 

```

## 6 String

最基本的类之一`String`有一些辅助方法来修剪或检查空格以及流式传输字符串的行：

```
" ".isBlank();                // true
" Foo Bar ".strip();          // "Foo Bar"
" Foo Bar ".stripTrailing();  // " Foo Bar"
" Foo Bar ".stripLeading();   // "Foo Bar "
"Java".repeat(3);             // "JavaJavaJava"
"A\nB\nC".lines().count();    // 3

```

注意你可能觉得 strip 和 trim 方法一样，一般使用的话差不多，但实际上他们不一样，有所区别：

-   trim() 可以去除字符串前后的半角空白字符
-   strip() 可以去除字符串前后的全角和半角空白字符

你可以试试：

```java
  String test1="测试、u0020";//半角 unicode
  System.out.println(test1.trim().length());//2
  System.out.println(test1.strip().length());//2

  String test2="测试、u3000";//全角 unicode
  System.out.println(test2.trim().length());//3
  System.out.println(test2.strip().length());//2

  String test3="测试 ";//半角空白字符
  System.out.println(test3.trim().length());//2
  System.out.println(test3.strip().length());//2

  String test4="测试 ";//全角空白字符
  System.out.println(test4.trim().length());//3
  System.out.println(test4.strip().length());//2

  String test5="测试  ";//两个半角空白字符
  System.out.println(test5.trim().length());//2
  System.out.println(test5.strip().length());//2
    
```

## 7 InputStream

终于有一个非常实用的方法可以将数据从 inputStream 转到 outputStream 了，不用再自己写了

```
var classLoader = ClassLoader.getSystemClassLoader();
var inputStream = classLoader.getResourceAsStream("myFile.txt");
var tempFile = File.createTempFile("myFileCopy", "txt");
try (var outputStream = new FileOutputStream(tempFile)) {
    inputStream.transferTo(outputStream);
}

```

我们看源码的 transferTo 方法

```
 public long transferTo(OutputStream out) throws IOException {
        Objects.requireNonNull(out, "out");
        long transferred = 0;
        byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
        int read;
        while ((read = this.read(buffer, 0, DEFAULT_BUFFER_SIZE)) >= 0) {
            out.write(buffer, 0, read);
            transferred += read;
        }
        return transferred;
    }
}

```

熟悉吗？再也不用写这破玩意儿了。

## 最后

当然  Java 11 的更新 中远远不止上面这些内容，还有很多功能和特性值得大家去探索，比如：

-   Flow API 的反应式编程
-   G1: Full Parallel Garbage Collector
-   ZGC: Scalable Low-Latency Garbage Collector
-   ...
