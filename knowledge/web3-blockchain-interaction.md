# Web3.js 区块链交互

## 知识简介

Web3.js 是以太坊生态的 JavaScript SDK，用于前端与区块链节点进行交互。在金砖大赛中，虽然主要使用 WeBASE-Front 的 RESTful API，但某些场景下（如直接调用合约方法、监听合约事件）需要用到 Web3.js。理解 Web3.js 的核心用法能帮助选手更深入地理解区块链前端的交互原理。

## 核心概念

- **Web3.js**：以太坊 JavaScript API，提供与以太坊兼容链（包括 FISCO BCOS）的交互能力
- **Provider**：区块链节点连接提供者（HTTP / WebSocket）
- **ABI**：Application Binary Interface，智能合约的接口描述文件
- **Contract 对象**：通过 ABI 和合约地址创建的合约实例，用于调用合约方法
- **Event 监听**：监听智能合约发出的事件日志

## 详细讲解

### 1. 安装与初始化

```bash
npm install web3
```

```typescript
// src/composables/useWeb3.ts
import Web3 from 'web3'
import { ref } from 'vue'

// WeBASE-Front 提供的节点 RPC 地址
const NODE_RPC_URL = import.meta.env.VITE_NODE_RPC_URL || 'http://localhost:5002/WeBASE-Front/web3/1'

export function useWeb3() {
  const web3 = ref<Web3 | null>(null)
  const isConnected = ref(false)
  const currentBlockNumber = ref(0)
  const error = ref<string | null>(null)

  // 初始化 Web3 实例
  const initWeb3 = () => {
    try {
      web3.value = new Web3(new Web3.providers.HttpProvider(NODE_RPC_URL))
      isConnected.value = true
      console.log('Web3 连接成功')
    } catch (err) {
      error.value = 'Web3 初始化失败'
      console.error('Web3 初始化失败:', err)
    }
  }

  // 获取当前区块高度
  const getBlockNumber = async () => {
    if (!web3.value) return
    try {
      const blockNumber = await web3.value.eth.getBlockNumber()
      currentBlockNumber.value = Number(blockNumber)
      return currentBlockNumber.value
    } catch (err) {
      error.value = '获取区块高度失败'
    }
  }

  // 获取区块详情
  const getBlock = async (blockNumber: number | string) => {
    if (!web3.value) return null
    try {
      return await web3.value.eth.getBlock(blockNumber, true)
    } catch (err) {
      error.value = '获取区块详情失败'
      return null
    }
  }

  // 获取交易详情
  const getTransaction = async (txHash: string) => {
    if (!web3.value) return null
    try {
      return await web3.value.eth.getTransaction(txHash)
    } catch (err) {
      error.value = '获取交易详情失败'
      return null
    }
  }

  // 获取交易回执
  const getTransactionReceipt = async (txHash: string) => {
    if (!web3.value) return null
    try {
      return await web3.value.eth.getTransactionReceipt(txHash)
    } catch (err) {
      error.value = '获取交易回执失败'
      return null
    }
  }

  // 获取账户余额
  const getBalance = async (address: string) => {
    if (!web3.value) return '0'
    try {
      const balance = await web3.value.eth.getBalance(address)
      return web3.value.utils.fromWei(balance, 'ether')
    } catch (err) {
      error.value = '获取余额失败'
      return '0'
    }
  }

  // 单位转换工具
  const toWei = (value: string, unit: string = 'ether') => {
    if (!web3.value) return '0'
    return web3.value.utils.toWei(value, unit)
  }

  const fromWei = (value: string, unit: string = 'ether') => {
    if (!web3.value) return '0'
    return web3.value.utils.fromWei(value, unit)
  }

  return {
    web3,
    isConnected,
    currentBlockNumber,
    error,
    initWeb3,
    getBlockNumber,
    getBlock,
    getTransaction,
    getTransactionReceipt,
    getBalance,
    toWei,
    fromWei
  }
}
```

### 2. 合约交互（src/composables/useContract.ts）

