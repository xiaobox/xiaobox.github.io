---
title: "搞懂 ThreadLocal，其实就三件事：它是谁？它在哪？用完它咋办？"
slug: 2025-08-21-gao-dong-threadlocal-qi-shi-jiu-san-jian-shi-ta-shi-shui-ta-
description: "缘起这两天又用到了 ThreadLocal ,时间一长，很多细节都想不起来了，现翻源码 😂想着干脆写个笔记记"
date: 2025-08-21T10:52:24.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-21-gao-dong-threadlocal-qi-shi-jiu-san-jian-shi-ta-shi-shui-ta-/cover.jpg
original_url: https://mp.weixin.qq.com/s/zcxAZacibIw3ILUBZEPwaw
categories:
  - 后端
tags:
  - Java
  - JVM
  - 多线程
---
# 缘起

这两天又用到了 `ThreadLocal` ,时间一长，很多细节都想不起来了，现翻源码 😂

想着干脆写个笔记记录一下，其实之前写过有关 `ThreadLocal` 的文章，现在回过头看觉得一些细节写的交待的不好，那么就再写一遍吧。

这一次的目标就是搞清楚 **Threadlocal 它到底是怎么隔离线程数据的，好在哪？**

当然也要挖一挖那个潜在的 **内存泄漏风险**，看看它在 Java 不同版本里头有没有啥变化。

# ThreadLocal 它根本上是干嘛的？

简单来说， ThreadLocal 就是给每个线程(注意是每个线程) 一个变量的独立副本。

你可以想象一下，比如说用户 ID 或者一个事务 ID 这种需要跟某个线程绑定的数据，用它就特别合适。**它解决的不是那种多线程怎么共享数据的问题，而是怎么管好单个线程自己用的数据。**

# 反向存储

它用了一个挺有意思的设计，有人叫它 “反向存储”

我根据 ThreadLocal 的内部结构梳理了一个结构图，如下：

```bash
$ terminal┌─────────────────────────────────────────────────────────────────┐
│                    JVM 堆内存 - 全局共享区域                       │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  ThreadLocal1   │    │  ThreadLocal2   │  ← 全局唯一实例       │
│  │   (COUNTER)     │    │    (NAME)       │    所有线程共享       │
│  └─────────────────┘    └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
          ↑                        ↑
          │ 作为key引用             │ 作为key引用

┌─────────────────────────────────────────────────────────────────┐
│                         线程独立存储区域                          │
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │    Thread-1     │              │    Thread-2     │           │
│  │                 │              │                 │           │
│  │  threadLocals ──┼──┐        ┌──┼── threadLocals  │           │
│  └─────────────────┘  │        │  └─────────────────┘           │
│                       │        │                                │
│  ┌────────────────────▼──┐  ┌──▼────────────────────┐           │
│  │   ThreadLocalMap-1    │  │   ThreadLocalMap-2    │           │
│  │                       │  │                       │           │
│  │  Entry[] table        │  │  Entry[] table        │           │
│  │  ┌─────────────────┐  │  │  ┌─────────────────┐  │           │
│  │  │ Entry[0]        │  │  │  │ Entry[0]        │  │           │
│  │  │ key: COUNTER    │  │  │  │ key: COUNTER    │  │           │
│  │  │ value: 100      │  │  │  │ value: 200      │  │           │
│  │  └─────────────────┘  │  │  └─────────────────┘  │           │
│  │  ┌─────────────────┐  │  │  ┌─────────────────┐  │           │
│  │  │ Entry[1]        │  │  │  │ Entry[1]        │  │           │
│  │  │ key: NAME       │  │  │  │ key: NAME       │  │           │
│  │  │ value:"Thread1" │  │  │  │ value:"Thread2" │  │           │
│  │  └─────────────────┘  │  │  └─────────────────┘  │           │
│  └───────────────────────┘  └───────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

```

