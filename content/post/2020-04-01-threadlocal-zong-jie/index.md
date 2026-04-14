---
title: "ThreadLocal 总结"
slug: 2020-04-01-threadlocal-zong-jie
description: "什么是ThreadLocalThreadLocal，顾名思义，它不是一个线程，而是线程的一个本地化对象。"
date: 2020-04-01T10:42:24.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-01-threadlocal-zong-jie/cover.jpg
original_url: https://mp.weixin.qq.com/s/igdNHMhOWBVwM005aly7SA
categories:
  - 后端
tags:
  - Java
  - JVM
  - 数据结构
  - 多线程
---
## 什么是ThreadLocal

ThreadLocal，顾名思义，它不是一个线程，而是线程的一个本地化对象。

当工作于多线程中的对象使用 ThreadLocal 维护变量时，ThreadLocal 为每个使用该变量的线程分配一个独立的变量副本。

所以每一个线程都可以独立地改变自己的副本，而不会影响其他线程所对应的副本。从线程的角度看，这个变量就像是线程的本地变量，这也是类名中 “Local” 所要表达的意思。

ThreadLocal 提供了线程的局部变量副本，每个线程都可以通过`set()`和`get()`来对这个局部变量进行操作，但不会和其他线程的局部变量进行冲突，**实现了线程的数据隔离**～。

其实就是你创建了一个 `Threadlocal` 变量，每个访问 `Threadlocal` 变量的线程都有一个本地副本。

往ThreadLocal 中填充的变量属于**当前**线程，该变量对其他线程而言是隔离的。

## ThreadLocal数据结构

![Image](001-d6e9d309.png "image.png")

**一个 ThreadLocal 只能存储一个 Object 对象，如果需要存储多个 Object 对象那么就需要多个 ThreadLocal**

**![Image](002-02afd596.png "image.png")**

-   ThreadLocalMap 的 Entry 对 ThreadLocal 的引用为弱引用，避免了 ThreadLocal 对象无法被回收的问题

-   ThreadLocalMap 的 set 方法通过调用 replaceStaleEntry 方法回收键为 null 的 Entry 对象的值（即为具体实例）以及 Entry 对象本身从而防止内存泄漏

**复习一下java的对象引用**

• 强引用：new 出来的一般对象，只要引用在就不会被回收

• 软引用: 将要发生内存溢出之前回收

• 弱引用: 生存到下一次垃圾收集发生之前

• 虚引用：目的是对象被收集器回收时收到一个系统通知

threadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。

ThreadLocalMap 是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。

#### **Threadlocal 的 key 是弱引用，那么在 threadlocal.get() 的时候,发生 GC 之后，key 是否是 null ？**

做 threadlocal.get() 操作，证明其实还是有强引用存在的。所以 key 并不为 null 。

#### **ThreadLocal 为什么会造成内存泄漏？**

ThreadLocalMap 使用 ThreadLocal 的弱引用作为key，如果一个 ThreadLocal 没有外部强引用来引用它，那么系统 GC 的时候，这个 ThreadLocal 势必会被回收，这样一来，ThreadLocalMap 中就会出现key为 null 的 Entry，就没有办法访问这些key 为null 的 Entry 的 value ，如果当前线程再迟迟不结束的话，这些 key 为 null 的 Entry 的 value 就会一直存在一条强引用链：

Thread Ref -> Thread -> ThreaLocalMap -> Entry ->value 

永远无法回收，造成内存泄漏。

简单来说，就是因为 ThreadLocalMap 的 key 是弱引用，当 TheadLocal 外部没有强引用时，就被回收，此时会出现 ThreadLocalMap<null,value> 的情况，而线程没有结束的情况下，导致这个 null 对应的 value 一直无法回收，导致泄漏。

**ThreadLocal 内存泄漏的根源是：由于 ThreadLocalMap 的生命周期跟 Thread一样长，如果没有手动删除对应 key 就会导致内存泄漏，而****不是因为弱引用。**

**ThreadLocal 类型变量为何声明为 static  ？**

