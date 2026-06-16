# 智能合约前端调用

## 知识简介

智能合约是区块链应用的核心，前端需要能够部署合约、调用合约方法、监听合约事件。在金砖大赛中，选手需要通过 WeBASE-Front 或 Web3.js 在前端实现对智能合约的完整操作。本知识点以 Solidity 编写的 ERC-20 代币合约为例，展示前端如何与智能合约进行全生命周期交互。

## 核心概念

- **智能合约**：运行在区块链上的自动化程序，由 Solidity 语言编写
- **ABI（Application Binary Interface）**：描述合约方法和事件的 JSON 文件，前端调用合约的"说明书"
- **合约部署**：将合约字节码发送到区块链，创建合约实例
- **合约调用**：分为只读调用（call）和状态修改交易（send）
- **事件日志**：合约执行过程中 emit 的日志，前端可监听

## 详细讲解

### 1. 合约 ABI 示例（ERC-20 代币）

```json
[
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "success", "type": "bool"}],
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "_from", "type": "address"},
      {"indexed": true, "name": "_to", "type": "address"},
      {"indexed": false, "name": "_value", "type": "uint256"}
    ],
    "name": "Transfer",
    "type": "event"
  }
]
```

### 2. 合约操作 Composable（src/composables/useContract.ts）

```typescript
import { ref } from 'vue'
import Web3 from 'web3'
import type { Contract, EventLog } from 'web3-eth-contract'

interface ContractCallResult {
  success: boolean
  data?: any
  txHash?: string
  error?: string
}

export function useContractOperations(web3: Web3) {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 部署合约
   */
  const deployContract = async (
    abi: any[],
    bytecode: string,
    fromAddress: string,
    constructorArgs: any[] = []
  ): Promise<ContractCallResult> => {
    loading.value = true
    error.value = null

    try {
      const contract = new web3.eth.Contract(abi)
      const deploy = contract.deploy({
        data: bytecode,
        arguments: constructorArgs
      })

      const gas = await deploy.estimateGas({ from: fromAddress })
      const deployedContract = await deploy.send({
        from: fromAddress,
        gas: Math.floor(Number(gas) * 1.2)
      })

      return {
        success: true,
        data: deployedContract.options.address,
        txHash: (deployedContract as any).transactionHash
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 调用只读方法（如 balanceOf）
   */
  const callReadMethod = async (
    abi: any[],
    contractAddress: string,
    methodName: string,
    args: any[] = []
  ): Promise<ContractCallResult> => {
    loading.value = true
    error.value = null

    try {
      const contract = new web3.eth.Contract(abi, contractAddress)
      const result = await contract.methods[methodName](...args).call()

      return { success: true, data: result }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 发送交易（如 transfer）
   */
  const sendTransaction = async (
    abi: any[],
    contractAddress: string,
    methodName: string,
    fromAddress: string,
    args: any[] = []
  ): Promise<ContractCallResult> => {
    loading.value = true
    error.value = null

    try {
      const contract = new web3.eth.Contract(abi, contractAddress)
      const method = contract.methods[methodName](...args)

      const gas = await method.estimateGas({ from: fromAddress })
      const result = await method.send({
        from: fromAddress,
        gas: Math.floor(Number(gas) * 1.2)
      })

      return {
        success: true,
        txHash: result.transactionHash,
        data: result
      }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * 监听合约事件
   */
  const watchEvent = (
    abi: any[],
    contractAddress: string,
    eventName: string,
    callback: (event: EventLog) => void,
    filterOptions: Record<string, any> = {}
  ) => {
    const contract = new web3.eth.Contract(abi, contractAddress)

    contract.events[eventName]({
      filter: filterOptions,
      fromBlock: 'latest'
    })
      .on('data', callback)
      .on('error', (err: Error) => {
        error.value = `监听事件失败: ${err.message}`
      })

    // 返回取消监听函数
    return () => {
      contract.events[eventName]().removeAllListeners()
    }
  }

  return {
    loading,
    error,
    deployContract,
    callReadMethod,
    sendTransaction,
    watchEvent
  }
}
```

### 3. 前端页面示例：代币转账

