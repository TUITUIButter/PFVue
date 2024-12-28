import 'element-plus/dist/index.css'
import "@/assets/text/text.css";

import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'

// 引入echarts
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'

// 引入axios
import axios from 'axios'
// 设置axios的默认baseURL
axios.defaults.baseURL = 'http://127.0.0.1:5000'

const app = createApp(App)

// 使用组件
app.component('e-charts', Echarts)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts
// 全局挂载 axios
app.config.globalProperties.$axios = axios

app.use(ElementPlus)

app.mount('#app')