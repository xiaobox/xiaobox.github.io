---
title: "图解 Builder 生成器模式，从配电脑说起"
slug: 2026-08-18-tu-jie-builder-sheng-cheng-qi-mo-shi-cong-pei-dian-nao-shuo
description: ""
date: 2026-08-18T04:00:00.000Z
image:
original_url:
categories:
  - 后端
tags:
  - Java
  - 面试
---

上一篇咱们聊了抽象工厂模式，讲的是「一族产品打包出厂」的事。有个读者看完后私信我，「抽象工厂我懂了，但你文末提了一嘴 Builder 模式没展开，能不能也讲讲？面试的时候还真被追问过这俩的区别。」

翻翻牛客面经，「Builder 模式的使用场景」「Builder 和工厂模式的区别」确实是高频题。很多人背得出定义，但一问「你项目里哪里用过 Builder」就卡壳。

今天咱们用一个程序员都经历过的事情来讲明白它。

你配过电脑吗？

![配电脑开场图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/01-%E9%85%8D%E7%94%B5%E8%84%91%E5%BC%80%E5%9C%BA%E5%9B%BE.png)

不管是大学时候攒的第一台台式机，还是工作后在京东自营一个一个加购物车的组件，配电脑这件事跟 Builder 模式简直一模一样。

你得先选 CPU，再选主板，再选内存，再选显卡，再选硬盘，再选电源，再选机箱。每一步都有选择，每一步都影响最终结果，而且顺序不能乱，不是随便往一个箱子里扔零件就能开机。

这就是 Builder 要解决的核心问题。**一个复杂对象，分步骤构建，每一步可以有不同选择，最后拼出一个完整的成品。**

跟抽象工厂完全不一样。抽象工厂是「选个品牌，整族产品打包拿走」。Builder 是「一块一块选，一步一步装，最后拼出你独一无二的那一台」。

## 装机小白 · Client

请出咱们的第一个角色，装机小白。

装机小白就是你我这样的普通用户。他想要一台电脑，但他不想操心零件之间的兼容性，不想查主板支不支持这块 CPU，不想算电源功率够不够带这张显卡。

装机小白的需求很明确，「我要一台打游戏的电脑」或者「我要一台写代码够用的办公电脑」。

他不关心装机过程是先装 CPU 还是先装内存，他只关心最后通电能开机、性能符合预期。

![装机小白走进电脑城](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/02-%E8%A3%85%E6%9C%BA%E5%B0%8F%E7%99%BD%E8%B5%B0%E8%BF%9B%E7%94%B5%E8%84%91%E5%9F%8E.png)

装机小白开口了，「老板，我预算 8000 块，想打原神和黑神话，帮我配一台。」

注意看，他说了「帮我配」三个字。他没说「给我一台现成的」。这就是 Builder 和工厂模式的根本区别。工厂模式是拿现成品，Builder 模式是按需定制。

## 装机指南 · Director

装机小白的需求谁来接？

这时候出场的是装机指南。他是电脑城柜台后面那位经验丰富的老板，干了十几年装机生意，闭着眼都知道装机的流程。

装机指南说，「你别管具体选什么型号，我来把控顺序。装机这事有讲究的，步骤不能乱。」

他心里有一套固定的装机流程。

```
第一步，选 CPU（先定平台，Intel 还是 AMD）
第二步，选主板（必须跟 CPU 兼容）
第三步，选内存（DDR4 还是 DDR5 取决于主板）
第四步，选显卡（看预算和用途）
第五步，选硬盘（系统盘 + 数据盘）
第六步，选电源（功率必须罩得住所有配件）
第七步，装进机箱，理线，通电测试
```

![装机指南的流程清单](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/03-%E8%A3%85%E6%9C%BA%E6%8C%87%E5%8D%97%E6%B5%81%E7%A8%8B%E6%B8%85%E5%8D%95.png)

装机指南不管你最后装的是 i9 还是 i5，他只管流程对不对、顺序对不对、别漏了步骤。

翻译成代码。

```java
public class AssemblyGuide {
    
    public Computer assemble(ComputerBuilder builder) {
        builder.buildCPU();
        builder.buildMotherboard();
        builder.buildMemory();
        builder.buildGPU();
        builder.buildStorage();
        builder.buildPowerSupply();
        return builder.getResult();
    }
}
```

注意看这个类。它不知道选的是什么 CPU，不知道显卡是 4070 还是 4090，它只知道「按顺序调方法」。