从图上可以看到，实际上是每个 `Thread` 对象它自己内部持有一个map，这个 map 就是 `ThreadLocalMap`，每个线程都有一个。

我们从源码中也能看到：

```java
$ terminal// Thread 类的关键字段（简化版）
public class Thread implements Runnable {
    // 每个 Thread 实例都有自己独立的这个字段！
    ThreadLocal.ThreadLocalMap threadLocals = null;
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
    
    // 其他字段...
}

```

然后那个  ThreadLocal 变量本身就是我们代码里定义的那个，通常是个 static final 的全局变量。它其实是充当了所有这些不同的 `ThreadLocalMap` 里面的 entry 的 key。

```bash
$ terminal// ThreadLocalMap 的关键实现
static class ThreadLocalMap {
    // Entry 继承 WeakReference，key 是 ThreadLocal 对象的弱引用
    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;
        
        Entry(ThreadLocal<?> k, Object v) {
            super(k);  // k 是全局共享的 ThreadLocal 对象
            value = v; // v 是线程独立的值
        }
    }
    
    // 每个 ThreadLocalMap 都有自己独立的 Entry 数组
    private Entry[] table;
    
    // 构造函数：每个线程调用时都会创建新的实例
    ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
        table = new Entry[INITIAL_CAPACITY];
        int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
        table[i] = new Entry(firstKey, firstValue);
        size = 1;
        setThreshold(INITIAL_CAPACITY);
    }
}

```

就是说 `Threadlocal` 这个钥匙是大家都能看到的，是共享的，但是存东西的柜子也就是 `ThreadLocalMap` 是每个线程自己的，是互相隔离的。

## 内部存储

**这个 ThreadLocalMap 它怎么通过 ThreadLocal 这个键找到对应的值呢？它里面是咋存的？**

实际上它是用 ThreadLocal 实例本身的哈希码，这个哈希码会经过一个计算，然后确定在 map 内部数组里的一个位置。这个计算方法还挺讲究的，用了一个特殊的数字，就是为了让这些键能均匀地散开。

```bash
$ terminal// 构造函数：每个线程调用时都会创建新的实例
ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
    table = new Entry[INITIAL_CAPACITY];
    int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
    table[i] = new Entry(firstKey, firstValue);
    size = 1;
    setThreshold(INITIAL_CAPACITY);
}

```

> ThreadLocal中有一个属性为HASH\_INCREMENT = 0x61c88647。这个值很特殊，它是斐波那契数 也叫 黄金分割数。hash增量为 这个数字，带来的好处就是 hash 分布非常均匀。

要是算出来的位置已经被占了，就是所谓的哈希冲突，它就用一种叫**线性探测**的方法来解决，简单说就是如果这个位置有人了，他就看下一个位置空不空，再不行就再看下一个，一直找到空位为止。

因为这个 map 是线程私有的，不存在多个线程同时来抢位置的问题，所以这种简单的方法就够用了，效率也还行。

## 隔离机制

这个 “反向存储” ，有点儿反直觉：不是 ThreadLocal 对象持有多个线程的值，而是 每个 Thread 对象持有自己的 ThreadLocalMap，ThreadLocalMap 以 ThreadLocal 对象为 key，存储该线程的值。

我们再具体总结一下 ThreadLocal 的隔离机制，实际上它是一个 "部分共享，部分独立" 的机制。

1.ThreadLocal 对象全局共享：static final 修饰，JVM 中只有一个实例，所有线程都引用同一个 ThreadLocal 对象

2.ThreadLocalMap 线程独立：存储在 Thread.threadLocals 字段中，每个 Thread 实例都有自己的 threadLocals 字段，调用 createMap() 时，给不同线程创建不同的 ThreadLocalMap 实例

3.Entry 数组线程独立：每个 ThreadLocalMap 都有自己的 Entry[] table，虽然 Entry 的 key 都指向同一个 ThreadLocal 对象，但 Entry 对象本身和 value 都是线程独立的

