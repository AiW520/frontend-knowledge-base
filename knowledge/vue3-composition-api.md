# Vue 3 Composition API

## 知识简介

Composition API 是 Vue 3 引入的组合式 API，通过 `setup()` 函数和响应式 API (`ref`、`reactive`、`computed`、`watch`) 组织组件逻辑，替代 Vue 2 的 Options API。

## 核心概念

- **`ref()`**：创建基本类型的响应式数据
- **`reactive()`**：创建对象类型的响应式数据
- **`computed()`**：创建计算属性
- **`watch()`**：监听数据变化
- **`onMounted()` 等生命周期钩子**：替代 Vue 2 的 `mounted`、`created` 等

## 详细讲解

在 Vue3 项目级训练工程中，所有视图和组件都使用 Composition API 编写。与 Vue 2 的 Options API 不同，Composition API 将相关逻辑放在一起，而不是分散在 `data`、`methods`、`computed` 等选项中。

**Vue 2 Options API 的问题**：当组件变得复杂时，同一功能的代码分散在不同选项中（data、methods、computed），难以维护。

**Vue 3 Composition API 的优势**：将同一功能的响应式状态、计算属性、方法、生命周期钩子组织在一起，形成"组合函数"，易于复用和测试。

项目中的 `useList` 函数是一个典型的组合函数（位于 `src/hooks/useForm.ts`），它封装了列表数据的获取、分页、加载状态等逻辑，可以在多个页面中复用。

## 重点内容

- `ref()` 创建的响应式数据在 JavaScript 中需要通过 `.value` 访问，在模板中自动解包
- `reactive()` 创建的响应式对象不需要 `.value`，但不能被解构（会失去响应式）
- `computed()` 返回只读的响应式引用
- `watch()` 的第一个参数可以是 ref、reactive 对象或 getter 函数

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
import { reactive, ref, watch } from 'vue'

// 组合函数：封装列表获取逻辑
export const useList = (uriCode, immediate = true, query) => {
  const list = ref([])
  const page = reactive({
    current: 1,
    size: 10,
    total: 0
  })
  const loading = ref(false)

  const getList = async () => {
    const params = { uriCode, index: page.current, size: page.size, ...query }
    try {
      loading.value = true
      const res = await Fetch(params)
      list.value = res.data.list
      page.total = res.data.count
    } finally {
      loading.value = false
    }
  }

  if (immediate) getList()

  watch(() => [page.current, page.size], () => getList(), { deep: true })

  return { list, page, loading, getList }
}
```

## 实际应用场景

- 复杂业务组件的逻辑组织
- 跨组件复用状态管理逻辑（组合函数）
- 替代 Vue 2 的 mixins

## 注意事项

- `ref` 包裹的值在 script 中访问需要 `.value`，模板中自动解包
- `reactive` 对象解构后会失去响应式，需配合 `toRefs()` 使用
- 生命周期钩子名称变为 `on` 前缀：`onMounted`、`onUpdated`、`onUnmounted`

## 常见误区

- 误区：在 setup 外使用 `ref()` 或 `reactive()`
- 误区：认为 Composition API 完全替代了 Options API（两者可以共存）
- 误区：忘记 `ref` 需要 `.value`

## 关联知识点

- [Vue 3 &lt;script setup&gt; 语法糖](/knowledge/vue3-script-setup)
- [Pinia 状态管理](/knowledge/pinia)
- [Vue 2 生命周期](/knowledge/vue-lifecycle)
- [Vue Router 4](/knowledge/vue-router4)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（useList 组合函数）
- 示例来源：通用训练工程抽象（watch 监听路由）
- 示例来源：通用训练工程抽象（ref、computed、onMounted）

## 官方资源扩展

- [Vue 3 官方文档 - Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq)
- 官方对 Composition API 设计动机和使用方式的完整说明
- [Vue 3 官方文档 - 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- 详细介绍 ref、reactive、computed、watch 等响应式 API