这就是 Director 的定位。**他掌握构建流程，但不决定具体配件。**

> Director 可以省略吗？

可以。很多 Builder 的实际用法里没有单独的 Director 类。装机小白自己按顺序调也行。但有了 Director，同一套构建流程可以复用，不同的 Builder 插进去就能造出不同配置的电脑。GoF 原书里保留了这个角色，面试里也经常考，所以咱们先留着它。

## 老师傅的手艺 · Builder 接口

装机指南说「选 CPU」「选显卡」，但具体选什么，得有人来做。

这个「做」的能力，先定义成一份接口，像一份装机师傅的岗位说明书。

```java
public interface ComputerBuilder {
    void buildCPU();
    void buildMotherboard();
    void buildMemory();
    void buildGPU();
    void buildStorage();
    void buildPowerSupply();
    Computer getResult();
}
```

![Builder 接口岗位说明书](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/04-Builder%E6%8E%A5%E5%8F%A3%E5%B2%97%E4%BD%8D%E8%AF%B4%E6%98%8E%E4%B9%A6.png)

这份接口说的是，「不管你是高端装机师傅还是性价比师傅，你都得会这六项活，最后交出一台完整的电脑。」

没有一行具体实现。不知道 CPU 选哪家，不知道内存插几条。

跟抽象工厂里的 EcosystemFactory 接口有点像？没错，都是接口层面做抽象。区别在于，抽象工厂的接口里每个方法**造一种独立产品**（手机、耳机、平板），Builder 的接口里每个方法**给同一个产品装一个零件**。

一个是造一族东西，一个是造一个东西。方向不一样。

## 性价比师傅 · ConcreteBuilder（经济型）

第一位具体的装机师傅来了。性价比师傅，江湖人称「5000 块带你起飞」。

```java
public class BudgetBuilder implements ComputerBuilder {
    private Computer computer = new Computer();
    
    public void buildCPU() {
        computer.setCpu("AMD Ryzen 5 7600");
    }
    
    public void buildMotherboard() {
        computer.setMotherboard("微星 B650M 迫击炮");
    }
    
    public void buildMemory() {
        computer.setMemory("金百达 DDR5 16GB×2");
    }
    
    public void buildGPU() {
        computer.setGpu("RTX 4060");
    }
    
    public void buildStorage() {
        computer.setStorage("致态 TiPlus7100 1TB");
    }
    
    public void buildPowerSupply() {
        computer.setPowerSupply("长城 550W 铜牌");
    }
    
    public Computer getResult() {
        return computer;
    }
}
```

性价比师傅嘴里念叨着，「7600 配 B650M，这套平台稳得很。DDR5 现在价格也下来了，直接上双通道 32G。4060 打原神绰绰有余，1T 固态够装二十来个游戏。550W 电源带这套配置功率富余 30%，安全。」

注意看，**每一步 build 方法里，师傅往同一个 Computer 对象身上装零件**。不是造六个产品，是给一个产品装六次。

## 发烧友师傅 · ConcreteBuilder（高端型）

第二位师傅也来了。发烧友师傅，信条是「性能不够就加钱」。

```java
public class HighEndBuilder implements ComputerBuilder {
    private Computer computer = new Computer();
    
    public void buildCPU() {
        computer.setCpu("Intel i9-14900K");
    }
    
    public void buildMotherboard() {
        computer.setMotherboard("华硕 ROG MAXIMUS Z790 HERO");
    }
    
    public void buildMemory() {
        computer.setMemory("芝奇 DDR5 32GB×2 6400MHz");
    }
    
    public void buildGPU() {
        computer.setGpu("RTX 4090");
    }
    
    public void buildStorage() {
        computer.setStorage("三星 990 PRO 2TB");
    }
    
    public void buildPowerSupply() {
        computer.setPowerSupply("海韵 PRIME 1000W 钛金");
    }
    
    public Computer getResult() {
        return computer;
    }
}
```

发烧友师傅的眼里没有预算两个字，「i9 配 ROG 败家之眼，DDR5 直接上 64G 高频，4090 嘛你懂的，2T 三星旗舰固态，电源 1000W 钛金给你留足余量，以后换 5090 都不用换电源。」

![两位师傅对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/05-%E4%B8%A4%E4%BD%8D%E5%B8%88%E5%82%85%E5%AF%B9%E6%AF%94%E5%9B%BE.png)

