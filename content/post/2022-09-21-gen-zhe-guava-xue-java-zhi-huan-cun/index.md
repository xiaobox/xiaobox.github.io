---
title: "跟着 Guava 学 Java 之缓存"
slug: 2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun
description: "本文我们先介绍一些缓存的背景知识，以及内存缓存的流行开源库类实现，最后利用一些例子重点介绍下 Guava C"
date: 2022-09-21T14:42:09.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/cover.jpg
original_url: https://mp.weixin.qq.com/s/TQQjgifLKF-cqVKvCBDriQ
categories:
  - 后端
tags:
  - Java
  - Spring
  - Redis
  - 缓存
  - 数据结构
  - 多线程
---
本文我们先介绍一些缓存的背景知识，以及内存缓存的流行开源库类实现，最后利用一些例子重点介绍下 Guava Cache 的缓存功能。

## 背景

### 什么是缓存

> “
> 
> 在计算中，缓存是一个高速数据存储层，其中存储了数据子集，且通常是短暂性存储，这样日后再次请求该数据时，速度要比访问数据的主存储位置快。通过缓存，可以高效地重用之前检索或计算的数据。
> 
> ”

本文中所提及的缓存主要是指内存缓存，跟硬件没什么关系（比如三级缓存什么的），主要是应用代码层面和内存交互的这部分。

### 缓存的特点

第一个特点：贼快（操作内存读写当然快了）

你可能会问了，贼快是多快？嗯，没有对比就没有伤害，我们来看一下不同介质访问数据的时间情况

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/001-ee7b0c2a.jpg)

看到了吧，RAM 的速度大概是 10-100 纳秒，什么概念？ 1 秒钟等于 10 亿纳秒，这速度快到你根本感觉不到。

第二个特点：说没就没

-   断电立即丢失
-   超过缓存失效时间

### 解决什么问题

一般来说，我们利用本地的内存缓存主要可以达到减轻数据库压力、提高系统响应速度和吞吐量的目的。

总之，如果对某些值的计算或检索成本很高，并且多次需要使用该值时，应该考虑使用缓存。

### 内存缓存库类

在 Java 中一提到缓存，我们首先想到的可以用 `ConcurrentHashMap`做缓存。

```
static ConcurrentHashMap<String,Object> localCache = new ConcurrentHashMap<>();

```

为什么要用 `ConcurrentHashMap` 呢？

因为首先它是个 Map，这种 K,V 的数据结构很适合用来读写缓存对象，其次它还是线程安全的，多线程并发不会有线程安全问题。

Java 虽然为我们提供了`ConcurrentHashMap` 这样合适做缓存的数据结构，但他在功能上却有很多的不足，比如没有 回收、驱逐、监听、刷新等功能。一般来说，我们设计一套完整的缓存方案虽然这些功能，用 `ConcurrentHashMap`意味着这些功能你要自己开发了。

在 Java 的生态中有许多库可以帮助我们省去自己开发的麻烦，人家都封装好了，开箱即用，这里我们列举几个知名和常用的，后面我们重点介绍 Guava 的 cache 模块：

-   `Guava Cache`
-   `Spring Cache` Spring 提供的一整套的缓存解决方案。虽然它本身并没有提供缓存的实现，但是它提供了一整套的接口和代码规范、配置、注解等，这样它就可以整合各种缓存方案了，比如 Redis、Ehcache，我们也就不用关心操作缓存的细节。
-   `Caffeine`（以 GuavaCache 为原型而开发的一个本地缓存框架，相对 GuavaCache, 它有更高的性能与命中率，更强大的功能，更灵活的配置方式）
-   `J2Cache`（OSChina 开源的一个两级缓存框架，采用固定的 一级 + 二级缓存 的模式，从一开始就是为了解决两级缓存一致性的问题）
-   `JetCache`（是阿里开源的通用缓存访问框架，它统一了多级缓存的访问方式，封装了类似于 SpringCache 的注解，以及 GuavaCache 类似的 Builder, 来简化项目中使用缓存的难度）

