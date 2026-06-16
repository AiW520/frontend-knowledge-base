# Vue Router 4 路由导航

## 竞赛关联

比赛常考路由相关操作：登录成功后跳转到首页、页面间参数传递、路由重定向。选手需要掌握 Vue Router 4 的核心 API 和编程式导航方法。

## 核心技能

- **编程式导航**：`router.push()` / `router.replace()` 跳转页面
- **路由参数传递**：`params` 和 `query` 两种方式
- **路由重定向**：登录后跳转到之前访问的页面
- **动态路由匹配**：`/detail/:id` 获取路径参数
- **导航守卫**：`beforeEach` 实现登录拦截

## 详细讲解

### 1. 路由配置

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/Index.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@/views/Detail.vue'),
    meta: { title: '详情', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 2. 编程式导航（核心考核点）

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 方式一：通过路径跳转
const goToIndex = () => {
  router.push('/index')
}

// 方式二：通过命名路由跳转（推荐）
const goToDetail = (id: number) => {
  router.push({
    name: 'Detail',
    params: { id }
  })
}

// 方式三：带查询参数跳转
const goToSearch = (keyword: string) => {
  router.push({
    path: '/index',
    query: { keyword }
  })
}

// 方式四：替换当前路由（不产生历史记录）
const goToLogin = () => {
  router.replace('/login')
}
</script>
```

### 3. 获取路由参数

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()

// 获取路径参数 /detail/:id
const detailId = route.params.id as string

// 获取查询参数 /index?keyword=xxx
const keyword = route.query.keyword as string

// 在页面加载时根据参数获取数据
onMounted(() => {
  if (detailId) {
    fetchDetail(detailId)
  }
})
</script>
```

### 4. 登录重定向（常见考点）

```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleLoginSuccess = () => {
  // 获取登录前尝试访问的页面
  const redirect = route.query.redirect as string

  // 如果存在重定向地址，跳转到目标页面；否则跳转到首页
  router.push(redirect || '/index')
}
</script>
```

### 5. 导航守卫（登录拦截）

```typescript
// src/router/guard.ts
import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'

const whiteList = ['/login']  // 白名单：不需要登录的页面

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title as string || '系统'

    const token = localStorage.getItem('token')

    if (token) {
      // 已登录，访问登录页则重定向到首页
      if (to.path === '/login') {
        next('/index')
      } else {
        next()
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next()
      } else {
        // 跳转到登录页，并携带当前路径作为重定向参数
        next(`/login?redirect=${to.path}`)
        ElMessage.warning('请先登录')
      }
    }
  })
}
```

## 重点内容

- `router.push({ name: 'Detail', params: { id } })` 命名路由跳转，推荐方式
- `params` 和 `path` 不能同时使用，要用 `params` 必须使用 `name`
- 获取 `params` 用 `route.params.xxx`，获取 `query` 用 `route.query.xxx`
- 登录重定向：`router.push(route.query.redirect || '/index')`
- 动态路由 `/detail/:id` 匹配所有路径，通过 `route.params.id` 获取

## 注意事项

- `createWebHistory()` 需要后端配置 fallback 到 index.html
- `router.push` 返回 Promise，可以在 `await` 后处理导航结果
- `params` 参数变化时，组件不会重新创建，需要用 `watch` 监听变化
- 导航守卫中确保 `next()` 只调用一次

## 常见误区

- 误区：`router.push({ path: '/detail', params: { id } })` —— params 与 path 不能共存
- 误区：忘记在 `finally` 中调用 `next()` 导致路由卡住
- 误区：使用 `route.params.id` 时没有做类型断言，TS 报错
- 误区：`route.query` 的值总是 `string | string[]` 类型，需要类型转换

## 官方资源扩展

- [Vue Router 4 官方文档](https://router.vuejs.org/zh/) - 完整中文文档，最权威学习资源
- [Vue Router 编程式导航](https://router.vuejs.org/zh/guide/essentials/navigation.html) - 官方导航指南
- [Vue Router 动态路由](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html) - 路由参数匹配
- [Vue Router 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html) - 完整守卫解析