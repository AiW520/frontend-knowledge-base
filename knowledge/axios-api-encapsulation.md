# Axios 封装与 WeBASE API 对接

## 知识简介

在区块链应用开发中，前端需要与 WeBASE-Front 提供的 RESTful API 进行数据交互。通过 Axios 进行 HTTP 请求封装，实现统一的请求拦截、响应处理、错误处理和 Token 管理。WeBASE-Front 提供了节点管理、合约管理、交易查询等丰富的 API 接口，前端需要熟练掌握这些接口的调用方式。

## 核心概念

- **Axios**：基于 Promise 的 HTTP 客户端，支持请求/响应拦截器
- **WeBASE-Front API**：区块链中间件提供的 RESTful 接口
- **请求封装**：统一管理 API 基础路径、超时时间、请求头
- **拦截器链**：请求拦截（添加 Token）→ 发送请求 → 响应拦截（统一错误处理）
- **TypeScript 类型**：为 API 响应定义类型，提供类型安全

## 详细讲解

### 1. Axios 实例封装（src/api/request.ts）

```typescript
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// WeBASE API 通用响应结构
export interface WeBASEBaseResponse<T = any> {
  code: number       // 0 表示成功
  message: string
  data: T
}

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/webase',
  timeout: 30000,  // 区块链交易可能较慢，适当延长超时
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 Token（如果有登录功能）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<WeBASEBaseResponse>) => {
    const { data } = response

    // WeBASE-Front 返回 code 为 0 表示成功
    if (data.code === 0) {
      return data.data  // 直接返回 data 字段
    }

    // 业务错误
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message))
  },
  (error) => {
    // HTTP 错误处理
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          break
        case 403:
          ElMessage.error('没有访问权限')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求错误: ${response.status}`)
      }
    } else {
      ElMessage.error('网络连接异常，请检查 WeBASE 服务是否启动')
    }
    return Promise.reject(error)
  }
)

export default service
```

### 2. WeBASE API 接口定义（src/api/webase.ts）

```typescript
import request from './request'
import type { WeBASEBaseResponse } from './request'

// ============ 类型定义 ============

export interface BlockInfo {
  blockNumber: number
  blockHash: string
  transactionCount: number
  timestamp: number
  sealer: string
}

export interface TransactionInfo {
  transHash: string
  blockNumber: number
  from: string
  to: string
  value: string
  gasUsed: number
  timestamp: number
}

export interface ContractInfo {
  contractName: string
  contractAddress: string
  contractAbi: string
  deployTime: string
  contractBin: string
}

export interface NodeInfo {
  nodeId: string
  p2pPort: number
  blockNumber: number
  pbftView: number
  groupId: string
}

// ============ API 接口 ============

/**
 * 获取区块列表
 * @param groupId 群组ID（通常为 1）
 * @param pageNumber 页码
 * @param pageSize 每页大小
 */
export const getBlockList = (
  groupId: number = 1,
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  return request.get<any, BlockInfo[]>('/WeBASE-Front/block/blockList', {
    params: { groupId, pageNumber, pageSize }
  })
}

/**
 * 根据区块哈希获取区块详情
 */
export const getBlockDetail = (
  groupId: number = 1,
  blockHash: string
) => {
  return request.get<any, BlockInfo>('/WeBASE-Front/block/blockDetail', {
    params: { groupId, blockHash }
  })
}

/**
 * 获取交易列表
 */
export const getTransactionList = (
  groupId: number = 1,
  pageNumber: number = 1,
  pageSize: number = 10,
  blockHash?: string
) => {
  return request.get<any, TransactionInfo[]>('/WeBASE-Front/transaction/transList', {
    params: { groupId, pageNumber, pageSize, blockHash }
  })
}

/**
 * 根据交易哈希获取交易详情
 */
export const getTransactionDetail = (
  groupId: number = 1,
  transHash: string
) => {
  return request.get<any, TransactionInfo>(
    '/WeBASE-Front/transaction/transactionInfo',
    { params: { groupId, transHash } }
  )
}

/**
 * 获取合约列表
 */
export const getContractList = (
  groupId: number = 1,
  pageNumber: number = 1,
  pageSize: number = 10
) => {
  return request.get<any, ContractInfo[]>('/WeBASE-Front/contract/contractList', {
    params: { groupId, pageNumber, pageSize }
  })
}

/**
 * 部署合约
 */
export const deployContract = (
  groupId: number = 1,
  data: {
    contractName: string
    abiInfo: string
    bytecodeBin: string
    constructorParams?: any[]
    userAddress: string
  }
) => {
  return request.post<any, { contractAddress: string }>(
    '/WeBASE-Front/contract/deploy',
    { groupId, ...data }
  )
}

/**
 * 获取节点信息
 */
export const getNodeInfo = (groupId: number = 1) => {
  return request.get<any, NodeInfo[]>('/WeBASE-Front/web3/refreshMessage', {
    params: { groupId }
  })
}

/**
 * 获取群组列表
 */
export const getGroupList = () => {
  return request.get<any, any[]>('/WeBASE-Front/group/all')
}
```

### 3. 页面中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBlockList, getBlockDetail } from '@/api/webase'
import type { BlockInfo } from '@/api/webase'

const blockList = ref<BlockInfo[]>([])
const loading = ref(false)

const fetchBlocks = async () => {
  loading.value = true
  try {
    blockList.value = await getBlockList(1, 1, 10)
  } catch (error) {
    console.error('获取区块列表失败:', error)
    // 错误已在拦截器中统一处理，这里只需处理额外逻辑
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlocks()
})
</script>
```

## 重点内容

- WeBASE-Front 默认 API 路径前缀为 `/WeBASE-Front/`
- 响应拦截器中将 `code === 0` 判断为成功，直接返回 `data` 字段，简化调用方代码
- 区块链交易超时时间建议设置 30 秒以上，因为交易需要共识确认
- 给每个 API 函数定义 TypeScript 返回类型，开发时能获得完整的类型提示

## 实际应用场景

- 获取区块列表 / 区块详情用于区块链浏览器
- 部署合约 / 调用合约用于合约管理
- 查询交易列表 / 交易详情用于交易记录
- 获取节点信息用于仪表盘监控

## 注意事项

- WeBASE-Front 的 API 路径可能因版本不同而略有差异，需以实际部署版本文档为准
- 比赛环境可能是离线环境，API 地址需要配置为内网地址
- 请求拦截器中 Token 过期需要处理重新登录逻辑
- 大数据量查询时需要使用分页参数，避免一次性加载过多数据

## 常见误区

- 误区：忘记配置 Vite 代理导致跨域请求失败
- 误区：响应拦截器返回整个 response 对象，调用方需要多层 `.data`
- 误区：错误处理只在拦截器中 `console.log`，没有给用户友好的提示
- 误区：API 参数类型不匹配（如 groupId 应为 number 传了 string）

## 关联知识点

- [Vue 3 + TS 项目搭建](/knowledge/vue3-ts-project-setup)
- [Web3.js 区块链交互](/knowledge/web3-blockchain-interaction)
- [智能合约前端调用](/knowledge/smart-contract-frontend)

## 官方资源扩展

- [Axios 官方文档](https://axios-http.com/zh/docs/intro) - Axios 中文官方文档，最佳学习资源
- [WeBASE-Front API 文档](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/interface.html) - WeBASE-Front 完整 API 接口说明
- [WeBASE 快速入门](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE/quick-start.html) - WeBASE 平台使用指南
- [FISCO BCOS 技术文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/) - 底层区块链平台文档