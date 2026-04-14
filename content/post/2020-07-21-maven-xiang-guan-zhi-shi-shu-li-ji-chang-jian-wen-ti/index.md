---
title: "maven相关知识梳理及常见问题"
slug: 2020-07-21-maven-xiang-guan-zhi-shi-shu-li-ji-chang-jian-wen-ti
description: "maven 指定依赖版本范围有时我们为了不频繁修改依赖的版本号，会直接指定一个范围，如果你需要一直依赖最新版"
date: 2020-07-21T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-maven-xiang-guan-zhi-shi-shu-li-ji-chang-jian-wen-ti/cover.jpg
original_url: https://mp.weixin.qq.com/s/i9V_IFdl14CefYREfrMONg
categories:
  - AI
tags:
  - Cursor
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-maven-xiang-guan-zhi-shi-shu-li-ji-chang-jian-wen-ti/001-84f5873f.png)

## maven 指定依赖版本范围

**有时我们为了不频繁修****改依赖的版本号，会直接指定一个范围，如果你需要一直依赖最新版本就能省些事儿，当然也可以根据你的版本需求进行配置。**

-   A square bracket ( `[` & `]` ) means "closed" (inclusive).

-   A parenthesis ( `(` & `)` ) means "open" (exclusive).

<table style="visibility: visible;"><tbody style="visibility: visible;"><tr style="visibility: visible;"><td style="min-width: 90px; font-size: 14px; white-space: normal; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;"><p data-lake-id="5e883a4fd23cfa7786abe4795391aff9_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; visibility: visible;">Range</p></td><td style="min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="147"><p data-lake-id="5e883a4fd23cfa7786abe4795391aff9_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;">Meaning</p></td><td style="min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="224"><p data-lake-id="8d5efedb4fdbe061cc194fc98f15df26_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;">描述</p></td></tr><tr style="visibility: visible;"><td style="min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;"><p data-lake-id="f5288918051daac58a0cdf74b1d666a8_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;">1.0</p></td><td rowspan="1" colspan="1" style="text-align: left; vertical-align: top; min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="147">x &gt;= 1.0 * The default Maven meaning for 1.0 is everything (,) but with 1.0 recommended. Obviously this doesn't work for enforcing versions here, so it has been redefined as a minimum version.</td><td rowspan="1" colspan="1" style="min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="220"><p data-lake-id="5a0fc311dff521e2b515b9c018662012_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;">1.0的默认Maven含义是所有（，）但建议使用1.0。如果没有1.0则通常表示1.0或更高版本。</p><p data-lake-id="bdb0ccd19f371d36eb016a18f3ac8aa0_p_1" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;"><br style="visibility: visible;"></p></td></tr><tr style="visibility: visible;"><td style="text-align: left; vertical-align: top; background-color: rgb(249, 249, 249); min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;">(,1.0]</td><td style="text-align: left; vertical-align: top; background-color: rgb(249, 249, 249); min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="147">x &lt;= 1.0</td><td style="min-width: 90px; font-size: 14px; white-space: normal; overflow-wrap: break-word; border-width: 1px; border-style: solid; border-color: rgb(217, 217, 217); padding: 4px 8px; cursor: default; visibility: visible;" width="220"><p data-lake-id="03061f9cbcf54ad56211e4d9e1dabcd1_p_0" style="font-size: 15px; color: rgb(64, 64, 64); line-height: 1.74; letter-spacing: 0.008em; outline-style: none; overflow-wrap: break-word; margin: 0px; visibility: visible;">依赖小于等于1.0的版本</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">(,1.0)</td><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">x &lt; 1.0</td><td colspan="1" style="min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="03061f9cbcf54ad56211e4d9e1dabcd1_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖等于1.0的版本</p></td></tr><tr><td colspan="1" rowspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;"><span style="color: #333333;background-color: #F9F9F9;">[1.0]</span></td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147"><p data-lake-id="a20d224c568e48b9d67847a2c66a8c01_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;"><span style="color: rgb(51, 51, 51);background-color: rgb(249, 249, 249);font-size: 14px;" data-mce-style="font-size: 11px">x == 1.0</span></p></td><td colspan="1" rowspan="1" style="vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><pre style="background-color: #F5F5F5;">声明确切版本</pre></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">[1.0,)</td><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">x &gt;= 1.0</td><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="8d6501ebec696aae38fbae3771bdebef_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖大于等于1.0的版本</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(249, 249, 249);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">(1.0,)</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147"><p data-lake-id="a20d224c568e48b9d67847a2c66a8c01_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">x &gt; 1.0</p></td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="33e5d93f1cd23def888e85fd1a184e8c_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖大于1.0的版本</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">(1.0,2.0)</td><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">1.0 &lt; x &lt; 2.0</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="e60418bf762f9339ff636fee87f8279b_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖大于1.0小于2.0的版本</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(249, 249, 249);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">[1.0,2.0]</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(249, 249, 249);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">1.0 &lt;= x &lt;= 2.0</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="ce5f5c1663eb881c6ff7b6e78337ae5f_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖大于等于1.0小于等于2.0的版本</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">(,1.0],[1.2,)</td><td colspan="1" style="text-align: left;vertical-align: top;min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">x &lt;= 1.0 or x &gt;= 1.2. Multiple sets are comma-separated</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="a20d224c568e48b9d67847a2c66a8c01_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖小于等于1.0，或大于等于1.2的版本（多组以逗号分隔）</p></td></tr><tr><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(249, 249, 249);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;">(,1.1),(1.1,)</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(249, 249, 249);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="147">x != 1.1</td><td colspan="1" style="text-align: left;vertical-align: top;background-color: rgb(255, 255, 255);color: rgb(64, 64, 64);min-width: 90px;font-size: 14px;white-space: normal;overflow-wrap: break-word;border-width: 1px;border-style: solid;border-color: rgb(217, 217, 217);padding: 4px 8px;cursor: default;" width="220"><p data-lake-id="a20d224c568e48b9d67847a2c66a8c01_p_0" style="font-size: 15px;color: rgb(64, 64, 64);line-height: 1.74;letter-spacing: 0.008em;outline-style: none;overflow-wrap: break-word;margin: 0px;">依赖不包括1.1的版本</p></td></tr></tbody></table>

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>[1.18.8,1.18.12]</version>
</dependency>