两位师傅用同一套流程（ComputerBuilder 接口），造出完全不同配置的电脑。性价比师傅 5000 块搞定，发烧友师傅两万五起步。但装机指南（Director）那边的代码，一行都不用改。

**这就是 Builder 模式的核心。构建过程固定，构建细节可替换。**

## 整机通电 · Product

最后一个角色，Computer 本身。

```java
public class Computer {
    private String cpu;
    private String motherboard;
    private String memory;
    private String gpu;
    private String storage;
    private String powerSupply;
    
    // setter 和 getter 省略
    
    public String toString() {
        return "CPU: " + cpu + "\n"
             + "主板: " + motherboard + "\n"
             + "内存: " + memory + "\n"
             + "显卡: " + gpu + "\n"
             + "硬盘: " + storage + "\n"
             + "电源: " + powerSupply;
    }
}
```

Computer 就是最终交付的成品。它自己不知道自己是怎么被装出来的，也不关心是性价比师傅装的还是发烧友师傅装的。它只管被用就行。

到这里，Builder 模式的四个角色全部到齐了。

![四个角色关系图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/06-%E5%9B%9B%E4%B8%AA%E8%A7%92%E8%89%B2%E5%85%B3%E7%B3%BB%E5%9B%BE.png)

我整理了一下，把四个角色的关系画成一张图。

| 角色 | 代码里的身份 | 配电脑里的对应 |
|---|---|---|
| 装机小白 | Client | 提需求的人，只说「我要打游戏」 |
| 装机指南 | Director | 掌握装机流程顺序的老板 |
| 老师傅的手艺 | Builder 接口 | 装机师傅的岗位说明书 |
| 性价比/发烧友师傅 | ConcreteBuilder | 不同配置方案的具体执行者 |
| 整机 | Product | 最终组装好能开机的电脑 |

## 八步对话，演一遍完整流程

光看表格不过瘾，让角色们自己演一遍。

---

装机小白推开电脑城的玻璃门，空调冷风吹了一脸，舒服。

**第 1 步**，装机小白走到柜台前，「老板，预算 5000，能打原神和黑神话，帮我配一台。」

**第 2 步**，装机指南点点头，转身拍了拍性价比师傅的肩膀，「5000 块的单子，你来。」

**第 3 步**，性价比师傅打开配件柜，先拿出一块 AMD Ryzen 5 7600，「CPU 定了，AMD 平台，性价比之王。」

**第 4 步**，性价比师傅紧接着取出微星 B650M 迫击炮主板，「B650M 配 7600，这俩是老搭档了，插上就能用。」

**第 5 步**，内存条、显卡、硬盘一个接一个从柜子里出来。师傅一边装一边念叨，「DDR5 双通道 32G，4060 打黑神话中画质 60 帧稳稳的，1T 固态够你折腾。」

**第 6 步**，最后装上 550W 电源，接好线，师傅拧紧最后一颗螺丝，把机箱面板扣上。

**第 7 步**，通电。屏幕亮了，BIOS 画面出来了，CPU 温度正常，内存识别正确，硬盘读写没问题。师傅说，「可以了，装个系统就能用。」

**第 8 步**，装机小白抱着机箱走出电脑城，心里想，「5000 块搞定，回去先下个原神。」

![完整流程时序图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/07-%E5%AE%8C%E6%95%B4%E6%B5%81%E7%A8%8B%E6%97%B6%E5%BA%8F%E5%9B%BE.png)

---

翻译成代码就是这样。

```java
public class ComputerShop {
    public static void main(String[] args) {
        // 装机指南出场
        AssemblyGuide guide = new AssemblyGuide();
        
        // 装机小白选了性价比方案
        ComputerBuilder builder = new BudgetBuilder();
        
        // 按流程组装
        Computer myPC = guide.assemble(builder);
        
        // 拿到整机
        System.out.println(myPC);
    }
}
```

装机小白想换发烧友方案？改一行。

```java
ComputerBuilder builder = new HighEndBuilder();  // 就改这一行
```

后面的代码一个字都不用动。CPU 变成 i9，显卡变成 4090，电源变成 1000W，全自动切换。

> 那我想加一个新的装机方案呢？

比如来个「程序员专用方案」，多条内存少花在显卡上。新建一个 DevBuilder，实现 ComputerBuilder 接口，在里面选 64G 内存 + 核显方案。原来的 BudgetBuilder、HighEndBuilder 一行都不用改。

这也是开闭原则。加新方案不动老代码。

## 链式调用，Builder 的另一副面孔

