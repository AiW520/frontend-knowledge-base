# Bootstrap 模态框

## 知识简介

Bootstrap 3 的模态框（Modal）是弹窗对话框组件，用于展示内容、表单或确认操作，支持自定义标题、内容和按钮。

## 核心概念

- `modal`：模态框基础类
- `modal-dialog`：对话框容器
- `modal-content`：内容容器
- `modal-header`、`modal-body`、`modal-footer`：三部分结构
- `data-toggle="modal"`：触发模态框
- `data-target="#id"`：指定目标模态框
- `data-dismiss="modal"`：关闭模态框

## 详细讲解

在Vue2 业务演示项目中，模态框用于展示签章文档的详情。签章记录页面中，每条记录都有一个"查看"按钮，点击后弹出模态框显示签章文档图片：

```html
<button class="btn btn-primary" data-toggle="modal" 
    :data-target="'#'+record.code">查看</button>

<div class="modal fade" :id="record.code" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
                <h4 class="modal-title">签章文档</h4>
            </div>
            <div class="modal-body">
                <img :src="record.imgBase64" style="width:460px; height:500px;" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">确定</button>
            </div>
        </div>
    </div>
</div>
```

登录页面使用模态框作为登录表单的容器：

```html
<div id="app" class="modal-dialog" style="margin-top: 10%;">
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title text-center">登录</h4>
        </div>
        <div class="modal-body">
            <input type="text" v-model="user.username">
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="submit">确定</button>
        </div>
    </div>
</div>
```

## 重点内容

- 模态框使用 `data-toggle="modal"` 和 `data-target` 触发
- 使用 `data-dismiss="modal"` 关闭模态框
- `modal` 类定义模态框，`modal-dialog` 定义对话框，`modal-content` 定义内容
- `.fade` 类添加淡入淡出动画效果

## 关键代码示例

示例来源：通用训练工程抽象

```html
<button class="btn btn-primary" data-toggle="modal" 
    :data-target="'#'+record.code">查看</button>

<div class="modal fade" :id="record.code" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">签章文档</h4>
            </div>
            <div class="modal-body">
                <img :src="record.imgBase64" style="width:460px; height:500px;" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">确定</button>
            </div>
        </div>
    </div>
</div>
```

示例来源：通用训练工程抽象

```html
<div id="app" class="modal-dialog" style="margin-top: 10%;">
    <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title text-center">登录</h4>
        </div>
        <div class="modal-body">
            <input type="text" class="form-control" placeholder="用户名" v-model="user.username">
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary form-control" @click="submit">确定</button>
        </div>
    </div>
</div>
```

## 实际应用场景

- 登录/注册弹窗
- 详情查看弹窗
- 确认操作对话框
- 图片预览

## 注意事项

- 模态框的 HTML 代码放在页面任意位置，通常放在 `body` 最后
- 结合 Vue 的 `v-for` 时，`:id` 需要动态绑定唯一值
- Bootstrap 的模态框依赖 jQuery

## 常见误区

- 误区：同时打开多个模态框导致页面滚动问题
- 误区：`:data-target` 的值不加 `#` 前缀

## 关联知识点

- [Bootstrap 栅格系统](/knowledge/bootstrap-grid)
- [Vue 列表渲染](/knowledge/vue-list-rendering)
- [Vue 数据绑定](/knowledge/vue-data-binding)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

## 官方资源扩展

- [Bootstrap 3 官方文档 - 模态框](https://v3.bootcss.com/javascript/#modals)
- 详细介绍模态框的用法、选项和事件