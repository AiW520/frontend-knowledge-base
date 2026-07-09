# 前端填空题型训练

## 训练目标

本页训练 Vue3 项目级挖空补全。示例全部经过泛化改写，只保留题型形态和知识点，不复用非公开训练材料中的页面、字段、业务名称或代码片段。

真实前端挖空常见两种：

- 小空：只空 `:key=""`、`{{ }}`、`:class=""`、`@click=""`。
- 大空：空一整块模板、一个登录函数、一个列表查询函数、一个下载函数。

答题时要把“空”分成三类：

```text
模板空 -> 看 template 周围结构
状态空 -> 看 ref/reactive/computed
逻辑空 -> 看 API 映射、Fetch 封装、响应结构
```

## 题型 1：原生列表小空

### 题目形态

```vue
<tr v-for="item in recordList" :key="">
  <td>{{  }}</td>
  <td>{{  }}</td>
  <td>{{  }}</td>
</tr>
```

### 参考补法

```vue
<tr v-for="item in recordList" :key="item.id">
  <td>{{ item.recordNo }}</td>
  <td>{{ item.ownerName }}</td>
  <td>{{ item.statusText }}</td>
</tr>
```

### 讲解

这种题已经给出 `v-for`，不要改成新的循环。只补当前行的唯一 key 和字段表达式。

## 题型 2：Vue3 表单绑定

### 题目形态

```vue
<a-form :model="queryForm">
  <a-form-item label="关键字">
    <a-input v-model:value="选手填写部分" />
  </a-form-item>
  <a-form-item label="状态">
    <a-select v-model:value="选手填写部分" />
  </a-form-item>
</a-form>
```

### 参考补法

```vue
<a-form :model="queryForm">
  <a-form-item label="关键字">
    <a-input v-model:value="queryForm.keyword" />
  </a-form-item>
  <a-form-item label="状态">
    <a-select v-model:value="queryForm.status" />
  </a-form-item>
</a-form>
```

### 配套状态

```ts
const queryForm = reactive({
  keyword: '',
  status: undefined
})
```

### 易错点

- Vue3 + Ant Design Vue 常见是 `v-model:value`，不要写成 Vue2 的 `.sync`。
- 模板里不要写 `queryForm.value.keyword`，`reactive` 对象直接访问字段。
- 下拉框初始值类型要和选项值一致。

## 题型 3：卡片头部整块补全

### 题目形态

```vue
<div class="resource-card">
  <div class="card-header">
    <!-- 选手填写部分 -->
  </div>
</div>
```

### 参考补法

```vue
<div class="resource-card">
  <div class="card-header">
    <div class="title-group">
      <h3>{{ resource.resourceName || '未命名资源' }}</h3>
      <span class="sub-text">{{ resource.version || 'v1.0' }}</span>
    </div>
    <a-tag :color="resource.enabled ? 'green' : 'default'">
      {{ resource.enabled ? '可用' : '停用' }}
    </a-tag>
  </div>
</div>
```

### 讲解

模板整块空不是让你随便写 UI，而是要沿用已有变量、已有 class 和已有组件库。先找当前循环变量，再决定展示字段。

## 题型 4：卡片操作区补全

### 题目形态

```vue
<div class="card-actions">
  <!-- 选手填写部分 -->
</div>
```

### 参考补法

```vue
<div class="card-actions">
  <a-button type="link" @click="openDetail(resource)">详情</a-button>
  <a-button type="link" @click="downloadArchive(resource)">下载</a-button>
  <a-button type="link" danger @click="confirmRemove(resource)">删除</a-button>
</div>
```

### 易错点

- 行操作必须把当前行传进去，例如 `openDetail(resource)`。
- 不要只写方法名，按钮上要补完整事件属性。
- 删除类操作建议走确认弹窗，不要直接删。

## 题型 5：登录函数大块补全

### 题目形态

```ts
const onLogin = async () => {
  /** 选手填写部分 */
}
```

### 参考补法

```ts
const onLogin = async () => {
  if (!loginForm.account) {
    message.error('请输入账号')
    return
  }
  if (!loginForm.password) {
    message.error('请输入密码')
    return
  }

  try {
    const res = await Fetch({
      uriCode: 'API_LOGIN',
      account: loginForm.account,
      password: loginForm.password
    })
    sessionStorage.setItem('token', res.data.token)
    await userStore.loadCurrentUser()
    router.push({ name: 'home' })
  } catch (error) {
    message.error('登录失败，请检查账号或密码')
  }
}
```

### 讲解

登录题至少要有五步：非空校验、请求、保存 token、拉取用户信息、跳转。只写请求通常不完整。

## 题型 6：统一请求参数补全

### 题目形态

```ts
const params = {
  uriCode: '选手填写部分',
  current: 选手填写部分,
  size: 选手填写部分,
  keyword: 选手填写部分
}
```

### 参考补法

```ts
const params = {
  uriCode: 'API_RESOURCE_PAGE',
  current: pagination.current,
  size: pagination.pageSize,
  keyword: queryForm.keyword
}
```

### 讲解

如果工程已有 API 编号映射，就优先使用工程约定，不要绕开统一请求封装。

## 题型 7：列表分页函数大块补全

### 题目形态

```ts
const getRecordList = async () => {
  /** 选手填写部分 */
}
```

### 参考补法

```ts
const getRecordList = async () => {
  loading.value = true
  try {
    const res = await Fetch({
      uriCode: 'API_RESOURCE_PAGE',
      current: pagination.current,
      size: pagination.pageSize,
      keyword: queryForm.keyword,
      status: queryForm.status
    })
    recordList.value = res.data.records || []
    pagination.total = res.data.total || 0
  } catch (error) {
    message.error('获取列表失败')
    recordList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}
```

