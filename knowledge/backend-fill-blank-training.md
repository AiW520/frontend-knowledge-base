# 后端填空题型训练

## 题型定位

后端填空题常见占位包括 `选手填写部分`、`/* 选手填写部分 */`、`TODO: 此处代码补全`。有些只空一个参数，有些会空一整段 Controller 或 Service 逻辑。

示例仅使用通用业务模型，不包含非公开训练材料细节。

## 难度 1：配置项填空

### 题目形态

```properties
spring.datasource.url=jdbc:mysql://选手填写部分:3306/app?serverTimezone=GMT%2B8
system.contract.address=选手填写部分
system.chain.trans.url=http://选手填写部分:5002/api/trans
```

### 标准补法

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/app?serverTimezone=GMT%2B8
system.contract.address=0x0000000000000000000000000000000000000000
system.chain.trans.url=http://localhost:5002/api/trans
```

### 讲解

配置题要区分数据库地址、合约地址和链服务地址。不要把合约地址填到 URL 中。

## 难度 1：实体字段填空

### 题目形态

```java
public class RecordEntity {
    // TODO: 在此处进行代码补全，声明实体字段，并添加 Get 和 Set 方法
}
```

### 标准补法

```java
public class RecordEntity {
    private Integer id;
    private String code;
    private String name;
    private Integer status;
    private String chainHash;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getChainHash() {
        return chainHash;
    }

