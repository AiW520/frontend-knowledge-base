# CSS Flexbox 布局

## 知识简介

Flexbox（弹性盒子布局）是 CSS3 的一种布局模式，用于在容器中高效地排列、对齐和分配空间，即使元素尺寸未知或动态变化。

## 核心概念

- `display: flex`：将元素设为弹性容器
- `justify-content`：主轴对齐方式
- `align-items`：交叉轴对齐方式
- 主轴（main axis）和交叉轴（cross axis）
- 弹性容器和弹性子元素

## 详细讲解

在Vue2 表单演示项目的 CSS 文件中，使用了 `display: flex` 实现元素的居中对齐和水平排列：

```css
.cten {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
}
```

这个样式类用于实现内容的水平和垂直居中，同时保持浮动布局。

在Vue2 业务演示项目的 App.vue 中，虽然没有直接使用 Flexbox，但 Element UI 的 `el-row` 组件底层就是基于 Flexbox 实现的。

Bootstrap 4+ 也广泛使用 Flexbox，但在本项目的 Bootstrap 3 中，主要使用传统的浮动和栅格系统。

## 重点内容

- `display: flex` 将容器变为弹性容器
- `justify-content` 控制主轴对齐：`flex-start`、`center`、`flex-end`、`space-between`、`space-around`
- `align-items` 控制交叉轴对齐：`stretch`、`flex-start`、`center`、`flex-end`、`baseline`
- 默认主轴方向为水平（`flex-direction: row`）

## 关键代码示例

示例来源：通用训练工程抽象

```css
.cten {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
}
```

示例来源：通用训练工程抽象

```css
html, body, #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}
```

## 实际应用场景

- 页面元素居中对齐
- 导航栏布局
- 卡片列表布局
- 表单元素排列

## 注意事项

- 设为 `display: flex` 后，子元素的 `float`、`clear`、`vertical-align` 失效
- 主轴方向默认为水平（`row`），可通过 `flex-direction` 修改
- 使用 `gap` 属性可以设置弹性子元素之间的间距

## 常见误区

- 误区：混淆主轴和交叉轴的概念
- 误区：认为 `align-items` 总是控制垂直对齐（取决于主轴方向）

## 关联知识点

- [CSS 定位](/knowledge/css-position)
- [CSS 盒模型](/knowledge/css-box-model)
- [Element UI 布局](/knowledge/element-ui-layout)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [MDN - Flexbox](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- 详细介绍 Flexbox 的基本概念和完整属性参考