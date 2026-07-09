<!-- 知识点名称 -->
# Vue 事件处理

<!-- 知识简介 -->
Vue 通过 `v-on` 指令（简写 `@`）监听 DOM 事件，并在事件触发时执行指定的 JavaScript 方法。

<!-- 核心概念 -->
- `v-on:事件名` 或 `@事件名` 绑定事件
- 事件处理函数定义在 `methods` 中
- 通过 `this` 访问 Vue 实例的数据和方法

<!-- 详细讲解 -->
在项目中，事件处理主要用于按钮点击、表单提交等场景。最常用的写法是 `@click="methodName"`。

登录页面的按钮使用 `@click` 绑定提交方法：
```html
<button type="button" class="btn btn-primary form-control" @click="submit">确定</button>
```

在 JavaScript 中定义对应的处理方法：
```javascript
methods: {
    submit() {
        if (this.user.username == '') {
            this.msg = "用户名不能为空"
            this.tip = true
            setTimeout(() => { this.tip = false }, 1000)
            return
        }
        // 发送请求
        axios.post("http://localhost/user/login", this.user).then(response => { ... })
    }
}
```

<!-- 重点内容 -->
- `@click` 是最常用的事件绑定
- 事件处理函数中 `this` 指向 Vue 实例
- 可以在事件处理中修改 data、调用其他方法

<!-- 关键代码示例 -->
示例来源：通用训练工程抽象
```html
<button type="button" class="btn btn-info btn-lg" @click="upload">上传文档</button>
<button type="button" class="btn btn-success btn-lg" @click="signature">文档签章</button>
<button type="button" class="btn btn-primary btn-lg" @click="uploadSeal">签章上链</button>
```

<!-- 实际应用场景 -->
- 登录/注册按钮
- 表单提交
- 文件上传触发
- 导航菜单点击

<!-- 注意事项 -->
- 在 `methods` 中不能使用箭头函数（否则 `this` 不会指向 Vue 实例）
- 事件修饰符：`.stop`（阻止冒泡）、`.prevent`（阻止默认行为）
- `@click` 可以传递参数：`@click="method(arg)"`

<!-- 常见误区 -->
- 误区：在 methods 中使用箭头函数
- 误区：在 `@click` 中直接写复杂逻辑而不提取到 methods

<!-- 关联知识点 -->
- [Vue 实例创建](/knowledge/vue-instance)
- [数据绑定](/knowledge/vue-data-binding)
- [表单验证](/knowledge/form-validation)

<!-- 资料来源 -->
- 示例来源：通用训练工程抽象、`frontend/html/register.html`
- 示例来源：通用训练工程抽象、`frontend/html/verify.html`
- 示例来源：通用训练工程抽象

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 事件处理](https://v2.vuejs.org/v2/guide/events.html)
- 详细介绍事件监听、方法、修饰符