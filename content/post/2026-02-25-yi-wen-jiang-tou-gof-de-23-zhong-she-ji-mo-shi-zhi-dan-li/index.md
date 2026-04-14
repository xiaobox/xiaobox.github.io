---
title: "一文讲透 GoF 的 23 种设计模式之单例"
slug: 2026-02-25-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-dan-li
description: "一文讲透 GoF 的 23 种设计模式之单例单例模式--Singleton 是创建型模式定义确保一个类在一个"
date: 2026-02-25T10:13:49.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-25-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-dan-li/cover.jpg
original_url: https://mp.weixin.qq.com/s/_TKIOqfG6Yco7BV141w70A
categories:
  - 架构与方法
tags:
  - Java
  - JVM
  - 缓存
  - 设计模式
  - 多线程
---
# 一文讲透 GoF 的 23 种设计模式之单例

单例模式--Singleton 是创建型模式

## 定义

**确保一个类在一个 JVM 内只有一个实例，并提供全局访问点**

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-25-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-dan-li/001-d2d7932d.png)

## 什么时候用?

●配置中心、缓存管理器、日志器（有时）

●需要全局共享状态/资源

对于 那些初始化很贵，重复创建又特别浪费资源的场景非常合适 。

## 不要滥用

单例本质是“全局变量 + 访问入口”，会增加耦合、影响测试

## 实现方式

以下为常见的 5 种实现方式对比。

| 实现方式 | 核心机制简述 | 并发安全性 (线程安全) | 性能表现 | 核心易错点 / 致命缺陷 | 综合推荐度 |
| --- | --- | --- | --- | --- | --- |
| 1. 饿汉式(Eager) | 类加载时立即创建静态 final 实例。 | 安全(JVM类加载机制保证) | 高 (运行时)获取实例无锁。但可能会拖慢系统启动速度，且如果不用会浪费内存。 | 低实现简单，不易出错。缺点是无法进行懒加载，且难以传递动态参数进行初始化。 | ⭐⭐⭐ |
| 2. 懒汉式(同步方法) | 在 getInstance 方法上加 synchronized 锁。 | 安全(粗粒度锁保证) | 非常低每次调用 getInstance 都要发生线程竞争和锁获取，高并发下是严重的性能瓶颈。 | 低实现简单。主要的"错"是选择了这种低效的方案。 | ⭐ |
| 3. 双重检查锁(DCL) | 两次判空 + 同步代码块 + volatile 关键字。 | 安全 (有前提)必须在实例变量上加 volatile 禁止指令重排序。 | 高只在第一次初始化时加锁，后续调用无锁。实现了高性能的懒加载。 | 极高 (致命)最常见的错误是忘记加 volatile 关键字。这会导致多线程环境下，某个线程可能会拿到一个"半初始化"的对象，引发难以排查的 Bug。 | ⭐⭐⭐ |
| 4. 静态内部类(Holder模式) | 利用 JVM 加载外部类时不加载静态内部类的特性实现懒加载。 | 安全(JVM类加载机制保证) | 高既实现了懒加载，又在获取实例时没有任何锁机制，性能优异。 | 低非常规整的写法。唯一需要注意的是要确保构造函数私有，防止外部意外实例化。 | ⭐⭐⭐⭐⭐ (手动实现首选) |
| 5. 枚举(Enum) | 利用 Java 枚举类型的特殊语法和底层实现。 | 安全 (天然)(JVM 层面保障，防御反射和序列化攻击) | 高类似于饿汉式，类加载时完成初始化，运行时无锁。 | 极低代码最简洁，几乎不可能写错。缺点是无法继承其他类，且在语义上用来做复杂业务对象时显得突兀。 | ⭐⭐⭐⭐⭐ (最安全简洁) |

重点说明两种实现方式：枚举和静态内部类。

### 枚举

这是 Java 最简洁实现。Java 的 Enum 在语言层面有一些特殊保证（例如不会被克隆），这也是它常被用来实现单例的原因之一。

```java
⚡ java片段public enum AppConfig {
    INSTANCE;

    private String env = "prod";

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }

    public static void main(String[] args) {
        AppConfig c1 = AppConfig.INSTANCE;
        AppConfig c2 = AppConfig.INSTANCE;

        c1.setEnv("test");

        System.out.println(c1 == c2);          // true
        System.out.println(c2.getEnv());       // test
    }
}

```

