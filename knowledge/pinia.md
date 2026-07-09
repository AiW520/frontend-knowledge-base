# Pinia 状态管理

## 知识简介

Pinia 是 Vue 3 官方推荐的状态管理库，替代 Vuex。通过 `defineStore()` 定义 store，提供 `state`、`getters`、`actions`，配合 `pinia-plugin-persistedstate` 插件可实现状态持久化。

## 核心概念

- **`defineStore(id, options)`**：定义 store，返回一个 useStore 函数
- **`state`**：返回初始状态的函数（类似 Vuex 的 state）
- **`getters`**：计算属性（类似 Vuex 的 getters）
- **`actions`**：支持同步/异步的方法（类似 Vuex 的 mutations + actions 合并）
- **`persist: true`**：开启状态持久化（需安装插件）

## 详细讲解

Vue3 项目级训练工程使用 Pinia 替代 Vuex，管理全局用户信息和 loading 状态。

项目中的 store 配置（`src/store/index.ts`）使用 `createPinia()` 创建 Pinia 实例，并通过 `piniaPluginPersistedstate` 插件实现持久化，用户信息会保存在 localStorage/sessionStorage 中。

Pinia 相比 Vuex 的优势：
- **更简洁**：无需 mutations，actions 直接修改 state
- **TypeScript 支持更好**：完整的类型推断
- **模块化**：每个 store 独立，无需 modules 嵌套
- **持久化插件**：一行配置 `persist: true` 即可

项目中 `appStore` 的 `getInfo()` action 通过调用后端 API 获取用户信息，同时将信息同步到 sessionStorage 作为备份。

## 重点内容

- Pinia 没有 mutations，直接在 actions 中修改 state
- 使用 `storeToRefs()` 解构保持响应式
- `persist: true` 需安装 `pinia-plugin-persistedstate`
- 支持 `$patch` 批量更新、`$reset` 重置状态

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
import { defineStore } from 'pinia'

export default defineStore({
  id: 'appStore',
  state: () => ({
    userinfo: {},
    globalLoading: false
  }),
  getters: {},
  actions: {
    setGlobalLoading(payload) {
      this.globalLoading = payload
    },
    resetState() {
      this.userinfo = {}
      this.globalLoading = false
    },
    async getInfo() {
      const params = { uriCode: 'API002' }
      const res = await Fetch(params)
      this.userinfo = res.data
      sessionStorage.setItem('userinfo', JSON.stringify(this.userinfo))
    }
  },
  persist: true
})
```

示例来源：通用训练工程抽象

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)
export default store
```

## 实际应用场景

- 全局用户信息管理（登录状态、个人信息）
- 全局加载状态管理
- 跨组件/跨页面共享的状态
- 需要持久化的状态（如：主题偏好、语言设置）

## 注意事项

- `persist` 默认存入 localStorage，可配置为 sessionStorage
- actions 可以是异步函数，返回 Promise
- 组件中使用 store 时，直接修改 `state` 也是响应式的
- Pinia 支持 devtools 调试

## 常见误区

- 误区：在 Pinia 中寻找 mutations（Pinia 没有 mutations 概念）
- 误区：将 store 实例解构后失去响应式（需用 `storeToRefs()`）
- 误区：所有状态都放 store 中（仅共享状态需要）

## 关联知识点

- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [Vue 3 &lt;script setup&gt;](/knowledge/vue3-script-setup)
- [axios 高级封装](/knowledge/axios-advanced)
- [前端工具函数](/knowledge/frontend-utils)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（Pinia 实例创建与持久化插件配置）
- 示例来源：通用训练工程抽象（appStore 定义）
- 示例来源：通用训练工程抽象（类型定义）
- 示例来源：通用训练工程抽象（Pinia 注册到 Vue）
- 示例来源：通用训练工程抽象（store 使用示例）

## 官方资源扩展

- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- Pinia 官方中文文档，包含完整的入门教程和 API 参考
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- 状态持久化插件的官方文档