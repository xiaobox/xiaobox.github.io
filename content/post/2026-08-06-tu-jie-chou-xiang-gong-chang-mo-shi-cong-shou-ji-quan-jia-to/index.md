---
title: "图解抽象工厂模式，从手机全家桶说起"
slug: 2026-08-06-tu-jie-chou-xiang-gong-chang-mo-shi-cong-shou-ji-quan-jia-to
description: "用手机全家桶类比图解抽象工厂模式，对比简单工厂与工厂方法，说明产品族一致性的核心价值，并附 GoF 历史背景与面试答题模板。"
date: 2026-08-06T04:00:00.000Z
image:
original_url:
categories:
  - 后端
tags:
  - Java
  - 面试
---

面试被问「简单工厂、工厂方法、抽象工厂有什么区别」的时候，大部分人答到第二个就开始打结。

前两个还能勉强对付。简单工厂好理解，就是把 new 的动作丢给一个工厂类。工厂方法也还行，每种产品对应一个工厂子类。

但轮到抽象工厂，画风突变。什么叫「产品族」？它和工厂方法到底差在哪？为什么多了个「抽象」就让人脑子打结？

翻翻牛客面经，光「抽象工厂」关键词就能搜出一堆。有个读者跟我说，面试的时候被追问「什么场景下必须用抽象工厂而不是工厂方法」，当场卡壳了。

今天咱们用一个你每天都在经历的事情来讲明白它。

你挑手机的时候，选了 Apple，大概率会接着买 AirPods 和 iPad。选了华为，FreeBuds 和 MatePad 自然也进了购物车。

这就是抽象工厂要解决的核心问题。产品成群结队，一个生态配套一整族。

咱们先把前面两位「老前辈」快速过一遍，你才能真正体会到抽象工厂到底多了什么。

![简单工厂示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E7%AE%80%E5%8D%95%E5%B7%A5%E5%8E%82.png)

## 先认识两位老前辈

> 老前辈一号，简单工厂

假设你开了一家电子产品店，顾客进来说「我要一台手机」，你跑到后面仓库去拿。

顾客说「我要苹果手机」，你拿 iPhone。说「我要华为手机」，你拿 Mate。

你就是那个「简单工厂」。所有产品从你手里出去，你根据顾客说的品牌名去找对应的货。

用代码写出来大概长这样:

```java
public class SimplePhoneFactory {
    public static Phone createPhone(String brand) {
        if (brand.equals("apple")) {
            return new iPhone();
        } else if (brand.equals("huawei")) {
            return new Mate();
        }
        throw new IllegalArgumentException("不认识的品牌");
    }
}
```

问题来了。每加一个新品牌，你都得改这个 if-else。三星来了加一条，小米来了再加一条。改到后面这个工厂类会膨胀到没法维护。

违反了开闭原则，对扩展开放、对修改关闭。每次加品牌都要动老代码，迟早出事。

![工厂方法示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E5%B7%A5%E5%8E%82%E6%96%B9%E6%B3%95.png)

> 老前辈二号，工厂方法

工厂方法的思路很直接，既然一个工厂干不过来，那就每个品牌开一家自己的工厂。

苹果工厂只造 iPhone，华为工厂只造 Mate，三星来了就再开一家三星工厂。加品牌不用改老代码，新建一个工厂类就行。

```java
// 定义工厂接口
public interface PhoneFactory {
    Phone createPhone();
}

// 苹果工厂
public class ApplePhoneFactory implements PhoneFactory {
    public Phone createPhone() {
        return new iPhone();
    }
}

// 华为工厂
public class HuaweiPhoneFactory implements PhoneFactory {
    public Phone createPhone() {
        return new Mate();
    }
}
```

干净了很多，扩展也方便。但问题马上就来了。

你买手机的时候，只买手机吗？

你买了 iPhone，下一步是不是还想买 AirPods？再来一台 iPad？

工厂方法每个工厂只管一种产品。你得开一家苹果手机工厂，再开一家苹果耳机工厂，再开一家苹果平板工厂。华为也是三家。三星也是三家。

3 个品牌 × 3 种产品 = 9 个工厂类。

品牌多了，产品线多了，工厂类爆炸式增长。

![工厂类爆炸示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E4%B9%9D%E5%B7%A5%E5%8E%82%E7%88%86%E7%82%B8.png)

