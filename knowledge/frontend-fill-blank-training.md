# 前端填空题型训练

## 训练目标

真实前端填空题很少是把整条指令空掉。更常见的是：页面结构已经给好，只空表达式、属性值、方法名、请求地址、响应字段，或者在 `methods` 中空一整段业务逻辑。

本页按真实占位风格训练，统一使用 `选手填写部分` 表示待补代码。示例仅使用通用业务模型，不包含非公开训练材料细节。

## 真实填空的常见形态

| 类型 | 题目通常怎么空 | 训练重点 |
| --- | --- | --- |
| 模板表达式 | `{{ 选手填写部分 }}` | 从数据对象取正确字段 |
| 属性值 | `:key="选手填写部分"` | 填表达式，不是填完整属性 |
| 事件绑定 | `<el-button 选手填写部分>` | 补 `@click="方法名"` |
| 条件判断 | `v-if="选手填写部分"` | 补布尔表达式 |
| 表单绑定 | `v-model="选手填写部分"` | 补表单字段路径 |
| 组件标签 | `<选手填写部分>` | 补 Element/Vue 组件名 |
| 接口地址 | `this.$http.post('选手填写部分', data)` | 补 URL 字符串 |
| 请求参数 | `{ key: 选手填写部分 }` | 补变量或对象字段 |
| 响应判断 | `if (选手填写部分 == 200)` | 补状态码路径 |
| 整段逻辑 | `/* 选手填写部分 */` | 补完整请求、判断、赋值、反馈 |

## 难度 1：模板字段填空

### 题目形态

```vue
<div class="profile-field"><strong>姓名:</strong> {{ 选手填写部分 }}</div>
<div class="profile-field"><strong>年龄:</strong> {{ 选手填写部分 }}</div>
<div class="profile-field"><strong>地址:</strong> {{ 选手填写部分 }}</div>
```

### 标准补法

```vue
<div class="profile-field"><strong>姓名:</strong> {{ userInfo.name }}</div>
<div class="profile-field"><strong>年龄:</strong> {{ userInfo.age }}</div>
<div class="profile-field"><strong>地址:</strong> {{ userInfo.address }}</div>
```

### 讲解

这种题不是考插值语法，而是考你能不能看懂 `data()` 中的数据结构。先找页面脚本里的对象名，再找字段名。

### 易错点

- 把字段写成字符串：`{{ 'userInfo.name' }}`。
- 对象未初始化，页面首次渲染报错。
- 字段和后端返回字段不一致。

## 难度 1：表单字段填空

### 题目形态

```vue
<el-form :model="form">
  <el-form-item label="名称">
    <el-input v-model="选手填写部分"></el-input>
  </el-form-item>
  <el-form-item label="编号">
    <el-input v-model="选手填写部分"></el-input>
  </el-form-item>
  <el-form-item label="是否启用">
    <el-switch v-model="选手填写部分"></el-switch>
  </el-form-item>
</el-form>
```

### 标准补法

```vue
<el-form :model="form">
  <el-form-item label="名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="编号">
    <el-input v-model="form.code"></el-input>
  </el-form-item>
  <el-form-item label="是否启用">
    <el-switch v-model="form.enabled"></el-switch>
  </el-form-item>
</el-form>
```

### 配套 data

```js
data() {
  return {
    form: {
      name: '',
      code: '',
      enabled: false
    }
  }
}
```

### 易错点

- `v-model` 填成 `this.form.name`，模板里不要写 `this`。
- `form` 中没有提前声明字段。
- `el-switch` 字段使用字符串 `'true'` / `'false'`，后端要求布尔值时会错。

## 难度 2：事件绑定填空

### 题目形态

```vue
<el-button type="primary" 选手填写部分>确认</el-button>
<el-button type="danger" 选手填写部分>退出登录</el-button>
<el-button slot="append" icon="el-icon-search" 选手填写部分></el-button>
```

### 标准补法

```vue
<el-button type="primary" @click="submitForm">确认</el-button>
<el-button type="danger" @click="logout">退出登录</el-button>
<el-button slot="append" icon="el-icon-search" @click="searchByKeyword"></el-button>
```