> “ThreadLocal 就是一把“通用钥匙”，它不存东西，而是帮每个线程打开自己的“专属保险箱”。”

这就是 ThreadLocal 精妙设计的核心：通过线程对象的实例字段实现存储隔离，通过全局 ThreadLocal 对象实现访问统一。

# 内存泄露风险

这个风险主要来自于 `ThreadLocalMap` 存数据的方式。特别是它的键，这个 map 里面的键也就是咱们那个 `ThreadLocal` 对象实例，它不是直接存的，它是被一个叫做 `weak reference`，也就是弱引用的东西包了一层

## 弱引用

这个弱引用跟我们平时用的那种普通的引用就是强引用有啥不一样？

咱们平时用的强引用，只要这个引用还在，垃圾回收器（GC） 就不会把那个对象收走，但弱引用不一样， GC 在扫描的时候如果发现一个对象只被弱引用指着，没有强引用指向它了，那 GC 就可以把它回收掉。所以在 `ThreadLocalMap` 这里，如果你代码里别的地方不再持有那个 `Threadlocal` 实例的强引用了,比如说那个类被卸载了，或者实例变量不再被访问了,类似这种情况，那 GC 就可能把这个 Threadlocal 对象本身回收掉，这时候 map 里面那个 entry 的键就变成了null。

### 键没了，变成 null 了，那不是正好吗？

键没了，变成 null 了，说明这个条目没用了，可以清掉了。那不是正好吗？

坑就在这，虽然键是弱引用， GC 可能回收它，但是和这个键关联的那个值（value），它是被强引用持有的。持有它就是 Threadlocalmap 里面的那个 entry 对象，这个 entry 对象本身强引用着那个 value。

我们来捋一下：**Threadlocal 键被弱引用包装，可能被 GC 回收变 null，但存的那个 value 被 entry 对象强引用。 然后这个 entry 对象又被 ThreadLocalMap 持有，ThreadLocalMap 又被那个 Thread 对象持有。**

整个引用链条如下：

![图片](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-08-21-gao-dong-threadlocal-qi-shi-jiu-san-jian-shi-ta-shi-shui-ta-/001-9dc9dd97.png)

只要这个线程还活着，比如线程池里的线程（它可能活很久，线程池里的线程会复用），然后如果这个线程后续一直没有再调用这个 Threadlocal 的 set、get 或者 remove 方法，这些方法在执行的时候会顺便检查一下清理掉那些键为 null 的entry，但如果一直没调用，那这个键虽然是 null 了，但那个 value 因为被 entry 强引用着，就一直没法被 GC 回收。**这就泄露了。那个 value 对象就一直占着内存，明明逻辑上可能已经没用了。这就是典型的 Threadlocal 内存泄露场景**

### 那为啥不干脆把那个 value 也用弱引用呢？

那样的话 Threadlocal 可能就失去意义了。你想啊，那个 value 是线程真正需要的数据，比如一个数据库连接，如果它也是弱引用，那可能在你正用得好好的时候，突然就被 GC 给回收了。那下次去 get 的时候拿到了可能就是 null 了，即使我没 remove 它。那程序可能就出错了。**所以用强引用是为了保证只要线程逻辑上还需要这个值，并且没显示的remove，它就应该一直在。**

这是在保证数据可用性和自动内存管理之间做了一个权衡，他选择了优先保证数据，但这个选择就把一部分清理的责任甩给了开发者。

### 这对开发者意味着什么 ？

意味着你必须养成一个习惯，非常非常重要的习惯，就是在使用完 Threadlocal 变量之后，一定要最好是在 finally 块里头调用那个 Threadlocal 的 remove 方法。

比如：

```java
$ terminalpublic class ConnectionManager {
    private static final ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();

    public static Connection getConnection() throws SQLException {
        Connection conn = connectionHolder.get();
        if (conn == null || conn.isClosed()) {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/test", "root", "password");
            connectionHolder.set(conn);
        }
        return conn;
    }

    public static void closeConnection() {
        Connection conn = connectionHolder.get();
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                connectionHolder.remove();
            }
        }
    }
}

```

