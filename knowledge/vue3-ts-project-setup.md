# Vue 3 登录表单开发

## 竞赛关联

比赛前端部分常考登录页面开发，要求选手实现：表单数据双向绑定、非空校验、调用后端登录接口、成功后跳转到首页。这是前端开发中最基础也最重要的页面模式。

## 核心技能

- **v-model 双向绑定**：将表单输入与数据对象关联
- **表单非空验证**：提交前检查必填字段
- **Axios 调用 API**：发送登录请求，处理响应
- **路由跳转**：登录成功后使用 `router.push()` 跳转
- **Element Plus 消息提示**：成功/失败时给用户反馈

## 详细讲解

### 1. v-model 表单数据双向绑定

```vue
<template>
  <el-form ref="formRef" :model="loginForm" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="loginForm.username"
        placeholder="请输入用户名"
        clearable
      />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="请输入密码"
        show-password
        @keyup.enter="handleLogin"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleLogin"
        style="width: 100%"
      >
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

### 2. 非空验证与 API 调用

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi } from '@/api/user'

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  // 1. 非空验证
  if (!loginForm.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  if (!loginForm.password.trim()) {
    ElMessage.warning('请输入密码')
    return
  }

  // 2. 调用登录接口
  loading.value = true
  try {
    const res = await loginApi({
      username: loginForm.username,
      password: loginForm.password
    })

    // 3. 登录成功处理
    if (res.code === 0) {
      // 存储 token
      localStorage.setItem('token', res.data.token)
      ElMessage.success('登录成功')

      // 4. 跳转到首页
      router.push('/index')
    } else {
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. 登录 API 封装

```typescript
// src/api/user.ts
import request from './request'

interface LoginParams {
  username: string
  password: string
}

interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    userId: number
    username: string
  }
}

export const loginApi = (params: LoginParams) => {
  return request.post<LoginResponse>('/user/login', params)
}
```

### 4. 路由跳转（带重定向）

```typescript
// 登录成功后跳转到之前访问的页面
const redirect = route.query.redirect as string
router.push(redirect || '/index')
```

## 重点内容

- `v-model` 实现表单数据双向绑定，`reactive()` 包裹表单对象
- 提交前先做非空判断，`if (!value.trim())` 检查空字符串
- `loading` 状态防止重复提交，按钮显示 `:loading="loading"`
- `try-catch-finally` 确保无论成功失败都关闭 loading
- 使用 `ElMessage` 给用户明确的操作反馈
- 密码框支持回车键 `@keyup.enter` 快捷提交

## 注意事项

- API 调用必须放在 `try-catch` 中，防止未捕获的异常
- `loading.value = false` 要放在 `finally` 中，确保总是执行
- 跳转前存储 token 到 localStorage，后续请求在拦截器中携带
- 表单对象使用 `reactive` 而非 `ref`，模板中不需要 `.value`

## 常见误区

- 误区：非空验证时忘记 `.trim()`，空格也能通过
- 误区：`loading` 只放在 `try` 块的 `finally` 外面，异常时 loading 无法关闭
- 误区：`router.push` 使用路径字符串而非命名路由，重构时容易遗漏
- 误区：接口返回结构不统一，没有做 `code` 判断

## 官方资源扩展

- [Vue 3 表单输入绑定](https://cn.vuejs.org/guide/essentials/forms.html) - 官方表单双绑指南
- [Element Plus Form 表单](https://element-plus.org/zh-CN/component/form.html) - 表单组件完整文档
- [Element Plus Input 输入框](https://element-plus.org/zh-CN/component/input.html) - 输入框组件
- [Element Plus Button 按钮](https://element-plus.org/zh-CN/component/button.html) - 按钮 loading 状态
- [Vue Router 编程式导航](https://router.vuejs.org/zh/guide/essentials/navigation.html) - 路由跳转官方文档