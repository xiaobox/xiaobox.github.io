---
title: "Python 内存管理探秘"
slug: 2024-07-30-python-nei-cun-guan-li-tan-mi
description: "引言在 Python 编程中，内存管理是一个关键但常常被忽略的主题。本系列文章将深入探讨 Python 内存管理的方方面面。"
date: 2024-07-30T03:51:26.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-30-python-nei-cun-guan-li-tan-mi/cover.jpg
original_url: https://mp.weixin.qq.com/s/tHURptJyC_OsVuTygRm7mg
categories:
  - 行业与思考
tags:
  - Python
---
## 引言

在 Python 编程中，内存管理是一个关键但常常被忽略的主题。本系列文章将深入探讨 Python 内存管理的方方面面。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-30-python-nei-cun-guan-li-tan-mi/001-baeb90f9.png)

## Python 的内存魔法

Python 简化了内存管理，我们无需手动分配或释放内存。那么，这些操作背后的原理是什么？我们是否需要关注它们呢？本文将解答这些问题，并探讨常见的内存管理相关问题。

## 什么是指针及其在 Python 中的位置

首先，我们需要了解命名空间的概念。命名空间是 Python 在某一时刻内所有变量、关键词和函数的集合。例如，`print()` 和 `str()` 等内置函数总是存在于每个命名空间中。

命名空间提供了在项目中避免名字冲突的一种方法。各个命名空间是独立的，没有任何关系的，所以一个命名空间中不能有重名，但不同的命名空间是可以重名而没有任何影响。

一般有三种命名空间：

-   内置名称（built-in names）， Python 语言内置的名称，比如函数名 abs、char 和异常名称 BaseException、Exception 等等。
-   全局名称（global names），模块中定义的名称，记录了模块的变量，包括函数、类、其它导入的模块、模块级的变量和常量。
-   局部名称（local names），函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量。（类中定义的也是）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-30-python-nei-cun-guan-li-tan-mi/002-fbf4f85b.png)

命名空间查找顺序: 局部的命名空间 -> 全局命名空间 -> 内置命名空间

当我们创建一个新变量时，该变量的名称会被添加到其所在的命名空间中。例如：

```
my_string = "Hello World!"

```

在这个例子中，指针是 `my_string`，而内存中的对象是字符串 `"Hello World!"`。通过在命名空间中使用指针，我们可以访问和操作内存中的对象。

### 指针别名

指针别名是指多个指针指向同一个内存对象的现象。例如：

```python
a = ["string", 42]
b = a
b[0] = "some words"
print(a)  # 输出：["some words", 42]

```

在这里，`a` 和 `b` 都指向同一个列表对象。因此，修改 `b` 的内容也会影响 `a`。

### 浅拷贝与深拷贝

如果我们希望创建一个新列表对象，并且修改该列表不会影响原列表，可以使用 `copy` 方法：

```python
c = a.copy()
c[0] = "hello!"
print(a)  # 输出：["some words", 42]

```

然而，如果列表中的元素是可变对象，例如嵌套列表，浅拷贝并不能避免指针别名问题。此时需要使用 `deepcopy` 方法：

```python
from copy import deepcopy
d = deepcopy(a)
d[0].append("new element")
print(a[0])  # 输出：["some words"]

```

`deepcopy` 方法会递归创建每个对象的副本，从而避免任何层级的指针别名问题。

-   浅拷贝：复制对象，但不复制对象中的可变成员。原对象和新对象共享可变成员的引用。
-   深拷贝：复制对象，并递归地复制对象中的所有可变成员。原对象和新对象中的可变成员不共享引用。

## 不可变对象

不可变对象（例如元组）的元素一旦创建就不能改变。

```
>>> b = ("string", 1)
>>> b[0] = "new string"
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>>

```

然而，如果元组的元素是可变对象（例如列表），我们仍然可以改变这些元素：

