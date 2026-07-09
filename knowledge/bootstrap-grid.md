# Bootstrap 栅格系统

## 知识简介

Bootstrap 3 提供基于 12 列的响应式栅格系统，通过 `container`、`row`、`col-*-*` 类实现多设备适配的页面布局。

## 核心概念

- `container`：固定宽度容器，居中显示
- `container-fluid`：100% 宽度容器
- `row`：行，包含一组列
- `col-md-*`：列，`md` 表示中等屏幕，`*` 表示占据的列数（1-12）
- 12 列栅格系统

## 详细讲解

在Vue2 业务演示项目中，栅格系统广泛应用于页面布局。案例展示区使用 `col-md-4` 实现三列等宽布局：

```html
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <img src="images/case_1.png">
            <h2>政务应用案例</h2>
        </div>
        <div class="col-md-4">
            <img src="images/case_2.png">
            <h2>企业应用案例</h2>
        </div>
        <div class="col-md-4">
            <img src="images/case_3.png">
            <h2>个人应用案例</h2>
        </div>
    </div>
</div>
```

产品介绍区使用 `col-md-5` + `col-md-7` 实现 5:7 的非对称布局：

```html
<div class="row item">
    <div class="col-md-5">
        <img src="images/custom_1.jpg">
    </div>
    <div class="col-md-7">
        <h2>传统Vue2 业务演示项目的弊端</h2>
        <p>...</p>
    </div>
</div>
```

后台管理页面使用 `col-md-2` + `col-md-10` 实现侧边栏 + 主内容区的布局：

```html
<div class="row">
    <div class="col-md-2">
        <!-- 左侧导航栏 -->
    </div>
    <div class="col-md-10">
        <!-- 主内容区域 -->
    </div>
</div>
```

## 重点内容

- 栅格系统共 12 列，列数总和超过 12 会换行
- `col-md-*` 在屏幕宽度 ≥ 992px 时生效
- 响应式断点：`xs`(<768px)、`sm`(≥768px)、`md`(≥992px)、`lg`(≥1200px)
- `row` 必须放在 `container` 或 `container-fluid` 中

## 关键代码示例

示例来源：通用训练工程抽象

```html
<div class="case container">
    <div class="row">
        <div class="col-md-4">
            <img src="images/case_1.png">
            <h2>政务应用案例</h2>
        </div>
        <div class="col-md-4">
            <img src="images/case_2.png">
            <h2>企业应用案例</h2>
        </div>
        <div class="col-md-4">
            <img src="images/case_3.png">
            <h2>个人应用案例</h2>
        </div>
    </div>
</div>
```

示例来源：通用训练工程抽象

```html
<div class="row">
    <div class="col-md-2">
        <!-- 左侧导航栏 -->
    </div>
    <div class="col-md-10">
        <img src="../images/pic_3.jpg" style="width: 1275px; height: 600px;">
    </div>
</div>
```

## 实际应用场景

- 页面多列布局
- 侧边栏 + 主内容区布局
- 响应式布局适配不同屏幕
- 产品展示页面

## 注意事项

- 列之间默认有 15px 的左右内边距（gutter）
- `row` 使用负边距抵消 `container` 的内边距
- 列可以嵌套，嵌套的列也基于 12 列

## 常见误区

- 误区：忘记将 `row` 放在 `container` 中
- 误区：列数总和超过 12 导致布局异常

## 关联知识点

- [Bootstrap 导航条](/knowledge/bootstrap-navbar)
- [Bootstrap 模态框](/knowledge/bootstrap-modal)
- [CSS 盒模型](/knowledge/css-box-model)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [Bootstrap 3 官方文档 - 栅格系统](https://v3.bootcss.com/css/#grid)
- 详细介绍栅格系统的参数、嵌套和响应式工具