上面讲的是 GoF 经典写法，有 Director 有 Builder 接口。但你在实际项目里见到的 Builder，大概率长这样。

```java
Computer pc = new Computer.Builder()
        .cpu("AMD Ryzen 7 7800X3D")
        .motherboard("华硕 B650M-PLUS")
        .memory("DDR5 32GB")
        .gpu("RTX 4070 Ti")
        .storage("1TB NVMe")
        .powerSupply("650W")
        .build();
```

这就是链式 Builder，也叫 Fluent Builder。

没有单独的 Director，没有 Builder 接口，只有一个静态内部类做 Builder，每个 setter 方法返回 `this`，最后调 `build()` 拿到成品。

```java
public class Computer {
    private String cpu;
    private String motherboard;
    private String memory;
    private String gpu;
    private String storage;
    private String powerSupply;
    
    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.motherboard = builder.motherboard;
        this.memory = builder.memory;
        this.gpu = builder.gpu;
        this.storage = builder.storage;
        this.powerSupply = builder.powerSupply;
    }
    
    public static class Builder {
        private String cpu;
        private String motherboard;
        private String memory;
        private String gpu;
        private String storage;
        private String powerSupply;
        
        public Builder cpu(String cpu) {
            this.cpu = cpu;
            return this;
        }
        
        public Builder motherboard(String mb) {
            this.motherboard = mb;
            return this;
        }
        
        public Builder memory(String mem) {
            this.memory = mem;
            return this;
        }
        
        public Builder gpu(String gpu) {
            this.gpu = gpu;
            return this;
        }
        
        public Builder storage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Builder powerSupply(String ps) {
            this.powerSupply = ps;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
}
```

![GoF 经典 vs 链式 Builder 对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/08-GoF%E7%BB%8F%E5%85%B8vs%E9%93%BE%E5%BC%8FBuilder.png)

> 链式 Builder 还算 Builder 模式吗？

当然算。GoF 定义 Builder 模式的核心意图是「将一个复杂对象的构建与它的表示分离」。链式 Builder 做到了，构建过程在 Builder 内部类里，表示（最终对象）是 Computer 本身。只是省掉了 Director 和 Builder 接口层，因为大多数场景不需要那么多抽象。

两种写法各有适用场景。

- **GoF 经典写法**，适合同一个构建流程需要产出多种不同配置的场景（比如游戏主机和办公主机共享同一个装机流程）
- **链式 Builder**，适合构造参数多、可选参数多、需要防止构造函数爆炸的场景（这个更常见）

实际工程里，链式 Builder 的出场频率远高于经典写法。

## Builder 到底在解决什么问题

先看一个没有 Builder 时候的痛点。

假设 Computer 类有 6 个字段，如果用构造函数来创建对象。

```java
Computer pc = new Computer(
    "AMD Ryzen 5 7600",      // 这是啥？CPU？主板？
    "微星 B650M",             // 看不出来
    "DDR5 32GB",              // 猜是内存
    "RTX 4060",               // 显卡吧？
    "1TB",                    // 硬盘？电源？
    "550W"                    // 应该是电源
);
```

6 个参数全是 String 类型，位置传错了编译器不会报错，运行时才发现 CPU 和显卡填反了。

更麻烦的是，如果有些参数是可选的呢？有人不要独显（用核显），有人不需要机械硬盘只要固态。你要么写一堆重载构造函数（2 的 n 次方种组合），要么让所有参数都 nullable 然后传一堆 null。

这就是「构造函数爆炸」问题，Effective Java 里 Joshua Bloch 专门讨论过。他给出的解法就是 Builder 模式。

> 用 setter 不行吗？

```java
Computer pc = new Computer();
pc.setCpu("AMD Ryzen 5 7600");
pc.setMotherboard("微星 B650M");
// 忘了 set 内存...
// 忘了 set 电源...
pc.powerOn();  // 开机黑屏，缺零件
```

setter 的问题是，对象在创建和使用之间有一个「半成品」窗口。你 new 出来的那一刻它就已经可以被使用了，但它内部可能缺胳膊少腿。Builder 的 `build()` 方法可以在最后做一次完整性校验，缺零件直接报错，不让半成品流出去。

![构造函数爆炸 vs setter 半成品 vs Builder 对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/09-%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0vs-setter-vs-Builder.png)

## 真实项目里，哪些地方藏着 Builder

Builder 在工业级代码里出现的频率极高，可能是 23 个设计模式里用得最多的一个。

