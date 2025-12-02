// tailwind.config.js
// 这个文件是 Tailwind CSS 的配置文件，用来告诉 Tailwind：
// 1) 到哪里去扫描你的项目代码，提取你使用到的类名（避免打包产生无用 CSS）。
// 2) 如何启用暗色模式（dark mode）的行为。
// 3) 主题（theme）如何扩展，比如自定义颜色/间距/字体等。
// 4) 使用哪些插件来增强样式能力（比如排版插件）。
//
// - content：一定要包含你写页面的所有文件路径，这样 Tailwind 才能“看见”你用了哪些类，最终只生成这些类对应的 CSS。
// - darkMode：设置为 'class' 表示当你的 HTML 根元素（通常是 <html>）存在类名 'dark' 时，所有带有 `dark:` 前缀的样式会生效。
// - theme.extend：当你需要添加自定义主题变量时，在这里扩展，不要直接覆盖默认 theme。
// - plugins：官方或社区插件，用于提供更多工具类。例如 `@tailwindcss/typography` 提供更好看的文章排版样式。

module.exports = {
    // content 告诉 Tailwind 去哪里找你在代码中使用过的类名
    // - "./index.html"：扫描入口 HTML 文件
    // - "./src/**/*.{js,ts,jsx,tsx}"：扫描 src 目录下所有前端源码（JS/TS/React）
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    // 暗色模式策略：'class' 表示通过给根节点添加类名 'dark' 来启用暗色样式
    // 使用方式示例：在 JS 中给 document.documentElement.classList.add('dark')
    // 然后你的组件里就可以写：bg-white dark:bg-slate-900 这样的类进行切换
    darkMode: "class",
    theme: {
        // 在这里扩展主题（颜色、字体、间距、阴影等等）
        extend: {
            backgroundImage: {
                // 与 cworld 风格一致的深色竖向渐变背景
                // 从 #212e39 过渡到 #0b0a0f
                // 顶部微弱光晕（径向）叠加在主线性渐变之上
                // 可调整尺寸与透明度以获得更柔和或更强的效果
                // 仅保留线性渐变，光晕改为独立 overlay 控制，避免滚动时第二/第三屏出现光斑
                "site-dark":
                    "linear-gradient(to bottom, #212e39 0px, #0b0a0f var(--dvh))"
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        a: {
                            textDecoration: "underline",
                            transition: "color .15s ease",
                            "&:hover": {
                                color: "#b5ecfd"
                            }
                        }
                    }
                },
                invert: {
                    css: {
                        a: {
                            transition: "color .15s ease",
                            "&:hover": {
                                color: "#b5ecfd"
                            }
                        }
                    }
                }
            }),
            keyframes: {
                dropdown: {
                    "0%": {
                        opacity: "0",
                        transform: "scaleY(0.98)",
                        clipPath: "inset(0 0 100% 0)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "scaleY(1)",
                        clipPath: "inset(0 0 0 0)"
                    }
                },
                dropdownOut: {
                    "0%": {
                        opacity: "1",
                        transform: "scaleY(1)",
                        clipPath: "inset(0 0 0 0)"
                    },
                    "100%": {
                        opacity: "0",
                        transform: "scaleY(0.98)",
                        clipPath: "inset(0 0 100% 0)"
                    }
                }
            },
            animation: {
                dropdown: "dropdown 0.22s cubic-bezier(0.22,1,0.36,1) both",
                "dropdown-out":
                    "dropdownOut 0.18s cubic-bezier(0.4,0,0.2,1) both"
            }
        }
    },
    // 插件：这里启用了官方的 typography（排版）插件
    // 作用：提供 prose 类名，让长文（Markdown/文章详情）更易读
    plugins: [require("@tailwindcss/typography")]
};
