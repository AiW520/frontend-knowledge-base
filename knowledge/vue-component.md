<!-- 知识点名称 -->
# Vue 组件注册

<!-- 知识简介 -->
Vue 组件是可复用的 Vue 实例，用于封装页面中的独立功能模块。组件可以局部注册或全局注册。

<!-- 核心概念 -->
- 局部注册：在父组件的 `components` 选项中注册
- 全局注册：通过 `Vue.component()` 注册
- 组件通过 props 接收父组件数据，通过 $emit 向父组件发送事件

<!-- 详细讲解 -->
在供应链金融项目中，使用了组件化开发方式。`Header` 和 `Navigator` 组件被局部注册到 Home 页面中。

Home 页面注册组件（`供应链—front/src/views/Home.vue`）：
```javascript
import Navigator from "@/components/Navigator";
import Header from '@/components/Header';

export default {
    name: "Home",
    components: { Navigator, Header }
}
```

在模板中使用注册的组件：
```html
<el-container>
    <el-header><Header /></el-header>
    <el-container>
        <el-aside><navigator></navigator></el-aside>
        <el-main>...</el-main>
    </el-container>
</el-container>
```

Navigator 组件通过 `$router.push` 实现页面导航，并通过 `$emit` 向父组件传递选择事件。

<!-- 重点内容 -->
- 组件名在模板中使用时，驼峰命名转为短横线命名（如 `Navigator` → `<navigator>`）
- 组件复用可以让每个组件实例拥有独立的数据
- 组件通过 `props` 接收父组件数据

<!-- 关键代码示例 -->
来源：`供应链—front/src/components/Navigator.vue` 第 1-38 行
```vue
<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu @select="handleSelect">
        <el-menu-item index="1">我的票据</el-menu-item>
        <el-menu-item index="2">公司列表</el-menu-item>
        <el-menu-item index="3">银行列表</el-menu-item>
        <el-menu-item index="4">账户信息</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Navigator",
  methods: {
    handleSelect(key) {
      if (key == '1') this.$router.push('/home')
      if (key == '2') this.$router.push('/company')
      if (key == '3') this.$router.push('/bank')
      if (key == '4') this.$router.push('/individual')
    }
  }
}
</script>
```

<!-- 实际应用场景 -->
- 页面头部导航
- 侧边栏菜单
- 可复用的表单组件
- 列表项组件

<!-- 注意事项 -->
- 组件 `data` 必须是函数，不能是对象
- 组件模板中必须有一个根元素
- 局部注册的组件只能在注册它的父组件中使用

<!-- 常见误区 -->
- 误区：组件 `data` 写成对象而非函数
- 误区：组件模板中有多个根元素（Vue 2 中不允许）

<!-- 关联知识点 -->
- [Vue Router](/knowledge/vue-router)
- [Vue 实例创建](/knowledge/vue-instance)
- [Element UI 布局](/knowledge/element-ui-layout)

<!-- 资料来源 -->
- 来源文件：`供应链—front/src/components/Header.vue`
- 来源文件：`供应链—front/src/components/Navigator.vue`
- 来源文件：`供应链—front/src/views/Home.vue`

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 组件基础](https://v2.vuejs.org/v2/guide/components.html)
- 详细介绍组件注册、props、事件和插槽