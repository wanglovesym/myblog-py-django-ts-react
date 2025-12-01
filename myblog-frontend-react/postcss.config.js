// postcss.config.js
// 这是 PostCSS 的配置文件，用来声明要启用哪些 PostCSS 插件。
// PostCSS 是一个对 CSS 进行转换的工具平台，常见用法有：
// - 与 Tailwind CSS 配合：把你在 HTML/JSX 中使用到的类名生成成最终的 CSS；
// - 自动补全浏览器厂商前缀（autoprefixer）：提升兼容性；
// - 其他插件（如嵌套、变量、压缩等）也可以在这里按需添加。

export default {
    plugins: {
        // Tailwind CSS 插件：
        // - 读取项目根目录的 tailwind.config.js；
        // - 扫描 content 指定的文件，生成只包含用到的工具类的 CSS（减少体积）。
        tailwindcss: {},

        // Autoprefixer 插件：
        // - 根据 browserslist（通常在 package.json 或独立文件中定义）
        //   自动为某些需要兼容的 CSS 属性添加浏览器私有前缀。
        // - 示例：display: flex; 会自动扩展旧浏览器可能需要的 -webkit- 前缀等。
        autoprefixer: {}

        // 如果将来需要更多 PostCSS 插件，可以在此继续添加：
        // 如支持 CSS 嵌套：'postcss-nesting': {}
        // 如使用自定义媒体查询：'postcss-custom-media': {}
        // 如生产环境压缩：'cssnano': { preset: 'default' }
    }
};
