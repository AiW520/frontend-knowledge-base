# Solidity 进阶：存储分离架构

## 竞赛关联

比赛智能合约部分常考查业务逻辑与数据存储分离的架构模式。这种模式将合约状态变量放在独立的 Storage 合约中，逻辑合约通过代理调用 Storage 合约，实现合约可升级性和代码复用。

## 核心技能

- **存储分离原理**：逻辑合约与存储合约分离
- **代理模式**：delegatecall 实现逻辑升级
- **合约间调用**：接口调用、地址传递
- **状态管理**：初始化、权限控制
- **事件通知**：状态变更时触发事件

## 详细讲解

### 1. 存储分离架构图

```
用户调用
    ↓
逻辑合约 (LogicContract)  ← 可升级替换
    ↓ delegatecall / 直接调用
存储合约 (StorageContract) ← 数据永久保存
    ↓
状态变量 (mapping / array / struct)
```

### 2. 存储合约（Storage）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 存储合约：只负责数据存储，不包含业务逻辑
contract TokenStorage {
    // 管理员
    address public admin;

    // 代币信息
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    // 余额映射
    mapping(address => uint256) public balances;

    // 授权映射
    mapping(address => mapping(address => uint256)) public allowances;

    // 黑名单
    mapping(address => bool) public blacklist;

    // 是否已初始化
    bool public initialized;

    // 事件
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    event BlacklistUpdated(address indexed account, bool status);
}
```

### 3. 逻辑合约（Logic）

```solidity
// 逻辑合约：包含所有业务逻辑，通过接口调用存储合约
contract TokenLogic {
    // 存储合约接口
    ITokenStorage public store;

    // 事件
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // 初始化：设置存储合约地址
    function initialize(address _store) external {
        require(address(store) == address(0), "Already initialized");
        store = ITokenStorage(_store);

        // 初始化代币基本信息
        store.name = "MyToken";
        store.symbol = "MTK";
        store.decimals = 18;
        store.admin = msg.sender;
        store.initialized = true;
    }

    // 铸造代币
    function mint(address to, uint256 amount) external {
        require(msg.sender == store.admin(), "Only admin");
        require(to != address(0), "Invalid address");

        store.balances[to] += amount;
        store.totalSupply += amount;

        emit Transfer(address(0), to, amount);
    }

    // 转账
    function transfer(address to, uint256 amount) external returns (bool) {
        require(!store.blacklist(msg.sender), "Sender blacklisted");
        require(!store.blacklist(to), "Recipient blacklisted");
        require(store.balances[msg.sender] >= amount, "Insufficient balance");

        store.balances[msg.sender] -= amount;
        store.balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    // 授权
    function approve(address spender, uint256 amount) external returns (bool) {
        store.allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // 授权转账
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(store.allowances[from][msg.sender] >= amount, "Insufficient allowance");
        require(store.balances[from] >= amount, "Insufficient balance");

        store.allowances[from][msg.sender] -= amount;
        store.balances[from] -= amount;
        store.balances[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // 管理员功能
    function setBlacklist(address account, bool status) external {
        require(msg.sender == store.admin(), "Only admin");
        store.blacklist[account] = status;
        emit store.BlacklistUpdated(account, status);
    }
}

// 存储合约接口
interface ITokenStorage {
    function admin() external view returns (address);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balances(address) external view returns (uint256);
    function allowances(address, address) external view returns (uint256);
    function blacklist(address) external view returns (bool);
    function initialized() external view returns (bool);
}
```

### 4. 存储分离的优势

| 优势 | 说明 |
|------|------|
| **可升级性** | 更换逻辑合约不影响已有数据 |
| **代码复用** | 多个逻辑合约共享同一存储 |
| **权限分离** | 存储合约可设置独立的管理员 |
| **安全隔离** | 逻辑合约漏洞不影响存储数据 |
| **灵活部署** | 存储合约和逻辑合约独立部署 |

### 5. 常用设计模式

```solidity
// 模式一：存储合约 + 逻辑合约（1对1）
// 适用场景：单一业务系统

// 模式二：存储合约 + 多个逻辑合约（1对多）
// 适用场景：模块化系统，如借贷协议（LendingPool + InterestRate + PriceOracle）

// 模式三：共享存储合约（多对1）
// 适用场景：多个DApp共享同一数据源
```

## 重点内容

- 存储合约只包含状态变量和 getter 函数，不包含业务逻辑
- 逻辑合约通过接口访问存储合约，不直接持有状态变量
- 初始化函数 `initialize()` 替代构造函数（因为逻辑合约可替换）
- 存储合约的 `admin` 角色控制逻辑合约的升级权限
- 事件可以定义在存储合约中，让逻辑合约通过 `emit store.Event()` 触发

## 注意事项

- 存储合约和逻辑合约的变量顺序必须一致（storage layout）
- 逻辑合约升级时不能删除已有变量，只能追加
- 初始化函数需要防止重复调用（`initialized` 标志）
- 存储合约的 Gas 消耗比直接存储略高（多一层调用）

## 常见误区

- 误区：在逻辑合约中定义状态变量，升级后数据丢失
- 误区：忘记 `require` 检查 `initialized` 标志，导致重复初始化
- 误区：存储合约和逻辑合约变量顺序不一致
- 误区：逻辑合约的 `admin` 权限未正确传递给存储合约

## 官方资源扩展

- [OpenZeppelin 代理模式](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies) - 业界标准代理升级方案
- [Solidity 存储布局](https://docs.soliditylang.org/zh/latest/internals/layout_in_storage.html) - 官方存储布局说明
- [EIP-1967 代理存储槽](https://eips.ethereum.org/EIPS/eip-1967) - 代理合约标准
- [OpenZeppelin UUPS 代理](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable) - 通用可升级代理