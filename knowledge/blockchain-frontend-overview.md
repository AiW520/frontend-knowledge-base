# 区块链前端开发概述（金砖大赛专项）

## 竞赛背景

**一带一路暨金砖国家技能发展与技术创新大赛——区块链应用开发与运维赛项**是金砖国家间技能竞赛的重要组成部分。2025年已举办第四届，2026年将举办第五届。

### 竞赛基本信息

| 项目 | 说明 |
|------|------|
| 主办单位 | 金砖国家工商理事会中方理事会、一带一路暨金砖国家技能发展国际联盟 |
| 竞赛形式 | 团体赛（2人/队），设高职组、本科组、国际组 |
| 竞赛时长 | 1天（含开幕式、竞赛、闭幕式） |
| 竞赛总分 | 100分 |
| 竞赛平台 | FISCO BCOS + WeBASE + Spring Boot + Vue.js |

## 竞赛模块与分值

| 模块 | 内容 | 分值 |
|------|------|------|
| **第一部分** | 区块链平台运维 | 20分 |
| **第二部分** | 智能合约开发与测试 | 35分 |
| **第三部分** | 区块链应用系统开发 | 40分 |
| **第四部分** | 职业素养 | 5分 |

### 第三部分详解（与前端直接相关）

| 子题 | 内容 | 分值 |
|------|------|------|
| 第1题 | 后端功能开发（Spring Boot） | 20分 |
| **第2题** | **前端功能开发（Vue.js）** | **10分** |
| 第3题 | 系统设计与测试文档 | 10分 |

## 前端考核方式

前端考核采用 **「填空式」** 命题方式：

- 组委会提供一套完整的 Vue 3 + TypeScript 项目模板
- 代码中预留 `// 选手填写部分` 注释标记
- 选手需要在这些位置补充正确的代码逻辑
- 考核内容涵盖：**表单验证、API调用、数据绑定、列表渲染、路由跳转、文件下载、错误处理**

## 前端技术栈

```
Vue 3 + TypeScript + Vite
├── Element Plus        # UI 组件库（表格、表单、弹窗、消息提示）
├── Pinia               # 状态管理
├── Vue Router 4        # 路由管理
├── Axios               # HTTP 请求库
└── WeBASE-Front API    # 区块链中间件接口
```

## 竞赛环境

- **操作系统**：Windows + WSL（Windows Subsystem for Linux）
- **开发工具**：VSCode
- **区块链平台**：FISCO BCOS 联盟链
- **中间件**：WeBASE-Front（节点前置服务）、WeBASE-Node-Manager、WeBASE-Web
- **后端框架**：Spring Boot
- **前端框架**：Vue 3 + TypeScript + Vite

## 前端知识体系

根据往年赛题规律，前端考核核心能力分为以下 10 个知识点：

| 序号 | 知识点 | 考核能力 |
|------|--------|---------|
| 1 | [Vue 3 登录表单开发](/knowledge/vue3-ts-project-setup) | 表单双绑、非空验证、API调用、路由跳转 |
| 2 | [Vue 3 数据列表与表格](/knowledge/element-plus) | Element Plus 表格、分页、数据获取、loading |
| 3 | [Vue Router 4 路由导航](/knowledge/vue-router4-advanced) | 路由跳转、传参、导航守卫 |
| 4 | [Axios 封装与 API 调用](/knowledge/axios-api-encapsulation) | 拦截器、统一错误处理、请求封装 |
| 5 | [Vue 3 文件下载功能](/knowledge/web3-blockchain-interaction) | Blob流、a标签下载、下载状态提示 |
| 6 | [Element Plus 表单验证](/knowledge/smart-contract-frontend) | el-form验证、自定义校验规则 |
| 7 | [错误处理与用户反馈](/knowledge/blockchain-data-visualization) | ElMessage、异常捕获、loading状态 |
| 8 | [项目配置与环境搭建](/knowledge/form-validation) | vite.config.ts、环境变量、代理 |
| 9 | [综合实战：完整页面开发](/knowledge/frontend-deployment) | 数据流：获取→展示→交互→反馈 |
| 10 | [api规范与调用](/knowledge/axios-api-encapsulation) | uriCode、请求参数、响应结构 |

## 学习路径建议

1. 先掌握 **Vue 3 + TypeScript 基础**（模板语法、响应式、组件通信）
2. 熟悉 **Element Plus 组件**（表格、表单、弹窗、消息提示）
3. 掌握 **Axios 封装**（请求拦截、响应拦截、错误处理）
4. 理解 **Vue Router 4**（路由配置、编程式导航、路由守卫）
5. 综合实战 —— 完成一个完整的列表页面（获取数据 → 展示表格 → 交互反馈）

## 官方学习资源

- [Vue 3 官方文档](https://cn.vuejs.org/) - Vue 3 完整中文文档，最佳入门资源
- [Element Plus 官方文档](https://element-plus.org/zh-CN/) - 每个组件都有完整示例
- [Vue Router 4 官方文档](https://router.vuejs.org/zh/) - 路由导航完整指南
- [Axios 官方文档](https://axios-http.com/zh/docs/intro) - HTTP 请求库中文文档
- [TypeScript 官方手册](https://www.typescriptlang.org/zh/docs/handbook/intro.html) - TS 入门指南
- [Vite 官方中文文档](https://cn.vitejs.dev/) - 构建工具完整指南
- [金砖大赛官网](http://www.brskills.com) - 大赛官方通知与技术文件