这里多说两句：

`Caffeine`是当前最优秀的内存缓存框架，不论读还是写的效率都远高于其他缓存，而且在`Spring5`开始的默认缓存实现就将 Caffeine 代替原来的 Guava。

在项目中，比如你用 SpringBoot 想加本地缓存，我们通常会引入 `SpringCache+Caffeine`的依赖。使用 `SpringCache` 注解方法实现缓存。SpringCache 帮我们封装了 Caffeine，通过这种方式集成 Caffeine。

```html
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>

```

有朋友说了，你这是一级缓存，我们一般会使用二级缓存，即一级缓存用 `caffeine` 二级缓存用 `Redis`(强强联合，很常用的方案)，一级缓存找不到去二级缓存找。

没错，如果你想用 SpringBoot 集成 `Caffeine`和`Redis`实现二级缓存，有两种方式：

第一种，直接集成，引入的依赖有变化：

```html

  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-cache</artifactId>
  </dependency>
  <dependency>
      <groupId>com.github.ben-manes.caffeine</groupId>
      <artifactId>caffeine</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
  </dependency>

```

这里顺便说一下 `spring-boot-starter-data-redis` ，spring-data-redis 和 Redis 的关系如下图，延续了 Spring 的一贯思想，对上层仍然是一层封装，对底层支持各种 Redis 客户端的实现。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/002-de281151.jpg)

第一种方式的集成比较简单，但请注意 spring cache (caffeine) 和 spring-data-redis(redis)，是各管各的（如前面括号里写的），不好意思，一二级缓存之间的逻辑关系需要你自己处理 具体来说比如你可以实现 cache 拦截器 `CacheInterceptor`

这里有一个比较容易混乱的点， spring cache 是支持多个 Provider 的：

1.  Generic
2.  JCache (JSR-107) (EhCache 3, Hazelcast, Infinispan, and others)
3.  EhCache 2.x
4.  Hazelcast
5.  Infinispan
6.  Couchbase
7.  Redis
8.  Caffeine
9.  Simple

意思是我们用 springcache 即可以集成 Caffeine 这种本地缓存，也可以集成 Redis 这种分布式缓存，当然配置肯定不一样。但你要清楚，同时只能集成一个，没有说用 springcache 能同时集成两个的， 上面讲的集成 二级缓存（caffeine+redis），是指各管各的，springcache 集成 Caffeine，spring-data-redis 集成 redis。

刚才说了第一种集成方式，现在说第二种，即利用 jetCache 做二级缓存的集成，这里依赖有了很大变化：

```html
 <dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis-lettuce</artifactId>
    <version>2.6.3</version>
</dependency>

```

只需要这一个依赖，不需要 spring-cache 和 spring-data-redis 了 ，因为 jetCache 里面已经引入了 caffeine 和 lettuce 的包了。

这并不是说 spring-data-redis 和 spring-cache 不能引入，可以用，如果你有需求，但要注意检查依赖的冲突和重复。

```yaml
jetcache:
  statIntervalMinutes: 1
  areaInCacheName: false
  local:
    default:
      type: caffeine
      keyConvertor: fastjson2
  remote:
    default:
      type: redis.lettuce
      keyConvertor: fastjson2
      broadcastChannel: projectA
      keyPrefix: projectA
      valueEncoder: java
      valueDecoder: java
      uri: redis://127.0.0.1:6379/
      defaultExpireInMillis: 5000

```

我们从上面的配置中可以看出，很明显这里配置了二级缓存，分别是 `local` 和 `remote`，由于 jetCache 支持二级缓存的操作，就不用我们自己写代码实现了，不过值得注意的是，要实现分布式两级缓存的同步因为太重，框架没做得自己实现，关于这个问题可以参考（https://github.com/alibaba/jetcache/issues/205）

## Guava 缓存

