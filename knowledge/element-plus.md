# Element Plus UI 组件库实战

## 知识简介

Element Plus 是基于 Vue 3 的企业级 UI 组件库，是金砖大赛区块链前端开发的推荐 UI 框架。它提供了丰富的组件：表格、表单、对话框、导航菜单等，能够快速构建区块链管理平台的专业界面。区块链应用常见的功能（数据表格展示交易记录、表单提交合约参数、弹窗确认交易等）都可以通过 Element Plus 高效实现。

## 核心概念

- **Element Plus**：Vue 3 版本的 Element UI，TypeScript 支持完善
- **按需导入**：通过 `unplugin-vue-components` 实现组件自动导入，减小打包体积
- **布局系统**：Container / Header / Aside / Main / Footer 布局容器
- **表单组件**：el-form / el-table / el-dialog / el-menu 等核心组件

## 详细讲解

### 1. 安装与配置

```bash
npm install element-plus @element-plus/icons-vue
# 按需导入插件（可选，推荐）
npm install -D unplugin-vue-components unplugin-auto-import
```

`vite.config.ts` 配置按需导入：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
})
```

### 2. 区块链管理平台典型布局

```vue
<template>
  <el-container class="layout-container">
    <!-- 侧边导航 -->
    <el-aside width="220px">
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/blocks">
          <el-icon><Box /></el-icon>
          <span>区块浏览</span>
        </el-menu-item>
        <el-menu-item index="/transactions">
          <el-icon><List /></el-icon>
          <span>交易记录</span>
        </el-menu-item>
        <el-menu-item index="/contracts">
          <el-icon><Document /></el-icon>
          <span>合约管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header>
        <span class="title">区块链应用管理平台</span>
        <span class="node-info">节点: {{ nodeStatus }}</span>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
```

### 3. 区块链交易表格（核心组件）

```vue
<template>
  <el-table
    :data="transactionList"
    stripe
    border
    style="width: 100%"
    v-loading="loading"
  >
    <el-table-column prop="transHash" label="交易哈希" min-width="280">
      <template #default="{ row }">
        <el-tooltip :content="row.transHash" placement="top">
          <span class="hash-text">{{ shortenHash(row.transHash) }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="blockNumber" label="区块高度" width="120" />
    <el-table-column prop="from" label="发送方" min-width="200">
      <template #default="{ row }">
        <el-tag type="info" size="small">{{ shortenHash(row.from) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="to" label="接收方" min-width="200">
      <template #default="{ row }">
        <el-tag type="success" size="small">{{ shortenHash(row.to) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link @click="viewDetail(row)">
          详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="page.current"
    v-model:page-size="page.size"
    :total="page.total"
    layout="total, prev, pager, next"
    @current-change="fetchTransactions"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Transaction } from '@/types/blockchain'

const transactionList = ref<Transaction[]>([])
const loading = ref(false)
const page = reactive({ current: 1, size: 10, total: 0 })

const shortenHash = (hash: string) =>
  hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : '--'

const fetchTransactions = async () => {
  loading.value = true
  // 调用 WeBASE API 获取交易列表
  loading.value = false
}
</script>
```

### 4. 合约交互表单

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="140px"
  >
    <el-form-item label="合约地址" prop="contractAddress">
      <el-input v-model="formData.contractAddress" placeholder="0x..." />
    </el-form-item>
    <el-form-item label="方法名" prop="methodName">
      <el-select v-model="formData.methodName" placeholder="选择合约方法">
        <el-option label="transfer(address,uint256)" value="transfer" />
        <el-option label="balanceOf(address)" value="balanceOf" />
      </el-select>
    </el-form-item>
    <el-form-item label="参数" prop="params">
      <el-input
        v-model="formData.params"
        type="textarea"
        :rows="3"
        placeholder='["0x...", "100"]'
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm" :loading="submitting">
        发送交易
      </el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>
```

## 重点内容

- **el-table** 是区块链数据展示的核心组件，支持自定义列渲染、排序、筛选
- **el-form** 用于合约参数输入，需要配合表单验证规则
- **el-dialog** 用于交易确认弹窗，防止误操作
- **el-tag / el-tooltip** 用于展示区块链特有的哈希地址
- 按需导入能显著减小打包体积，比赛环境可能对文件大小有限制

## 实际应用场景

- 区块链浏览器：展示区块列表、交易详情
- 合约管理：部署合约、调用合约方法、查看合约事件
- 用户管理：地址管理、权限配置
- 数据仪表盘：节点状态、交易统计、区块增长趋势

## 注意事项

- Element Plus 图标需单独安装 `@element-plus/icons-vue`
- TypeScript 中使用 `el-form` 的 `validate()` 需要获取 `FormInstance` 类型
- 表格列宽设置 `min-width` 而非 `width`，能更好适配不同屏幕
- 哈希地址展示建议使用缩写 + tooltip 完整展示

## 常见误区

- 误区：忘记注册图标组件，导致图标不显示
- 误区：表格数据更新后忘记重新渲染（使用 `key` 或响应式数据）
- 误区：表单验证规则中 validator 忘记返回 Promise

## 关联知识点

- [Vue 3 + TS 项目搭建](/knowledge/vue3-ts-project-setup)
- [表单设计与验证](/knowledge/form-validation)
- [区块链数据可视化](/knowledge/blockchain-data-visualization)

## 官方资源扩展

- [Element Plus 官方文档](https://element-plus.org/zh-CN/) - 最权威的 Element Plus 学习资源，每个组件都有完整示例
- [Element Plus 组件总览](https://element-plus.org/zh-CN/component/overview.html) - 快速浏览所有可用组件
- [Element Plus GitHub](https://github.com/element-plus/element-plus) - 源码与 Issue 讨论
- [Element Plus 暗黑模式](https://element-plus.org/zh-CN/guide/dark-mode.html) - 区块链应用常用暗色主题