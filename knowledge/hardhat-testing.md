# Hardhat 测试框架

## 竞赛关联

比赛要求选手使用 Hardhat 框架完成智能合约的编译、部署和功能测试。Hardhat 是以太坊生态最主流的开发环境，选手需要掌握其核心功能：编译合约、编写测试脚本、使用 Fixture、Gas 报告等。

## 核心技能

- **Hardhat 项目初始化**：项目结构、配置文件
- **合约编译**：`npx hardhat compile`
- **本地测试网络**：Hardhat Network
- **测试脚本**：Mocha + Chai + ethers.js
- **Fixture**：测试环境准备和复用
- **Gas 报告**：`hardhat-gas-reporter`

## 详细讲解

### 1. 项目初始化

```bash
# 创建项目
mkdir hardhat-project
cd hardhat-project
npm init -y

# 安装 Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 初始化 Hardhat 项目
npx hardhat init
```

项目结构：

```
hardhat-project/
├── contracts/          # 合约源码
│   └── Token.sol
├── test/               # 测试脚本
│   └── Token.test.js
├── scripts/            # 部署脚本
│   └── deploy.js
├── hardhat.config.js   # Hardhat 配置
└── package.json
```

### 2. hardhat.config.js 配置

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD"
  }
};
```

### 3. 测试脚本编写

```javascript
// test/Token.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token 合约", function () {
  // Fixture：部署合约，准备测试环境
  async function deployTokenFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("MyToken", "MTK", 18, 1000000);

    return { token, owner, user1, user2 };
  }

  // ===== 部署测试 =====
  describe("部署", function () {
    it("应该正确设置代币名称和符号", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
    });

    it("应该将初始供应量分配给部署者", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseUnits("1000000", 18));
    });
  });

  // ===== 转账测试 =====
  describe("转账", function () {
    it("应该正确转账", async function () {
      const { token, owner, user1 } = await loadFixture(deployTokenFixture);

      const amount = ethers.parseUnits("100", 18);
      await token.transfer(user1.address, amount);

      expect(await token.balanceOf(user1.address)).to.equal(amount);
      expect(await token.balanceOf(owner.address)).to.equal(
        ethers.parseUnits("999900", 18)
      );
    });

    it("余额不足时应该回滚", async function () {
      const { token, user1, user2 } = await loadFixture(deployTokenFixture);

      const amount = ethers.parseUnits("100", 18);
      await expect(
        token.connect(user1).transfer(user2.address, amount)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("应该触发 Transfer 事件", async function () {
      const { token, owner, user1 } = await loadFixture(deployTokenFixture);

      const amount = ethers.parseUnits("100", 18);
      await expect(token.transfer(user1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, user1.address, amount);
    });
  });

  // ===== 授权测试 =====
  describe("授权", function () {
    it("应该正确授权和授权转账", async function () {
      const { token, owner, user1, user2 } = await loadFixture(deployTokenFixture);

      const amount = ethers.parseUnits("50", 18);
      await token.approve(user1.address, amount);

      expect(await token.allowance(owner.address, user1.address)).to.equal(amount);

      await token.connect(user1).transferFrom(owner.address, user2.address, amount);
      expect(await token.balanceOf(user2.address)).to.equal(amount);
    });
  });

  // ===== 边界测试 =====
  describe("边界测试", function () {
    it("转账 0 金额应该成功", async function () {
      const { token, owner, user1 } = await loadFixture(deployTokenFixture);

      await token.transfer(user1.address, 0);
      expect(await token.balanceOf(user1.address)).to.equal(0);
    });

    it("不能向零地址转账", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      await expect(
        token.transfer(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("Invalid address");
    });
  });
});
```

### 4. 部署脚本

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("MyToken", "MTK", 18, 1000000);

  await token.waitForDeployment();
  console.log("Token 合约地址:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 5. 常用命令

```bash
# 编译合约
npx hardhat compile

# 运行测试
npx hardhat test

# 运行测试（含 Gas 报告）
REPORT_GAS=true npx hardhat test

# 运行单个测试文件
npx hardhat test test/Token.test.js

# 启动本地节点
npx hardhat node

# 部署到本地节点
npx hardhat run scripts/deploy.js --network localhost

# 部署到 Ganache
npx hardhat run scripts/deploy.js --network ganache
```

## 重点内容

- **Fixture** 用于复用部署环境，减少测试耗时
- `loadFixture` 在每个测试用例中重置状态，确保测试独立性
- `expect().to.emit()` 验证事件触发
- `expect().to.be.revertedWith()` 验证异常回滚
- `ethers.parseUnits("100", 18)` 转换为 Wei 单位
- `connect(user1)` 切换调用者身份

## 注意事项

- 测试文件必须放在 `test/` 目录下
- 合约编译后 ABI 在 `artifacts/` 目录
- Hardhat Network 默认有 20 个测试账户，每个 10000 ETH
- 测试之间状态隔离，需要 Fixture 重新部署

## 常见误区

- 误区：忘记 `await`，断言在异步操作完成前执行
- 误区：直接比较 BigNumber，应使用 `.to.equal()`
- 误区：测试脚本中未引入 `ethers` 和 `expect`
- 误区：`connect()` 后再调用 `token` 方法，忘记 `await`

## 官方资源扩展

- [Hardhat 官方文档](https://hardhat.org/docs) - 最权威的 Hardhat 完整文档
- [Hardhat 入门教程](https://hardhat.org/tutorial) - 官方入门教程
- [Hardhat 测试指南](https://hardhat.org/hardhat-runner/docs/guides/test-contracts) - 测试合约指南
- [ethers.js v6 文档](https://docs.ethers.org/v6/) - ethers.js 最新版文档