```html

## 快照

一般我们在开发阶段包的版本会定义为：**snapshot**

```xml
 <dependency>
      <groupId>data-service</groupId>
       <artifactId>data-service</artifactId>
       <version>1.0-SNAPSHOT</version>
       <scope>test</scope>
 </dependency>

```html

每次构建项目时，Maven 将自动获取最新的快照。虽然，快照的情况下，Maven 在日常工作中会自动获取最新的快照， 你也可以在任何 maven 命令中使用 -U 参数强制 maven 现在最新的快照构建。

mvn clean package -U

**使用快照我们就不用频繁与依赖自己开发包的同事进行沟通了。maven会自动更新并引用最新快照。**

## Maven 构建生命周期

![Image](002-c2e02ea6.png "image.png")

| 阶段 | 处理 | 描述 |
| --- | --- | --- |
| 验证 validate | 验证项目 | 验证项目是否正确且所有必须信息是可用的 |
| 编译 compile | 执行编译 | 源代码编译在此阶段完成 |
| 测试 Test | 测试 | 使用适当的单元测试框架（例如JUnit）运行测试。 |
| 包装 package | 打包 | 创建JAR/WAR包如在 pom.xml 中定义提及的包 |
| 检查 verify | 检查 | 对集成测试的结果进行检查，以保证质量达标 |
| 安装 install | 安装 | 安装打包的项目到本地仓库，以供其他项目使用 |
| 部署 deploy | 部署 | 拷贝最终的工程包到远程仓库中，以共享给其他开发人员和工程 |

## 利用持续集成工具实现自动化构建

比如你需要在本项目

-   代码提交

-   项目build

-   项目deploy

-   ......

这些情况下其他项目跟着一起构建，比如你的jar包升级需要其他项目自动构建拉取最新版本时(可以结合版本范围控制)。

**可以使用jenkins的自动化构建流程功能进行设计。(build after other projects are built)**

**![Image](003-3f0ad123.png "image.png")**

## 一些基础知识

### 依赖传递(Transitive Dependencies)

依赖传递(Transitive Dependencies)是Maven 2.0开始的提供的特性，依赖传递的好处是不言而喻的，可以让我们不需要去寻找和发现所必须依赖的库，而是将会自动将需要依赖的库帮我们加进来。

例如A依赖了B，B依赖了C和D，那么你就可以在A中，像主动依赖了C和D一样使用它们。并且传递的依赖是没有数量和层级的限制的，非常方便。

但依赖传递也不可避免的会带来一些问题，例如：

-   当依赖层级很深的时候，可能造成循环依赖(cyclic dependency)

-   当依赖的数量很多的时候，依赖树会非常大

针对这些问题，Maven提供了很多管理依赖的特性

### 依赖调节(Dependency mediation)

依赖调节是为了解决版本不一致的问题(multiple versions),并采取就近原则(nearest definition)。

举例来说，A项目通过依赖传递依赖了两个版本的D：

A -> B -> C -> ( D 2.0) , A -> E -> (D 1.0),

那么最终A依赖的D的version将会是1.0，因为1.0对应的层级更少，也就是更近。

### scope 依赖范围

    Maven的生命周期存在编译、测试、运行这些过程,那么显然

-   有些依赖只用于测试比如junit；

-   有些依赖编译用不到，只有运行的时候才能用到,比如mysql的驱动包在编译期就用不到（编译期用的是JDBC接口），而是在运行时用到的；

-   还有些依赖，编译期要用到，而运行期不需要提供，因为有些容器已经提供了，比如servlet-api在tomcat中已经提供了，我们只需要的是编译期提供而已。

总结说来，在POM 4中,，中还引入了，<dependency>中还引入了<scope>，它主要管理依赖的部署。大致有**compile、provided、runtime、test、system**等几个。

| scope | 说明 | 示例 |
| --- | --- | --- |
| compile | 编译时需要用到该jar包（默认） | commons-logging |
| test | 编译Test时需要用到该jar包 | junit |
| runtime | 编译时不需要，但运行时需要用到 | mysql |
| provided | 编译时需要用到，但运行时由JDK或某个服务器提供 | servlet-api |

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <scope>test</scope>
</dependency>

```html

