---
title: "跟着 Guava 学 Java 之字符串处理"
slug: 2022-10-02-gen-zhe-guava-xue-java-zhi-zi-fu-chuan-chu-li
description: "JoinerGuava Joiner顾名思义就是将字符串连接起来  Joiner joiner = Join"
date: 2022-10-02T05:52:52.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-10-02-gen-zhe-guava-xue-java-zhi-zi-fu-chuan-chu-li/cover.jpg
original_url: https://mp.weixin.qq.com/s/geeu6qka3Vghpko90vowbQ
categories:
  - 后端
tags:
  - Java
---
## Joiner

### Guava Joiner

顾名思义就是将字符串连接起来

```java
  Joiner joiner = Joiner.on("; ").skipNulls();

  System.out.println(joiner.join("Harry", null, "Ron", "Hermione"));

  //可以传集合、数组或多个参数
  List<Integer> nums = List.of(1, 2, 3, 4, 5);
  System.out.println(joiner.join(nums));

```

输出：

```
Harry; Ron; Hermione
1; 2; 3; 4; 5

```

上面代码中忽略了 `null` 也可以将 `null` 替换为其他字符串，比如：

```java
System.out.println(Joiner.on("; ").useForNull("**").join(1,2,3,null));

```

Joiner 是线程安全的，一般你可以定义一个 `static final`的常量：

```
static final Joiner joiner = Joiner.on(",");

```

还可以将 map 也 join 起来：

```java
  Joiner.MapJoiner mapJoiner = Joiner.on("; ").withKeyValueSeparator("|");
  Map<String, Integer> testMap = Map.of("a", 1, "b", 2);
  System.out.println(mapJoiner.join(testMap));

```

输出：

```
b|2; a|1

```

### 其他 Joiner

JDK 自身也有 String 的 Joiner API：

```java
  String PREFIX = "[";
  String SUFFIX = "]";
  StringJoiner jdkJoiner = new StringJoiner(",");
  StringJoiner jdkJoiner2 = new StringJoiner(
          ",", PREFIX, SUFFIX);

  System.out.println(jdkJoiner2.add("a").add("b").add("c").toString());

```

可以添加前、后缀，但元素只能一个一个 add，没有 guava 方便 。

如果你是简单的 join 需求，使用 JDK8 以后的 API，直接用 Stream 就完了。

```java
  //use java8 stream
  List<String> rgbList = Arrays.asList("Red", "Green", "Blue");
  String commaSeparatedRGB = rgbList.stream()
          .map(color -> color.toString())
          .collect(Collectors.joining(","));

  System.out.println(commaSeparatedRGB);

```

### 总结

简单 join 直接 stream 流式一行代码搞定，特殊点的看看 Guava 的 joiner 支不支持，一般 Guava 的 Joiner 够用了。再搞不定的自己写个工具类方法吧。

## Splitter

### JDK 内建

JDK 内建的字符串拆分工具有一些古怪的特性。比如，`String.split`悄悄丢弃了尾部的分隔符。

```java
System.out.println(Arrays.toString(",a,,b,".split(",")));

//输出 [, a, , b]

```

当然还有 `StringTokenizer`  这种更繁琐的东西：

```java
  String str = "runoob,google,taobao,facebook,zhihu";
  // 以 , 号为分隔符来分隔字符串
  StringTokenizer st=new StringTokenizer(str,",");
  while(st.hasMoreTokens()) { 
      System.out.println(st.nextToken());
  }

```

### Guava Splitter

`Splitter`使用令人放心的、直白的流畅 API 模式对这些混乱的特性作了完全的掌控。

```java
Iterable<String> split = Splitter.on(',')
                .trimResults()
                .omitEmptyStrings()
                .split("foo,bar,,   qux");

System.out.println(split.toString());

//输出 [foo, bar, qux]

```

Splitter 可以被设置为按照任何   `Pattern`, `char`, `String`, 或者 `CharMatcher`拆分。

| 方法 | 描述 | 范例 |
| --- | --- | --- |
| `Splitter.on(char)` | 按单个字符拆分 | Splitter.on(';') |
| `Splitter.on(CharMatcher)` | 按字符匹配器拆分 | Splitter.on(CharMatcher.anyOf(";,.")) |
| `Splitter.on(String)` | 按字符串拆分 | Splitter.on(",") |
| `Splitter.on(Pattern)` `Splitter.onPattern(String)` | 按正则表达式拆分 | Splitter.onPattern("\\r?\\n") |
| `Splitter.fixedLength(int)` | 按固定长度拆分；最后一段可能比给定长度短，但不会为空。 | Splitter.fixedLength(3) |

