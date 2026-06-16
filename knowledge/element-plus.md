# Vue 3 数据列表与表格

## 竞赛关联

比赛常考数据列表展示页面，要求选手在 `onMounted` 生命周期中获取后端数据，绑定到 Element Plus 表格组件，并实现分页功能。这是管理后台最常见的页面模式。

## 核心技能

- **onMounted 数据获取**：页面加载时自动请求数据
- **el-table 表格绑定**：`:data` 绑定数组，`prop` 指定列字段
- **el-pagination 分页**：前后端分页联动
- **v-loading 加载状态**：数据加载时显示 loading 动画
- **自定义列渲染**：使用 `template #default` 插槽定制单元格内容

## 详细讲解

### 1. 完整的数据列表页面

```vue
<template>
  <div class="list-container">
    <!-- 搜索区域 -->
    <el-form :model="searchForm" inline>
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入搜索关键词"
          clearable
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      :data="tableData"
      border
      stripe
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        :index="(index) => (page.current - 1) * page.size + index + 1"
      />
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="address" label="地址" min-width="280">
        <template #default="{ row }">
          <el-tooltip :content="row.address" placement="top">
            <span class="address-text">{{ shortenText(row.address, 30) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 1 ? 'success' : 'info'" size="small">
            {{ row.type === 1 ? '已部署' : '未部署' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="page.current"
        v-model:page-size="page.size"
        :total="page.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </div>
  </div>
</template>
```

### 2. 数据获取逻辑

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDataList, deleteData } from '@/api/data'

// 搜索条件
const searchForm = reactive({
  keyword: ''
})

// 表格数据
const tableData = ref<DataItem[]>([])
const loading = ref(false)

// 分页参数
const page = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const params = {
      pageNumber: page.current,
      pageSize: page.size,
      ...searchForm
    }
    const res = await getDataList(params)
    if (res.code === 0) {
      tableData.value = res.data.list || []
      page.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取列表失败')
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.current = 1  // 搜索时重置到第一页
  getList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  handleSearch()
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})

// 辅助函数
const shortenText = (text: string, len: number) => {
  return text && text.length > len ? text.slice(0, len) + '...' : text
}
</script>
```

### 3. API 接口定义

```typescript
// src/api/data.ts
import request from './request'

interface ListParams {
  pageNumber: number
  pageSize: number
  keyword?: string
}

interface DataItem {
  id: number
  name: string
  address: string
  type: number
  createTime: string
}

interface ListResponse {
  code: number
  message: string
  data: {
    list: DataItem[]
    total: number
  }
}

export const getDataList = (params: ListParams) => {
  return request.get<ListResponse>('/data/list', { params })
}

export const deleteData = (id: number) => {
  return request.post('/data/delete', { id })
}
```

## 重点内容

- `onMounted` 中调用 `getList()` 实现页面初始化时自动加载数据
- `v-loading="loading"` 绑定到表格，数据加载时自动显示遮罩
- 分页使用 `reactive` 管理 `current`、`size`、`total` 三个状态
- 搜索时重置 `page.current = 1`，防止搜索后空白页
- 序号列使用 `:index` 自定义函数，根据当前页码计算正确序号
- 操作列使用 `fixed="right"`，水平滚动时固定在最右侧

## 注意事项

- 表格的 `:data` 绑定数组，`prop` 对应数据对象的字段名
- 分页参数通常命名为 `pageNumber`/`pageSize`（与后端接口约定一致）
- API 响应结构需要判空：`res.data.list || []` 防止 `undefined`
- `v-for` 循环中不要用 `index` 作为 `key`，应使用唯一 ID

## 常见误区

- 误区：忘记在 `onMounted` 中调用 `getList()`，页面空白
- 误区：分页和搜索条件同时存在于请求参数中，但搜索时忘记重置页码
- 误区：`tableData` 使用 `reactive` 包裹数组，模板中多写 `.value`
- 误区：API 返回 `list` 为 `null` 时没有兜底，导致 `el-table` 报错

## 官方资源扩展

- [Element Plus Table 表格](https://element-plus.org/zh-CN/component/table.html) - 表格组件完整文档，最佳学习资源
- [Element Plus Pagination 分页](https://element-plus.org/zh-CN/component/pagination.html) - 分页组件文档
- [Element Plus Loading 加载](https://element-plus.org/zh-CN/component/loading.html) - 加载状态组件
- [Vue 3 生命周期钩子](https://cn.vuejs.org/api/composition-api-lifecycle.html) - onMounted 等官方文档