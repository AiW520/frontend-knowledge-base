# axios HTTP 请求

## 知识简介

axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js 中发送 HTTP 请求。

## 核心概念

- `axios.get(url)`：发送 GET 请求
- `axios.post(url, data)`：发送 POST 请求
- `.then(response => {...})`：处理响应
- `response.data`：获取响应数据

## 详细讲解

在项目中，axios 用于与后端 API 进行数据交互。登录页面使用 POST 请求提交用户信息：

```javascript
axios.post("http://localhost/user/login", this.user).then(response => {
    if (response.data.resultCode == 200) {
        this.msg = "登录成功"
        this.tip = true
        localStorage.setItem('Authorization', response.data.data)
    }
})
```

签章记录页面使用 GET 请求获取数据列表：

```javascript
axios.get("http://localhost/seal/record").then(response => {
    if (response.data.resultCode == 200) {
        this.records = response.data.data
    }
})
```

在Vue2 业务演示项目中，axios 通过 vue-axios 插件集成到 Vue 原型上，可以直接通过 `this.axios` 访问：

```javascript
this.axios.post('/finance/org/login', postData).then((response) => {
    if (response.data.code == 200) {
        this.$cookies.set('address', this.address)
        this.$router.push('/home')
    }
})
```

## 重点内容

- axios 请求返回 Promise，使用 `.then()` 处理成功响应
- POST 请求的第二个参数是请求体数据
- `response.data` 包含服务器返回的数据
- 可以通过 `axios.defaults.baseURL` 设置基础 URL

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
axios.post("http://localhost/user/login", this.user).then(response => {
    if (response.data.resultCode == 200) {
        this.msg = "登录成功"
        this.tip = true
        setTimeout(() => {
            window.location.href = "main.html"
        }, 1000)
        localStorage.setItem('Authorization', response.data.data)
    } else {
        this.msg = "登录失败"
        this.tip = true
        setTimeout(() => { this.tip = false }, 1000)
    }
})
```

示例来源：通用训练工程抽象

```javascript
axios.get("http://localhost/seal/record").then(response => {
    if (response.data.resultCode == 200) {
        this.records = response.data.data
        console.log(this.records)
    }
})
```

示例来源：通用训练工程抽象

```javascript
axios.defaults.baseURL = '/api'
```

## 实际应用场景

- 登录/注册请求
- 获取列表数据
- 提交表单数据
- 文件上传

## 注意事项

- axios 请求是异步的，返回的数据需要在 `.then()` 中处理
- 跨域请求需要后端配置 CORS 或前端配置代理
- 请求失败时需要使用 `.catch()` 处理错误

## 常见误区

- 误区：在 `.then()` 外部访问 axios 返回的数据
- 误区：忘记处理请求失败的情况

## 关联知识点

- [axios 拦截器](/knowledge/axios-interceptors)
- [Token 存储](/knowledge/localstorage-token)
- [Vue 生命周期](/knowledge/vue-lifecycle)
- [Vue CLI 代理](/knowledge/vue-cli-proxy)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [axios 官方文档](https://axios-http.com/)
- 详细介绍 axios 的 API、配置和拦截器功能