# 区块链数据可视化（ECharts）

## 知识简介

区块链应用平台需要将区块数据、交易统计、节点状态等信息以图表形式直观展示。ECharts 是国产开源的数据可视化库，支持丰富的图表类型，与 Vue 3 集成良好。在金砖大赛中，仪表盘（Dashboard）页面通常需要使用图表展示区块链运行状态，是前端开发的重要考核点。

## 核心概念

- **ECharts**：Apache 开源的数据可视化图表库，支持折线图、柱状图、饼图、仪表盘等
- **vue-echarts**：ECharts 的 Vue 3 封装组件
- **图表配置 option**：ECharts 通过 JSON 配置定义图表样式和数据
- **响应式图表**：图表随窗口大小自适应调整
- **数据刷新**：定时调用 API 获取最新数据并更新图表

## 详细讲解

### 1. 安装与配置

```bash
npm install echarts vue-echarts
```

`main.ts` 中全局注册：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  LineChart,
  BarChart,
  PieChart,
  GaugeChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'

// 注册必要的组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const app = createApp(App)
app.component('VChart', ECharts)
app.mount('#app')
```

### 2. 区块链仪表盘页面

```vue
<template>
  <div class="dashboard">
    <!-- 概览卡片 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-statistic title="当前区块高度" :value="blockNumber" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="总交易数" :value="totalTxCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="活跃节点数" :value="activeNodes" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="已部署合约" :value="contractCount" />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 近24小时交易量趋势 -->
      <el-col :span="12">
        <el-card>
          <template #header>近24小时交易量趋势</template>
          <v-chart :option="txTrendOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>

      <!-- 区块 Gas 使用分布 -->
      <el-col :span="12">
        <el-card>
          <template #header>区块 Gas 使用分布</template>
          <v-chart :option="gasDistOption" autoresize style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 节点负载仪表盘 -->
      <el-col :span="8">
        <el-card>
          <template #header>节点负载</template>
          <v-chart :option="nodeLoadOption" autoresize style="height: 250px" />
        </el-card>
      </el-col>

      <!-- 交易类型占比 -->
      <el-col :span="8">
        <el-card>
          <template #header>交易类型占比</template>
          <v-chart :option="txTypeOption" autoresize style="height: 250px" />
        </el-card>
      </el-col>

      <!-- 最近区块生成速度 -->
      <el-col :span="8">
        <el-card>
          <template #header>区块生成速度（秒/块）</template>
          <v-chart :option="blockSpeedOption" autoresize style="height: 250px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getBlockList, getNodeInfo } from '@/api/webase'

// ============ 数据 ============
const blockNumber = ref(0)
const totalTxCount = ref(0)
const activeNodes = ref(0)
const contractCount = ref(0)
const txTrendData = ref<number[]>([])
const gasUsedData = ref<number[]>([])
let refreshTimer: number | null = null

// ============ 图表配置 ============

// 交易量趋势图（折线图）
const txTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 24 }, (_, i) => `${i}:00`)
  },
  yAxis: { type: 'value', name: '交易数' },
  series: [{
    data: txTrendData.value,
    type: 'line',
    smooth: true,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0)' }
        ]
      }
    }
  }]
}))

// Gas 使用分布（柱状图）
const gasDistOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 10 }, (_, i) => `区块 ${blockNumber.value - i}`)
  },
  yAxis: { type: 'value', name: 'Gas Used' },
  series: [{
    data: gasUsedData.value,
    type: 'bar',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#67C23A' },
          { offset: 1, color: '#E1F3D8' }
        ]
      }
    }
  }]
}))

// 节点负载（仪表盘）
const nodeLoadOption = computed(() => ({
  series: [{
    type: 'gauge',
    startAngle: 180,
    endAngle: 0,
    min: 0,
    max: 100,
    splitNumber: 5,
    axisLine: {
      lineStyle: {
        color: [
          [0.3, '#67C23A'],
          [0.7, '#E6A23C'],
          [1, '#F56C6C']
        ]
      }
    },
    pointer: { icon: 'path://...' },
    detail: {
      formatter: '{value}%',
      fontSize: 20
    },
    data: [{ value: activeNodes.value * 25, name: 'CPU 使用率' }]
  }]
}))

// 交易类型占比（饼图）
const txTypeOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: '0%' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    data: [
      { value: 335, name: '合约调用' },
      { value: 234, name: '转账交易' },
      { value: 154, name: '合约部署' },
      { value: 135, name: '存证上链' }
    ],
    emphasis: {
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
    }
  }]
}

// 区块生成速度图表
const blockSpeedOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  yAxis: { type: 'value', name: '秒' },
  series: [{
    data: [2.5, 3.1, 2.8, 2.3, 2.9, 3.4, 2.6, 3.0],
    type: 'line',
    markLine: {
      silent: true,
      data: [{ yAxis: 3.0, label: { formatter: '平均 3s' } }]
    }
  }]
}))

// ============ 数据获取 ============
const fetchDashboardData = async () => {
  try {
    const blocks = await getBlockList(1, 1, 10)
    if (blocks && blocks.length > 0) {
      blockNumber.value = blocks[0].blockNumber
      totalTxCount.value = blocks.reduce((sum, b) => sum + b.transactionCount, 0)
    }
    const nodes = await getNodeInfo(1)
    if (nodes) {
      activeNodes.value = nodes.length
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
  // 每 10 秒刷新一次数据
  refreshTimer = window.setInterval(fetchDashboardData, 10000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>
```

## 重点内容

- **`vue-echarts` 组件**：通过 `v-chart` 组件在 Vue 3 中使用 ECharts
- **`autoresize` 属性**：图表自动响应父容器尺寸变化
- **按需导入**：只导入需要使用的图表类型和组件，减小打包体积
- **定时刷新**：使用 `setInterval` 定时获取最新数据并更新图表
- **computed 属性**：图表的 option 使用 computed 实现响应式更新

## 实际应用场景

- 区块链仪表盘：展示区块高度、交易统计、节点状态
- 交易监控：实时展示交易量趋势、Gas 价格变化
- 合约分析：展示合约调用频率、Gas 消耗排行
- 网络拓扑：展示联盟链节点连接关系

## 注意事项

- 按需导入 ECharts 组件可以显著减小打包体积（从 1MB+ 降到 200KB 左右）
- 图表数据更新时，ECharts 默认会执行合并（merge），使用 `notMerge: true` 可以完全替换
- 定时器在组件卸载时需要清除，避免内存泄漏
- 图表容器必须有明确的宽高，否则图表无法正常渲染

## 常见误区

- 误区：全量导入 ECharts 导致打包体积过大
- 误区：图表 option 不是响应式的，数据变化后图表不更新
- 误区：忘记在 `onUnmounted` 中清除定时器
- 误区：图表容器没有设置高度导致不显示

## 关联知识点

- [Element Plus 组件库](/knowledge/element-plus)
- [Axios 封装与 API 对接](/knowledge/axios-api-encapsulation)
- [Vue 3 Composition API](/knowledge/vue3-composition-api)

## 官方资源扩展

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html) - Apache ECharts 完整中文文档，最佳学习资源
- [ECharts 示例集](https://echarts.apache.org/examples/zh/index.html) - 数百个图表示例，可直接参考使用
- [vue-echarts GitHub](https://github.com/ecomfe/vue-echarts) - Vue 3 ECharts 封装组件文档
- [ECharts 按需引入指南](https://echarts.apache.org/handbook/zh/basics/import) - 官方按需导入教程，减小打包体积