```python
a = ([1, 2, 3], "hello")
a[0].append(4)
print(a)  # 输出：([1, 2, 3, 4], "hello")

```

### `+=` 运算符

`+=` 运算符首先创建目标对象，然后将指针重新指向该对象。对于可变对象，这会导致就地修改，而对于不可变对象，会创建一个新对象。例如：

```python
my_list = [1, 2, 3]
my_list += [4]
print(my_list)  # 输出：[1, 2, 3, 4]

```

然而，当我们尝试在元组中使用 `+=` 时，会引发错误：

```
a = ([1, 2, 3], "hello")
a[0] += [4]  # 抛出错误

```

前面 `a[0].append(4)` 可以成功是因为修改的是列表，列表是可变的。而  `a[0] += [4]` 失败是因为修改的是元组，元组是不可变的，所以无法重新分配指针。

## 对象的标识

在编程过程中，我们常常需要确定两个对象是否是内存中同一个对象。Python 提供了两种比较方式：`is` 和 `==`。这两者虽然都可以用于比较对象，但它们的实现机制和应用场景却有所不同。

### `is` 比较运算符

`is` 用于判断两个变量是否指向内存中的同一个对象。如果两个对象引用相同的内存地址，则返回 True；否则，返回 False。

```python
a = [1, 2, 3]
b = a
print(a is b)  # 输出：True

c = [1, 2, 3]
print(a is c)  # 输出：False

```

我们可以通过 Python 的内置函数 `id` 来理解这一点。`id` 函数返回对象的唯一标识符，对于同一个对象，其标识符在其生命周期内是唯一且不变的。

例如：

```python
a = ["a", "list"]
b = a
print(id(a))  # 输出：139865338256192
print(id(b))  # 输出：139865338256192

```

在上述代码中，`a` 和 `b` 指向同一个列表对象，因此它们的 `id` 值相同。

再来看一个例子：

```python
c = a.copy()
print(id(a))  # 输出：139865338256192
print(id(c))  # 输出：不同的值

```

在这里，`a.copy()` 创建了一个新的列表对象，因此 `a` 和 `c` 的 `id` 值不同。

### `==` 比较运算符

与 `is` 不同，`==` 用于判断两个对象的值是否相等。这意味着，即使两个对象在内存中是不同的实例，只要它们的内容相同，`==` 比较也会返回 `True`。

例如：

```python
a = ["my", "list"]
b = a
c = a.copy()

print(a == b)  # 输出：True
print(a is b)  # 输出：True

print(a == c)  # 输出：True
print(a is c)  # 输出：False

```

从上面的例子中可以看出，虽然 `a` 和 `c` 是不同的对象（即 `a is c` 为 `False`），但它们的内容相同，因此 `a == c` 为 `True`。

## `__eq__`和 `==`方法

在 Python 中，`==` 运算符的行为由对象的 `__eq__` 方法决定。我们可以通过覆盖 `__eq__` 方法来定制对象的等价性判断。

例如：

```python
class MyClass:
    def __eq__(self, other):
        return self is other

a = MyClass()
b = MyClass()

print(a == b)  # 输出：False
print(a == a)  # 输出：True

```

在这个例子中，我们自定义了 `__eq__` 方法，使其使用 `is` 运算符来比较对象。

### 自定义等价性

通过自定义 `__eq__` 方法，我们可以创建更复杂的等价性判断逻辑。例如，我们可以创建一个始终返回 `True` 的类：

```python
class MyAlwaysTrueClass:
    def __eq__(self, other):
        return True

a = MyAlwaysTrueClass()
b = MyAlwaysTrueClass()

print(a == b)  # 输出：True
print(a == "some string")  # 输出：True

```

这种方法虽然灵活，但也可能导致意外的行为，例如：

```python
class MyAlwaysFalseClass:
    def __eq__(self, other):
        return False

a = MyAlwaysFalseClass()
print(a == a)  # 输出：False

```

