# Element UI 表格组件

## 知识简介

Element UI 的 `el-table` 组件用于展示结构化数据，支持排序、筛选、分页等操作。通过 `el-table-column` 定义列，使用 `:data` 绑定数据源。

## 核心概念

- `el-table`：表格容器，`:data` 绑定数据数组
- `el-table-column`：列定义，`prop` 指定数据字段，`label` 指定列标题
- `min-width`：列最小宽度，支持百分比
- 数据驱动：数据变化时表格自动更新

## 详细讲解

在供应链金融项目的 Home 页面中，使用 `el-table` 展示票据列表数据：

```html
<el-table :data="receiptList" class="content">
    <el-table-column prop="id" label="票据编号" min-width="10%"></el-table-column>
    <el-table-column prop="senderAddress" label="发送人地址" min-width="30%"></el-table-column>
    <el-table-column prop="accepterAddress" label="接收人地址" min-width="30%"></el-table-column>
    <el-table-column prop="receiptType" label="交易量" min-width="10%"></el-table-column>
    <el-table-column prop="transferType" label="票据类型" min-width="10%"></el-table-column>
    <el-table-column prop="amount" label="交易类型" min-width="10%"></el-table-column>
</el-table>
```

数据通过 axios 请求获取后赋值给 `receiptList`：
```javascript
data() {
    return { receiptList: [] }
},
mounted() {
    this.query()
},
methods: {
    query() {
        let address = this.$cookies.get('address')
        this.axios.get("/finance/query/listAllReceipt?address=" + address)
            .then((response) => {
                if (response.data.code == 200) {
                    this.receiptList = response.data.data
                }
            })
    }
}
```

## 重点内容

- `:data` 绑定数据数组，数组中的每个对象对应一行
- `prop` 指定对象中的字段名，用于显示对应列的数据
- `label` 设置列标题
- `min-width` 设置列最小宽度

## 关键代码示例

来源：`供应链—front/src/views/Home.vue` 第 14-21 行

```html
<el-table :data="receiptList" class="content">
    <el-table-column prop="id" label="票据编号" min-width="10%"></el-table-column>
    <el-table-column prop="senderAddress" label="发送人地址" min-width="30%"></el-table-column>
    <el-table-column prop="accepterAddress" label="接收人地址" min-width="30%"></el-table-column>
    <el-table-column prop="receiptType" label="交易量" min-width="10%"></el-table-column>
    <el-table-column prop="transferType" label="票据类型" min-width="10%"></el-table-column>
    <el-table-column prop="amount" label="交易类型" min-width="10%"></el-table-column>
</el-table>
```

来源：`供应链—front/src/views/Home.vue` 第 47-59 行

```javascript
query: function() {
    let address = this.$cookies.get('address')
    this.axios
        .get("/finance/query/listAllReceipt?address=" + address)
        .then((response) => {
            if (response.data.code == 200) {
                this.receiptList = response.data.data
            }
        })
}
```

## 实际应用场景

- 数据列表展示
- 后台管理系统表格
- 报表展示
- 数据导出页面

## 注意事项

- `prop` 的值必须与数据对象中的字段名完全一致
- 表格数据为空时显示空状态提示
- 可以结合 `el-table-column` 的 `type` 属性实现索引列、选择列等

## 常见误区

- 误区：`prop` 值与数据字段名不一致导致列不显示
- 误区：忘记将 axios 返回的数据赋值给表格数据数组

## 关联知识点

- [Element UI 布局](/knowledge/element-ui-layout)
- [axios HTTP 请求](/knowledge/axios-http)
- [Vue 列表渲染](/knowledge/vue-list-rendering)

## 资料来源

- 来源文件：`供应链—front/src/views/Home.vue`

## 官方资源扩展

- [Element UI 官方文档 - Table 表格](https://element.eleme.cn/#/zh-CN/component/table)
- 详细介绍表格的基础用法、自定义列、排序、筛选等