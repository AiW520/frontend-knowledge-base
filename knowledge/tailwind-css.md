# Tailwind CSS

## 知识简介

Tailwind CSS 是一个以原子化 CSS 类为核心的 CSS 框架，通过在 HTML 中直接使用预定义的 class（如 `flex`、`bg-blue-500`、`p-4`）来构建界面，无需编写自定义 CSS。Vue3 项目级训练工程同时使用 Tailwind CSS 和 Windi CSS。

## 核心概念

- **原子化类**：每个类只做一件事（如 `text-center` 只设置文本居中）
- **响应式前缀**：`sm:`、`md:`、`lg:`、`xl:`（如 `md:flex`）
- **暗黑模式**：`dark:` 前缀
- **CSS 变量**：通过 CSS 自定义属性实现主题系统
- **工具组合**：组合多个类来构建复杂样式

## 详细讲解

在 Vue3 项目级训练工程中，Tailwind CSS 配合 `tailwindcss-animate` 插件实现动画，配置文件（`tailwind.config.js`）中定义了基于 CSS 变量的设计系统：

```javascript
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  }
}
```

这种设计方式常用于 shadcn-vue 组件系统，使得主题可以灵活切换（通过修改 CSS 变量）。

Tailwind CSS 的核心优势：
- 不需要离开 HTML 编写样式
- 打包时自动移除未使用的 CSS（PurgeCSS）
- 内置响应式设计和暗黑模式支持
- 通过配置文件实现设计系统

## 重点内容

- 布局类：`flex`、`grid`、`block`、`hidden`
- 间距类：`p-4`（padding）、`m-2`（margin）、`gap-4`
- 颜色类：`bg-blue-500`、`text-white`、`border-gray-200`
- 尺寸类：`w-full`、`h-screen`、`max-w-md`
- 排版类：`text-lg`、`font-bold`、`text-center`

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
export default {
  darkMode: "selector",
  safelist: ["dark"],
  prefix: "",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      }
    }
  },
  plugins: [animate, setupInspiraUI]
}
```

## 实际应用场景

- 快速原型开发
- 组件库设计系统（如 shadcn-vue）
- 响应式布局
- 暗黑模式切换
- 到UI组件的高效转换

## 注意事项

- HTML 中 class 可能很长，可以使用 `@apply` 指令提取重复样式
- 生产构建会移除未使用的样式，确保 `content` 路径配置正确
- Tailwind CSS 3.x 使用 Just-in-Time (JIT) 引擎，按需生成样式
- 自定义颜色需要通过配置文件或 CSS 变量

## 常见误区

- 误区：Tailwind CSS 是内联样式（实际上是 class 形式）
- 误区：认为使用 Tailwind 就不用写 CSS（复杂场景仍需自定义）
- 误区：所有样式都写在 class 中（复杂样式应该提取为组件）

## 关联知识点

- [Sass/SCSS](/knowledge/sass-scss)
- [Ant Design Vue 3](/knowledge/ant-design-vue3)
- [Vite 插件系统](/knowledge/vite-plugins)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（完整配置）
- 示例来源：通用训练工程抽象（Windi CSS 配置）
- 示例来源：通用训练工程抽象（CSS 变量主题）

## 官方资源扩展

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- Tailwind CSS 官方文档，包含所有原子化类的完整参考
- [Windi CSS 官方文档](https://windicss.org/)
- Windi CSS 官方文档（与 Tailwind 兼容的替代方案）