# axios 拦截器

## 知识简介

axios 拦截器可以在请求发送前或响应返回后对数据进行统一处理，常用于添加认证 token 和统一错误处理。

## 核心概念

- 请求拦截器：`axios.interceptors.request.use()`
- 响应拦截器：`axios.interceptors.response.use()`
- 拦截器可以修改请求配置或响应数据

## 详细讲解

在项目中，几乎所有需要认证的页面都使用了 axios 拦截器。请求拦截器用于在每个请求的 Header 中自动添加 token：

```javascript
axios.interceptors.request.use(request => {
    request.headers.Authorization = localStorage.getItem("Authorization")
    return request
})
```

响应拦截器用于统一处理认证失败的情况。当服务器返回 401 状态码时，自动跳转到登录页面：

```javascript
axios.interceptors.response.use(response => {
    if (response.data.resultCode == 401) {
        window.location.href = "login.html"
    }
    return response
})
```

拦截器通常在 Vue 实例的 `mounted` 生命周期中配置，确保在页面数据请求之前完成设置。

## 重点内容

- 请求拦截器在请求发送前执行
- 响应拦截器在响应到达后、`.then()` 之前执行
- 拦截器必须 `return` 配置或响应，否则请求会中断
- 拦截器可以全局配置，影响所有后续请求

## 关键代码示例

示例来源：通用训练工程抽象

```javascript
mounted() {
    // 请求拦截器(header中添加 token)
    axios.interceptors.request.use(request => {
        request.headers.Authorization = localStorage.getItem("Authorization")
        return request
    })

    // 响应拦截器(认证授权)
    axios.interceptors.response.use(response => {
        if (response.data.resultCode == 401) {
            window.location.href = "login.html"
        }
        return response
    })
    
    axios.get("http://localhost/user/info").then(response => {
        if (response.data.resultCode == 200) {
            this.user = response.data.data
        }
    })
}
```

## 实际应用场景

- 统一添加认证 token
- 统一处理 401 未授权跳转
- 请求参数统一处理
- 响应数据统一格式化
- 全局 loading 状态控制

## 注意事项

- 拦截器中必须 `return` 配置或响应
- 拦截器在 `mounted` 中配置，确保在请求之前完成
- 响应拦截器中 `response.data` 是服务器返回的数据

## 常见误区

- 误区：在拦截器中忘记 `return`，导致请求中断
- 误区：混淆请求拦截器和响应拦截器的参数

## 关联知识点

- [axios HTTP 请求](/knowledge/axios-http)
- [Token 存储](/knowledge/localstorage-token)
- [Vue 生命周期](/knowledge/vue-lifecycle)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [axios 官方文档 - 拦截器](https://axios-http.com/docs/interceptors)
- 详细介绍请求和响应拦截器的配置和使用方法