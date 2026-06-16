# 区块链前端开发概述（金砖大赛专项）

## 知识简介

本模块专为**一带一路暨金砖国家技能发展与技术创新大赛——区块链应用开发与运维赛项**前端部分设计。赛项以区块链典型应用场景为竞赛背景，考核选手运用主流前后端开发框架进行区块链应用系统构建的能力。前端部分要求掌握 **Vue 3 + TypeScript + Element Plus + Web3.js** 技术栈，完成区块链应用平台的前端界面设计与功能实现。

## 赛项背景

- **赛事名称**：一带一路暨金砖国家技能发展与技术创新大赛之区块链应用开发与运维赛项
- **主办单位**：金砖国家工商理事会中方理事会、一带一路暨金砖国家技能发展国际联盟
- **竞赛平台**：FISCO BCOS（区块链底层平台）+ WeBASE（区块链中间件平台）
- **竞赛形式**：团体赛（2人/队），设高职组、本科组、国际组
- **前端考核内容**：区块链应用系统前后端开发与测试，包括界面设计、API 对接、智能合约调用、数据可视化

## 核心概念

- **FISCO BCOS**：国产开源联盟链底层平台，由微众银行牵头研发
- **WeBASE**：区块链应用管理平台，提供节点管理、合约管理、交易查询等中间件服务
- **Web3.js**：以太坊 JavaScript API 库，用于前端与区块链节点交互
- **Solidity**：智能合约编程语言，运行在以太坊虚拟机（EVM）上
- **Vue 3 + TypeScript**：赛项推荐的前端框架组合

## 技术栈全景图

```
┌─────────────────────────────────────────────────┐
│                  前端应用层                       │
│  Vue 3 + TypeScript + Element Plus + Pinia       │
│  Vue Router 4 + Axios + ECharts                 │
├─────────────────────────────────────────────────┤
│              区块链交互层                         │
│  Web3.js / ethers.js + WeBASE-Front API         │
├─────────────────────────────────────────────────┤
│              区块链中间件层                       │
│  WeBASE（节点前置 / 交易服务 / 合约管理）          │
├─────────────────────────────────────────────────┤
│              区块链底层                           │
│  FISCO BCOS（共识 / 存储 / P2P 网络）             │
└─────────────────────────────────────────────────┘
```

## 重点内容

- 赛项前端开发需要与 WeBASE-Front 的 RESTful API 进行数据交互
- 智能合约调用需要理解 ABI（Application Binary Interface）编码
- 区块链交易需要处理 Gas 费用、交易确认等异步操作
- 前端需要展示区块链特有的数据：区块高度、交易哈希、合约地址等

## 学习路径（10个知识点）

| 序号 | 知识点 | 说明 |
|------|--------|------|
| 1 | [Vue 3 + TS 项目搭建](/knowledge/vue3-ts-project-setup) | Vite + Vue 3 + TypeScript 工程化搭建 |
| 2 | [Element Plus 组件库](/knowledge/element-plus) | 企业级 UI 组件库实战，表单/表格/弹窗 |
| 3 | [Vue Router 4 路由](/knowledge/vue-router4-advanced) | 路由配置、导航守卫、权限控制 |
| 4 | [Pinia 状态管理](/knowledge/pinia) | 全局状态管理、模块化 store |
| 5 | [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation) | 请求/响应拦截器、WeBASE API 对接 |
| 6 | [Web3.js 区块链交互](/knowledge/web3-blockchain-interaction) | 连接节点、查询区块、发送交易 |
| 7 | [智能合约前端调用](/knowledge/smart-contract-frontend) | ABI 加载、合约方法调用、事件监听 |
| 8 | [区块链数据可视化](/knowledge/blockchain-data-visualization) | ECharts 展示区块数据、交易统计 |
| 9 | [表单设计与验证](/knowledge/form-validation) | 复杂表单设计、异步校验 |
| 10 | [前端部署与优化](/knowledge/frontend-deployment) | 构建优化、Nginx 部署、环境配置 |

## 实际应用场景

- 区块链存证系统前端（证书上链、存证查询）
- 供应链金融平台前端（资产流转、交易记录）
- 数字身份管理系统前端（DID 创建、凭证管理）
- 区块链浏览器（区块/交易/合约查询）

## 注意事项

- 赛项前端开发环境通常为离线或内网环境，需提前熟悉依赖管理
- WeBASE-Front 默认端口为 5002，前端需配置代理解决跨域
- 区块链交易是异步的，前端需要处理 pending → confirmed 的状态流转
- 智能合约 ABI 需要与合约代码同步更新

## 官方资源扩展

- [金砖大赛官网](http://www.brskills.com) - 大赛官方通知、技术文件下载
- [FISCO BCOS 官方文档](https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/) - 区块链底层平台完整文档
- [WeBASE 官方文档](https://webasedoc.readthedocs.io/zh_CN/latest/) - 区块链中间件平台文档
- [Vue 3 官方文档](https://cn.vuejs.org/) - Vue 3 完整中文文档
- [TypeScript 官方文档](https://www.typescriptlang.org/zh/) - TypeScript 中文手册
- [Element Plus 官方文档](https://element-plus.org/zh-CN/) - Element Plus 组件库文档