### 讲解

真实题里经常只留一个裸的 `选手填写部分`，需要你补完整属性：`@click="方法名"`。

### 易错点

- 只填方法名：`submitForm`，少了 `@click=""`。
- 方法名和 `methods` 中定义不一致。
- 退出登录只跳路由，不清理 token。

## 难度 2：条件按钮填空

### 题目形态

```vue
<el-button v-if="选手填写部分" type="primary" @click="openCreate">上传信息</el-button>
<el-button v-else-if="选手填写部分 != null && 选手填写部分" type="primary" @click="viewInfo">查看信息</el-button>
<el-button v-else type="primary" @click="openEdit">修改信息</el-button>
```

### 标准补法

```vue
<el-button v-if="!profile" type="primary" @click="openCreate">上传信息</el-button>
<el-button v-else-if="profile != null && profile.checked" type="primary" @click="viewInfo">查看信息</el-button>
<el-button v-else type="primary" @click="openEdit">修改信息</el-button>
```

### 讲解

这种题考的是状态分支：没有数据时新增，有数据且满足条件时查看，否则修改。先理清页面状态，再填表达式。

### 易错点

- `v-if="profile"` 和业务含义写反。
- 多处 `选手填写部分` 应该填同一对象路径，却填成不同变量。
- 没考虑 `null`，页面首次加载报错。

## 难度 2：表格列字段填空

### 题目形态

```vue
<el-table :data="tableData">
  <el-table-column prop="选手填写部分" label="编号"></el-table-column>
  <el-table-column prop="选手填写部分" label="名称"></el-table-column>
  <el-table-column prop="选手填写部分" label="状态">
    <template slot-scope="scope">
      {{ 选手填写部分 }}
    </template>
  </el-table-column>
</el-table>
```

### 标准补法

```vue
<el-table :data="tableData">
  <el-table-column prop="code" label="编号"></el-table-column>
  <el-table-column prop="name" label="名称"></el-table-column>
  <el-table-column prop="status" label="状态">
    <template slot-scope="scope">
      {{ scope.row.status === 1 ? '成功' : '处理中' }}
    </template>
  </el-table-column>
</el-table>
```

### 讲解

`prop` 填字段名字符串，插槽里填表达式。不要把 `scope.row.xxx` 写进 `prop`。

### 易错点

- `prop="row.name"` 错，`prop` 要写字段名。
- 插槽里忘记 `scope.row`。
- 状态码没有兜底。

## 难度 2：原生表格循环填空

### 题目形态

```vue
<tr v-for="item in list" :key="">
  <td>{{  }}</td>
  <td>{{  }}</td>
  <td>{{  }}</td>
</tr>
```

### 标准补法

```vue
<tr v-for="item in list" :key="item.id">
  <td>{{ item.code }}</td>
  <td>{{ item.name }}</td>
  <td>{{ item.status }}</td>
</tr>
```

### 讲解

真实题往往已经写好 `v-for="item in list"`，只空 `:key` 和单元格表达式。此时不要改循环结构，直接补字段。

### 易错点

- `:key=""` 留空会有警告。
- `{{ name }}` 少了 `item.`，取不到当前行数据。
- key 使用 index，数据变动时可能错位。

## 难度 3：下拉选项填空

### 题目形态

```vue
<el-select v-model="form.role" placeholder="请选择">
  <el-option
    v-for="item in 选手填写部分"
    :key="选手填写部分"
    :label="选手填写部分"
    :value="选手填写部分">
  </el-option>
</el-select>
```

### 标准补法

```vue
<el-select v-model="form.role" placeholder="请选择">
  <el-option
    v-for="item in roleOptions"
    :key="item.value"
    :label="item.label"
    :value="item.value">
  </el-option>
</el-select>
```

### 配套 data

```js
data() {
  return {
    form: {
      role: ''
    },
    roleOptions: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' }
    ]
  }
}
```

### 易错点

- `label` 和 `value` 写反。
- `:key` 填整个对象。
- `form.role` 初始值和 option value 类型不一致。

## 难度 3：弹窗控制填空

