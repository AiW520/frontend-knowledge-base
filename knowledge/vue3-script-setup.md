# Vue 3 script setup 语法糖

## 知识简介

`script setup` 是 Vue 3 单文件组件（SFC）中的编译时语法糖，在 `script` 标签中添加 `setup` 属性后，组件会自动将顶层变量/导入暴露给模板，无需手动 `return`。

## 核心概念

- **自动暴露**：`script setup` 中的顶层绑定自动暴露给模板
- **无需 `components` 注册**：导入的组件可直接使用
- **`defineProps()` / `defineEmits()`**：声明式定义 props 和 emits
- **`useRoute()` / `useRouter()`**：Vue Router 的组合式 API

## 详细讲解

Vue3 项目级训练工程中全面使用了 `script setup` 语法糖，这是现代 Vue 3 项目的标准写法。

在 `script setup` 中：
- 导入的组件自动注册，无需 `components` 选项
- 顶层变量（ref、reactive、computed 等）直接可在模板中使用
- `import` 导入的函数（如 `useRouter`）直接可用
- 代码更简洁，减少了样板代码

项目中的路由配置使用 `defineAsyncComponent` 配合动态 `import()` 实现懒加载：
```javascript
component: () => import('../views/home/index.vue')
```

而 `script setup` 使组件内部代码非常简洁：

```ts
import { ref, computed } from 'vue'
const collapsed = ref(false)
const showSider = computed(() => route.name !== 'login')
```

> 注：以上代码写在 `&lt;script lang="ts" setup&gt;` 标签内

## 重点内容

- `script setup` 是推荐的写法，性能优于普通 `script`
- 无需 `export default`，无需 `setup()` 函数
- `defineProps` 和 `defineEmits` 是编译器宏，无需导入
- 可以与普通 `script` 标签共存（用于需要 `inheritAttrs` 等场景）

## 关键代码示例

示例来源：通用训练工程抽象

```ts
import { useRouter, useRoute } from "vue-router"
import { ref, computed, onMounted, watch } from 'vue'
import appStore from '@/store/app'

const router = useRouter()
const route = useRoute()
const store = appStore()

const collapsed = ref(false)
const showUserMenu = ref(false)

const showSider = computed(() => route.name !== 'login')

const onMenuClick = (e) => {
  if (e?.key) router.push({ name: e.key })
}

// 组件挂载时初始化
onMounted(async () => {
  await initUserInfo()
})

// 监听路由变化
watch(() => route.name, async (newVal) => {
  if (newVal && newVal !== 'login') {
    await initUserInfo()
  }
}, { deep: true })
```

## 实际应用场景

- 所有 Vue 3 单文件组件（推荐默认使用）
- 需要访问路由参数的组件
- 组合式状态管理的组件

## 注意事项

- `script setup` 中的代码在每次组件实例创建时执行
- 与 TypeScript 配合时使用 `lang="ts" setup`
- `defineProps` 和 `defineEmits` 不需要从 vue 导入

## 常见误区

- 误区：在 `&lt;script setup&gt;` 中写 `export default`
- 误区：手动 `import { defineProps } from 'vue'`（这是编译器宏）
- 误区：忘记 `.value` 访问 ref 值

## 关联知识点

- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [Pinia 状态管理](/knowledge/pinia)
- [Vue Router 4](/knowledge/vue-router4)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（完整 script setup 示例）
- 示例来源：通用训练工程抽象（watch、useRoute）
- 示例来源：通用训练工程抽象（组件导入）
- 示例来源：通用训练工程抽象（组件导入）

## 官方资源扩展

- [Vue 3 官方文档 - &lt;script setup&gt;](https://cn.vuejs.org/api/sfc-script-setup.html)
- 官方对 script setup 语法的完整说明
- [Vue 3 SFC 语法规范](https://cn.vuejs.org/api/sfc-spec.html)
- 单文件组件的完整语法规范