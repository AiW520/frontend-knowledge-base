<!-- 知识点名称 -->
# Vue 实例创建

<!-- 知识简介 -->
Vue 实例是 Vue 应用的根对象，通过 `new Vue()` 创建，管理应用的数据、方法和生命周期。

<!-- 核心概念 -->
- `el`：指定 Vue 实例挂载的 DOM 元素
- `data`：响应式数据对象
- `methods`：定义事件处理函数
- `mounted`：生命周期钩子，DOM 渲染完成后执行

<!-- 详细讲解 -->
Vue 实例是 Vue 应用的核心。在项目中，每个页面都通过 `new Vue({...})` 创建独立的 Vue 实例来管理页面状态。

在电子签章系统登录页面中（`frontend/html/login.html`），Vue 实例的创建方式：
```javascript
new Vue({
    el: '#app',
    data: {
        user: { username: "", password: "" },
        tip: false,
        msg: ""
    },
    methods: { submit() { ... } }
})
```

在供应链金融应用中（`供应链—front/src/main.js`），Vue 实例通过 Vue CLI 项目方式创建，结合了路由和插件系统：
```javascript
new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
```

两种创建方式的主要区别：
- CDN 方式使用 `el` 指定挂载点
- Vue CLI 方式使用 `$mount('#app')` 挂载，支持 `render` 函数渲染根组件

<!-- 重点内容 -->
- `el` 的值是 CSS 选择器字符串，如 `'#app'`
- `data` 中存储的数据是响应式的，修改后视图自动更新
- `methods` 中定义的方法可以通过 `this.xxx` 访问 data 中的数据

<!-- 关键代码示例 -->
来源：`frontend/html/login.html` 第 48-98 行
```javascript
new Vue({
    el: '#app',
    data: {
        user: { username: "", password: "" },
        tip: false,
        msg: ""
    },
    methods: {
        submit() {
            if (this.user.username == '') {
                this.msg = "用户名不能为空"
                this.tip = true
                setTimeout(() => { this.tip = false }, 1000)
                return
            }
            axios.post("http://localhost/user/login", this.user).then(response => {
                if (response.data.resultCode == 200) {
                    localStorage.setItem('Authorization', response.data.data)
                    window.location.href = "main.html"
                }
            })
        }
    }
})
```

<!-- 实际应用场景 -->
- 每个页面创建一个 Vue 实例管理该页面的状态
- 在单页应用中，根实例管理整个应用

<!-- 注意事项 -->
- 一个页面通常只需要一个 Vue 实例
- `data` 中的属性必须在创建实例时声明，后续动态添加的属性不是响应式的
- 在 `methods` 中访问 `data` 需要使用 `this`

<!-- 常见误区 -->
- 误区：在 `data` 外部直接给 Vue 实例添加属性
- 误区：忘记使用 `this` 访问 data 中的数据

<!-- 关联知识点 -->
- [模板语法](/knowledge/vue-template-syntax)
- [数据绑定](/knowledge/vue-data-binding)
- [生命周期](/knowledge/vue-lifecycle)

<!-- 资料来源 -->
- 来源文件：`frontend/html/login.html`、`frontend/html/register.html`、`frontend/html/account.html`
- 来源文件：`供应链—front/src/main.js`

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - Vue 实例](https://v2.vuejs.org/v2/guide/instance.html)
- 官方对 Vue 实例的完整说明，包括实例属性和方法