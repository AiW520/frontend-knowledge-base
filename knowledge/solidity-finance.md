# Solidity 进阶：金融协议

## 竞赛关联

比赛智能合约部分常考金融类协议，如借贷协议、利率计算、抵押清算等。这些协议涉及复杂的业务逻辑和数学计算，是考核选手 Solidity 编程能力的重点。

## 核心技能

- **借贷协议设计**：存款、借款、还款、清算
- **利率计算**：固定利率、浮动利率、利用率模型
- **抵押管理**：超额抵押、健康因子、清算阈值
- **数学运算**：高精度计算（WadRay 数学库）
- **代币交互**：ERC-20 转账、铸造、销毁

## 详细讲解

### 1. 借贷协议核心架构

```
┌──────────────────────────────────────────┐
│              LendingPool                   │  ← 核心借贷池
│  deposit() / withdraw() / borrow()         │
│  repay() / liquidate()                    │
├──────────────────────────────────────────┤
│        InterestRateStrategy                │  ← 利率策略
│  calculateBorrowRate()                    │
├──────────────────────────────────────────┤
│          PriceOracle                       │  ← 价格预言机
│  getAssetPrice()                          │
├──────────────────────────────────────────┤
│            AToken                          │  ← 存款凭证代币
│  mint() / burn()                          │
└──────────────────────────────────────────┘
```

### 2. 利率计算合约

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 利率策略合约
contract InterestRateStrategy {
    // 基准利率（年化，10^27 精度）
    uint256 public constant BASE_RATE = 2e25;  // 2%

    // 最优利用率
    uint256 public constant OPTIMAL_UTILIZATION = 8e26;  // 80%

    // 最优利用率对应的利率
    uint256 public constant OPTIMAL_RATE = 1e26;  // 10%

    // 最大利率
    uint256 public constant MAX_RATE = 5e26;  // 50%

    // WadRay 精度常量
    uint256 public constant RAY = 1e27;

    /**
     * @dev 计算借款利率
     * @param totalBorrowed 总借款额
     * @param totalDeposited 总存款额
     * @return 借款利率（RAY 精度）
     */
    function calculateBorrowRate(
        uint256 totalBorrowed,
        uint256 totalDeposited
    ) public pure returns (uint256) {
        if (totalDeposited == 0) {
            return BASE_RATE;
        }

        // 计算利用率
        uint256 utilization = (totalBorrowed * RAY) / totalDeposited;

        if (utilization <= OPTIMAL_UTILIZATION) {
            // 利用率 ≤ 80%：线性插值
            return BASE_RATE + (utilization * (OPTIMAL_RATE - BASE_RATE)) / OPTIMAL_UTILIZATION;
        } else {
            // 利用率 > 80%：陡峭上升
            uint256 excessUtil = utilization - OPTIMAL_UTILIZATION;
            uint256 excessRate = (excessUtil * (MAX_RATE - OPTIMAL_RATE)) / (RAY - OPTIMAL_UTILIZATION);
            return OPTIMAL_RATE + excessRate;
        }
    }

    /**
     * @dev 计算存款利率
     */
    function calculateDepositRate(
        uint256 borrowRate,
        uint256 totalBorrowed,
        uint256 totalDeposited
    ) public pure returns (uint256) {
        if (totalDeposited == 0) return 0;
        uint256 utilization = (totalBorrowed * RAY) / totalDeposited;
        return (borrowRate * utilization) / RAY;
    }
}
```

### 3. 借贷池核心合约

```solidity
contract LendingPool {
    // 存储合约地址
    ILendingPoolStorage public store;

    // 利率策略合约
    InterestRateStrategy public rateStrategy;

    // 存款
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        // 更新利率索引
        updateInterestIndex();

        // 转移代币到合约
        IERC20(store.asset()).transferFrom(msg.sender, address(this), amount);

        // 更新用户存款
        uint256 currentBalance = store.userDeposits(msg.sender);
        store.userDeposits[msg.sender] = currentBalance + amount;

        // 铸造 AToken
        store.totalDeposited += amount;
        AToken(store.aTokenAddress()).mint(msg.sender, amount);

        emit Deposit(msg.sender, amount);
    }

    // 借款
    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        // 更新利率索引
        updateInterestIndex();

        // 检查抵押率
        require(checkHealthFactor(msg.sender, amount), "Insufficient collateral");

        // 更新借款
        uint256 currentBorrowed = store.userBorrowed(msg.sender);
        store.userBorrowed[msg.sender] = currentBorrowed + amount;
        store.totalBorrowed += amount;

        // 转出代币
        IERC20(store.asset()).transfer(msg.sender, amount);

        emit Borrow(msg.sender, amount);
    }

    // 还款
    function repay(uint256 amount) external {
        uint256 borrowed = store.userBorrowed(msg.sender);
        uint256 repayAmount = amount > borrowed ? borrowed : amount;

        IERC20(store.asset()).transferFrom(msg.sender, address(this), repayAmount);

        store.userBorrowed[msg.sender] = borrowed - repayAmount;
        store.totalBorrowed -= repayAmount;

        emit Repay(msg.sender, repayAmount);
    }

    // 清算
    function liquidate(address user) external {
        // 检查健康因子
        require(!checkHealthFactor(user, 0), "Health factor OK");

        // 计算清算金额
        uint256 debt = store.userBorrowed(user);
        uint256 collateral = store.userCollateral(user);

        // 清算人获得抵押品（含折扣）
        uint256 liquidationBonus = (collateral * 105) / 100;  // 5% 奖励
        store.userCollateral[user] = 0;
        store.userBorrowed[user] = 0;

        // 转移抵押品给清算人
        IERC20(store.asset()).transfer(msg.sender, liquidationBonus);

        emit Liquidate(user, msg.sender, debt, liquidationBonus);
    }

    // 检查健康因子
    function checkHealthFactor(address user, uint256 newBorrow) internal view returns (bool) {
        uint256 totalBorrowed = store.userBorrowed(user) + newBorrow;
        if (totalBorrowed == 0) return true;

        uint256 collateralValue = store.userCollateral(user);
        // 健康因子 = 抵押品价值 / 借款额 > 1.5
        return collateralValue * 100 > totalBorrowed * 150;
    }

    // 更新利率索引
    function updateInterestIndex() internal {
        uint256 rate = rateStrategy.calculateBorrowRate(
            store.totalBorrowed,
            store.totalDeposited
        );
        store.currentBorrowRate = rate;
    }

    event Deposit(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);
    event Liquidate(address indexed user, address indexed liquidator, uint256 debt, uint256 collateral);
}

