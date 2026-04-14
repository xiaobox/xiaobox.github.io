---
title: "从初始化一个现代 python 项目中学习到的东西"
slug: 2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi
date: 2025-04-27T06:57:05.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/cover.jpg
original_url: https://mp.weixin.qq.com/s/KW5L59EfTRCPb8fTg-M4ZA
categories:
  - 系统底层
tags:
  - Java
  - Python
  - Rust
  - Linux
  - macOS
  - MCP
  - 缓存
---
## uv

我准备用 uv 初始化一个 python 项目

### 环境

我用的是苹果笔记本 MacBookPro ，具体的操作系统及硬件参数如下：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/001-7b50b558.png)

### uv 的介绍与安装

> “
> 
> uv 是一个使用 Rust 编写的工具，可以用来替代 pip、pipenv、pipx、poetry、virtualenv 等工具的使用，甚至还可以用来管理系统中所安装的 Python 发行版。uv 借鉴了很多现代语言中对于项目依赖的管理方式，项目中对于依赖的管理要远远优于使用 pip 和requirements.txt的方式。

我之前用过 pip 、pipx 等工具，发现 uv 确实要快不少。具体有多快呢？ github 上有个图：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/002-23c27ef6.png)

🚀速度比传统 pip 快 10-100倍。

根据官网的介绍，uv 主要支持以下功能：

-   支持版本锁定的项目依赖管理。
-   支持直接运行 Python 脚本。
-   支持对系统中安装的 Python 进行管理，支持多版本 Python 共存。
-   支持 Python 包的发布和安装。
-   支持兼容 pip 的应用接口。
-   支持 Cargo 模式的项目工作区管理。
-   更优化的全局支持库缓存。
-   运行无需 Rust 或者 Python 支持。
-   支持 Windows、macOS 和 Linux 系统

uv 对多 python 版本和环境的管理很不错，这样你就可以一个项目指定一个特定的 Python 版本，放心使用，想怎么折腾怎么折腾，不会影响全局。

最近比较火的 MCP 很多也是用 uv 运行的，因为用 uv 命令可以直接运行 python 脚本。

uv 的安装非常简单：

```bash
# macOS和Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

```

### uv 对 Python 的环境管理

首先用 uv 管理一下我们本机安装的 Python 环境。即到底安装了几个、哪些版本的 python。

可以用 `uv python list`  查看，像这样：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/003-cd779d4c.png)

可以看到我已经安装了多个版本的 python。 在后面建项目的时候，我选用 3.13 这个版本。当然你也可以根据你的情况下载新的需要使用的版本。这里给出一组相关命令：

```
uv python install，安装指定版本的 Python。
uv python list，列出系统中当前已经安装的 Python 版本。
uv python find，查找一个已经安装的 Python 版本。
uv python pin，固定当前项目使用指定的 Python 版本。
uv python uninstall，卸载指定版本的 Python。

```

比如我要安装 3.12 这个版本，我就可以这样：

```
uv python install 3.13

```

装好了不想要了，就可以这样卸载掉它：

```
uv python uninstall 3.13 

```

### uv 进行项目管理

python 的环境有了以后，我们就可以新建项目了，建项目的时候也要用 uv 来进行初始化。

> “
> 
> uv 的项目管理功能更多的借鉴了 Rust 中 Cargo 工具的项目管理理念。但主要区别是 uv 是通过项目目录中的pyproject.toml文件来完成项目管理的。

```
uv init myproject

```

初始化后会生成以下几个文件 ：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/004-32d38507.png)

虽然 uv init myproject 会帮你创建项目目录和 pyproject.toml，但默认 不会自动创建虚拟环境（env），所以我们需要手动创建。

```
# 手动创建虚拟环境
uv venv --python 3.13
# 激活虚拟环境
source .venv/bin/activate

```

虚拟环境激活后，项目中会多一个.venv 文件夹。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2025-04-27-cong-chu-shi-hua-yi-ge-xian-dai-python-xiang-mu-zhong-xue-xi/005-3a39005f.png)

接下来我们要自己创建一下源码目录和测试目录：

