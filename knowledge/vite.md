# Vite 构建工具

## 知识简介

Vite 是下一代前端构建工具，基于原生 ES 模块（ESM），开发服务器秒级启动，使用 Rollup 进行生产构建。jinzhuan-project-web 项目使用 Vite 5 作为构建工具。

## 核心概念

- **开发服务器**：基于 esbuild，热模块替换（HMR）极快
- **生产构建**：基于 Rollup，支持代码分割和资源优化
- **`vite.config.ts`**：项目配置文件，定义插件、别名、代理等
- **插件系统**：兼容 Rollup 插件，丰富的 Vite 专属插件
- **路径别名**：使用 `@` 代替 `src/`，简化导入路径

## 详细讲解

jinzhuan-project-web 项目的 Vite 配置（`vite.config.ts`）包含以下主要配置：

**1. 路径别名**：配置 `@` 指向 `src` 目录
```typescript
resolve: {
  alias: { '@': path.resolve(__dirname, 'src') }
}
```

**2. 开发代理**：解决跨域问题，将 `/demo` 路径代理到后端
```typescript
server: {
  port: 9527,
  proxy: {
    '/demo': {
      target: 'https://192.168.195.117:12000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/demo/, '')
    }
  }
}
```

**3. 生产构建优化**：使用 `manualChunks` 按依赖拆分代码块
```typescript
build: {
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return id.toString().split('node_modules/')[1].split('/')[0].toString()
        }
      }
    }
  }
}
```

## 重点内容

- Vite 开发服务器使用 esbuild 预构建依赖，比 webpack 快 10-100 倍
- 配置文件中使用 `defineConfig()` 获得 TypeScript 类型提示
- Vue 组件不需要手动注册（通过 `@vitejs/plugin-vue` 插件）
- Vite 原生支持 `.ts`、`.tsx`、`.jsx`、CSS 预处理器等

## 关键代码示例

来源：`jinzhuan-project-web/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    host: '0.0.0.0',
    port: 9527,
    proxy: {
      '/demo': {
        target: 'https://192.168.195.117:12000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/demo/, '')
      }
    }
  },
  build: {
    minify: 'terser',
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

## 实际应用场景

- 新建 Vue 3 / React 项目（使用 `create-vite`）
- 替代 Vue CLI（构建速度更快）
- 多页面应用和库开发

## 注意事项

- Vite 的 `base` 配置影响所有资源路径，部署到 GitHub Pages 时需要设置为 `/<repo>/`
- 代理的 `rewrite` 函数用于去除路径前缀
- `.env` 文件中的环境变量需要 `VITE_` 前缀才能暴露给客户端
- `process.env` 在 Vite 中不可用，改用 `import.meta.env`

## 常见误区

- 误区：认为 Vite 和 webpack 完全不兼容（Vite 有 Rollup 生态的插件体系）
- 误区：将 webpack 配置直接迁移到 Vite（配置方式完全不同）
- 误区：生产中仍然使用 esbuild 打包（实际上生产构建使用 Rollup）

## 关联知识点

- [Vite 插件系统](/knowledge/vite-plugins)
- [代码分割与性能优化](/knowledge/code-splitting)
- [Vue CLI 代理配置](/knowledge/vue-cli-proxy)

## 资料来源

- 来源项目：`新前端资源/jinzhuan-project-web/`
- 来源文件：`vite.config.ts`（完整 Vite 配置）
- 来源文件：`package.json`（Vite 版本和脚本）

## 官方资源扩展

- [Vite 官方文档](https://cn.vitejs.dev/)
- Vite 官方中文文档，包含配置参考和最佳实践
- [Vite 官方文档 - 配置参考](https://cn.vitejs.dev/config/)
- 所有 Vite 配置选项的详细说明