# 前端表单验证

## 知识简介

前端表单验证是在用户提交数据之前，对输入内容进行格式和完整性检查的过程。在 Vue 项目中，通常在 `methods` 中编写验证逻辑。

## 核心概念

- 必填验证：检查输入是否为空
- 格式验证：检查邮箱、手机号等格式
- 实时反馈：通过提示消息告知用户验证结果
- 状态管理：使用 `tip` 和 `msg` 控制提示的显示

## 详细讲解

在项目中，表单验证采用手动编写验证逻辑的方式。登录页面的验证逻辑：

```javascript
submit() {
    if (this.user.username == '') {
        this.msg = "用户名不能为空"
        this.tip = true
        setTimeout(() => { this.tip = false }, 1000)
        return
    }
    if (this.user.password == '') {
        this.msg = "密码不能为空"
        this.tip = true
        setTimeout(() => { this.tip = false }, 1000)
        return
    }
    // 通过验证后发送请求
    axios.post("http://localhost/user/login", this.user).then(response => { ... })
}
```

注册页面使用 `alert()` 进行简单的验证提示：

```javascript
if (this.user.username == '') {
    alert("用户名不能为空")
    return
}
```

验证提示通过 `v-show` 控制显示，1 秒后自动隐藏：
```html
<div class="alert alert-success" v-show="tip" role="alert">{{msg}}</div>
```

## 重点内容

- 验证不通过时使用 `return` 阻止后续代码执行
- 使用 `setTimeout` 控制提示消息的显示时间
- `v-show` 配合 `tip` 布尔值控制提示的显示和隐藏
- 验证顺序：先验证必填，再验证格式

## 关键代码示例

来源：`frontend/html/login.html` 第 60-95 行

```javascript
submit() {
    if (this.user.username == '') {
        this.msg = "用户名不能为空"
        this.tip = true
        setTimeout(() => { this.tip = false }, 1000)
        return
    }
    if (this.user.password == '') {
        this.msg = "密码不能为空"
        this.tip = true
        setTimeout(() => { this.tip = false }, 1000)
        return
    }
    axios.post("http://localhost/user/login", this.user).then(response => {
        if (response.data.resultCode == 200) {
            this.msg = "登录成功"
            this.tip = true
            setTimeout(() => { window.location.href = "main.html" }, 1000)
            localStorage.setItem('Authorization', response.data.data)
        }
    })
}
```

来源：`frontend/html/register.html` 第 93-116 行

```javascript
if (this.user.username == '') { alert("用户名不能为空"); return }
if (this.user.password == '') { alert("密码不能为空"); return }
if (this.user.chainAccount == '') { alert("区块链账户地址不能为空"); return }
if (this.user.name == '') { alert("姓名不能为空"); return }
if (this.user.cardId == '') { alert("身份证号码不能为空"); return }
if (this.user.phone == '') { alert("电话号码不能为空"); return }
```

## 实际应用场景

- 登录表单验证
- 注册表单验证
- 搜索表单验证
- 数据提交前的完整性检查

## 注意事项

- 前端验证不能替代后端验证（安全性）
- 验证失败后使用 `return` 阻止继续执行
- 可以使用 Element UI 的 `el-form` 自带的验证功能替代手动验证

## 常见误区

- 误区：只做前端验证不做后端验证
- 误区：验证失败后忘记 `return`，导致继续执行后续代码

## 关联知识点

- [Vue 数据绑定](/knowledge/vue-data-binding)
- [Vue 事件处理](/knowledge/vue-event-handling)
- [Vue 条件渲染](/knowledge/vue-conditional-rendering)
- [Element UI 表单](/knowledge/element-ui-form)

## 资料来源

- 来源文件：`frontend/html/login.html` 第 60-95 行
- 来源文件：`frontend/html/register.html` 第 93-116 行
- 来源文件：`frontend/html/signature.html` 第 126-133 行
- 来源文件：`学籍管理-frontend/html/login.html` 第 64-106 行

## 官方资源扩展

- [MDN - 表单验证](https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Form_validation)
- 详细介绍 HTML5 表单验证和 JavaScript 自定义验证