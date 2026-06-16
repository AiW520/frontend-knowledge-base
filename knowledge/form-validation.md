# 项目配置与环境搭建

## 竞赛关联

比赛环境搭建阶段，选手需要正确配置 Vite 项目的代理转发和环境变量，确保前端能正确连接到后端 API 服务。这是项目运行的基础，配置错误会导致整个前端无法工作。

## 核心技能

- **vite.config.ts 配置**：开发服务器端口、代理转发、路径别名
- **环境变量配置**：`.env.development` / `.env.production` 区分环境
- **TypeScript 配置**：tsconfig.json 路径别名
- **依赖安装**：Element Plus、Axios、Vue Router、Pinia 等

## 详细讲解

### 1. vite.config.ts 完整配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  // 开发服务器配置
  server: {
    port: 3000,           // 前端端口
    host: '0.0.0.0',     // 允许外部访问
    proxy: {
      // 关键：代理配置，解决跨域问题
      '/api': {
        target: 'http://localhost:8080',  // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // 去掉 /api 前缀
      }
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
})
```

### 2. 环境变量配置

```bash
# .env.development（开发环境）
VITE_API_BASE_URL=/api
VITE_APP_TITLE=区块链应用平台(开发)
VITE_BACKEND_PORT=8080
```

```bash
# .env.production（生产环境）
VITE_API_BASE_URL=http://production-server:8080/api
VITE_APP_TITLE=区块链应用平台
```

```typescript
// src/env.d.ts - 环境变量类型声明
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

在代码中使用环境变量：

```typescript
// 使用环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

### 3. tsconfig.json 关键配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### 4. 项目依赖安装

```bash
# 核心依赖
npm install vue@3 vue-router@4 pinia axios element-plus

# 图标库
npm install @element-plus/icons-vue

# 开发依赖
npm install -D vite @vitejs/plugin-vue typescript vue-tsc

# 如果使用 Element Plus 按需导入
npm install -D unplugin-vue-components unplugin-auto-import
```

### 5. 代理配置详解

| 场景 | 前端请求 | 代理转发到 |
|------|---------|-----------|
| 开发环境 | `/api/user/login` | `http://localhost:8080/user/login` |
| 开发环境 | `/api/contract/list` | `http://localhost:8080/contract/list` |
| 生产环境 | `http://server:8080/api/user/login` | 直接请求，不走代理 |

**代理配置的核心要点**：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // 后端地址
    changeOrigin: true,               // 修改请求头中的 origin
    rewrite: (path) => path.replace(/^\/api/, '')  // 去掉 /api 前缀
  }
}
```

## 重点内容

- `server.proxy` 是解决开发环境跨域问题的关键配置
- 环境变量必须以 `VITE_` 开头才能被前端代码访问
- `@` 路径别名需要在 `vite.config.ts`（运行时）和 `tsconfig.json`（类型检查）中同时配置
- Element Plus 推荐按需导入，减小打包体积

## 注意事项

- 代理配置中的 `target` 地址必须是后端服务实际运行的地址
- `rewrite` 参数决定请求路径如何转换，需根据后端接口路径规则配置
- 环境变量文件（`.env`）不应提交到 git（包含敏感信息）
- 生产环境打包后代理不生效，需要 Nginx 配置或 API 地址直接指向后端

## 常见误区

- 误区：代理 target 地址写错，接口 404
- 误区：忘记在 `tsconfig.json` 中配置 `@` 路径别名，TS 报错找不到模块
- 误区：环境变量名不以 `VITE_` 开头，前端无法读取
- 误区：proxy 的 `rewrite` 规则写反，路径转换错误

## 官方资源扩展

- [Vite 开发服务器配置](https://cn.vitejs.dev/config/server-options.html) - 官方 server 配置文档，最佳学习资源
- [Vite 环境变量](https://cn.vitejs.dev/guide/env-and-mode.html) - 官方环境变量指南
- [Vite 路径别名](https://cn.vitejs.dev/config/shared-options.html#resolve-alias) - 官方别名配置
- [TypeScript 路径映射](https://www.typescriptlang.org/tsconfig#paths) - TS 官方 paths 配置