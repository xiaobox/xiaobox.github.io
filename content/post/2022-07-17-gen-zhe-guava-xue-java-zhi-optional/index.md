---
title: "跟着 Guava 学 Java 之 Optional"
slug: 2022-07-17-gen-zhe-guava-xue-java-zhi-optional
description: "使用和避免 null“Google 底层代码库，95%的集合类不接受 null 值作为元素。相比默默地接受"
date: 2022-07-17T07:42:33.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-17-gen-zhe-guava-xue-java-zhi-optional/cover.jpg
original_url: https://mp.weixin.qq.com/s/_ydmThiAcCBz6pJ2mpgVSA
categories:
  - 后端
tags:
  - Java
---
## 使用和避免 null

> “
> 
> Google 底层代码库，95%的集合类不接受 null 值作为元素。相比默默地接受 null，使用快速失败操作拒绝 null 值对开发者更有帮助。
> 
> ”

很多 Guava 工具类对 Null 值都采用快速失败操作，此外，Guava 还提供了很多工具类，让你更方便地用特定值替换 Null 值

### 例子

我们知道 JDK8 以后 也参考 Guava 加入了 `Optional`的 API，使用上跟 Guava 的区别不大，例子中我们使用 JDK 的 API 来演示。

直接上个实际工作中的案例即：**“对象的嵌套判空”**

比如我有个对象，对象的某个属性也是对象，然后就这样一直嵌套下去，比如：

```java
@Data
public class Test1{

    private String info="info1";
    private Test2 test2;
}

@Data
public class Test2 {

    private String info;
    private Test3 test3;
}

@Data
public class Test3 {

    private String info;
    private Test4 test4;
}

@Data
public class Test4 {

    private String info = "test4 info";
}

```

为了减少代码量和版面，我使用了 Lombok

```html
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
    <scope>provided</scope>
</dependency>

```

如果我想使用 Test4 的 info 属性，可以用 if 一直嵌套判断下来：

```java
if (test1 != null) {

    Test2 test2 = test1.getTest2();
    
    if (test2 != null) {
        
        Test3 test3 = test2.getTest3();
        
        if (test3 != null) {
            
            Test4 test4 = test3.getTest4();
            
            if (test4 != null) {

                System.out.println(test4.getInfo());
            }
        }

    }
}

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-17-gen-zhe-guava-xue-java-zhi-optional/001-5a5704db.jpg)

对象层级一深，代码很臃肿。`Optional` **可以帮我们用一行代码解决掉！**

```java
String info1 = Optional.ofNullable(test1)
                .map(Test1::getTest2)
                .map(Test2::getTest3)
                .map(Test3::getTest4)
                .map(Test4::getInfo)
                .orElse("hello");

System.out.println(info1);

```

这行代码达到的效果和上面的 if 一样

解释一下上面几个 `Optional`  的方法：

-   ofNullable  : 如果 test 为空，则返回一个单例空 Optional 对象，如果非空则返回一个 Optional 包装对象，Optional 将 test 包装

-   map: 如果为空，继续返回第一步中的单例 Optional 对象，否则调用 Test 的 getTest 方法；

-   orElst: 获得 map 中的 value，不为空则直接返回 value，为空则返回传入的参数作为默认值

上面代码中的 map 方法也可以换作 flatMap 方法，区别是 ：**flatMap 要求返回值为 Optional 类型，而 map 不需要，flatMap 不会多层包装，map 返回会再次包装 Optional。**

我们这里 Test 类是普通类并没有使用 `Optional` 包装，如果这么写就可以使用 flatMap：

```java
@Data
public class Test1 {

    private String info = "info1";
    private Optional<Test2> test2;
}

```

此外我们还可以在发生空指针的情况下，抛出异常或自定义异常：

```java
 String info2 = Optional.of(test1)
          .map(Test1::getTest2)
          .map(Test2::getTest3)
          .map(Test3::getTest4)
          .map(Test4::getInfo)
          .orElseThrow(() -> new RuntimeException("有空指针异常，对象内容为： " + ToStringBuilder.reflectionToString(test1，new MultilineRecursiveToStringStyle())));

System.out.println(info2);

```

可能你注意到了，我这里的异常输出中用到了 `ToStringBuilder` 这个类，这个是 Apache Commons Lang3 的库类

```html
 <dependency>
      <groupId>org.apache.commons</groupId>
      <artifactId>commons-lang3</artifactId>
      <version>3.12.0</version>
  </dependency>

```

使用它的原因是：我们利用 `Optional` 一行代码就可以判断很多空指针是不错，**但最后就算能捕捉异常也不能确定到底是哪个对象的哪个属性为空，如果只是笼统的给出顶层对象的异常信息，对于排错还是不很直观**。当然如果要非常细致地判断和打印日志又会加大代码量，所以想了个折中的办法：**将对象的信息递归地打印出来**，这样是不是空在排查的时候就一目了然了。`ToStringBuilder.reflectionToString`方法可以帮我做到。

```
ToStringBuilder.reflectionToString(test1, new MultilineRecursiveToStringStyle())