终于到我们今天的主角 Guava Cache 了，无论你对 Caffeine 和 JetCache 多么感兴趣，请都先克制和忍耐一下，把 Guava 的 cache 看完，毕竟 Caffeine 也是以 Guava 为原型而产生的框架。

这里我们再次强调\*\* Guava Cache 指的本地缓存，即数据存储在当前应用服务器的内存之中，而像 Redis 这样的分布式缓存，数据是存储在应用服务器内存之外的\*\*。

下面我们来具体说说 Guava 的 Cache 怎么用

#### 加载

cache loading , 即缓存的加载或者创建有两种方式：

-   cacheLoader
-   callable

我们首先说一下 cacheLoader ，举个例子：

```java
 LoadingCache<String, String> cahceBuilder = CacheBuilder
        .newBuilder()
        .build(new CacheLoader<String, String>() {
            @Override
            public String load(String key) throws Exception {
                return   "no " + key + "!";
            }

        });

  cahceBuilder.put("name", "jack");
  cahceBuilder.put("id", "123");

  System.out.println(cahceBuilder.get("name"));
  System.out.println(cahceBuilder.get("id"));
  System.out.println(cahceBuilder.get("address"));
  System.out.println(cahceBuilder.getAll(List.of("name","id","address")));

```

输出：

```
jack
123
no address!
{name=jack, id=123, address=no address!}

```

上面的小例子我们用  cacheBuilder 构造出来的 `LoadingCache`  来存取类型均为`String` 的 K,V 缓存。build 方法需要传入一个 CacheLoader 对象，CacheLoader 是一个抽象类，需要重写 load 方法。这个 load 的方法的作用是：如果我们调用 LoadingCache 中的 get 方法，缓存不存在相对应的 key 的数据，那么 CacheLoader 会自动调用 load 方法加载数据进来，至于数据从哪里来是你自己设计的，比如从数据库或者 Redis 等等。

关于最后的 getAll 方法： getAll(Iterable<? extends K>) 方法用来执行批量查询。默认情况下，对每个不在缓存中的键，getAll 方法会单独调用 CacheLoader.load 来加载缓存项。如果批量的加载比多个单独加载更高效，你可以重载 CacheLoader.loadAll 来利用这一点。getAll(Iterable) 的性能也会相应提升。

关于 LoadingCache ， 我们看一下它的特点：

> “
> 
> A semi-persistent mapping from keys to values. Values are automatically loaded by the cache, and are stored in the cache until either evicted or manually invalidated. The common way to build instances is using CacheBuilder. Implementations of this interface are expected to be thread-safe, and can be safely accessed by multiple concurrent threads.
> 
> ”

-   一种半持久化的 KV 结构
-   这些 KV 会一直有效，直到被驱逐或者手动设置为无效
-   线程安全的

接着我们来看一下 `callable` ，举个简单例子：

```java
  Cache<String, String> cache = CacheBuilder.newBuilder().build();

  String name = cache.get("name", new Callable<String>() {
      @Override
      public String call() throws Exception {

          return "jack";
      }
  });
  
  System.out.println(name);

  cache.put("id","123");
  
  System.out.println(cache.getIfPresent("id"));
  System.out.println(cache.getIfPresent("address"));

```

输出：

```
jack
123
null 

```

可以看到 Callable 只有在缓存值不存在时，才会调用，值存在则直接返回该值。

总结

-   LoadingCache 继承了 Cache 接口。LoadingCache 读取一个指定 key 的数据时，如果 key 不存在，LoadingCache 会执行加载数据到缓存。（相当于全局的）
-   cacheloader 的定义比较宽泛，是针对整个 cache 定义的，可以认为是统一的根据 key 值 load value 的方法。而 callable 的方式较为灵活，允许你在 get 的时候指定。（相当于个体自定义的）

其实无论是 LoadingCache 还是 callable 的方式加载缓存，他们都实现了一个共同的语义，即  “get-if-absent-compute” 获取缓存-如果没有-则计算。注意这个语义是原子的，通过下图看到底层源码，是加了锁的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/003-914a54cf.jpg)

