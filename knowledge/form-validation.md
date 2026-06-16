# 表单设计与验证

## 知识简介

区块链应用开发中，合约部署、转账、参数设置等功能都需要通过表单让用户输入参数。Element Plus 提供了完善的表单组件和验证机制，掌握表单设计与验证是金砖大赛前端开发的基本技能。本知识点介绍复杂表单设计、自定义验证规则、异步验证等实战技巧。

## 核心概念

- **el-form**：Element Plus 表单容器，提供数据绑定和验证功能
- **验证规则**：通过 `rules` 属性配置表单验证规则
- **自定义验证器**：自定义验证逻辑，返回 Promise
- **异步验证**：验证需要后端接口确认的内容（如地址合法性）
- **动态表单项**：动态增减的表单项数组

## 详细讲解

### 1. 基础验证规则

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="140px"
  >
    <el-form-item label="合约名称" prop="contractName">
      <el-input v-model="formData.contractName" placeholder="请输入合约名称" />
    </el-form-item>

    <el-form-item label="合约地址" prop="contractAddress">
      <el-input v-model="formData.contractAddress" placeholder="0x..." />
    </el-form-item>

    <el-form-item label="转账金额" prop="amount">
      <el-input-number v-model="formData.amount" :min="1" />
    </el-form-item>

    <el-form-item label="接收地址" prop="toAddress">
      <el-input v-model="formData.toAddress" placeholder="0x..." />
    </el-form-item>

    <el-form-item label="Gas Limit" prop="gasLimit">
      <el-input v-model="formData.gasLimit" placeholder="默认 21000" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        发送交易
      </el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface TransferFormData {
  contractName: string
  contractAddress: string
  amount: number
  toAddress: string
  gasLimit: number
}

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = ref<TransferFormData>({
  contractName: '',
  contractAddress: '',
  amount: 0,
  toAddress: '',
  gasLimit: 21000
})