在这个例子中，即使比较对象是同一个实例，`==` 运算符也会返回 `False`。

如果你对本系列感兴趣，请继续关注后续的内容！

## 对象的生命周期

每个对象都有其生命周期，从创建到最终被删除。了解对象的生命周期有助于优化内存使用，避免内存泄漏等问题。在 Python 中，对象的生命周期主要由两个机制决定：引用计数和垃圾回收。

### 引用计数

Python 使用引用计数来跟踪对象的使用情况。当一个对象被创建时，其引用计数被设置为 1。每当一个新的引用指向该对象时，引用计数加 1；当一个引用被删除或改为指向其他对象时，引用计数减 1。当引用计数降为 0 时，该对象的内存将被释放。

例如：

```
a = []
b = a
del a  # 引用计数减 1
del b  # 引用计数减 1，引用计数为 0，对象被删除

```

引用计数简单高效，但无法处理循环引用问题。为了解决这一问题，Python 引入了垃圾回收机制。

### 循环引用

循环引用是指多个对象相互引用，导致它们的引用计数无法降为 0，进而无法被释放。例如：

```
a = []
b = [a]
a.append(b)

```

在上述代码中，`a` 和 `b` 形成了循环引用，即使删除所有外部引用，这两个对象的引用计数仍然不为 0。

## 垃圾回收

为了解决循环引用问题，Python 引入了垃圾回收机制。垃圾回收器会定期检查对象图，找出并清除不可达的循环引用对象。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-30-python-nei-cun-guan-li-tan-mi/003-c52445ad.png)

### 垃圾回收的工作原理

垃圾回收器会维护一个对象图，并通过以下步骤清理内存：

1.  **标记阶段**：标记所有可达对象。
2.  **清除阶段**：清除所有未标记的对象。

通过这种方式，垃圾回收器能够有效地处理循环引用，释放被占用的内存。

### 调用垃圾回收器

垃圾回收器通常会自动运行，但我们也可以手动调用 `gc` 模块来触发垃圾回收。例如：

```
import gc
gc.collect()

```

### 处理复杂的对象关系

在复杂的对象关系中，垃圾回收器的作用尤为重要。以下是一个示例，展示了如何使用 `gc` 模块来检测和处理循环引用：

```python
import gc

class MyClass:
    def __init__(self, name):
        self.name = name
        print(f"Created {self.name}")

    def __del__(self):
        print(f"Deleted {self.name}")

a = MyClass("Object A")
b = MyClass("Object B")
a.b = b
b.a = a

del a
del b

gc.collect()

```

在这个示例中，`a` 和 `b` 形成了循环引用，无法通过引用计数自动删除。调用 `gc.collect()` 后，垃圾回收器会检测到循环引用并清除对象。

## `__del__`方法

Python 提供了 `__del__` 方法（也称为析构函数）来定义对象被删除前的清理操作。`__del__` 方法在对象被垃圾回收器回收前调用，用于执行必要的清理操作，如关闭文件、释放资源等。

例如：

```python
class MyClass:
    def __init__(self, name):
        self.name = name

    def __del__(self):
        print(f"Deleting {self.name}")

a = MyClass("Object A")
del a  # 输出：Deleting Object A

```

需要注意的是，`__del__` 方法在处理循环引用时可能不会被调用。因此，推荐使用上下文管理器（`with` 语句）来管理资源，以确保资源被正确释放。

## 结论

本文介绍了 Python 中指针的基本概念及其在内存管理中的应用。探讨了 Python 中的对象生命周期及垃圾回收机制。理解这些概念对于编写高效且内存友好的代码至关重要。在实际开发中，我们应当结合引用计数和垃圾回收机制，合理管理对象的生命周期，避免内存泄漏和性能问题。

通过掌握这些知识，开发者可以更好地优化 Python 程序的内存使用，提高代码的稳定性和效率。希望本系列文章对大家有所帮助，感谢阅读！

* * *