    public void setChainHash(String chainHash) {
        this.chainHash = chainHash;
    }
}
```

### 易错点

- 字段类型和数据库不一致。
- getter/setter 名称写错，JSON 序列化异常。
- 敏感字段直接返回给前端。

## 难度 2：Controller 参数填空

### 题目形态

```java
@PostMapping("/create")
public AjaxResult create(选手填写部分) {
    return service.create(record);
}
```

### 标准补法

```java
@PostMapping("/create")
public AjaxResult create(@RequestBody RecordEntity record) {
    return service.create(record);
}
```

### 讲解

前端传 JSON 对象时用 `@RequestBody`。查询单个参数可用 `@RequestParam` 或 `@PathVariable`。

## 难度 2：统一响应填空

### 题目形态

```java
AjaxResult result = new AjaxResult();
result./* 选手填写部分 */;
return result;
```

### 标准补法

```java
AjaxResult result = new AjaxResult();
result.put("code", 200);
result.put("msg", "success");
result.put("data", data);
return result;
```

### 易错点

- 成功和失败响应字段不统一。
- 不返回 `data`，前端无法渲染。
- 异常时仍返回成功码。

## 难度 2：QueryWrapper 填空

### 题目形态

```java
QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
queryWrapper.eq("选手填写部分", 选手填写部分);
UserEntity userOne = /* 选手填写部分 */;
```

### 标准补法

```java
QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
queryWrapper.eq("username", username);
UserEntity userOne = userMapper.selectOne(queryWrapper);
```

### 易错点

- 数据库列名和 Java 字段名混用。
- 查询唯一数据却用 `selectList`。
- 没处理查询为空。

## 难度 3：注册逻辑整段填空

### 题目形态

```java
public AjaxResult register(RegisterBean bean) {
    /* 选手填写部分 */
}
```

### 标准补法

```java
public AjaxResult register(RegisterBean bean) {
    if (bean.getUsername() == null || bean.getUsername().isEmpty()) {
        return AjaxResult.error("用户名不能为空");
    }

    QueryWrapper<UserEntity> wrapper = new QueryWrapper<>();
    wrapper.eq("username", bean.getUsername());
    UserEntity exists = userMapper.selectOne(wrapper);
    if (exists != null) {
        return AjaxResult.error("用户已存在");
    }

    UserEntity entity = new UserEntity();
    entity.setUsername(bean.getUsername());
    entity.setPassword(bean.getPassword());
    entity.setRole(bean.getRole());
    userMapper.insert(entity);

    return AjaxResult.success(entity);
}
```

### 讲解

注册逻辑要包含空值校验、重复校验、实体转换、入库、统一响应。

## 难度 3：登录逻辑整段填空

### 题目形态

```java
public AjaxResult login(LoginBean bean) {
    /* 选手填写部分 */
}
```

### 标准补法

```java
public AjaxResult login(LoginBean bean) {
    QueryWrapper<UserEntity> wrapper = new QueryWrapper<>();
    wrapper.eq("username", bean.getUsername());
    UserEntity user = userMapper.selectOne(wrapper);

    if (user == null) {
        return AjaxResult.error("用户不存在");
    }

    if (!user.getPassword().equals(bean.getPassword())) {
        return AjaxResult.error("密码错误");
    }

    String token = UUID.randomUUID().toString();
    Map<String, Object> data = new HashMap<>();
    data.put("token", token);
    data.put("user", user);

    return AjaxResult.success(data);
}
```

### 易错点

- 不判断用户为空就取密码。
- 返回密码给前端。
- token 生成后没有保存或没有前后端约定。

## 难度 3：Controller 调 Service 填空

### 题目形态

```java
@GetMapping("/list")
public AjaxResult list(String keyword) {
    List<RecordBean> records = recordService.getInfo(/* 选手填写部分 */);
    AjaxResult result = new AjaxResult();
    result./* 选手填写部分 */;
    return result;
}
```

### 标准补法

```java
@GetMapping("/list")
public AjaxResult list(String keyword) {
    List<RecordBean> records = recordService.getInfo(keyword);
    AjaxResult result = new AjaxResult();
    result.put("code", 200);
    result.put("data", records);
    return result;
}
```

### 易错点

- Service 参数漏传。
- 返回字段不是前端约定的 `data`。
- 没处理空列表。

## 难度 4：分页查询整段填空

### 题目形态

```java
public Map<String, Object> page(Integer pageNum, Integer pageSize, String keyword) {
    Long count = 选手填写部分;
    List<RecordVO> records = 选手填写部分;
    Map<String, Object> pageData = new HashMap<>();
    pageData.put("total", 选手填写部分);
    pageData.put("data", 选手填写部分);
    return pageData;
}
```

### 标准补法

```java
public Map<String, Object> page(Integer pageNum, Integer pageSize, String keyword) {
    Long count = recordMapper.countByKeyword(keyword);
    Integer offset = (pageNum - 1) * pageSize;
    List<RecordVO> records = recordMapper.selectPageByKeyword(offset, pageSize, keyword);

    Map<String, Object> pageData = new HashMap<>();
    pageData.put("total", count);
    pageData.put("data", records);
    return pageData;
}
```

### 易错点

- offset 计算错误。
- total 填成当前页数量。
- data 填成 count。

## 难度 4：组装合约参数填空

### 题目形态

```java
List<Object> params = new ArrayList<>();
params.add(/* 选手填写部分 */);
params.add(/* 选手填写部分 */);
JSONObject res = /* 选手填写部分 */;
```

### 标准补法

```java
List<Object> params = new ArrayList<>();
params.add(bean.getCode());
params.add(bean.getName());
JSONObject res = ChainUtils.writeContract("createRecord", params);
```

### 讲解

合约参数顺序必须和合约函数签名一致。参数顺序错，交易可能成功但业务数据错。

## 难度 4：调用链上查询填空

### 题目形态

```java
@GetMapping("/chain/latest")
public AjaxResult latest() {
    // TODO: 区块链的最新高度和最新交易 Hash 接口补充源码
}
```

### 标准补法

```java
@GetMapping("/chain/latest")
public AjaxResult latest() {
    JSONObject block = ChainUtils.getLatestBlock();
    Map<String, Object> data = new HashMap<>();
    data.put("blockNumber", block.getInteger("number"));
    data.put("txHash", block.getString("hash"));
    return AjaxResult.success(data);
}
```

### 易错点

- 返回整个链响应，前端字段不可控。
- 字段名和前端不一致。
- 链服务异常没有捕获。

## 难度 4：JSON 解析入库填空

### 题目形态

```java
JSONObject chainResult = 选手填写部分;
RecordEntity entity = new RecordEntity();
entity.setCode(选手填写部分);
entity.setName(选手填写部分);
entity.setChainHash(选手填写部分);
recordMapper.insert(选手填写部分);
```

### 标准补法

```java
JSONObject chainResult = ChainUtils.readContract("getRecord", params);
RecordEntity entity = new RecordEntity();
entity.setCode(chainResult.getString("code"));
entity.setName(chainResult.getString("name"));
entity.setChainHash(chainResult.getString("txHash"));
recordMapper.insert(entity);
```

### 易错点

- JSON 字段名写错。
- 未判断链上查询是否成功。
- 重复入库没有去重。

## 难度 5：Service 完整链路填空

### 题目形态

```java
public AjaxResult createAndUpload(RecordBean bean) {
    /* 选手填写部分 */
}
```

### 标准补法

```java
public AjaxResult createAndUpload(RecordBean bean) {
    if (bean.getCode() == null || bean.getCode().isEmpty()) {
        return AjaxResult.error("编号不能为空");
    }

    QueryWrapper<RecordEntity> wrapper = new QueryWrapper<>();
    wrapper.eq("code", bean.getCode());
    RecordEntity old = recordMapper.selectOne(wrapper);
    if (old != null) {
        return AjaxResult.error("记录已存在");
    }

    List<Object> params = new ArrayList<>();
    params.add(bean.getCode());
    params.add(bean.getName());

    JSONObject chainRes = ChainUtils.writeContract("createRecord", params);
    if (chainRes == null || chainRes.getInteger("code") != 200) {
        return AjaxResult.error("链上提交失败");
    }

    RecordEntity entity = new RecordEntity();
    entity.setCode(bean.getCode());
    entity.setName(bean.getName());
    entity.setStatus(1);
    entity.setChainHash(chainRes.getString("txHash"));
    recordMapper.insert(entity);

    return AjaxResult.success(entity);
}
```

### 讲解

完整后端链路至少包括参数校验、数据库去重、链上写入、结果判断、入库、统一响应。

## 难度 5：WebSocket 通知填空

### 题目形态

```java
public class Notify {
    /*选手填写部分开始*/
    private static 选手填写部分
    /*选手填写部分结束*/