这个 remove 方法会把当前线程的 ThreadLocalMap 里跟这个 Threadlocal 实例对应的那个 entry 整个都删掉，这样那个强引用的 value 自然也就没有引用指向它了，下次 GC 就能把它回收了。

所以关键就是要手动清理，不能偷懒，不能指望它内部那个自动清理机制，**尤其是在线程池这种线程生命周期可能很长的场景下，依赖自动清理风险很大。**

# java 新版本

既然 ThreadLocal 有内存泄露的风险，那么后面新的 Java 版本，比如 11、17、21 这些，有没有做些改进，或者提供一些替代方案呢？

**弱引用键、强引用值这个机制，在后面这些版本里基本没变，但是确实有一些改进和变化。**

## java 17

Java 17 里针对那个公共的 ForkJoinPool，就是 ForkJoinPool 的 common pool，它增加了一个特性，当池里的任务执行完之后，会自动帮你清理掉那个任务线程用过的所有 Threadlocal 值，为这个特定的池缓解了一下风险。但注意，如果你自己创建的 ForkJoinPool 或者普通的线程池，或者直接创建了线程，那还得你自己负责 remove 。

## java 21

Java 21 提到的 scoped values ,目前还是预览特性，它提供了一种不同的方式来共享那些需要跟作用域绑定的数据（比如请求处理过程绑定的数据，特别是不可变数据），它的设计理念就是为了避免 Threadlocal 这种需要手动清理的麻烦，用一种结构化的方式来传递和管理，用完自然就没了。

```java
$ terminalimport jdk.incubator.concurrent.ScopedValue;

public class ScopedValueExample {
    // 声明一个 ScopedValue
    static final ScopedValue<String> USER = ScopedValue.newInstance();

    public static void main(String[] args) {
        // 使用 ScopedValue.where 绑定值，并在作用域内运行
        ScopedValue.where(USER, "Alice").run(() -> {
            System.out.println("在作用域内: " + USER.get());
            doSomething();
        });

        // 作用域结束后，值自动消失，不存在泄漏
        // System.out.println(USER.get()); // 会抛 IllegalStateException
    }

    static void doSomething() {
        System.out.println("子方法依然能获取: " + USER.get());
    }
}

```

至于虚拟线程，因为它们被设计成非常轻量级，而且通常生命周期很短，用完就丢了，线程没了它关联的 ThreadLocalMap 自然也就没了，所以长期泄露的风险窗口就大大缩短了。

```java
$ terminalpublic class VirtualThreadExample {
    private static final ThreadLocal<String> local = ThreadLocal.withInitial(() -> "未设置");

    public static void main(String[] args) throws InterruptedException {
        // 使用虚拟线程（JDK 21 已经正式支持）
        Thread vThread = Thread.ofVirtual().start(() -> {
            local.set("虚拟线程的数据");
            System.out.println(Thread.currentThread() + " -> " + local.get());
            // 不需要手动清理，虚拟线程生命周期很短，用完就结束
        });

        vThread.join();

        // 这里 vThread 已经结束，对应的 ThreadLocalMap 已自动销毁
    }
}

```

# 总结

我们来总结一下 ThreadLocal 这个东西。

它通过每个线程自己私有的 ThreadLocalMap 实现了线程数据的隔离。挺强大的，在很多场景下很有用，但是它那个弱引用键加上强引用值的设计，就像一把双刃剑，带来了内存泄露的风险，特别是用线程池这种长生命周期的线程池，所以最重要的实践就是要记得用完之后一定在 finally 块里手动调用 remove 来清理。

虽然新版 Java 针对特定场景，比如公共 ForkJoinPool 做了些自动清理，也提供了像 scoped values 这样的潜在替代方案，但总的来说，理解这个机制，并且承担起主动清理的责任，对开发者来说还是很重要的。