ThreadLocal 类的目的是为每个线程单独维护一个变量的值，避免线程间对同一变量的竞争访问，适用于一个变量在每个线程中需要有自己独立的值的场合。

如果把 threadLocalID 声明为非静态，则在含有 ThreadLocal 变量的的每个实例中都会产生一个新对象，这是毫无意义的，只是增加了内存消耗。

## ThreadLocal的最佳实践

-   **ThreadLocal 并不解决多线程 共享 变量的问题**

-   **如果要同时满足变量在线程间的隔离与方法间的共享，ThreadLocal 再合适不过**

-   **保存线程上下文信息，在任意需要的地方可以获取**

-   **线程安全的，避免某些情况需要考虑线程安全必须同步带来的性能损失**

-   **应该在我们不使用的时候，主动调用 remove 方法进行清理。**

```cs
try {
    // 其它业务逻辑
} finally {
    threadLocal对象.remove();
}

```java

##

## InheritableThreadLocal

ThreadLocal  固然很好，但是子线程并不能取到父线程的 ThreadLocal 的变量：

```cs
 private static ThreadLocal<Integer> integerThreadLocal = new ThreadLocal<>();
   
    public static void main(String[] args) throws InterruptedException {
        integerThreadLocal.set(1001); // father
       
        new Thread(() -> System.out.println(Thread.currentThread().getName() + ":"
                + integerThreadLocal.get())).start();
    }
//output:
Thread-0:null

```java

使用 ThreadLocal 不能继承父线程的 ThreadLocal 的内容，而使用 InheritableThreadLocal 时可以做到的，这就可以很好的在父子线程之间传递数据了。inheritableThreadLocal 继承了 ThreadLocal。

```cs
 private static InheritableThreadLocal<Integer> inheritableThreadLocal =
            new InheritableThreadLocal<>();
    public static void main(String[] args) throws InterruptedException {
  
        inheritableThreadLocal.set(1002); // father
        new Thread(() -> System.out.println(Thread.currentThread().getName() + ":"
                + inheritableThreadLocal.get())).start();
    }
//output:
Thread-0:1002

```

## 其他 ThreadLocal 实现

**Netty 的** **FastThreadLocal** ：

        对 JDK 中 ThreadLocal 进行优化，由于 ThreadLocal 底层存储数据是一个 ThreadLocalMap  结构，是一个数组结构，通过 threadLocalHashCode 查找在数组中的元素 Entry ,  当 hash 冲突时，继续向前检测查找, 所以当 Hash 冲突时，检索的效率就会降低。而 FastThreadLocal 则正是处理了这个问题，使其时间复杂度一直为O(1)。

**TransmittableThreadLocal：**

        TransmittableThreadLocal 是Alibaba开源的、用于解决 **“****在使用线程池等会缓存线程的组件情况下传递 ThreadLocal** **”** 问题的 InheritableThreadLocal 扩展。

        JDK 的 InheritableThreadLocal 类可以完成父线程到子线程的值传递。

        但对于使用线程池等会池化复用线程的组件的情况，线程由线程池创建好，并且线程是池化起来反复使用的；这时父子线程关系的ThreadLocal 值传递已经没有意义，应用需要的实际上是把 任务提交给线程池时的 ThreadLocal 值传递到 任务执行时。

        原理是使用 TtlRunnable/Ttlcallable包装了 Runnable/Callable 类。

## 注意

spring 框架内部很多地方使用 ThreadLocal 来辅助实现，如事务管理。

但是Spring 根本就没有对 bean 的多线程安全问题做出任何保证与措施。

对于每个bean 的线程安全问题，根本原因是每个 bean 自身的设计。

不要在 bean 中声明任何有状态的实例变量或类变量，如果必须如此，那么就使用 ThreadLocal把变量变为线程私有的，如果 bean 的实例变量或类变量需要在多个线程之间共享，那么就只能使用 synchronized、lock、CAS 等这些实现线程同步的方法了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-01-threadlocal-zong-jie/003-42df053f.jpg)

关注公众号 获取更多精彩内容
