# 前端知识库

这是一个面向区块链应用类竞赛前端部分的训练知识库，主线聚焦 **Vue3 + Vite + TypeScript 项目级挖空补全**。

这份知识库由学长结合比赛经验、训练复盘和备赛建议整理，帮助学员围绕前端关键能力系统学习和限时训练。

---

## 🏆 前端主线：Vue3 项目级挖空

这类前端任务不是从零写页面，而是在已有项目中补齐关键代码。学习重点是：

```text
读项目结构 -> 定位挖空类型 -> 查已有变量 -> 调统一 API -> 更新页面状态 -> 完成交付截图
```

优先学习：

- [前端竞赛考点学习路径](/knowledge/frontend-competition-roadmap) - 前端主线、项目阅读顺序、答题策略
- [Vue3 项目级挖空训练营](/knowledge/vue3-project-blank-camp) - 项目地图、读空五步法、四套训练
- [前端填空题型训练](/knowledge/frontend-fill-blank-training) - 模板小空、页面块空、函数大空
- [Axios 封装与 API 调用](/knowledge/axios-api-encapsulation) - API 映射、统一请求、错误处理
- [Vue 3 数据列表与表格](/knowledge/element-plus) - 列表、分页、loading、空状态
- [Vue Router 4 路由导航](/knowledge/vue-router4-advanced) - 登录跳转、路由参数、页面入口
- [前端联调最小知识](/knowledge/frontend-fullstack-context) - 前端必须看懂的后端响应和链上字段
- [综合实战：完整页面开发](/knowledge/frontend-deployment) - 页面闭环与交付检查

---

## 前端能力地图

| 层级 | 训练内容 | 目标 |
| --- | --- | --- |
| 项目阅读 | `main.ts`、router、store、fetch、views、components | 快速知道代码应该补在哪里 |
| 模板补全 | `:key`、`{{ }}`、`:class`、`v-if`、`@click` | 页面能正常渲染和交互 |
| 表单补全 | `reactive`、`v-model:value`、校验、弹窗 | 能完成登录、新增、编辑 |
| 请求补全 | API 编号、参数、响应字段、异常处理 | 数据能进页面，失败有提示 |
| 列表分页 | current、size、total、records、搜索条件 | 列表页可评分、可截图 |
| 文件处理 | 上传校验、Blob 下载、释放 URL | 功能完整且不增加内存风险 |
| 链上展示 | 交易哈希、区块高度、合约地址、状态 | 页面能展示关键证据 |
| 交付检查 | 运行、截图、错误处理、空状态 | 交付结果清晰可信 |

---

## 推荐学习顺序

1. [Vue3 项目级挖空训练营](/knowledge/vue3-project-blank-camp)
2. [前端填空题型训练](/knowledge/frontend-fill-blank-training)
3. [Vue 3 登录表单开发](/knowledge/vue3-ts-project-setup)
4. [Axios 封装与 API 调用](/knowledge/axios-api-encapsulation)
5. [Vue 3 数据列表与表格](/knowledge/element-plus)
6. [前端联调最小知识](/knowledge/frontend-fullstack-context)
7. [综合实战：完整页面开发](/knowledge/frontend-deployment)

---

## 工程支撑能力

### Vue3 与工程化

- [Composition API](/knowledge/vue3-composition-api)
- [&lt;script setup&gt; 语法糖](/knowledge/vue3-script-setup)
- [TypeScript 基础](/knowledge/vue3-typescript)
- [Pinia 状态管理](/knowledge/pinia)
- [Vue Router 4](/knowledge/vue-router4)
- [Vite 构建工具](/knowledge/vite)
- [Vite 插件系统](/knowledge/vite-plugins)

### 前端通用能力

- [HTTP 请求](/knowledge/axios-http)
- [拦截器](/knowledge/axios-interceptors)
- [Token 存储](/knowledge/localstorage-token)
- [文件处理 FileReader](/knowledge/filereader)
- [表单验证](/knowledge/form-validation)
- [工具函数](/knowledge/frontend-utils)
- [ECharts](/knowledge/echarts)

---

## Vue2 省赛补充

Vue2、Element UI、Bootstrap、Vue CLI 更适合省赛或旧项目补充学习，不作为当前 Vue3 项目级挖空主线。

- [Vue 实例创建](/knowledge/vue-instance)
- [模板语法](/knowledge/vue-template-syntax)
- [数据绑定](/knowledge/vue-data-binding)
- [事件处理](/knowledge/vue-event-handling)
- [列表渲染](/knowledge/vue-list-rendering)
- [Element UI 表单组件](/knowledge/element-ui-form)
- [Bootstrap 栅格系统](/knowledge/bootstrap-grid)

---

## 学习原则

- 先读工程约定，再写代码。
- 先补能跑通闭环的空，再补展示细节。
- 例子只学方法，不背字段名。
- 页面必须有成功、失败、loading、空状态反馈。
- 前端只需要理解后端和链端的联调字段，不把后端/合约作为主线。