列举一些 Splitter 的方法

| 方法 | 描述 |
| --- | --- |
| `omitEmptyStrings()` | 从结果中自动忽略空字符串 |
| `trimResults()` | 移除结果字符串的前导空白和尾部空白 |
| `trimResults(CharMatcher)` | 给定匹配器，移除结果字符串的前导匹配字符和尾部匹配字符 |
| `limit(int)` | 限制拆分出的字符串数量 |

注意 `trimResults(CharMatcher)` ，它是把所有前导字符干掉外加尾部能匹配上的字符，举个例子：

```java
// 可以看到，前缀都没了，尾部与 “_” 匹配上的只有 “c__”，所以干掉了一个 “_”，剩下 “c_”
System.out.println(Splitter.on(',').trimResults(CharMatcher.is('_')).split("_a ,_b_ ,c__").toString());

```

上面的代码返回 ：`[a , b_ , c]` ，

同 `Joiner` 一样，`Splitter`实例也是线程安全的，所以可以定义为 `static final`

```
static final  Splitter  splitter = Splitter.on(",").omitEmptyStrings().trimResults();

```

还可以利用 `MapSplitter` 把字符串反序列化成 Map，例如：

```java
  @Test
  public void testMapSplitter() {

      String startSring = "Washington D.C=Redskins#New York City=Giants#Philadelphia=Eagles#Dallas=Cowboys";
      Map<String, String> testMap = Maps.newLinkedHashMap();
      testMap.put("Washington D.C", "Redskins");
      testMap.put("New York City", "Giants");
      testMap.put("Philadelphia", "Eagles");
      testMap.put("Dallas", "Cowboys");
      Splitter.MapSplitter mapSplitter = Splitter.on("#").withKeyValueSeparator("=");
      Map<String, String> splitMap = mapSplitter.split(startSring);

      assertEquals(testMap, splitMap);
  }

```

## CharMatcher

Guava 为我们提供了字符匹配器，你可以认为一个`CharMatcher`实例代表着某一类字符，如数字或空白字符。CharMatcher 还提供了一系列方法，让你对字符进行特定类型的操作：修剪 [trim]、折叠 [collapse]、移除 [remove]、保留 [retain] 等等。

所以使用 CharMatcher，大致分两步

-   第一步：定义 CharMatcher，定义怎样算“匹配” 到字符
-   第二步：如何处理匹配到的这些字符

下面我们用一些小例子来说明：

将 "  1   2   3 4 6    9   " 转换成 "1 2 3 4 6 9"  去掉多余的空格，用空格间隔每个字符

```java
// 我们先定义“空白” 然后折叠连续的空白并用一个空格代替，同时修剪掉首尾的空格
String tmpStr = "  1   2   3 4 6    9   " ;
String result = CharMatcher.whitespace().trimAndCollapseFrom(tmpStr,' ');
System.out.println(result);

```

获取 0-6 范围内的数字字符

```java
String tmpStr = "df67sn18kj9" ;
String result = CharMatcher.inRange('0','6').retainFrom(tmpStr) ;
System.out.println( result);

```

获取 d-k 范围内的数字字符

```java
String tmpStr = "df67sn18kj9" ;
String result = CharMatcher.inRange('d','k').retainFrom(tmpStr) ;
System.out.println( result); 

```

去掉特殊字符

```
String input = "H*el.lo,}12";
CharMatcher matcher = CharMatcher.javaLetterOrDigit();
String result = matcher.retainFrom(input);

assertEquals("Hello12", result);

```

去掉非 ASCII 码字符

```
String input = "あ hello₤";

String result = CharMatcher.ascii().retainFrom(input);
assertEquals("hello", result);

result = CharMatcher.inRange('0', 'z').retainFrom(input);
assertEquals("hello", result);

```

过滤或筛选字符串中的汉字

```java
  //单字节匹配器（汉字是双字节） 不要汉字
  System.out.println("去除双字节，获取单字节：" + CharMatcher.singleWidth().retainFrom(matchStr));
  //只留汉字
  System.out.println("去除单字节，获取双字节：" + CharMatcher.singleWidth().removeFrom(matchStr));

```

### 方法分类

看完上面的例子，你可能对 CharMatcher 的方法感兴趣了，CharMatcher 一类分三类

第一类是判定型函数，判断 `CharMacher` 和入参字符串的匹配关系。

```
CharMatcher.is('a').matchesAllOf("aaa");//true
CharMatcher.is('a').matchesAnyOf("aba");//true
CharMatcher.is('a').matchesNoneOf("aba");//true

```

