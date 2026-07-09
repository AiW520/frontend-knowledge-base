# Element UI 表单组件

## 知识简介

Element UI 提供丰富的表单组件，包括 `el-form`、`el-form-item`、`el-input`、`el-radio-group`、`el-button` 等，用于构建数据录入界面。

## 核心概念

- `el-form`：表单容器，管理表单数据
- `el-form-item`：表单项，包裹每个输入控件
- `el-input`：输入框，通过 `v-model` 双向绑定
- `el-radio-group`：单选组，通过 `v-model` 绑定选中值
- `el-button`：按钮组件

## 详细讲解

在Vue2 业务演示项目的登录页面中，使用 Element UI 表单组件构建登录表单：

```html
<el-form label-width="80px">
    <h1>Vue2 业务演示项目</h1>
    <h3>登录页面</h3>
    <el-form-item label="用户地址:">
        <el-input type="primary" v-model="address"></el-input>
    </el-form-item>
    <el-form-item label="组织类型:">
        <el-radio-group v-model="orgType">
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">银行</el-radio>
        </el-radio-group>
    </el-form-item>
</el-form>
```

`el-form` 通过 `label-width` 属性设置标签宽度。`el-form-item` 的 `label` 属性设置标签文本。`el-input` 通过 `v-model` 实现数据双向绑定。

`el-radio-group` 配合 `el-radio` 实现单选功能，`:label` 属性的值即为选中时 `v-model` 绑定的值。

## 重点内容

- `el-form` 的 `label-width` 控制标签宽度
- `el-input` 通过 `v-model` 双向绑定数据
- `el-radio-group` 的 `v-model` 绑定选中值
- `el-radio` 的 `:label` 指定选项值

## 关键代码示例

示例来源：通用训练工程抽象

```html
<el-form label-width="80px">
    <h1>Vue2 业务演示项目</h1>
    <h3>登录页面</h3>
    <el-form-item label="用户地址:">
        <el-input type="primary" v-model="address"></el-input>
    </el-form-item>
    <el-form-item label="组织类型:">
        <el-radio-group v-model="orgType">
            <el-radio :label="1">公司</el-radio>
            <el-radio :label="2">银行</el-radio>
        </el-radio-group>
    </el-form-item>
</el-form>
```

示例来源：通用训练工程抽象

```javascript
data() {
    return {
        orgType: 1,
        address: ""
    }
}
```

示例来源：通用训练工程抽象

```html
<el-button type="primary" @click="login">登录</el-button>
<el-button type="primary" @click="register">注册</el-button>
```

## 实际应用场景

- 登录/注册表单
- 数据录入页面
- 搜索筛选表单
- 设置页面

## 注意事项

- `el-radio` 的 `:label` 需要绑定动态值时使用 `:` 前缀
- `el-input` 的 `type` 属性支持 `text`、`textarea`、`password` 等
- `el-button` 的 `type` 控制按钮样式：`primary`、`success`、`warning`、`danger`、`info`

## 常见误区

- 误区：`el-radio` 的 `label` 不加 `:` 前缀导致传入字符串而非数字
- 误区：忘记在 `el-form` 中设置 `label-width`

## 关联知识点

- [Element UI 布局](/knowledge/element-ui-layout)
- [Vue 数据绑定](/knowledge/vue-data-binding)
- [Vue 事件处理](/knowledge/vue-event-handling)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [Element UI 官方文档 - Form 表单](https://element.eleme.cn/#/zh-CN/component/form)
- 详细介绍表单验证、对齐方式、尺寸等