Java 中与此相似的原子语义有：ConcurrentHashMap 中的 `putIfAbsent` 和 `computeIfAbsent`，注意只是结构相似而已。

### 缓存回收

从大的方面讲缓存的回收分两种，一种是手动回收，一种是自动回收。手动回收就是你自己调方法干掉它，自动就是根据一定的规则约定，当到达触发条件自动回收。

我们先来看自动这部分。

Guava Cache 提供了三种基本的缓存回收方式：基于容量回收、定时回收和基于引用回收。

基于容量的回收（size-based eviction）

顾名思义根据缓存的容量回收，超过或即将超过最大容量的缓存将被回收，我们可以通过 CacheBuilder 来设置最大容量：

```
CacheBuilder.newBuilder().maximumSize(100).build();

```

-   这个 size 指的是 cache 中的条目数，不是内存大小或是其他
-   并不是完全到了指定的 size 系统才开始移除不常用的数据的，而是接近这个 size 的时候系统就会开始做移除的动作
-   如果一个键值对已经从缓存中被移除了，你再次请求访问的时候，如果 cachebuild 是使用 cacheLoader 方式的，那依然还是会从 cacheloader 中再取一次值，如果这样还没有，就会抛出异常

根据源码注释可以看到，容量回收的算法是`LRU`（最近最少使用）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/004-7e9fb163.jpg)

还可以根据缓存的“权重” 进行回收，什么意思呢？

每一项缓存所占据的内存空间大小都可能不一样，我们可以把它看作它们有不同的“权重”（weights）, 作为执行清除策略时优化回收的对象。不过感觉基于权重的用的比较少。下面是一个官方的例子：

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
       .maximumWeight(100000)
       .weigher(new Weigher<Key, Graph>() {
          public int weigh(Key k, Graph g) {
            return g.vertices().size();
          }
        })
       .build(
           new CacheLoader<Key, Graph>() {
             public Graph load(Key key) { // no checked exception
               return createExpensiveGraph(key);
             }
           });

```

可以通过自定义一个 weight 函数来设置每项缓存的权重 。

定时回收（Timed Eviction）

定时回收，或者说基于存活时间的回收，主要有两个参数：

-   expireAfterAccess  缓存项在给定时间内没有被读/写访问，则回收。这种缓存的回收顺序和基于大小回收一样。
-   expireAfterWrite 缓存项在给定时间内没有被写访问（创建或覆盖），则回收。如果认为缓存数据总是在固定时候后变得陈旧不可用，这种回收方式是可取的。

```
CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.SECONDS).expireAfterWrite(8,TimeUnit.SECONDS);

```

通过这两个参数的设置可以发现：定时回收周期性地在写操作中执行，偶尔在读操作中执行

我们在测试定时回收的时候不用设置了时间以后在那儿“傻等”，可以利用 Guava 的 Ticker 来模拟时间流逝，举个例子：

```java
class FakeTicker extends Ticker {

    private final AtomicLong nanos = new AtomicLong();

    /** Advances the ticker value by {@code time} in {@code timeUnit}. */
    public FakeTicker advance(long time, TimeUnit timeUnit) {
        nanos.addAndGet(timeUnit.toNanos(time));
        return this;
    }

    @Override
    public long read() {
        long value = nanos.getAndAdd(0);
        System.out.println("is called " + value);
        return value;
    }
}

@Test
public void expireAfterWriteTestWithTicker() throws InterruptedException {
    FakeTicker t = new FakeTicker();

    // Use ticker to force expire in 20 minute
    LoadingCache<String, String> cache = CacheBuilder.newBuilder()
            .expireAfterWrite(20, TimeUnit.MINUTES).ticker(t).build(ldr);
    cache.getUnchecked("hello");
    assertEquals(1, cache.size());
    assertNotNull(cache.getIfPresent("hello"));

    // add 21 minutes
    t.advance(21, TimeUnit.MINUTES);
    assertNull(cache.getIfPresent("hello")); 

}