```
mkdir -p src tests

```

到这里工程的相关目录我们就先到此为止，基本上创建完了，然后我们来编辑

pyproject.toml 配置文件。

### toml 配置文件

我们先介绍一下 toml 文件，可能有些朋友不怎么了解它，比如搞 java 开发的。

TOML（Tom's Obvious, Minimal Language）是一种配置文件格式，设计目标是**易读、易写、易于解析**，非常适合作为程序的配置语言，尤其是在现代的跨平台开发中被广泛采用。

你看这名字是不是觉得肯定跟 Tom 大哥有关系？

对，因为 TOML 由 GitHub 联合创始人 Tom Preston-Werner 在 2013 年发起，用以替代 JSON、INI 等配置格式在可读性和灵活性上的不足。

不过吧，后来这大哥（和她媳妇）不在 GitHub 干了，因为他们的一些不光彩的行为。具体是什么就不多说了，想八卦一下的可以去查查。

toml 配置文件用途广泛，常用于以下场景：

-   应用程序运行时配置
-   包管理工具（如 Python 的 pyproject.toml、Rust 的 Cargo.toml）
-   构建工具配置（如 poetry.toml, uv.toml）
-   数据库或服务连接信息等环境参数配置

举个例子吧：

```
# 数据库配置
[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
enabled = true

# 应用信息
[app]
name = "MyApp"
version = "1.0.0"
release_date = 2025-04-25T12:00:00Z

```

TOML 的特点可以总结为：

> “
> 
> “比 JSON 更适合人读，比 YAML 更适合程序解析。”

它已经成为现代软件开发中最流行的配置文件格式之一，特别是在需要 **清晰结构 + 丰富类型 + 可维护性** 的场景中表现出色。

常见语言的支持情况：

-   Python：tomli / toml / pytoml / tomllib（Python 3.11 原生支持）
-   Rust：官方包管理工具 Cargo 就使用 TOML 格式的 Cargo.toml
-   Go：支持 BurntSushi/toml 库
-   Node.js：支持 @iarna/toml 等多个库

常见用途：

-   Python 包管理：pyproject.toml（PEP 518 标准）
-   Rust 项目管理：Cargo.toml
-   Web 项目配置：netlify.toml
-   DevOps 工具：例如 uv 的配置也是用 toml 文件

TOML 与其他格式的对比：

| 特性 | TOML | JSON | YAML | INI |
| --- | --- | --- | --- | --- |
| 可读性 | ✅ 高 | 中 | 中高（但复杂） | 中 |
| 注释支持 | ✅ 支持 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |
| 数据类型支持 | ✅ 多 | ✅ 多 | ✅ 多 | ❌ 有限 |
| 库支持 | ✅ 常见语言皆支持 | ✅ 全面 | ✅ 全面 | ✅ 较好 |
| 学习曲线 | ✅ 低 | ✅ 低 | ❌ 偏高 | ✅ 极低 |

你看，TOML 作为配置文件感觉很不错对吧。

我们关于 TOML 的介绍就到此为止，现在来说一下我们这个初始化的新项目中的 pyproject.toml 文件要写成什么样。

就这样：

```
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "myproject"
version = "0.1.0"
description = "一个基于Python 3.13.3的项目"
readme = "README.md"
requires-python = ">=3.13"
authors = [
    {name = "xiaobox", email = "xiaobox@gmail.com"}
]
dependencies = [
    "pytest>=7.4.3",
    "fastapi>=0.110.0",
    "uvicorn>=0.27.0",
    "httpx>=0.27.0",
]
classifiers = [
    "Programming Language :: Python :: 3.13",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]

[project.scripts]
myproject = "src.main:main"

[project.urls]
"Homepage" = "https://github.com/yourusername/myproject"
"Bug Tracker" = "https://github.com/yourusername/myproject/issues"

[project.optional-dependencies]
dev = [
    "black>=23.1.0",
    "isort>=5.12.0",
    "mypy>=1.5.1",
]

[tool.pytest]
testpaths = ["tests"]

[tool.black]
line-length = 88
target-version = ["py313"]

[tool.isort]
profile = "black"
line_length = 88

[tool.hatch.build.targets.wheel]
packages = ["src"] 

```