```

`MultilineRecursiveToStringStyle` 也可替换为`RecursiveToStringStyle`，只是不同的显示 Style 罢了

如果我只有 test1 对象不为空，剩下的都为空，那么打印结果如下：

```
com.xiaobox.gauva.test.Test1@2a5ca609[
  info=info1,
  test2=<null>
]

```

如果我的 test1 和 test2 对象都不为空，那么打印结果如下：

```
com.xiaobox.gauva.test.Test1@2a5ca609[
  info=info1,
  test2=com.xiaobox.gauva.test.Test2@26be92ad[
    info=<null>,
    test3=<null>
  ]
]

```

**这样的话，我就可以把信息合并到异常信息中，在排查问题时可以借助这些信息快速定位到哪个对象或哪个属性为空了。**

**注意**: 上面的例子中抛出了异常，但因为不是受检异常，所以 IDE 并没有提示我进行捕捉，写代码有些时候忘了捕获异常，所以，请记得它是将异常 `throws` 出去了。处理异常的时候别忘了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-17-gen-zhe-guava-xue-java-zhi-optional/002-b3316990.jpg)

比如一般我们可以这样

```java
private static void opExceptionMethod() throws Exception {
    String info2 = Optional.of(test1)
            .map(Test1::getTest2)
            .map(Test2::getTest3)
            .map(Test3::getTest4)
            .map(Test4::getInfo)
            .orElseThrow(() -> new RuntimeException("有空指针异常，对象内容为： " + ToStringBuilder.reflectionToString(test1, new MultilineRecursiveToStringStyle())));

    System.out.println(info2);
}

```

显式地抛出，调用者就必须要捕获处理了。当然也可以不抛出，直接在代码块 try catch

## 防御性编程

> “
> 
> 使用 Optional 除了赋予 null 语义，增加了可读性，最大的优点在于它是一种傻瓜式的防护。Optional 迫使你积极思考引用缺失的情况，因为你必须显式地从 Optional 获取引用。直接使用 null 很容易让人忘掉某些情形，尽管 FindBugs 可以帮助查找 null 相关的问题，但是我们还是认为它并不能准确地定位问题根源。
> 
> ”

> “
> 
> 如同输入参数，方法的返回值也可能是 null。和其他人一样，你绝对很可能会忘记别人写的方法 method(a,b) 会返回一个 null，就好像当你实现 method(a,b) 时，也很可能忘记输入参数 a 可以为 null。将方法的返回类型指定为 Optional，也可以迫使调用者思考返回的引用缺失的情形。
> 
> ”

## 关于 null 的建议

-   不要在 Set 中使用 null，或者把 null 作为 map 的键值。使用特殊值代表 null 会让查找操作的语义更清晰。

-   如果你想把 null 作为 map 中某条目的值，更好的办法是 不把这一条目放到 map 中，而是单独维护一个”值为 null 的键集合” (null keys)

## 其他

从 Spring 5 开始，可以使用 null 安全注解来帮助编写更安全的代码。此功能称为“空安全性”，这是一组注解，其作用类似于监视潜在的空引用的安全措施。

空安全功能不是让摆脱不安全的代码，而是在编译时生成警告。这样的警告可以防止在运行时发生灾难性的空指针

**注意这些注解只会发出警告，由于有了这个提示，可以提前发现问题，并能够采取适当的措施来避免运行时失败，也就是说你还是可以传递 null 值进来 。**

-   @NonNull 注解 ：可以在需要对象引用的任何地方使用此注解声明非 null 约束：字段，方法参数或方法的返回值。

-   @NonNullFields 注解 ：包（Package）级别注解，通知开发工具默认情况下，带注释的包中的所有字段均为非空。

-   @Nullable 注解：有时，希望免除某些字段，使其不受程序包级别指定的非 null 约束的约束。

-   @NonNullApi 注解 : 包（Package）级别注解，@NonNullFields 仅仅适用于字段。如果希望对方法的**参数和返回值**产生相同的影响，则需要@NonNullApi, 此注解只适用于包级别

看一个例子：

这是 Spring 框架中  Spring-Core 的 `package-info`文件内容

路径为：`/org/springframework/spring-core/5.2.15.RELEASE/spring-core-5.2.15.RELEASE-sources.jar!/org/springframework/core/package-info.java`

```
@NonNullApi
@NonNullFields
package org.springframework.core;

import org.springframework.lang.NonNullApi;
import org.springframework.lang.NonNullFields;

```

## 参考

-   https://coolshell.cn/articles/17757.html
-   https://juejin.cn/post/6844903718375129095
-   https://blog.csdn.net/niugang0920/article/details/116291106
