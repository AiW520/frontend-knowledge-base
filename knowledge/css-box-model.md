# CSS 盒模型

## 知识简介

CSS 盒模型描述了元素在页面中所占空间的计算方式，每个元素都被视为一个矩形盒子，由内容（content）、内边距（padding）、边框（border）和外边距（margin）组成。

## 核心概念

- `content`：内容区域，显示文本和子元素
- `padding`：内边距，内容与边框之间的空间
- `border`：边框，围绕内边距的线条
- `margin`：外边距，元素与相邻元素之间的空间
- `box-sizing`：控制盒模型计算方式

## 详细讲解

在Vue2 业务演示项目的 CSS 中，广泛使用了盒模型相关属性来控制布局和间距。

产品截图区域使用 `padding` 和 `border-top` 来控制间距和分割线：

```css
.screenshot .item {
    border-top: 1px solid #CCC;
    padding-bottom: 30px;
    padding-top: 20px;
}
```

解决文字和图片重叠问题，使用 `padding-left` 添加内边距：

```css
.screenshot .item div p {
    padding-left: 20px;
}
.screenshot .item div h2 {
    padding-left: 20px;
}
```

登录窗口使用 `margin-top` 实现垂直居中效果：

```css
.modal-dialog {
    opacity: 0.9;
    width: 500px;
}
```

在 HTML 中：
```html
<div id="app" class="modal-dialog" style="margin-top: 10%;">
```

上传表单的输入框使用了完整的盒模型样式：

```css
.upload input {
    display: block;
    width: 300px;
    height: 34px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
}
```

## 重点内容

- 标准盒模型：`width` = content 宽度
- IE 盒模型（`box-sizing: border-box`）：`width` = content + padding + border
- `margin` 可以为负值，`padding` 不能为负值
- 相邻元素的垂直 `margin` 会合并（取最大值）

## 关键代码示例

示例来源：通用训练工程抽象

```css
.screenshot .item {
    border-top: 1px solid #CCC;
    padding-bottom: 30px;
    padding-top: 20px;
}
```

示例来源：通用训练工程抽象

```css
.screenshot .item div p {
    padding-left: 20px;
}
.screenshot .item div h2 {
    padding-left: 20px;
}
```

示例来源：通用训练工程抽象

```css
.upload input {
    display: block;
    width: 300px;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
}
```

## 实际应用场景

- 控制元素间距和留白
- 实现边框样式
- 按钮和输入框样式
- 卡片布局

## 注意事项

- 默认 `box-sizing: content-box`，设置 `width` 后加上 `padding` 和 `border` 会超出预期
- 推荐使用 `box-sizing: border-box` 简化布局计算
- 行内元素的 `margin-top` 和 `margin-bottom` 不生效

## 常见误区

- 误区：混淆 `margin` 和 `padding` 的使用场景
- 误区：忽略 `box-sizing` 导致元素宽度计算错误

## 关联知识点

- [CSS Flexbox 布局](/knowledge/css-flexbox)
- [CSS 定位](/knowledge/css-position)
- [Bootstrap 栅格系统](/knowledge/bootstrap-grid)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [MDN - 盒模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)
- 详细介绍标准盒模型和替代盒模型（border-box）