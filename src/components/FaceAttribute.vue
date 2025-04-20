<template>
  <div class="face-evaluation">
    <h1 class="title">面部属性推断</h1>
    <div class="content">
      <div class="image-grid">
        <div class="row" :class="{ 'single-row': !uploadSuccess }">
          <div class="image-container">
            <p>上传用户图像</p>
            <el-upload class="avatar-uploader" action="/api/attr"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
              :auto-upload="true" accept=".jpg, .jpeg, .png" name="image" >
              <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
          <div v-if="uploadSuccess" class="chart-container">
            <p>数据</p>
            <ChartAttribute :chartData="data" class="chart"/>
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
            <img src="/attr/ex2.jpg" alt="原始图像" class="responsive-image">
          </div>
          <div class="chart-container">
            <p>数据</p>
            <ChartAttribute :chartData="data_example_1" class="chart"/>
          </div>
        </div>

        <div class="row">
          <div class="image-container">
            <img src="/attr/ex3.jpg" alt="原始图像" class="responsive-image">
          </div>
          <div class="chart-container">
            <ChartAttribute :chartData="data_example_2" class="chart"/>
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

import ChartAttribute from './ChartAttribute.vue'

const imageUrl = ref('')
const uploadSuccess = ref(false)
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  // 更新 data
  data.value = [
    { name: 'Male', value: response.male },
    { name: 'Young', value: response.young },
    { name: 'Arched_Eyebrows', value: response.arched_eyebrows },
    { name: 'Bushy_Eyebrows', value: response.bushy_eyebrows },
    { name: 'Wavy_Hair', value: response.wavy_hair },
    { name: 'Straight_Hair', value: response.straight_hair },
    { name: 'Big_Nose', value: response.big_nose },
    { name: 'Pointy_Nose', value: response.pointy_nose },
    { name: 'Big_Lips', value: response.big_lips },
    { name: 'Narrow_Eyes', value: response.narrow_eyes },
    { name: 'Bags_Under_Eyes', value: response.bags_under_eyes },
  ];

  uploadSuccess.value = true
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG/JPEG/PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Avatar picture size can not exceed 10MB!')
    return false
  }
  return true
}

const clearUpload = () => {
  imageUrl.value = ''
  uploadSuccess.value = false
}

const data = ref([
  { name: 'Male', value: 1.0 },
  { name: 'Young', value: 0.77 },
  { name: 'Arched_Eyebrows', value: 0.03 },
  { name: 'Bushy_Eyebrows', value: 0.23 },
  { name: 'Wavy_Hair', value: 0.0 },
  { name: 'Straight_Hair', value: 0.83 },
  { name: 'Big_Nose', value: 0.31 },
  { name: 'Pointy_Nose', value: 0.15 },
  { name: 'Big_Lips', value: 0.16 },
  { name: 'Narrow_Eyes', value: 0.52 },
  { name: 'Bags_Under_Eyes', value: 0.07 },
]);

const data_example_2 = ref([
  { name: 'Male', value: 1.0 },
  { name: 'Young', value: 0.77 },
  { name: 'Arched_Eyebrows', value: 0.03 },
  { name: 'Bushy_Eyebrows', value: 0.23 },
  { name: 'Wavy_Hair', value: 0.0 },
  { name: 'Straight_Hair', value: 0.83 },
  { name: 'Big_Nose', value: 0.31 },
  { name: 'Pointy_Nose', value: 0.15 },
  { name: 'Big_Lips', value: 0.16 },
  { name: 'Narrow_Eyes', value: 0.52 },
  { name: 'Bags_Under_Eyes', value: 0.07 },
]);

const data_example_1 = ref([
  { name: 'Male', value: 0.04 },
  { name: 'Young', value: 1.0 },
  { name: 'Arched_Eyebrows', value: 0.14 },
  { name: 'Bushy_Eyebrows', value: 0.75 },
  { name: 'Wavy_Hair', value: 0.08 },
  { name: 'Straight_Hair', value: 0.62 },
  { name: 'Big_Nose', value: 0.10 },
  { name: 'Pointy_Nose', value: 0.13 },
  { name: 'Big_Lips', value: 0.47 },
  { name: 'Narrow_Eyes', value: 0.03 },
  { name: 'Bags_Under_Eyes', value: 0.02 },
]);

</script>

<style scoped>
.face-evaluation {
  margin-bottom: 10px;
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