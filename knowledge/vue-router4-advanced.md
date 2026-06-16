# Vue Router 4 路由管理与权限控制

## 知识简介

Vue Router 4 是 Vue 3 的官方路由管理器，在区块链应用平台中用于管理页面导航、路由参数传递和权限控制。金砖大赛的前端开发中，需要实现多页面路由（仪表盘、区块浏览、交易记录、合约管理等），并可能需要根据用户角色（如管理员、普通用户）进行路由权限控制。

## 核心概念

- **Vue Router 4**：Vue 3 官方路由库，支持 Composition API
- **动态路由**：根据用户权限动态添加路由
- **导航守卫**：`beforeEach` 全局守卫，用于权限验证和登录拦截
- **路由懒加载**：`() => import()` 动态导入页面组件，优化首屏加载
- **路由元信息**：`meta` 字段存储路由配置（标题、权限、图标等）

## 详细讲解

### 1. 路由配置（src/router/index.ts）

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 静态路由（无需权限）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404', hidden: true }
  }
]

// 动态路由（需要权限）
const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '仪表盘',
      icon: 'DataBoard',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/blocks',
    name: 'BlockExplorer',
    component: () => import('@/views/BlockExplorer.vue'),
    meta: {
      title: '区块浏览',
      icon: 'Box',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/blocks/:blockHash',
    name: 'BlockDetail',
    component: () => import('@/views/BlockDetail.vue'),
    meta: {
      title: '区块详情',
      hidden: true  // 不在侧边栏显示
    },
    props: true  // 将路由参数作为 props 传入组件
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('@/views/Transactions.vue'),
    meta: {
      title: '交易记录',
      icon: 'List',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/contracts',
    name: 'Contracts',
    component: () => import('@/views/Contracts.vue'),
    meta: {
      title: '合约管理',
      icon: 'Document',
      roles: ['admin']  // 仅管理员可访问
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

export { constantRoutes, asyncRoutes }
export default router
```

### 2. 导航守卫（权限控制）

```typescript
// src/router/guard.ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

const whiteList = ['/login', '/404']  // 白名单路由

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 设置页面标题
    document.title = `${to.meta.title || '区块链平台'} - 金砖大赛`

    const userStore = useUserStore()

    if (userStore.token) {
      // 已登录
      if (to.path === '/login') {
        next('/dashboard')  // 已登录用户访问登录页，重定向到首页
      } else {
        // 检查权限
        if (to.meta.roles) {
          const hasRole = (to.meta.roles as string[]).includes(userStore.role)
          if (hasRole) {
            next()
          } else {
            next('/403')  // 无权限页面
          }
        } else {
          next()
        }
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)  // 重定向到登录页并携带目标路径
      }
    }
  })
}
```

### 3. main.ts 中注册

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupRouterGuard } from './router/guard'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册路由守卫
setupRouterGuard(router)

app.mount('#app')
```

### 4. 组件中使用路由

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 编程式导航：跳转到区块详情
const viewBlockDetail = (blockHash: string) => {
  router.push({
    name: 'BlockDetail',
    params: { blockHash }
  })
}

// 获取路由参数
const blockHash = route.params.blockHash as string

// 获取查询参数
const txHash = route.query.txHash as string
</script>
```

## 重点内容

- **路由懒加载**：`() => import()` 实现代码分割，比赛项目页面较多时能提升加载速度
- **导航守卫**：`beforeEach` 是实现权限控制的核心，需在路由实例创建后立即注册
- **动态路由参数**：`/blocks/:blockHash` 用冒号定义参数，通过 `route.params` 获取
- **路由元信息**：`meta` 字段可存储任意数据，用于侧边栏渲染、权限判断、页面标题等

## 实际应用场景

- 区块链应用通常有多个功能页面，需要路由管理
- 管理员页面需要权限控制，普通用户不能访问合约管理
- 交易详情、区块详情等页面通过路由参数传递 hash 值
- 登录后根据用户角色动态生成菜单

## 注意事项

- Vue Router 4 使用 `createWebHistory` 需要服务器配置 URL 重写（Nginx 配置 `try_files`）
- 导航守卫中 `next()` 调用必须确保只执行一次
- 动态路由参数变化时，组件默认不会重新创建，需要 `watch` 路由参数变化来刷新数据
- `router.push` 的 `params` 与 `path` 不能同时使用

## 常见误区

- 误区：在 `vite.config.ts` 中设置了 `base` 但路由没配置对应 base
- 误区：导航守卫中忘记处理 `next()` 导致页面卡住
- 误区：TypeScript 中使用 `route.params` 时忘记类型断言

## 关联知识点

- [Vue 3 + TS 项目搭建](/knowledge/vue3-ts-project-setup)
- [Pinia 状态管理](/knowledge/pinia)
- [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation)

## 官方资源扩展

- [Vue Router 4 官方文档](https://router.vuejs.org/zh/) - Vue Router 最权威的官方学习资源
- [Vue Router 4 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html) - 完整的导航守卫解析
- [Vue Router 4 路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html) - 官方懒加载指南
- [Vue Router 4 动态路由](https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html) - 动态添加路由的最佳实践