    public static void sendAll(String msg) {
        for (RemoteEndpoint.Basic value : 选手填写部分) {
            选手填写部分;
        }
    }
}
```

### 标准补法

```java
public class Notify {
    private static final Set<RemoteEndpoint.Basic> CLIENTS = ConcurrentHashMap.newKeySet();

    public static void add(RemoteEndpoint.Basic endpoint) {
        CLIENTS.add(endpoint);
    }

    public static void remove(RemoteEndpoint.Basic endpoint) {
        CLIENTS.remove(endpoint);
    }

    public static void sendAll(String msg) {
        for (RemoteEndpoint.Basic value : CLIENTS) {
            try {
                value.sendText(msg);
            } catch (IOException ignored) {
            }
        }
    }
}
```

### 讲解

连接集合要线程安全。高并发下不要使用普通 `ArrayList` 保存 WebSocket 连接。

## 难度 5：事件监听填空

### 题目形态

```java
EventLogParams params = 选手填写部分;
accounts.add(选手填写部分);
topics.add(选手填写部分);
EventSubscribeImp eventSubscribe = new EventSubscribeImp(选手填写部分, 选手填写部分, 选手填写部分);
选手填写部分 = (i, logs) -> {
    /* 选手填写部分 */
};
```

### 标准补法

```java
EventLogParams params = new EventLogParams();
accounts.add(contractAddress);
topics.add(eventTopic);
EventSubscribeImp eventSubscribe = new EventSubscribeImp(groupId, client, params);
EventCallback callback = (i, logs) -> {
    for (Log log : logs) {
        ABICodec abiCodec = new ABICodec(client.getCryptoSuite());
        List<Object> event = abiCodec.decodeEvent(abi, "RecordCreated", log);
        JSONObject object = new JSONObject();
        object.put("userAddress", event.get(0));
        object.put("msg", "链上事件已确认");
        Notify.sendAll(object.toJSONString());
    }
};
```

### 讲解

事件监听题难点在参数对象、订阅对象、回调解析和 WebSocket 推送的串联。

### 易错点

- 事件名和 ABI 不一致。
- topic 错误导致监听不到。
- 回调里直接阻塞处理大量逻辑。

## 难度 5：Controller + Service 联合补全

### 题目形态

```java
@PostMapping("/query")
public AjaxResult query(选手填写部分) {
    /* 选手填写部分 */
}
```

### 标准补法

```java
@PostMapping("/query")
public AjaxResult query(@RequestBody QueryBean bean) {
    if (bean.getCode() == null || bean.getCode().isEmpty()) {
        return AjaxResult.error("编号不能为空");
    }

    List<RecordVO> records = recordService.query(bean.getCode());
    return AjaxResult.success(records);
}
```

### 讲解

Controller 不应塞入复杂链上解析逻辑。它负责接收参数、基础校验、调用 Service、返回结果。

## 提交前检查

| 检查项 | 要求 |
| --- | --- |
| 占位是否清空 | 不残留 `选手填写部分` |
| 参数是否接收正确 | JSON 用 `@RequestBody`，简单参数用 `@RequestParam` |
| 空值是否校验 | 关键字段不能为空 |
| 数据库是否去重 | 新增前检查唯一字段 |
| 链调用是否判断结果 | 失败不能继续入库 |
| 响应是否统一 | 前端能稳定读取 `code`、`msg`、`data` |
| 异常是否处理 | 不能把异常堆栈直接返回给前端 |
| 集合是否线程安全 | WebSocket 等共享集合不能用普通非线程安全结构 |
| 大数据是否分页 | 列表接口不能一次性返回全部数据 |
