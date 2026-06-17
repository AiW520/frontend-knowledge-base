# 前端知识库

基于项目实战代码提取的前端开发知识库，覆盖 Vue 2/Vue 3、工程化、CSS、JavaScript 等核心领域。

---

## 🏆 金砖大赛 - 区块链前端开发（专项训练）

**专为一带一路暨金砖国家技能发展与技术创新大赛——区块链应用开发与运维赛项前端部分设计**。赛题采用 **「填空式」** 命题，选手需在 Vue 3 + TypeScript 项目模板中补充关键代码。本模块根据赛题规律，提供 10 个核心技能专项训练，每个知识点均包含**同类场景的完整代码示例**和**官方最佳学习资源**。

- [赛项概述与赛程](/knowledge/blockchain-frontend-overview) - 比赛流程、模块分值、考核方式、技术栈
- [Vue 3 登录表单开发](/knowledge/vue3-ts-project-setup) - 表单双绑、非空验证、API调用、路由跳转
- [Vue 3 数据列表与表格](/knowledge/element-plus) - Element Plus 表格、分页、数据获取、loading
- [Vue Router 4 路由导航](/knowledge/vue-router4-advanced) - 路由跳转、传参、导航守卫、重定向
- [Axios 封装与 API 调用](/knowledge/axios-api-encapsulation) - 拦截器、统一错误处理、请求封装
- [Vue 3 文件下载功能](/knowledge/web3-blockchain-interaction) - a标签下载、Blob流、下载提示
- [Element Plus 表单验证](/knowledge/smart-contract-frontend) - el-form验证、自定义校验规则
- [错误处理与用户反馈](/knowledge/blockchain-data-visualization) - ElMessage、异常捕获、loading状态
- [项目配置与环境搭建](/knowledge/form-validation) - vite.config.ts、环境变量、代理
- [综合实战：完整页面开发](/knowledge/frontend-deployment) - 数据流：获取→展示→交互→反馈

---

## 🔷 金砖大赛 - 区块链后端（全栈训练）

**覆盖区块链应用开发与运维赛项的全部后端考点（85分）**，包含区块链平台运维、智能合约开发与测试、Spring Boot 后端开发、测试文档编写四大模块，共 25 个知识点。每个知识点提供同类场景的完整代码示例和官方最佳学习资源。

### 🔧 区块链平台运维（20分）

- [后端开发总览](/knowledge/blockchain-backend-overview) - 赛项后端全景、模块分值、技术栈
- [FISCO BCOS 区块链搭建](/knowledge/fisco-bcos-deployment) - 搭链脚本、节点启动、SDK证书
- [区块链控制台 Console](/knowledge/blockchain-console) - 合约部署、交易查询、命令行操作
- [WeBASE 平台搭建](/knowledge/webase-platform) - 节点前置、管理平台、可视化运维
- [区块链节点监控](/knowledge/blockchain-node-monitor) - 节点状态、区块同步、告警配置
- [Caliper 压力测试](/knowledge/caliper-stress-test) - 吞吐量、延迟、TPS测试报告

### 📝 智能合约开发与测试（35分）

- [Solidity 基础语法](/knowledge/solidity-basics) - 数据类型、函数、修饰器、事件
- [Solidity 进阶：存储分离](/knowledge/solidity-storage-pattern) - mapping、struct、存储模式
- [Solidity 进阶：金融协议](/knowledge/solidity-finance) - 转账、质押、计息
- [Hardhat 测试框架](/knowledge/hardhat-testing) - 合约编译、部署脚本、测试用例
- [Truffle + Ganache](/knowledge/truffle-ganache) - 迁移脚本、本地测试网
- [Foundry 测试框架](/knowledge/foundry-testing) - forge 测试、cast 交互
- [智能合约安全](/knowledge/smart-contract-security) - 重入攻击、溢出、访问控制
- [Solana 合约开发](/knowledge/solana-contract) - Rust Anchor、PDA、跨链概念

### ☕ Spring Boot 后端开发（20分）

- [项目搭建与配置](/knowledge/springboot-project-setup) - Maven、配置文件、启动类
- [MyBatis-Plus 实体与 Mapper](/knowledge/mybatis-plus-entity) - 实体映射、BaseMapper、CRUD
- [MyBatis-Plus Service 层](/knowledge/mybatis-plus-service) - IService、ServiceImpl、业务封装
- [统一响应与异常处理](/knowledge/springboot-unified-response) - R类、全局异常、状态码
- [登录认证开发](/knowledge/springboot-login-auth) - JWT、密码加密、登录接口
- [登录拦截器](/knowledge/springboot-login-interceptor) - HandlerInterceptor、Token校验
- [业务 CRUD 实战（上）](/knowledge/springboot-crud-1) - 分页查询、条件筛选
- [业务 CRUD 实战（下）](/knowledge/springboot-crud-2) - 新增修改删除、关联查询
- [整合 WeBASE-Front](/knowledge/springboot-webase-integration) - 合约调用、交易上链
- [Postman 接口测试](/knowledge/postman-api-testing) - 请求集合、环境变量、断言

