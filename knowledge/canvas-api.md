# Canvas 图片处理

## 知识简介

Canvas 是 HTML5 提供的绘图 API，通过 JavaScript 在 `<canvas>` 元素上绘制图形、文字和图片。在项目中用于实现文档签章功能（将印章图片合成到合同图片上）。

## 核心概念

- `document.createElement("canvas")`：创建 Canvas 元素
- `canvas.getContext("2d")`：获取 2D 绘图上下文
- `context.drawImage()`：绘制图片
- `canvas.toDataURL("image/png")`：导出为 Base64 图片
- `Image` 对象：加载图片

## 详细讲解

在电子签章系统的文档签章功能中，Canvas 用于将印章图片合成到合同文档上。具体流程：

1. 创建 Canvas 画布，尺寸与合同图片一致
2. 先在 Canvas 上绘制合同图片（作为背景）
3. 再在 Canvas 上绘制印章图片（叠加在合同上）
4. 将合成后的 Canvas 导出为 Base64 图片

```javascript
signature() {
    var canvas = document.createElement("canvas")
    canvas.width = $("#poster").width()
    canvas.height = $("#poster").height()
    var context = canvas.getContext("2d")
    context.rect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "#fff"
    context.fill()

    var myImage2 = new Image()
    myImage2.src = $("#poster").attr("src")
    myImage2.crossOrigin = 'Anonymous'
    myImage2.onload = function () {
        context.drawImage(myImage2, 0, 0, myImage2.width, myImage2.height)
        var myImage = new Image()
        myImage.src = $("#qrcode").attr("src")
        myImage.crossOrigin = 'Anonymous'
        myImage.onload = function () {
            context.drawImage(myImage, canvas.width / 2, canvas.height / 2, myImage.width, myImage.height)
            var base64 = canvas.toDataURL("image/png")
            var img = document.getElementById('poster')
            img.setAttribute('src', base64)
        }
    }
}
```

## 重点内容

- `getContext("2d")` 获取绘图上下文
- `drawImage()` 可以绘制 `<img>`、`<canvas>` 或 `Image` 对象
- `toDataURL()` 导出为 Base64 字符串
- 需要等图片加载完成（`onload`）后才能绘制

## 关键代码示例

来源：`frontend/html/signature.html` 第 137-160 行

```javascript
var canvas = document.createElement("canvas")
canvas.width = $("#poster").width()
canvas.height = $("#poster").height()
var context = canvas.getContext("2d")
context.rect(0, 0, canvas.width, canvas.height)
context.fillStyle = "#fff"
context.fill()

var myImage2 = new Image()
myImage2.src = $("#poster").attr("src")
myImage2.crossOrigin = 'Anonymous'
myImage2.onload = function () {
    context.drawImage(myImage2, 0, 0, myImage2.width, myImage2.height)
    var myImage = new Image()
    myImage.src = $("#qrcode").attr("src")
    myImage.crossOrigin = 'Anonymous'
    myImage.onload = function () {
        context.drawImage(myImage, canvas.width / 2, canvas.height / 2, myImage.width, myImage.height)
        var base64 = canvas.toDataURL("image/png")
        document.getElementById('poster').setAttribute('src', base64)
    }
}
```

## 实际应用场景

- 图片合成（如加水印、签章）
- 图片裁剪和缩放
- 图表绘制
- 截图功能

## 注意事项

- 图片绘制需要等 `Image.onload` 事件触发后才能执行
- `crossOrigin = 'Anonymous'` 解决跨域图片的 Canvas 污染问题
- Canvas 导出图片默认为 PNG 格式
- 使用 `$("#poster").attr("src")` 获取图片地址（jQuery 方式）

## 常见误区

- 误区：在没有触发 `onload` 的情况下直接绘制图片
- 误区：忘记设置 `crossOrigin` 导致跨域图片无法导出

## 关联知识点

- [FileReader 文件读取](/knowledge/filereader)
- [DOM 操作](/knowledge/dom-manipulation)
- [Vue 事件处理](/knowledge/vue-event-handling)

## 资料来源

- 来源文件：`frontend/html/signature.html` 第 137-160 行

## 官方资源扩展

- [MDN - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- 详细介绍 Canvas 的绘图方法和使用指南