更要命的是，这些工厂之间没有任何关系。你完全可以从苹果手机工厂拿一台 iPhone，再跑到华为耳机工厂拿一副 FreeBuds，混搭出一个「串味全家桶」。

代码层面没人拦你。但实际体验，iPhone 连 FreeBuds 少了一大堆生态功能，弹窗配对没了，空间音频没了，查找功能也没了。

这就是工厂方法解决不了的问题。

**产品之间有配套关系，混搭会出事。**

![产品族混搭出事示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E6%B7%B7%E6%90%AD%E7%BF%BB%E8%BD%A6.png)

## 纠结哥登场 · Client

现在请出咱们的第一个角色，纠结哥。

纠结哥就是你我这样的普通消费者。他走进一家数码城，面前摆着苹果、华为、小米三个品牌的全家桶。

纠结哥心里清楚两件事。

第一，他想要一整套配套的设备，手机 + 耳机 + 平板，三件套。

第二，他不想操心具体型号。他只想说「给我来一套苹果的」或者「给我来一套华为的」，至于到底是 iPhone 16 还是 iPhone 15，AirPods Pro 还是 AirPods 4，交给品牌自己决定。

纠结哥开口了，「老板，我就想要一套生态统一的全家桶，别让我自己去配。你告诉我选哪个品牌就行，剩下的事我不想管。」

这个需求翻译成代码世界的术语，叫做 **Client 不依赖具体产品类，只依赖抽象接口**。

纠结哥不关心工厂内部怎么造手机，他只关心拿到手的东西能配套用。

![纠结哥选全家桶](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E7%BA%A0%E7%BB%93%E5%93%A5%E9%80%89%E5%85%A8%E5%AE%B6%E6%A1%B6.png)

## 生态设计师 · AbstractFactory

纠结哥的需求谁来接？

这时候出场的是生态设计师。他不是某一家品牌的人，他是定规矩的。

生态设计师说，「我不管你是苹果还是华为还是小米，只要你敢叫自己一个生态品牌，你就必须能造三样东西。手机，耳机，平板。缺一个都不算完整生态。」

```java
public interface EcosystemFactory {
    Phone createPhone();
    Earbuds createEarbuds();
    Tablet createTablet();
}
```

注意看这个接口。它没有一行具体实现。它不知道手机长什么样，不知道耳机用什么芯片，不知道平板屏幕多大。

它只管一件事。你得能造齐这三样。

这就是「抽象」两个字的含义。**抽象工厂只规定「要造什么品类」，不规定「具体怎么造」。**

![抽象工厂接口设计图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E7%94%9F%E6%80%81%E8%AE%BE%E8%AE%A1%E5%B8%88%E8%93%9D%E5%9B%BE.png)

你可能会问，跟工厂方法里的工厂接口有啥区别？

区别就一个字。**工厂方法的接口里只有一个 `createXxx()` 方法，造一种产品。抽象工厂的接口里有一组 `createXxx()` 方法，造一族产品。**

工厂方法管「一条产品线」。抽象工厂管「一整个生态」。

## 苹果车间和华为车间 · ConcreteFactory

规矩定好了，该干活了。

苹果流水线接过生态设计师的图纸，开工。

```java
public class AppleFactory implements EcosystemFactory {
    public Phone createPhone() {
        return new iPhone();
    }
    public Earbuds createEarbuds() {
        return new AirPods();
    }
    public Tablet createTablet() {
        return new iPad();
    }
}
```

华为流水线也不甘示弱。

```java
public class HuaweiFactory implements EcosystemFactory {
    public Phone createPhone() {
        return new Mate();
    }
    public Earbuds createEarbuds() {
        return new FreeBuds();
    }
    public Tablet createTablet() {
        return new MatePad();
    }
}
```

两条流水线各干各的，互不干扰。但它们都遵守同一份图纸（EcosystemFactory 接口）。

重点来了。从苹果流水线出来的 iPhone、AirPods、iPad，天然就是一家人。它们用同一套蓝牙协议，同一个账号体系，同一种交互语言。你不可能从苹果流水线里拿出一副 FreeBuds。

**产品族的一致性，是在工厂层面就锁死的，不需要 Client 操心。**

![两条流水线对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E5%8F%8C%E6%B5%81%E6%B0%B4%E7%BA%BF.png)

