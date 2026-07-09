# 后端竞赛考点学习路径

## 适用目标

本模块用于训练区块链应用类竞赛中的后端开发能力。内容抽象自训练材料中的通用后端考点，只讲知识点、代码模式和答题方法。示例仅使用通用业务模型，不包含非公开训练材料细节。

后端部分的核心任务是把 Web 请求、数据库、区块链服务、业务规则连接起来。

```text
Controller 接收参数 -> Service 处理业务 -> Mapper 操作数据库 -> 链服务调用 -> 统一响应给前端
```

## 能力分层

| 层级 | 必学知识点 | 典型考法 |
| --- | --- | --- |
| 项目配置 | `application.properties`、数据源、端口、链服务地址 | 补数据库连接、合约地址、服务 URL |
| 实体类 | 字段、getter/setter、注解 | 按表结构补实体字段 |
| Controller | `@RestController`、`@PostMapping`、参数接收 | 接收 Web 端参数并返回统一结果 |
| Service | 业务校验、查询、保存、状态处理 | 补整段业务逻辑 |
| Mapper | MyBatis / MyBatis-Plus 查询 | 条件查询、分页、插入、更新 |
| 统一响应 | `AjaxResult` / `Result` | 成功失败返回、携带数据 |
| 登录鉴权 | 密码校验、token、拦截器 | 登录、注册、用户信息接口 |
| 链上调用 | SDK / HTTP 调用、合约函数参数 | 调用读写合约并解析返回 |
| JSON 解析 | `JSONObject`、`JSONArray` | 提取链上返回字段 |
| 事件通知 | WebSocket、事件监听 | 监听链上事件并通知前端 |

## 从易到难的学习顺序

### 1. 配置文件

必会内容：

- 数据库 URL、用户名、密码。
- 合约地址、合约名。
- 链服务接口地址。
- 服务端口。

训练目标：

> 能根据环境参数补全后端启动所需配置。

### 2. 实体类

必会内容：

- 字段声明。
- getter / setter。
- 表字段映射。
- 时间、状态、地址字段。

训练目标：

> 能按业务字段补全实体类，并保证前后端字段一致。

### 3. Controller 参数接收

必会内容：

- `@RequestBody`
- `@RequestParam`
- `@PathVariable`
- 请求对象 Bean
- 统一响应对象

训练目标：

> 能写一个新增接口和一个查询接口。

### 4. Service 业务处理

必会内容：

- 参数校验。
- 查询数据库。
- 调用链服务。
- 保存返回结果。
- 返回业务结果。

训练目标：

> 能补全一个“接收参数 -> 调链 -> 入库 -> 返回”的完整方法。

### 5. MyBatis-Plus 查询

必会内容：

- `QueryWrapper`
- `eq`、`like`、`orderByDesc`
- `selectOne`
- `selectList`
- `insert`
- `updateById`

训练目标：

> 能根据用户名、地址、编号等字段完成查询与去重。

### 6. 分页查询

必会内容：

- 当前页。
- 每页数量。
- 总数。
- 数据列表。
- 返回 map 或分页对象。

训练目标：

> 能补全分页查询 Service，并返回 `total` 和 `data`。

### 7. 链服务调用

必会内容：

- 读合约。
- 写合约。
- 参数列表。
- 合约函数名。
- 交易回执。
- 失败处理。

训练目标：

> 能组装合约参数，调用链服务，解析返回结果。

### 8. JSON 解析与入库

必会内容：

- `JSONObject`
- `JSONArray`
- `getString`
- `getInteger`
- 链上数组字段映射实体类
- 入库前去重

训练目标：

> 能把链上返回数据解析成实体，并保存到数据库。

### 9. WebSocket 与事件监听

必会内容：

- 保存连接。
- 遍历连接发送消息。
- 事件订阅。
- 解析事件日志。
- 推送给指定用户。

训练目标：

> 能监听链上事件，并把消息推送给对应前端用户。

## 与已有文档的关系

| 学习目标 | 建议先读 |
| --- | --- |
| 项目结构 | [Spring Boot 项目搭建与配置](/knowledge/springboot-project-setup) |
| 实体与 Mapper | [MyBatis-Plus 实体与 Mapper](/knowledge/mybatis-plus-entity) |
| Service 层 | [MyBatis-Plus Service 层](/knowledge/mybatis-plus-service) |
| 统一响应 | [统一响应与异常处理](/knowledge/springboot-unified-response) |
| 登录认证 | [Spring Boot 登录认证开发](/knowledge/springboot-login-auth) |
| 登录拦截 | [登录拦截器](/knowledge/springboot-login-interceptor) |
| CRUD | [业务 CRUD 实战（上）](/knowledge/springboot-crud-1)、[业务 CRUD 实战（下）](/knowledge/springboot-crud-2) |
| 链服务集成 | [整合 WeBASE-Front](/knowledge/springboot-webase-integration) |
| 填空训练 | [后端填空题型训练](/knowledge/backend-fill-blank-training) |

## 学习方法

后端题先看接口职责，再写代码：

1. 这个接口给谁调用。
2. 接收哪些参数。
3. 是否要查数据库。
4. 是否要调用链服务。
5. 是否要保存结果。
6. 前端需要什么响应字段。

不要把所有逻辑堆在 Controller。能放 Service 的业务逻辑，应放到 Service。
