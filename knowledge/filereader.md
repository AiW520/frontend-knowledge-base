# FileReader 文件读取

## 知识简介

FileReader 是 HTML5 提供的 Web API，用于在浏览器中异步读取用户选择的文件内容，支持读取为文本、Data URL、ArrayBuffer 等格式。

## 核心概念

- `FileReader`：文件读取器构造函数
- `readAsDataURL(file)`：将文件读取为 Base64 编码的 Data URL
- `onload`：读取完成时的回调事件
- `FileReader` 是异步 API，通过事件回调获取结果

## 详细讲解

在电子签章系统的文档签章功能中，使用 FileReader 读取用户上传的合同文件，将其转换为 Base64 格式显示在页面上：

```javascript
change() {
    this.demoImg = false
    this.posterImg = true
    var self = this
    var reader = new FileReader()
    var file = document.getElementById("file")
    reader.readAsDataURL(file.files[0])  // 发起异步请求
    reader.onload = function () {
        self.contract = this.result
        self.filename = file.files[0].name
        self.status = 1
    }
}
```

文件上传通过隐藏的 `<input type="file">` 元素和 `$refs` 触发：

```html
<input type="file" id="file" @change="change" ref="file" style="display: none;"/>
```

```javascript
upload() {
    this.$refs.file.click()
}
```

## 重点内容

- `readAsDataURL()` 返回 Base64 格式的数据，可直接用于 `<img>` 的 `src` 属性
- 读取完成后通过 `reader.result` 获取结果
- FileReader 是异步的，需要在 `onload` 回调中处理结果
- `file.files[0]` 获取用户选择的第一个文件

## 关键代码示例

来源：`frontend/html/signature.html` 第 107-118 行

```javascript
change() {
    this.demoImg = false
    this.posterImg = true
    var self = this
    var reader = new FileReader()
    var file = document.getElementById("file")
    reader.readAsDataURL(file.files[0])
    reader.onload = function () {
        self.contract = this.result
        self.filename = file.files[0].name
        self.status = 1
    }
}
```

来源：`frontend/html/signature.html` 第 121-123 行

```javascript
upload() {
    this.$refs.file.click()
}
```

来源：`frontend/html/signature.html` 第 78 行

```html
<input type="file" id="file" @change="change" ref="file" style="display: none;"/>
```

## 实际应用场景

- 图片上传预览
- 文件内容读取
- 文档上传前的本地预览
- 文件拖拽上传

## 注意事项

- FileReader 是异步操作，必须在 `onload` 回调中获取结果
- `readAsDataURL` 会将文件内容转为 Base64，大文件可能导致性能问题
- 在 Vue 的 methods 中使用 `var self = this` 保存 Vue 实例引用（因为 `onload` 中的 `this` 指向 FileReader 实例）

## 常见误区

- 误区：在 `onload` 外部访问 `reader.result`
- 误区：忘记在回调中使用 `self` 或箭头函数来访问 Vue 实例

## 关联知识点

- [Canvas API](/knowledge/canvas-api)
- [Vue 事件处理](/knowledge/vue-event-handling)
- [DOM 操作](/knowledge/dom-manipulation)

## 资料来源

- 来源文件：`frontend/html/signature.html` 第 107-123 行
- 来源文件：`frontend/html/verify.html` 第 133-144 行

## 官方资源扩展

- [MDN - FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
- 详细介绍 FileReader 的所有读取方法和事件