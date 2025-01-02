<template>
  <div ref="chartDom"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

// 接收外部数据  
const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

console.log(props.chartData);

const chartDom = ref(null);
let chartInstance = null;


// 初始化ECharts实例并设置配置项（这里以折线图为例，但可灵活替换）
onMounted(async () => {
  await nextTick(); // 确保DOM已经渲染完成

  // 延迟初始化图表
  setTimeout(() => {

    chartInstance = echarts.init(chartDom.value);
    const option = {
      tooltip: {},
      xAxis: {
        type: 'category', // 改为类目轴  
        nameLocation: 'middle',
        nameGap: 5,
        data: props.chartData.map(item => item.name), // 这里将数据移到 x 轴  
        axisLine: {
          show: true, // 不显示横坐标轴线  
        },
        axisTick: {
          show: false, // 不显示刻度线  
        },
        splitLine: {
          show: false, // 不显示x轴网格线  
        },
        axisLabel: {
          interval: 0, // 强制显示所有标签  
        },
      },
      yAxis: {
        type: 'value', // 改为数值轴  
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: {
          show: false, // 不显示纵坐标轴线  
        },
        axisTick: {
          show: false, // 不显示刻度线  
        },
        splitLine: {
          show: false, // 不显示y轴网格线  
        },
      },
      series: [{
        name: '数据',
        type: 'bar',
        data: props.chartData.map(item => item.value),
        barWidth: '40%', // 调整柱子宽度  
        itemStyle: {
          borderRadius: [5, 5, 0, 0], // 只有顶部圆角  
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [ // 设置渐变色，方向调整为纵向  
            // { offset: 0, color: '#f3e6e7' },
            { offset: 0, color: '#8b0012' },
            { offset: 1, color: '#8b0012' },
          ]),
        },
        label: {
          show: true, // 显示标签  
          position: 'top', // 标签位置在顶部  
          formatter: function (params) {
            return params.value.toFixed(2); // 自定义显示的内容，只显示两位小数
          },
        },
      }],

      grid: {
        left: '5%',
        right: '5%',  // 调整图表位置
        bottom: '3%',
        top: '10%',
        containLabel: true
      }
    };
    chartInstance.setOption(option);
  }, 100);

  // 窗口大小改变时重新调整图表大小  
  window.addEventListener('resize', () => {
    chartInstance.resize();
  });

  // 清理事件监听器  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
      chartInstance.resize();
    });
  });
});

// 销毁ECharts实例
onUnmounted(() => {
  if (chartInstance != null && chartInstance.dispose) {
    chartInstance.dispose();
  }
});
</script>
