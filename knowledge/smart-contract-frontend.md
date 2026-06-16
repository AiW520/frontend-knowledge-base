# Element Plus 表单验证

## 竞赛关联

比赛常考表单验证，要求选手在登录页面或数据提交页面中正确使用 Element Plus 的表单验证规则，包括非空验证、格式验证、自定义校验等。掌握表单验证是前端开发的基础功。

## 核心技能

- **el-form 验证规则**：使用 `rules` 属性配置验证规则
- **required 验证**：`required: true` 非空验证
- **pattern 正则验证**：电话号码、邮箱等格式验证
- **自定义 validator**：编写自定义校验逻辑
- **手动触发验证**：`formRef.validate()` 手动校验
- **表单重置**：`formRef.resetFields()` 重置表单

## 详细讲解

### 1. 基础验证规则

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    size="default"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="手机号" prop="phone">
      <el-input v-model="formData.phone" placeholder="请输入手机号" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" placeholder="请输入邮箱" />
    </el-form-item>

    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="formData.age" :min="1" :max="150" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()

interface UserForm {
  username: string
  phone: string
  email: string
  age: number | undefined
}

const formData = reactive<UserForm>({
  username: '',
  phone: '',
  email: '',
  age: undefined
})

// 验证规则
const rules: FormRules<UserForm> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'change' },
    { type: 'number', min: 1, max: 150, message: '年龄范围 1-150', trigger: 'change' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  // 手动触发验证
  const valid = await formRef.value.validate()
  if (!valid) return

  // 验证通过，提交数据
  ElMessage.success('提交成功')
  console.log('提交数据:', formData)
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>
```

### 2. 自定义验证器

```vue
<script setup lang="ts">
import type { FormRules } from 'element-plus'

// 自定义验证：检查用户名是否已被占用
const validateUsername = async (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入用户名'))
    return
  }

  // 模拟异步请求检查用户名
  try {
    // const res = await checkUsername(value)
    const isExist = false  // 假设返回 false 表示可用

    if (isExist) {
      callback(new Error('用户名已被占用'))
    } else {
      callback()  // 验证通过
    }
  } catch (error) {
    callback(new Error('验证失败，请重试'))
  }
}

// 自定义验证：确认密码
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
    return
  }
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, validator: validateUsername, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}
</script>
```

### 3. Element Plus 常用验证规则速查

| 规则类型 | 配置示例 | 说明 |
|----------|---------|------|
| 非空验证 | `{ required: true, message: '不能为空', trigger: 'blur' }` | 必填字段 |
| 长度限制 | `{ min: 3, max: 20, message: '3-20个字符', trigger: 'blur' }` | 字符串长度 |
| 正则验证 | `{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }` | 格式校验 |
| 邮箱验证 | `{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }` | 内置邮箱类型 |
| 数字验证 | `{ type: 'number', min: 1, max: 150, message: '范围1-150', trigger: 'change' }` | 数字范围 |
| 自定义验证 | `{ validator: myValidator, trigger: 'blur' }` | 自定义逻辑 |

### 4. trigger 触发时机

| trigger | 说明 |
|---------|------|
| `blur` | 失去焦点时验证（适合输入框） |
| `change` | 值改变时验证（适合选择器、数字输入） |
| 不设置 | 仅在调用 `validate()` 时验证 |

## 重点内容

- `el-form` 的 `ref` 在 TypeScript 中标注为 `FormInstance` 类型
- `el-form-item` 的 `prop` 属性必须与 `formData` 的字段名对应
- 自定义验证器：验证失败 `callback(new Error('...'))`，验证通过 `callback()`
- 多个规则按数组顺序执行，前面的规则失败后后面的不会执行
- 手动验证：`await formRef.value.validate()` 返回布尔值

## 注意事项

- `rules` 在 TypeScript 中需要标注 `FormRules<FormData>` 泛型
- 自定义验证器中 `callback` 必须调用，否则表单一直处于验证中
- `resetFields()` 会重置表单为初始值，不是清空
- 表单 `model` 和 `rules` 中的字段名必须一致

## 常见误区

- 误区：忘记给 `el-form-item` 设置 `prop`，验证不生效
- 误区：自定义验证器中使用 `return` 而不调用 `callback`
- 误区：`rules` 写在 `ref` 中包裹，模板中不需要 `.value`，但 `formRef` 在 script 中需要 `.value`
- 误区：`trigger: 'blur'` 和 `trigger: 'change'` 混用，无法在期望时机触发验证

## 官方资源扩展

- [Element Plus Form 表单](https://element-plus.org/zh-CN/component/form.html) - 表单组件完整文档，最佳学习资源
- [Element Plus 自定义校验](https://element-plus.org/zh-CN/component/form.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%A1%E9%AA%8C) - 官方自定义校验指南
- [async-validator GitHub](https://github.com/yiminghe/async-validator) - Element Plus 表单底层验证库
- [Element Plus Input 输入框](https://element-plus.org/zh-CN/component/input.html) - 输入框组件