```

基于引用的回收（Reference-based Eviction）

Guava 允许你通过设置实现在 JVM GC 时回收缓存对象，这种移除方式主要是基于 java 的垃圾回收机制，根据键或者值的引用关系决定移除。

稍微复习一下 Java 的引用类型：

-   强引用：new 出来的一般对象，只要引用在就不会被回收
-   软引用：将要发生内存溢出之前回收
-   弱引用：生存到下一次垃圾收集发生之前
-   虚引用：目的是对象被收集器回收时收到一个系统通知

其中，软引用 soft reference 可用来实现内存敏感的高速缓存。而弱引用 weak reference 引用的对象是有价值被 cache, 而且很容易被重新构建，且很消耗内存的对象。所以 软引用和弱引用被 Guava 利用来处理回收问题。

-   `CacheBuilder.weakKeys()`  使用弱引用存储键。当键没有其它（强或软）引用时，缓存项可以被垃圾回收。
-   `CacheBuilder.weakValues()`：使用弱引用存储值。当值没有其它（强或软）引用时，缓存项可以被垃圾回收。
-   `CacheBuilder.softValues()`：使用软引用存储值。软引用的对象会根据内存需求，以 LRU 的方式进行垃圾收集。

```
Cache<String, String> cache = CacheBuilder.newBuilder().weakKeys().weakValues().softValues().build();

```

实际工作中用引用回收的很少。

上面我们介绍的回收方式，无论是基于容量回收、定时回收还是基于引用回收都是类似于自动回收的方式，下面我们介绍下手动显示回收，即手动回收缓存。

-   个别清除：`Cache.invalidate(key)`
-   批量清除：`Cache.invalidateAll(keys)`
-   清除所有缓存项：`Cache.invalidateAll()`

### 移除监听器

通过`CacheBuilder.removalListener(RemovalListener)`，你可以声明一个监听器，以便缓存项被移除时做一些额外操作。缓存项被移除时，`RemovalListener`会获取移除通知`RemovalNotification`，其中包含移除原因`RemovalCause`、键和值。

举个例子：

```java
  RemovalListener<String, String> myRemovalListener = notification -> {
     System.out.println(notification.getCause().toString()+ " | ["  + notification.getKey() + ":" + notification.getValue() + "] is removed!");

  };
  Cache<String, String> cache = CacheBuilder.newBuilder().removalListener(myRemovalListener).build();
  cache.put("name","jack");
  cache.put("id","123");
  cache.invalidate("id");

```

输出：EXPLICIT | [id:123] is removed!

注意：默认情况下，监听器方法是在移除缓存时同步调用的。因为缓存的维护和请求响应通常是同时进行的，代价高昂的监听器方法在同步模式下会拖慢正常的缓存请求。在这种情况下，你可以使用`RemovalListeners.asynchronous(RemovalListener, Executor)`把监听器装饰为异步操作，比如：

```java
ExecutorService executor = Executors.newSingleThreadExecutor();
Cache<Integer, Integer> cache1 = CacheBuilder.newBuilder().expireAfterWrite(2, TimeUnit.SECONDS)
        .removalListener(RemovalListeners.asynchronous(notification -> {
            System.out.println(notification.getCause());
            System.out.println(notification.getKey() + " --> " + notification.getValue());
        }, executor)).build();

