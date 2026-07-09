# DOM 操作

## 知识简介

DOM（文档对象模型）操作是通过 JavaScript 读取和修改 HTML 页面结构和内容的基础能力。在 Vue 项目中，一般避免直接操作 DOM，但在某些场景下仍需要。

## 核心概念

- `document.getElementById()`：通过 ID 获取元素
- `document.createElement()`：创建新元素
- `$refs`：Vue 提供的 DOM 引用方式
- `setAttribute()` / `getAttribute()`：设置/获取属性
- `window.location.href`：页面跳转

## 详细讲解

在项目中，DOM 操作主要用于以下场景：

1. 通过 `$refs` 获取 DOM 元素（Vue 推荐方式）：
```javascript
this.$refs.file.click()
```

2. 通过 `document.getElementById()` 获取元素（原生方式）：
```javascript
var file = document.getElementById("file")
var posterImg = document.getElementById('poster')
```

3. 通过 `setAttribute()` 修改元素属性：
```javascript
img.setAttribute('src', base64)
```

4. 通过 `window.location.href` 进行页面跳转：
```javascript
window.location.href = "main.html"
window.location.href = "login.html"
```

5. 在 supply chain 项目中使用 `$router.push()` 进行路由跳转（Vue Router 方式）：
```javascript
this.$router.push('/home')
this.$router.push('/login')
```

## 重点内容

- Vue 中推荐使用 `$refs` 而非 `document.getElementById()`
- `window.location.href` 会刷新页面，`$router.push()` 不会
- 在 CDN 模式下使用 `window.location.href`，在 Vue CLI 模式下使用 `$router.push()`

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
this.$refs.file.click()
```

示例来源：通用训练工程抽象

```javascript
var file = document.getElementById("file")
```

示例来源：通用训练工程抽象

```javascript
img.setAttribute('src', base64)
```

示例来源：通用训练工程抽象

```javascript
window.location.href = "main.html"
```

示例来源：通用训练工程抽象

```javascript
this.$router.push('/home')
```

## 实际应用场景

- 页面跳转
- 获取表单元素值
- 修改元素样式和属性
- 触发文件选择框

## 注意事项

- Vue 中尽量避免直接操作 DOM，优先使用数据驱动
- 需要在 `mounted` 生命周期后才能访问 DOM 元素
- `window.location.href` 会导致页面刷新，丢失当前状态

## 常见误区

- 误区：在 `created` 生命周期中访问 DOM 元素
- 误区：在 Vue 项目中过度使用 `document.getElementById()` 而非 `$refs`

## 关联知识点

- [Vue Router](/knowledge/vue-router)
- [FileReader 文件读取](/knowledge/filereader)
- [Canvas API](/knowledge/canvas-api)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [MDN - DOM 操作](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- 详细介绍 DOM 的 API 和操作方法