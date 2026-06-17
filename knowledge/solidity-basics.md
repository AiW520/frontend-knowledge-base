# Solidity 基础语法

## 竞赛关联

比赛第二部分的核心是智能合约开发，Solidity 是必须掌握的语言。赛题要求选手在合约代码的「选手填写部分」补充缺失的代码段，涉及数据类型、函数、修饰器、继承、接口等基础语法。

## 核心技能

- **数据类型**：uint、address、bool、string、mapping、struct、array
- **函数**：public/private、view/pure、payable、returns
- **修饰器**：modifier、require、revert
- **继承**：is、virtual、override
- **接口**：interface、abstract contract
- **事件**：event、emit

## 详细讲解

### 1. 数据类型

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataTypes {
    // 值类型
    bool public flag = true;
    uint256 public number = 100;       // 0 到 2^256-1
    int256 public signed = -50;        // 有符号整数
    address public owner = 0x1234...;  // 以太坊地址
    bytes32 public hash;               // 32 字节定长

    // 引用类型
    uint256[] public array;            // 动态数组
    mapping(address => uint256) public balances;  // 映射

    // 结构体
    struct User {
        string name;
        uint256 age;
        address wallet;
    }

    User public user;
    User[] public users;  // 结构体数组
}
```

### 2. 函数定义

```solidity
contract Functions {
    uint256 public count;
    address public owner;

    constructor() {
        owner = msg.sender;  // 部署者设为 owner
        count = 0;
    }

    // 普通函数：修改状态
    function increment() public {
        count++;
    }

    // view 函数：只读，不修改状态
    function getCount() public view returns (uint256) {
        return count;
    }

    // pure 函数：不读也不写状态
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    // payable 函数：可以接收 ETH
    function deposit() public payable {
        // msg.value 是发送的 ETH 数量
    }

    // 带参数的函数
    function setCount(uint256 _count) public {
        require(msg.sender == owner, "Only owner");
        count = _count;
    }
}
```

### 3. 修饰器（modifier）

```solidity
contract Modifiers {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 自定义修饰器：仅 owner 可调用
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;  // 占位符，表示函数体执行位置
    }

    // 修饰器：参数非零
    modifier notZero(uint256 _value) {
        require(_value > 0, "Value must be > 0");
        _;
    }

    // 使用修饰器
    function withdraw(uint256 amount) public onlyOwner notZero(amount) {
        // 只有 owner 且 amount > 0 才能执行
    }
}
```

### 4. 继承与接口

```solidity
// 接口定义
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// 抽象合约
abstract contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // 抽象函数：子合约必须实现
    function renounceOwnership() public virtual onlyOwner;
}

// 继承实现
contract MyToken is Ownable, IERC20 {
    mapping(address => uint256) private _balances;
    uint256 public totalSupply;

    // 实现接口方法
    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    // 实现抽象方法
    function renounceOwnership() public override onlyOwner {
        owner = address(0);
    }
}
```

### 5. 事件（Event）

```solidity
contract Events {
    // 定义事件
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);

    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient");
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // 触发事件
        emit Transfer(msg.sender, to, amount);
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, block.timestamp);
    }
}
```

### 6. 常用全局变量

| 变量 | 说明 |
|------|------|
| `msg.sender` | 调用者地址 |
| `msg.value` | 发送的 ETH 数量 |
| `block.timestamp` | 当前区块时间戳 |
| `block.number` | 当前区块号 |
| `address(this)` | 合约自身地址 |
| `tx.origin` | 交易发起者地址 |

## 重点内容

- `mapping` 是 Solidity 最常用的数据结构，相当于哈希表
- `modifier` 用于代码复用，`_` 表示函数体执行位置
- `view` 函数不消耗 Gas（外部调用），`pure` 也不消耗
- 继承使用 `is` 关键字，多重继承用逗号分隔
- `indexed` 参数允许事件被过滤查询，最多 3 个

## 注意事项

- Solidity 0.8.x 版本默认开启溢出检查，不需要 SafeMath
- `address payable` 才能使用 `transfer` 和 `send`
- 合约部署后代码不可修改，必须充分测试
- `msg.sender` 和 `tx.origin` 的区别：前者是直接调用者，后者是交易发起者

## 常见误区

- 误区：忘记设置函数可见性（public/private）
- 误区：mapping 不能遍历，需要额外维护索引数组
- 误区：`string` 和 `bytes` 混淆使用
- 误区：未处理 `require` 失败后的状态回滚

## 官方资源扩展

- [Solidity 官方文档](https://docs.soliditylang.org/zh/latest/) - 最权威的 Solidity 中文文档
- [Solidity by Example](https://solidity-by-example.org/) - 通过实例学习 Solidity
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - 业界标准合约库
- [CryptoZombies](https://cryptozombies.io/zh/) - 互动式 Solidity 学习教程