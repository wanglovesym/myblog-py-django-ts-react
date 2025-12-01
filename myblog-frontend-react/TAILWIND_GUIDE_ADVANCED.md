# Tailwind CSS 进阶用法指南

> 本指南涵盖 Tailwind CSS 的高级特性、设计模式和实战案例，适合已掌握基础用法的开发者深入学习。

---

## 目录

-   [自定义配置扩展](#自定义配置扩展)
-   [动画进阶](#动画进阶)
-   [Grid 布局详解](#grid-布局详解)
-   [表单设计方案](#表单设计方案)
-   [插件生态系统](#插件生态系统)
-   [任意值与变体](#任意值与变体)
-   [设计模式](#设计模式)
-   [实战案例](#实战案例)
-   [最佳实践](#最佳实践)

---

## 自定义配置扩展

### 扩展主题

在 `tailwind.config.js` 中自定义颜色、间距、字体等：

```js
module.exports = {
    theme: {
        extend: {
            // 自定义颜色
            colors: {
                brand: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    500: "#3b82f6",
                    900: "#1e3a8a"
                },
                accent: "#ff6b6b"
            },

            // 自定义间距
            spacing: {
                72: "18rem",
                84: "21rem",
                96: "24rem"
            },

            // 自定义字体
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                serif: ["Merriweather", "serif"],
                mono: ["Fira Code", "monospace"]
            },

            // 自定义断点
            screens: {
                xs: "475px",
                "3xl": "1920px"
            },

            // 自定义阴影
            boxShadow: {
                brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
                glow: "0 0 20px rgba(59, 130, 246, 0.5)"
            },

            // 自定义动画
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.3s ease-out"
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" }
                }
            }
        }
    }
};
```

### 覆盖默认值

如果想完全替换（而非扩展）默认主题：

```js
module.exports = {
    theme: {
        colors: {
            // 只保留这些颜色，其他全部移除
            white: "#ffffff",
            black: "#000000",
            primary: "#3b82f6"
        }
    }
};
```

### 使用自定义值

```html
<div class="bg-brand-500 text-accent shadow-brutal">使用自定义颜色和阴影</div>

<div class="animate-fade-in">淡入动画</div>

<div class="font-sans text-lg">Inter 字体</div>
```

---

## 动画进阶

### 自定义 Keyframes

```js
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" }
                },
                "slide-in-right": {
                    "0%": { transform: "translateX(100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" }
                },
                heartbeat: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" }
                }
            },
            animation: {
                wiggle: "wiggle 1s ease-in-out infinite",
                "slide-in-right": "slide-in-right 0.5s ease-out",
                heartbeat: "heartbeat 1s ease-in-out infinite"
            }
        }
    }
};
```

```html
<div class="animate-wiggle">摇摆动画</div>
<div class="animate-slide-in-right">从右侧滑入</div>
<button class="animate-heartbeat">心跳按钮</button>
```

### 复杂动画组合

```html
<!-- 悬浮时同时缩放、旋转、改变颜色 -->
<div
    class="
  transition-all duration-300 ease-in-out
  hover:scale-110 hover:rotate-3 hover:bg-blue-500
"
>
    多重效果
</div>

<!-- 延迟动画 -->
<div class="animate-fade-in delay-100">延迟100ms</div>
<div class="animate-fade-in delay-300">延迟300ms</div>
<div class="animate-fade-in delay-500">延迟500ms</div>

<!-- 组合过渡 -->
<button
    class="
  bg-gradient-to-r from-blue-500 to-purple-600
  transform transition-all duration-500
  hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-pink-500
  active:scale-95
"
>
    渐变按钮
</button>
```

### 滚动触发动画

配合 JavaScript 使用：

```html
<div
    class="opacity-0 translate-y-10 transition-all duration-700"
    id="scroll-target"
>
    滚动到视口时显示
</div>

<script>
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-10");
            }
        });
    });

    observer.observe(document.getElementById("scroll-target"));
</script>
```

---

## Grid 布局详解

### 响应式网格

```html
<!-- 移动端1列，平板2列,桌面端3列，超大屏4列 -->
<div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
>
    <div class="bg-white p-6 rounded-lg shadow">卡片1</div>
    <div class="bg-white p-6 rounded-lg shadow">卡片2</div>
    <div class="bg-white p-6 rounded-lg shadow">卡片3</div>
    <div class="bg-white p-6 rounded-lg shadow">卡片4</div>
</div>
```

### 不等宽列

```html
<!-- 左侧1/3，右侧2/3 -->
<div class="grid grid-cols-3 gap-4">
    <div class="col-span-1 bg-gray-100">侧边栏</div>
    <div class="col-span-2 bg-white">主内容</div>
</div>

<!-- 复杂布局 -->
<div class="grid grid-cols-12 gap-4">
    <div class="col-span-3">导航</div>
    <div class="col-span-6">内容</div>
    <div class="col-span-3">广告</div>
</div>
```

### 跨行跨列

```html
<div class="grid grid-cols-3 grid-rows-3 gap-4">
    <div class="col-span-2 row-span-2 bg-blue-500">大卡片（占2x2）</div>
    <div class="bg-gray-100">小卡片1</div>
    <div class="bg-gray-100">小卡片2</div>
    <div class="col-span-3 bg-green-500">底部横幅（占满）</div>
</div>
```

### 自动填充网格

```html
<!-- auto-fit：尽可能多列 -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
    <div>自动适配宽度</div>
    <div>自动适配宽度</div>
    <div>自动适配宽度</div>
</div>

<!-- auto-fill：保持列数 -->
<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
    <div>卡片</div>
    <div>卡片</div>
</div>
```

### 瀑布流布局

使用 Grid + column-count（需配合插件或自定义）：

```html
<!-- 使用 columns 工具类（需 @tailwindcss/container-queries 插件） -->
<div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
    <div class="break-inside-avoid bg-white p-4 rounded shadow">内容1</div>
    <div class="break-inside-avoid bg-white p-4 rounded shadow">内容2</div>
    <div class="break-inside-avoid bg-white p-4 rounded shadow">内容3</div>
</div>
```

### Dashboard 布局

```html
<div class="grid grid-cols-12 grid-rows-6 gap-4 h-screen">
    <!-- 顶部导航 -->
    <header class="col-span-12 row-span-1 bg-white shadow">导航</header>

    <!-- 侧边栏 -->
    <aside class="col-span-2 row-span-5 bg-gray-100">侧边栏</aside>

    <!-- 主内容 -->
    <main class="col-span-10 row-span-5 overflow-auto">
        <div class="grid grid-cols-3 gap-6 p-6">
            <div class="bg-white p-6 rounded shadow">统计卡片1</div>
            <div class="bg-white p-6 rounded shadow">统计卡片2</div>
            <div class="bg-white p-6 rounded shadow">统计卡片3</div>
        </div>
    </main>
</div>
```

---

## 表单设计方案

### 基础表单

```html
<form class="max-w-lg mx-auto space-y-6">
    <!-- 输入框 -->
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
            用户名
        </label>
        <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             transition"
            placeholder="请输入用户名"
        />
    </div>

    <!-- 文本域 -->
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
            描述
        </label>
        <textarea
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500
             resize-none"
            placeholder="请输入描述..."
        ></textarea>
    </div>

    <!-- 提交按钮 -->
    <button
        type="submit"
        class="w-full bg-blue-600 text-white py-3 rounded-lg
           hover:bg-blue-700 active:scale-95
           transition transform"
    >
        提交
    </button>
</form>
```

### 验证状态

```html
<!-- 成功状态 -->
<div>
    <input
        type="email"
        class="w-full px-4 py-2 border-2 border-green-500 rounded-lg
           focus:ring-2 focus:ring-green-500"
    />
    <p class="mt-1 text-sm text-green-600 flex items-center gap-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
            />
        </svg>
        邮箱格式正确
    </p>
</div>

<!-- 错误状态 -->
<div>
    <input
        type="password"
        class="w-full px-4 py-2 border-2 border-red-500 rounded-lg
           focus:ring-2 focus:ring-red-500"
    />
    <p class="mt-1 text-sm text-red-600 flex items-center gap-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
            />
        </svg>
        密码至少需要8位
    </p>
</div>
```

### 复选框与单选

```html
<!-- 自定义复选框 -->
<label class="flex items-center gap-3 cursor-pointer">
    <input
        type="checkbox"
        class="w-5 h-5 text-blue-600 rounded
           focus:ring-2 focus:ring-blue-500"
    />
    <span class="text-gray-700">记住我</span>
</label>

<!-- 单选组 -->
<div class="space-y-3">
    <label class="flex items-center gap-3 cursor-pointer">
        <input
            type="radio"
            name="plan"
            class="w-5 h-5 text-blue-600
             focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-gray-700">基础版</span>
    </label>
    <label class="flex items-center gap-3 cursor-pointer">
        <input type="radio" name="plan" class="w-5 h-5 text-blue-600" />
        <span class="text-gray-700">专业版</span>
    </label>
</div>
```

### 下拉选择

```html
<select
    class="w-full px-4 py-2 border border-gray-300 rounded-lg
         bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
         cursor-pointer"
>
    <option>请选择</option>
    <option>选项1</option>
    <option>选项2</option>
    <option>选项3</option>
</select>
```

### 文件上传

```html
<div
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
            hover:border-blue-500 transition cursor-pointer"
>
    <input type="file" class="hidden" id="file-upload" />
    <label for="file-upload" class="cursor-pointer">
        <svg
            class="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
        </svg>
        <p class="mt-2 text-sm text-gray-600">点击或拖拽文件到此处上传</p>
        <p class="text-xs text-gray-500">支持 PNG, JPG, GIF 最大 10MB</p>
    </label>
</div>
```

---

## 插件生态系统

### @tailwindcss/typography

**用途**：为富文本内容（Markdown、博客文章）提供优雅的排版样式。

**安装**：

```bash
npm install -D @tailwindcss/typography
```

**配置**：

```js
// tailwind.config.js
module.exports = {
    plugins: [require("@tailwindcss/typography")]
};
```

**使用**：

```html
<article class="prose lg:prose-xl dark:prose-invert">
    <h1>博客标题</h1>
    <p>这是一段长文本，typography 插件会自动设置合适的字号、行高、边距...</p>
    <ul>
        <li>列表项1</li>
        <li>列表项2</li>
    </ul>
</article>
```

**自定义**：

```js
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        color: "#333",
                        a: {
                            color: "#3b82f6",
                            "&:hover": {
                                color: "#2563eb"
                            }
                        }
                    }
                }
            }
        }
    }
};
```

### @tailwindcss/forms

**用途**：重置表单元素样式，提供一致的跨浏览器体验。

**安装**：

```bash
npm install -D @tailwindcss/forms
```

**配置**：

```js
module.exports = {
    plugins: [require("@tailwindcss/forms")]
};
```

**效果**：自动优化 `<input>`、`<select>`、`<textarea>` 等样式，无需额外类名。

### @tailwindcss/aspect-ratio

**用途**：轻松实现固定宽高比容器（视频、图片等）。

**安装**：

```bash
npm install -D @tailwindcss/aspect-ratio
```

**使用**：

```html
<!-- 16:9 视频容器 -->
<div class="aspect-w-16 aspect-h-9">
    <iframe src="https://youtube.com/..." class="w-full h-full"></iframe>
</div>

<!-- 1:1 正方形 -->
<div class="aspect-w-1 aspect-h-1">
    <img src="..." class="object-cover w-full h-full" />
</div>
```

### @tailwindcss/line-clamp

**用途**：文本截断（显示多行后省略）。

**安装**：

```bash
npm install -D @tailwindcss/line-clamp
```

**使用**：

```html
<!-- 最多显示3行 -->
<p class="line-clamp-3">
    这是一段很长的文本，超过三行后会自动截断并显示省略号...
</p>

<!-- 响应式截断 -->
<p class="line-clamp-2 md:line-clamp-4">移动端2行，桌面端4行</p>
```

### @tailwindcss/container-queries

**用途**：基于容器（而非视口）的响应式设计。

**安装**：

```bash
npm install -D @tailwindcss/container-queries
```

**使用**：

```html
<div class="@container">
    <div class="@lg:flex @lg:gap-4">
        <!-- 当父容器宽度达到 lg 断点时显示为 flex -->
        <div>内容A</div>
        <div>内容B</div>
    </div>
</div>
```

---

## 任意值与变体

### 任意值（Arbitrary Values）

当预设值不满足需求时，使用方括号 `[]` 插入任意 CSS 值：

```html
<!-- 任意宽度 -->
<div class="w-[137px]">精确宽度</div>

<!-- 任意颜色 -->
<div class="bg-[#1da1f2] text-[rgb(255,0,0)]">自定义颜色</div>

<!-- 任意间距 -->
<div class="p-[17px] mt-[3.2rem]">非标准间距</div>

<!-- 任意 Grid -->
<div class="grid-cols-[200px_1fr_100px]">三列：200px, 自适应, 100px</div>

<!-- 任意字体 -->
<p class="text-[length:var(--my-font-size)]">CSS 变量字号</p>

<!-- 任意 before/after 内容 -->
<div class="before:content-['★']">星号前缀</div>
```

### 任意属性

使用 `[{property}:{value}]` 语法：

```html
<!-- 任意 CSS 属性 -->
<div class="[mask-type:luminance]">自定义属性</div>

<!-- Grid 高级用法 -->
<div class="[grid-template-areas:'header_header''sidebar_main']">高级 Grid</div>

<!-- 动画延迟 -->
<div class="[animation-delay:0.5s]">延迟动画</div>
```

### 任意变体（Arbitrary Variants）

自定义伪类、媒体查询等：

```html
<!-- 自定义伪类 -->
<div class="[&:nth-child(3)]:bg-blue-500">第三个子元素蓝色</div>

<!-- 自定义媒体查询 -->
<div class="[@media(min-width:800px)]:flex">800px 以上显示 flex</div>

<!-- 组合选择器 -->
<div class="[&>p]:text-gray-700">所有直接子 p 标签灰色</div>

<!-- 数据属性 -->
<div class="data-[state=open]:bg-green-500">根据 data-state 变色</div>

<!-- 群组变体 -->
<div class="group">
    <div class="[.group:hover_&]:scale-110">父元素悬浮时缩放</div>
</div>
```

---

## 设计模式

### Group 群组变体

**场景**：父元素状态影响子元素。

```html
<div class="group hover:bg-blue-500 p-6 rounded-lg transition">
    <h3 class="text-gray-900 group-hover:text-white transition">标题</h3>
    <p class="text-gray-600 group-hover:text-gray-100 transition">描述文字</p>
    <button
        class="bg-blue-600 group-hover:bg-white group-hover:text-blue-600 transition"
    >
        按钮
    </button>
</div>
```

### Peer 同级变体

**场景**：同级元素状态影响当前元素。

```html
<!-- 浮动标签输入框 -->
<div class="relative">
    <input
        type="text"
        class="peer w-full px-4 py-2 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder=" "
        id="username"
    />
    <label
        for="username"
        class="absolute left-4 top-2 text-gray-600 transition-all
           peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
           peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
    >
        用户名
    </label>
</div>

<!-- 复选框控制显示 -->
<div>
    <input type="checkbox" id="toggle" class="peer sr-only" />
    <label for="toggle" class="cursor-pointer text-blue-600">显示详情</label>
    <div class="hidden peer-checked:block mt-4 p-4 bg-gray-100 rounded">
        详细内容...
    </div>
</div>
```

### Container Queries 容器查询

**场景**：基于父容器宽度（而非视口）的响应式布局。

```html
<div class="@container">
    <div class="@md:flex @md:gap-4">
        <!-- 当父容器 >= md 断点时才显示为 flex -->
        <div class="@md:w-1/2">左侧</div>
        <div class="@md:w-1/2">右侧</div>
    </div>
</div>

<!-- 嵌套容器查询 -->
<div class="@container/sidebar">
    <div class="@lg/sidebar:block hidden">仅当侧边栏容器足够宽时显示</div>
</div>
```

### 暗色模式与状态组合

```html
<button
    class="
  bg-blue-600 dark:bg-blue-500
  hover:bg-blue-700 dark:hover:bg-blue-600
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  transition-all
"
>
    全场景按钮
</button>
```

---

## 实战案例

### 案例 1：博客卡片

```html
<article
    class="group bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden
                hover:shadow-2xl transition-all duration-300"
>
    <!-- 封面图 -->
    <div class="relative overflow-hidden h-48">
        <img
            src="cover.jpg"
            alt="文章封面"
            class="w-full h-full object-cover transform
             group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute top-4 right-4">
            <span
                class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
            >
                技术
            </span>
        </div>
    </div>

    <!-- 内容 -->
    <div class="p-6">
        <h2
            class="text-2xl font-bold text-gray-900 dark:text-white mb-2
               group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
        >
            Tailwind CSS 完全指南
        </h2>
        <p class="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
            深入学习 Tailwind CSS
            的所有特性，从基础到进阶，助你快速掌握实用优先的 CSS 框架...
        </p>

        <!-- 元信息 -->
        <div
            class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
        >
            <div class="flex items-center gap-2">
                <img src="avatar.jpg" alt="作者" class="w-8 h-8 rounded-full" />
                <span>张三</span>
            </div>
            <time datetime="2024-01-15">2024-01-15</time>
        </div>
    </div>

    <!-- 底部操作 -->
    <div
        class="px-6 pb-6 flex items-center gap-4 text-gray-600 dark:text-gray-400"
    >
        <button class="flex items-center gap-1 hover:text-blue-600 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
                />
            </svg>
            <span>128</span>
        </button>
        <button class="flex items-center gap-1 hover:text-blue-600 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clip-rule="evenodd"
                />
            </svg>
            <span>32</span>
        </button>
    </div>
</article>
```

### 案例 2：Dashboard 卡片

```html
<div
    class="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700
            rounded-2xl p-6 shadow-xl text-white"
>
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold opacity-90">总收入</h3>
        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </div>
    </div>

    <div class="mb-4">
        <p class="text-4xl font-bold">¥128,450</p>
        <p class="text-sm opacity-80 mt-1">本月累计</p>
    </div>

    <div class="flex items-center gap-2 text-sm">
        <span
            class="bg-green-400 text-green-900 px-2 py-1 rounded-full font-medium"
        >
            +12.5%
        </span>
        <span class="opacity-80">较上月</span>
    </div>
</div>
```

### 案例 3：导航栏

```html
<nav
    class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
            border-b border-gray-200 dark:border-gray-700"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg
                    flex items-center justify-center text-white font-bold text-xl"
                >
                    T
                </div>
                <span class="text-xl font-bold text-gray-900 dark:text-white"
                    >TailwindBlog</span
                >
            </div>

            <!-- 导航链接（桌面端） -->
            <div class="hidden md:flex items-center gap-8">
                <a
                    href="#"
                    class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                          transition font-medium"
                >
                    首页
                </a>
                <a
                    href="#"
                    class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                          transition font-medium"
                >
                    文章
                </a>
                <a
                    href="#"
                    class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                          transition font-medium"
                >
                    关于
                </a>
            </div>

            <!-- 右侧操作 -->
            <div class="flex items-center gap-4">
                <!-- 搜索 -->
                <button
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                    <svg
                        class="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>

                <!-- 暗色模式切换 -->
                <button
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                    <svg
                        class="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                        />
                    </svg>
                </button>

                <!-- 移动端菜单按钮 -->
                <button
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                    <svg
                        class="w-6 h-6 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</nav>
```

### 案例 4：模态框

```html
<!-- 遮罩层 -->
<div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center
            animate-fade-in"
>
    <!-- 模态框容器 -->
    <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4
              animate-slide-up"
    >
        <!-- 头部 -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
        >
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                确认操作
            </h2>
            <button
                class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
                <svg
                    class="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>

        <!-- 内容 -->
        <div class="px-6 py-4">
            <p class="text-gray-700 dark:text-gray-300">
                你确定要删除这篇文章吗？此操作不可撤销。
            </p>
        </div>

        <!-- 底部操作 -->
        <div
            class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-slate-900/50
                rounded-b-2xl"
        >
            <button
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
                取消
            </button>
            <button
                class="px-4 py-2 rounded-lg bg-red-600 text-white
                     hover:bg-red-700 active:scale-95 transition transform"
            >
                确认删除
            </button>
        </div>
    </div>
</div>
```

### 案例 5：时间轴

```html
<div class="max-w-3xl mx-auto">
    <div
        class="relative border-l-2 border-blue-500 dark:border-blue-400 pl-8 space-y-12"
    >
        <!-- 时间节点1 -->
        <div class="relative">
            <!-- 圆点 -->
            <div
                class="absolute -left-[37px] w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full
                  ring-4 ring-white dark:ring-slate-900"
            ></div>

            <div
                class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6
                  hover:shadow-xl transition-shadow"
            >
                <time class="text-sm text-gray-500 dark:text-gray-400"
                    >2024-01-15</time
                >
                <h3
                    class="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2"
                >
                    项目启动
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                    正式启动 Tailwind 博客项目，完成技术选型和初始化配置。
                </p>
            </div>
        </div>

        <!-- 时间节点2 -->
        <div class="relative">
            <div
                class="absolute -left-[37px] w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full
                  ring-4 ring-white dark:ring-slate-900"
            ></div>

            <div
                class="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6
                  hover:shadow-xl transition-shadow"
            >
                <time class="text-sm text-gray-500 dark:text-gray-400"
                    >2024-01-20</time
                >
                <h3
                    class="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2"
                >
                    UI 设计完成
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                    完成所有页面的 UI 设计和组件开发，实现暗色模式支持。
                </p>
            </div>
        </div>

        <!-- 时间节点3 -->
        <div class="relative">
            <div
                class="absolute -left-[37px] w-4 h-4 bg-green-600 dark:bg-green-500 rounded-full
                  ring-4 ring-white dark:ring-slate-900 animate-pulse"
            ></div>

            <div
                class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20
                  border-2 border-green-500 dark:border-green-400 rounded-lg p-6"
            >
                <time
                    class="text-sm text-green-700 dark:text-green-400 font-medium"
                    >2024-01-25</time
                >
                <h3
                    class="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2"
                >
                    项目上线 🎉
                </h3>
                <p class="text-gray-700 dark:text-gray-300">
                    成功部署到生产环境，开始正式运营。
                </p>
            </div>
        </div>
    </div>
</div>
```

---

## 最佳实践

### 1. 组件化思维

**不推荐**：在 HTML 中重复长串类名

```html
<button
    class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700..."
>
    按钮1
</button>
<button
    class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700..."
>
    按钮2
</button>
```

**推荐**：提取为组件（React 示例）

```tsx
// components/Button.tsx
export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg
                       hover:bg-blue-700 active:scale-95 transition">
      {children}
    </button>
  );
}

// 使用
<Button>按钮1</Button>
<Button>按钮2</Button>
```

### 2. 适度使用 @apply

**场景**：提取重复样式到 CSS 类。

```css
/* styles.css */
@layer components {
    .btn-primary {
        @apply bg-blue-600 text-white px-6 py-3 rounded-lg
           hover:bg-blue-700 active:scale-95 transition;
    }

    .card {
        @apply bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6;
    }
}
```

```html
<button class="btn-primary">主按钮</button>
<div class="card">卡片内容</div>
```

**注意**：不要过度使用 `@apply`，否则失去 Tailwind 的灵活性优势。

### 3. 颜色语义化

在配置文件中定义语义化颜色：

```js
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#3b82f6",
                    dark: "#2563eb",
                    light: "#60a5fa"
                },
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444"
            }
        }
    }
};
```

```html
<button class="bg-primary hover:bg-primary-dark">主按钮</button>
<div class="text-success">成功提示</div>
<div class="bg-danger text-white">错误提示</div>
```

### 4. 保持类名顺序

遵循一致的类名顺序，提高可读性：

```html
<!-- 推荐顺序：布局 → 尺寸 → 间距 → 排版 → 颜色 → 边框 → 背景 → 效果 → 交互 -->
<div
    class="
  flex items-center justify-between
  w-full max-w-3xl
  px-6 py-4
  text-lg font-semibold
  text-gray-900 dark:text-white
  border-b border-gray-200
  bg-white dark:bg-slate-800
  shadow-md
  hover:shadow-lg transition
"
>
    内容
</div>
```

### 5. 响应式优先级

移动优先：先写小屏样式，再用断点覆盖。

```html
<!-- ✅ 推荐：移动优先 -->
<div
    class="
  flex-col gap-2
  md:flex-row md:gap-4
  lg:gap-6
"
>
    响应式布局
</div>

<!-- ❌ 避免：桌面优先 -->
<div class="flex-row gap-6 md:flex-col md:gap-2">混乱的逻辑</div>
```

### 6. 暗色模式完整性

确保每个颜色相关的类都有暗色对应：

```html
<!-- ✅ 完整 -->
<div
    class="
  bg-white dark:bg-slate-900
  text-gray-900 dark:text-gray-100
  border-gray-200 dark:border-gray-700
"
>
    完整暗色支持
</div>

<!-- ❌ 不完整 -->
<div class="bg-white text-gray-900 border-gray-200">暗色模式下可能不可读</div>
```

### 7. 性能优化

-   **PurgeCSS 配置**：确保 `content` 路径正确，移除未使用的样式
-   **避免深层嵌套**：过多的 DOM 层级影响性能
-   **使用 `will-change`**：对频繁动画的元素添加 `will-change-transform`

```js
// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"]
};
```

### 8. 可访问性（a11y）

-   使用语义化 HTML 标签
-   提供 `aria-label`、`role` 等属性
-   确保足够的颜色对比度
-   键盘导航支持

```html
<!-- 可访问的按钮 -->
<button
    class="bg-blue-600 text-white px-4 py-2 rounded
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-label="提交表单"
>
    提交
</button>

<!-- 可访问的导航 -->
<nav aria-label="主导航">
    <ul class="flex gap-4">
        <li><a href="#" class="focus:underline">首页</a></li>
        <li><a href="#" class="focus:underline">文章</a></li>
    </ul>
</nav>
```

---

## 总结

Tailwind CSS 进阶掌握要点：

1. **自定义配置**：扩展主题、自定义颜色、间距、动画
2. **动画技巧**：自定义 keyframes、组合过渡、滚动触发
3. **Grid 精通**：响应式网格、跨行跨列、Dashboard 布局
4. **表单设计**：验证状态、自定义控件、文件上传
5. **插件生态**：typography、forms、aspect-ratio、line-clamp、container-queries
6. **任意值**：突破预设限制，使用 `[]` 语法
7. **设计模式**：group、peer、容器查询
8. **实战案例**：博客卡片、Dashboard、导航栏、模态框、时间轴

**进阶建议**：

-   深入研究 Tailwind 官方文档和源码
-   学习社区优秀组件库（如 Headless UI、daisyUI）
-   在实际项目中积累设计模式
-   关注无障碍访问和性能优化

祝你成为 Tailwind 高手！🚀
