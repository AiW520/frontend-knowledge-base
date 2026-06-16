# 错误处理与用户反馈

## 竞赛关联

比赛考核中，API 调用失败后需要给出正确的错误处理：使用 `console.error` 记录错误日志、使用 `ElMessage.error` 给用户友好提示。恰当的错误处理能提升用户体验，也是代码质量的重要体现。

## 核心技能

- **ElMessage 消息提示**：`success` / `error` / `warning` / `info` 四种类型
- **try-catch-finally**：完整的异常捕获与资源清理
- **console.error 日志**：开发调试时的错误日志输出
- **loading 状态管理**：请求中显示加载状态，防止重复提交
- **条件判断**：根据接口返回的 `code` 判断成功/失败

## 详细讲解

### 1. ElMessage 四种消息类型

```vue
<script setup lang="ts">
import { ElMessage } from 'element-plus'

// 成功提示
ElMessage.success('操作成功')

// 错误提示
ElMessage.error('操作失败，请重试')

// 警告提示
ElMessage.warning('请输入用户名')

// 普通提示
ElMessage.info('数据加载中...')

// 带配置的提示
ElMessage({
  type: 'success',
  message: '保存成功',
  duration: 3000,         // 显示时长（毫秒）
  showClose: true,        // 显示关闭按钮
  center: true            // 文字居中
})
</script>
```

### 2. 完整的 try-catch-finally 模式

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { submitData } from '@/api/data'

const loading = ref(false)

const handleSubmit = async () => {
  // 请求前：开启 loading
  loading.value = true

  try {
    // 发送请求
    const res = await submitData(formData)

    // 判断返回结果
    if (res.code === 0) {
      ElMessage.success('提交成功')
      // 成功后刷新列表
      fetchList()
    } else {
      ElMessage.error(res.message || '提交失败')
    }
  } catch (error) {
    // 异常捕获：记录日志 + 用户提示
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请检查网络连接')
  } finally {
    // 无论成功还是失败，都关闭 loading
    loading.value = false
  }
}
</script>
```

### 3. 常见错误处理场景

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ===== 场景一：列表获取失败 =====
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getListApi(params)
    if (res.code === 0) {
      tableData.value = res.data.list || []
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

// ===== 场景二：删除确认弹窗 =====
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 用户确认删除
    const res = await deleteApi(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      fetchList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    // 用户取消也会进入 catch（抛出 cancel 错误）
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// ===== 场景三：页面加载时的初始化 =====
onMounted(() => {
  fetchList()
})
</script>
```

### 4. 错误处理模式对比

```typescript
// ❌ 不好的写法：没有错误处理
const fetchData = async () => {
  const res = await getListApi()
  tableData.value = res.data.list
}

// ❌ 不好的写法：catch 了但没给用户提示
const fetchData = async () => {
  try {
    const res = await getListApi()
    tableData.value = res.data.list
  } catch (error) {
    console.log(error)  // 用户不知道发生了什么
  }
}

// ✅ 好的写法：完整的错误处理
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getListApi()
    if (res.code === 0) {
      tableData.value = res.data.list || []
    } else {
      ElMessage.error(res.message || '获取列表失败')
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
```

### 5. ElMessageBox 常用弹窗

```typescript
import { ElMessageBox } from 'element-plus'

// 确认弹窗
await ElMessageBox.confirm('确定要执行此操作吗？', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning'
})

// 提示弹窗
await ElMessageBox.alert('这是一条提示信息', '提示', {
  confirmButtonText: '知道了'
})

// 输入弹窗
const { value } = await ElMessageBox.prompt('请输入备注', '备注', {
  confirmButtonText: '确定',
  cancelButtonText: '取消'
})
```

## 重点内容

- `ElMessage.success()` / `ElMessage.error()` 是最常用的用户反馈方式
- try-catch 中 `console.error('描述:', error)` 记录完整错误信息，便于调试
- `finally` 中关闭 loading 状态，无论成功失败都执行
- API 响应中 `code` 为 0 判断成功，否则显示 `res.message`
- 列表数据赋值时使用 `res.data.list || []` 做兜底，防止表格报错

## 注意事项

- `ElMessageBox.confirm` 的 catch 中包含用户取消的情况，需要区分处理
- 不要在 catch 中默默吞掉错误，至少要 `console.error` 记录
- 错误信息应简洁明了，不要暴露技术细节（如数据库字段名）
- `loading` 是 `ref`，在模板中直接使用 `loading`，在 script 中需要 `loading.value`

## 常见误区

- 误区：API 调用不写 try-catch，网络异常导致页面白屏
- 误区：只写 `ElMessage.error` 不写 `console.error`，调试时找不到错误原因
- 误区：在 `ElMessageBox.confirm` 的 catch 中一律当错误处理，忽略了用户取消
- 误区：多个 API 调用共用一个 `loading`，导致状态混乱

## 官方资源扩展

- [Element Plus Message 消息提示](https://element-plus.org/zh-CN/component/message.html) - 消息提示完整文档，最佳学习资源
- [Element Plus MessageBox 弹窗](https://element-plus.org/zh-CN/component/message-box.html) - 确认弹窗文档
- [MDN - try...catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch) - JS 异常处理文档
- [MDN - console.error](https://developer.mozilla.org/zh-CN/docs/Web/API/console/error) - 控制台错误输出