## 产品蓝图 · AbstractProduct

手机、耳机、平板，这三个词在代码里也得有个抽象层。

```java
public interface Phone {
    void call();
    void browseWeb();
}

public interface Earbuds {
    void playMusic();
    void noiseCancelling();
}

public interface Tablet {
    void draw();
    void watchVideo();
}
```

这三个接口就是「产品蓝图」。它们定义了每种设备必须能做什么，但不规定怎么做。

iPhone 的 `call()` 走 FaceTime 协议，Mate 的 `call()` 走畅连通话。实现不一样，但对纠结哥来说，都是「打电话」。

## 真机到手 · ConcreteProduct

最后一层，具体产品。

```java
public class iPhone implements Phone {
    public void call() {
        System.out.println("iPhone: FaceTime 通话中...");
    }
    public void browseWeb() {
        System.out.println("iPhone: Safari 浏览中...");
    }
}

public class Mate implements Phone {
    public void call() {
        System.out.println("Mate: 畅连通话中...");
    }
    public void browseWeb() {
        System.out.println("Mate: 华为浏览器加载中...");
    }
}
```

AirPods、FreeBuds、iPad、MatePad 同理，各自实现自己的接口。

到这里，抽象工厂模式的五个角色全部到齐了。

![五个角色关系图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E4%BA%94%E8%A7%92%E8%89%B2UML.png)

我整理了一下，把五个角色的关系画成一张图。

| 角色 | 代码里的身份 | 手机生态里的对应 |
|---|---|---|
| 纠结哥 | Client | 消费者，只选品牌不选具体型号 |
| 生态设计师 | AbstractFactory | 接口，规定每个品牌必须造哪些品类 |
| 苹果/华为车间 | ConcreteFactory | 具体品牌的生产线，造出配套产品族 |
| 产品蓝图 | AbstractProduct | 手机/耳机/平板的通用接口 |
| 真机 | ConcreteProduct | iPhone/Mate/AirPods/FreeBuds 等实体 |

## 八步对话，演一遍完整流程

光看表格不过瘾，让角色们自己演一遍。

---

纠结哥走进数码城，掏出手机看了看钱包余额，深吸一口气。

**第 1 步**，纠结哥对着柜台喊了一嗓子，「老板，给我来一套苹果全家桶。」

**第 2 步**，数码城的系统接到指令，找到苹果车间。「苹果车间收到，开工！」

**第 3 步**，苹果车间的手机线开始转，「iPhone 16 Pro，组装完毕，贴膜上架。」

**第 4 步**，苹果车间的耳机线紧跟着动起来，「AirPods Pro 2，降噪芯片已装，充电仓就位。」

**第 5 步**，苹果车间的平板线最后出货，「iPad Air M3，屏幕校色完毕，Apple Pencil 配对成功。」

**第 6 步**，三件产品在出厂区汇合。系统自动跑了一遍生态兼容性检查，「iPhone 已发现 AirPods，iPad 已同步 iCloud 账号，三件套就绪。」

**第 7 步**，纠结哥接过包裹，打开 iPhone，AirPods 自动弹窗配对，iPad 上的照片已经同步好了。他没做任何设置。

**第 8 步**，纠结哥心满意足，「就要这种感觉，开箱即配套，啥都不用折腾。」

![完整流程时序图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E5%85%AB%E6%AD%A5%E6%97%B6%E5%BA%8F.png)

---

翻译成代码就是这样。

```java
public class DigitalMall {
    public static void main(String[] args) {
        // 纠结哥选了苹果生态
        EcosystemFactory factory = new AppleFactory();
        
        // 工厂造出一整族配套产品
        Phone phone = factory.createPhone();
        Earbuds earbuds = factory.createEarbuds();
        Tablet tablet = factory.createTablet();
        
        // 拿到手直接用，不关心具体型号
        phone.call();
        earbuds.playMusic();
        tablet.draw();
    }
}
```

纠结哥想换华为生态？只改一行。

```java
EcosystemFactory factory = new HuaweiFactory();  // 就改这一行
```

后面的代码一个字都不用动。手机变成 Mate，耳机变成 FreeBuds，平板变成 MatePad，全自动切换。

**这就是抽象工厂最核心的价值。换一个工厂，整族产品跟着换，Client 代码零修改。**

> 那加一个新品牌呢？