### 题目形态

```vue
<el-dialog :title="title" :visible.sync="选手填写部分" width="50%">
  <el-form :model="form">
    ...
  </el-form>
  <span slot="footer">
    <el-button @click="选手填写部分 = false">取消</el-button>
    <el-button type="primary" 选手填写部分>确认</el-button>
  </span>
</el-dialog>
```

### 标准补法

```vue
<el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
  <el-form :model="form">
    ...
  </el-form>
  <span slot="footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitForm">确认</el-button>
  </span>
</el-dialog>
```

### 易错点

- `dialogVisible` 没有在 `data()` 中声明。
- 取消按钮关错弹窗变量。
- 确认按钮没有防重复提交。

## 难度 3：登录方法整段填空

### 题目形态

```js
methods: {
  async login() {
    /* 选手填写部分 */
  }
}
```

### 标准补法

```js
methods: {
  async login() {
    if (!this.form.privateKey || !this.form.address) {
      this.$message.error('请填写完整登录信息')
      return
    }

    try {
      const response = await this.$http.post('/api/login', {
        privateKey: this.form.privateKey,
        address: this.form.address,
        role: this.form.role
      })

      if (response.data.code === 200) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('address', this.form.address)
        this.$message.success('登录成功')
        this.$router.push('/home')
      } else {
        this.$message.error(response.data.message || '登录失败')
      }
    } catch (error) {
      this.$message.error('网络异常，请稍后重试')
    }
  }
}
```

### 讲解

整段填空至少包含四步：校验、请求、成功处理、异常处理。只写 `post` 请求通常拿不到满分。

### 易错点

- 不校验空值。
- token 保存字段和拦截器读取字段不一致。
- 成功后没有跳转。
- catch 中只 `console.log`。

## 难度 3：请求拦截器整段填空

### 题目形态

```js
mounted() {
  // 请求发送前添加身份信息
  this.axios.interceptors.request.use(request => {
    选手填写部分
    return request
  })
}
```

### 标准补法

```js
mounted() {
  this.axios.interceptors.request.use(request => {
    const token = localStorage.getItem('token')
    if (token) {
      request.headers.Authorization = token
    }
    return request
  })
}
```

### 讲解

真实资源中常见这种“注释给出意图，整段逻辑留空”的形式。应补完整逻辑，不是只写一个字段。

### 易错点

- 每进入一次页面就重复注册拦截器。更好的做法是放到统一 request 文件中。
- header 名称和后端约定不一致。
- token 不存在时仍设置 `undefined`。

## 难度 3：响应拦截器整段填空

### 题目形态

```js
mounted() {
  this.axios.interceptors.response.use(response => {
    if (选手填写部分) {
      选手填写部分
    }
    return response
  })
}
```

### 标准补法

```js
mounted() {
  this.axios.interceptors.response.use(response => {
    if (response.data.code === 401) {
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
    return response
  })
}
```

### 易错点

- 只跳转，不清理本地身份。
- 判断错响应字段。
- 多个页面重复写，导致维护困难。

## 难度 4：列表查询整段填空

### 题目形态

```js
async loadTableData() {
  const response = await this.$http.post('选手填写部分', {
    "选手填写部分": 选手填写部分,
    "选手填写部分": 选手填写部分,
    "选手填写部分": 选手填写部分
  })
  this.totalCount = 选手填写部分
  this.tableData = 选手填写部分
}
```

### 标准补法

```js
async loadTableData() {
  const response = await this.$http.post('/api/list/page', {
    pageNum: this.pageNum,
    pageSize: this.pageSize,
    keyword: this.keyword
  })

  if (response.data.code === 200) {
    this.totalCount = response.data.data.total
    this.tableData = response.data.data.records
  } else {
    this.$message.error(response.data.message || '查询失败')
  }
}
```

### 讲解

分页查询题要同时补接口、参数、响应字段赋值。`totalCount` 和 `tableData` 是两个不同数据。

### 易错点

- 只赋值表格，不赋值总数，分页不工作。
- `records`、`list`、`rows` 等响应字段没看清。
- 查询失败时保留旧数据，页面误导用户。