interface ILendingPoolStorage {
    function asset() external view returns (address);
    function aTokenAddress() external view returns (address);
    function totalDeposited() external view returns (uint256);
    function totalBorrowed() external view returns (uint256);
    function currentBorrowRate() external view returns (uint256);
    function userDeposits(address) external view returns (uint256);
    function userBorrowed(address) external view returns (uint256);
    function userCollateral(address) external view returns (uint256);
}
```

### 4. AToken 存款凭证合约

```solidity
contract AToken is ERC20 {
    address public lendingPool;

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
    {}

    modifier onlyPool() {
        require(msg.sender == lendingPool, "Only lending pool");
        _;
    }

    function initialize(address _pool) external {
        require(lendingPool == address(0), "Already initialized");
        lendingPool = _pool;
    }

    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyPool {
        _burn(from, amount);
    }
}
```

## 重点内容

- 利率计算使用 `RAY` 精度（10^27）避免浮点数误差
- 利用率 = 总借款 / 总存款，超过 80% 后利率陡峭上升
- 健康因子 = 抵押品价值 / 借款额，小于 1 触发清算
- 清算人可获得抵押品折扣（通常 5%-10%），激励清算
- AToken 是存款凭证，存款时铸造，取款时销毁

## 注意事项

- 金融协议涉及大量数学计算，必须使用高精度数学库
- 利率计算需要考虑复利，使用指数模型
- 清算阈值不能设得太低，否则市场波动时容易触发清算
- 所有外部调用都要考虑重入攻击风险

## 常见误区

- 误区：使用浮点数计算利率，精度丢失
- 误区：忘记更新利率索引，导致利息计算错误
- 误区：清算时未考虑清算奖励，清算人无动力
- 误区：健康因子计算错误，正常用户被清算

## 官方资源扩展

- [Aave Protocol 文档](https://docs.aave.com/hub) - 顶级借贷协议技术文档
- [Compound Protocol 文档](https://docs.compound.finance/v2/) - 借贷协议先驱
- [OpenZeppelin Math 库](https://docs.openzeppelin.com/contracts/4.x/api/utils#Math) - 安全数学运算
- [DeFi 借贷协议设计](https://ethereum.org/zh/defi/#lending) - 以太坊官方 DeFi 介绍