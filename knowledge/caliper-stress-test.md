# Caliper 压力测试

## 竞赛关联

比赛要求选手使用 Hyperledger Caliper 测试工具对智能合约进行压力测试，编写测试代码，设置交易数量和每秒交易数（TPS）。这是评估区块链系统性能的重要手段。

## 核心技能

- **Caliper 安装配置**：环境准备、依赖安装
- **测试配置文件**：网络配置、基准测试配置
- **测试脚本编写**：JavaScript 测试逻辑（deposit/withdraw 等）
- **性能指标**：TPS、延迟、成功率
- **结果分析**：HTML 报告解读

## 详细讲解

### 1. Caliper 环境准备

```bash
# 第一步：安装 Node.js（需要 v14+）
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 第二步：安装 Caliper CLI
npm install -g @hyperledger/caliper-cli@0.5.0

# 第三步：绑定 FISCO BCOS SDK
caliper bind --caliper-bind-sut fisco-bcos:2.9.1

# 第四步：创建测试项目目录
mkdir -p /root/tools/benchmarks/caliper-test
cd /root/tools/benchmarks/caliper-test
```

### 2. 网络配置文件

```yaml
# networks/fisco-bcos/network-config.json
{
  "caliper": {
    "blockchain": "fisco-bcos",
    "command": {
      "start": "bash start.sh",
      "end": "bash stop.sh"
    }
  },
  "fisco-bcos": {
    "config": {
      "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
      "account": "0x385d28f0f7e77457ccca23442a08eae202d8b840"
    },
    "network": {
      "nodes": [
        {
          "ip": "127.0.0.1",
          "rpcPort": "8545",
          "channelPort": "20200"
        }
      ],
      "authentication": {
        "key": "conf/sdk.key",
        "cert": "conf/sdk.crt",
        "ca": "conf/ca.crt"
      },
      "groupID": 1,
      "timeout": 100000
    }
  }
}
```

### 3. 基准测试配置文件

```yaml
# benchmarks/benchmark-config.yaml
test:
  name: Bank Contract Test
  description: 测试银行合约的存款和取款功能
  workers:
    number: 1
  rounds:
    # 第一轮：存款测试
    - label: deposit
      description: 测试存款功能
      txNumber: 500          # 总交易数量
      rateControl:
        type: fixed-rate
        opts:
          tps: 100           # 每秒交易数
      callback: benchmarks/bank-deposit.js

    # 第二轮：取款测试
    - label: withdraw
      description: 测试存款与取款功能
      txNumber: 300
      rateControl:
        type: fixed-rate
        opts:
          tps: 30
      callback: benchmarks/bank-withdraw.js

monitor:
  type: none
```

### 4. 存款测试脚本

```javascript
// benchmarks/bank-deposit.js
'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class BankDepositWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundConfig, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundConfig, sutAdapter, sutContext);
        // 加载合约 ABI 和地址
        this.contractAddress = '0x合约地址';
        this.contractABI = require('./Bank.json').abi;
    }

    async submitTransaction() {
        // 生成随机存款金额
        const amount = Math.floor(Math.random() * 1000) + 1;
        const fromAddress = this.sutAdapter.getContext().account;

        // 调用存款方法
        const request = {
            contract: this.contractAddress,
            abi: this.contractABI,
            func: 'deposit',
            args: [amount],
            from: fromAddress
        };

        await this.sutAdapter.sendRequests(request);
    }
}

function createWorkloadModule() {
    return new BankDepositWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
```

### 5. 取款测试脚本

```javascript
// benchmarks/bank-withdraw.js
'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class BankWithdrawWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundConfig, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundConfig, sutAdapter, sutContext);
        this.contractAddress = '0x合约地址';
        this.contractABI = require('./Bank.json').abi;
    }

    async submitTransaction() {
        this.txIndex++;
        const fromAddress = this.sutAdapter.getContext().account;

        // 交替执行存款和取款
        if (this.txIndex % 2 === 0) {
            // 存款
            const amount = Math.floor(Math.random() * 500) + 100;
            const request = {
                contract: this.contractAddress,
                abi: this.contractABI,
                func: 'deposit',
                args: [amount],
                from: fromAddress
            };
            await this.sutAdapter.sendRequests(request);
        } else {
            // 取款
            const amount = Math.floor(Math.random() * 100) + 10;
            const request = {
                contract: this.contractAddress,
                abi: this.contractABI,
                func: 'withdraw',
                args: [amount],
                from: fromAddress
            };
            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new BankWithdrawWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
```

### 6. 运行压力测试

```bash
# 启动 Caliper 测试
caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig benchmarks/benchmark-config.yaml \
  --caliper-networkconfig networks/fisco-bcos/network-config.json \
  --caliper-flow-only-test

# 测试完成后，查看 HTML 报告
ls report.html
```

## 重点内容

- `txNumber`：总交易数量，决定测试规模
- `rateControl.tps`：每秒交易数，控制测试速率
- 测试脚本必须继承 `WorkloadModuleBase`，实现 `submitTransaction` 方法
- 网络配置需要正确的节点证书和私钥
- Caliper 自动生成 HTML 报告，包含 TPS、延迟、成功率等指标

## 注意事项

- Caliper 版本需要与 FISCO BCOS 版本匹配（通过 `caliper bind` 绑定）
- 测试脚本中的合约地址和 ABI 必须与实际部署的合约一致
- 测试账户需要足够的余额支付 Gas 费
- 测试前需要确保所有节点正常运行

## 常见误区

- 误区：忘记执行 `caliper bind`，SDK 未绑定
- 误区：网络配置中证书路径错误，无法连接节点
- 误区：`txNumber` 和 `tps` 设置过大，测试超时
- 误区：测试脚本中未正确导入合约 ABI

## 官方资源扩展

- [Hyperledger Caliper 官方文档](https://hyperledger-caliper.github.io/caliper/) - 最权威的 Caliper 使用指南
- [FISCO BCOS Caliper 适配](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/caliper.html) - FISCO BCOS 官方压测指南
- [Caliper GitHub](https://github.com/hyperledger/caliper) - 源码和示例
- [FISCO BCOS 性能优化](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/performance.html) - 性能调优指南