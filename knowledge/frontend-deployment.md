# 前端项目部署与优化

## 知识简介

区块链应用前端开发完成后，需要部署到服务器供用户访问。金砖大赛中，选手需要将前端项目打包并部署到指定环境。本知识点涵盖 Vite 项目构建优化、Nginx 部署配置、以及 GitHub Pages 自动部署，帮助选手掌握从开发到上线的完整流程。

## 核心概念

- **Vite 构建**：`vite build` 将源码打包为生产环境可用的静态文件
- **构建优化**：代码分割、Tree Shaking、资源压缩、CDN 加速
- **Nginx 部署**：配置静态文件服务和反向代理，解决 SPA 路由问题
- **环境变量**：通过 `.env` 文件区分开发/生产环境配置
- **CI/CD 自动部署**：使用 GitHub Actions 实现代码推送后自动构建部署

## 详细讲解

### 1. 环境变量配置

`.env.development`（开发环境）：

```bash
# 开发环境 API 地址（通过 Vite 代理）
VITE_API_BASE_URL=/webase
VITE_NODE_RPC_URL=http://localhost:5002/WeBASE-Front/web3/1
VITE_APP_TITLE=区块链应用平台(开发)
```

`.env.production`（生产环境）：

```bash
# 生产环境 API 地址（直接访问 WeBASE 服务）
VITE_API_BASE_URL=http://192.168.1.100:5002/WeBASE-Front
VITE_NODE_RPC_URL=http://192.168.1.100:5002/WeBASE-Front/web3/1
VITE_APP_TITLE=区块链应用平台
```

TypeScript 类型声明（`src/env.d.ts`）：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_NODE_RPC_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 2. Vite 构建优化（vite.config.ts）

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    // 打包分析工具（可选）
    visualizer({ open: false })
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 生态单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 组件库单独打包
          'element-plus': ['element-plus'],
          // 图表库单独打包
          'echarts': ['echarts', 'vue-echarts'],
          // 区块链库单独打包
          'web3': ['web3']
        },
        // 资源文件命名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // 生产环境移除 console
        drop_debugger: true    // 移除 debugger
      }
    },
    // 资源内联阈值（小于 4KB 的资源内联为 base64）
    assetsInlineLimit: 4096,
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 1500
  },
  server: {
    port: 3000,
    proxy: {
      '/webase': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webase/, '')
      }
    }
  }
})
```

### 3. Nginx 部署配置

```nginx
server {
    listen       80;
    server_name  blockchain.example.com;

    # 前端静态文件
    location / {
        root   /usr/share/nginx/html/blockchain-app;
        index  index.html index.htm;
        # SPA 路由：所有路径都回退到 index.html
        try_files $uri $uri/ /index.html;

        # 静态资源缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 反向代理到 WeBASE-Front
    location /WeBASE-Front/ {
        proxy_pass http://192.168.1.100:5002/WeBASE-Front/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;  # 区块链交易可能较慢
    }
}
```

### 4. GitHub Actions 自动部署

`.github/workflows/deploy.yml`：

```yaml
name: Deploy Blockchain App

on:
  push:
    branches: [main]
  workflow_dispatch:  # 支持手动触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run docs:build

      - name: Configure git user
        run: |
          git config --global user.email "actions@github.com"
          git config --global user.name "GitHub Actions"

      - name: Deploy to GitHub Pages
        run: npm run deploy
```

### 5. 构建命令

```bash
# 本地预览构建结果
npm run docs:build && npm run docs:preview

# 部署到 GitHub Pages
npm run deploy
```

## 重点内容

- **环境变量**：通过 `VITE_` 前缀暴露给客户端代码，区分开发/生产环境
- **代码分割**：`manualChunks` 将第三方库单独打包，利用浏览器缓存
- **SPA 路由**：Nginx 使用 `try_files` 将所有路由指向 `index.html`
- **反向代理**：Nginx 代理 API 请求到 WeBASE 后端，避免跨域问题
- **CI/CD**：GitHub Actions 实现推送代码自动构建部署

## 实际应用场景

- 比赛现场部署：将前端打包后部署到指定的服务器
- 演示环境搭建：快速部署到 GitHub Pages 供评委查看
- 生产环境部署：配置 Nginx + 域名 + HTTPS

## 注意事项

- 生产环境必须移除 `console.log` 和 `debugger`
- SPA 应用部署到非根路径时，需要配置 `vite.config.ts` 的 `base` 和 `router` 的 `base`
- Nginx 的 `try_files` 配置对 SPA 路由至关重要
- GitHub Pages 部署需要注意 `base` 路径设置为仓库名

## 常见误区

- 误区：生产环境忘记修改 API 地址，导致请求发到 localhost
- 误区：Nginx 没有配置 `try_files`，导致刷新页面 404
- 误区：资源文件没有配置缓存策略，导致每次都要重新下载
- 误区：`manualChunks` 分割过细，HTTP 请求数过多

## 关联知识点

- [Vue 3 + TS 项目搭建](/knowledge/vue3-ts-project-setup)
- [Vue Router 4 路由](/knowledge/vue-router4-advanced)
- [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation)

## 官方资源扩展

- [Vite 构建生产版本](https://cn.vitejs.dev/guide/build.html) - Vite 官方构建配置指南
- [Vite 环境变量与模式](https://cn.vitejs.dev/guide/env-and-mode.html) - 官方环境变量文档
- [Nginx 官方文档](https://nginx.org/en/docs/) - Nginx 最权威的官方文档
- [GitHub Pages 官方文档](https://docs.github.com/zh/pages) - GitHub Pages 部署指南
- [GitHub Actions 官方文档](https://docs.github.com/zh/actions) - CI/CD 自动化部署指南