小米来了。新建一个 XiaomiFactory，实现 EcosystemFactory 接口，在里面造 Xiaomi 14、Buds 5 Pro、Pad 7 Pro。

原来的 AppleFactory、HuaweiFactory 一行都不用改。纠结哥的代码也不用改。只是多了一个选项。

这就是开闭原则在抽象工厂里的体现。对扩展开放（加新品牌），对修改关闭（不动老代码）。

## 三种工厂，一张图讲清区别

咱们把三种工厂模式放到一起比一下。

![三种工厂模式对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E4%B8%89%E5%B7%A5%E5%8E%82%E5%AF%B9%E6%AF%94.png)

| 对比维度 | 简单工厂 | 工厂方法 | 抽象工厂 |
|---|---|---|---|
| 工厂数量 | 1 个，干所有活 | N 个，每个造一种产品 | N 个，每个造一族产品 |
| 扩展方式 | 改 if-else | 加新工厂类 | 加新工厂类 |
| 产品维度 | 一维（只管品牌） | 一维（只管品牌） | 二维（品牌 × 品类） |
| 产品配套 | 不保证 | 不保证 | 天然保证 |
| 开闭原则 | 违反 | 遵守 | 遵守 |

用一句话说清三个的区别。

简单工厂，一个人开店卖所有品牌的手机。
工厂方法，每个品牌各开一家手机专卖店。
抽象工厂，每个品牌各开一家旗舰体验店，手机耳机平板全部配套。

面试官问你的时候，先说这三句话，再展开细节。

## 四人帮和一本改变软件工程的书

抽象工厂模式不是凭空冒出来的。它背后有一段故事，跟一本 1994 年出版的书有关。

1990 年的一场学术会议上（OOPSLA，面向对象编程的年度大会），四个人碰到了一起。Erich Gamma 当时在苏黎世大学读博，研究一个叫 ET++ 的 C++ 应用框架。Richard Helm 在 IBM 澳洲研究院，Ralph Johnson 在伊利诺伊大学教书，John Vlissides 在斯坦福。

他们发现彼此都在做同一件事，从各自写过的代码里提取反复出现的设计套路。

这件事的灵感来源很有意思，给他们启发的是一位建筑师，一个跟编程完全不搭界的人。

Christopher Alexander 在 1977 年写了一本叫《A Pattern Language》的书，里面收录了 253 种建筑设计中反复出现的「模式」。比如「窗户应该朝向阳光」「走廊不要太窄」这种。Alexander 的核心观点是，好建筑来自一组被反复验证过的模式组合，每次从零设计反而容易出问题。

四个搞软件的人读了这本书，想法一下子通了。软件设计也有模式。TCP 连接用观察者模式，UI 框架用工厂模式，文件系统用组合模式，这些套路在不同项目里反复出现。

他们花了三年时间，从上百个候选模式里筛选、争论、打磨，最终在 1994 年出版了《Design Patterns: Elements of Reusable Object-Oriented Software》，收录了 23 个设计模式。

这本书后来卖了 50 多万册，四位作者被软件工程界称为「Gang of Four」（四人帮，简称 GoF）。

![GoF 四人帮与设计模式之书](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-GoF%E5%9B%9B%E4%BA%BA%E5%B8%AE.png)

抽象工厂在 23 个模式中属于「创建型模式」，一共 5 个创建型模式，抽象工厂排第一。

GoF 书里给抽象工厂举的原始例子跟手机没关系，用的是 GUI 工具包。1990 年代初，一个桌面软件要同时支持 Motif（Unix 上的 UI 风格）和 Presentation Manager（OS/2 上的 UI 风格），按钮、滚动条、菜单在两种风格下长得完全不一样。

你不能让代码里到处写 `new MotifButton()` 或 `new PMButton()`，那样切换风格就得改几百处。

抽象工厂的做法是弄一个 WidgetFactory 接口，定义 `createButton()`、`createScrollBar()`、`createMenu()`。Motif 风格有 MotifWidgetFactory，PM 风格有 PMWidgetFactory。客户端代码只认 WidgetFactory 接口，切换风格只换一行。

这个思路后来被 Java 学去了。Java AWT 的 `Toolkit` 类就是一个抽象工厂，不同操作系统有不同的 `Toolkit` 实现。Windows 上按钮长 Windows 样，Mac 上长 Mac 样，应用代码完全不用改。

