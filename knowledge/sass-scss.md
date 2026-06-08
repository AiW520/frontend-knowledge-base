# Sass/SCSS

## 知识简介

SCSS 是 CSS 预处理器，扩展了 CSS 的语法，支持变量、嵌套、混入（mixin）、函数等特性。jinzhuan-project-web 项目使用 SCSS 编写复杂样式，包括 mixin 封装和 CSS 变量主题系统。

## 核心概念

- **变量**：`$primary-color: #667eea;`
- **嵌套**：选择器嵌套，减少重复代码
- **& 父选择器**：`&:hover`、`&.active`
- **`@mixin` / `@include`**：可复用的样式块
- **`@import` / `@use`**：模块化导入
- **`@extend`**：继承样式

## 详细讲解

在 jinzhuan-project-web 项目中，SCSS 主要用于：

**1. Mixin 封装**：项目中定义了 `glassmorphism` mixin，用于创建毛玻璃效果背景：
```scss
@mixin glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**2. 嵌套写法**：结构清晰，减少选择器重复
```scss
.sidebar {
  width: 260px;
  
  &.collapsed { width: 80px; }
  
  .nav-item {
    padding: 14px 16px;
    
    &:hover { background: rgba(255, 255, 255, 0.05); }
    &.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  }
}
```

**3. CSS 变量**：在 `web3-theme.scss` 中定义主题变量
```scss
:root {
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --border-color: rgba(255, 255, 255, 0.1);
}
```

**4. Vite 配置 SCSS 支持**：在 `vite.config.ts` 中配置预处理器
```typescript
css: {
  preprocessorOptions: {
    less: { javascriptEnabled: true }
  }
}
```

## 重点内容

- `@mixin` 可以接受参数，如 `@mixin glass($opacity: 0.05)`
- 嵌套不宜超过三层，否则难以维护
- `_` 开头的文件是局部文件（partial），不会被编译为单独的 CSS
- `@use` 是 `@import` 的现代替代方案
- Vite 项目中直接安装 `sass` 即可使用，无需额外 loader 配置

## 关键代码示例

来源：`jinzhuan-project-web/src/components/Layout/layout.vue`（scss 部分）

```scss
<style lang="scss">
.sidebar {
  width: 260px;
  height: 100vh;
  position: sticky;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.collapsed { width: 80px; }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover { background: rgba(255, 255, 255, 0.05); }
    
    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  }
}
</style>
```

## 实际应用场景

- 大型项目的样式组织
- 主题系统（CSS 变量 + Mixin）
- 动画定义
- 响应式样式（媒体查询嵌套）
- 可复用的样式模式

## 注意事项

- SCSS 代码最终编译为 CSS，浏览器只执行 CSS
- 需要安装 `sass` 依赖（`npm install -D sass`）
- 在 Vue 组件中使用 `<style lang="scss">` 指定语言
- `scoped` 属性使样式仅作用于当前组件

## 常见误区

- 误区：嵌套层级过深导致 CSS 特异性过高
- 误区：滥用 `@extend` 导致意料之外的样式继承
- 误区：混淆 SCSS 变量（`$var`）和 CSS 变量（`--var`）
- 误区：忘记导入 `@mixin` 文件就使用

## 关联知识点

- [Tailwind CSS](/knowledge/tailwind-css)
- [CSS Flexbox 布局](/knowledge/css-flexbox)
- [CSS 定位](/knowledge/css-position)

## 资料来源

- 来源项目：`新前端资源/jinzhuan-project-web/`
- 来源文件：`src/assets/css/web3-theme.scss`（主题变量和 mixin）
- 来源文件：`src/assets/css/reset.scss`（重置样式）
- 来源文件：`src/assets/css/theme.scss`（主题样式）
- 来源文件：`src/components/Layout/layout.vue`（嵌套样式示例）
- 来源文件：`src/App.vue`（全局样式）

## 官方资源扩展

- [Sass 官方文档](https://sass-lang.com/documentation/)
- Sass 官方文档，涵盖 SCSS 和 Sass 语法的完整参考
- [Sass 中文文档](https://www.sass.hk/docs/)
- Sass 的中文参考文档