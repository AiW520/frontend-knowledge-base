# TypeScript 基础（前端）

## 知识简介

TypeScript 是 JavaScript 的超集，添加了静态类型系统。在前端项目中，TypeScript 帮助在编译阶段发现类型错误，提高代码质量和可维护性。Vue3 项目级训练工程全面使用 TypeScript。

## 核心概念

- **类型注解**：`: string`、`: number`、`: boolean` 等
- **接口（interface）**：定义对象的结构
- **泛型（Generic）**：`<T>`，创建可复用的类型
- **类型别名（type）**：`type User = { name: string }`
- **联合类型**：`string | number`
- **可选属性**：`name?: string`

## 详细讲解

在 Vue3 项目级训练工程中，TypeScript 用于：
1. **接口定义**：定义 API 请求参数、响应数据的结构
2. **组件类型**：Vue 组件的 props、emits 类型
3. **类型安全**：避免运行时类型错误

项目中定义了多个接口来描述请求参数和响应数据：
```typescript
interface IBindVars {
  key: string
  value: string | number
}

interface IParams {
  method?: string
  bindVars?: IBindVars[]
  [key: string]: any
}
```

使用 TypeScript 的好处：
- 编辑器自动补全和类型提示
- 编译时发现类型不匹配错误
- 更好的代码文档

## 重点内容

- `.ts` 文件是 TypeScript 文件，`.vue` 中使用 `<script lang="ts">`
- `interface` 用于定义对象形状，`type` 更灵活
- `?` 表示可选属性，`!` 表示非空断言
- `as` 用于类型断言
- `any` 绕过类型检查（应尽量避免）

## 关键代码示例

示例来源：通用训练工程抽象

```typescript
// 定义 RESTful 参数接口
interface IBindVars {
  key: string
  value: string | number
  [key: string]: any
}

// 定义请求参数类型
interface IParams {
  method?: string
  bindVars?: IBindVars[]
  [key: string]: any
}

// 扩展 axios 配置类型
interface AxiosRequestProps extends AxiosRequestConfig {
  params?: IParams
  [key: string]: any
}
```

## 实际应用场景

- API 请求参数和响应数据的类型约束
- Vue 组件的 props 和 emits 类型定义
- Pinia store 的 state 类型定义
- 工具函数的参数和返回值类型

## 注意事项

- TypeScript 类型在编译后会被移除，不影响运行时
- `any` 会失去类型检查，应尽量避免使用
- 使用 `interface` 优于 `type` 定义对象类型（更清晰的错误提示）
- `tsconfig.json` 中的 `strict: true` 开启严格模式

## 常见误区

- 误区：过度使用 `any` 导致 TypeScript 失去意义
- 误区：所有变量都需要显式类型注解（TypeScript 可以自动推断）
- 误区：`interface` 和 `type` 完全相同（interface 可被合并，type 不行）

## 关联知识点

- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [Pinia 状态管理](/knowledge/pinia)
- [Vite 构建工具](/knowledge/vite)

## 资料来源

- 示例来源：通用训练工程抽象
- 示例来源：通用训练工程抽象（接口定义、类型扩展）
- 示例来源：通用训练工程抽象（类型定义）
- 示例来源：通用训练工程抽象（状态类型定义）
- 示例来源：通用训练工程抽象（TypeScript 配置）

## 官方资源扩展

- [TypeScript 官方文档](https://www.typescriptlang.org/zh/docs/)
- TypeScript 官方中文文档，从基础到高级全覆盖
- [TypeScript 入门教程](https://ts.xcatliu.com/)
- 适合初学者的 TypeScript 中文教程