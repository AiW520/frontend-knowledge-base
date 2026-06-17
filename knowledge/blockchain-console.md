# 区块链控制台 Console

## 竞赛关联

比赛要求选手安装并部署区块链控制台 Console，完成账户管理、角色分配、合约部署、交易池查询等运维操作。Console 是运维人员与区块链交互的主要工具。

## 核心技能

- **Console 安装部署**：下载、配置、启动
- **账户管理**：生成账户、切换账户、导入私钥
- **角色管理**：链管理账户、运维账户、普通账户
- **合约部署**：通过 Console 部署 Solidity 合约
- **交易池管理**：查询待处理交易、设置打包参数
- **Gas 设置**：配置区块打包交易数和 Gas 上限

## 详细讲解

### 1. 安装与部署 Console

```bash
# 第一步：下载 Console
cd /root/tools/fisco
curl -LO https://github.com/FISCO-BCOS/console/releases/download/v2.9.2/download_console.sh
bash download_console.sh

# 第二步：拷贝节点证书
cp -r /root/tools/generator/nodes/127.0.0.1/sdk/* console/conf/

# 第三步：配置 console/conf/applicationContext.xml
# 确保 channelPort 与节点配置一致

# 第四步：启动 Console
cd console
bash start.sh
```

### 2. 账户管理

```bash
# 进入 Console 后执行

# 生成新账户（使用 get_account.sh 脚本）
bash get_account.sh
# 输出：账户地址和私钥

# 生成 3 个账户
bash get_account.sh account1
bash get_account.sh account2
bash get_account.sh account3

# 在 Console 中加载账户
[group:1]> newAccount
# 输出：0x1234...（账户地址）

# 查看当前账户列表
[group:1]> listAccount
```

### 3. 角色管理

```bash
# 设置账户为链管理账户（Chain Administrator）
[group:1]> grantCommitteeMember 0x账户1地址

# 验证链管理账户
[group:1]> listCommitteeMembers

# 使用账户2部署合约（运维账户）
[group:1]> deployHelloWorld

# 设置账户3拥有节点管理权限
[group:1]> grantOperator 0x账户3地址

# 设置节点为观察节点
[group:1]> addObserver node4_id
```

### 4. 合约部署

```bash
# 部署 HelloWorld 合约
[group:1]> deploy HelloWorld

# 调用合约方法
[group:1]> call HelloWorld 0x合约地址 get

[group:1]> call HelloWorld 0x合约地址 set "Hello, FISCO BCOS"

# 查看合约信息
[group:1]> getDeployLog
```

### 5. 交易池管理

```bash
# 查询待处理的交易数量
[group:1]> getPendingTxSize

# 查询交易池中的交易
[group:1]> getPendingTransactions

# 设置区块最大打包交易数
[group:1]> setSystemConfigByKey tx_count_limit 2000

# 设置交易执行允许消耗的最大 Gas
[group:1]> setSystemConfigByKey tx_gas_limit 500000000

# 查看系统配置
[group:1]> getSystemConfigByKey tx_count_limit
[group:1]> getSystemConfigByKey tx_gas_limit
```

### 6. Console 常用命令速查

| 命令 | 说明 |
|------|------|
| `getBlockNumber` | 获取当前区块高度 |
| `getBlockByNumber 1` | 根据区块号查询区块 |
| `getBlockByHash 0x...` | 根据区块哈希查询区块 |
| `getTransactionByHash 0x...` | 根据交易哈希查询交易 |
| `getPeers` | 查看节点连接信息 |
| `getGroupPeers` | 查看群组内节点 |
| `getSealerList` | 查看共识节点列表 |
| `getObserverList` | 查看观察节点列表 |
| `getNodeVersion` | 查看节点版本 |
| `getTotalTransactionCount` | 查看总交易数 |

## 重点内容

- Console 通过 Channel 协议与节点通信，需要配置正确的证书
- 链管理账户拥有最高权限，可以设置系统参数
- 运维账户可以部署合约、管理节点
- 交易池参数影响区块链性能：`tx_count_limit` 控制每块交易数，`tx_gas_limit` 控制单笔交易 Gas 上限
- 观察节点不参与共识，只同步区块数据

## 注意事项

- Console 启动前必须确保节点证书已正确拷贝
- 每个账户需要充值才能发送交易（消耗 Gas）
- 链管理账户权限极高，应妥善保管私钥
- 修改系统参数后需要新产生的区块才能生效

## 常见误区

- 误区：Console 证书路径配置错误，启动失败
- 误区：忘记充值账户，部署合约时 Gas 不足
- 误区：使用普通账户执行管理操作，权限不足
- 误区：修改 `tx_count_limit` 过大，导致共识超时

## 官方资源扩展

- [FISCO BCOS Console 文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/console.html) - Console 完整使用手册
- [FISCO BCOS 控制台命令](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/console_of_java_sdk.html) - 所有命令参考
- [FISCO BCOS 系统配置](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/configuration.html) - 系统参数配置
- [FISCO BCOS Java SDK](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/sdk/java_sdk/index.html) - Java SDK 文档