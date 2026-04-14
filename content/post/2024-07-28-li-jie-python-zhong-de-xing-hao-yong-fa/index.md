---
title: "理解 Python 中的星号用法"
slug: 2024-07-28-li-jie-python-zhong-de-xing-hao-yong-fa
description: "在 Python 编程中，星号（*）和双星号（**）操作符不仅仅用于乘法运算。"
date: 2024-07-28T01:46:59.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-28-li-jie-python-zhong-de-xing-hao-yong-fa/cover.jpg
original_url: https://mp.weixin.qq.com/s/bQ_jcOO6cT6IsL3ZZIGpHw
categories:
  - 杂谈
tags:
  - Python
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-28-li-jie-python-zhong-de-xing-hao-yong-fa/001-a39d90d7.jpg)

在 Python 编程中，星号（`*`）和双星号（`**`）操作符不仅仅用于乘法运算。它们在函数定义、函数调用、列表和字典构造等方面具有特殊的含义和功能。本文将深入探讨这些用法，帮助你更好地理解和运用这些操作符。

## 一、函数中的`*args`和`**kwargs`

### 1. `*args`在函数定义中的使用

最广为人知的星号用法是作为函数的参数，允许函数接受可变数量的参数。例如，我们有一个函数用于将两个数相加：

```python
def add(number_1, number_2):
    return number_1 + number_2

print(add(1, 2)) # 输出 3

```

如果我们想让这个函数接受任意数量的参数，可以在参数名前加一个星号：

```python
def add(*numbers):
    total = 0
    for number in numbers:
        total += number
    return total

print(add(1, 2, 3, 4)) # 输出 10

```

在这里，`numbers`是一个元组，包含了所有传入的参数。

### 2. 在函数调用中使用`*`

除了在函数定义中使用星号，我们还可以在函数调用中使用它。假设有一个函数需要三个参数：

```python
def add(number_1, number_2, number_3):
    return number_1 + number_2 + number_3

```

如果我们有一个包含三个元素的列表，可以这样调用函数：

```
my_list = [1, 2, 3]
add(*my_list) # 等同于 add(1, 2, 3)

```

### 3. `**kwargs`在函数定义中的使用

双星号（`**`）操作符用于处理关键字参数，允许我们传递任意数量的关键字参数给函数。例如：

```python
def change_user_details(username, **kwargs):
    user = get_user(username)
    for attribute, value in kwargs.items():
        setattr(user, attribute, value)

```

在这里，`kwargs`是一个字典，包含了所有传入的关键字参数。

### 4. 在函数调用中使用`**`

同样，我们可以在函数调用时使用双星号操作符传递字典参数：

```
details = {
    'email': 'example@example.com',
    'phone': '123456789'
}
change_user_details('username', **details)

```

## 二、限制函数调用方式

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-28-li-jie-python-zhong-de-xing-hao-yong-fa/002-04e7d07a.jpg)

### 1. 仅允许关键字参数

在函数定义中单独使用星号可以限制函数只能使用关键字参数：

```python
def my_function(*, keyword_arg_1):
    ...

```

调用时，如果使用位置参数，将会抛出错误：

```
my_function(1) # TypeError: my_function() takes 0 positional arguments but 1 was given

```

### 2. 仅允许位置参数

可以使用斜杠（`/`）来限制函数仅接受位置参数：

```python
def only_positional_arguments(arg1, arg2, /):
    ...

```

调用时，如果使用关键字参数，将会抛出错误：

```
only_positional_arguments(arg1=1, arg2=2) # TypeError

```

## 三、在列表和字典构造中的使用

### 1. 构造列表

星号操作符不仅可以在函数中使用，还可以用于构造列表。例如，合并两个列表并插入一个值：

```
my_list_1 = [1, 2, 3]
my_list_2 = [10, 20, 30]
some_value = 42
merged_list = [*my_list_1, some_value, *my_list_2]
# 输出 [1, 2, 3, 42, 10, 20, 30]

```

### 2. 构造字典

双星号操作符可以用于合并字典：

```
social_media_details = {'twitter': 'username'}
contact_details = {'email': 'example@example.com'}
user_dict = {'username': 'user', **social_media_details, **contact_details}
# 输出 {'username': 'user', 'twitter': 'username', 'email': 'example@example.com'}

```

## 四、列表解构

星号操作符还可以用于列表解构，允许将列表的部分元素赋值给不同的变量：

```
my_list = [1, 2, 3, 4, 5]
a, *b, c = my_list
# a -> 1
# b -> [2, 3, 4]
# c -> 5

```

在这个例子中，`a`获取列表的第一个元素，`c`获取最后一个元素，而`b`获取中间的所有元素。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-28-li-jie-python-zhong-de-xing-hao-yong-fa/003-3b15067d.jpg)

## 结语

星号和双星号操作符在 Python 中有着广泛的应用，从函数定义到列表和字典的操作。理解并掌握这些用法，将帮助你写出更灵活和简洁的代码。希望这篇文章能为你提供清晰的指导，帮助你更好地利用这些强大的工具。

如果你想了解更多关于 Python 编程的技巧和知识，欢迎订阅我的微信公众号。