## 难度 4：提交表单整段填空

### 题目形态

```js
async submitForm() {
  var url = "选手填写部分"
  if (this.isEdit) {
    url = "选手填写部分"
  }
  this.form.userAddress = 选手填写部分
  const response = await this.$http.post(选手填写部分, 选手填写部分)
  if (选手填写部分 == 200) {
    选手填写部分
    this.dialogVisible = 选手填写部分
  }
}
```

### 标准补法

```js
async submitForm() {
  let url = '/api/create'
  if (this.isEdit) {
    url = '/api/update'
  }

  this.form.userAddress = localStorage.getItem('address')

  const response = await this.$http.post(url, this.form)

  if (response.data.code === 200) {
    this.$message.success('操作成功')
    this.dialogVisible = false
    this.loadTableData()
  } else {
    this.$message.error(response.data.message || '操作失败')
  }
}
```

### 讲解

这类题是综合题：判断新增/修改、补充当前用户地址、提交接口、处理响应、关闭弹窗、刷新列表。

### 易错点

- `url` 写成字符串变量名：`'url'`。
- 提交前没有补充当前用户地址。
- 成功后没刷新列表。
- 弹窗变量写反。

## 难度 4：链上信息查询整段填空

### 题目形态

```js
async queryChainInfo(row) {
  const response = await this.$http.get(`选手填写部分`)
  if (选手填写部分 == 200) {
    this.chainInfo = 选手填写部分
    this.chainDialogVisible = 选手填写部分
  }
}
```

### 标准补法

```js
async queryChainInfo(row) {
  const response = await this.$http.get(`/api/chain/info/${row.hash}`)

  if (response.data.code === 200) {
    this.chainInfo = response.data.data
    this.chainDialogVisible = true
  } else {
    this.$message.error(response.data.message || '链上信息查询失败')
  }
}
```

### 讲解

链上信息查询通常由表格某一行触发，所以要从 `row` 中取哈希、编号或地址，再拼接请求地址。

### 易错点

- 模板字符串没有反引号。
- 使用了错误字段，例如 `row.id` 和 `row.hash` 混淆。
- 查询失败仍打开弹窗。

## 难度 4：时间线组件填空

### 题目形态

```vue
<选手填写部分 style="margin-top: 10px; overflow:auto; height: 400px">
  <选手填写部分
    v-for="(item,index) in 选手填写部分"
    :key="index"
    :timestamp="选手填写部分"
    placement="top">
    <选手填写部分>
      <p>{{ 选手填写部分 }} 操作于 {{ 选手填写部分 }}</p>
    </选手填写部分>
  </选手填写部分>
</选手填写部分>
```

### 标准补法

```vue
<el-timeline style="margin-top: 10px; overflow:auto; height: 400px">
  <el-timeline-item
    v-for="(item,index) in chainRecords"
    :key="index"
    :timestamp="item.time"
    placement="top">
    <el-card>
      <p>{{ item.operator }} 操作于 {{ item.action }}</p>
    </el-card>
  </el-timeline-item>
</el-timeline>
```

### 讲解

这种题会空组件名、循环数组、时间戳字段和展示字段。先识别组件结构，再补表达式。

### 易错点

- 开始标签和结束标签不配对。
- `el-timeline-item` 写成普通 `li`，样式和组件能力丢失。
- 时间字段不存在，时间线为空。

## 难度 4：WebSocket 通知填空

### 题目形态

```js
connectSocket() {
  let userAddress = 选手填写部分
  this.socket = new WebSocket('选手填写部分')

  this.socket.onmessage = event => {
    this.message = JSON.parse(选手填写部分)
    if (userAddress == 选手填写部分) {
      this.$notify({
        title: '提示',
        message: 选手填写部分,
        type: 'success'
      })
    }
  }
}
```

### 标准补法

```js
connectSocket() {
  let userAddress = localStorage.getItem('address')
  this.socket = new WebSocket('ws://localhost:8080/ws')

  this.socket.onmessage = event => {
    this.message = JSON.parse(event.data)
    if (userAddress === this.message.receiver) {
      this.$notify({
        title: '提示',
        message: this.message.content,
        type: 'success'
      })
    }
  }
}
```

