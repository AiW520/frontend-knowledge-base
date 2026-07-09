# Vue3 项目级挖空训练营

## 训练定位

本模块是金砖前端主线训练。目标不是从零写一个 Vue 项目，而是在已有 Vue3 + Vite + TypeScript 工程中，快速读懂上下文并补全挖空代码。

所有示例均为泛化训练模型，不对应任何非公开训练材料细节。

## 一张项目地图

```text
main.ts
  -> 注册 app、router、store、UI 样式
router/
  -> 页面入口、登录页、业务页、角色信息
store/
  -> token、用户信息、全局 loading
fetch/ 或 api/
  -> API 编号、URL、method、统一响应拦截
views/
  -> 真实挖空位置，通常在页面模板和业务函数
components/
  -> 已有弹窗、表单、卡片、空状态、加载组件
```

比赛时不要跳过 `fetch/api`。很多前端空不是让你猜 URL，而是让你按工程已有 API 映射调用。

## 四套训练

### A 套：模板小空

训练内容：

- `:key=""`
- `{{ }}`
- `:class=""`
- `v-if=""`
- `@click=""`
- `v-model:value=""`

限时目标：

> 15 分钟内补完一个页面的模板小空，页面无渲染错误。

### B 套：页面区域空

训练内容：

- 卡片头部。
- 卡片主体字段。
- 卡片底部操作。
- 详情弹窗内容。
- 链上证据展示区域。

答题原则：

- 使用已有 class。
- 使用已有循环变量。
- 使用已有 UI 库组件。
- 不引入无关新组件。

### C 套：业务函数空

训练内容：

- 登录。
- 列表查询。
- 搜索。
- 分页。
- 查看详情。
- 下载文件。
- 删除确认。

统一函数骨架：

```ts
const action = async () => {
  if (前置条件不满足) {
    message.error('请先补全必要信息')
    return
  }

  loading.value = true
  try {
    const res = await Fetch({
      uriCode: 'API_CODE',
      ...params
    })
    // 更新页面状态
    message.success('操作成功')
  } catch (error) {
    message.error('操作失败')
  } finally {
    loading.value = false
  }
}
```

### D 套：前后端联调空

训练内容：

- 根据 API 表确定 `uriCode`。
- 根据页面状态组装参数。
- 根据响应结构取 `records`、`total`、`data`。
- 根据状态码做成功/失败分支。
- 根据 token 机制确认请求头。

限时目标：

> 30 分钟内跑通登录 + 列表 + 详情三个前端闭环。

## 读空五步法

### 第一步：判断空的形态

```text
空在 template -> 先找变量和组件
空在 script -> 先找 API 和状态
空在 style -> 先找已有 class 命名
空在配置 -> 先看环境变量和代理
```

### 第二步：找已有变量

优先搜索：

- `ref(`
- `reactive(`
- `computed(`
- `onMounted`
- 当前页面的接口方法名。

### 第三步：找统一请求

优先搜索：

- `Fetch(`
- `axios.create`
- `interceptors`
- `uriCode`
- `API001` 这类 API 映射。

### 第四步：补最短闭环

最短闭环不是写最多代码，而是：

```text
按钮能点 -> 请求能发 -> 页面能显示 -> 失败有提示
```

### 第五步：补评分证据

前端评分看页面，不看你脑子里的变量。关键结果要显示出来：

- 列表刷新。
- 详情弹窗。
- 成功提示。
- 交易哈希或状态。
- 下载文件名。

## 常见高分模板

### 列表查询

```ts
const getList = async () => {
  loading.value = true
  try {
    const res = await Fetch({
      uriCode: 'API_PAGE',
      current: page.current,
      size: page.pageSize,
      keyword: query.keyword
    })
    list.value = res.data.records || []
    page.total = res.data.total || 0
  } catch (error) {
    message.error('列表加载失败')
  } finally {
    loading.value = false
  }
}
```

### 下载文件

```ts
const downloadFile = async (row: any) => {
  let url = ''
  try {
    const res = await Fetch({
      uriCode: 'API_DOWNLOAD',
      id: row.id,
      responseType: 'blob'
    })
    const blob = new Blob([res.data || res])
    url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = row.fileName || 'download.bin'
    link.click()
  } catch (error) {
    message.error('下载失败')
  } finally {
    if (url) URL.revokeObjectURL(url)
  }
}
```

### 详情弹窗

```ts
const openDetail = async (row: any) => {
  current.value = row
  visible.value = true

  try {
    const res = await Fetch({
      uriCode: 'API_DETAIL',
      id: row.id
    })
    current.value = { ...row, ...res.data }
  } catch (error) {
    message.warning('详情加载失败，已展示基础信息')
  }
}
```

## 赛前 90 分钟复习法

| 时间 | 做什么 |
| --- | --- |
| 0-15 分钟 | 复习项目结构和 API 映射 |
| 15-35 分钟 | 练登录、token、用户信息 |
| 35-55 分钟 | 练列表、搜索、分页 |
| 55-70 分钟 | 练详情、弹窗、下载 |
| 70-85 分钟 | 练链上证据区域展示 |
| 85-90 分钟 | 看提交截图清单 |

## Vue2 补充说明

Vue2 写法可用于省赛或旧项目迁移理解，但本训练营不以 Vue2 为主。遇到 Vue3 项目时，不要把 `data()`、`methods`、`.sync`、`slot-scope` 等旧写法硬套到 `<script setup>` 和 `v-model:value` 上。
