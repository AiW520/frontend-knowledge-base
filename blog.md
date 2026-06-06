# 从零到一：基于项目实战的前端开发知识体系完全指南

> 本文基于三个真实企业级项目（电子签章系统、供应链金融应用、学籍管理系统）的源码，系统梳理了从 Vue 2 入门到工程化实践的前端开发知识体系。每个知识点均附有最佳官方学习资源。

---

## 目录

- [一、Vue 2 核心](#一vue-2-核心)
- [二、axios HTTP 通信](#二axios-http-通信)
- [三、Element UI 组件库](#三element-ui-组件库)
- [四、Bootstrap 3 框架](#四bootstrap-3-框架)
- [五、CSS 核心布局](#五css-核心布局)
- [六、JavaScript Web API](#六javascript-web-api)
- [七、前端工程化](#七前端工程化)

---

## 一、Vue 2 核心

### 1.1 Vue 实例创建

**是什么**：Vue 实例是 Vue 应用的入口，通过 `new Vue()` 创建。它管理着整个应用的数据、方法和生命周期。

**怎么学**：
1. 理解 `el` 挂载点 —— 它告诉 Vue 管理哪个 DOM 区域
2. 理解 `data` 响应式数据 —— 修改 data 会自动更新视图
3. 理解 `methods` 方法 —— 定义事件处理和业务逻辑

**关键代码**：
```javascript
new Vue({
    el: '#app',
    data: {
        user: { username: "", password: "" },
        tip: false,
        msg: ""
    },
    methods: {
        submit() {
            if (this.user.username == '') {
                this.msg = "用户名不能为空"
                this.tip = true
                setTimeout(() => { this.tip = false }, 1000)
                return
            }
        }
    }
})
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - Vue 实例](https://v2.vuejs.org/v2/guide/instance.html) —— 最权威的实例创建说明
- 📖 [Vue 2 API - 选项/数据](https://v2.vuejs.org/v2/api/#data) —— data 的完整用法

---

### 1.2 模板语法

**是什么**：Vue 的模板语法基于 HTML，通过 `{{ }}` 插值和 `v-` 指令将数据渲染到页面。

**怎么学**：
1. 先掌握 `{{ }}` 插值表达式 —— 在页面上显示数据
2. 再学 `v-model` 双向绑定 —— 表单输入和数据同步
3. 然后学 `v-bind` 属性绑定 —— 动态设置 HTML 属性

**关键代码**：
```html
<div class="alert alert-success" v-show="tip">{{msg}}</div>
<input type="text" v-model="user.username" placeholder="用户名">
<button @click="submit">确定</button>
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 模板语法](https://v2.vuejs.org/v2/guide/syntax.html) —— 插值、指令、缩写
- 📖 [Vue 2 官方指南 - 表单输入绑定](https://v2.vuejs.org/v2/guide/forms.html) —— v-model 详解

---

### 1.3 数据绑定

**是什么**：`v-model` 实现表单元素与数据的双向绑定。用户输入时数据自动更新，数据变化时视图自动更新。

**怎么学**：
1. 在 input 上使用 `v-model="data属性"`
2. 在 methods 中通过 `this.数据属性` 读取表单数据
3. 理解 Vue 响应式原理 —— 数据变化驱动视图更新

**关键代码**：
```html
<input type="text" v-model="user.username">
<input type="password" v-model="user.password">
```
```javascript
// 提交时直接使用 this.user 对象
axios.post("http://localhost/user/login", this.user).then(response => { ... })
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 表单输入绑定](https://v2.vuejs.org/v2/guide/forms.html) —— 所有表单类型的 v-model 用法
- 📖 [MDN - 响应式设计](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Responsive_Design) —— 理解数据驱动视图的理念

---

### 1.4 事件处理

**是什么**：通过 `v-on`（简写 `@`）监听 DOM 事件，在 methods 中定义处理函数。

**怎么学**：
1. 从 `@click` 开始，这是最常用的
2. 在 methods 中定义处理函数，使用 `this` 访问 data
3. 学习事件修饰符 `.stop`、`.prevent`

**关键代码**：
```html
<button @click="upload">上传文档</button>
<button @click="signature">文档签章</button>
<button @click="uploadSeal">签章上链</button>
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 事件处理](https://v2.vuejs.org/v2/guide/events.html) —— 事件监听、方法、修饰符
- 📖 [MDN - 事件介绍](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events) —— 理解浏览器事件机制

---

### 1.5 条件渲染

**是什么**：`v-show` 和 `v-if` 根据条件控制元素的显示与隐藏。`v-show` 用 CSS display 切换，`v-if` 用 DOM 创建/销毁。

**怎么学**：
1. 频繁切换用 `v-show`（性能好）
2. 很少改变用 `v-if`（初始渲染开销小）
3. 理解两者的使用场景差异

**关键代码**：
```html
<div class="alert alert-success" v-show="tip">{{msg}}</div>
<img v-show="demoImg" src="contract.jpg" @click="upload" />
<img v-show="posterImg" :src="contract" />
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 条件渲染](https://v2.vuejs.org/v2/guide/conditional.html) —— v-if、v-else、v-show 完整说明

---

### 1.6 列表渲染

**是什么**：`v-for` 指令基于数组循环渲染列表，常用于表格数据展示。

**怎么学**：
1. 学习 `v-for="item in list"` 基本语法
2. 理解 `:key` 的重要性 —— 帮助 Vue 识别每个节点
3. 在表格中使用 `v-for` 渲染 `<tr>`

**关键代码**：
```html
<tr v-for="(record, index) of records" :key="index">
    <td>{{record.id}}</td>
    <td>{{record.filename}}</td>
    <td>{{record.type}}</td>
    <td>{{record.datetime}}</td>
</tr>
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 列表渲染](https://v2.vuejs.org/v2/guide/list.html) —— v-for 完整用法和 key 的重要性
- 📖 [Vue 2 风格指南 - key 使用](https://v2.vuejs.org/v2/style-guide/#Keyed-v-for-essential) —— 为什么 v-for 必须绑 key

---

### 1.7 生命周期

**是什么**：Vue 实例从创建到销毁经历一系列阶段，每个阶段提供钩子函数。`mounted` 是最常用的 —— 在 DOM 渲染完成后执行。

**怎么学**：
1. 先学 `mounted` —— 页面加载后发请求获取数据
2. 再学 `created` —— 实例创建后、挂载前
3. 后学 `beforeDestroy` —— 清理定时器和事件监听

**关键代码**：
```javascript
mounted() {
    // 配置 axios 拦截器
    axios.interceptors.request.use(request => {
        request.headers.Authorization = localStorage.getItem("Authorization")
        return request
    })
    // 获取用户信息
    axios.get("http://localhost/user/info").then(response => {
        this.user = response.data.data
    })
}
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 生命周期图示](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram) —— 完整生命周期图，必看
- 📖 [Vue 2 API - 生命周期钩子](https://v2.vuejs.org/v2/api/#Options-Lifecycle-Hooks) —— 所有钩子的详细说明

---

### 1.8 组件注册

**是什么**：组件是可复用的 Vue 实例。在父组件中通过 `components` 选项注册，在模板中使用。

**怎么学**：
1. 定义组件（template + script + style）
2. 在父组件中 import 并注册
3. 在模板中使用组件标签

**关键代码**：
```javascript
// 父组件中注册
import Navigator from "@/components/Navigator"
import Header from '@/components/Header'
export default {
    components: { Navigator, Header }
}
```
```html
<el-container>
    <el-header><Header /></el-header>
    <el-aside><navigator></navigator></el-aside>
</el-container>
```

**最佳官方资源**：
- 📖 [Vue 2 官方指南 - 组件基础](https://v2.vuejs.org/v2/guide/components.html) —— 组件注册、props、事件
- 📖 [Vue 2 官方指南 - 组件注册](https://v2.vuejs.org/v2/guide/components-registration.html) —— 全局注册和局部注册

---

### 1.9 Vue Router 路由

**是什么**：Vue Router 是 Vue.js 的官方路由管理器，实现单页应用（SPA）的页面切换，不刷新整个页面。

**怎么学**：
1. 配置路由表（path → component 映射）
2. 创建 Router 实例并挂载到 Vue
3. 使用 `$router.push()` 进行编程式导航

**关键代码**：
```javascript
// 路由配置
export default [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
]
```
```javascript
// 页面跳转
this.$router.push('/home')
this.$router.push('/login')
```

**最佳官方资源**：
- 📖 [Vue Router v3 官方文档](https://v3.router.vuejs.org/zh/) —— 完整路由指南
- 📖 [Vue Router v3 - 导航守卫](https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html) —— 路由守卫详解

---

## 二、axios HTTP 通信

### 2.1 HTTP 请求

**是什么**：axios 是基于 Promise 的 HTTP 客户端，用于浏览器中发送 GET、POST 请求与后端 API 交互。

**怎么学**：
1. 学习 `axios.get(url)` 获取数据
2. 学习 `axios.post(url, data)` 提交数据
3. 理解 Promise 的 `.then()` 处理异步响应

**关键代码**：
```javascript
// GET 请求获取列表
axios.get("http://localhost/seal/record").then(response => {
    if (response.data.resultCode == 200) {
        this.records = response.data.data
    }
})

// POST 请求提交登录
axios.post("http://localhost/user/login", this.user).then(response => {
    if (response.data.resultCode == 200) {
        localStorage.setItem('Authorization', response.data.data)
    }
})
```

**最佳官方资源**：
- 📖 [axios 官方文档](https://axios-http.com/docs/intro) —— 完整的 API 参考
- 📖 [axios GitHub](https://github.com/axios/axios) —— 源码和示例
- 📖 [MDN - Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) —— 理解浏览器 HTTP 请求机制

---

### 2.2 拦截器

**是什么**：axios 拦截器在请求发送前或响应返回后统一处理数据。请求拦截器常用于自动添加 Token，响应拦截器用于统一错误处理。

**怎么学**：
1. 请求拦截器：自动添加 Authorization header
2. 响应拦截器：统一处理 401 未授权跳转
3. 理解拦截器必须 `return` 配置或响应

**关键代码**：
```javascript
// 请求拦截器 - 自动添加 Token
axios.interceptors.request.use(request => {
    request.headers.Authorization = localStorage.getItem("Authorization")
    return request
})

// 响应拦截器 - 统一处理 401
axios.interceptors.response.use(response => {
    if (response.data.resultCode == 401) {
        window.location.href = "login.html"
    }
    return response
})
```

**最佳官方资源**：
- 📖 [axios 官方文档 - 拦截器](https://axios-http.com/docs/interceptors) —— 请求和响应拦截器
- 📖 [axios 官方文档 - 配置默认值](https://axios-http.com/docs/config_defaults) —— 全局配置

---

### 2.3 Token 存储

**是什么**：`localStorage` 是浏览器持久化存储 API，用于存储认证 Token。登录成功后存储，注销时清除，在请求中通过拦截器自动添加。

**怎么学**：
1. 学习 `setItem` / `getItem` / `removeItem` 三个基本操作
2. 理解 Token 的生命周期：登录存入 → 请求携带 → 注销清除
3. 了解 localStorage 与 sessionStorage 的区别

**关键代码**：
```javascript
// 登录成功，存储 Token
localStorage.setItem('Authorization', response.data.data)

// 拦截器中读取 Token
request.headers.Authorization = localStorage.getItem("Authorization")

// 注销时清除 Token
localStorage.removeItem("Authorization")
```

**最佳官方资源**：
- 📖 [MDN - localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) —— 完整的 API 和使用限制
- 📖 [MDN - Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API) —— localStorage 和 sessionStorage 对比

---

## 三、Element UI 组件库

### 3.1 布局系统

**是什么**：Element UI 提供 24 栅格布局和 Container 容器布局，用于构建页面整体结构。

**怎么学**：
1. 使用 `el-container` + `el-header` + `el-aside` + `el-main` 搭建页面结构
2. 使用 `el-row` + `el-col` 实现栅格布局
3. 理解 `:span` 取值 1-24，`:offset` 实现偏移

**关键代码**：
```html
<el-container>
    <el-header><Header /></el-header>
    <el-container>
        <el-aside width="200px"><Navigator /></el-aside>
        <el-main>
            <el-row>
                <el-col :span="23" :offset="1">
                    <el-table :data="list"></el-table>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</el-container>
```

**最佳官方资源**：
- 📖 [Element UI - Layout 布局](https://element.eleme.cn/#/zh-CN/component/layout) —— Container 布局
- 📖 [Element UI - 栅格](https://element.eleme.cn/#/zh-CN/component/layout#shan-ge-lan-ge) —— 24 栅格系统

---

### 3.2 表单组件

**是什么**：`el-form`、`el-input`、`el-radio-group` 等组件构成表单，通过 `v-model` 双向绑定数据。

**怎么学**：
1. 用 `el-form` 包裹所有表单项
2. 使用 `el-form-item` 包裹每个输入控件
3. 通过 `v-model` 绑定数据，`@click` 处理提交

**关键代码**：
```html
<el-form label-width="80px">
    <el-form-item label="用户地址:">
        <el-input v-model="address"></el-input>
    </el-form-item>
    <el-form-item label="组织类型:">
        <el-radio-group v-model="orgType">
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">银行</el-radio>
        </el-radio-group>
    </el-form-item>
</el-form>
<el-button type="primary" @click="login">登录</el-button>
```

**最佳官方资源**：
- 📖 [Element UI - Form 表单](https://element.eleme.cn/#/zh-CN/component/form) —— 表单组件完整文档
- 📖 [Element UI - Input 输入框](https://element.eleme.cn/#/zh-CN/component/input) —— 输入框类型和属性
- 📖 [Element UI - Radio 单选框](https://element.eleme.cn/#/zh-CN/component/radio) —— 单选组用法

---

### 3.3 表格组件

**是什么**：`el-table` 和 `el-table-column` 用于展示结构化数据，通过 `:data` 绑定数组，`prop` 指定字段。

**怎么学**：
1. 使用 `el-table :data="list"` 绑定数据源
2. 使用 `el-table-column prop="字段名" label="标题"` 定义列
3. 从后端获取数据后赋值给数据数组

**关键代码**：
```html
<el-table :data="receiptList">
    <el-table-column prop="id" label="票据编号" min-width="10%"></el-table-column>
    <el-table-column prop="senderAddress" label="发送人地址" min-width="30%"></el-table-column>
    <el-table-column prop="receiptType" label="交易量" min-width="10%"></el-table-column>
</el-table>
```
```javascript
this.axios.get("/finance/query/listAllReceipt").then(response => {
    this.receiptList = response.data.data
})
```

**最佳官方资源**：
- 📖 [Element UI - Table 表格](https://element.eleme.cn/#/zh-CN/component/table) —— 表格组件完整文档
- 📖 [Element UI - Table 自定义列模板](https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban) —— 高级用法

---

## 四、Bootstrap 3 框架

### 4.1 栅格系统

**是什么**：Bootstrap 3 的 12 列栅格系统，通过 `container` + `row` + `col-md-*` 实现响应式布局。

**怎么学**：
1. 理解 `container` 是容器，`row` 是行，`col-md-*` 是列
2. 12 列为一组，列数和超过 12 会换行
3. 响应式断点：`xs`（<768px）、`sm`（≥768px）、`md`（≥992px）、`lg`（≥1200px）

**关键代码**：
```html
<div class="container">
    <div class="row">
        <div class="col-md-4">三列等宽布局</div>
        <div class="col-md-4">三列等宽布局</div>
        <div class="col-md-4">三列等宽布局</div>
    </div>
    <div class="row">
        <div class="col-md-2">侧边栏</div>
        <div class="col-md-10">主内容区</div>
    </div>
</div>
```

**最佳官方资源**：
- 📖 [Bootstrap 3 中文文档 - 栅格系统](https://v3.bootcss.com/css/#grid) —— 12 列栅格和响应式断点
- 📖 [Bootstrap 3 中文文档 - 响应式工具](https://v3.bootcss.com/css/#responsive-utilities) —— 不同屏幕的显示控制

---

### 4.2 导航条

**是什么**：`navbar` 是响应式导航组件，包含品牌标志、导航链接等，自动适配移动端。

**怎么学**：
1. 使用 `navbar navbar-default` 创建导航条
2. 使用 `navbar-header` 放置品牌标志
3. 使用 `nav navbar-nav` 放置导航链接
4. 配合 CSS `position: sticky` 实现固定顶部

**关键代码**：
```html
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">
                <img src="logo.png" style="height: 50px;">
            </a>
        </div>
        <ul class="nav navbar-nav" style="float: right;">
            <li><a href="register.html"><button class="btn btn-success">注册</button></a></li>
            <li><a href="login.html"><button class="btn btn-primary">登录</button></a></li>
        </ul>
    </div>
</nav>
```

**最佳官方资源**：
- 📖 [Bootstrap 3 中文文档 - 导航条](https://v3.bootcss.com/components/#navbar) —— 导航条完整组件说明
- 📖 [Bootstrap 3 中文文档 - 导航](https://v3.bootcss.com/components/#nav) —— 各种导航样式

---

### 4.3 模态框

**是什么**：`modal` 是弹窗对话框组件，用于展示内容、表单或确认操作，支持自定义标题、内容和按钮。

**怎么学**：
1. 使用 `data-toggle="modal"` 和 `data-target="#id"` 触发
2. 使用 `modal-header`、`modal-body`、`modal-footer` 构建内容
3. 使用 `data-dismiss="modal"` 关闭模态框

**关键代码**：
```html
<button class="btn btn-primary" data-toggle="modal" data-target="#myModal">查看</button>

<div class="modal fade" id="myModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">签章文档</h4>
            </div>
            <div class="modal-body">
                <img :src="record.imgBase64" style="width:460px; height:500px;" />
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal">确定</button>
            </div>
        </div>
    </div>
</div>
```

**最佳官方资源**：
- 📖 [Bootstrap 3 中文文档 - 模态框](https://v3.bootcss.com/javascript/#modals) —— 模态框用法、选项和事件
- 📖 [Bootstrap 3 中文文档 - JavaScript 插件](https://v3.bootcss.com/javascript/) —— 所有 JS 插件

---

## 五、CSS 核心布局

### 5.1 Flexbox 布局

**是什么**：CSS3 弹性盒子布局，通过 `display: flex` 在容器中高效排列、对齐和分配空间。

**怎么学**：
1. 设置容器 `display: flex`
2. 学习主轴对齐 `justify-content`（水平）
3. 学习交叉轴对齐 `align-items`（垂直）

**关键代码**：
```css
.cten {
    display: flex;
    justify-content: center;  /* 水平居中 */
    align-items: center;      /* 垂直居中 */
}
```

**最佳官方资源**：
- 📖 [MDN - Flexbox 基本概念](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) —— 核心概念
- 📖 [MDN - Flexbox 完整指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_flexible_box_layout) —— 所有属性
- 📖 [CSS-Tricks - Flexbox 图解](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) —— 最直观的图解指南

---

### 5.2 CSS 定位

**是什么**：`position` 属性控制元素的定位方式。`static`（默认）、`relative`（相对）、`absolute`（绝对）、`fixed`（固定）、`sticky`（粘性）。

**怎么学**：
1. 先理解 `relative` —— 相对于自身正常位置
2. 再理解 `absolute` —— 相对于最近已定位祖先
3. 然后理解 `fixed` —— 相对于浏览器窗口
4. 最后理解 `sticky` —— 滚动到阈值时固定

**关键代码**：
```css
.position {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 3;
}
```

**最佳官方资源**：
- 📖 [MDN - position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) —— 所有定位类型
- 📖 [MDN - z-index](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index) —— 层叠上下文
- 📖 [MDN - position: sticky](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#sticky_positioning) —— 粘性定位详解

---

### 5.3 CSS 盒模型

**是什么**：每个 HTML 元素都是一个矩形盒子，由 content、padding、border、margin 四部分组成。

**怎么学**：
1. 理解 content → padding → border → margin 的层次
2. 理解 `box-sizing: border-box` 让 width 包含 padding 和 border
3. 了解 margin 合并（垂直方向取最大值）

**关键代码**：
```css
.upload input {
    width: 300px;
    height: 34px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
}
```

**最佳官方资源**：
- 📖 [MDN - CSS 盒模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model) —— 标准盒模型和替代盒模型
- 📖 [MDN - box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing) —— border-box 详解
- 📖 [MDN - margin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin) —— 外边距和合并规则

---

## 六、JavaScript Web API

### 6.1 FileReader 文件读取

**是什么**：FileReader 是 HTML5 提供的 API，在浏览器中异步读取用户选择的文件，支持读取为 Base64、文本、ArrayBuffer 等格式。

**怎么学**：
1. 创建 `new FileReader()` 实例
2. 调用 `readAsDataURL(file)` 读取文件
3. 在 `onload` 回调中获取 `reader.result`

**关键代码**：
```javascript
var reader = new FileReader()
var file = document.getElementById("file")
reader.readAsDataURL(file.files[0])
reader.onload = function () {
    var base64 = this.result  // Base64 格式的文件内容
}
```

**最佳官方资源**：
- 📖 [MDN - FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader) —— 所有读取方法和事件
- 📖 [MDN - File API](https://developer.mozilla.org/zh-CN/docs/Web/API/File) —— 文件对象
- 📖 [MDN - Data URLs](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) —— Base64 数据格式

---

### 6.2 Canvas 图片处理

**是什么**：Canvas 是 HTML5 绘图 API，通过 JavaScript 在画布上绘制图形、文字和图片。常用于图片合成、图表绘制。

**怎么学**：
1. 创建 Canvas 元素并获取 2D 上下文
2. 使用 `drawImage()` 绘制图片
3. 使用 `toDataURL()` 导出为 Base64
4. 必须等图片 `onload` 后再绘制

**关键代码**：
```javascript
var canvas = document.createElement("canvas")
var context = canvas.getContext("2d")

var img = new Image()
img.src = "image.png"
img.onload = function () {
    context.drawImage(img, 0, 0, img.width, img.height)
    var base64 = canvas.toDataURL("image/png")
}
```

**最佳官方资源**：
- 📖 [MDN - Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) —— 完整 Canvas 教程
- 📖 [MDN - Canvas 2D 上下文](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) —— 所有绘图方法
- 📖 [MDN - drawImage()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) —— 图片绘制详解

---

### 6.3 DOM 操作

**是什么**：DOM（文档对象模型）操作是通过 JavaScript 读取和修改 HTML 页面结构。Vue 中推荐使用 `$refs` 而非直接操作 DOM。

**怎么学**：
1. 使用 `$refs` 获取 Vue 组件中的 DOM 元素
2. 使用 `document.getElementById()` 获取原生 DOM
3. 理解 `window.location.href` 和 `$router.push()` 的区别

**关键代码**：
```javascript
// Vue 推荐方式
this.$refs.file.click()

// 原生方式
var file = document.getElementById("file")

// 页面跳转（CDN 模式）
window.location.href = "main.html"

// 页面跳转（Vue Router 模式）
this.$router.push('/home')
```

**最佳官方资源**：
- 📖 [MDN - DOM 介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction) —— 理解 DOM 模型
- 📖 [MDN - Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) —— 文档对象 API
- 📖 [Vue 2 - ref](https://v2.vuejs.org/v2/api/#ref) —— Vue 的 $refs 用法

---

### 6.4 前端表单验证

**是什么**：在用户提交数据前，对输入内容进行完整性和格式检查。Vue 中通常在 methods 中编写验证逻辑。

**怎么学**：
1. 检查必填字段是否为空
2. 验证失败时显示提示消息
3. 使用 `return` 阻止后续提交
4. 使用 `setTimeout` 控制提示显示时间

**关键代码**：
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

**最佳官方资源**：
- 📖 [MDN - 表单验证](https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Form_validation) —— HTML5 验证和 JavaScript 自定义验证
- 📖 [MDN - 约束验证 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Constraint_validation) —— 浏览器内置验证 API
- 📖 [Element UI - Form 验证](https://element.eleme.cn/#/zh-CN/component/form#biao-dan-yan-zheng) —— 组件库级别的表单验证方案

---

## 七、前端工程化

### 7.1 Vue CLI 开发代理

**是什么**：Vue CLI 开发服务器提供代理功能，将前端请求转发到后端 API，解决开发环境的跨域问题。

**怎么学**：
1. 在 `vue.config.js` 中配置 `devServer.proxy`
2. 理解 `target`（目标地址）和 `pathRewrite`（路径重写）
3. 设置 `axios.defaults.baseURL` 使用代理前缀

**关键代码**：
```javascript
// vue.config.js
const vueConfig = {
    devServer: {
        port: 8020,
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                pathRewrite: { '^/api': '/' }
            }
        }
    }
}
```
```javascript
// main.js
axios.defaults.baseURL = '/api'
```

**最佳官方资源**：
- 📖 [Vue CLI - devServer.proxy](https://cli.vuejs.org/zh/config/#devserver-proxy) —— 代理配置官方文档
- 📖 [webpack-dev-server - proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) —— 底层代理配置
- 📖 [MDN - 跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) —— 理解跨域问题根源

---

## 学习路线建议

### 第一周：Vue 基础
1. Vue 实例创建 → 模板语法 → 数据绑定
2. 事件处理 → 条件渲染 → 列表渲染
3. 生命周期 → 组件注册

### 第二周：网络通信与 UI
4. axios HTTP 请求 → 拦截器 → Token 存储
5. Element UI 布局 → 表单 → 表格
6. Bootstrap 栅格 → 导航条 → 模态框

### 第三周：CSS 与 JavaScript
7. CSS Flexbox → 定位 → 盒模型
8. FileReader → Canvas → DOM 操作
9. 表单验证 → Vue CLI 代理

### 第四周：综合实战
10. 完整项目搭建（Vue 2 + Element UI + axios + Vue Router）
11. 登录注册功能实现
12. 数据列表展示和交互

---

## 关键学习原则

1. **先理解再记忆**：不要死记 API，理解每个概念解决什么问题
2. **动手写代码**：每个知识点都要亲自写一遍代码
3. **看官方文档**：本文每个知识点都附带了最佳官方资源，优先阅读
4. **从项目学**：在真实项目中理解知识点的应用场景
5. **循序渐进**：按推荐顺序学习，不要跳跃

---

> 本文所有知识内容均来源于三个企业级项目源码，每个知识点均附有官方文档链接作为延伸学习。持续更新中。