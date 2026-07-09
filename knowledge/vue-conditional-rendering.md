<!-- 知识点名称 -->
# Vue 条件渲染

<!-- 知识简介 -->
Vue 提供 `v-show` 和 `v-if` 指令根据条件控制元素的显示与隐藏。

<!-- 核心概念 -->
- `v-show`：通过 CSS `display` 属性控制显示隐藏
- `v-if`：通过 DOM 的创建和销毁控制显示隐藏
- `v-show` 切换开销小，`v-if` 初始渲染开销小

<!-- 详细讲解 -->
在项目中，`v-show` 用于控制提示消息的显示。登录页面的提示消息在表单验证失败时显示，1秒后自动隐藏：

```html
<div class="alert alert-success" v-show="tip" role="alert">{{msg}}</div>
```

对应的 JavaScript 逻辑：
```javascript
data: {
    tip: false,
    msg: ""
},
methods: {
    submit() {
        if (this.user.username == '') {
            this.msg = "用户名不能为空"
            this.tip = true
            setTimeout(() => { this.tip = false }, 1000)
        }
    }
}
```

在签章页面中，`v-show` 用于切换上传前后的图片显示：
```html
<img v-show="demoImg" src="../images/contract.jpg" @click="upload" />
<img v-show="posterImg" :src="contract" alt="合约" />
```

<!-- 重点内容 -->
- `v-show` 适合频繁切换的场景
- `v-if` 适合条件很少改变的场景
- `v-show` 不支持 `template` 元素

<!-- 关键代码示例 -->
示例来源：通用训练工程抽象
```html
<img v-show="demoImg" src="../images/contract.jpg" style="width: 800px;opacity: 0.3;" @click="upload" />
<img v-show="posterImg" :src="contract" alt="合约" />
```

示例来源：通用训练工程抽象
```html
<div class="alert alert-success" v-show="tip" role="alert">{{msg}}</div>
```

<!-- 实际应用场景 -->
- 提示消息的显示和隐藏
- 加载状态的切换
- 表单验证错误提示
- 图片上传前后的预览切换

<!-- 注意事项 -->
- `v-show` 不支持 `<template>` 元素
- 不要在同一元素上同时使用 `v-if` 和 `v-for`（Vue 2 中 `v-for` 优先级更高）

<!-- 常见误区 -->
- 误区：总是使用 `v-show` 而不是根据场景选择 `v-if`
- 误区：在需要频繁切换时使用 `v-if`

<!-- 关联知识点 -->
- [列表渲染](/knowledge/vue-list-rendering)
- [模板语法](/knowledge/vue-template-syntax)

<!-- 资料来源 -->
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 条件渲染](https://v2.vuejs.org/v2/guide/conditional.html)
- 详细介绍 v-if、v-else、v-show 的用法