<!-- 知识点名称 -->
# Vue 数据绑定

<!-- 知识简介 -->
Vue 通过 `v-model` 指令实现表单元素与数据之间的双向绑定，数据变化时视图自动更新，用户输入时数据自动更新。

<!-- 核心概念 -->
- 单向绑定：data → 视图（通过 `{{ }}` 或 `v-bind`）
- 双向绑定：data ↔ 视图（通过 `v-model`）
- 响应式原理：Vue 通过 Object.defineProperty 劫持数据

<!-- 详细讲解 -->
在项目中，`v-model` 广泛应用于表单输入。登录页面的用户名和密码输入框使用 `v-model` 绑定到 `user.username` 和 `user.password`：

```html
<input type="text" class="form-control" placeholder="用户名" 
    v-model="user.username">
<input type="password" class="form-control" placeholder="密码" 
    v-model="user.password">
```

当用户输入内容时，`user.username` 和 `user.password` 自动更新；当 JavaScript 中修改这些值时，输入框内容也会自动更新。

在表单提交时，可以直接使用 `this.user` 对象发送请求：
```javascript
axios.post("http://localhost/user/login", this.user).then(response => { ... })
```

<!-- 重点内容 -->
- `v-model` 用于表单元素（input、textarea、select）
- 双向绑定让数据获取更加简洁
- 数据驱动视图，避免手动操作 DOM

<!-- 关键代码示例 -->
来源：`frontend/html/register.html` 第 32-63 行
```html
<input type="text" class="form-control" placeholder="用户名(必填)" 
    v-model="user.username">
<input type="password" class="form-control" placeholder="密码(必填)" 
    v-model="user.password">
<input type="text" class="form-control" placeholder="区块链账户地址(必填)" 
    v-model="user.chainAccount">
```

<!-- 实际应用场景 -->
- 登录、注册表单的输入框
- 搜索框的实时搜索
- 下拉框选项绑定

<!-- 注意事项 -->
- `v-model` 会忽略表单元素的 `value`、`checked`、`selected` 初始值
- 多个复选框需要绑定到同一个数组
- `v-model` 修饰符：`.lazy`（change 事件）、`.number`（转为数字）、`.trim`（去除空格）

<!-- 常见误区 -->
- 误区：在组件上使用 `v-model` 时忘记了组件需要接收 `value` prop 和触发 `input` 事件
- 误区：认为 `v-model` 只能用 `v-bind` + `v-on` 替代，忽略了它的便捷性

<!-- 关联知识点 -->
- [Vue 实例创建](/knowledge/vue-instance)
- [模板语法](/knowledge/vue-template-syntax)
- [事件处理](/knowledge/vue-event-handling)

<!-- 资料来源 -->
- 来源文件：`frontend/html/login.html`
- 来源文件：`frontend/html/register.html`
- 来源文件：`供应链—front/src/views/Login.vue`

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 表单输入绑定](https://v2.vuejs.org/v2/guide/forms.html)
- 详细说明 v-model 的各种用法和修饰符