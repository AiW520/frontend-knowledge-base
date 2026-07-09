# 智能合约填空题型训练

## 题型定位

智能合约填空常见占位是 `选手填写部分`、`/* 选手填写部分 */`，有时空一个表达式，有时空一整段函数体。训练时要严格区分：空的是类型、变量、判断条件、函数调用，还是完整业务流程。

示例仅使用通用业务模型，不包含非公开训练材料细节。

## 难度 1：状态变量填空

### 题目形态

```solidity
address public owner;
mapping(uint256 => Record) private records;
mapping(address => bool) public 选手填写部分;
```

### 标准补法

```solidity
address public owner;
mapping(uint256 => Record) private records;
mapping(address => bool) public operators;
```

### 讲解

`mapping(address => bool)` 常用于角色权限，变量名要能表达身份含义。

### 易错点

- 把 `address` 写成 `string`。
- 权限映射没有 `public`，测试无法直接读取。
- 变量名和后续 `require` 中使用的不一致。

## 难度 1：结构体字段填空

### 题目形态

```solidity
struct Record {
    uint256 id;
    string name;
    address owner;
    uint8 选手填写部分;
    bool 选手填写部分;
}
```

### 标准补法

```solidity
struct Record {
    uint256 id;
    string name;
    address owner;
    uint8 status;
    bool exists;
}
```

### 讲解

`status` 表示业务状态，`exists` 用于判断记录是否存在，避免默认值误判。

### 易错点

- 只用 `id != 0` 判断存在，遇到 id 为 0 的记录会出错。
- 状态字段类型过大，不符合简洁设计。

## 难度 2：构造函数填空

### 题目形态

```solidity
constructor() {
    owner = 选手填写部分;
}
```

### 标准补法

```solidity
constructor() {
    owner = msg.sender;
}
```

### 易错点

- 写成 `tx.origin`，容易引入安全风险。
- 忘记初始化 owner，权限函数全部失效。

## 难度 2：权限判断填空

### 题目形态

```solidity
modifier onlyOwner() {
    require(选手填写部分, "not owner");
    _;
}
```

### 标准补法

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "not owner");
    _;
}
```

### 讲解

权限判断必须使用当前调用者 `msg.sender`。`_` 表示继续执行被修饰函数。

### 易错点

- 使用赋值 `=` 而不是比较 `==`。
- 漏写 `_`，函数体永远不执行。

## 难度 2：角色授权填空

### 题目形态

```solidity
function addOperator(address account) public onlyOwner {
    require(account != address(0), "zero address");
    选手填写部分 = true;
}
```

### 标准补法

```solidity
function addOperator(address account) public onlyOwner {
    require(account != address(0), "zero address");
    operators[account] = true;
}
```

### 易错点

- 直接写 `account = true`。
- 不检查零地址。
- 授权函数没有 `onlyOwner`。

## 难度 2：新增记录填空

### 题目形态

```solidity
function createRecord(uint256 id, string memory name) public {
    require(!records[id].选手填写部分, "already exists");

    records[id] = Record({
        id: id,
        name: name,
        owner: 选手填写部分,
        status: 1,
        exists: true
    });
}
```

### 标准补法

```solidity
function createRecord(uint256 id, string memory name) public {
    require(!records[id].exists, "already exists");

    records[id] = Record({
        id: id,
        name: name,
        owner: msg.sender,
        status: 1,
        exists: true
    });
}
```

### 易错点

- 不做重复判断。
- `owner` 写成合约 owner，而不是当前业务创建人。
- 结构体字段顺序和命名初始化混用导致错误。

## 难度 3：查询函数填空

### 题目形态

```solidity
function getRecord(uint256 id) public view returns (uint256, string memory, address, uint8) {
    require(选手填写部分, "not found");
    Record storage record = 选手填写部分;
    return (选手填写部分, 选手填写部分, 选手填写部分, 选手填写部分);
}
```

### 标准补法

```solidity
function getRecord(uint256 id) public view returns (uint256, string memory, address, uint8) {
    require(records[id].exists, "not found");
    Record storage record = records[id];
    return (record.id, record.name, record.owner, record.status);
}
```

### 讲解

查询函数不修改状态，用 `view`。读取已存储结构体时可用 `storage` 引用，避免复制。

### 易错点

- 不检查存在性。
- 返回字段顺序和声明顺序不一致。
- 在 view 函数中修改状态。

## 难度 3：状态更新填空

### 题目形态

```solidity
function updateStatus(uint256 id, uint8 newStatus) public {
    require(records[id].exists, "not found");
    require(选手填写部分, "not allowed");
    records[id].status = 选手填写部分;
}
```

### 标准补法

```solidity
function updateStatus(uint256 id, uint8 newStatus) public {
    require(records[id].exists, "not found");
    require(msg.sender == records[id].owner || operators[msg.sender], "not allowed");
    records[id].status = newStatus;
}
```

### 易错点

- 状态任何人都能改。
- 没限制 `newStatus` 的范围。
- 更新后不触发事件，后端无法监听。

## 难度 3：事件定义与触发填空

### 题目形态

```solidity
event RecordUpdated(uint256 indexed id, address indexed operator, uint8 status);

function updateStatus(uint256 id, uint8 newStatus) public {
    records[id].status = newStatus;
    选手填写部分;
}
```

### 标准补法

```solidity
event RecordUpdated(uint256 indexed id, address indexed operator, uint8 status);

