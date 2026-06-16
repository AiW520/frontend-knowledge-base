# Axios 封装与 API 调用

## 竞赛关联

比赛前端任务中，所有数据都来自后端 API，选手需要掌握 Axios 的封装方式，包括：请求拦截器（添加 Token）、响应拦截器（统一错误处理）、API 接口的 TypeScript 类型定义。

## 核心技能

- **创建 Axios 实例**：统一 baseURL、超时时间、请求头
- **请求拦截器**：自动添加 Token 认证头
- **响应拦截器**：统一处理 code 错误码和 HTTP 异常
- **API 函数封装**：TypeScript 类型定义，请求参数和响应结构
- **ElMessage 错误提示**：在拦截器中统一弹窗提示

## 详细讲解

### 1. Axios 实例封装

```typescript
// src/api/request.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 后端统一响应结构
export interface ApiResponse<T = any> {
  code: number       // 0 表示成功
  message: string    // 提示信息
  data: T            // 响应数据
}

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    if (data.code === 0) {
      return response.data  // 成功时直接返回 data
    }

    // 业务错误
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    // HTTP 状态码错误
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有操作权限')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求失败 (${response.status})`)
      }
    } else {
      ElMessage.error('网络异常，请检查连接')
    }
    return Promise.reject(error)
  }
)

export default service
```

### 2. API 接口函数封装

```typescript
// src/api/user.ts
import request, { type ApiResponse } from './request'

// -------------------- 类型定义 --------------------
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userId: number
  username: string
}

export interface UserInfo {
  id: number
  username: string
  role: string
  createTime: string
}

export interface ListParams {
  pageNumber: number
  pageSize: number
  keyword?: string
}

export interface ListResult<T> {
  list: T[]
  total: number
}

// -------------------- API 函数 --------------------
export const loginApi = (params: LoginParams) => {
  return request.post<any, ApiResponse<LoginResult>>('/user/login', params)
}

export const getUserList = (params: ListParams) => {
  return request.get<any, ApiResponse<ListResult<UserInfo>>>('/user/list', { params })
}

export const addUser = (params: Partial<UserInfo>) => {
  return request.post<any, ApiResponse<null>>('/user/add', params)
}

export const deleteUser = (id: number) => {
  return request.post<any, ApiResponse<null>>('/user/delete', { id })
}
```

### 3. 页面中使用 API

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, type UserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'

const userList = ref<UserInfo[]>([])
const loading = ref(false)

// 调用 API 获取数据
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      pageNumber: 1,
      pageSize: 10
    })
    if (res.code === 0) {
      userList.value = res.data.list || []
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

onMounted(() => {
  fetchUserList()
})
</script>
```

## 重点内容

- 拦截器中 `code === 0` 判断为成功，非 0 统一 `ElMessage.error` 弹窗
- 401 状态码特殊处理：清除 token 并跳转登录页
- API 函数使用 TypeScript 泛型定义请求和响应类型
- `finally` 块中关闭 loading 状态，确保无论成功失败都执行
- `baseURL` 使用环境变量 `import.meta.env.VITE_API_BASE_URL` 区分开发/生产

## 注意事项

- Axios 实例需要单独导出，所有 API 调用都使用同一个实例
- 拦截器中的 `ElMessage` 要放在 `import` 中，确保全局可用
- 响应拦截器返回 `response.data`（而不是整个 response），简化调用方代码
- 上传文件时 `Content-Type` 需要设为 `multipart/form-data`

## 常见误区

- 误区：每个 API 文件都创建一个新的 Axios 实例
- 误区：在响应拦截器中 return 整个 response，调用方需要 `.data.data`
- 误区：API 调用不使用 try-catch，异常导致页面崩溃
- 误区：TypeScript 类型定义与实际后端返回结构不一致

## 官方资源扩展

- [Axios 官方中文文档](https://axios-http.com/zh/docs/intro) - 最佳学习资源
- [Axios 拦截器](https://axios-http.com/zh/docs/interceptors) - 拦截器官方文档
- [Element Plus Message 消息提示](https://element-plus.org/zh-CN/component/message.html) - 消息提示组件
- [TypeScript 泛型](https://www.typescriptlang.org/zh/docs/handbook/2/generics.html) - TS 泛型官方文档