使用枚举（enum）来实现单例模式，被《Effective Java》的作者 Joshua Bloch 称为 **“实现单例模式的最佳方法”**。

它之所以备受推崇，是因为它用极其简洁的代码，完美解决了传统单例模式面临的线程安全、序列化破坏和反射破坏三大难题

**原理一：利用 JVM 类加载机制保证“线程安全”**

在传统的懒汉式单例中，为了保证多线程下只创建一个实例，我们需要写复杂的“双重检查锁（Double-Checked Locking）”并加上 volatile 关键字。

而枚举怎么做的？

当你定义 INSTANCE 时，编译器底层实际会把它转化为类似这样的代码：

⚡ java片段`public static final AppConfig INSTANCE = new AppConfig();`

Java 虚拟机（JVM）在加载类的时候，会利用底层的类加载机制保证静态成员的初始化是绝对线程安全的。在这个类被加载到内存时，JVM 会自动实例化 INSTANCE 且只实例化一次，整个过程由 JVM 内部加锁保证同步，不需要你手动写任何并发控制代码。

**原理二：天生防御“反射攻击”**

传统的单例模式有一个致命弱点：恶意代码可以通过 Java 的反射机制（Reflection）把私有构造函数设置为可见（setAccessible(true)），从而强行 new 出新的实例，打破单例。

而枚举怎么做的？

Java 的反射 API 从源码级别就直接“封杀”了通过反射创建枚举实例的可能性。如果你去看 Constructor.newInstance() 的 Java 底层源码，会发现有一段明确的校验逻辑：

```
⚡ java片段if ((clazz.getModifiers() & Modifier.ENUM) != 0)
    throw new IllegalArgumentException("Cannot reflectively create enum objects");

```

也就是说，**一旦 JVM 发现你要用反射去创建枚举类的对象，就会直接抛出异常**，从根本上杜绝了反射攻击。

**原理三：天生防御“序列化破坏”**

传统的单例对象如果实现了 Serializable 接口，在进行网络传输或持久化到磁盘再反序列化读取回来时，默认会重新分配内存，生成一个全新的对象。传统做法是必须手动写一个 readResolve() 方法来返回原实例。

而枚举怎么做的？

Java 规范对枚举的序列化有特殊的规定。枚举在序列化的时候，仅仅是将枚举常量的名称（name）输出到了结果中；在反序列化的时候，Java 会调用 java.lang.Enum.valueOf() 方法，通过名字去查找并返回内存中已经存在的那个常量对象。

因此，无论你反序列化多少次，拿到的永远是内存里的同一个 INSTANCE 对象。

总结来说：枚举单例的核心原理就是 **直接利用 Java 语言底层的机制**：

●用 JVM 类加载机制 搞定了线程安全。

●用 反射 API 的硬编码拦截 搞定了反射破坏。

●用 特殊的名称匹配机制 搞定了序列化破坏。

在理论上，枚举单例确实是“最完美”的单例实现；但在实际的工程代码中，它的出场率确实不高。这并不是因为枚举本身有 bug，而是因为它在现代工程架构、面向对象设计理念以及测试友好度上，存在一些不可避免的局限性

具体来说，有以下几个核心原因：

1.**现代框架（如 Spring）接管了单例的管理** 这是最根本的原因。在现代 Java 工程中（尤其是企业级开发），我们几乎不再手动编写任何单例模式了。 我们广泛使用 Spring/Spring Boot 这样的依赖注入（DI）框架。在 Spring 中，你只需要在一个普通的类上加上 @Service、@Component 或 @Configuration 注解，Spring 容器（IoC Container）就会默认将其作为一个单例来管理。框架不仅帮你保证了单例，还能帮你自动注入其他依赖（如数据库连接、其他服务），这比用枚举手写单例要强大、灵活得多。

2.**违反了“语义”和开发者的直觉** 代码不仅是给机器运行的，更是给人读的。 枚举的本来语义：代表一组固定的常量集合（如星期、颜色、订单状态）。单例的语义：通常是一个拥有复杂业务逻辑的管理类（如 UserManager、DatabaseConnectionPool）。

