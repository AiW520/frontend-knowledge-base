# Vue CLI 开发代理

## 知识简介

Vue CLI 的开发服务器提供代理功能，通过 `vue.config.js` 中的 `devServer.proxy` 配置，将前端请求转发到后端 API，解决开发环境中的跨域问题。

## 核心概念

- `devServer.proxy`：开发服务器代理配置
- `target`：代理目标地址（后端 API 地址）
- `pathRewrite`：路径重写规则
- `changeOrigin`：修改请求头中的 Host 字段

## 详细讲解

在供应链金融项目中，前端运行在 `localhost:8020`，后端 API 运行在 `localhost:8080`。为了解决跨域问题，配置了代理：

```javascript
const vueConfig = {
    devServer: {
        port: 8020,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
module.exports = vueConfig
```

配置说明：
- `port: 8020`：前端开发服务器端口
- `/api`：代理规则，匹配所有以 `/api` 开头的请求
- `target: 'http://localhost:8080/'`：将匹配的请求转发到后端
- `pathRewrite: { '^/api': '/' }`：将路径中的 `/api` 替换为 `/`
- `changeOrigin: true`：修改请求头中的 Host

在 `main.js` 中设置 axios 的 baseURL：
```javascript
axios.defaults.baseURL = '/api'
```

这样，前端发送的请求 `/api/finance/org/login` 会被代理转发到 `http://localhost:8080/finance/org/login`。

## 重点内容

- 代理只在开发环境生效，生产环境需要 Nginx 等反向代理
- `pathRewrite` 用于去掉路径中的代理前缀
- `changeOrigin: true` 避免后端验证 Host 头导致的问题
- 代理配置后，前端请求中不需要写完整的后端地址

## 关键代码示例

来源：`供应链—front/vue.config.js` 第 1-16 行

```javascript
const vueConfig = {
    devServer: {
        port: 8020,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
module.exports = vueConfig
```

来源：`供应链—front/src/main.js` 第 13 行

```javascript
axios.defaults.baseURL = '/api'
```

## 实际应用场景

- 前后端分离项目的开发环境
- 解决跨域问题
- 统一请求路径前缀

## 注意事项

- 代理配置只在 `vue-cli-service serve` 时生效
- 生产环境需要使用 Nginx 或其他反向代理
- 代理规则按顺序匹配，第一个匹配的规则生效

## 常见误区

- 误区：认为代理配置在生产环境也生效
- 误区：`pathRewrite` 的正则表达式写错导致路径替换失败

## 关联知识点

- [axios HTTP 请求](/knowledge/axios-http)
- [Vue Router](/knowledge/vue-router)

## 资料来源

- 来源文件：`供应链—front/vue.config.js`
- 来源文件：`供应链—front/src/main.js` 第 13 行

## 官方资源扩展

- [Vue CLI 官方文档 - devServer.proxy](https://cli.vuejs.org/zh/config/#devserver-proxy)
- 详细介绍开发服务器代理的配置方式