![GoF 原始 WidgetFactory 示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-WidgetFactory%E5%8F%8C%E9%A3%8E%E6%A0%BC.png)

2005 年，四人帮中的 John Vlissides 去世了。他只活了 44 岁。其他三位后来各自在不同领域继续工作，但那本 1994 年的书，至今仍然是软件工程领域被引用最多的著作之一。

## 真实项目里，哪些地方藏着抽象工厂

除了 Java AWT，抽象工厂在工业级代码里出现的频率比你想的高。

**JDBC 数据库连接**

Java 连数据库的时候，你写 `DriverManager.getConnection(url)`，拿到的是一个 `Connection` 接口。MySQL 有 MySQL 的 Connection 实现，PostgreSQL 有 PostgreSQL 的。Connection 再创建 Statement、ResultSet，整条链路都是一族配套的产品。你换一个数据库驱动，所有配套的 Statement、ResultSet 实现跟着换，上层代码不用改。

**Spring 的 BeanFactory**

Spring 框架的核心就是一个大工厂。`ApplicationContext` 根据配置文件或注解，造出一整族配套的 Bean。你换一套配置（比如从开发环境切到生产环境），整族 Bean 跟着换，业务代码零感知。

**跨平台游戏引擎**

Unity 和 Unreal 底层的渲染模块也是这个套路。同一个游戏场景，在 DirectX 上用 DX 的纹理、着色器、渲染管线，在 Vulkan 上换成 Vulkan 的实现。游戏逻辑代码不关心底层用的是哪套图形 API。

![真实应用场景图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E7%9C%9F%E5%AE%9E%E5%BA%94%E7%94%A8.png)

## 什么时候该用，什么时候别用

先说该用的场景。

**你的系统需要支持多套「风格」或「平台」，每套风格下有一组配套产品，产品之间必须一致。** 这是教科书级的使用场景。跨平台 UI、多数据库支持、多渠道支付（微信/支付宝/银联各自的下单+查询+退款接口），都是这个路子。

再说别用的场景。

如果你的产品之间没有配套关系，每个产品可以独立存在，工厂方法就够了。杀鸡不用牛刀。

如果你只有一种产品，连工厂方法都不一定需要，一个简单的 `new` 可能就够了。

还有一种常见的坑。有些人分不清抽象工厂和 Builder 模式。区别在这里。

抽象工厂，解决的是「造出一族配套产品」的问题。
Builder，解决的是「分步骤造一个复杂产品」的问题。

抽象工厂一次给你一整套。Builder 一块一块拼一个东西。两码事。

![决策树,选哪种工厂](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E5%86%B3%E7%AD%96%E6%A0%91.png)

## 面试答题模板

面试官问「简单工厂、工厂方法、抽象工厂的区别」，你这样答。

**第一层，定义差异**

「简单工厂把所有创建逻辑放在一个工厂类里，用条件判断决定造什么。工厂方法把创建逻辑下放到子类，每种产品对应一个工厂子类。抽象工厂在工厂方法基础上扩展了一个维度，每个工厂负责造一整族配套产品。」

**第二层，举例**

「比如手机生态，简单工厂就是一个人卖所有品牌手机。工厂方法是每个品牌开一家手机专卖店。抽象工厂是每个品牌开一家旗舰体验店，手机耳机平板全配套。」

**第三层，适用场景**

「抽象工厂适合多平台 / 多风格 / 多套配的场景，核心价值是保证产品族的一致性。JDBC、Spring BeanFactory、跨平台 UI 框架底层都在用。」

这三层答完，面试官大概率会点头。

![面试答题思维导图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/abstract-factory-%E9%9D%A2%E8%AF%95%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE.png)

## 回顾一下

从纠结哥走进数码城，到苹果车间和华为车间各自开工，再到一族产品打包出厂，抽象工厂模式的核心思路就这一条。

**当产品成群结队、必须配套使用的时候，把「造一整族」的职责交给工厂，让 Client 只选生态、不操心具体产品。**

这个模式从 1994 年被四个人写进书里，到今天三十多年了，Java 的 AWT 用过它，Spring 的 BeanFactory 用过它，每一个跨平台游戏引擎的渲染层都用过它。

下次面试再被问到，你就想想手机全家桶的故事。