如果把一个复杂的业务服务写成 enum，会让接手代码的其他开发者感到困惑，这违反了“最小惊讶原则（Principle of Least Astonishment）”。感觉就像是“为了用单例模式而强行用枚举”。

3.**面向对象特性的缺失（无法继承）** Java 规定，所有的枚举类都隐式继承了 java.lang.Enum。因为 Java 不支持多重继承，这意味着你的枚举单例不能再继承任何其他的父类。 如果你的架构需要 AppConfig 继承一个 BaseConfig 类来复用代码，枚举单例直接就做不到。 虽然枚举可以实现接口（implements Interface），但在需要共享基类代码的场景下，它的表现非常无力。

4.**传参初始化非常困难** 在工程实践中，单例对象在初始化时往往需要外部参数。比如，一个数据库连接池单例，在启动时需要读取配置文件里的 url 和 password。 普通的单例模式或 Spring 管理的 Bean，可以在运行时读取配置后，再进行初始化。 枚举常量的实例化是在类加载的最早期进行的，这个时候你很难把运行时的参数优雅地传递给枚举的构造函数。

5.**极难进行单元测试（Mock）** 在做单元测试时，我们经常需要把某些依赖的单例对象“Mock（模拟）”掉（比如使用 Mockito），以隔离测试环境。 普通类别的单例很容易被 Mock 框架替换。但是，枚举是静态的全局常量，它的生命周期和类加载器绑定。在测试中强行替换枚举实例极其困难，容易导致测试用例之间互相污染。

在实际工程中：

●如果你要写一个完全无状态、不需要继承、不依赖外部配置的纯工具类/简单配置类，用枚举单例确实不错。

●但对于包含业务逻辑、需要依赖注入、需要被测试的类，交给 Spring 等框架去管理才是工业界的最佳实践。

### 静态内部类

如果你不想用枚举，又想要一个**既能延迟加载（懒汉式），又绝对线程安全，还能完美避开繁琐的加锁（synchronized）** 的单例，静态内部类是最佳选择。

```java
⚡ java片段public class DatabaseConnectionPool {

    // 1. 私有化构造函数，防止外部 new
    private DatabaseConnectionPool() {
        // 可选：在这里加上防御反射攻击的代码
        if (SingletonHolder.INSTANCE != null) {
            throw new RuntimeException("不允许通过反射创建单例！");
        }
    }

    // 2. 核心：定义一个私有的静态内部类
    // 这个类直到被调用时才会被 JVM 加载
    private static class SingletonHolder {
        // 由 JVM 保证这里的实例化是绝对线程安全的
        private static final DatabaseConnectionPool INSTANCE = new DatabaseConnectionPool();
    }

    // 3. 提供全局访问点
    public static DatabaseConnectionPool getInstance() {
        // 只有在调用这里时，SingletonHolder 才会被加载，从而实例化 INSTANCE
        return SingletonHolder.INSTANCE;
    }
}

```

为什么它很巧妙？

●懒加载（Lazy Loading）：当你加载 DatabaseConnectionPool 这个类时，内部类 SingletonHolder 并不会被立刻加载。只有当你真正调用 getInstance() 方法时，内部类才会被加载，对象才会被创建。这就节省了内存。

●零并发负担：它没有使用任何 synchronized 或者 volatile 关键字。它完全将线程安全的控制权交给了 JVM 底层的类加载机制（JVM 在加载一个类时，会自动加锁保证全局唯一）。

## Spring 是如何实现单例的？

Spring 里的单例（Singleton）和我们在《设计模式》书里学到的单例，在概念和实现思路上有很大的不同。

●传统单例（GoF单例）：保证在一个 JVM（准确地说是类加载器）级别，某个类只有一个实例。类自己控制自己的实例化。

●Spring 单例：保证在一个 Spring IoC 容器（ApplicationContext）内部，某个指定的 Bean 名称只有一个实例。它是由 Spring 框架来统一管理的。

Spring 实现单例的核心原理可以概括为：**单例注册表（Singleton Registry）**

### 1. 核心数据结构：ConcurrentHashMap