// 验证规则
const rules = ref<FormRules<TransferFormData>>({
  contractName: [
    { required: true, message: '请输入合约名称', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  contractAddress: [
    { required: true, message: '请输入合约地址', trigger: 'blur' },
    { pattern: /^0x[a-fA-F0-9]{40}$/, message: '不是有效的以太坊地址格式', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入转账金额', trigger: 'change' },
    { type: 'number', min: 1, message: '金额必须大于 0', trigger: 'change' }
  ],
  toAddress: [
    { required: true, message: '请输入接收地址', trigger: 'blur' },
    { pattern: /^0x[a-fA-F0-9]{40}$/, message: '不是有效的以太坊地址格式', trigger: 'blur' }
  ],
  gasLimit: [
    { required: true, message: '请输入 Gas Limit', trigger: 'blur' },
    { type: 'number', min: 21000, message: 'Gas Limit 至少为 21000', trigger: 'blur' }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    // 提交交易
    console.log('formData:', formData.value)
    ElMessage.success('交易已发送，请等待区块链确认')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>
```

### 2. 自定义异步验证

```vue
<template>
  <el-form :model="form" :rules="rules" label-width="120px">
    <el-form-item label="用户地址" prop="userAddress">
      <el-input v-model="form.userAddress" placeholder="0x..." />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { getBalance } from '@/api/web3'

const form = ref({ userAddress: '' })

// 自定义异步验证器：验证地址是否存在且有余额
const validateAddress = async (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入地址'))
    return
  }

  // 正则验证格式
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    callback(new Error('不是有效的以太坊地址格式'))
    return
  }

  try {
    // 异步验证：调用 Web3 接口查询余额
    const balance = await getBalance(value)
    if (parseFloat(balance) <= 0) {
      callback(new Error('账户余额为 0，请确保有足够 Gas 费用'))
    } else {
      callback() // 验证通过
    }
  } catch (error) {
    callback(new Error('验证地址失败，请检查节点连接'))
  }
}

const rules = {
  userAddress: [
    { required: true, validator: validateAddress, trigger: 'blur' }
  ]
}
</script>
```

### 3. 动态表单项（多参数输入）

```vue
<template>
  <el-form :model="form" label-width="120px">
    <div v-for="(item, index) in form.params" :key="index">
      <el-form-item :label="`参数 ${index + 1}`">
        <el-input v-model="item.value" placeholder="参数值">
          <template #append>
            <el-button @click="removeParam(index)">删除</el-button>
          </template>
        </el-input>
      </el-form-item>
    </div>
    <el-form-item>
      <el-button type="primary" link @click="addParam">
        <el-icon><Plus /></el-icon>
        添加参数
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface ContractParam {
  name: string
  value: string
}

const form = reactive({
  params: [] as ContractParam[]
})

const addParam = () => {
  form.params.push({ name: '', value: '' })
}

const removeParam = (index: number) => {
  form.params.splice(index, 1)
}
</script>
```

### 4. 分步表单（大表单拆分）

合约部署场景，参数多，分步引导用户：

```vue
<template>
  <el-steps :active="activeStep" align-center>
    <el-step title="基本信息" description="填写合约名称和描述" />
    <el-step title="源代码" description="编译获取 ABI 和 Bytecode" />
    <el-step title="构造参数" description="填写构造函数参数" />
    <el-step title="确认部署" description="确认信息并发送交易" />
  </el-steps>

  <div class="step-content">
    <!-- 步骤 1：基本信息 -->
    <el-form v-if="activeStep === 0" :model="formStep1">
      ...
    </el-form>

    <!-- 步骤 2：源代码 -->
    <el-form v-if="activeStep === 1" :model="formStep2">
      ...
    </el-form>

    <!-- 其他步骤 -->
  </div>

  <div class="step-buttons">
    <el-button v-if="activeStep > 0" @click="activeStep--">上一步</el-button>
    <el-button type="primary" @click="nextStep">
      {{ activeStep === 3 ? '确认部署' : '下一步' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeStep = ref(0)
const formStep1 = ref({})
const formStep2 = ref({})

const nextStep = () => {
  activeStep.value++
}
</script>
```

## 重点内容

- **prop 属性**：每个 `el-form-item` 的 `prop` 属性必须对应 `formData` 的字段名，否则验证不生效
- **触发器**：`trigger: 'blur'`（失焦验证）、`trigger: 'change'`（值改变验证）
- **正则验证**：以太坊地址格式使用正则 `/^0x[a-fA-F0-9]{40}$/`
- **自定义验证器**：异步验证返回 Promise，完成后调用 `callback()`
- **动态表单**：数组存储动态项，通过 `splice` 增删

## 实际应用场景

- 合约部署表单：需要填写名称、ABI、Bytecode、构造参数
- 代币转账表单：接收地址、转账金额、Gas 设置
- 存证上链表单：存证标题、文件哈希、证明人地址
- 节点配置表单：节点地址、RPC 端口、群组 ID

## 注意事项

- `el-form` 的 `ref` 在 TypeScript 中需要标注 `FormInstance` 类型
- 自定义验证器中，验证失败必须 `callback(new Error('错误信息'))`，验证成功 `callback()` 不带参数
- 分步表单需要处理每个步骤的验证，只有当前步骤验证通过才能进入下一步
- 重置表单使用 `resetFields()`，而不是直接清空对象

## 常见误区

- 误区：忘记给 `el-form-item` 设置 `prop` 属性，导致验证不生效
- 误区：自定义验证器不调用 `callback()`，导致表单一直卡在验证中
- 误区：动态表单项没有设置 `key`，导致 Vue 复用出错
- 误区：正则表达式不兼容大小写（地址可能是大写也可能是小写）

## 关联知识点

- [Element Plus 组件库](/knowledge/element-plus)
- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [智能合约前端调用](/knowledge/smart-contract-frontend)

## 官方资源扩展

- [Element Plus Form 文档](https://element-plus.org/zh-CN/component/form.html) - Element Plus 表单组件官方文档，最佳学习资源
- [Element Plus 表单验证](https://element-plus.org/zh-CN/guide/form-validation.html) - 官方表单验证完整指南
- [async-validator 文档](https://github.com/yiminghe/async-validator) - Element Plus 表单验证底层库文档