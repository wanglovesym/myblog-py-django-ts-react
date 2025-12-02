# Tailwind CSS 基础用法指南

> 本指南旨在记录 Tailwind CSS 核心工具类的参数与用法。

---

## 目录

- [什么是 Tailwind CSS](#什么是-tailwind-css)
- [核心概念](#核心概念)
- [布局工具类](#布局工具类)
- [间距工具类](#间距工具类)
- [尺寸工具类](#尺寸工具类)
- [排版工具类](#排版工具类)
- [颜色工具类](#颜色工具类)
- [边框与圆角](#边框与圆角)
- [背景工具类](#背景工具类)
- [阴影与模糊](#阴影与模糊)
- [过渡与动画](#过渡与动画)
- [变换工具类](#变换工具类)
- [滤镜工具类](#滤镜工具类)
- [表格工具类](#表格工具类)
- [列表工具类](#列表工具类)
- [响应式设计](#响应式设计)
- [暗色模式](#暗色模式)
- [伪类与状态](#伪类与状态)
- [常见问题](#常见问题)

---

## 什么是 Tailwind CSS

Tailwind CSS 是一个"实用优先（Utility-First）"的 CSS 框架。它提供大量原子化的工具类（如 `flex`、`pt-4`、`text-center`），让你可以直接在 HTML/JSX 中组合样式，而无需编写独立的 CSS 文件。

### 优势

- **快速开发**：直接在标签上写类名，所见即所得
- **按需生成**：只打包用到的类，CSS 体积极小
- **设计一致性**：预设的间距、颜色、字号系统保证视觉统一
- **响应式与暗色**：内置断点和暗色模式支持

---

## 核心概念

### 1. 实用类（Utility Classes）

每个类名对应一个或几个 CSS 属性：

```html
<!-- 传统 CSS -->
<div class="container">...</div>
<style>
  .container {
    display: flex;
    padding: 1rem;
    background-color: white;
  }
</style>

<!-- Tailwind 方式 -->
<div class="flex p-4 bg-white">...</div>
```

### 2. 设计系统

Tailwind 内置标准化的设计令牌（Design Tokens）：

- **间距**：`p-4` = `padding: 1rem`（4 * 0.25rem）
- **颜色**：`bg-blue-500`、`text-gray-700`
- **字号**：`text-sm`、`text-lg`、`text-2xl`

### 3. 命名规范

格式：`{属性}{方向/状态}-{值}`

示例：
- `pt-4`：padding-top: 1rem
- `bg-blue-500`：background-color: blue-500
- `hover:bg-red-600`：悬浮时背景变红

---

## 布局工具类

### Display 显示类型

| 类名 | CSS 等价 | 说明 |
|------|----------|------|
| `block` | `display: block` | 块级元素 |
| `inline-block` | `display: inline-block` | 行内块 |
| `inline` | `display: inline` | 行内元素 |
| `flex` | `display: flex` | 弹性盒布局 |
| `inline-flex` | `display: inline-flex` | 行内弹性盒 |
| `grid` | `display: grid` | 网格布局 |
| `inline-grid` | `display: inline-grid` | 行内网格 |
| `table` | `display: table` | 表格 |
| `hidden` | `display: none` | 隐藏元素 |

### Flexbox 弹性盒

**主轴方向**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `flex-row` | `flex-direction: row` | 横向（默认） |
| `flex-row-reverse` | `flex-direction: row-reverse` | 横向反转 |
| `flex-col` | `flex-direction: column` | 纵向 |
| `flex-col-reverse` | `flex-direction: column-reverse` | 纵向反转 |

**主轴对齐**（justify-content）：
| 类名 | CSS | 说明 |
|------|-----|------|
| `justify-start` | `justify-content: flex-start` | 起点对齐 |
| `justify-end` | `justify-content: flex-end` | 终点对齐 |
| `justify-center` | `justify-content: center` | 居中 |
| `justify-between` | `justify-content: space-between` | 两端对齐 |
| `justify-around` | `justify-content: space-around` | 环绕分布 |
| `justify-evenly` | `justify-content: space-evenly` | 均匀分布 |

**交叉轴对齐**（align-items）：

| 类名 | CSS | 说明 |
|------|-----|------|
| `items-start` | `align-items: flex-start` | 起点对齐 |
| `items-end` | `align-items: flex-end` | 终点对齐 |
| `items-center` | `align-items: center` | 居中 |
| `items-baseline` | `align-items: baseline` | 基线对齐 |
| `items-stretch` | `align-items: stretch` | 拉伸（默认） |

**换行**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `flex-wrap` | `flex-wrap: wrap` | 允许换行 |
| `flex-wrap-reverse` | `flex-wrap: wrap-reverse` | 反向换行 |
| `flex-nowrap` | `flex-wrap: nowrap` | 不换行（默认） |

**间距**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `gap-0` | `gap: 0` | 无间距 |
| `gap-1` | `gap: 0.25rem` | 4px |
| `gap-2` | `gap: 0.5rem` | 8px |
| `gap-4` | `gap: 1rem` | 16px |
| `gap-8` | `gap: 2rem` | 32px |
| `gap-x-{n}` | `column-gap` | 仅列间距 |
| `gap-y-{n}` | `row-gap` | 仅行间距 |

**Flex 子项**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `flex-1` | `flex: 1 1 0%` | 平均分配空间 |
| `flex-auto` | `flex: 1 1 auto` | 基于内容分配 |
| `flex-initial` | `flex: 0 1 auto` | 默认值 |
| `flex-none` | `flex: none` | 不伸缩 |
| `grow` | `flex-grow: 1` | 允许增长 |
| `shrink` | `flex-shrink: 1` | 允许收缩 |

### Grid 网格布局

**列数**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `grid-cols-1` | `grid-template-columns: repeat(1, minmax(0, 1fr))` | 1列 |
| `grid-cols-2` | `grid-template-columns: repeat(2, minmax(0, 1fr))` | 2列 |
| `grid-cols-3` | ... | 3列 |
| `grid-cols-12` | ... | 12列 |

**行数**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `grid-rows-1` | `grid-template-rows: repeat(1, minmax(0, 1fr))` | 1行 |
| `grid-rows-6` | ... | 6行 |

**跨列/跨行**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `col-span-1` | `grid-column: span 1 / span 1` | 占1列 |
| `col-span-2` | `grid-column: span 2 / span 2` | 占2列 |
| `row-span-2` | `grid-row: span 2 / span 2` | 占2行 |

**对齐**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `place-items-start` | `place-items: start` | 左上对齐 |
| `place-items-center` | `place-items: center` | 居中 |
| `place-items-end` | `place-items: end` | 右下对齐 |

### Position 定位

| 类名 | CSS | 说明 |
|------|-----|------|
| `static` | `position: static` | 默认定位 |
| `fixed` | `position: fixed` | 固定定位 |
| `absolute` | `position: absolute` | 绝对定位 |
| `relative` | `position: relative` | 相对定位 |
| `sticky` | `position: sticky` | 粘性定位 |

**方位**：
| 类名 | CSS | 说明 |
|------|-----|------|
| `top-0` | `top: 0` | 距顶部0 |
| `right-4` | `right: 1rem` | 距右侧1rem |
| `bottom-auto` | `bottom: auto` | 底部自动 |
| `left-1/2` | `left: 50%` | 距左侧50% |
| `inset-0` | `top/right/bottom/left: 0` | 四周均为0 |

### Z-index 层级

| 类名 | CSS | 说明 |
|------|-----|------|
| `z-0` | `z-index: 0` | 层级0 |
| `z-10` | `z-index: 10` | 层级10 |
| `z-50` | `z-index: 50` | 层级50 |
| `z-auto` | `z-index: auto` | 自动 |

### Overflow 溢出

| 类名 | CSS | 说明 |
|------|-----|------|
| `overflow-auto` | `overflow: auto` | 自动滚动 |
| `overflow-hidden` | `overflow: hidden` | 隐藏溢出 |
| `overflow-visible` | `overflow: visible` | 可见（默认） |
| `overflow-scroll` | `overflow: scroll` | 总是显示滚动条 |
| `overflow-x-auto` | `overflow-x: auto` | 仅横向滚动 |
| `overflow-y-auto` | `overflow-y: auto` | 仅纵向滚动 |

---

## 间距工具类

### Padding 内边距

**格式**：`p{方向}-{大小}`

**方向**：
- 无：四个方向
- `t`：top（上）
- `r`：right（右）
- `b`：bottom（下）
- `l`：left（左）
- `x`：左右
- `y`：上下

**大小映射**：
| 类名 | 值 | 像素 |
|------|-----|------|
| `p-0` | 0 | 0px |
| `p-px` | 1px | 1px |
| `p-0.5` | 0.125rem | 2px |
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-3` | 0.75rem | 12px |
| `p-4` | 1rem | 16px |
| `p-5` | 1.25rem | 20px |
| `p-6` | 1.5rem | 24px |
| `p-8` | 2rem | 32px |
| `p-10` | 2.5rem | 40px |
| `p-12` | 3rem | 48px |
| `p-16` | 4rem | 64px |
| `p-20` | 5rem | 80px |
| `p-24` | 6rem | 96px |

**示例**：
```html
<div class="p-4">四周 padding: 1rem</div>
<div class="px-6 py-3">左右 1.5rem，上下 0.75rem</div>
<div class="pt-8">仅上方 padding: 2rem</div>
```

### Margin 外边距

**格式**：`m{方向}-{大小}`（与 padding 相同规则）

**额外值**：
| 类名 | 值 | 说明 |
|------|-----|------|
| `m-auto` | `margin: auto` | 自动居中 |
| `mx-auto` | `margin-left/right: auto` | 水平居中 |
| `-m-4` | `margin: -1rem` | 负边距 |

**示例**：
```html
<div class="mx-auto max-w-3xl">水平居中容器</div>
<div class="mt-8 mb-4">上边距 2rem，下边距 1rem</div>
<div class="-mt-2">负上边距，向上偏移</div>
```

### Space Between 子元素间距

| 类名 | CSS | 说明 |
|------|-----|------|
| `space-x-4` | `> * + * { margin-left: 1rem }` | 子元素横向间距 |
| `space-y-2` | `> * + * { margin-top: 0.5rem }` | 子元素纵向间距 |

---

## 尺寸工具类

### Width 宽度

**固定值**：
| 类名 | 值 | 像素 |
|------|-----|------|
| `w-0` | 0 | 0 |
| `w-px` | 1px | 1px |
| `w-1` | 0.25rem | 4px |
| `w-64` | 16rem | 256px |
| `w-96` | 24rem | 384px |

**百分比**：
| 类名 | 值 |
|------|-----|
| `w-1/2` | 50% |
| `w-1/3` | 33.333% |
| `w-2/3` | 66.667% |
| `w-1/4` | 25% |
| `w-3/4` | 75% |
| `w-full` | 100% |

**视口/屏幕**：
| 类名 | 值 |
|------|-----|
| `w-screen` | 100vw |
| `w-auto` | auto |
| `w-min` | min-content |
| `w-max` | max-content |
| `w-fit` | fit-content |

### Height 高度

（规则同 width，前缀改为 `h-`）

**特殊值**：
| 类名 | 值 |
|------|-----|
| `h-screen` | 100vh |
| `h-full` | 100% |

### Min/Max 尺寸

| 类名 | CSS | 说明 |
|------|-----|------|
| `min-w-0` | `min-width: 0` | 最小宽度0 |
| `min-w-full` | `min-width: 100%` | 最小宽度100% |
| `max-w-xs` | `max-width: 20rem` | 最大宽度xs |
| `max-w-sm` | `max-width: 24rem` | 最大宽度sm |
| `max-w-md` | `max-width: 28rem` | 最大宽度md |
| `max-w-lg` | `max-width: 32rem` | 最大宽度lg |
| `max-w-xl` | `max-width: 36rem` | 最大宽度xl |
| `max-w-2xl` | `max-width: 42rem` | 最大宽度2xl |
| `max-w-3xl` | `max-width: 48rem` | 最大宽度3xl |
| `max-w-7xl` | `max-width: 80rem` | 最大宽度7xl |
| `max-w-full` | `max-width: 100%` | 最大宽度100% |
| `max-w-screen-sm` | `max-width: 640px` | 最大宽度断点sm |
| `min-h-screen` | `min-height: 100vh` | 最小高度视口 |
| `max-h-screen` | `max-height: 100vh` | 最大高度视口 |

---

## 排版工具类

### Font Size 字号

| 类名 | font-size | line-height |
|------|-----------|-------------|
| `text-xs` | 0.75rem (12px) | 1rem |
| `text-sm` | 0.875rem (14px) | 1.25rem |
| `text-base` | 1rem (16px) | 1.5rem |
| `text-lg` | 1.125rem (18px) | 1.75rem |
| `text-xl` | 1.25rem (20px) | 1.75rem |
| `text-2xl` | 1.5rem (24px) | 2rem |
| `text-3xl` | 1.875rem (30px) | 2.25rem |
| `text-4xl` | 2.25rem (36px) | 2.5rem |
| `text-5xl` | 3rem (48px) | 1 |
| `text-6xl` | 3.75rem (60px) | 1 |
| `text-7xl` | 4.5rem (72px) | 1 |
| `text-8xl` | 6rem (96px) | 1 |
| `text-9xl` | 8rem (128px) | 1 |

### Font Weight 字重

| 类名 | CSS | 说明 |
|------|-----|------|
| `font-thin` | `font-weight: 100` | 极细 |
| `font-extralight` | `font-weight: 200` | 超细 |
| `font-light` | `font-weight: 300` | 细体 |
| `font-normal` | `font-weight: 400` | 正常 |
| `font-medium` | `font-weight: 500` | 中等 |
| `font-semibold` | `font-weight: 600` | 半粗 |
| `font-bold` | `font-weight: 700` | 粗体 |
| `font-extrabold` | `font-weight: 800` | 超粗 |
| `font-black` | `font-weight: 900` | 最粗 |

### Text Align 文本对齐

| 类名 | CSS |
|------|-----|
| `text-left` | `text-align: left` |
| `text-center` | `text-align: center` |
| `text-right` | `text-align: right` |
| `text-justify` | `text-align: justify` |

### Text Color 文字颜色

格式：`text-{颜色}-{深度}`

示例：`text-blue-500`、`text-gray-700`

（颜色详见下方"颜色工具类"章节）

### Text Decoration 文本装饰

| 类名 | CSS |
|------|-----|
| `underline` | `text-decoration: underline` |
| `overline` | `text-decoration: overline` |
| `line-through` | `text-decoration: line-through` |
| `no-underline` | `text-decoration: none` |

### Text Transform 文本转换

| 类名 | CSS | 说明 |
|------|-----|------|
| `uppercase` | `text-transform: uppercase` | 全大写 |
| `lowercase` | `text-transform: lowercase` | 全小写 |
| `capitalize` | `text-transform: capitalize` | 首字母大写 |
| `normal-case` | `text-transform: none` | 正常 |

### Line Height 行高

| 类名 | CSS |
|------|-----|
| `leading-none` | `line-height: 1` |
| `leading-tight` | `line-height: 1.25` |
| `leading-snug` | `line-height: 1.375` |
| `leading-normal` | `line-height: 1.5` |
| `leading-relaxed` | `line-height: 1.625` |
| `leading-loose` | `line-height: 2` |
| `leading-3` | `line-height: .75rem` |
| `leading-10` | `line-height: 2.5rem` |

### Letter Spacing 字间距

| 类名 | CSS |
|------|-----|
| `tracking-tighter` | `letter-spacing: -0.05em` |
| `tracking-tight` | `letter-spacing: -0.025em` |
| `tracking-normal` | `letter-spacing: 0` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `tracking-wider` | `letter-spacing: 0.05em` |
| `tracking-widest` | `letter-spacing: 0.1em` |

### Text Overflow 文本溢出

| 类名 | CSS |
|------|-----|
| `truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `text-ellipsis` | `text-overflow: ellipsis` |
| `text-clip` | `text-overflow: clip` |

### Vertical Align 垂直对齐

| 类名 | CSS |
|------|-----|
| `align-baseline` | `vertical-align: baseline` |
| `align-top` | `vertical-align: top` |
| `align-middle` | `vertical-align: middle` |
| `align-bottom` | `vertical-align: bottom` |
| `align-text-top` | `vertical-align: text-top` |
| `align-text-bottom` | `vertical-align: text-bottom` |

### Whitespace 空白处理

| 类名 | CSS |
|------|-----|
| `whitespace-normal` | `white-space: normal` |
| `whitespace-nowrap` | `white-space: nowrap` |
| `whitespace-pre` | `white-space: pre` |
| `whitespace-pre-line` | `white-space: pre-line` |
| `whitespace-pre-wrap` | `white-space: pre-wrap` |

---

## 颜色工具类

### 颜色系统

Tailwind 提供以下颜色，每种颜色有 10 个深度（50-900）：

**颜色名称**：`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

**深度**：
- `50`：最浅
- `100`, `200`, `300`, `400`：浅色
- `500`：标准色
- `600`, `700`, `800`, `900`：深色
- `950`：最深（部分颜色）

### 文字颜色

格式：`text-{颜色}-{深度}`

```html
<p class="text-blue-500">蓝色文字</p>
<p class="text-gray-700">深灰文字</p>
<p class="text-red-600">红色文字</p>
```

### 背景颜色

格式：`bg-{颜色}-{深度}`

```html
<div class="bg-white">白色背景</div>
<div class="bg-slate-100">浅灰背景</div>
<div class="bg-blue-500">蓝色背景</div>
```

### 边框颜色

格式：`border-{颜色}-{深度}`

```html
<div class="border border-gray-300">灰色边框</div>
<div class="border-2 border-blue-500">蓝色边框</div>
```

### 其他颜色属性

| 前缀 | 作用 |
|------|------|
| `text-` | 文字颜色 |
| `bg-` | 背景色 |
| `border-` | 边框色 |
| `ring-` | 轮廓色 |
| `divide-` | 分割线颜色 |
| `placeholder-` | 占位符颜色 |
| `accent-` | 强调色 |
| `caret-` | 光标颜色 |

### 特殊颜色

| 类名 | 值 |
|------|-----|
| `bg-transparent` | transparent |
| `bg-current` | currentColor |
| `bg-white` | #ffffff |
| `bg-black` | #000000 |
| `bg-inherit` | inherit |

---

## 边框与圆角

### Border Width 边框宽度

| 类名 | CSS | 说明 |
|------|-----|------|
| `border` | `border-width: 1px` | 1px边框 |
| `border-0` | `border-width: 0` | 无边框 |
| `border-2` | `border-width: 2px` | 2px |
| `border-4` | `border-width: 4px` | 4px |
| `border-8` | `border-width: 8px` | 8px |
| `border-t` | `border-top-width: 1px` | 上边框 |
| `border-r-2` | `border-right-width: 2px` | 右边框2px |
| `border-b` | `border-bottom-width: 1px` | 下边框 |
| `border-l` | `border-left-width: 1px` | 左边框 |
| `border-x` | 左右边框 | 1px |
| `border-y` | 上下边框 | 1px |

### Border Style 边框样式

| 类名 | CSS |
|------|-----|
| `border-solid` | `border-style: solid` |
| `border-dashed` | `border-style: dashed` |
| `border-dotted` | `border-style: dotted` |
| `border-double` | `border-style: double` |
| `border-none` | `border-style: none` |

### Border Radius 圆角

| 类名 | CSS | 说明 |
|------|-----|------|
| `rounded-none` | `border-radius: 0` | 无圆角 |
| `rounded-sm` | `border-radius: 0.125rem` | 2px |
| `rounded` | `border-radius: 0.25rem` | 4px |
| `rounded-md` | `border-radius: 0.375rem` | 6px |
| `rounded-lg` | `border-radius: 0.5rem` | 8px |
| `rounded-xl` | `border-radius: 0.75rem` | 12px |
| `rounded-2xl` | `border-radius: 1rem` | 16px |
| `rounded-3xl` | `border-radius: 1.5rem` | 24px |
| `rounded-full` | `border-radius: 9999px` | 完全圆形 |
| `rounded-t-lg` | 上方圆角 | 8px |
| `rounded-r-md` | 右侧圆角 | 6px |
| `rounded-tl-sm` | 左上角圆角 | 2px |

### Outline 轮廓

| 类名 | CSS | 说明 |
|------|-----|------|
| `outline-none` | `outline: 0` | 无轮廓 |
| `outline` | `outline-style: solid` | 实线轮廓 |
| `outline-dashed` | `outline-style: dashed` | 虚线 |
| `outline-0` | `outline-width: 0` | 宽度0 |
| `outline-2` | `outline-width: 2px` | 宽度2px |
| `outline-blue-500` | 轮廓颜色 | 蓝色 |

### Ring 环形轮廓

| 类名 | CSS | 说明 |
|------|-----|------|
| `ring` | `box-shadow: 0 0 0 3px ...` | 环形效果 |
| `ring-0` | 无环形 | - |
| `ring-2` | 2px环形 | - |
| `ring-blue-500` | 环形颜色 | 蓝色 |
| `ring-offset-2` | 环形偏移 | 2px |

---

## 背景工具类

### Background Size 背景尺寸

| 类名 | CSS |
|------|-----|
| `bg-auto` | `background-size: auto` |
| `bg-cover` | `background-size: cover` |
| `bg-contain` | `background-size: contain` |

### Background Position 背景位置

| 类名 | CSS |
|------|-----|
| `bg-center` | `background-position: center` |
| `bg-top` | `background-position: top` |
| `bg-bottom` | `background-position: bottom` |
| `bg-left` | `background-position: left` |
| `bg-right` | `background-position: right` |

### Background Repeat 背景重复

| 类名 | CSS |
|------|-----|
| `bg-repeat` | `background-repeat: repeat` |
| `bg-no-repeat` | `background-repeat: no-repeat` |
| `bg-repeat-x` | `background-repeat: repeat-x` |
| `bg-repeat-y` | `background-repeat: repeat-y` |

### Gradient 渐变

```html
<!-- 线性渐变 -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  从左到右蓝紫渐变
</div>

<!-- 渐变方向 -->
<div class="bg-gradient-to-t">从下到上</div>
<div class="bg-gradient-to-br">从左上到右下</div>
```

**方向类**：
- `bg-gradient-to-t`：to top
- `bg-gradient-to-b`：to bottom
- `bg-gradient-to-l`：to left
- `bg-gradient-to-r`：to right
- `bg-gradient-to-tl`/`tr`/`bl`/`br`：对角

**颜色控制**：
- `from-{color}`：起始色
- `via-{color}`：中间色
- `to-{color}`：结束色

---

## 阴影与模糊

### Box Shadow 阴影

| 类名 | CSS | 说明 |
|------|-----|------|
| `shadow-sm` | `box-shadow: 0 1px 2px 0 ...` | 小阴影 |
| `shadow` | 默认阴影 | 中等 |
| `shadow-md` | 中等阴影 | - |
| `shadow-lg` | 大阴影 | - |
| `shadow-xl` | 超大阴影 | - |
| `shadow-2xl` | 巨大阴影 | - |
| `shadow-inner` | 内阴影 | - |
| `shadow-none` | 无阴影 | - |

### Drop Shadow 投影

| 类名 | CSS | 说明 |
|------|-----|------|
| `drop-shadow-sm` | `filter: drop-shadow(...)` | 小投影 |
| `drop-shadow-lg` | 大投影 | - |
| `drop-shadow-none` | 无投影 | - |

### Blur 模糊

| 类名 | CSS | 说明 |
|------|-----|------|
| `blur-none` | `filter: blur(0)` | 无模糊 |
| `blur-sm` | `filter: blur(4px)` | 小模糊 |
| `blur` | `filter: blur(8px)` | 默认 |
| `blur-lg` | `filter: blur(16px)` | 大模糊 |
| `blur-2xl` | `filter: blur(40px)` | 超大 |

### Backdrop Blur 背景模糊

| 类名 | CSS | 说明 |
|------|-----|------|
| `backdrop-blur-sm` | `backdrop-filter: blur(4px)` | 毛玻璃效果 |
| `backdrop-blur-lg` | 大背景模糊 | - |

---

## 过渡与动画

### Transition 过渡

| 类名 | CSS | 说明 |
|------|-----|------|
| `transition-none` | `transition: none` | 无过渡 |
| `transition-all` | `transition: all` | 所有属性 |
| `transition` | 默认过渡 | 常用属性 |
| `transition-colors` | 颜色过渡 | - |
| `transition-opacity` | 透明度 | - |
| `transition-shadow` | 阴影 | - |
| `transition-transform` | 变换 | - |

### Duration 时长

| 类名 | CSS |
|------|-----|
| `duration-75` | `transition-duration: 75ms` |
| `duration-100` | 100ms |
| `duration-150` | 150ms |
| `duration-200` | 200ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `duration-700` | 700ms |
| `duration-1000` | 1000ms |

### Delay 延迟

| 类名 | CSS |
|------|-----|
| `delay-75` | `transition-delay: 75ms` |
| `delay-150` | 150ms |
| `delay-300` | 300ms |

### Ease 缓动

| 类名 | CSS |
|------|-----|
| `ease-linear` | `transition-timing-function: linear` |
| `ease-in` | `transition-timing-function: cubic-bezier(0.4, 0, 1, 1)` |
| `ease-out` | `transition-timing-function: cubic-bezier(0, 0, 0.2, 1)` |
| `ease-in-out` | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)` |

### Animation 动画

| 类名 | CSS | 说明 |
|------|-----|------|
| `animate-none` | 无动画 | - |
| `animate-spin` | 旋转 | loading图标 |
| `animate-ping` | 缩放脉冲 | 提示点 |
| `animate-pulse` | 脉冲 | 骨架屏 |
| `animate-bounce` | 弹跳 | - |

---

## 变换工具类

### Scale 缩放

| 类名 | CSS | 说明 |
|------|-----|------|
| `scale-0` | `transform: scale(0)` | 缩小至0 |
| `scale-50` | `transform: scale(.5)` | 50% |
| `scale-75` | 75% | - |
| `scale-90` | 90% | - |
| `scale-95` | 95% | - |
| `scale-100` | 100%（原始） | - |
| `scale-105` | 105% | - |
| `scale-110` | 110% | - |
| `scale-125` | 125% | - |
| `scale-150` | 150% | - |
| `scale-x-75` | 仅横向缩放 | 75% |
| `scale-y-110` | 仅纵向缩放 | 110% |

### Rotate 旋转

| 类名 | CSS | 说明 |
|------|-----|------|
| `rotate-0` | `transform: rotate(0deg)` | 无旋转 |
| `rotate-45` | 45度 | - |
| `rotate-90` | 90度 | - |
| `rotate-180` | 180度 | - |
| `-rotate-45` | -45度（逆时针） | - |

### Translate 位移

| 类名 | CSS | 说明 |
|------|-----|------|
| `translate-x-0` | `transform: translateX(0)` | 无位移 |
| `translate-x-4` | 右移1rem | - |
| `-translate-x-4` | 左移1rem | - |
| `translate-y-1/2` | 下移50% | - |
| `-translate-y-full` | 上移100% | - |

### Skew 倾斜

| 类名 | CSS | 说明 |
|------|-----|------|
| `skew-x-3` | `transform: skewX(3deg)` | 横向倾斜 |
| `skew-y-6` | 纵向倾斜 | - |

### Transform Origin 变换原点

| 类名 | CSS |
|------|-----|
| `origin-center` | `transform-origin: center` |
| `origin-top` | `transform-origin: top` |
| `origin-top-right` | `transform-origin: top right` |
| `origin-left` | `transform-origin: left` |

---

## 滤镜工具类

### Brightness 亮度

| 类名 | CSS |
|------|-----|
| `brightness-0` | `filter: brightness(0)` |
| `brightness-50` | 50% |
| `brightness-100` | 100%（原始） |
| `brightness-125` | 125% |
| `brightness-200` | 200% |

### Contrast 对比度

| 类名 | CSS |
|------|-----|
| `contrast-0` | `filter: contrast(0)` |
| `contrast-100` | 100%（原始） |
| `contrast-125` | 125% |

### Grayscale 灰度

| 类名 | CSS |
|------|-----|
| `grayscale-0` | `filter: grayscale(0)` |
| `grayscale` | 100%灰度 |

### Hue Rotate 色相旋转

| 类名 | CSS |
|------|-----|
| `hue-rotate-0` | `filter: hue-rotate(0deg)` |
| `hue-rotate-90` | 90度 |
| `hue-rotate-180` | 180度 |

### Invert 反色

| 类名 | CSS |
|------|-----|
| `invert-0` | `filter: invert(0)` |
| `invert` | 100%反色 |

### Saturate 饱和度

| 类名 | CSS |
|------|-----|
| `saturate-0` | `filter: saturate(0)` |
| `saturate-100` | 100%（原始） |
| `saturate-150` | 150% |

### Sepia 褐色滤镜

| 类名 | CSS |
|------|-----|
| `sepia-0` | `filter: sepia(0)` |
| `sepia` | 100%褐色 |

---

## 表格工具类

| 类名 | CSS | 说明 |
|------|-----|------|
| `border-collapse` | `border-collapse: collapse` | 合并边框 |
| `border-separate` | `border-collapse: separate` | 分离边框 |
| `table-auto` | `table-layout: auto` | 自动布局 |
| `table-fixed` | `table-layout: fixed` | 固定布局 |

---

## 列表工具类

| 类名 | CSS | 说明 |
|------|-----|------|
| `list-none` | `list-style-type: none` | 无标记 |
| `list-disc` | `list-style-type: disc` | 实心圆 |
| `list-decimal` | `list-style-type: decimal` | 数字 |
| `list-inside` | `list-style-position: inside` | 标记在内 |
| `list-outside` | `list-style-position: outside` | 标记在外 |

---

## 响应式设计

### 断点系统

Tailwind 使用移动优先策略，默认样式先写，然后用断点前缀覆盖：

| 前缀 | 最小宽度 | CSS 媒体查询 |
|------|----------|--------------|
| 无前缀 | 0px | 默认（移动端） |
| `sm:` | 640px | `@media (min-width: 640px)` |
| `md:` | 768px | `@media (min-width: 768px)` |
| `lg:` | 1024px | `@media (min-width: 1024px)` |
| `xl:` | 1280px | `@media (min-width: 1280px)` |
| `2xl:` | 1536px | `@media (min-width: 1536px)` |

### 使用示例

```html
<!-- 移动端全宽，桌面端半宽 -->
<div class="w-full md:w-1/2">响应式容器</div>

<!-- 移动端纵向，桌面端横向 -->
<div class="flex flex-col md:flex-row gap-4">
  <div>左侧</div>
  <div>右侧</div>
</div>

<!-- 字号响应式 -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">标题</h1>

<!-- 隐藏/显示 -->
<div class="hidden md:block">桌面端可见</div>
<div class="block md:hidden">移动端可见</div>

<!-- 间距响应式 -->
<div class="p-4 lg:p-8">内边距随屏幕变化</div>
```

---

## 暗色模式

### 配置方式

在 `tailwind.config.js` 设置：

```js
module.exports = {
  darkMode: 'class', // 或 'media'
  // ...
}
```

- `'media'`：跟随系统偏好
- `'class'`：手动切换（需在 `<html>` 添加 `dark` 类）

### 使用 dark: 前缀

```html
<!-- 白天白底黑字，夜晚深底浅字 -->
<div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  自适应暗色内容
</div>

<!-- 边框颜色 -->
<div class="border border-gray-200 dark:border-gray-700">
  暗色模式边框
</div>

<!-- 悬浮效果 -->
<button class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
  按钮
</button>
```

### JavaScript 切换

```js
// 启用暗色
document.documentElement.classList.add('dark');

// 禁用暗色
document.documentElement.classList.remove('dark');

// 切换
document.documentElement.classList.toggle('dark');
```

---

## 伪类与状态

### 交互状态

| 前缀 | 伪类 | 示例 |
|------|------|------|
| `hover:` | :hover | `hover:bg-blue-600` |
| `focus:` | :focus | `focus:ring-2` |
| `active:` | :active | `active:scale-95` |
| `focus-within:` | :focus-within | `focus-within:ring` |
| `focus-visible:` | :focus-visible | `focus-visible:outline` |
| `disabled:` | :disabled | `disabled:opacity-50` |
| `enabled:` | :enabled | `enabled:cursor-pointer` |
| `checked:` | :checked | `checked:bg-blue-500` |
| `visited:` | :visited | `visited:text-purple-600` |

### 结构伪类

| 前缀 | 伪类 | 示例 |
|------|------|------|
| `first:` | :first-child | `first:mt-0` |
| `last:` | :last-child | `last:mb-0` |
| `odd:` | :nth-child(odd) | `odd:bg-gray-100` |
| `even:` | :nth-child(even) | `even:bg-white` |
| `empty:` | :empty | `empty:hidden` |

### 表单状态

| 前缀 | 伪类 | 示例 |
|------|------|------|
| `required:` | :required | `required:border-red-500` |
| `invalid:` | :invalid | `invalid:text-red-600` |
| `placeholder:` | ::placeholder | `placeholder:text-gray-400` |
| `read-only:` | :read-only | `read-only:bg-gray-100` |

### 组合使用

```html
<!-- 悬浮时放大并改变颜色 -->
<button class="bg-blue-500 hover:bg-blue-700 hover:scale-105 transition">
  悬浮我
</button>

<!-- 聚焦时显示轮廓 -->
<input class="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />

<!-- 暗色 + 悬浮 -->
<a href="#" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
  链接
</a>

<!-- 禁用状态 -->
<button disabled class="bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
  禁用按钮
</button>
```

---

## 常见问题

### Q1: 类名太长怎么办？
A: 提取为 React/Vue 组件，或在 CSS 中使用 `@apply`（适度）。对于一次性布局，长类名是正常的。

### Q2: 如何覆盖 Tailwind 样式？
A: 
1. 使用 `!important` 前缀：`!bg-red-500`
2. 提高选择器优先级
3. 在 `tailwind.config.js` 中修改默认值

### Q3: 生产环境 CSS 体积大吗？
A: 不会。Tailwind 只打包你用到的类。配置好 `content` 路径后，最终 CSS 通常只有几 KB。

### Q4: 某个样式不生效？
A: 检查：
1. 类名是否拼写正确
2. 是否被其他样式覆盖（查看浏览器开发者工具）
3. 配置文件的 `content` 路径是否包含该文件

### Q5: 如何调试某个类名？
A: 
- 浏览器开发者工具查看计算样式
- 使用 Tailwind IntelliSense 插件悬浮查看
- 查阅官方文档搜索功能

### Q6: 响应式不生效？
A: 确保：
1. 断点前缀正确（`md:`、`lg:` 等）
2. 移动优先策略：先写默认样式，再用断点覆盖
3. 浏览器窗口宽度达到断点

### Q7: 暗色模式切换后样式不生效？
A: 检查：
1. `tailwind.config.js` 设置 `darkMode: 'class'`
2. JS 中正确给 `<html>` 添加/移除 `dark` 类
3. 组件中使用了 `dark:` 前缀

---

## 总结

Tailwind CSS 基础用法的核心是：
1. **熟记常用类名**：布局（flex/grid）、间距（p/m）、尺寸（w/h）、排版（text/font）
2. **理解命名规范**：`{属性}{方向}-{值}`
3. **掌握响应式**：移动优先 + 断点前缀
4. **善用暗色模式**：`dark:` 前缀
5. **组合伪类**：`hover:`、`focus:` 等

建议：
- 安装 **Tailwind CSS IntelliSense** 插件提高效率
- 多查阅官方文档：https://tailwindcss.com/docs
- 在实际项目中积累经验

祝学习顺利！🎉
