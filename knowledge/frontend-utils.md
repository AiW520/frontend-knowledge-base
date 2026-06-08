# 前端工具函数

## 知识简介

前端项目中经常需要编写各类工具函数，包括节流防抖、日期格式化、文件下载、随机数生成、数字格式化、剪贴板操作等。jinzhuan-project-web 项目的 `src/utils/index.ts` 文件包含丰富的工具函数实现。

## 核心概念

- **节流（Throttle）**：限制函数在固定时间内只执行一次
- **防抖（Debounce）**：函数在连续触发后只执行最后一次
- **日期格式化**：将时间戳或日期对象转换为指定格式的字符串
- **文件下载**：通过创建 `<a>` 标签或 Blob 实现文件下载
- **剪贴板**：使用 Clipboard API 或 execCommand 复制文本
- **正则验证**：手机号、数字、字母等格式验证

## 详细讲解

### 1. 节流函数
```javascript
export const Throttle = () => {
  let flags = true
  let timeout = null
  return function (func, time) {
    if (flags) {
      func()
      flags = false
      timeout = setTimeout(() => { flags = true }, time)
    }
  }
}
```
节流适用于**持续触发但不需要每次都执行**的场景，如滚动事件、窗口 resize。

### 2. 防抖函数
```javascript
export function Debounce() {
  let timer = null
  return function (fn, delay) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => { fn.apply(self, args) }, delay)
  }
}
```
防抖适用于**连续触发后只需最后一次执行**的场景，如搜索框输入、表单提交。

### 3. 日期格式化
项目中提供了多个日期格式化函数，将 Date 对象或时间戳转换为 `{y}-{m}-{d} {h}:{i}:{s}` 等格式的字符串。

### 4. 文件下载
支持多种下载方式：直接链接下载、跨域文件下载（通过 XHR）、Blob 流式下载。

### 5. 数字格式化
`transform()` 函数将大数字转换为带单位的格式（如 "1.2万"、"3.5亿"）。

### 6. 剪贴板操作
优先使用 Clipboard API，回退到 `document.execCommand('copy')`。

## 重点内容

- **节流 vs 防抖**：节流是"固定时间执行一次"，防抖是"执行最后一次"
- 日期格式化的 `padStart(2, '0')` 用于补零
- 文件下载的跨域需要 XMLHttpRequest 配合 blob 响应类型
- 剪贴板操作需在用户触发的上下文中执行

## 关键代码示例

来源：`jinzhuan-project-web/src/utils/index.ts`

```javascript
// 节流函数
export const Throttle = () => {
  let flags = true
  return function (func, time) {
    if (flags) {
      func()
      flags = false
      setTimeout(() => { flags = true }, time)
    }
  }
}

// 日期格式化
export function parseTime(time, cFormat) {
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  const date = new Date(time)
  const formatObj = {
    y: date.getFullYear(), m: date.getMonth() + 1,
    d: date.getDate(), h: date.getHours(),
    i: date.getMinutes(), s: date.getSeconds()
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    return value.toString().padStart(2, '0')
  })
}

// 复制到剪贴板
export const copyText = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.select()
    document.execCommand('copy', true)
    document.body.removeChild(textarea)
  }
}
```

## 实际应用场景

- **节流**：页面滚动加载更多、按钮防连点
- **防抖**：搜索框实时搜索、窗口 resize 处理
- **日期格式化**：列表中的时间展示
- **文件下载**：导出 Excel、下载报表
- **剪贴板**：一键复制分享链接
- **数字格式化**：展示统计数据（如 1.2万）

## 注意事项

- `setTimeout` 的 this 指向问题，需要使用闭包或箭头函数
- 文件下载后应调用 `URL.revokeObjectURL()` 释放内存
- `document.execCommand` 已废弃，优先使用 Clipboard API
- 日期解析在 Safari 中可能有问题，需要替换 `-` 为 `/`

## 常见误区

- 误区：混淆节流和防抖的使用场景
- 误区：在异步函数中使用节流/防抖未正确处理
- 误区：忘记在组件卸载时清除定时器

## 关联知识点

- [JavaScript 核心知识](/knowledge/dom-manipulation)
- [FileReader API](/knowledge/filereader)
- [表单验证](/knowledge/form-validation)

## 资料来源

- 来源项目：`新前端资源/jinzhuan-project-web/`
- 来源文件：`src/utils/index.ts`（完整工具函数库）
- 来源文件：`src/utils/randomUtil.ts`（随机数工具类）

## 官方资源扩展

- [MDN - Clipboard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API)
- MDN 的剪贴板 API 文档
- [Lodash 官方文档](https://lodash.com/docs/)
- Lodash 中 throttle、debounce 等工具函数的参考实现