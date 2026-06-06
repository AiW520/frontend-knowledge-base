# CSS 定位

## 知识简介

CSS 的 `position` 属性用于控制元素的定位方式，包括静态定位、相对定位、绝对定位、固定定位和粘性定位。

## 核心概念

- `static`：默认定位，遵循正常文档流
- `relative`：相对定位，相对于元素自身正常位置偏移
- `absolute`：绝对定位，相对于最近的已定位祖先元素
- `fixed`：固定定位，相对于浏览器窗口
- `sticky`：粘性定位，滚动到阈值时固定
- `z-index`：控制层叠顺序

## 详细讲解

在电子签章系统中，`position: sticky` 用于实现导航条固定在页面顶部的效果：

```css
.position {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 3;
}
```

当用户向下滚动页面时，导航条会"粘"在顶部，保持在可视区域内。`top: 0` 指定粘性定位的阈值，`z-index: 3` 确保导航条位于其他内容之上。

在学籍管理系统中，下拉菜单使用 `position: absolute` 实现绝对定位：

```css
#fun ul {
    display: none;
    position: absolute;
    width: 200px;
    text-align: center;
}
```

下拉菜单的 `position: absolute` 使其脱离文档流，相对于父元素 `#fun`（需要设置 `position: relative`）进行定位。

## 重点内容

- `sticky` 在滚动到阈值前表现为 `relative`，超过阈值后表现为 `fixed`
- `absolute` 相对于最近的已定位（非 `static`）祖先元素
- `fixed` 相对于浏览器视口
- `z-index` 仅在定位元素上生效

## 关键代码示例

来源：`frontend/css/style.css` 第 2-7 行

```css
.position {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 3;
}
```

来源：`学籍管理-frontend/css/style.css` 第 148-153 行

```css
#fun ul {
    display: none;
    position: absolute;
    width: 200px;
    text-align: center;
}
```

来源：`学籍管理-frontend/css/style.css` 第 144-146 行

```css
#fun {
    float: left;
    height: 100%;
    margin-top: 0;
}
```

## 实际应用场景

- 固定导航栏
- 下拉菜单定位
- 模态框居中
- 悬浮按钮
- 回到顶部按钮

## 注意事项

- `sticky` 定位需要指定 `top`、`right`、`bottom` 或 `left` 中的至少一个值
- `sticky` 在父元素溢出隐藏时可能失效
- `absolute` 定位的元素脱离文档流，不占空间

## 常见误区

- 误区：使用 `absolute` 时忘记设置父元素的 `position: relative`
- 误区：认为 `sticky` 在所有浏览器中都能正常工作（IE 不支持）

## 关联知识点

- [CSS Flexbox 布局](/knowledge/css-flexbox)
- [CSS 盒模型](/knowledge/css-box-model)
- [Bootstrap 导航条](/knowledge/bootstrap-navbar)

## 资料来源

- 来源文件：`frontend/css/style.css` 第 2-7 行
- 来源文件：`学籍管理-frontend/css/style.css` 第 144-153 行

## 官方资源扩展

- [MDN - position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- 详细介绍所有定位类型的使用方法和示例