### 讲解

WebSocket 题考实时消息处理：连接地址、解析消息、筛选当前用户、弹出通知。

### 易错点

- `JSON.parse(event)` 错，应解析 `event.data`。
- 没判断消息是否属于当前用户。
- 组件销毁时未关闭 socket。

### 更完整写法

```js
beforeDestroy() {
  if (this.socket) {
    this.socket.close()
    this.socket = null
  }
}
```

## 难度 4：文件上传整段填空

### 题目形态

```js
async uploadFile(file) {
  /* 选手填写部分 */
}
```

### 标准补法

```js
async uploadFile(file) {
  if (!file) {
    this.$message.error('请选择文件')
    return
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    this.$message.error('文件不能超过 10MB')
    return
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('userAddress', localStorage.getItem('address'))

  try {
    const response = await this.$http.post('/api/file/upload', formData)
    if (response.data.code === 200) {
      this.$message.success('上传成功')
      this.loadTableData()
    } else {
      this.$message.error(response.data.message || '上传失败')
    }
  } catch (error) {
    this.$message.error('上传异常')
  }
}
```

### 讲解

文件题不能把大文件随意读成字符串。优先使用 `FormData` 流式交给浏览器和后端处理。

### 易错点

- 用 JSON 上传 File 对象。
- 没限制文件大小。
- 上传失败后没有反馈。

## 难度 4：文件下载整段填空

### 题目形态

```js
async downloadFile(row) {
  /* 选手填写部分 */
}
```

### 标准补法

```js
async downloadFile(row) {
  try {
    const response = await this.$http.get('/api/file/download', {
      params: { id: row.id },
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = row.fileName || 'download.bin'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    this.$message.error('下载失败')
  }
}
```

### 讲解

下载题的关键是 `responseType: 'blob'` 和释放 `ObjectURL`。否则可能出现乱码或内存占用增长。

### 易错点

- 忘记设置 `responseType`。
- 不释放 URL。
- 后端错误响应也被当成文件下载。

## 难度 5：图片合成与上链提交

### 题目形态

```js
async generateImage() {
  /* 选手填写部分 */
}

uploadResult() {
  if (选手填写部分) {
    this.$message.error('请先完成前置操作')
    return
  }

  this.axios.post('选手填写部分', {
    "选手填写部分": 选手填写部分,
    "选手填写部分": 选手填写部分
  }).then(response => {
    if (选手填写部分 == 200) {
      选手填写部分
    } else {
      选手填写部分
    }
  })
}
```

### 标准补法

```js
async generateImage() {
  const canvas = document.createElement('canvas')
  canvas.width = this.$refs.poster.width
  canvas.height = this.$refs.poster.height

  const context = canvas.getContext('2d')
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const posterImage = new Image()
  posterImage.src = this.posterUrl
  posterImage.crossOrigin = 'Anonymous'
  await posterImage.decode()
  context.drawImage(posterImage, 0, 0, canvas.width, canvas.height)

  const markImage = new Image()
  markImage.src = this.markUrl
  markImage.crossOrigin = 'Anonymous'
  await markImage.decode()
  context.drawImage(markImage, canvas.width / 2, canvas.height / 2, 120, 120)

  this.resultImage = canvas.toDataURL('image/png')
}

uploadResult() {
  if (!this.resultImage) {
    this.$message.error('请先完成前置操作')
    return
  }

  this.axios.post('/api/result/upload', {
    imageBase64: this.resultImage,
    fileName: this.fileName
  }).then(response => {
    if (response.data.code === 200) {
      this.$message.success('提交成功')
    } else {
      this.$message.error(response.data.message || '提交失败')
    }
  }).catch(() => {
    this.$message.error('网络异常')
  })
}
```

### 讲解

这类题是高难度综合题：DOM、Canvas、异步图片加载、Base64、接口提交、前置状态判断都在一起。

### 易错点

