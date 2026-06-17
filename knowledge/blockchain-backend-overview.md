# 后端开发总览（金砖大赛专项）

## 竞赛关联

本模块覆盖金砖大赛区块链赛项**后端相关**的全部考核内容，共占 **85 分**（总分 100 分），分为四个子模块：

| 子模块 | 对应赛题 | 分值 | 知识点数 |
|--------|---------|------|---------|
| 区块链平台运维 | 第一部分 | 20 分 | 5 个 |
| 智能合约开发与测试 | 第二部分 | 35 分 | 8 个 |
| Spring Boot 后端开发 | 第三部分第1题 | 20 分 | 10 个 |
| 测试文档编写 | 第三部分第3题 | 10 分 | 1 个 |

## 后端技术栈全景

```
┌─────────────────────────────────────────────────────┐
│                  Spring Boot 应用层                   │
│  Java + Spring Boot + MyBatis-Plus + MySQL           │
│  Controller → Service → Mapper → Database            │
├─────────────────────────────────────────────────────┤
│              区块链中间件层                            │
│  WeBASE-Front（节点前置）/ WeBASE-Node-Manager        │
│  WeBASE-Sign（签名服务）/ WeBASE-Web（管理平台）        │
├─────────────────────────────────────────────────────┤
│              智能合约层                                │
│  Solidity / Rust（Anchor）                            │
│  Hardhat / Truffle / Foundry（测试框架）               │
├─────────────────────────────────────────────────────┤
│              区块链底层                                 │
│  FISCO BCOS（联盟链）/ Solana（公链）                   │
│  Generator / Console / Caliper（运维工具）             │
└─────────────────────────────────────────────────────┘
```

## 考核方式

后端考核同样采用 **「填空式」** 命题方式：

- 组委会提供 Java / Solidity / Shell 项目模板
- 代码中预留 `// 选手填写部分` 注释标记
- 选手需在指定位置补充正确的代码逻辑
- 考核涵盖：**链搭建、合约开发、合约测试、后端接口、Postman 测试**

## 学习路径建议

```
第一步：区块链运维（5天）
  ├── 搭建 FISCO BCOS 链
  ├── 配置 Console 控制台
  ├── 搭建 WeBASE 平台
  ├── 编写监控脚本
  └── 执行压力测试

第二步：智能合约（8天）
  ├── Solidity 基础语法
  ├── 存储分离架构
  ├── 金融协议开发
  ├── Hardhat / Truffle / Foundry 测试
  ├── 安全漏洞分析
  └── Solana 合约

第三步：Spring Boot 后端（10天）
  ├── 项目搭建与配置
  ├── MyBatis-Plus 数据层
  ├── 统一响应与异常处理
  ├── 登录认证与拦截器
  ├── 业务 CRUD
  └── WeBASE-Front 整合

第四步：测试文档（1天）
  └── 接口文档与测试用例
```

## 官方资源扩展

- [FISCO BCOS 官方文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/) - 联盟链平台完整文档
- [WeBASE 官方文档](https://webasedoc.readthedocs.io/zh_CN/latest/) - 区块链中间件平台文档
- [Solidity 官方文档](https://docs.soliditylang.org/zh/latest/) - Solidity 智能合约语言
- [Hardhat 官方文档](https://hardhat.org/docs) - 以太坊开发环境
- [Truffle 官方文档](https://trufflesuite.com/docs/) - 合约开发框架
- [Foundry Book](https://book.getfoundry.sh/) - Solidity 测试框架
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot) - Java Web 框架
- [MyBatis-Plus 官方文档](https://baomidou.com/) - ORM 增强工具
- [Hyperledger Caliper](https://hyperledger-caliper.github.io/caliper/) - 区块链性能测试工具