# FISCO BCOS 区块链搭建

## 竞赛关联

比赛第一部分要求选手在 Linux 环境下使用运维工具搭建区块链网络，包括节点部署、端口配置、群组管理等。这是整个区块链平台的基础，链搭建成功后后续所有操作才能进行。

## 核心技能

- **generator 工具**：企业级运维工具，一键生成节点配置
- **build_chain.sh**：快速搭建脚本，适合测试环境
- **节点管理**：新增节点、加入群组、启停节点
- **端口配置**：P2P 端口、Channel 端口、RPC 端口
- **证书管理**：节点证书、SDK 证书

## 详细讲解

### 1. 使用 generator 搭建区块链

generator 是 FISCO BCOS 的企业级运维工具，支持多群组、多节点部署：

```bash
# 第一步：下载 generator
cd /root/tools
git clone https://gitee.com/FISCO-BCOS/generator.git
cd generator

# 第二步：下载 FISCO BCOS 二进制文件
./generator --download_fisco ./meta

# 第三步：生成节点证书
./generator --generate_chain_certificate ./dir_chain_ca

# 第四步：生成机构证书
./generator --generate_agency_certificate ./dir_agency_ca ./dir_chain_ca agencyA

# 第五步：生成节点证书（4个节点）
./generator --generate_node_certificate ./dir_node_cert ./dir_agency_ca agencyA node0
./generator --generate_node_certificate ./dir_node_cert ./dir_agency_ca agencyA node1
./generator --generate_node_certificate ./dir_node_cert ./dir_agency_ca agencyA node2
./generator --generate_node_certificate ./dir_node_cert ./dir_agency_ca agencyA node3

# 第六步：生成节点配置文件
./generator --generate_group_config_files ./conf ./dir_node_cert agencyA \
  ./node_deployment.ini

# 第七步：启动节点
./generator --build_install_package ./meta/fisco-bcos ./node_deployment.ini
```

### 2. node_deployment.ini 配置示例

```ini
[group]
group_id=1

[node0]
p2p_ip=127.0.0.1
listen_ip=0.0.0.0
p2p_listen_port=30300
channel_listen_port=20200
jsonrpc_listen_port=8545

[node1]
p2p_ip=127.0.0.1
listen_ip=0.0.0.0
p2p_listen_port=30301
channel_listen_port=20201
jsonrpc_listen_port=8546

[node2]
p2p_ip=127.0.0.1
listen_ip=0.0.0.0
p2p_listen_port=30302
channel_listen_port=20202
jsonrpc_listen_port=8547

[node3]
p2p_ip=127.0.0.1
listen_ip=0.0.0.0
p2p_listen_port=30303
channel_listen_port=20203
jsonrpc_listen_port=8548
```

### 3. 使用 build_chain.sh 快速搭建（测试环境）

```bash
# 第一步：下载 build_chain.sh
curl -LO https://github.com/FISCO-BCOS/FISCO-BCOS/releases/download/v2.9.1/build_chain.sh
chmod +x build_chain.sh

# 第二步：搭建单群组 4 节点链
bash build_chain.sh -l 127.0.0.1:4 -p 30300,20200,8545

# 第三步：启动所有节点
bash nodes/127.0.0.1/start_all.sh

# 第四步：检查节点进程
ps -ef | grep fisco-bcos
```

### 4. 新增节点加入群组

```bash
# 第一步：生成新节点证书
./generator --generate_node_certificate ./dir_node_cert ./dir_agency_ca agencyA node4

# 第二步：生成节点配置文件
./generator --generate_group_config_files ./conf ./dir_node_cert agencyA \
  ./node4_deployment.ini

# 第三步：将新节点加入群组 1
# 通过控制台执行
[group:1]> addSealer node4_node_id
[group:1]> addObserver node4_node_id
```

### 5. 节点启停与状态查看

```bash
# 启动单个节点
bash nodes/127.0.0.1/node0/start.sh

# 停止单个节点
bash nodes/127.0.0.1/node0/stop.sh

# 启动所有节点
bash nodes/127.0.0.1/start_all.sh

# 查看节点状态
tail -f nodes/127.0.0.1/node0/log/log* | grep "connected"

# 查看共识状态
tail -f nodes/127.0.0.1/node0/log/log* | grep "Report"
```

## 重点内容

- **generator** 适合生产环境，支持多群组、多机构
- **build_chain.sh** 适合快速测试，一键搭建
- 三个端口：P2P（节点间通信）、Channel（SDK 连接）、RPC（JSON-RPC 接口）
- 节点角色：Sealer（共识节点）、Observer（观察节点）
- 节点证书是身份凭证，必须妥善保管

## 注意事项

- generator 需要 Python 3 环境
- 端口不能冲突，每增加一个节点需要递增端口号
- 启动节点前确保前置节点已稳定运行
- 证书过期需要重新生成

## 常见误区

- 误区：忘记给 build_chain.sh 添加执行权限
- 误区：端口重复导致节点启动失败
- 误区：证书路径配置错误，节点间无法通信
- 误区：新增节点后忘记执行 addSealer，节点不参与共识

## 官方资源扩展

- [FISCO BCOS 搭建第一个区块链网络](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/installation.html) - 官方快速搭建教程
- [FISCO BCOS generator 文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/enterprise_tools/generator.html) - 企业级运维工具文档
- [FISCO BCOS 节点管理](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/node_management.html) - 节点增删改查
- [FISCO BCOS GitHub](https://github.com/FISCO-BCOS/FISCO-BCOS) - 源码仓库