```typescript
import Web3 from 'web3'
import { ref } from 'vue'
import type { Contract, EventLog } from 'web3-eth-contract'

export function useContract(
  web3: Web3,
  contractABI: any[],
  contractAddress: string
) {
  const contract = ref<Contract<typeof contractABI> | null>(null)
  const error = ref<string | null>(null)

  // 创建合约实例
  const initContract = () => {
    try {
      contract.value = new web3.eth.Contract(contractABI, contractAddress)
      console.log('合约实例创建成功')
    } catch (err) {
      error.value = '合约实例创建失败'
    }
  }

  // 调用合约只读方法（call）
  const callMethod = async (methodName: string, ...args: any[]) => {
    if (!contract.value) return null
    try {
      return await contract.value.methods[methodName](...args).call()
    } catch (err) {
      error.value = `调用合约方法 ${methodName} 失败`
      return null
    }
  }

  // 发送交易（修改状态的方法）
  const sendTransaction = async (
    methodName: string,
    fromAddress: string,
    ...args: any[]
  ) => {
    if (!contract.value) return null
    try {
      const gasEstimate = await contract.value.methods[methodName](...args)
        .estimateGas({ from: fromAddress })

      return await contract.value.methods[methodName](...args)
        .send({
          from: fromAddress,
          gas: Math.floor(Number(gasEstimate) * 1.2)  // 预留 20% 余量
        })
    } catch (err) {
      error.value = `发送交易 ${methodName} 失败`
      return null
    }
  }

  // 监听合约事件
  const listenEvent = (
    eventName: string,
    callback: (event: EventLog) => void
  ) => {
    if (!contract.value) return
    contract.value.events[eventName]()
      .on('data', callback)
      .on('error', (err: Error) => {
        error.value = `监听事件 ${eventName} 失败: ${err.message}`
      })
  }

  return {
    contract,
    error,
    initContract,
    callMethod,
    sendTransaction,
    listenEvent
  }
}
```

### 3. 页面中使用

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useWeb3 } from '@/composables/useWeb3'
import { useContract } from '@/composables/useContract'
import contractABI from '@/abi/MyContract.json'

const { web3, initWeb3, getBlockNumber, currentBlockNumber } = useWeb3()
const { initContract, callMethod, listenEvent } = useContract(
  web3.value!,
  contractABI,
  '0x1234567890abcdef...'
)

onMounted(async () => {
  initWeb3()
  await getBlockNumber()
  initContract()

  // 监听 Transfer 事件
  listenEvent('Transfer', (event) => {
    console.log('Transfer 事件:', event.returnValues)
  })
})
</script>
```

## 重点内容

- Web3.js 通过 `HttpProvider` 或 `WebsocketProvider` 连接区块链节点
- 合约方法调用分为两种：`call()`（只读，不消耗 Gas）和 `send()`（修改状态，消耗 Gas）
- `estimateGas()` 用于预估交易所需的 Gas 量
- 交易回执（Transaction Receipt）包含交易执行结果、Gas 消耗、事件日志等
- `fromWei()` / `toWei()` 用于以太币单位转换

## 实际应用场景

- 直接调用智能合约方法（如查询代币余额）
- 发送交易到区块链（如转账、存证上链）
- 监听合约事件（如转账通知、状态变更）
- 区块链浏览器开发（查询区块、交易信息）

## 注意事项

- Web3.js 连接需要区块链节点开放 RPC 接口
- 交易需要消耗 Gas，需确保账户有足够余额
- `send()` 方法返回的是交易回执的 Promise，异步处理
- 智能合约事件监听需要 WebSocket 连接（HTTP Provider 不支持）
- FISCO BCOS 对 Web3.js 兼容但可能有差异，以官方文档为准

## 常见误区

- 误区：混淆 `call()` 和 `send()`，修改状态的方法用了 `call()`
- 误区：不执行 `estimateGas()` 直接硬编码 Gas 值
- 误区：忘记处理交易失败的情况（revert）
- 误区：事件监听不注销导致内存泄漏

## 关联知识点

- [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation)
- [智能合约前端调用](/knowledge/smart-contract-frontend)
- [区块链数据可视化](/knowledge/blockchain-data-visualization)

## 官方资源扩展

- [Web3.js 官方文档](https://docs.web3js.org/) - Web3.js v4 完整官方文档，最佳学习资源
- [Web3.js GitHub](https://github.com/web3/web3.js) - 源码和示例
- [FISCO BCOS Web3.js 使用指南](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/sdk/javascript_sdk/index.html) - FISCO BCOS 官方 JS SDK 文档
- [ethers.js 官方文档](https://docs.ethers.org/v6/) - 另一主流区块链 JS 库，轻量替代方案