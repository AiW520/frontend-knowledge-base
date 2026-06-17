# Foundry 测试框架

## 竞赛关联

比赛要求选手使用 Foundry 框架进行智能合约测试，包括 Pair 合约（去中心化交易所）的流动性添加、移除、正常交易和安全测试。Foundry 是新兴的 Solidity 测试框架，以 Solidity 写测试是其最大特点。

## 核心技能

- **Foundry 项目初始化**：forge init、项目结构
- **Solidity 测试**：Test 合约、setUp、assert
- **Fuzz 测试**：随机输入测试
- **Pair 合约测试**：流动性添加、移除、交易
- **安全测试**：权限检查、异常回滚

## 详细讲解

### 1. 项目初始化

```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 创建项目
forge init foundry-project
cd foundry-project
```

项目结构：

```
foundry-project/
├── src/                # 合约源码
│   └── Pair.sol
├── test/               # 测试文件（Solidity）
│   └── Pair.t.sol
├── script/             # 部署脚本
│   └── Deploy.s.sol
├── foundry.toml        # Foundry 配置
└── lib/                # 依赖库
```

### 2. foundry.toml 配置

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc = "0.8.20"
evm_version = "paris"
ffi = true
optimizer = true
optimizer_runs = 200

[fmt]
line_length = 100
tab_width = 4
```

### 3. Pair 合约示例

```solidity
// src/Pair.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract Pair is ERC20 {
    address public token0;
    address public token1;
    uint256 public reserve0;
    uint256 public reserve1;
    address public owner;

    constructor(address _token0, address _token1) ERC20("LP Token", "LP") {
        token0 = _token0;
        token1 = _token1;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function addLiquidity(uint256 amount0, uint256 amount1) external onlyOwner {
        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);

        reserve0 += amount0;
        reserve1 += amount1;
    }

    function removeLiquidity() external onlyOwner {
        uint256 amount0 = reserve0;
        uint256 amount1 = reserve1;

        reserve0 = 0;
        reserve1 = 0;

        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);
    }

    function swap(address tokenIn, uint256 amountIn) external returns (uint256) {
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");
        require(amountIn > 0, "Amount must be > 0");

        bool isToken0 = tokenIn == token0;
        (uint256 reserveIn, uint256 reserveOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        uint256 amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        require(amountOut > 0, "Insufficient output");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        if (isToken0) {
            reserve0 += amountIn;
            reserve1 -= amountOut;
            IERC20(token1).transfer(msg.sender, amountOut);
        } else {
            reserve1 += amountIn;
            reserve0 -= amountOut;
            IERC20(token0).transfer(msg.sender, amountOut);
        }

        return amountOut;
    }
}
```

### 4. Foundry 测试合约

```solidity
// test/Pair.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Pair.sol";
import "../src/ERC20.sol";