### 📋 测试文档编写（10分）

- [接口文档与测试用例](/knowledge/api-doc-test-case) - Swagger、接口文档、测试用例模板

---

## 知识来源

本知识库所有内容均来源于以下项目代码：

| 项目 | 技术栈 | 知识点 |
|------|--------|--------|
| jinzhuan-project-web | Vue 3 + TS + Ant Design Vue + Tailwind + Pinia + Vite | Composition API、Pinia、TypeScript、Vite、ECharts |
| 电子签章系统 | Vue 2 + Bootstrap + axios | Vue 实例、组件、axios 请求、Bootstrap 布局 |
| 供应链金融应用 | Vue 2 + Element UI + Vue Router | Vue Router、Element UI、拦截器、Cookie |
| 学籍管理系统 | Vue 2 + Bootstrap + axios | 表单验证、token 认证、axios 拦截器 |
| front-vue3（签章系统） | Vue 2 + Element UI + Vue Router | 路由配置、Element UI、axios |

---

## 知识分类

### Vue 3 进阶（新增）

- [Composition API](/knowledge/vue3-composition-api)
- [&lt;script setup&gt; 语法糖](/knowledge/vue3-script-setup)
- [Pinia 状态管理](/knowledge/pinia)
- [TypeScript 基础](/knowledge/vue3-typescript)
- [Vue Router 4](/knowledge/vue-router4)

### Vue 2 核心

- [Vue 实例创建](/knowledge/vue-instance)
- [模板语法](/knowledge/vue-template-syntax)
- [数据绑定](/knowledge/vue-data-binding)
- [事件处理](/knowledge/vue-event-handling)
- [条件渲染](/knowledge/vue-conditional-rendering)
- [列表渲染](/knowledge/vue-list-rendering)
- [生命周期](/knowledge/vue-lifecycle)
- [组件注册](/knowledge/vue-component)
- [Vue Router](/knowledge/vue-router)

### axios HTTP

- [HTTP 请求](/knowledge/axios-http)
- [拦截器](/knowledge/axios-interceptors)
- [高级封装](/knowledge/axios-advanced)
- [Token 存储](/knowledge/localstorage-token)

### Element UI

- [布局系统](/knowledge/element-ui-layout)
- [表单组件](/knowledge/element-ui-form)
- [表格组件](/knowledge/element-ui-table)

### Ant Design Vue 3（新增）

- [Ant Design Vue 3 入门](/knowledge/ant-design-vue3)

### Vite + 工程化（新增）

- [Vite 构建工具](/knowledge/vite)
- [Vite 插件系统](/knowledge/vite-plugins)
- [代码分割与优化](/knowledge/code-splitting)
- [Vue CLI 代理](/knowledge/vue-cli-proxy)

### Bootstrap 3

- [栅格系统](/knowledge/bootstrap-grid)
- [导航条](/knowledge/bootstrap-navbar)
- [模态框](/knowledge/bootstrap-modal)

### CSS

- [Flexbox 布局](/knowledge/css-flexbox)
- [定位](/knowledge/css-position)
- [盒模型](/knowledge/css-box-model)
- [Sass/SCSS](/knowledge/sass-scss)（新增）
- [Tailwind CSS](/knowledge/tailwind-css)（新增）

### JavaScript

- [FileReader API](/knowledge/filereader)
- [Canvas API](/knowledge/canvas-api)
- [DOM 操作](/knowledge/dom-manipulation)
- [表单验证](/knowledge/form-validation)
- [工具函数](/knowledge/frontend-utils)（新增）

### 数据可视化（新增）

- [ECharts](/knowledge/echarts)

---

## 学习路径建议

1. **[Vue 2 核心](/knowledge/vue-instance)** 基础知识入门（9个知识点）
2. **[CSS 布局](/knowledge/css-flexbox)** 样式基础
3. **[JavaScript 应用](/knowledge/filereader)** 浏览器 API
4. **[Vue 3 进阶](/knowledge/vue3-composition-api)** 现代 Vue 开发
5. **[Vite + 工程化](/knowledge/vite)** 构建与部署