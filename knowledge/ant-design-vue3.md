# Ant Design Vue 3

## 知识简介

Ant Design Vue 是 Ant Design 的 Vue 3 实现，提供一套高质量的企业级 UI 组件。Vue3 项目级训练工程使用 Ant Design Vue 3 构建整个管理后台界面。

## 核心概念

- **a-config-provider**：全局配置（国际化、主题）
- **a-table**：数据表格组件
- **a-form / a-form-item**：表单组件
- **a-modal**：弹窗组件
- **a-menu**：导航菜单
- **message**：全局消息提示
- **a-input、a-select、a-button** 等基础组件

## 详细讲解

在 Vue3 项目级训练工程中，Ant Design Vue 3 用于构建后台管理界面：

**1. 全局配置**：在布局组件中使用 `a-config-provider` 设置国际化：
```html
<a-config-provider :locale="zh_CN">
```

**2. 消息提示**：在 main.ts 中配置 message 的全局行为：
```typescript
message.config({
  top: '24px',
  duration: 3,
  maxCount: 3,
  getContainer: () => document.body
})
```

**3. 图标使用**：使用 @ant-design/icons-vue 中的图标：
```typescript
import { HomeOutlined, LinkOutlined, TeamOutlined } from '@ant-design/icons-vue'
```

**4. 确认弹窗**：在 hooks/useForm.ts 中使用 Modal.confirm 实现删除确认

**5. 自动导入**：通过 unplugin-vue-components 实现组件按需自动导入，无需手动注册。项目配置了 `AntDesignVueResolver` 解析器，在 `vite.config.ts` 中配置。

## 重点内容

- Ant Design Vue 组件的命名规则：`a-` 前缀（如 `a-button`、`a-table`）
- `ConfigProvider` 用于全局国际化配置
- message / notification / Modal 是挂载在 Vue 实例上的全局方法
- 表格组件支持分页、排序、筛选、行选择等功能
- 表单组件内置验证功能

## 关键代码示例

示例来源：通用训练工程抽象

```typescript
import 'ant-design-vue/dist/antd.less'
import 'ant-design-vue/es/message/style/css'
import { message } from 'ant-design-vue'

message.config({
  top: '24px',
  duration: 3,
  maxCount: 3,
  getContainer: () => document.body
})
```

示例来源：通用训练工程抽象

```typescript
const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
```

## 实际应用场景

- 企业级后台管理系统
- 数据表格和搜索表单
- 弹窗表单（新增/编辑）
- 分步表单
- 文件上传

## 注意事项

- Ant Design Vue 3 版本对应 Vue 3，Ant Design Vue 1.x 对应 Vue 2
- 组件样式需要单独导入（如果使用按需导入）
- `message.config()` 需要在 `app.mount()` 之前调用
- 使用 `unplugin-vue-components` 自动导入时，可省略手动 import 语句

## 常见误区

- 误区：混淆 Ant Design Vue 1.x（Vue 2）和 3.x（Vue 3）的 API
- 误区：忘记导入组件的样式文件
- 误区：在 `<script setup>` 中手动注册已通过 auto-import 导入的组件

## 关联知识点

- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [Vue 3 &lt;script setup&gt;](/knowledge/vue3-script-setup)
- [Tailwind CSS](/knowledge/tailwind-css)
- [Sass/SCSS](/knowledge/sass-scss)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（Ant Design Vue 全局配置）
- 示例来源：通用训练工程抽象（a-config-provider 使用）
- 示例来源：通用训练工程抽象（Modal.confirm 使用）
- 示例来源：通用训练工程抽象（message 使用）
- 示例来源：通用训练工程抽象（shadcn-vue 配置）
- 示例来源：通用训练工程抽象（组件自动导入配置）

## 官方资源扩展

- [Ant Design Vue 官方文档](https://antdv.com/docs/vue/introduce-cn/)
- Ant Design Vue 3.x 官方中文文档，包含所有组件的 API 和示例
- [Ant Design 设计规范](https://ant.design/index-cn)
- Ant Design 的设计原则和规范