### 易错点

- 只赋值列表，不赋值总数。
- 失败后 loading 没关闭。
- 没有兜底空数组，导致模板遍历报错。
- `records`、`list`、`rows` 要以实际响应结构为准。

## 题型 8：搜索与分页联动

### 题目形态

```ts
const handleSearch = () => {
  选手填写部分
  getRecordList()
}

const handlePageChange = (page: number) => {
  选手填写部分
  getRecordList()
}
```

### 参考补法

```ts
const handleSearch = () => {
  pagination.current = 1
  getRecordList()
}

const handlePageChange = (page: number) => {
  pagination.current = page
  getRecordList()
}
```

### 讲解

搜索时必须回到第一页；分页时只改页码，不要重置搜索条件。

## 题型 9：详情弹窗补全

### 题目形态

```ts
const openDetail = async (row: RecordItem) => {
  currentRecord.value = row
  /** 选手填写部分 */
  detailVisible.value = true
}
```

### 参考补法

```ts
const openDetail = async (row: RecordItem) => {
  currentRecord.value = row
  try {
    const res = await Fetch({
      uriCode: 'API_RESOURCE_DETAIL',
      id: row.id
    })
    currentRecord.value = {
      ...row,
      ...res.data
    }
  } catch (error) {
    message.warning('详情加载失败，已展示列表中的基础信息')
  }
  detailVisible.value = true
}
```

### 易错点

- 详情接口失败时不应让页面白屏。
- 打开弹窗前要保证当前记录有值。
- 合并详情时保留列表已有字段。

## 题型 10：文件下载大块补全

### 题目形态

```ts
const downloadArchive = async (row: RecordItem) => {
  /** 选手填写部分 */
}
```

### 参考补法

```ts
const downloadArchive = async (row: RecordItem) => {
  if (!row.id) {
    message.error('缺少下载标识')
    return
  }

  let objectUrl = ''
  try {
    const res = await Fetch({
      uriCode: 'API_RESOURCE_DOWNLOAD',
      id: row.id,
      responseType: 'blob'
    })
    const blob = new Blob([res.data || res])
    objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = row.fileName || `${row.recordNo || 'archive'}.zip`
    link.click()
    message.success('文件已开始下载')
  } catch (error) {
    message.error('下载失败')
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}
```

### 讲解

下载题要特别注意内存：创建 Object URL 后必须释放，避免长时间训练或演示时内存持续上涨。

## 题型 11：链上证据区域补全

### 题目形态

```vue
<div class="proof-panel" v-if="选手填写部分">
  <p>交易哈希：{{ 选手填写部分 }}</p>
  <p>区块高度：{{ 选手填写部分 }}</p>
  <p>状态：{{ 选手填写部分 }}</p>
</div>
```

### 参考补法

```vue
<div class="proof-panel" v-if="currentRecord?.chainProof">
  <p>交易哈希：{{ currentRecord.chainProof.txHash || '-' }}</p>
  <p>区块高度：{{ currentRecord.chainProof.blockNumber || '-' }}</p>
  <p>状态：{{ currentRecord.chainProof.confirmed ? '已确认' : '待确认' }}</p>
</div>
```

### 讲解

链上证据是前端评分展示的一部分。不要只在控制台打印，也不要把关键字段藏到不可见数据里。

## 题型 12：组合式 API 完整骨架

### 题目形态

```vue
<script setup lang="ts">
/** 选手填写部分 */
</script>
```

### 参考补法

```vue
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import Fetch from '@/fetch'

interface RecordItem {
  id: number
  recordNo: string
  ownerName: string
  statusText: string
  fileName?: string
}

const loading = ref(false)
const recordList = ref<RecordItem[]>([])
const queryForm = reactive({
  keyword: '',
  status: undefined
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const getRecordList = async () => {
  loading.value = true
  try {
    const res = await Fetch({
      uriCode: 'API_RESOURCE_PAGE',
      current: pagination.current,
      size: pagination.pageSize,
      keyword: queryForm.keyword
    })
    recordList.value = res.data.records || []
    pagination.total = res.data.total || 0
  } catch (error) {
    message.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getRecordList()
})
</script>
```

### 易错点

- `ref` 赋值忘记 `.value`。
- 忘记导入 `onMounted`、`ref`、`reactive`。
- `onMounted(getRecordList())` 写法错误，应传函数。
- 接口异常时没有关闭 loading。

## 答题顺序

遇到页面级挖空时，按这个顺序：

1. 搜索全部 `选手填写部分`，统计有几个空。
2. 先补模板小空，让页面能渲染。
3. 再补登录或列表函数，让数据能进页面。
4. 再补详情、下载、提交等操作。
5. 最后补 message、loading、empty、兜底显示。
6. 每补完一个大块，启动页面或构建检查一次。

## 检查清单

| 检查项 | 标准 |
| --- | --- |
| 空位 | 不残留 `选手填写部分` |
| 模板 | 标签闭合，事件绑定方法存在 |
| 状态 | `ref` / `reactive` 使用正确 |
| 请求 | 使用项目统一请求封装 |
| 响应 | 列表、总数、详情字段赋值正确 |
| 反馈 | 成功、失败、loading、空状态都有 |
| 下载 | Blob 下载后释放 Object URL |
| 证据 | 关键结果在页面可见 |
| 安全 | 不把 token、私钥、敏感配置写死到页面 |
