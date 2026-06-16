# Vue 3 文件下载功能

## 竞赛关联

比赛常考文件下载功能，要求选手实现点击按钮下载文件（如合约源码、档案文件等），并给出下载成功/失败的提示。这是前端开发中常见的功能需求。

## 核心技能

- **a 标签下载**：创建隐藏的 `<a>` 标签，设置 `href` 和 `download` 属性触发下载
- **Blob 流下载**：通过 Axios 获取二进制数据，转换为 Blob 后下载
- **下载状态提示**：使用 `ElMessage` 提示下载成功/失败
- **URL 拼接**：正确拼接后端下载接口的完整 URL

## 详细讲解

### 1. a 标签下载（直接 URL 下载）

```vue
<template>
  <el-button type="primary" @click="handleDownload(row)">
    下载文件
  </el-button>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

interface FileItem {
  id: number
  fileName: string
  filePath: string
}

const handleDownload = (row: FileItem) => {
  try {
    // 创建隐藏的 a 标签
    const link = document.createElement('a')

    // 设置下载地址（拼接完整的后端接口 URL）
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    link.href = `${baseURL}/file/download?id=${row.id}`

    // 设置下载文件名
    link.download = row.fileName

    // 触发点击
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success(`${row.fileName} 下载成功`)
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}
</script>
```

### 2. Blob 流下载（通过 API 获取二进制数据）

```vue
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import axios from 'axios'

const handleDownloadBlob = async (fileId: number, fileName: string) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

    // 请求二进制数据（注意 responseType）
    const response = await axios.get(`${baseURL}/file/download`, {
      params: { id: fileId },
      responseType: 'blob'   // 关键：指定响应类型为 Blob
    })

    // 创建 Blob URL
    const url = window.URL.createObjectURL(
      new Blob([response.data])
    )

    // 创建 a 标签下载
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success(`${fileName} 下载成功`)
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}
</script>
```

### 3. 下载合约源码压缩包

```vue
<script setup lang="ts">
const handleDownloadContract = async (contractId: number, contractName: string) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

    // 拼接下载 URL
    const downloadUrl = `${baseURL}/contract/download-zip?contractId=${contractId}`

    // 创建 a 标签触发下载
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${contractName}.zip`  // 下载文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    ElMessage.success('合约源码已下载')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('合约源码下载失败')
  }
}
</script>
```

### 4. 带 token 的下载请求

```vue
<script setup lang="ts">
const handleDownloadWithAuth = async (fileId: number, fileName: string) => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
    const token = localStorage.getItem('token')

    const response = await fetch(`${baseURL}/file/download?id=${fileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('下载失败')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}
</script>
```

## 重点内容

- `document.createElement('a')` 创建隐藏的 a 标签，设置 `href` 和 `download` 属性
- 下载完成后移除 a 标签 `document.body.removeChild(link)`
- Blob 下载需要 `responseType: 'blob'`，并使用 `window.URL.createObjectURL()`
- 下载完成后调用 `window.URL.revokeObjectURL()` 释放内存
- 下载提示使用 `ElMessage.success()` / `ElMessage.error()`

## 注意事项

- 直接 URL 下载时，`href` 需要拼接完整的后端接口地址
- 如果后端接口需要 token 认证，直接 URL 下载可能失败（需要改用 Blob 方式）
- `link.download` 属性指定下载保存的文件名
- 大文件下载建议显示进度条，使用 `onDownloadProgress` 回调

## 常见误区

- 误区：忘记在下载完成后调用 `removeChild` 和 `revokeObjectURL`
- 误区：直接 URL 下载时 `href` 只写了接口路径，缺少 `baseURL`
- 误区：Blob 下载时没有设置 `responseType: 'blob'`
- 误区：下载后没有给用户任何提示，用户不知道是否成功

## 官方资源扩展

- [MDN - 创建并下载文件](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLAnchorElement/download) - a 标签 download 属性文档
- [MDN - Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) - Blob 对象文档
- [MDN - URL.createObjectURL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) - 创建 Blob URL
- [Axios 响应类型](https://axios-http.com/zh/docs/req_config) - responseType 配置说明