**StringBuilder / StringBuffer**

Java 里拼字符串最基础的 Builder。

```java
String sql = new StringBuilder()
        .append("SELECT * FROM users")
        .append(" WHERE age > 18")
        .append(" ORDER BY name")
        .toString();
```

每次 `append()` 返回 `this`，最后 `toString()` 拿到成品字符串。

**OkHttp 的 Request.Builder**

Android 和 Java 后端用得最多的 HTTP 客户端，请求构建就是标准的链式 Builder。

```java
Request request = new Request.Builder()
        .url("https://api.example.com/users")
        .addHeader("Authorization", "Bearer xxx")
        .post(body)
        .build();
```

url、header、method、body 这些东西你按任意顺序设置都行，最后 `build()` 的时候 OkHttp 帮你校验「url 不能为空」「POST 请求 body 不能为 null」，校验不过直接抛异常。

**Retrofit 的配置**

```java
Retrofit retrofit = new Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
        .client(okHttpClient)
        .build();
```

**Lombok 的 @Builder**

Java 程序员的福音。在类上面加一个注解，编译器自动帮你生成整个 Builder 内部类。

```java
@Builder
public class Computer {
    private String cpu;
    private String motherboard;
    private String memory;
    private String gpu;
    private String storage;
    private String powerSupply;
}

// 使用
Computer pc = Computer.builder()
        .cpu("AMD Ryzen 5 7600")
        .gpu("RTX 4060")
        .build();
```

你不用自己写那个 Builder 静态内部类了。Lombok 在编译阶段自动生成。

**Spring Security 的配置链**

```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/public/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
    )
    .formLogin(form -> form.loginPage("/login"))
    .build();
```

Spring Security 的整个安全配置就是一个大 Builder，每一步配一条规则，最后 `build()` 出来一个完整的过滤器链。

**SQL 查询构建器**

MyBatis-Plus、QueryDSL、jOOQ 这些库的查询 API，底层都是 Builder 模式。

```java
QueryWrapper<User> query = new QueryWrapper<User>()
        .eq("status", 1)
        .gt("age", 18)
        .orderByDesc("create_time");
```

每一个条件方法返回 `this`，最后生成完整的 SQL 语句。

![真实应用场景全景图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/10-%E7%9C%9F%E5%AE%9E%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF%E5%85%A8%E6%99%AF%E5%9B%BE.png)

你看，从最简单的字符串拼接到复杂的安全配置，Builder 无处不在。它解决的问题只有一个，**参数多、组合多、步骤多的复杂对象，给你一种清晰、安全、可读的构建方式**。

## GoF 怎么描述 Builder

继续上一篇的线索。1994 年那本《Design Patterns》里，Builder 也是五个创建型模式之一。

GoF 给 Builder 模式的定义。

**「将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。」**

Separate the construction of a complex object from its representation so that the same construction process can create different representations.

翻译成大白话，「装机流程是固定的（先 CPU 后主板后内存），但同一个流程可以装出游戏主机、办公主机、工作站，看你用什么零件。」

GoF 书里给 Builder 举的原始例子是 RTF 文档解析器。一份 RTF 格式的文档，可以被转换成 ASCII 纯文本、TeX 格式、或者带格式的 GUI 文本组件。三种输出完全不一样，但解析 RTF 的流程是一样的，逐个 token 读取、判断类型、调用对应的构建方法。

三种 ConcreteBuilder 分别对应 ASCIIConverter、TeXConverter 和 TextWidgetConverter，Director 是 RTFReader，按顺序读 token 并分发。

![GoF RTF 文档转换器示意图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/11-GoF-RTF%E6%96%87%E6%A1%A3%E8%BD%AC%E6%8D%A2%E5%99%A8.png)

这个例子放到今天依然有效。你把 RTF 换成 Markdown，把三种 Converter 换成 HTML 渲染器、PDF 渲染器、docx 导出器，本质一模一样。同一份 Markdown 文档，同一个解析流程，Builder 不同，产出不同。

## 三种创建型模式放在一起比

上一篇比了三种工厂，这篇咱们把 Builder 也拉进来。

![创建型模式对比图](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/12-%E5%88%9B%E5%BB%BA%E5%9E%8B%E6%A8%A1%E5%BC%8F%E5%AF%B9%E6%AF%94%E5%9B%BE.png)