#### scope 的依赖传递

     A -> B -> C   当前项目 A，A依赖于B，B依赖于C

    **知道 B 在 A中的scope，怎么知道 C在 A 中的 scope ?** 即A需不需要 C的问题，本质由 C在B中的scope决定

     当 C 在 B 中的scope 是test 或 provided 时，C 直接被丢弃，A不依赖C

　　否则 A 依赖 C，C的scope 继承与B 的scope

### 依赖管理(Dependency management)

通过声明Dependency management，可以大大简化子POM的依赖声明。

举例来说项目A,B,C,D都有共同的Parent，并有类似的依赖声明如下：

-   A、B、C、D/pom.xml

```xml
<dependencies>
        <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-a</artifactId>
            <version>1.0</version>
            <exclusions>
                <exclusion>
                    <groupId>group-c</groupId>
                    <artifactId>excluded-artifact</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>group-a</groupId>
            <artifactId>artifact-b</artifactId>
            <version>1.0</version>
            <type>bar</type>
            <scope>runtime</scope>
        </dependency>
</dependencies>

```

如果父pom声明了如下的Dependency management:

-   Parent/pom.xml

```xml
<dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>group-a</groupId>
                <artifactId>artifact-a</artifactId>
                <version>1.0</version>
                <exclusions>
                    <exclusion>
                        <groupId>group-c</groupId>
                        <artifactId>excluded-artifact</artifactId>
                    </exclusion>
                </exclusions>
            </dependency>           
            <dependency>
                <groupId>group-a</groupId>
                <artifactId>artifact-b</artifactId>
                <version>1.0</version>
                <type>bar</type>
                <scope>runtime</scope>
            </dependency>
            <dependency>
                <groupId>group-c</groupId>
                <artifactId>artifact-b</artifactId>
                <version>1.0</version>
                <type>war</type>
                <scope>runtime</scope>
            </dependency>
           
        </dependencies>
</dependencyManagement>

```html

