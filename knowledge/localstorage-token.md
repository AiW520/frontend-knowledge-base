# localStorage 与 Token 存储

## 知识简介

localStorage 是浏览器提供的本地存储 API，用于在客户端持久化存储数据。在前端项目中，常用于存储认证 token。

## 核心概念

- `localStorage.setItem(key, value)`：存储数据
- `localStorage.getItem(key)`：读取数据
- `localStorage.removeItem(key)`：删除数据
- 数据持久化存储，关闭浏览器后不会丢失

## 详细讲解

在项目中，localStorage 主要用于存储用户的认证 token。登录成功后，将服务器返回的 token 保存到 localStorage：

```javascript
axios.post("http://localhost/user/login", this.user).then(response => {
    if (response.data.resultCode == 200) {
        localStorage.setItem('Authorization', response.data.data)
        window.location.href = "main.html"
    }
})
```

在后续请求中，通过 axios 拦截器从 localStorage 读取 token 并添加到请求头：

```javascript
axios.interceptors.request.use(request => {
    request.headers.Authorization = localStorage.getItem("Authorization")
    return request
})
```

用户注销时，清除 localStorage 中存储的 token：

```javascript
logout() {
    localStorage.removeItem("Authorization")
}
```

## 重点内容

- localStorage 存储的数据没有过期时间，需要手动清除
- 只能存储字符串，复杂数据需要使用 `JSON.stringify()` 转换
- 存储容量通常为 5MB
- 同源策略限制，不同域名/端口的数据隔离

## 关键代码示例

来源：`frontend/html/login.html` 第 87 行

```javascript
localStorage.setItem('Authorization', response.data.data)
```

来源：`frontend/html/account.html` 第 109-110 行

```javascript
axios.interceptors.request.use(request => {
    request.headers.Authorization = localStorage.getItem("Authorization")
    return request
})
```

来源：`frontend/html/account.html` 第 103 行

```javascript
localStorage.removeItem("Authorization")
```

## 实际应用场景

- 存储登录 token
- 存储用户偏好设置
- 缓存不常变化的数据
- 记住登录状态

## 注意事项

- localStorage 是同步 API，不适合存储大量数据
- 敏感数据不应存储在 localStorage 中（XSS 攻击可窃取）
- 与 sessionStorage 的区别：sessionStorage 关闭标签页后清除

## 常见误区

- 误区：认为 localStorage 可以存储对象（需要先 JSON.stringify）
- 误区：混淆 localStorage 和 sessionStorage 的生命周期

## 关联知识点

- [axios 拦截器](/knowledge/axios-interceptors)
- [axios HTTP 请求](/knowledge/axios-http)
- [Vue 事件处理](/knowledge/vue-event-handling)

## 资料来源

- 来源文件：`frontend/html/login.html` 第 87 行
- 来源文件：`frontend/html/account.html` 第 103、109-110 行
- 来源文件：`frontend/html/myseal.html` 第 69、75 行
- 来源文件：`供应链—front/src/components/Header.vue`

## 官方资源扩展

- [MDN - localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)
- 详细介绍 localStorage 的 API 和使用限制