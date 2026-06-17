# 区块链节点监控

## 竞赛关联

比赛要求选手编写 Shell 脚本实现节点监控：模拟节点故障并生成异常日志、计算平均出块速度。这考察选手对区块链运行状态的理解和 Linux Shell 脚本编写能力。

## 核心技能

- **Shell 脚本编写**：变量、循环、条件判断、函数
- **节点状态检测**：检查进程是否存在、端口是否监听
- **日志生成**：使用 `echo` 和 `logger` 记录日志
- **出块速度计算**：定期查询区块高度，计算块高差/时间差
- **模拟交易**：通过 Console 或 SDK 发送批量交易

## 详细讲解

### 1. 节点异常监控脚本

当节点故障时，需要自动检测并生成告警日志：

```bash
#!/bin/bash
# monitor_node.sh - 节点异常监控脚本

MONITOR_INTERVAL=300  # 每 5 分钟检查一次
LOG_FILE="/var/log/blockchain/monitor.log"
NODE_PID_FILE="/root/tools/generator/nodes/127.0.0.1/node1/data/node.pid"

# 创建日志目录
mkdir -p $(dirname $LOG_FILE)

while true; do
    # 检查节点进程是否存在
    if [ -f "$NODE_PID_FILE" ]; then
        PID=$(cat $NODE_PID_FILE)
        if ps -p $PID > /dev/null 2>&1; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] 节点1 运行正常 (PID: $PID)" >> $LOG_FILE
        else
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] 节点1 进程异常退出 (PID: $PID 不存在)" >> $LOG_FILE
        fi
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] 节点1 PID 文件不存在，节点可能未启动" >> $LOG_FILE
    fi

    # 检查端口是否监听
    if netstat -tlnp 2>/dev/null | grep -q ":30301"; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] 节点1 P2P 端口 30301 正常监听" >> $LOG_FILE
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] 节点1 P2P 端口 30301 未监听" >> $LOG_FILE
    fi

    sleep $MONITOR_INTERVAL
done
```

### 2. 模拟交易脚本

通过 Console 发送批量交易，用于测试区块链性能：

```bash
#!/bin/bash
# simulate_tx.sh - 模拟交易脚本
# 发送 200 笔交易（10 轮 × 20 笔，总耗时 45 秒）

CONSOLE_DIR="/root/tools/fisco/console"
CONTRACT_ADDRESS="0x合约地址"  # 已部署的合约地址
TOTAL_ROUNDS=10
TX_PER_ROUND=20
SLEEP_TIME=4.5  # 每轮间隔 4.5 秒，总耗时约 45 秒

echo "开始模拟交易..."
echo "总轮数: $TOTAL_ROUNDS, 每轮交易数: $TX_PER_ROUND"

for round in $(seq 1 $TOTAL_ROUNDS); do
    echo "第 $round 轮：发送 $TX_PER_ROUND 笔交易"

    for tx in $(seq 1 $TX_PER_ROUND); do
        # 通过 Console 调用合约方法
        cd $CONSOLE_DIR
        bash start.sh <<EOF
call HelloWorld $CONTRACT_ADDRESS set "tx_${round}_${tx}"
exit
EOF
    done

    sleep $SLEEP_TIME
done

echo "模拟交易完成！共发送 $((TOTAL_ROUNDS * TX_PER_ROUND)) 笔交易"
```

### 3. 计算平均出块速度

定期查询区块高度，计算平均出块速度：

```bash
#!/bin/bash
# block_speed.sh - 计算平均出块速度
# 每隔 10 秒查询一次，共查询 5 次，计算平均出块速度

CONSOLE_DIR="/root/tools/fisco/console"
QUERY_INTERVAL=10  # 查询间隔（秒）
QUERY_COUNT=5      # 查询次数

echo "开始计算平均出块速度..."
echo "查询间隔: ${QUERY_INTERVAL}秒, 查询次数: ${QUERY_COUNT}次"

# 函数：获取当前区块高度
get_block_number() {
    cd $CONSOLE_DIR
    bash start.sh <<EOF | grep "block number" | awk '{print $NF}'
getBlockNumber
exit
EOF
}

# 第一次查询
FIRST_BLOCK=$(get_block_number)
echo "第 1 次查询：区块高度 = $FIRST_BLOCK"
PREV_BLOCK=$FIRST_BLOCK

# 后续查询
for i in $(seq 2 $QUERY_COUNT); do
    sleep $QUERY_INTERVAL
    CURRENT_BLOCK=$(get_block_number)
    echo "第 $i 次查询：区块高度 = $CURRENT_BLOCK"
    PREV_BLOCK=$CURRENT_BLOCK
done

# 计算平均出块速度
BLOCK_DIFF=$((CURRENT_BLOCK - FIRST_BLOCK))
TOTAL_TIME=$(((QUERY_COUNT - 1) * QUERY_INTERVAL))
AVG_SPEED=$(echo "scale=2; $BLOCK_DIFF / $TOTAL_TIME" | bc)

echo "================================"
echo "块高差: $BLOCK_DIFF"
echo "总时间: ${TOTAL_TIME} 秒"
echo "平均出块速度: ${AVG_SPEED} 块/秒"
echo "================================"
```

### 4. 节点故障模拟与恢复

```bash
#!/bin/bash
# simulate_fault.sh - 模拟节点故障

NODE1_DIR="/root/tools/generator/nodes/127.0.0.1/node1"

# 1. 暂停节点 1（模拟故障）
echo "模拟节点 1 故障..."
bash $NODE1_DIR/stop.sh

# 2. 等待 60 秒，观察监控日志
echo "等待 60 秒，观察监控日志..."
sleep 60
tail -5 /var/log/blockchain/monitor.log

# 3. 恢复节点 1
echo "恢复节点 1..."
bash $NODE1_DIR/start.sh

# 4. 验证节点恢复
sleep 5
tail -3 /var/log/blockchain/monitor.log
```

## 重点内容

- Shell 脚本使用 `#!/bin/bash` 声明解释器
- `while true` 实现持续监控，`sleep` 控制轮询间隔
- 节点状态检测：进程检测（PID）+ 端口检测（netstat）
- 出块速度 = 块高差 / 总时间，单位是「块/秒」
- 使用 `echo` 配合 `>>` 追加日志到文件

## 注意事项

- 脚本需要添加执行权限 `chmod +x script.sh`
- 日志文件路径需要提前创建目录
- 监控脚本应以后台进程运行 `nohup bash monitor.sh &`
- 出块速度计算需要至少 2 次查询

## 常见误区

- 误区：忘记 `chmod +x`，脚本无法执行
- 误区：使用绝对路径而非相对路径，脚本迁移后失效
- 误区：`sleep` 时间设置过短，频繁查询影响性能
- 误区：日志文件未设置轮转，导致磁盘占满

## 官方资源扩展

- [FISCO BCOS 节点监控](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/manual/node_management.html#id18) - 节点状态监控
- [Bash 脚本教程](https://www.gnu.org/software/bash/manual/bash.html) - GNU Bash 官方手册
- [Linux Shell 编程](https://tldp.org/LDP/abs/html/) - 高级 Bash 脚本编程指南