# axios 高级封装

## 知识简介

在大型项目中，axios 需要进行封装才能高效复用。常见封装包括：请求/响应拦截器、统一错误处理、Token 自动注入、API 集中管理、RESTful 参数绑定。Vue3 项目级训练工程展示了企业级 axios 封装的完整方案。

## 核心概念

- **请求拦截器**：自动添加 Token、设置 Content-Type、处理 loading 状态
- **响应拦截器**：统一处理业务错误码、Token 过期自动跳转登录
- **API 集中管理**：将所有 API 定义为 `{ uri, method, showLoading }` 对象
- **Fetch 函数**：统一的请求函数，根据 API Code 自动匹配 URL 和方法
- **RESTful 绑定**：`:id` 占位符替换为实际参数值

## 详细讲解

Vue3 项目级训练工程的 axios 封装分为三个层次：

### 1. API 定义层（api.ts）
```javascript
const API = {
  API001: { title: '登录', uri: '/user/login', method: 'post', showLoading: true },
  API002: { title: '获取当前用户信息', uri: '/user/current', showLoading: true },
  API008: { title: '分页查询', uri: '/open-chain-config/page', showLoading: true },
}
```
所有 API 都通过唯一的 `uriCode` 来调用，无需知道具体 URL。

### 2. 拦截器层（index.ts 拦截器部分）
```javascript
// 请求拦截：自动添加 Token
axios.interceptors.request.use((config) => {
  config.headers['Authorization'] = sessionStorage.getItem('token')
  return config
})

// 响应拦截：统一处理业务错误
axios.interceptors.response.use(
  (response) => {
    if (data.code === 0) return data
    if (data.code === 40100) {  // Token 失效
      router.push({ name: 'login' })
    }
  },
  (error) => {
    // 网络错误处理
    message.error('网络连接失败')
  }
)
```

### 3. 请求调用层（Fetch 函数）
通过 `uriCode` 查找 API 定义，自动匹配 HTTP 方法和 URL，自动绑定 RESTful 参数。

## 重点内容

- `axios.interceptors.request.use()` 在请求发送前执行
- `axios.interceptors.response.use()` 在 then/catch 之前执行
- 拦截器中可以使用 `Promise.reject()` 中断请求
- API Code 模式使得后端接口变更时只需修改一处
- `bindVars` 机制实现了 RESTful 路由的动态参数绑定

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
// 请求拦截器
axios.interceptors.request.use((config) => {
  config.baseURL = '/demo'
  config.headers['Content-Type'] = 'application/json'
  config.headers['Authorization'] = sessionStorage.getItem('token') || ''
  config.timeout = 60000
  
  // 显示全局 loading
  if (config.headers._showLoading) {
    store().setGlobalLoading(true)
  }
  return config
})

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    store().setGlobalLoading(false)
    const { status, data } = response
    if (status >= 200 && status < 300 && data.code === 0) {
      return data  // 只返回业务数据
    }
    // Token 失效，跳转登录
    if (data.code === 40100) {
      sessionStorage.clear()
      router.push({ name: 'login' })
    }
    message.error(data.msg || '系统错误')
    return Promise.reject(response)
  },
  (error) => {
    store().setGlobalLoading(false)
    message.error('网络连接失败，请检查网络！')
    return Promise.reject(error)
  }
)
```

## 实际应用场景

- 企业级后台管理系统
- Token 自动刷新
- 请求重试机制
- 文件上传进度跟踪
- 请求取消（AbortController）

## 注意事项

- 拦截器中修改 `config.headers` 必须在返回 `config` 之前
- `response.data` 经过拦截器处理后可能已经是纯数据而非完整响应对象
- Token 过期时需要同时清除本地存储并跳转登录页
- 全局 loading 需要在响应拦截器的成功和失败分支都关闭

## 常见误区

- 误区：在请求拦截器中使用了异步操作但没有正确处理
- 误区：响应拦截器只处理成功情况而忽略错误处理
- 误区：每个页面单独定义 axios 请求，没有封装统一函数
- 误区：将业务状态码判断放在每个组件中而非拦截器中

## 关联知识点

- [axios HTTP 请求](/knowledge/axios-http)
- [axios 拦截器](/knowledge/axios-interceptors)
- [Token 存储](/knowledge/localstorage-token)
- [Pinia 状态管理](/knowledge/pinia)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（axios 封装、拦截器、Fetch 函数）
- 示例来源：通用训练工程抽象（API 定义）

## 官方资源扩展

- [axios 官方文档 - 拦截器](https://axios-http.com/docs/interceptors)
- axios 拦截器的官方文档
- [MDN - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- MDN 的 Fetch API 文档（与 axios 对比学习）