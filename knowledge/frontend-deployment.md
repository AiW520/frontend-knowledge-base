# 综合实战：完整页面开发

## 竞赛关联

比赛前端部分本质上是让选手完成一个业务页面的关键代码片段。本知识点综合前面所学，带你走通一个完整页面的数据流：**页面初始化 → 获取数据 → 展示表格 → 交互操作 → 反馈提示**。

## 数据流全景

```
页面加载 (onMounted)
    ↓
调用 API 获取数据 (getDataList)
    ↓
更新响应式数据 (tableData.value = res.data.list)
    ↓
Element Plus 表格自动渲染 (:data="tableData")
    ↓
用户操作（搜索、分页、删除、详情）
    ↓
ElMessage 反馈结果
```

## 完整示例：用户管理页面

```vue
<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 数据表格 -->
    <el-card>
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
          :index="indexMethod"
        />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" size="small">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="(val: number) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearch"
          @current-change="handleSearch"
        />
      </div>
    </el-card>
  </div>
</template>
```

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, deleteUser, updateUserStatus } from '@/api/user'
import type { UserInfo } from '@/api/user'

// ============ 1. 响应式数据 ============
const loading = ref(false)
const tableData = ref<UserInfo[]>([])

const searchForm = reactive({
  username: '',
  status: undefined as number | undefined
})

const page = reactive({
  current: 1,
  size: 10,
  total: 0
})

// ============ 2. 数据获取 ============
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      pageNumber: page.current,
      pageSize: page.size,
      ...searchForm
    })
    if (res.code === 0) {
      tableData.value = res.data.list || []
      page.total = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// ============ 3. 搜索与重置 ============
const handleSearch = () => {
  page.current = 1
  fetchList()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.status = undefined
  handleSearch()
}

// ============ 4. 行操作 ============
const handleAdd = () => {
  ElMessage.info('打开新增弹窗')
}

const handleEdit = (row: UserInfo) => {
  ElMessage.info(`编辑用户: ${row.username}`)
}

const handleDelete = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.username}"吗？`,
      '确认删除',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    const res = await deleteUser(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      fetchList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleStatusChange = async (row: UserInfo, newStatus: number) => {
  try {
    const res = await updateUserStatus(row.id, newStatus)
    if (res.code === 0) {
      ElMessage.success('状态更新成功')
    } else {
      ElMessage.error(res.message || '状态更新失败')
      row.status = row.status === 1 ? 0 : 1  // 回滚
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    row.status = row.status === 1 ? 0 : 1  // 回滚
  }
}

// ============ 5. 辅助函数 ============
const indexMethod = (index: number) => {
  return (page.current - 1) * page.size + index + 1
}

// ============ 6. 生命周期 ============
onMounted(() => {
  fetchList()
})
</script>
```

## 页面开发流程总结

```
1. 定义响应式数据
   ├── loading: ref<boolean>        → 加载状态
   ├── tableData: ref<T[]>          → 表格数据
   ├── searchForm: reactive<Form>   → 搜索条件
   └── page: reactive<Page>         → 分页参数

2. 编写数据获取函数
   ├── loading.value = true
   ├── try { await getListApi() }
   ├── 判断 res.code === 0
   ├── 赋值 tableData.value = res.data.list
   ├── catch { console.error + ElMessage.error }
   └── finally { loading.value = false }

3. 搜索与重置
   ├── handleSearch: page.current = 1 → fetchList()
   └── handleReset: 清空 searchForm → handleSearch()

4. 行操作
   ├── 新增: 打开弹窗
   ├── 编辑: 打开弹窗(带数据)
   ├── 删除: ElMessageBox.confirm → deleteApi → fetchList()
   └── 其他: 状态切换等

5. onMounted 中调用 fetchList()
```

## 重点内容

- 数据流是单向的：`API → 响应式数据 → 模板渲染`
- 每个 API 调用都需要完整的 `try-catch-finally` 错误处理
- 搜索时重置页码到第一页，避免空白页
- 操作后刷新列表（如删除成功后调用 `fetchList()`）
- 表格序号使用 `:index` 自定义函数，根据页码计算正确序号

## 注意事项

- 所有 API 调用都以 `res.code === 0` 判断成功
- 数据赋值时使用 `res.data.list || []` 兜底空数组
- `ElMessageBox.confirm` 的 catch 中需要区分用户取消和真实错误
- 分页的 `total` 需要从后端获取，不能写死

## 官方资源扩展

- [Vue 3 快速上手](https://cn.vuejs.org/guide/quick-start.html) - 官方入门教程
- [Element Plus Table 表格](https://element-plus.org/zh-CN/component/table.html) - 表格组件文档
- [Element Plus Pagination 分页](https://element-plus.org/zh-CN/component/pagination.html) - 分页组件文档
- [Element Plus Form 表单](https://element-plus.org/zh-CN/component/form.html) - 表单组件文档