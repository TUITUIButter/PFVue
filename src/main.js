import 'element-plus/dist/index.css'
import "@/assets/text/text.css";

import katex from 'katex' // https://katex.org/docs
import renderMathInElement from 'katex/contrib/auto-render/auto-render.js'
import 'katex/dist/katex.min.css';

import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'

// 引入echarts
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'

const app = createApp(App)

// 使用组件
app.component('e-charts', Echarts)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts

app.use(ElementPlus)
app.use(katex)
app.mount('#app')