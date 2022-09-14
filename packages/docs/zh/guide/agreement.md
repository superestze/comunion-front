---
title: 开发约定
sidebar: true
---

## 设计元素复用

UI 设计师通常会提供一套全站统一的标准设计元素，例如字体集、色号集、文字样式集等，这些元素会反复在 UI 设计中出现，利用 WindiCSS， 前端项目只需对应的设置一套全局变量，就可以便捷且高复用率的还原设计。

目前项目内定义有如下标准设计元素：

### 全局字体

配置文件: `packages\components\src\UTypography\font.css`

提供全局 class:

- `font-primary`: 突出字体
- `font-opensans`: 默认字体

使用示例：

```html
<div class="font-primary">使用突出字体</div>
```

### 全局色值

配置文件: `packages\components\src\UStyleProvider\StyleProvider.tsx`

提供全局自定义 color:

- `primary`: 主题色、突出、少数
- `color1`: 重要信息、多数
- `color2`: 次级信息、少数
- `color3`: 弱级信息、提示语、少数
- `color-line`: 线
- `color-border`: 边框颜色
- `color-hover`:   悬停

使用示例：

```html
<div class="border border-color-border text-primary hover:bg-color-hover">
  主题色文字，标准边框线颜色，悬停背景色
</div>
```

### 文字样式

配置文件: `packages\components\windi.config.ts`

提供全局 class:

- `u-h1`: 极少数标题
- `u-h2`: 少数标题
- `u-h3`: 多数标题
- `u-h4`: 最多标题
- `u-h5`: 最多文本
- `u-h6`: 最多文本
- `u-h7`: 副文本
- `u-num1`: 内容数字
- `u-num2`: 内容数字

使用示例：

```html
<div class="text-color1 u-h1">color1 颜色的 h1 标题</div>
```

## 前端开发约定

为了尽可能统一开发风格，提高代码复用率，我们做如下开发约定：

- 设计中只要使用了标准设计元素，前端必须使用对应的全局 class 或色值变量还原设计。(Figma 中点击文字，右侧边栏"Inspect"标签 -> Typography -> Ag 字段就是所复用设文字样式集，如果没有 Ag 字段就是没有复用，可以自行实现)
- 数字类型的 CSS 属性值定义，一律使用 WindiCss 的[自动值推导](https://cn.windicss.org/features/value-auto-infer.html)特性，例如`p-[16px]`要改写成`p-4`
- 用 [inflected](https://github.com/martinandert/inflected) 库处理单词的单复数