别小看了这个文件，它可是一个使用了 Hatch 构建工具、遵循 PEP 621 和现代 Python 项目结构规范的项目配置，涵盖了运行依赖、开发依赖、CLI 脚本、格式化工具配置、测试路径和打包目标，非常完整规范。

所以我们得逐行解释一下这个重要的文件。

### toml 配置文件的逐行解释

我们上面的配置文件是一个标准的 Python 项目使用 `pyproject.toml` 来管理构建系统、依赖、工具配置的典型示例。下面我们来拆解和解释一下。

* * *

✅ `[build-system]`：构建系统配置（PEP 517 标准）

```
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

```

-   `requires`：构建该项目所需的构建工具，这里是 `hatchling`，必须先安装。
-   `build-backend`：指定用哪个构建后端来执行打包任务，这里是 `hatchling.build`。

hatchling 有点儿类似 java 中的  Maven 或 Gradle，都是用来执行自动化构建流程的。

-   Maven 是把 java 代码编译、构建成 jar 包，方便管理依赖、分发、版本控制
-   hatchling 是把 python 代码构建成 Wheel（.whl 文件）或 Source Distribution（.tar.gz 或 .zip 文件），也是为了做依赖管理、分发和版本控制。

总结来说：**Python 的构建是将代码和依赖打包成 .whl 或 .tar.gz，类似于 Java 打包成 .jar。核心目的是简化分发、确保环境一致性、自动化依赖管理。**

* * *

✅ `[project]`：项目的核心元信息（PEP 621 标准）

```
[project]
name = "myproject"

```

-   项目名称，最终发布到 PyPI 时会用这个名字。

```
version = "0.1.0"

```

-   当前版本号。

```
description = "一个基于Python 3.13.3的项目"

```

-   简短的项目说明。

```
readme = "README.md"

```

-   指定项目的 README 文件，将作为 PyPI 上项目首页的介绍内容。

```
requires-python = ">=3.13"

```

-   要求的 Python 版本最低为 3.13。

```
authors = [
    {name = "xiaobox", email = "xiaobox@gmail.com"}
]

```

-   作者信息，支持多个，用列表表示。

```
dependencies = [
    "pytest>=7.4.3",
    "fastapi>=0.110.0",
    "uvicorn>=0.27.0",
    "httpx>=0.27.0",
]

```

-   项目的运行时依赖库，在安装时会自动安装这些包。这里我加入了 pytest、**fastapi** 的依赖，因为我想把这个项目作为一个 api 服务提供出去。

```
classifiers = [
    "Programming Language :: Python :: 3.13",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]

```

-   用于 PyPI 分类（帮助搜索和筛选）。

* * *

### ✅ `[project.scripts]`：定义可执行命令（如 CLI）

```
[project.scripts]
myproject = "src.main:main"

```

-   安装后运行 `myproject` 命令会调用 `src/main.py` 中的 `main()` 函数。（我们需要提前把之前的 main.py 文件要先移动到 /src 目录下）

* * *

### ✅ `[project.urls]`：项目的相关链接（非必须）

```
[project.urls]
"Homepage" = "https://github.com/yourusername/myproject"
"Bug Tracker" = "https://github.com/yourusername/myproject/issues"

```

-   为项目指定一些有用的链接，如主页、问题反馈页等。

* * *

### ✅ `[project.optional-dependencies]`：可选依赖（比如开发环境）

```
[project.optional-dependencies]
dev = [
    "black>=23.1.0",
    "isort>=5.12.0",
    "mypy>=1.5.1",
]

```

我们为开发环境安装了三个库：black、isort 和 mypy

介绍一下这三个工具

-   black：是一个 Python 代码格式化工具。自动把你的 Python 代码排版成统一风格，比如：缩进、换行、空格都按标准格式处理，让你的 Python 代码看起来更整齐、统一，无需自己动手排版。

