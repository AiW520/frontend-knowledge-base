<!-- 知识点名称 -->
# Vue 模板语法

<!-- 知识简介 -->
Vue 使用基于 HTML 的模板语法，允许将 DOM 元素与 Vue 实例的数据进行绑定。

<!-- 核心概念 -->
- 插值表达式：`{{ }}` 将数据显示在页面中
- 指令：以 `v-` 开头的特殊属性
- 属性绑定：`v-bind:` 或 `:`
- 事件绑定：`v-on:` 或 `@`

<!-- 详细讲解 -->
在项目中广泛应用了 Vue 模板语法。插值表达式 `{{ }}` 用于输出 data 中的数据，如显示用户名、消息提示等。

`v-model` 指令实现表单元素与 data 的双向绑定，用户在输入框中输入内容时，data 中的对应数据会自动更新。

`v-show` 指令根据条件控制元素的显示与隐藏，如登录页面的提示消息：
```html
<div class="alert alert-success" v-show="tip" role="alert">{{msg}}</div>
```

`v-for` 指令用于列表渲染，遍历数组数据：
```html
<tr v-for="(record,index) of records" :key="index">
    <td>{{record.id}}</td>
    <td>{{record.filename}}</td>
</tr>
```

<!-- 重点内容 -->
- `{{ }}` 只能用于元素内容，不能用于属性
- `v-model` 实现表单双向绑定
- `v-show` 通过 CSS display 控制显示隐藏
- `v-for` 必须绑定 `:key`
- `@click` 是 `v-on:click` 的简写

<!-- 关键代码示例 -->
来源：`frontend/html/record.html` 第 70-96 行
```html
<tr v-for="(record,index) of records" :key="index">
    <td>{{record.id}}</td>
    <td>{{record.filename}}</td>
    <td>{{record.type}}</td>
    <td>{{record.code}}</td>
    <td>{{record.datetime}}</td>
    <td><button class="btn btn-primary" data-toggle="modal" 
        :data-target="'#'+record.code">查看</button></td>
</tr>
```

<!-- 实际应用场景 -->
- 动态显示用户名、提示消息
- 渲染表格数据列表
- 控制错误提示的显示与隐藏

<!-- 注意事项 -->
- `v-for` 必须配合 `:key` 使用，key 值应唯一
- `v-show` 不支持 `<template>` 元素
- 模板中只能使用单个表达式，不能使用语句

<!-- 常见误区 -->
- 误区：在 `{{ }}` 中编写复杂的 JavaScript 逻辑
- 误区：`v-for` 和 `v-if` 同时使用在同一元素上（Vue 2 中 `v-for` 优先级更高）

<!-- 关联知识点 -->
- [数据绑定](/knowledge/vue-data-binding)
- [条件渲染](/knowledge/vue-conditional-rendering)
- [列表渲染](/knowledge/vue-list-rendering)

<!-- 资料来源 -->
- 来源文件：`frontend/html/login.html`、`frontend/html/record.html`、`frontend/html/account.html`
- 来源文件：`供应链—front/src/views/Home.vue`

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 模板语法](https://v2.vuejs.org/v2/guide/syntax.html)
- 详细介绍插值、指令和缩写