---
title: "这么多年 Java 白学了，原来我连个 printf 都不会"
slug: 2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d
description: "格式化输出 System.out.printf(\"hello world\");作为多年的老 javaer ,"
date: 2022-08-14T16:04:56.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/cover.jpg
original_url: https://mp.weixin.qq.com/s/zUM1H5ZPLmmsapO9QuwTVA
categories:
  - 后端
tags:
  - Java
---
## 格式化输出

```
System.out.printf("hello world");

```

作为多年的老 javaer , 你看到这儿可能会说，你要给我看这个，咱们的交情就到这儿了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/001-58a0f693.jpg)

大佬别误会，再看看，咱们还有好东西。

### printf

printf 准确来讲是 `PrintStream` 类的 `printf` 方法

> 一种使用指定的格式字符串和参数将格式化字符串写入输出流的便捷方法。

一般我们会把程序运行的一些中间过程或结果输出到控制台（console），利用 printf 方法可以方便地进行文本格式化

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/002-029fad9d.jpg)

这是方法声明，可以看到，它有两个参数：

-   format 格式字符串，如格式字符串语法（Format string syntax）中所述
-   args  要参数化的对象，这是个变长参数，意味着调用者可以传递多个参数进来 ，是 JDK5 加入的，本质上是个语法糖

```

 System.out.printf("%s %s %s","a","b","c");
 
 //输出  a b c 

```

### Format string syntax

你可能注意到了，这个方法的关键就是第一个参数 format，就是这个**格式字符串语法**，说白了就是这个 format 字符串写成什么样，我们的输出就格式化成什么样。

那这玩意到底有什么魔法，是什么规则？别急，我们先看下源码：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/003-f76cebed.jpg)

通过源码得知，原来传入的 format 参数其实是给  `formatter.format()` 方法了。并且默认构造了一个国际化类 `Locale`，放着它不说，我们继续聊 格式化打印。

**Java 语言的格式化打印很大程度上受到 C 的 printf 的启发（请 C 大佬们把刀放下）**

**尽管与 C 类似，但也进行了一些自定义以适应 Java 语言并利用某些功能**

**此外，Java 格式比 C 更严格，如果转换与标志不兼容，则将引发异常，因此 Java 中的 printf 和 C 的不完全兼容。**

format 是以百分号 (%) 开头的格式说明字符串，具体格式如下：

```
 %[argument_index$][flags][width][.precision]conversion

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/004-5ee20d40.jpg)

引用自 https://blog.csdn.net/jhsword/article/details/108574442

-   可选的 *argument\_index* 是十进制整数，表示参数列表中参数的位置。第一个参数由“ `1$` ”引用，第二个由“ `2$` ” 引用 ，等等。*argument\_index* 必须紧跟`%`后面，并以`$` 结束。

    note: 参数索引值从 1 开始，而不是从 0 开始，`%1$` 对第一个参数格式化。这就避免了与 0 标志混淆。

-   可选 *flags* 指定格式化输出外观的各种标志。有效标志集取决于 conversion。

-   可选 \_width\_是正十进制整数，表示要写入到输出的字符个数（**注意对于浮点数：也包含小数点所占的 1 个字和 负数的负号所占的 1 个字符）**。**当实际字符数小于指定的宽度时，最前面用 flags 指定的标志填充（若未指定，默认用空格）**

-   可选 *precision* 是一个非负十进制整数，通常用于限制字符数。具体行为取决于转换。

-   *conversion* **（必需）** 是一个字符，指示如何格式化参数。给定参数的有效转换集取决于参数的数据类型。

## 一些例子

### 指定顺序

```
System.out.printf("%4$2s %3$2s %2$2s %1$2s", "a", "b", "c", "d");

```

输出   `d c b a`，将我们输入的参数倒序输出了。解释一下：

-   %4$ 代表输出第四个参数，后面以此类推
-   2s 代表在输出的字符前加两个空格，后面以此类推
-   `%4$2s` 和 `%3$2s` 中间的空格不加也行，加了是方便阅读，并没有实际意义

如果不指定顺序就是参数的默认顺序：

```
 System.out.printf("%s %s %s %s", "a", "b", "c", "d");
 // -> "a b c d");

```

### 复用

```
System.out.printf("%s %s %<s %<s", "a", "b", "c", "d");
// -> "a b b b");

```

`<` 代表利用前一个参数的内容

### 大小写转换

```
System.out.printf("%S", "hello"); // 输出  HELLO

```

注意，只能小写字母写大小字母

### 指定宽度

指定字符宽度可以达到向左向右加空格的效果：

```
System.out.printf("'%6s「」", "hello");  //输出 ' hello' 
System.out.printf("'%-6s' %n", "hello"); //输出 'hello ' 

```

### 指定精度

我们可以通过指定精度来限制输出中的字符数：

```
System.out.printf("'%5.2s'", "Hi there!");//输出： '   Hi'

```

`.2` 就是限制后面参数的长度为 2 ， `5` 是整个字符串的长度限制，同理  `%10.8s` 的意思就是输出参数中的前 8 个字符，前面再加两个空格。

### 格式化数字

比如你想在多位数字中加个 `千位分隔符`

```
System.out.printf("%,d %n", 100000000);
//输出 ：100,000,000

```

-   %n 表示换行

保留两位小数：

```
System.out.printf("'%5.2f'%n", 5.1473);
//输出： ' 5.15'

```

注意，它进位了

保留两位小数也可以简单写：

```
System.out.format("%.2f", 5.22);

```

### 日期格式化

我们格式化一个最常用的日期，就是这种 `yyyy-mm-dd:HH:mm:ss`

```
System.out.printf("%1$tY-%1$tm-%1$td:%1$tH:%1$tM:%1$tS %n", Calendar.getInstance());
//输出：2022-08-14:22:49:48

```

## 生产实践

在非本地环境，一般我们不会把 debug 的输出打到 控制台，更多的时候会用 log 打印，比如 `log.info()`

我们当然可以用 log 的占位符，但不够 NB 和强大：

```
 log.info("{} , {}","hello","world");

```

基于我们上面所介绍的，是可以把 format 和 log 结合起来用的，比如：

```
log.info(String.format("%1$tY-%1$tm-%1$td:%1$tH:%1$tM:%1$tS %n",Calendar.getInstance()));
//输出：23:29:01.911 [main] INFO com.xiaobox.demo.FormatTest - 2022-08-14:23:29:01

```

这里我们用了 String 的 format 方法，它还是调用的 Formatter，和 printf 是一样的：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-08-14-zhe-me-duo-nian-java-bai-xue-le-yuan-lai-wo-lian-ge-printf-d/005-67cfd63f.jpg)

## 最后

还有很多细节没讲到，不过看完本文你已经掌握了精髓了，更多细节只要查文档就可以了，比如下面的官方文档：

https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html

## 参考

-   https://blog.csdn.net/jhsword/article/details/108574442
-   https://www.baeldung.com/java-printstream-printf
-   https://blog.csdn.net/jhsword/article/details/108574442
-   https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html
-   https://www.runoob.com/w3cnote/java-printf-formate-demo.html