第二类是计数型函数，查找入参字符串中第一次、最后一次出现目标字符的位置，或者目标字符出现的次数，比如 `indexIn`，`lastIndexIn` 和 `countIn`。

```
CharMatcher.is('a').countIn("aaa"); // 3
CharMatcher.is('a').indexIn("java"); // 1

```

第三类就是对匹配字符的操作。包括 `removeFrom`、`retainFrom`、`replaceFrom`、`trimFrom`、`collapseFrom` 等。

### 方法清单

拉个单子方便查

|
 |
 |
| --- | --- |
| 方法 | 描述 |
| CharMatcher is(char match) | 返回匹配指定字符的 Matcher |
| CharMatcher isNot(char match) | 返回不匹配指定字符的 Matcher |
| CharMatcher anyOf(CharSequence sequence) | 返回匹配 sequence 中任意字符的 Matcher |
| CharMatcher noneOf(CharSequence sequence) | 返回不匹配 sequence 中任何一个字符的 Matcher |
| CharMatcher inRange(char startInclusive, char endIncludesive) | 返回匹配范围内任意字符的 Matcher |
| CharMatcher forPredicate(Predicate<? super Charater> predicate) | 返回使用 predicate 的 apply() 判断匹配的 Matcher |
| CharMatcher negate() | 返回以当前 Matcher 判断规则相反的 Matcher |
| CharMatcher and(CharMatcher other) | 返回与 other 匹配条件组合做与来判断的 Matcher |
| CharMatcher or(CharMatcher other) | 返回与 other 匹配条件组合做或来判断的 Matcher |
| boolean matchesAnyOf(CharSequence sequence) | 只要 sequence 中有任意字符能匹配 Matcher, 返回 true |
| boolean matchesAllOf(CharSequence sequence) | sequence 中所有字符都能匹配 Matcher, 返回 true |
| boolean matchesNoneOf(CharSequence sequence) | sequence 中所有字符都不能匹配 Matcher, 返回 true |
| int indexIn(CharSequence sequence) | 返回 sequence 中匹配到的第一个字符的坐标 |
| int indexIn(CharSequence sequence, int start) | 返回从 start 开始，在 sequence 中匹配到的第一个字符的坐标 |
| int lastIndexIn(CharSequence sequence) | 返回 sequence 中最后一次匹配到的字符的坐标 |
| int countIn(CharSequence sequence) | 返回 sequence 中匹配到的字符计数 |
| String removeFrom(CharSequence sequence) | 删除 sequence 中匹配到到的字符并返回 |
| String retainFrom(CharSequence sequence): | 保留 sequence 中匹配到的字符并返回 |
| String replaceFrom(CharSequence sequence, char replacement) | 替换 sequence 中匹配到的字符并返回 |
| String trimFrom(CharSequence sequence) | 删除首尾匹配到的字符并返回 |
| String trimLeadingFrom(CharSequence sequence) | 删除首部匹配到的字符 |
| String trimTrailingFrom(CharSequence sequence) | 删除尾部匹配到的字符 |
| String collapseFrom(CharSequence sequence, char replacement) | 将匹配到的组（连续匹配的字符）替换成 replacement |
| String trimAndCollapseFrom(CharSequence sequence, char replacement) | 先 trim 在 replace |

## CaseFormat

CaseFormat 被用来方便地在各种 ASCII 大小写规范间转换字符串——比如，编程语言的命名规范。CaseFormat 支持的格式如下：

| 格式 | 范例 |
| --- | --- |
| `LOWER_CAMEL` | lowerCamel |
| `LOWER_HYPHEN` | lower-hyphen |
| `LOWER_UNDERSCORE` | lower\_underscore |
| `UPPER_CAMEL` | UpperCamel |
| `UPPER_UNDERSCORE` | UPPER\_UNDERSCORE |

CaseFormat 的用法很直接：

```
CaseFormat.UPPER_UNDERSCORE.to(CaseFormat.LOWER_CAMEL, "CONSTANT_NAME")); // returns "constantName"

```

CaseFormat 在某些时候尤其有用，比如编写代码生成器的时候。

## Strings

Strings 工具类也提供了许多好用的处理字符串的方法，比如简单和见名知义就不多说了。

## 参考

-   https://www.runoob.com/w3cnote/java-stringtokenizer-intro.html
-   https://www.baeldung.com/guava-string-charmatcher
-   https://github.com/google/guava/wiki/StringsExplained#splitter
-   https://mindawei.github.io/2018/03/17/Guava 学习之 CharMatcher/