如果你翻开 Spring 的底层源码（DefaultSingletonBeanRegistry 类），你会发现 Spring 管理单例的本质，就是一个大大的缓存 Map：

```
⚡ java片段// Spring 源码中的 "一级缓存"，存放所有完全初始化好的单例 Bean
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

```

Spring 的单例其实就是把创建好的对象塞进了一个线程安全的 ConcurrentHashMap 里。Key 是 Bean 的名字（通常是类名首字母小写），Value 就是这个类的实例对象。

### 2. Spring 创建单例的流程

当你在代码里注入一个单例（比如通过 @Autowired），或者调用 context.getBean("myService") 时，Spring 大致会经历以下步骤：

1.查缓存：Spring 首先会去 singletonObjects 这个 Map 里查，看看有没有叫 "myService" 的对象。

2.有则返回：如果 Map 里有，说明已经创建过了，直接把这个对象返回给你。这就是单例的体现。

3.无则创建并加锁：如果 Map 里没有，Spring 就会准备创建它。为了保证在多线程环境下只有一个线程能去创建这个 Bean，Spring 会对这个 Bean 的名字进行加锁（通常是通过对全局单例集合的锁或者特定的互斥锁来实现同步）。

4.实例化与初始化：Spring 通过反射调用构造函数把对象 new 出来，然后进行属性填充（依赖注入），再调用 @PostConstruct 等初始化方法。

5.放入 Map 并返回：最后，把完全准备好的对象放进 singletonObjects 这个 ConcurrentHashMap 里，然后返回给你。以后所有对这个 Bean 的请求，都直接从 Map 里拿。

### 3. 补充：循环依赖的杀手锏“三级缓存”

Spring 在管理单例时，还要解决一个传统单例很难解决的问题——循环依赖（比如 A 依赖 B，B 又依赖 A）。

为了解决这个问题，Spring 其实并没有只用一个 Map，而是用了三个 Map（传说中的三级缓存）：

●一级缓存（singletonObjects）：存完整的、可用的单例对象。

●二级缓存（earlySingletonObjects）：存半成品对象（刚 new 出来，但还没注入属性的对象），用于提前暴露自己，打破循环。

●三级缓存（singletonFactories）：存对象工厂，用于在需要时生成代理对象（比如处理 AOP 切面）。

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2026-02-25-yi-wen-jiang-tou-gof-de-23-zhong-she-ji-mo-shi-zhi-dan-li/002-5ae19680.svg)

结合上面的图，核心过程如下：

第一阶段：A 的创建与曝光

1.调用 getBean(A)：Spring 容器开始创建 Bean A。

2.实例化 A：调用构造函数，A 对象在内存中诞生，但属性（如 B）还是 null。

3.暴露三级缓存：Spring 将 A 的工厂对象放入 三级缓存 (singletonFactories)。这是解决循环依赖的关键一步，意味着此时如果有其他对象引用 A，可以通过这个工厂拿到 A 的引用。

第二阶段：A 填充属性，触发 B 的创建

4.填充属性 B：A 发现自己依赖 B，于是暂停自己，转而去创建 B。

第三阶段：B 的创建与获取 A

5.实例化 B：B 对象诞生，属性（如 A）还是 null。

6.暴露三级缓存：将 B 的工厂放入三级缓存。

7.填充属性 A：B 发现自己依赖 A，于是尝试去缓存找 A。

第四阶段：B 从缓存中找到 A (核心转折)

8.查找缓存：

●找一级缓存？没有（A 还没彻底完工）。

●找二级缓存？没有（还没人提取过 A 的早期引用）。

●找三级缓存？有了！

9.升级缓存：

●B 调用三级缓存中的工厂方法，拿到 A 的早期引用。

●重点：如果 A 配置了 AOP（比如事务管理），这个工厂会提前生成 A 的代理对象。

●将 A 的早期引用放入 二级缓存 (earlySingletonObjects)，并从三级缓存移除。

10.B 完成：B 拿到了 A 的引用，完成属性填充和初始化，放入 一级缓存。

第五阶段：A 完成

11.A 获取 B：B 已经创建好了，A 顺利拿到 B 的引用。

12.A 完成：A 完成属性填充和初始化，放入 一级缓存。
