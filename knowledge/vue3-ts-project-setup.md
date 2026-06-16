# Vue 3 + TypeScript + Vite 项目搭建

## 知识简介

使用 Vite 构建工具快速搭建 Vue 3 + TypeScript 项目，是区块链应用开发的第一步。Vite 提供极速的冷启动和热更新，TypeScript 提供类型安全，Vue 3 的组合式 API 提供更好的逻辑组织能力。本知识点将完整演示从零搭建一个可用于金砖大赛区块链前端开发的项目。

## 核心概念

- **Vite**：新一代前端构建工具，基于 ES Module，开发服务器秒级启动
- **TypeScript**：JavaScript 的超集，提供静态类型检查
- **Vue 3 Composition API**：`<script setup>` 语法糖 + 响应式 API
- **项目结构规范**：src/views、src/components、src/api、src/stores、src/router 目录划分

## 详细讲解

### 1. 创建项目

```bash
# 使用 Vite 官方模板创建项目
npm create vite@latest blockchain-app -- --template vue-ts

# 进入项目目录
cd blockchain-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 推荐项目结构

```
blockchain-app/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口层
│   │   ├── webase.ts          # WeBASE API 接口
│   │   └── contract.ts        # 合约相关接口
│   ├── assets/                # 样式/图片资源
│   ├── components/            # 公共组件
│   │   ├── BlockHash.vue      # 区块哈希展示组件
│   │   ├── TransactionList.vue # 交易列表组件
│   │   └── ContractForm.vue   # 合约交互表单
│   ├── composables/           # 组合式函数
│   │   ├── useWeb3.ts         # Web3 连接 hooks
│   │   └── useContract.ts     # 合约操作 hooks
│   ├── router/                # 路由配置
│   │   └── index.ts
│   ├── stores/                # Pinia 状态管理
│   │   ├── blockchain.ts     # 区块链状态
│   │   └── user.ts           # 用户状态
│   ├── types/                 # TypeScript 类型定义
│   │   ├── blockchain.d.ts    # 区块链相关类型
│   │   └── api.d.ts           # API 响应类型
│   ├── views/                 # 页面组件
│   │   ├── BlockExplorer.vue  # 区块链浏览器
│   │   ├── ContractDeploy.vue # 合约部署
│   │   └── Dashboard.vue      # 仪表盘
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts               # 环境变量类型声明
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 3. Vite 配置（vite.config.ts）

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')  // 路径别名
    }
  },
  server: {
    port: 3000,
    // 代理配置：解决 WeBASE API 跨域问题
    proxy: {
      '/webase': {
        target: 'http://localhost:5002',  // WeBASE-Front 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webase/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
})
```

### 4. TypeScript 配置（tsconfig.json）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 重点内容

- Vite 开发服务器默认端口 5173，可通过 `server.port` 自定义
- 代理配置是连接 WeBASE-Front 后端的关键，避免跨域问题
- `@` 路径别名需要在 `tsconfig.json` 和 `vite.config.ts` 中同时配置
- 环境变量文件（`.env.development` / `.env.production`）用于区分开发和生产环境的 API 地址

## 实际应用场景

- 金砖大赛中，需要在比赛开始前搭建好项目基础框架
- 区块链应用通常需要多个页面：仪表盘、区块浏览器、合约管理、交易记录
- 合理的前端项目结构能提高开发效率和代码可维护性

## 注意事项

- `vite.config.ts` 中 `server.proxy` 的 target 地址需要根据实际 WeBASE 部署地址修改
- TypeScript 严格模式（`strict: true`）能帮助避免类型错误，但需要养成写类型注解的习惯
- 比赛环境通常是离线环境，需要提前将依赖打包或缓存

## 常见误区

- 误区：路径别名只在 `vite.config.ts` 中配置，忘记在 `tsconfig.json` 中同步
- 误区：代理配置的 target 写错端口，导致 API 请求 404
- 误区：忽略 `.env` 文件的环境变量配置，导致生产环境 API 地址错误

## 关联知识点

- [Element Plus 组件库](/knowledge/element-plus)
- [Vue Router 4 路由](/knowledge/vue-router4-advanced)
- [Pinia 状态管理](/knowledge/pinia)

## 官方资源扩展

- [Vite 官方中文文档](https://cn.vitejs.dev/) - Vite 构建工具完整指南，最佳官方学习资源
- [Vue 3 官方文档 - 快速上手](https://cn.vuejs.org/guide/quick-start.html) - Vue 3 官方快速入门教程
- [TypeScript 官方中文手册](https://www.typescriptlang.org/zh/docs/handbook/intro.html) - TS 官方学习资源
- [Vue 3 + TypeScript 官方指南](https://cn.vuejs.org/guide/typescript/overview.html) - Vue 3 中使用 TypeScript 的官方最佳实践
- [create-vue 官方脚手架](https://github.com/vuejs/create-vue) - Vue 官方项目脚手架工具