```

### 缓存回收的时机

关于这点，只需要知道 Guava cache 缓存不会”自动”执行清理和回收工作，也不会在某个缓存项过期后马上清理，也没有诸如此类的清理机制。相反，它会在写操作时顺带做少量的维护工作，或者偶尔在读操作时做——如果写操作实在太少的话。

这样做的原因在于：如果要自动地持续清理缓存，就必须有一个线程，这个线程会和用户操作竞争共享锁。此外，某些环境下线程创建可能受限制，这样 CacheBuilder 就不可用了。

相反，Guava 把选择权交到我们手里。如果你的缓存是高吞吐的，那就无需担心缓存的维护和清理等工作。如果你的 缓存只会偶尔有写操作，而你又不想清理工作阻碍了读操作，那么可以创建自己的维护线程，以固定的时间间隔调用`Cache.cleanUp()`

`ScheduledExecutorService`可以帮助你很好地实现这样的定时调度。

### 刷新

如果对缓存设置过期时间，在高并发下同时执行 get 操作，而此时缓存值已过期了，如果没有保护措施，则会导致大量线程同时调用生成缓存值的方法，比如从数据库读取，对数据库造成压力，这也就是我们常说的“缓存击穿”。

而 Guava cache 则对此种情况有一定控制。当大量线程用相同的 key 获取缓存值时，只会有一个线程进入 load 方法，而其他线程则等待（同步），直到缓存值被生成。这样也就避免了缓存击穿的危险。上述机制其实就是 `expireAfterWrite/expireAfterAccess` 来控制的，如果你配置了过期策略对应的缓存项在过期后被访问就会走上述流程来加载缓存项。

但这样做会导致大量的请求线程被阻塞。怎么办呢？

Guava cache 的办法是提供一种缓存策略，缓存值定时刷新 `refreshAfterWrite` ：更新线程调用 load 方法更新该缓存，其他请求线程返回该缓存的旧值。这样对于某个 key 的缓存来说，只会有一个线程被阻塞，用来生成缓存值，而其他的线程都返回旧的缓存值，不会被阻塞。

我们对比一下 `refreshAfterWrite` 和`expireAfterWrite`

1.  expireAfterWrite 是允许一个线程进去 load 方法，其他线程阻塞等待。
2.  refreshAfterWrite 是允许一个线程进去 load 方法，其他线程返回旧的值。

那么问题解决了吗？ 单个 key 并发下，使用 refreshAfterWrite，虽然不会阻塞了，但是如果恰巧多个 key 同时过期，还是会给数据库造成压力，这就是我们所说的“缓存雪崩”。这时就要用到异步刷新，将刷新缓存值的任务交给后台线程，所有的用户请求线程均返回旧的缓存值。方法是覆盖 CacheLoader 的`reload`方法，使用线程池去异步加载数据

> “
> 
> 只有重写了 reload 方法才有“异步加载”的效果。默认的 `reload` 方法就是同步去执行 load 方法
> 
> ”

关于 `reload` 可以参考官方的例子：

```java
//有些键不需要刷新，并且我们希望刷新是异步完成的
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
  .maximumSize(1000)
  .refreshAfterWrite(1, TimeUnit.MINUTES)
  .build(
      new CacheLoader<Key, Graph>() {
          public Graph load(Key key) { // no checked exception
              return getGraphFromDatabase(key);
          }
  
          public ListenableFuture<Key, Graph> reload(final Key key, Graph prevGraph) {
              if (neverNeedsRefresh(key)) {
                  return Futures.immediateFuture(prevGraph);
              }else{
                  // asynchronous!
                  ListenableFutureTask<Key, Graph> task=ListenableFutureTask.create(new Callable<Key, Graph>() {
                      public Graph call() {
                          return getGraphFromDatabase(key);
                      }
                  });
                  executor.execute(task);
                  return task;
              }
          }
      });

```

最佳实践：refreshTime < expireTime

因为，根据 get 的流程，在 get 的时候，是先判断过期，再判断 refresh（如果 refreshTime > expireTime 意味着永远走不到缓存刷新逻辑。)，即如果过期了会优先调用 load 方法（阻塞其他线程）。

在不过期情况下且过了 refresh 时间才去做 reload （异步加载，同时返回旧值），所以推荐的设置是 refresh < expire，这个设置还可以解决一个场景就是，如果长时间没有访问缓存，可以保证 expire 后可以取到最新的值，而不是因为 refresh 取到旧值。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/005-d36b6ce7.jpg)

### 可选配置

除了上文中已经介绍附带主题提到过的一些配置外，还有一些值得关注的配置：

缓存的并发级别

Guava 提供了设置并发级别的 api，使得缓存支持并发的写入和读取

```
CacheBuilder.newBuilder()
    // 设置并发级别为 cpu 核心数
    .concurrencyLevel(Runtime.getRuntime().availableProcessors()) 
    .build();

