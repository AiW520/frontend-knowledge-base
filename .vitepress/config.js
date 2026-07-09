import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '前端知识库',
  description: '基于项目实战的前端开发知识库',
  base: '/frontend-knowledge-base/',
  ignoreDeadLinks: true,
  head: [
    [
      'script',
      {},
      `(function(){try{var key='bri-training-access-v1';var hash='4a547a10159a34bb09095bbef633288e128748c9d119047d130368ee53b9788c';if(localStorage.getItem(key)!==hash){document.documentElement.setAttribute('data-access-lock','locked')}}catch(error){document.documentElement.setAttribute('data-access-lock','locked')}})();`
    ]
  ],
  
  themeConfig: {
    siteTitle: '前端知识库',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '🏆 金砖大赛区块链', link: '/knowledge/blockchain-frontend-overview' },
      { text: 'Vue 2', link: '/knowledge/vue-instance' },
      { text: 'Vue 3', link: '/knowledge/vue3-composition-api' },
      { text: 'axios', link: '/knowledge/axios-http' },
      { text: 'Element UI', link: '/knowledge/element-ui-layout' },
      { text: 'Ant Design Vue', link: '/knowledge/ant-design-vue3' },
      { text: 'Vite', link: '/knowledge/vite' },
      { text: 'Bootstrap', link: '/knowledge/bootstrap-grid' }
    ],
    
    sidebar: [
      {
        text: '🏆 金砖大赛 - 区块链前端',
        collapsed: false,
        items: [
          { text: '赛项概述与赛程', link: '/knowledge/blockchain-frontend-overview' },
          { text: '前端竞赛考点学习路径', link: '/knowledge/frontend-competition-roadmap' },
          { text: '前端填空题型训练', link: '/knowledge/frontend-fill-blank-training' },
          { text: 'Vue 3 登录表单开发', link: '/knowledge/vue3-ts-project-setup' },
          { text: 'Vue 3 数据列表与表格', link: '/knowledge/element-plus' },
          { text: 'Vue Router 4 路由导航', link: '/knowledge/vue-router4-advanced' },
          { text: 'Axios 封装与 API 调用', link: '/knowledge/axios-api-encapsulation' },
          { text: 'Vue 3 文件下载功能', link: '/knowledge/web3-blockchain-interaction' },
          { text: 'Element Plus 表单验证', link: '/knowledge/smart-contract-frontend' },
          { text: '错误处理与用户反馈', link: '/knowledge/blockchain-data-visualization' },
          { text: '项目配置与环境搭建', link: '/knowledge/form-validation' },
          { text: '综合实战：完整页面开发', link: '/knowledge/frontend-deployment' }
        ]
      },
      {
        text: '🔷 金砖大赛 - 区块链后端',
        collapsed: false,
        items: [
          { text: '📖 后端开发总览', link: '/knowledge/blockchain-backend-overview' },
          {
            text: '🔧 区块链平台运维',
            collapsed: true,
            items: [
              { text: 'FISCO BCOS 区块链搭建', link: '/knowledge/fisco-bcos-deployment' },
              { text: '区块链控制台 Console', link: '/knowledge/blockchain-console' },
              { text: 'WeBASE 平台搭建', link: '/knowledge/webase-platform' },
              { text: '区块链节点监控', link: '/knowledge/blockchain-node-monitor' },
              { text: 'Caliper 压力测试', link: '/knowledge/caliper-stress-test' }
            ]
          },
          {
            text: '📝 智能合约开发与测试',
            collapsed: true,
            items: [
              { text: '智能合约考点学习路径', link: '/knowledge/smart-contract-competition-roadmap' },
              { text: '智能合约填空题型训练', link: '/knowledge/smart-contract-fill-blank-training' },
              { text: 'Solidity 基础语法', link: '/knowledge/solidity-basics' },
              { text: 'Solidity 进阶：存储分离', link: '/knowledge/solidity-storage-pattern' },
              { text: 'Solidity 进阶：金融协议', link: '/knowledge/solidity-finance' },
              { text: 'Hardhat 测试框架', link: '/knowledge/hardhat-testing' },
              { text: 'Truffle + Ganache', link: '/knowledge/truffle-ganache' },
              { text: 'Foundry 测试框架', link: '/knowledge/foundry-testing' },
              { text: '智能合约安全', link: '/knowledge/smart-contract-security' },
              { text: 'Solana 合约开发', link: '/knowledge/solana-contract' }
            ]
          },
          {
            text: '☕ Spring Boot 后端开发',
            collapsed: true,
            items: [
              { text: '后端竞赛考点学习路径', link: '/knowledge/backend-competition-roadmap' },
              { text: '后端填空题型训练', link: '/knowledge/backend-fill-blank-training' },
              { text: '项目搭建与配置', link: '/knowledge/springboot-project-setup' },
              { text: 'MyBatis-Plus 实体与 Mapper', link: '/knowledge/mybatis-plus-entity' },
              { text: 'MyBatis-Plus Service 层', link: '/knowledge/mybatis-plus-service' },
              { text: '统一响应与异常处理', link: '/knowledge/springboot-unified-response' },
              { text: '登录认证开发', link: '/knowledge/springboot-login-auth' },
              { text: '登录拦截器', link: '/knowledge/springboot-login-interceptor' },
              { text: '业务 CRUD 实战（上）', link: '/knowledge/springboot-crud-1' },
              { text: '业务 CRUD 实战（下）', link: '/knowledge/springboot-crud-2' },
              { text: '整合 WeBASE-Front', link: '/knowledge/springboot-webase-integration' },
              { text: 'Postman 接口测试', link: '/knowledge/postman-api-testing' }
            ]
          },
          {
            text: '📋 测试文档编写',
            collapsed: true,
            items: [
              { text: '接口文档与测试用例', link: '/knowledge/api-doc-test-case' }
            ]
          }
        ]
      },
      {
        text: 'Vue 3 进阶',
        collapsed: true,
        items: [
          { text: 'Composition API', link: '/knowledge/vue3-composition-api' },
          { text: '&lt;script setup&gt; 语法糖', link: '/knowledge/vue3-script-setup' },
          { text: 'Pinia 状态管理', link: '/knowledge/pinia' },
          { text: 'TypeScript 基础', link: '/knowledge/vue3-typescript' },
          { text: 'Vue Router 4', link: '/knowledge/vue-router4' }
        ]
      },
      {
        text: 'Vue 2 核心',
        collapsed: true,
        items: [
          { text: 'Vue 实例创建', link: '/knowledge/vue-instance' },
          { text: '模板语法', link: '/knowledge/vue-template-syntax' },
          { text: '数据绑定', link: '/knowledge/vue-data-binding' },
          { text: '事件处理', link: '/knowledge/vue-event-handling' },
          { text: '条件渲染', link: '/knowledge/vue-conditional-rendering' },
          { text: '列表渲染', link: '/knowledge/vue-list-rendering' },
          { text: '生命周期', link: '/knowledge/vue-lifecycle' },
          { text: '组件注册', link: '/knowledge/vue-component' },
          { text: 'Vue Router', link: '/knowledge/vue-router' }
        ]
      },
      {
        text: 'axios HTTP',
        collapsed: true,
        items: [
          { text: 'HTTP 请求', link: '/knowledge/axios-http' },
          { text: '拦截器', link: '/knowledge/axios-interceptors' },
          { text: '高级封装', link: '/knowledge/axios-advanced' },
          { text: 'Token 存储', link: '/knowledge/localstorage-token' }
        ]
      },
      {
        text: 'Element UI',
        collapsed: true,
        items: [
          { text: '布局系统', link: '/knowledge/element-ui-layout' },
          { text: '表单组件', link: '/knowledge/element-ui-form' },
          { text: '表格组件', link: '/knowledge/element-ui-table' }
        ]
      },
      {
        text: 'Ant Design Vue 3',
        collapsed: true,
        items: [
          { text: 'Ant Design Vue 3 入门', link: '/knowledge/ant-design-vue3' }
        ]
      },
      {
        text: 'Vite + 工程化',
        collapsed: true,
        items: [
          { text: 'Vite 构建工具', link: '/knowledge/vite' },
          { text: 'Vite 插件系统', link: '/knowledge/vite-plugins' },
          { text: '代码分割与优化', link: '/knowledge/code-splitting' },
          { text: 'Vue CLI 代理', link: '/knowledge/vue-cli-proxy' }
        ]
      },
      {
        text: 'Bootstrap 3',
        collapsed: true,
        items: [
          { text: '栅格系统', link: '/knowledge/bootstrap-grid' },
          { text: '导航条', link: '/knowledge/bootstrap-navbar' },
          { text: '模态框', link: '/knowledge/bootstrap-modal' }
        ]
      },
      {
        text: 'CSS',
        collapsed: true,
        items: [
          { text: 'Flexbox 布局', link: '/knowledge/css-flexbox' },
          { text: '定位', link: '/knowledge/css-position' },
          { text: '盒模型', link: '/knowledge/css-box-model' },
          { text: 'Sass/SCSS', link: '/knowledge/sass-scss' },
          { text: 'Tailwind CSS', link: '/knowledge/tailwind-css' }
        ]
      },
      {
        text: 'JavaScript',
        collapsed: true,
        items: [
          { text: 'FileReader API', link: '/knowledge/filereader' },
          { text: 'Canvas API', link: '/knowledge/canvas-api' },
          { text: 'DOM 操作', link: '/knowledge/dom-manipulation' },
          { text: '表单验证', link: '/knowledge/form-validation' },
          { text: '工具函数', link: '/knowledge/frontend-utils' }
        ]
      },
      {
        text: '数据可视化',
        collapsed: true,
        items: [
          { text: 'ECharts', link: '/knowledge/echarts' }
        ]
      }
    ],
    
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            footer: { selectText: '选择', closeText: '关闭' }
          }
        }
      }
    },
    
    footer: {
      message: '基于 VitePress 构建 | 原创新前端资源',
      copyright: '前端知识库'
    },
    
    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' }
    }
  },
  
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})