-   isort：是一个 Python 导入（import）语句自动排序工具。自动整理文件顶部的 import 语句，比如按字母顺序排列，分组标准库、第三方库、自定义模块，保持导入部分有序且规范。

-   mypy：是一个 Python 静态类型检查工具。检查你的代码里的类型注解（type hints）是不是正确，比如函数参数和返回值类型对不对，帮你在写代码时发现类型出错的地方，提前避免 bug。

* * *

### ✅ `[tool.pytest]`：Pytest 配置

```
[tool.pytest]
testpaths = ["tests"]

```

-   指定测试用例所在路径，`pytest` 会从 `tests/` 目录开始查找测试文件。

* * *

### ✅ `[tool.black]`：代码格式化工具 Black 的配置

```
[tool.black]
line-length = 88
target-version = ["py313"]

```

-   设置代码的行最大长度为 88（默认值），目标 Python 版本是 3.13。

* * *

### ✅ `[tool.isort]`：import 排序工具 isort 的配置

```
[tool.isort]
profile = "black"
line_length = 88

```

-   使用 `black` 的风格对 import 排序。
-   设置行长度为 88，与 black 保持一致。

* * *

### ✅ `[tool.hatch.build.targets.wheel]`：Hatchling 打包配置

```
[tool.hatch.build.targets.wheel]
packages = ["src"]

```

-   指定打包时要包含的代码目录为 `src`。

* * *

用一句话总结下这个 `pyproject.toml` 配置文件 ：

**“这是一个使用 Hatch 构建工具、遵循 PEP 621 和现代 Python 项目结构规范的项目配置，涵盖了运行依赖、开发依赖、CLI 脚本、格式化工具配置、测试路径和打包目标，非常完整规范。”**

### 安装和更新依赖

上面这个文件编辑完成后，我们就可以 安装项目和开发依赖了：

```
uv pip install -e ".[dev]"

```

如果后面你更新了 `pyproject.toml` 文件可以执行以下命令来 “手动刷新” 一个依赖库：

```
uv sync --extra dev 

```

加入 `--extra dev`  参数是因为 `uv sync` 默认只安装 [project.dependencies] 中列出的正式依赖。

不会自动安装 [project.optional-dependencies]（比如 dev 里面的 black、isort、mypy）

`uv sync --extra dev` 的意思是：除了正式依赖，还要把 [project.optional-dependencies.dev] 里的东西也同步上

### uv.lock

当执行完  `uv sync --extra dev` ，安装好依赖好， uv 会在项目根路径生成一个 `uv.lock` 文件 。uv.lock 是 锁定依赖版本 的文件。

它的作用是：把 pyproject.toml 里描述的依赖（比如 "fastapi>=0.110.0" 这样比较宽松的范围），具体锁定成明确、唯一的版本（比如 "fastapi==0.110.1"）。

这样，每次安装时，不管谁来安装（你自己、你的同事、你的服务器），大家安装的依赖版本都是一模一样的，不会因为小版本不同导致奇怪的 bug。

uv.lock 是自动生成、自动管理的。不需手动编辑。

## 其他

其他的，如 fastapi 相关的、 打 docker 镜像部署什么的相对本文主题超纲了，就不在本文中过多描述了。

## 总结

本文我们分享了用 uv 初始化和管理 Python 项目的完整流程。

从安装 uv 开始，我介绍了它为什么比传统工具（pip、pipx、poetry 等）更快更好用，以及 uv 在多 Python 版本管理、依赖锁定、项目初始化方面带来的便利。

随后，详细讲了如何用 uv 管理本地 Python 环境、新建项目、创建虚拟环境、编辑 pyproject.toml 配置，并逐步解释了各个配置项的作用

整体来看，uv 提供了一套现代、规范、高效的 Python 项目管理方案，非常适合用来打基础，后续无论是开发 API、打包 Docker 镜像，还是部署上线，都能有条不紊地进行。

同时我们通过在项目创建的过程中看到各语言（java、nodejs...）都相通或类似的工程 “最佳实践”，真是应了那句话：“大道至简，真理趋同”
