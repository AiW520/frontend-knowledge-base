<!-- 知识点名称 -->
# Vue Router 路由

<!-- 知识简介 -->
Vue Router 是 Vue.js 的官方路由管理器，用于构建单页应用（SPA），实现页面跳转而不刷新整个页面。

<!-- 核心概念 -->
- 路由配置：定义路径与组件的映射关系
- `router-view`：路由匹配到的组件渲染位置
- 编程式导航：`$router.push()` 进行页面跳转
- 声明式导航：`<router-link>` 组件

<!-- 详细讲解 -->
在供应链金融项目中，路由配置定义在 `router.js` 中：

```javascript
export default [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/company', component: Company },
    { path: '/bank', component: Bank },
    { path: '/individual', component: Individual }
]
```

在 `main.js` 中创建 Router 实例并挂载：
```javascript
const router = new VueRouter({ routes })
new Vue({ router: router, render: h => h(App) }).$mount('#app')
```

在组件中使用编程式导航进行页面跳转：
```javascript
// 登录成功后跳转到首页
this.$router.push('/home')

// 跳转到登录页
this.$router.push('/login')
```

<!-- 重点内容 -->
- 路由配置通过 `path` 和 `component` 定义映射
- `redirect` 实现路由重定向
- `router-view` 是路由组件的出口
- `$router.push()` 和 `$router.replace()` 的区别

<!-- 关键代码示例 -->
来源：`供应链—front/src/router.js` 第 1-42 行
```javascript
import Home from '@/views/Home';
import Login from '@/views/Login';
import Register from '@/views/Register'
import Company from '@/views/Company'
import Bank from '@/views/Bank'
import Individual from "@/views/Individual";

export default [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/company', component: Company },
    { path: '/bank', component: Bank },
    { path: '/individual', component: Individual }
]
```

来源：`供应链—front/src/main.js` 第 22-24 行
```javascript
const router = new VueRouter({ routes })
new Vue({ router: router, render: h => h(App) }).$mount('#app')
```

来源：`供应链—front/src/components/Header.vue` 第 29 行
```javascript
this.$router.push("/login")
```

<!-- 实际应用场景 -->
- 单页应用页面跳转
- 登录后跳转到主页
- 导航菜单切换页面
- 未登录时重定向到登录页

<!-- 注意事项 -->
- 路由配置中 `path` 不加 `/` 前缀时，会被解析为相对路径
- `$router.push()` 会向 history 添加新记录
- `$router.replace()` 不会添加历史记录

<!-- 常见误区 -->
- 误区：混淆 `$router` 和 `$route`（`$router` 是路由实例，`$route` 是当前路由对象）
- 误区：在 CDN 模式下使用 Vue Router（需要额外引入 vue-router.js）

<!-- 关联知识点 -->
- [Vue 组件注册](/knowledge/vue-component)
- [Vue 实例创建](/knowledge/vue-instance)
- [Vue CLI 代理](/knowledge/vue-cli-proxy)

<!-- 资料来源 -->
- 来源文件：`供应链—front/src/router.js`
- 来源文件：`供应链—front/src/main.js`
- 来源文件：`供应链—front/src/components/Header.vue`
- 来源文件：`供应链—front/src/components/Navigator.vue`

<!-- 官方资源扩展 -->
- [Vue Router 官方文档](https://v3.router.vuejs.org/zh/)
- 详细介绍路由配置、导航守卫、动态路由等