| 对比维度 | 简单工厂 | 工厂方法 | 抽象工厂 | Builder |
|---|---|---|---|---|
| 解决什么 | 封装 new | 让子类决定造什么 | 造一族配套产品 | 分步构建复杂对象 |
| 产品数量 | 一个 | 一个 | 一族（多个配套） | 一个（但很复杂） |
| 构建方式 | 一步到位 | 一步到位 | 一步到位 | 分步骤 |
| 核心关注 | 创建逻辑集中 | 创建逻辑下放 | 产品族一致性 | 构建过程与表示分离 |
| 典型场景 | if-else 选产品 | 框架扩展点 | 跨平台 UI / 多数据库 | 参数多的复杂对象 |

一句话说清四个的区别。

简单工厂，你去便利店说「来瓶可乐」，店员从冰柜拿一瓶递给你。
工厂方法，可口可乐和百事可乐各自开工厂，你选品牌就行。
抽象工厂，你选了苹果生态，手机耳机平板打包出厂。
Builder，你去奶茶店点单，糖度、冰量、加料一个一个选，最后拼出你专属的那杯。

## 什么时候该用，什么时候别用

先说该用的场景。

**构造参数超过 4 个，而且有些是可选的。** 这是最典型的 Builder 使用场景。参数越多，构造函数越难读，setter 半成品风险越高，Builder 的价值就越大。

**对象构建有步骤依赖。** 比如 HTTP 请求得先有 URL 才能加 header，数据库连接池得先配好 URL 才能设最大连接数。Builder 的 `build()` 方法可以统一做校验。

**同一个构建流程需要产出不同配置的对象。** 这是 GoF 经典写法（带 Director）的主场。测试环境和生产环境的配置不同，但配置流程一样。

再说别用的场景。

如果你的对象只有两三个字段，构造函数就够了。Builder 是解决复杂性的工具，对象不复杂就别硬用。

如果你的对象是不可变的（所有字段 final），Builder 可以用，但 Java 14+ 的 Record 类型可能更简洁。

> Builder 和工厂模式怎么选？

工厂，关注的是「造什么」。你要苹果手机还是华为手机？

Builder，关注的是「怎么造」。你要什么 CPU、什么显卡、什么内存？

产品种类多、但每种产品结构简单，用工厂。产品种类不多、但每个产品内部很复杂，用 Builder。

![决策树，选哪种创建模式](https://xiaobox-public-images.oss-cn-beijing.aliyuncs.com/images/13-%E5%86%B3%E7%AD%96%E6%A0%91.png)

## 面试答题模板

面试官问「Builder 模式的作用和使用场景」，你这样答。

**第一层，定义**

「Builder 模式将复杂对象的构建过程与最终表示分离。经典写法有 Director 控制构建顺序、Builder 接口定义步骤、ConcreteBuilder 提供具体实现。实际项目里更常见的是链式 Builder，每个 setter 返回 this，最后 build() 出成品。」

**第二层，解决什么问题**

「主要解决构造函数参数过多导致的可读性和安全性问题。参数一多，构造函数难读且容易传错位置。setter 虽然灵活但会产生半成品对象。Builder 既保证可读性，又能在 build() 时做完整性校验。」

**第三层，真实案例**

「Java 标准库的 StringBuilder，OkHttp 的 Request.Builder，Retrofit 的配置链，Lombok 的 @Builder 注解，Spring Security 的安全配置，都是 Builder 模式的应用。」

**追问，跟工厂的区别**

「工厂关注造什么，Builder 关注怎么造。工厂一步出成品，Builder 分步骤构建。抽象工厂造一族配套产品，Builder 造一个复杂产品。」

![面试答题思维导图](builder-images/14-面试答题思维导图.png)

这四层答完，面试官大概率会满意。

## 回顾一下

从装机小白走进电脑城，到性价比师傅和发烧友师傅各自选配件，再到通电开机交付整机，Builder 模式的核心思路就这一条。

**当一个对象太复杂、参数太多、步骤有讲究的时候，把「怎么造」的过程抽出来，让不同的 Builder 去实现，Client 只管选方案、不管装配细节。**

这个模式从 1994 年被 GoF 写进书里，到今天三十多年了，Java 的 StringBuilder 用它拼字符串，OkHttp 用它构建请求，Spring Security 用它配安全策略，Lombok 甚至帮你自动生成 Builder 代码。

下次面试再被问到，你就想想配电脑的故事。选 CPU、选显卡、选内存，一步一步装，最后通电开机，这就是 Builder。