function updateStatus(uint256 id, uint8 newStatus) public {
    records[id].status = newStatus;
    emit RecordUpdated(id, msg.sender, newStatus);
}
```

### 讲解

事件是链上操作日志，后端可以通过事件解析业务结果。

### 易错点

- 忘记 `emit`。
- 事件参数少了操作者。
- 状态修改失败时仍触发事件。

## 难度 4：字段数组填空

### 题目形态

```solidity
function buildFields(Record memory record) internal pure returns (string[] memory) {
    string[] memory fieldsList = 选手填写部分;
    fieldsList[0] = record.name;
    fieldsList[1] = 选手填写部分;
    return fieldsList;
}
```

### 标准补法

```solidity
function buildFields(Record memory record) internal pure returns (string[] memory) {
    string[] memory fieldsList = new string[](2);
    fieldsList[0] = record.name;
    fieldsList[1] = uintToString(record.id);
    return fieldsList;
}
```

### 讲解

内存数组必须指定长度。非字符串字段要先转换为字符串。

### 易错点

- `new string[]` 漏长度。
- 写入越界。
- 字段顺序和读取逻辑不一致。

## 难度 4：字符串拼接填空

### 题目形态

```solidity
string memory detail = string(abi.encodePacked(
    选手填写部分,
    ",",
    选手填写部分
));
```

### 标准补法

```solidity
string memory detail = string(abi.encodePacked(
    record.name,
    ",",
    uintToString(record.id)
));
```

### 易错点

- 忘记 `string(...)` 转换。
- 非字符串类型未转换。
- 分隔符遗漏，后续解析困难。

## 难度 4：合约间调用填空

### 题目形态

```solidity
function save(address storageAddress, string memory detail) public {
    (bool success, bytes memory returnData) = storageAddress.选手填写部分(
        选手填写部分("insert(string)", detail)
    );
    require(选手填写部分, "call failed");
}
```

### 标准补法

```solidity
function save(address storageAddress, string memory detail) public {
    (bool success, bytes memory returnData) = storageAddress.call(
        abi.encodeWithSignature("insert(string)", detail)
    );
    require(success, "call failed");
}
```

### 讲解

低级调用必须检查 `success`。`returnData` 如果后续要解析，也要按 ABI 解码。

### 易错点

- 不检查返回值。
- 函数签名写错。
- 参数顺序和目标合约不一致。

## 难度 4：比对逻辑填空

### 题目形态

```solidity
for (uint256 i = 0; i < source.length; i++) {
    require(
        选手填写部分,
        "field not equal"
    );
}
```

### 标准补法

```solidity
for (uint256 i = 0; i < source.length; i++) {
    require(
        keccak256(bytes(source[i])) == keccak256(bytes(target[i])),
        "field not equal"
    );
}
```

### 讲解

Solidity 不能直接可靠比较两个 `string`，通常转为 `bytes` 后取哈希比较。

### 易错点

- 直接写 `source[i] == target[i]`。
- 没检查两个数组长度是否相同。
- 比对失败信息无法定位字段。

## 难度 5：新增函数整段填空

### 题目形态

```solidity
function insert(uint256 id, string memory name) public {
    /* 选手填写部分 */
}
```

### 标准补法

```solidity
function insert(uint256 id, string memory name) public {
    require(id > 0, "invalid id");
    require(bytes(name).length > 0, "empty name");
    require(!records[id].exists, "already exists");

    records[id] = Record({
        id: id,
        name: name,
        owner: msg.sender,
        status: 1,
        exists: true
    });

    emit RecordUpdated(id, msg.sender, 1);
}
```

### 讲解

完整新增逻辑至少包括参数校验、防重复、写入状态、触发事件。

## 难度 5：审核函数整段填空

### 题目形态

```solidity
function audit(uint256 id, bool passed) public {
    /* 选手填写部分 */
}
```

### 标准补法

```solidity
function audit(uint256 id, bool passed) public {
    require(operators[msg.sender], "not operator");
    require(records[id].exists, "not found");
    require(records[id].status == 1, "invalid status");

    records[id].status = passed ? 2 : 3;

    emit RecordUpdated(id, msg.sender, records[id].status);
}
```

### 讲解

审核题核心是权限和状态前置条件。不能让任何状态都反复审核。

## 难度 5：授权函数整段填空

### 题目形态

```solidity
function setRole(address account, bool enabled) public {
    /* 选手填写部分 */
}
```

### 标准补法

```solidity
function setRole(address account, bool enabled) public onlyOwner {
    require(account != address(0), "zero address");
    operators[account] = enabled;
}
```

### 易错点

- 忘记 `onlyOwner`。
- 允许零地址。
- 只支持新增，不支持撤销。

## 难度 5：安全修复填空

### 题目形态

```solidity
function withdraw(uint256 amount) public {
    require(balanceOf[msg.sender] >= amount, "insufficient");
    选手填写部分
    payable(msg.sender).transfer(amount);
}
```

### 标准补法

```solidity
function withdraw(uint256 amount) public {
    require(balanceOf[msg.sender] >= amount, "insufficient");
    balanceOf[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}
```

### 讲解

先改状态再外部转账，可以降低重入风险。更完整的方案还应使用重入锁。

### 易错点

- 先转账后扣余额。
- 不检查余额。
- 使用低级调用后不检查返回值。

## 提交前检查

| 检查项 | 要求 |
| --- | --- |
| 占位是否清空 | 不残留 `选手填写部分` |
| 权限是否完整 | 写函数必须有权限或业务身份判断 |
| 状态是否可控 | 不能重复新增、重复审核、越权修改 |
| 事件是否触发 | 关键状态变化要 `emit` |
| 返回值是否匹配 | 返回顺序与函数声明一致 |
| 外部调用是否检查 | `call` 必须检查 `success` |
| 字符串是否正确处理 | 比较、拼接、转换要明确 |
| 测试是否覆盖失败分支 | 至少覆盖越权、重复、无记录 |
