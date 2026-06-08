# Vue Router 4

## 知识简介

Vue Router 4 是 Vue 3 的官方路由库，支持组合式 API、动态路由、路由守卫、懒加载等特性。jinzhuan-project-web 项目使用 Vue Router 4 实现页面导航和权限控制。

## 核心概念

- **`createRouter()`**：创建路由实例
- **`createWebHistory()`**：HTML5 History 模式
- **路由懒加载**：`component: () => import('../views/home/index.vue')`
- **路由元信息**：`meta` 字段存储路由配置
- **`useRouter()` / `useRoute()`**：组合式 API 访问路由
- **导航守卫**：全局前置守卫 `beforeEach`

## 详细讲解

在 jinzhuan-project-web 项目中，Vue Router 4 用于：

**1. 路由定义**：使用 TypeScript 的 `RouteRecordRaw` 类型
```typescript
const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: () => import('../components/Layout/layout.vue'),
    children: [
      { path: '/login', name: 'login', component: () => import('../views/login/index.vue') },
      { path: '', name: 'home', component: () => import('../views/home/index.vue') }
    ]
  }
]
```

**2. 权限控制**：通过 `meta.requiredRole` 定义页面需要的角色
```typescript
meta: {
  requiredRole: ['admin']
}
```

**3. 404 处理**：`catch-all` 路由重定向到首页
```typescript
{ path: '/:pathMatch(.*)*', redirect: '/' }
```

**4. 路由懒加载**：`component: () => import(...)` 语法，打包时自动代码分割

## 重点内容

- `createWebHistory` vs `createWebHashHistory`（URL 中 `#` 的区别）
- 动态路由参数：`/group-detail/:id`
- `useRoute()` 获取当前路由信息（params、query、name）
- `useRouter()` 获取路由实例（push、replace、go）
- 嵌套路由通过 `children` 配置

## 关键代码示例

来源：`jinzhuan-project-web/src/router/index.ts`

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    component: () => import('../components/Layout/layout.vue'),
    name: 'Layout',
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue'),
        meta: { requiredLogin: false }
      },
      {
        path: '',
        name: 'home',
        component: () => import('../views/home/index.vue'),
        meta: { requiredLogin: false }
      },
      {
        path: '/chain-manage',
        name: 'chain-manage',
        component: () => import('../views/chain/index.vue'),
        meta: { requiredRole: ['admin'] }
      },
      {
        path: '/group-detail/:id',
        name: 'group-detail',
        component: () => import('../views/group/detail.vue'),
        meta: { requiredRole: ['admin', 'user'] }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes]
})

export default router
```

来源：`jinzhuan-project-web/src/components/Layout/layout.vue`

```typescript
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const onMenuClick = (e) => {
  if (e?.key) router.push({ name: e.key })
}

// 监听路由变化
watch(() => route.name, (newVal) => {
  if (newVal && newVal !== 'login') {
    initUserInfo()
  }
})
```

## 实际应用场景

- 单页应用（SPA）的页面导航
- 基于角色的权限控制
- 面包屑导航
- 页面缓存（keep-alive 配合路由）

## 注意事项

- Vue 3 使用 Vue Router 4（API 与 v3 不同）
- `<router-view>` 组件用于渲染匹配的路由
- `params` 变化不会触发组件重新创建（使用 `watch` 监听）
- History 模式需服务器配置回退（否则刷新会 404）

## 常见误区

- 误区：混淆 Vue Router 3（Vue 2）和 Vue Router 4（Vue 3）的 API
- 误区：在路由跳转前忘记检查 token（应该有全局导航守卫）
- 误区：使用 `$route` 和 `$router`（Vue 3 推荐用 `useRoute()` 和 `useRouter()`）

## 关联知识点

- [Vue Router（Vue 2）](/knowledge/vue-router)
- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [Vue 3 &lt;script setup&gt;](/knowledge/vue3-script-setup)

## 资料来源

- 来源项目：`新前端资源/jinzhuan-project-web/`
- 来源文件：`src/router/index.ts`（路由配置）
- 来源文件：`src/components/Layout/layout.vue`（useRouter/useRoute 使用）
- 来源文件：`src/main.ts`（路由器注册）

## 官方资源扩展

- [Vue Router 4 官方文档](https://router.vuejs.org/zh/)
- Vue Router 4 官方中文文档，包含路由配置、导航守卫、懒加载等完整指南
- [Vue Router 4 API 参考](https://router.vuejs.org/zh/api/)
- Vue Router 4 的完整 API 参考