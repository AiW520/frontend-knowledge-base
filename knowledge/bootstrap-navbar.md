# Bootstrap 导航条

## 知识简介

Bootstrap 3 的导航条（navbar）是响应式导航组件，包含品牌标志、导航链接、表单等元素，自动适配移动端和桌面端。

## 核心概念

- `navbar`：导航条基础类
- `navbar-default`：默认样式（浅色背景）
- `navbar-header`：品牌标志区域
- `navbar-brand`：品牌链接
- `nav navbar-nav`：导航链接列表
- `container-fluid`：全宽容器

## 详细讲解

在电子签章系统中，几乎所有页面都使用了 Bootstrap 导航条。导航条的结构包括品牌标志、标题和导航链接：

```html
<nav class="navbar navbar-default position">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">
                <img alt="Brand" src="../images/logo.png" style="height: 50px;">
            </a>
        </div>
        <img alt="Brand" src="../images/main.png" style="height: 40px; margin-top: 20px;">
        <ul class="nav navbar-nav" style="float: right;">
            <li><a href="register.html"><button class="btn btn-success">注册</button></a></li>
            <li><a href="login.html"><button class="btn btn-primary">登录</button></a></li>
        </ul>
    </div>
</nav>
```

通过 CSS 的 `position: sticky` 实现导航条固定在页面顶部：

```css
.position {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 3;
}
```

## 重点内容

- `navbar-default` 提供浅色背景样式，`navbar-inverse` 提供深色背景
- `navbar-header` 包含品牌标志和折叠按钮
- 导航链接使用 `ul.nav.navbar-nav` 列表格式
- 可以使用 `float: right` 将导航链接右对齐

## 关键代码示例

来源：`frontend/index.html` 第 18-29 行

```html
<nav class="navbar navbar-default position">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">
                <img alt="Brand" src="../images/logo.png" style="height: 50px;">
            </a>
        </div>
        <img alt="Brand" src="../images/main.png" style="height: 40px; margin-top: 20px;">
        <ul class="nav navbar-nav" style="float: right;">
            <li><a href="html/register.html"><button class="btn btn-success">注册</button></a></li>
            <li><a href="html/login.html"><button class="btn btn-primary">登录</button></a></li>
        </ul>
    </div>
</nav>
```

来源：`frontend/css/style.css` 第 2-7 行

```css
.position {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 3;
}
```

## 实际应用场景

- 网站顶部导航
- 后台管理页面导航
- 响应式菜单

## 注意事项

- 导航条默认不是固定的，需要通过 CSS 实现固定效果
- 移动端导航条会自动折叠，需要添加折叠按钮和 JavaScript
- Bootstrap 3 的导航条依赖于 jQuery

## 常见误区

- 误区：混淆 `navbar-brand` 和普通的品牌链接
- 误区：忘记引入 Bootstrap 的 JavaScript 文件导致移动端折叠菜单失效

## 关联知识点

- [Bootstrap 栅格系统](/knowledge/bootstrap-grid)
- [CSS 定位](/knowledge/css-position)
- [Bootstrap 模态框](/knowledge/bootstrap-modal)

## 资料来源

- 来源文件：`frontend/index.html` 第 18-29 行
- 来源文件：`frontend/css/style.css` 第 2-7 行
- 来源文件：`frontend/html/main.html` 第 17-27 行

## 官方资源扩展

- [Bootstrap 3 官方文档 - 导航条](https://v3.bootcss.com/components/#navbar)
- 详细介绍导航条的各种配置和响应式行为