<!-- 知识点名称 -->
# Vue 列表渲染

<!-- 知识简介 -->
Vue 通过 `v-for` 指令基于数组渲染列表数据，常用于表格数据展示。

<!-- 核心概念 -->
- `v-for="item in list"` 遍历数组
- `v-for="(item, index) in list"` 获取索引
- `:key` 必须绑定唯一值，用于 Vue 的虚拟 DOM 优化

<!-- 详细讲解 -->
在项目中，`v-for` 主要用于渲染表格数据的每一行。签章记录页面使用 `v-for` 遍历签章记录数组，为每条记录生成一行表格：

```html
<tr v-for="(record,index) of records" :key="index">
    <td>{{record.id}}</td>
    <td>{{record.filename}}</td>
    <td>{{record.type}}</td>
    <td>{{record.code}}</td>
    <td>{{record.datetime}}</td>
    <td><button class="btn btn-primary">查看</button></td>
</tr>
```

数据通过 axios 请求获取后赋值给 `records`：
```javascript
data: { records: [] },
mounted() {
    axios.get("http://localhost/seal/record").then(response => {
        if (response.data.resultCode == 200) {
            this.records = response.data.data
        }
    })
}
```

<!-- 重点内容 -->
- `v-for` 必须绑定 `:key` 属性
- `key` 值应使用每条数据的唯一标识（如 `id`）
- 可以使用 `in` 或 `of` 作为分隔符

<!-- 关键代码示例 -->
示例来源：通用训练工程抽象
```html
<tr v-for="(record,index) of records" :key="index">
    <td>{{record.id}}</td>
    <td>{{record.filename}}</td>
    <td>{{record.type}}</td>
    <td>{{record.code}}</td>
    <td>{{record.datetime}}</td>
    <td>
        <button class="btn btn-primary" data-toggle="modal" 
            :data-target="'#'+record.code">查看</button>
        <div class="modal fade" :id="record.code">
            <div class="modal-dialog">
                <div class="modal-content">
                    <img :src="record.imgBase64" />
                </div>
            </div>
        </div>
    </td>
</tr>
```

<!-- 实际应用场景 -->
- 表格数据展示
- 列表页面渲染
- 导航菜单动态生成

<!-- 注意事项 -->
- 不要使用 `index` 作为 `key`，除非列表不会重新排序
- `v-for` 可以遍历对象、数组、数字
- 在组件中使用 `v-for` 时，`key` 是必须的

<!-- 常见误区 -->
- 误区：使用数组索引作为 `key`
- 误区：在同一元素上同时使用 `v-if` 和 `v-for`

<!-- 关联知识点 -->
- [条件渲染](/knowledge/vue-conditional-rendering)
- [模板语法](/knowledge/vue-template-syntax)
- [axios HTTP 请求](/knowledge/axios-http)

<!-- 资料来源 -->
- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象

<!-- 官方资源扩展 -->
- [Vue 2 官方文档 - 列表渲染](https://v2.vuejs.org/v2/guide/list.html)
- 详细介绍 v-for 用法、key 的重要性和数组更新检测