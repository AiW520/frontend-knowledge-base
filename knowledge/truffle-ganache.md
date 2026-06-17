# Truffle + Ganache

## 竞赛关联

比赛要求选手使用 Truffle 框架和 Ganache 本地测试网络完成合约部署和测试。Truffle 是以太坊经典的开发框架，选手需要掌握合约部署脚本编写、功能测试和边界测试。

## 核心技能

- **Truffle 项目初始化**：项目结构、truffle-config.js
- **Ganache 本地网络**：启动、配置、连接
- **部署脚本**：migrations 编写
- **功能测试**：正常流程测试
- **边界测试**：异常输入、极限值测试

## 详细讲解

### 1. 环境搭建

```bash
# 安装 Truffle
npm install -g truffle

# 安装 Ganache（GUI 或 CLI）
npm install -g ganache-cli

# 创建项目
mkdir truffle-project
cd truffle-project
truffle init
```

项目结构：

```
truffle-project/
├── contracts/          # 合约源码
│   └── Voting.sol
├── migrations/         # 部署脚本
│   └── 1_deploy_voting.js
├── test/               # 测试脚本
│   ├── voting.functional.test.js   # 功能测试
│   └── voting.boundary.test.js     # 边界测试
├── truffle-config.js   # Truffle 配置
└── package.json
```

### 2. truffle-config.js 配置

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,        // Ganache 默认端口
      network_id: "*"    // 匹配任何网络 ID
    },
    ganache_cli: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
```

### 3. 部署脚本

```javascript
// migrations/1_deploy_voting.js
const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
  // 部署投票合约，设置候选人列表
  const candidateNames = ["Alice", "Bob", "Charlie"];
  await deployer.deploy(Voting, candidateNames);

  const voting = await Voting.deployed();
  console.log("Voting 合约部署地址:", voting.address);
};
```

### 4. 功能测试

```javascript
// test/voting.functional.test.js
const Voting = artifacts.require("Voting");

contract("Voting - 功能测试", (accounts) => {
  let voting;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  before(async () => {
    voting = await Voting.deployed();
  });

  // 测试 1：部署后候选人初始化正确
  it("应该正确初始化候选人列表", async () => {
    const count = await voting.getCandidateCount();
    assert.equal(count.toNumber(), 3, "候选人数量应为 3");

    const candidate = await voting.candidates(0);
    assert.equal(candidate.name, "Alice", "第一个候选人应为 Alice");
    assert.equal(candidate.voteCount.toNumber(), 0, "初始票数为 0");
  });

  // 测试 2：正常投票
  it("应该允许投票", async () => {
    await voting.vote(0, { from: voter1 });  // 投给 Alice

    const candidate = await voting.candidates(0);
    assert.equal(candidate.voteCount.toNumber(), 1, "Alice 应获得 1 票");

    const hasVoted = await voting.hasVoted(voter1);
    assert.equal(hasVoted, true, "voter1 应标记为已投票");
  });

  // 测试 3：重复投票
  it("不应允许重复投票", async () => {
    try {
      await voting.vote(1, { from: voter1 });
      assert.fail("应该抛出异常");
    } catch (error) {
      assert(error.message.includes("Already voted"), "应提示已投票");
    }
  });

  // 测试 4：获取获胜者
  it("应该正确获取当前获胜者", async () => {
    await voting.vote(0, { from: voter2 });  // 也投给 Alice

    const winner = await voting.getWinner();
    assert.equal(winner, "Alice", "获胜者应为 Alice");
  });
});
```

### 5. 边界测试

```javascript
// test/voting.boundary.test.js
const Voting = artifacts.require("Voting");

contract("Voting - 边界测试", (accounts) => {
  let voting;
  const voter = accounts[5];

  before(async () => {
    voting = await Voting.deployed();
  });

  // 边界测试 1：无效的候选人 ID（负数）
  it("投票给负数 ID 应失败", async () => {
    try {
      await voting.vote(-1, { from: voter });
      assert.fail("应该抛出异常");
    } catch (error) {
      assert(error.message.includes("Invalid candidate"), "应提示无效候选人");
    }
  });

  // 边界测试 2：超出范围的候选人 ID
  it("投票给超出范围的 ID 应失败", async () => {
    try {
      await voting.vote(999, { from: voter });
      assert.fail("应该抛出异常");
    } catch (error) {
      assert(error.message.includes("Invalid candidate"), "应提示无效候选人");
    }
  });

  // 边界测试 3：零地址投票
  it("零地址不应能投票", async () => {
    try {
      await voting.vote(0, { from: "0x0000000000000000000000000000000000000000" });
      assert.fail("应该抛出异常");
    } catch (error) {
      assert(error.message.includes("Invalid address"), "应提示无效地址");
    }
  });

  // 边界测试 4：无人投票时获取获胜者
  it("无人投票时获取获胜者应返回空", async () => {
    // 部署新合约用于测试
    const newVoting = await Voting.new(["X", "Y"]);
    const winner = await newVoting.getWinner();
    assert.equal(winner, "", "获胜者应为空");
  });
});
```

### 6. 常用命令

```bash
# 启动 Ganache
ganache-cli

# 编译合约
truffle compile

# 部署合约
truffle migrate
truffle migrate --reset   # 重新部署

# 运行测试
truffle test

# 运行单个测试文件
truffle test test/voting.functional.test.js

# 进入 Truffle 控制台
truffle console
```

## 重点内容

- `artifacts.require("合约名")` 加载合约
- `contract("描述", (accounts) => {})` 定义测试套件
- `accounts` 数组是 Ganache 提供的 10 个测试账户
- `before` 在每个 `describe` 之前执行一次
- `assert.equal()` 断言相等，`assert.fail()` 主动失败
- `try-catch` 捕获异常，验证回滚

## 注意事项

- Truffle 使用 `web3.js` v1.x，注意与 ethers.js 的区别
- `toNumber()` 可能对大数字溢出，建议使用 `toString()`
- Ganache 默认端口是 7545，CLI 版本是 8545
- 部署脚本按文件名前缀数字顺序执行

## 常见误区

- 误区：忘记 `await`，断言在异步操作完成前执行
- 误区：`truffle test` 前未执行 `truffle migrate`
- 误区：`ganache-cli` 和 Ganache GUI 端口不一致
- 误区：边界测试中 `try-catch` 未捕获到异常

## 官方资源扩展

- [Truffle 官方文档](https://trufflesuite.com/docs/truffle/) - 最权威的 Truffle 文档
- [Ganache 官方文档](https://trufflesuite.com/docs/ganache/) - 本地测试网络文档
- [Truffle 测试指南](https://trufflesuite.com/docs/truffle/testing/testing-your-contracts/) - 合约测试完整指南
- [Mocha 测试框架](https://mochajs.org/) - JavaScript 测试框架文档