```vue
<template>
  <el-card class="contract-card">
    <template #header>
      <span>合约交互 - ERC-20 代币</span>
    </template>

    <!-- 部署合约 -->
    <el-form label-width="120px" v-if="!contractAddress">
      <el-form-item label="合约名称">
        <el-input v-model="contractName" placeholder="MyToken" />
      </el-form-item>
      <el-form-item label="初始供应量">
        <el-input v-model="initialSupply" placeholder="1000000" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleDeploy"
          :loading="loading"
        >
          部署合约
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 合约已部署，显示交互界面 -->
    <div v-else>
      <el-alert
        :title="`合约地址: ${contractAddress}`"
        type="success"
        :closable="false"
        show-icon
      />

      <el-divider />

      <!-- 查询余额 -->
      <el-form label-width="120px" inline>
        <el-form-item label="查询地址">
          <el-input v-model="queryAddress" placeholder="0x..." style="width: 300px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleBalanceOf">查询余额</el-button>
          <span v-if="balance !== null" class="balance-result">
            余额: {{ balance }}
          </span>
        </el-form-item>
      </el-form>

      <el-divider />

      <!-- 转账 -->
      <el-form label-width="120px">
        <el-form-item label="接收地址">
          <el-input v-model="toAddress" placeholder="0x..." style="width: 400px" />
        </el-form-item>
        <el-form-item label="转账金额">
          <el-input-number v-model="transferAmount" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleTransfer"
            :loading="transferLoading"
          >
            转账
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <!-- 交易记录 -->
      <el-table :data="transferEvents" stripe>
        <el-table-column prop="from" label="发送方" min-width="200" />
        <el-table-column prop="to" label="接收方" min-width="200" />
        <el-table-column prop="value" label="金额" width="150" />
      </el-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeb3 } from '@/composables/useWeb3'
import { useContractOperations } from '@/composables/useContract'

const { web3 } = useWeb3()
const { loading, deployContract, callReadMethod, sendTransaction, watchEvent } =
  useContractOperations(web3.value!)

const contractAddress = ref('')
const contractName = ref('MyToken')
const initialSupply = ref('1000000')
const queryAddress = ref('')
const balance = ref<string | null>(null)
const toAddress = ref('')
const transferAmount = ref(0)
const transferLoading = ref(false)
const transferEvents = ref<any[]>([])

const handleDeploy = async () => {
  const result = await deployContract(
    erc20ABI,
    erc20Bytecode,
    userAddress.value,
    [contractName.value, initialSupply.value]
  )
  if (result.success) {
    contractAddress.value = result.data
    startWatchingEvents()
  }
}

const handleBalanceOf = async () => {
  const result = await callReadMethod(
    erc20ABI,
    contractAddress.value,
    'balanceOf',
    [queryAddress.value]
  )
  if (result.success) {
    balance.value = result.data
  }
}

const handleTransfer = async () => {
  transferLoading.value = true
  const result = await sendTransaction(
    erc20ABI,
    contractAddress.value,
    'transfer',
    userAddress.value,
    [toAddress.value, transferAmount.value]
  )
  if (result.success) {
    ElMessage.success(`转账成功! 交易哈希: ${result.txHash}`)
  }
  transferLoading.value = false
}

const startWatchingEvents = () => {
  watchEvent(erc20ABI, contractAddress.value, 'Transfer', (event) => {
    transferEvents.value.unshift({
      from: (event.returnValues as any).from,
      to: (event.returnValues as any).to,
      value: (event.returnValues as any).value
    })
  })
}
</script>
```

## 重点内容

- **ABI 是合约交互的关键**：没有 ABI 无法调用合约方法
- **只读方法用 `call()`**：不消耗 Gas，不产生交易
- **状态修改方法用 `send()`**：消耗 Gas，需要等待区块链确认
- **事件监听**：用于实时更新 UI（如监听转账事件刷新余额）
- **Gas 估算**：`estimateGas()` 避免 Gas 不足导致交易失败

## 实际应用场景

- 代币转账界面（ERC-20）
- 存证上链（证书哈希存储）
- 供应链溯源（商品流转记录）
- 投票系统（链上投票统计）

## 注意事项

- 合约地址在部署后保持不变，需要妥善保存
- 合约一旦部署，代码无法修改（需重新部署新合约）
- `send()` 是异步操作，交易确认需要时间，前端需要显示 loading 状态
- 事件监听需要及时取消，避免内存泄漏
- 用户地址需要解锁（unlock）才能发送交易

## 常见误区

- 误区：修改状态的方法用了 `call()` 而不是 `send()`
- 误区：ABI 与合约版本不匹配导致调用失败
- 误区：Gas 设置过低导致交易一直 pending
- 误区：忽略 `send()` 返回的交易回执中的 `events` 字段

## 关联知识点

- [Web3.js 区块链交互](/knowledge/web3-blockchain-interaction)
- [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation)
- [Element Plus 组件库](/knowledge/element-plus)

## 官方资源扩展

- [Solidity 官方文档](https://docs.soliditylang.org/zh/latest/) - Solidity 智能合约语言官方中文文档
- [OpenZeppelin 合约库](https://docs.openzeppelin.com/contracts/) - 业界标准的安全合约模板（ERC-20/ERC-721 等）
- [FISCO BCOS 智能合约开发](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/develop/smart_contract.html) - FISCO BCOS 官方合约开发指南
- [Remix IDE](https://remix.ethereum.org/) - 在线 Solidity 开发环境，快速测试合约