contract PairTest is Test {
    Pair public pair;
    MockERC20 public token0;
    MockERC20 public token1;

    address public owner = address(1);
    address public user = address(2);

    function setUp() public {
        // 部署两个测试代币
        token0 = new MockERC20("Token0", "TK0", 18);
        token1 = new MockERC20("Token1", "TK1", 18);

        // 铸造代币给 owner
        token0.mint(owner, 10000 ether);
        token1.mint(owner, 10000 ether);

        vm.startPrank(owner);
        pair = new Pair(address(token0), address(token1));
        token0.approve(address(pair), type(uint256).max);
        token1.approve(address(pair), type(uint256).max);
        vm.stopPrank();
    }

    // ===== 添加流动性测试 =====
    function testAddLiquidity() public {
        vm.prank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);

        assertEq(pair.reserve0(), 1000 ether);
        assertEq(pair.reserve1(), 2000 ether);
    }

    function testAddLiquidityFuzz(uint256 amount0, uint256 amount1) public {
        amount0 = bound(amount0, 1 ether, 5000 ether);
        amount1 = bound(amount1, 1 ether, 5000 ether);

        vm.prank(owner);
        pair.addLiquidity(amount0, amount1);

        assertEq(pair.reserve0(), amount0);
        assertEq(pair.reserve1(), amount1);
    }

    // ===== 移除流动性测试 =====
    function testRemoveLiquidity() public {
        vm.startPrank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);
        pair.removeLiquidity();
        vm.stopPrank();

        assertEq(pair.reserve0(), 0);
        assertEq(pair.reserve1(), 0);
    }

    // ===== 交易测试 =====
    function testSwap() public {
        // 先添加流动性
        vm.prank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);

        // 给 user 铸造 token0 并授权
        token0.mint(user, 100 ether);
        vm.prank(user);
        token0.approve(address(pair), type(uint256).max);

        // 执行交易
        vm.prank(user);
        uint256 amountOut = pair.swap(address(token0), 10 ether);

        assertGt(amountOut, 0);
        assertEq(pair.reserve0(), 1010 ether);
    }

    function testSwapFuzz(uint256 amountIn) public {
        amountIn = bound(amountIn, 1 ether, 100 ether);

        vm.prank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);

        token0.mint(user, amountIn);
        vm.prank(user);
        token0.approve(address(pair), type(uint256).max);

        vm.prank(user);
        uint256 amountOut = pair.swap(address(token0), amountIn);

        assertGt(amountOut, 0);
    }

    // ===== 安全测试 =====
    function testOnlyOwnerCanAddLiquidity() public {
        vm.prank(user);
        vm.expectRevert("Not owner");
        pair.addLiquidity(100 ether, 200 ether);
    }

    function testSwapWithZeroAmount() public {
        vm.prank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);

        vm.prank(user);
        vm.expectRevert("Amount must be > 0");
        pair.swap(address(token0), 0);
    }

    function testSwapWithInvalidToken() public {
        vm.prank(owner);
        pair.addLiquidity(1000 ether, 2000 ether);

        vm.prank(user);
        vm.expectRevert("Invalid token");
        pair.swap(address(0xdead), 10 ether);
    }
}

// 测试用 Mock ERC20
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals)
        ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

### 5. 常用命令

```bash
# 编译合约
forge build

# 运行所有测试
forge test

# 运行测试（详细输出）
forge test -vvv

# 运行单个测试
forge test --match-test testSwap

# 运行测试（含 Gas 报告）
forge test --gas-report

# 运行 Fuzz 测试
forge test --fuzz-runs 1000

# 格式化代码
forge fmt
```

## 重点内容

- `vm.prank(address)` 模拟指定地址调用
- `vm.startPrank()` / `vm.stopPrank()` 批量模拟
- `vm.expectRevert()` 验证异常回滚
- `bound(x, min, max)` 限制 Fuzz 输入范围
- `assertEq` / `assertGt` / `assertLt` 断言
- `setUp()` 在每个测试前执行，准备测试环境

## 注意事项

- Foundry 使用 Solidity 写测试，不需要 JavaScript
- `vm` 是 Foundry 的作弊码对象，只在测试中可用
- Fuzz 测试 `function testXxxFuzz(uint256 x)` 参数自动随机生成
- `forge-std/Test.sol` 需要作为依赖引入

## 常见误区

- 误区：忘记 `vm.prank`，调用者身份错误
- 误区：Fuzz 测试参数范围过大，测试时间过长
- 误区：`setUp` 中使用了 `vm.prank` 但忘记 `stopPrank`
- 误区：断言使用 `==` 而非 `assertEq`，错误信息不友好

## 官方资源扩展

- [Foundry Book](https://book.getfoundry.sh/) - Foundry 官方完整文档，最佳学习资源
- [Foundry 测试指南](https://book.getfoundry.sh/forge/writing-tests) - 测试编写指南
- [Foundry Cheatcodes](https://book.getfoundry.sh/cheatcodes/) - vm 作弊码参考
- [Foundry Fuzz 测试](https://book.getfoundry.sh/forge/fuzz-testing) - Fuzz 测试文档