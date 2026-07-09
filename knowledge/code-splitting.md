# 代码分割与性能优化

## 知识简介

代码分割是将应用代码拆分成多个小块（chunk），按需加载，减少首屏加载时间。Vue3 项目级训练工程通过 Vite 的 `manualChunks` 配置和路由懒加载实现了代码分割优化。

## 核心概念

- **路由懒加载**：`component: () => import('../views/xxx.vue')`
- **manualChunks**：手动控制代码分割规则
- **预加载**：`<link rel="preload">` 提前加载关键资源
- **Tree Shaking**：移除未使用的代码
- **代码压缩**：terser 混淆压缩 JavaScript

## 详细讲解

在 Vue3 项目级训练工程中，代码分割主要通过两种方式实现：

### 1. 路由懒加载
在路由配置中，使用动态 `import()` 语法：
```typescript
{
  path: '/chain-manage',
  component: () => import('../views/chain/index.vue')
}
```
Vite 会自动将动态导入的模块拆分为独立的 chunk 文件。

### 2. manualChunks 配置
```typescript
build: {
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
这种配置将每个 `node_modules` 中的包拆分为独立的 chunk，充分利用浏览器缓存。例如：
- `axios.js` - axios 包
- `echarts.js` - echarts 包
- `ant-design-vue.js` - ant-design-vue 包

### 3. Gzip 压缩
项目使用 `vite-plugin-compression` 生成 `.gz` 文件，显著减小传输体积。

### 4. Terser 混淆
```typescript
build: { minify: 'terser' }
```

## 重点内容

- 路由懒加载只在用户访问该路由时才下载对应代码
- `manualChunks` 按包名拆分可以让第三方库独立缓存
- 公共依赖应提取为 vendor chunk，避免重复打包
- 压缩文件需要 Nginx 配置 `gzip_static on` 才能生效
- 构建分析工具（如 `rollup-plugin-visualizer`）帮助发现大模块

## 关键代码示例

示例来源：通用训练工程抽象

```typescript
build: {
  target: 'modules',
  outDir: 'dist',
  assetsDir: 'assets',
  minify: 'terser',
  chunkSizeWarningLimit: 1000,
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

构建后 `dist/assets/` 目录下的文件命名可以清晰看到每个包的独立 chunk：
- `axios-Dpboxq5V.js.gz`
- `ant-design-vue-DBX1kxjf.js.gz`
- `echarts-I81Q_AB6.js.gz`
- `pinia-Dc1B6umM.js.gz`
- `vue-router-BrgcMvXq.js.gz`

## 实际应用场景

- SPA 应用的性能优化
- 大型管理后台的首屏加载优化
- 移动端弱网环境的资源加载
- CDN 缓存策略配合

## 注意事项

- 代码分割过多会导致大量 HTTP 请求（HTTP/2 支持多路复用可缓解）
- `chunkSizeWarningLimit` 设置过大可能隐藏性能问题
- 压缩文件需要服务器配合才能生效
- `manualChunks` 需要测试确保不会破坏依赖关系

## 常见误区

- 误区：所有路由都懒加载（首页组件应该同步加载）
- 误区：认为代码分割越多越好（需要平衡请求数量）
- 误区：忽略构建后的体积分析

## 关联知识点

- [Vite 构建工具](/knowledge/vite)
- [Vite 插件系统](/knowledge/vite-plugins)
- [Vue Router 4](/knowledge/vue-router4)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（构建配置）
- 示例来源：通用训练工程抽象（路由懒加载）
- 示例来源：通用训练工程抽象（构建产物结构）

## 官方资源扩展

- [Vite 官方文档 - 构建生产版本](https://cn.vitejs.dev/guide/build.html)
- Vite 生产构建的官方指南，包括代码分割策略
- [Rollup 官方文档 - output.manualChunks](https://rollupjs.org/configuration-options/#output-manualchunks)
- Rollup 的 manualChunks 配置详解