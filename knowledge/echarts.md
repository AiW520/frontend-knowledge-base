# ECharts 数据可视化

## 知识简介

ECharts 是百度开源的数据可视化图表库，提供折线图、柱状图、饼图、散点图、地图等丰富的图表类型。jinzhuan-project-web 项目使用 ECharts 5 实现数据可视化。

## 核心概念

- **`echarts.init(dom)`**：初始化图表实例
- **`option`**：图表配置对象，定义图表类型、数据、样式
- **`series`**：图表系列，定义数据和图表类型
- **`xAxis` / `yAxis`**：坐标轴配置
- **`tooltip`**：提示框配置
- **`legend`**：图例配置
- **响应式**：`resize` 事件监听，自适应容器大小

## 详细讲解

在 jinzhuan-project-web 项目中，ECharts 作为依赖直接引入（`echarts: "^5.5.0"`），用于在仪表盘页面展示数据统计图表。

ECharts 的典型使用流程：
1. 准备 DOM 容器
2. 初始化 ECharts 实例
3. 配置 `option` 对象
4. 调用 `setOption()` 渲染图表
5. 监听 `resize` 事件实现自适应

ECharts 在 Vite 中的优化配置：在 `package.json` 中配置 `optimizeDeps` 预构建 ECharts 相关模块：
```json
"echarts",
"echarts/charts",
"echarts/components",
"echarts/core",
"echarts/renderers"
```

## 重点内容

- `setOption()` 可以增量更新（notMerge 参数控制是否合并）
- ECharts 支持按需引入（减少打包体积）
- 常用图表类型：`line`、`bar`、`pie`、`scatter`
- `tooltip` 支持自定义格式化内容
- 数据更新：再次调用 `setOption()` 即可

## 关键代码示例

来源：`jinzhuan-project-web/src/components/Layout/layout.vue`

ECharts 在项目的 vue3-count-to 插件中用于数字滚动效果，在仪表盘中展示统计数据。

```javascript
import * as echarts from 'echarts'

// 初始化图表
const chart = echarts.init(document.getElementById('chart'))

// 配置图表
const option = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['数据A', '数据B'] },
  xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
  yAxis: { type: 'value' },
  series: [
    { name: '数据A', type: 'line', data: [120, 200, 150] },
    { name: '数据B', type: 'bar', data: [80, 120, 90] }
  ]
}

// 渲染图表
chart.setOption(option)

// 响应式自适应
window.addEventListener('resize', () => chart.resize())
```

## 实际应用场景

- 管理后台数据仪表盘
- 数据报表和统计图表
- 大数据可视化
- 实时数据监控

## 注意事项

- 图表实例需要在组件销毁时调用 `dispose()` 释放资源
- DOM 容器需要设置明确的宽高
- 数据更新时建议使用 `notMerge: true` 清空旧配置
- 在 Vue 中，建议使用 `ref` 获取 DOM 并用 `onMounted` 初始化图表

## 常见误区

- 误区：忘记在组件卸载时销毁图表实例（内存泄漏）
- 误区：图表容器高度为 0 导致不显示
- 误区：频繁销毁重建图表（应使用 `setOption` 更新数据）

## 关联知识点

- [Vue 3 Composition API](/knowledge/vue3-composition-api)
- [DOM 操作](/knowledge/dom-manipulation)

## 资料来源

- 来源项目：`新前端资源/jinzhuan-project-web/`
- 来源文件：`package.json`（ECharts 依赖和预构建配置）
- 来源文件：`src/views/home/`（仪表盘页面）

## 官方资源扩展

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- ECharts 官方文档，包含所有图表类型和配置项参考
- [ECharts 示例库](https://echarts.apache.org/examples/zh/index.html)
- 官方示例库，可直接查看和修改图表代码