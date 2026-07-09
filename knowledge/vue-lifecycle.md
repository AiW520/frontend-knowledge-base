<!-- 知识点名称 -->
# Vue 生命周期

<!-- 知识简介 -->
Vue 实例从创建到销毁会经历一系列生命周期阶段，每个阶段提供对应的钩子函数，用于在特定时机执行代码。

<!-- 核心概念 -->
- `mounted`：DOM 渲染完成后执行，常用于初始化数据请求
- `created`：实例创建完成后执行，可访问 data 和 methods
- `beforeDestroy`：实例销毁前执行，用于清理定时器等

<!-- 详细讲解 -->
在项目中，最常用的生命周期钩子是 `mounted`。几乎所有页面都在 `mounted` 中执行数据初始化请求。

Vue2 业务演示项目账户信息页面（`frontend/html/account.html`）：
```javascript
mounted() {
    // 请求拦截器
    axios.interceptors.request.use(request => {
        request.headers.Authorization = localStorage.getItem("Authorization")
        return request
    })
    // 响应拦截器
    axios.interceptors.response.use(response => {
        if (response.data.resultCode == 401) {
            window.location.href = "login.html"
        }
        return response
    })
    // 获取用户信息
    axios.get("http://localhost/user/info").then(response => {
        if (response.data.resultCode == 200) {
            this.user = response.data.data
        }
    })
}
```

`created` 钩子用于实例创建后的初始化：
```javascript
created() {
    console.log("******* in home ******")
    console.log(this.$cookies.get("token"))
}
```

<!-- 重点内容 -->
- `mounted` 是最常用的钩子，用于初始化数据
- `created` 中无法访问 DOM 元素
- 生命周期钩子中 `this` 指向 Vue 实例

<!-- 关键代码示例 -->
示例来源：通用训练工程抽象
```javascript
mounted() {
    axios.interceptors.request.use(request => {
        request.headers.Authorization = localStorage.getItem("Authorization")
        return request
    })
    axios.interceptors.response.use(response => {
        if (response.data.resultCode == 401) {
            window.location.href = "login.html"
        }
        return response
    })
    axios.get("http://localhost/user/info").then(response => {
        if (response.data.resultCode == 200) {
            this.user = response.data.data
        }
    })
}
```

<!-- 实际应用场景 -->
- 页面加载时获取数据
- 初始化第三方插件
- 设置定时器
- 配置拦截器

<!-- 注意事项 -->
- 不要在 `mounted` 中使用箭头函数（与官方文档建议一致）
- `created` 中无法访问 `$refs`
- 服务器端渲染（SSR）时不触发 `mounted`

<!-- 常见误区 -->
- 误区：在 `created` 中操作 DOM
- 误区：忘记在 `beforeDestroy` 中清理定时器和事件监听

<!-- 关联知识点 -->
- [Vue 实例创建](/knowledge/vue-instance)
- [axios 拦截器](/knowledge/axios-interceptors)
- [axios HTTP 请求](/knowledge/axios-http)

<!-- 资料来源 -->
- 示例来源：通用训练工程抽象、`frontend/html/record.html`、`frontend/html/myseal.html`
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 生命周期](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- 包含完整的生命周期图示，清晰展示各阶段钩子