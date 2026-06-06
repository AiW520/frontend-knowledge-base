# Element UI 布局系统

## 知识简介

Element UI 提供基于 24 栅格的布局系统，通过 `el-row` 和 `el-col` 组件实现页面布局，同时提供 `el-container` 系列容器组件用于页面整体结构搭建。

## 核心概念

- `el-row`：行容器，使用 flex 布局
- `el-col`：列容器，通过 `:span` 属性指定占据的列数（共 24 列）
- `el-container`：外层容器
- `el-header`、`el-aside`、`el-main`：页面结构区域

## 详细讲解

在供应链金融项目中，Element UI 的布局系统用于搭建整个应用的结构。典型的页面布局使用 `el-container` 配合 `el-header`、`el-aside`、`el-main` 实现上-左-右三段式布局。

引入 Element UI 的方式：
```javascript
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

Home 页面的布局结构：
```html
<el-container>
    <el-header class="header">
        <Header />
    </el-header>
    <el-container>
        <el-aside width="200px">
            <navigator></navigator>
        </el-aside>
        <el-main>
            <!-- 主要内容区域 -->
        </el-main>
    </el-container>
</el-container>
```

栅格布局使用 `el-row` 和 `el-col`：
```html
<el-row>
    <el-col :span="8" :offset="8">
        <!-- 居中显示的内容 -->
    </el-col>
</el-row>
```

`:span` 指定列宽，`:offset` 指定偏移量，基于 24 栅格系统。

## 重点内容

- 24 栅格系统，`:span` 值范围 1-24
- `:offset` 用于列偏移，实现居中效果
- `el-container` 支持嵌套，实现复杂布局
- `el-header` 默认高度 60px，`el-aside` 默认宽度 300px

## 关键代码示例

来源：`供应链—front/src/views/Home.vue` 第 2-27 行

```html
<el-container>
    <el-header class="header">
        <Header />
    </el-header>
    <el-container>
        <el-aside width="200px">
            <navigator></navigator>
        </el-aside>
        <el-main style="padding-top:10px">
            <el-row>
                <el-col :span="23" :offset="1">
                    <el-table :data="receiptList" class="content">
                        <el-table-column prop="id" label="票据编号"></el-table-column>
                        <el-table-column prop="senderAddress" label="发送人地址"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</el-container>
```

来源：`供应链—front/src/views/Login.vue` 第 2-6 行

```html
<el-row style="height: 100%">
    <el-col :span="8" :offset="8">
        <!-- 登录表单 -->
    </el-col>
</el-row>
```

## 实际应用场景

- 后台管理系统的整体布局
- 登录页面的居中布局
- 表单页面的栅格布局

## 注意事项

- `el-row` 使用 flex 布局，注意浏览器兼容性
- `el-col` 的 `:span` 值总和超过 24 时会换行
- `el-container` 的子元素只能是 `el-header`、`el-aside`、`el-main`、`el-footer`

## 常见误区

- 误区：忘记设置 `el-aside` 的 `width` 属性
- 误区：栅格列总和超过 24 导致布局混乱

## 关联知识点

- [Element UI 表单](/knowledge/element-ui-form)
- [Element UI 表格](/knowledge/element-ui-table)
- [Vue 组件注册](/knowledge/vue-component)

## 资料来源

- 来源文件：`供应链—front/src/views/Home.vue`
- 来源文件：`供应链—front/src/views/Login.vue`
- 来源文件：`供应链—front/src/main.js` 第 2-3 行

## 官方资源扩展

- [Element UI 官方文档 - Layout 布局](https://element.eleme.cn/#/zh-CN/component/layout)
- 详细介绍 Container 布局和 24 栅格系统