```

同 ConcurrentHashMap 类似 Guava cache 的并发也是通过分离锁实现。在一般情况下，将并发级别设置为服务器 cpu 核心数是一个比较不错的选择。

缓存的初始容量设置

我们在构建缓存时可以为缓存设置一个合理大小初始容量，由于 Guava 的缓存使用了分离锁的机制，扩容的代价非常昂贵。所以合理的初始容量能够减少缓存容器的扩容次数。

```
CacheBuilder.newBuilder()
    // 设置初始容量为 100
    .initialCapacity(100)
    .build();

```

### 统计信息

在构建 Cache 对象时，可以通过 CacheBuilder 的 recordStats 方法开启统计信息的开关。开关开启后 Cache 会自动对缓存的各种操作进行统计，调用 Cache 的 stats 方法可以查看统计后的信息。

`CacheStats`对象以提供如下统计信息：

-   `hitRate()`：缓存命中率；
-   `averageLoadPenalty()`：加载新值的平均时间，单位为纳秒；
-   `evictionCount()`：缓存项被回收的总数，不包括显式清除。

```java
 Cache<String, String> cache = CacheBuilder.newBuilder().recordStats().build();
  cache.put("name", "jack");
  cache.put("id", "123");
  cache.invalidate("id");

  System.out.println(cache.getIfPresent("name"));
  System.out.println(cache.stats());

```

输出：

```
jack
CacheStats{hitCount=1, missCount=0, loadSuccessCount=0, loadExceptionCount=0, totalLoadTime=0, evictionCount=0}

```

### asMap 视图

asMap 视图提供了缓存的 ConcurrentMap 形式，但 asMap 视图与缓存的交互需要注意：

-   cache.asMap() 包含当前所有加载到缓存的项。因此相应地，cache.asMap().keySet() 包含当前所有已加载键；
-   asMap().get(key) 实质上等同于 cache.getIfPresent(key)，而且不会引起缓存项的加载。这和 Map 的语义约定一致。
-   所有读写操作都会重置相关缓存项的访问时间，包括 Cache.asMap().get(Object) 方法和 Cache.asMap().put(K, V) 方法，但不包括 Cache.asMap().containsKey(Object) 方法，也不包括在 Cache.asMap() 的集合视图上的操作。比如，遍历 Cache.asMap().entrySet() 不会重置缓存项的读取时间。

## Caffeine

从功能上看，Guava 已经比较完善了，满足了绝大部分本地缓存的需求。Caffine 除了提供 Guava 已有的功能外，同时还加入了一些扩展功能。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-09-21-gen-zhe-guava-xue-java-zhi-huan-cun/006-e87bb1db.jpg)

关于 Caffeine 的话题，限于篇幅，我们在以后的文章中再讨论。

## 总结

本文我们首先介绍了缓存的一些背景知识，了解了缓存的分类，以及内存缓存的一些开源库类，利用一些短小易懂的例子重点介绍了 Guava Cache，包括它的加载、更新、回收、配置、统计等功能。由于篇幅有限，有关常用的 JetCache 、Caffeine，还有一二级缓存的话题，有机会我会在后面的文章中跟大家再细聊。

## 参考

-   https://albenw.github.io/posts/df42dc84/
-   https://www.cnblogs.com/peida/p/guava\_cache.html
-   https://www.cnblogs.com/rickiyang/p/11074159.html
-   https://blog.csdn.net/aitangyong/article/details/53114797
-   https://blog.csdn.net/bitcarmanlee/article/details/106502697
-   https://stackoverflow.com/questions/29990788/guava-ticker-cache-expire
