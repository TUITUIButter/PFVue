<template>
  <div class="face-evaluation">
    <h1 class="title">面部属性推断</h1>
    <div class="content">
      <div class="image-grid">
        <div class="row" :class="{ 'single-row': !uploadSuccess }">
          <div class="image-container">
            <p>上传用户图像</p>
            <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
          <div v-if="uploadSuccess" class="chart-container">
            <p>数据</p>
            <AttrChart :chartData="data" class="chart"/>
          </div>
        </div>
        <el-button v-if="uploadSuccess" class="clear-button" @click="clearUpload">清除</el-button>
      </div>

      <el-divider class="divider">
        示例
      </el-divider>

      <div class="image-grid">
        <div class="row">
          <div class="image-container">
            <p>原始图像</p>
            <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          </div>
          <div class="chart-container">
            <p>数据</p>
            <AttrChart :chartData="data" class="chart"/>
          </div>
        </div>

        <div class="row">
          <div class="image-container">
            <img src="/cam/p1_ori.jpg" alt="原始图像" class="responsive-image">
          </div>
          <div class="chart-container">
            <AttrChart :chartData="data" class="chart"/>
          </div>
        </div>
      </div>
      <el-divider class="divider">
        end
      </el-divider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

import AttrChart from './AttrChart.vue'

const imageUrl = ref('')
const uploadSuccess = ref(true)
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  uploadSuccess.value = true
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const clearUpload = () => {
  imageUrl.value = ''
  uploadSuccess.value = false
}

const data = ref([
  { name: 'Male', value: 0.9 },
  { name: 'Young', value: 0.8 },
  { name: 'Arched_Eyebrows', value: 0.76 },
  { name: 'Bushy_Eyebrows', value: 0.23 },
  { name: 'Wavy_Hair', value: 0.2 },
  { name: 'Straight_Hair', value: 0.80001 },
  { name: 'Big_Nose', value: 0.01 },
  { name: 'Pointy_Nose', value: 0.99 },
  { name: 'Big_Lips', value: 0.5 },
  { name: 'Narrow_Eyes', value: 0.8 },
  { name: 'Bags_Under_Eyes', value: 0.2 },
]);

</script>

<style scoped>
.face-evaluation {
  margin-bottom: 100px;
}

.center-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 75%;
  height: auto;
}

.title {
  font-size: 24px;
  /* 增大文字大小 */
  margin-bottom: 0px;
}

.top-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 10px;
  /* 缩小上方边距 */
  margin-bottom: 0px;
}

.description {
  width: 25%;
  font-size: 20px;
  font-family: 'Times New Roman', 'Microsoft YaHei';
  line-height: 1.5;
  margin-left: 10px;
}

.description i {
  font-family: 'Cambria Math', 'Microsoft YaHei';
}

.right-image {
  width: 70%;
  height: auto;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* gap: 20px; */
  width: 80vw;
  margin: 0 auto;
}

.image-grid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  /* padding-bottom: 20px; */
  /* margin-right: 200px;  */
  /* width: 100%; */
}

.row {
  display: flex;
  align-items: stretch; /* 子元素高度一致 */
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding-bottom: 20px;
  /* height: 100%; */
}

.single-row {
  display: flex;
  align-items: stretch; /* 子元素高度一致 */
  justify-content: center;
  gap: 10px;
  width: 100%;
  /* height: 100%; */
}

.image-container {
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  text-align: center;
  width: 15%;
  /* height: 100%; */
}

.chart-container {
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  text-align: center;
  width: 30%;
  flex: auto; /* 自动与其他子元素高度保持一致 */
  /* height: 100%; */
  display: flex;
  flex-direction: column;
}

.responsive-image{
  width: 100%;
  height: auto;
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
}

.avatar-uploader{
  width: 100%;
  /* height: auto; */
  max-width: 300px;
  max-height: 300px;
  aspect-ratio: 1 / 1; /* 宽高比为1:1 */

  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  display: flex;
  justify-content: center;
  align-items: center;    /* 垂直居中 */

  box-sizing: border-box; /* 让border算入宽度和高度 */
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: auto;
  max-width: 300px;
  max-height: 300px;
  text-align: center;
  line-height: 300px;
  
}

.clear-button {
  margin-top: 0px;
  /* align-self: center; */
  background-color: #8b0012;
  border-color: #8b0012;
  color: white;
}

.chart{
  width: 100%;
  /* height: 100%; */
  min-width: 200px;
  min-height: 100px;
  /* max-width: 800px;
  max-height: 500px; */

  margin-left: 30px;
  padding-right: 30px;
  flex-grow: 1; /* 占据父控件剩余的全部高度 */
}
</style>