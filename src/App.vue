<template>
  <div class="common-layout">
    <el-container style="height: 100%;">
      <el-header class="custom-header">人脸隐私保护系统演示</el-header>
      <el-container class="custom-down">
        <el-aside width="12%">
          <el-menu :default-active="activeMenu" @select="handleMenuSelect" class="custom-menu">
            <el-menu-item index="1" class="menu-item">
              <el-icon><files /></el-icon>
              <span>人脸库</span>
            </el-menu-item>
            <el-menu-item index="2" class="menu-item">
              <el-icon><avatar /></el-icon>
              <span>人脸解析</span>
            </el-menu-item>
            <el-menu-item index="3" class="menu-item">
              <el-icon>
                <histogram />
              </el-icon>
              <span>人脸属性</span>
            </el-menu-item>
            <el-menu-item index="4" class="menu-item">
              <el-icon>
                <histogram />
              </el-icon>
              <span>人脸匹配</span>
            </el-menu-item>
            <el-menu-item index="5" class="menu-item">
              <el-icon>
                <icon-switch />
              </el-icon>
              <span>隐私编辑</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main-content">
          <!-- 根据选中的菜单显示不同的组件 -->
          <FaceLibrary v-if="activeMenu === '1'" />
          <FaceAnalysis v-if="activeMenu === '2'" />
          <FaceEvaluation v-if="activeMenu === '3'" />
          <FaceDistance v-if="activeMenu === '4'" />
          <FacePrivacy v-if="activeMenu === '5'" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Files,
  Histogram,
  Avatar,
  Switch as IconSwitch
} from '@element-plus/icons-vue'

import { ref } from 'vue'
import FaceLibrary from './components/FaceLibrary.vue'
import FaceAnalysis from './components/FaceAnalysis.vue'
import FaceEvaluation from './components/FaceAttribute.vue'
import FaceDistance from './components/FaceDistance.vue'
import FacePrivacy from './components/FacePrivacy.vue'


const activeMenu = ref('1') // 设置默认选中的菜单项

// 处理菜单项选择，更新显示的内容
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 100vh;
  overflow: hidden;
  /* 使布局充满整个视口 */
}

.el-container {
  height: 100%;
  /* overflow: hidden; */
  /* 确保el-container也占满高度 */
}

.custom-header {
  background-color: #8b0012;
  /* 自定义背景颜色 */
  color: rgb(255, 255, 255);
  /* 自定义字体颜色 */
  font-size: 24px;
  font-family: 'cuyuan';
  /* 自定义字体大小 */
  text-align: left;
  /* 文本居中 */
  line-height: 70px;
  /* 设置行高以垂直居中 */
  height: 70px;
}

.custom-down{
  height: calc(100% - 70px);
}

/* 菜单项样式 */  
.menu-item {  
  margin-bottom: 5px; /* 设置每个菜单项之间的间隔 */
  font-size: 16px;
  font-family: 'Microsoft YaHei';
}  

.custom-menu {  
  background-color: #ffffff; /* 设置菜单的背景色 */  
  border-right: 0.5px solid #c8c8c8; /* 设置右边框为灰色 */  
  height: 100%; /* 确保菜单的高度与容器相同 */
  box-sizing: border-box; /* 确保边框不影响整体的尺寸计算 */
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 3px;
  overflow: hidden;
}

/* 选中项和悬停项的颜色可以单独设置 */  
.custom-menu .el-menu-item.is-active {  
  background-color: #e9e9e9; /* 选中项背景颜色 */  
  color: #000000; /* 选中项字体颜色 */  
  border-radius: 6px; /* 设置圆角 */
}

/* 悬停项的样式 */  
.custom-menu .el-menu-item:hover {  
  background-color: #e9e9e9; /* 悬停项背景颜色 */  
  border-radius: 6px; /* 悬停项也加上圆角 */  
}  

.main-content {
  overflow: auto; /* 仅在主内容区域启用垂直滚动条 */
  margin: 0 0;
  padding: 10px 20px 20px 15px;
  height: 100%;
}
</style>