- 图片未加载完成就 draw。
- 跨域图片没有设置 `crossOrigin`，导致 canvas 污染。
- Base64 太大时反复保存在多个变量中，造成内存压力。
- 提交前没有判断前置状态。

## 难度 5：路由守卫整段填空

### 题目形态

```js
router.beforeEach((to, from, next) => {
  /* 选手填写部分 */
})
```

### 标准补法

```js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.path === '/login') {
    next()
    return
  }

  if (!token) {
    next('/login')
    return
  }

  next()
})
```

### 讲解

路由守卫题考访问控制。最少要处理登录页放行、无 token 跳转、有 token 放行。

### 易错点

- 忘记 `return`，导致 `next()` 调用多次。
- 登录页也拦截，造成死循环。
- 只判断 token，不处理角色权限。

## 难度 5：组合式 API 大块填空

### 题目形态

```vue
<script setup lang="ts">
/* 选手填写部分 */
</script>
```

### 标准补法

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

interface RecordItem {
  id: number
  code: string
  name: string
  status: number
}

const loading = ref(false)
const tableData = ref<RecordItem[]>([])
const keyword = ref('')

async function loadData() {
  loading.value = true
  try {
    const res = await request.get('/api/records', {
      params: { keyword: keyword.value }
    })
    tableData.value = res.data.records
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
```

### 讲解

Vue 3 大块填空会同时考导入、类型、响应式变量、请求方法、生命周期。

### 易错点

- `ref` 变量赋值忘记 `.value`。
- 类型定义和接口返回不一致。
- `onMounted(loadData())` 会立即执行并传入返回值，应写函数。

## 难度 5：完整页面答题骨架

### 题目形态

```vue
<template>
  <div>
    <el-form :model="queryForm" inline>
      <el-form-item label="关键字">
        <el-input v-model="选手填写部分"></el-input>
      </el-form-item>
      <el-button type="primary" 选手填写部分>查询</el-button>
      <el-button type="success" 选手填写部分>新增</el-button>
    </el-form>

    <el-table :data="选手填写部分" v-loading="选手填写部分">
      <el-table-column prop="选手填写部分" label="编号"></el-table-column>
      <el-table-column prop="选手填写部分" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" 选手填写部分>查看链上信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="选手填写部分">
      <pre>{{ 选手填写部分 }}</pre>
    </el-dialog>
  </div>
</template>
```

### 标准补法

```vue
<template>
  <div>
    <el-form :model="queryForm" inline>
      <el-form-item label="关键字">
        <el-input v-model="queryForm.keyword"></el-input>
      </el-form-item>
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button type="success" @click="openCreate">新增</el-button>
    </el-form>

    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="code" label="编号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="queryChainInfo(scope.row)">查看链上信息</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="chainVisible">
      <pre>{{ chainInfo }}</pre>
    </el-dialog>
  </div>
</template>
```

### 讲解

完整页面题不是单点知识，而是把查询条件、按钮事件、表格数据、loading、行操作、弹窗状态串起来。

## 答题顺序

遇到大块填空时，不要从第一空机械填写。按这个顺序更稳：

1. 先找 `data()` 或 `setup()` 中已有变量。
2. 再找模板里每个空属于变量、事件还是组件。
3. 先补模板中能确定的字段。
4. 再补方法体中的请求地址、参数、响应赋值。
5. 最后补成功/失败提示、loading、弹窗关闭、列表刷新。

## 提交前检查

| 检查项 | 要求 |
| --- | --- |
| 空是否都补完 | 页面中不能残留 `选手填写部分` |
| 模板是否闭合 | 组件开始标签和结束标签一致 |
| 变量是否存在 | 模板使用的变量必须在 `data` 或 `setup` 中声明 |
| 方法是否存在 | `@click` 绑定的方法必须定义 |
| 请求是否可追踪 | 有接口地址、参数、响应判断 |
| 状态是否清楚 | loading、成功、失败、空数据都有反馈 |
| 链上信息是否可见 | 交易哈希、区块高度、状态等不要只放控制台 |
| 文件处理是否安全 | 大文件不长期保存在多个 Base64 变量中 |
| 异常是否处理 | `catch` 或失败分支必须有页面提示 |