那么子项目的依赖声明会非常简单：

-   A、B、C、D/pom.xml

```xml
<dependencies>
        <dependency>
          <groupId>group-a</groupId>
          <artifactId>artifact-a</artifactId>
        </dependency>
        <dependency>
          <groupId>group-a</groupId>
          <artifactId>artifact-b</artifactId>
          <!-- 依赖的类型，对应于项目坐标定义的packaging。大部分情况下，该元素不必声明，其默认值是jar.-->
          <type>bar</type>
        </dependency>
</dependencies>

```html

### 导入依赖范围

它只使用在<dependencyManagement>中，表示从其它的pom中导入dependency的配置，例如 (B项目导入A项目中的包配置)：

想必大家在做SpringBoot应用的时候，都会有如下代码

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.3.3.RELEASE</version>
</parent>

```html

继承一个父模块，然后再引入相应的依赖。

假如说，我不想继承，或者我想继承多个，怎么做？

**我们知道Maven的继承和Java的继承一样，是无法实现多重继承的，如果10个、20个甚至更多模块继承自同一个模块，那么按照我们之前的做法，这个父模块的dependencyManagement会包含大量的依赖。如果你想把这些依赖分类以更清晰的管理，那就不可能了。**

import scope依赖能解决这个问题。你可以把dependencyManagement放到单独的专门用来管理依赖的pom中，然后在需要使用依赖的模块中通过import scope依赖，就可以引入dependencyManagement。例如可以写这样一个用于依赖管理的pom：

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.test.sample</groupId>
    <artifactId>base-parent1</artifactId>
    <packaging>pom</packaging>
    <version>1.0.0-SNAPSHOT</version>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>junit</groupId>
                <artifactid>junit</artifactId>
                <version>4.8.2</version>
            </dependency>
            <dependency>
                <groupId>log4j</groupId>
                <artifactid>log4j</artifactId>
                <version>1.2.16</version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>

```

然后我就可以通过非继承的方式来引入这段依赖管理配置

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.test.sample</groupId>
            <artifactid>base-parent1</artifactId>
            <version>1.0.0-SNAPSHOT</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
 
<dependency>
    <groupId>junit</groupId>
    <artifactid>junit</artifactId>
</dependency>
<dependency>
    <groupId>log4j</groupId>
    <artifactid>log4j</artifactId>
</dependency>

```html

**注意：import scope只能用在dependencyManagement里面**

这样，父模块的pom就会非常干净，由专门的packaging为pom来管理依赖，也契合的面向对象设计中的单一职责原则。此外，我们还能够创建多个这样的依赖管理pom，以更细化的方式管理依赖。这种做法与面向对象设计中使用组合而非继承也有点相似的味道。

那么，如何用这个方法来解决SpringBoot的那个继承问题呢？

配置如下：

这样配置的话，自己的项目里面就不需要继承SpringBoot的module了，而可以继承自己项目的module了。

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>1.3.3.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
 
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-07-21-maven-xiang-guan-zhi-shi-shu-li-ji-chang-jian-wen-ti/004-683106fa.jpg)

关注公众号 获取更多精彩内容
