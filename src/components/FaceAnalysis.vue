<template>
  <div class="face-evaluation">
    <h1 class="title">面部元素对身份识别影响优先级</h1>
    <div class="top-section">
      <div class="description">
        <p>
          我们首先计算卷积层在 softmax 之前的特征激活图 <i>A<sup>k</sup></i> 的类别 <i>c</i> 的梯度分数 <i>y <sup>c</sup></i>。
          通过对反向传播梯度的宽度和高度进行全局平均池化，得到重要性权重 <i>α<sub>k</sub><sup>c</sup></i>：
        </p>
        <div class="latex">
          $$ \alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A_{ij}^k} $$
        </div>
        <p>
          最终的 CAM 图像通过加权求和得到：
        </p>
        <div class="latex">
          $$ S_{Grad-CAM}^c = ReLU\left(\sum_k \alpha_k^c A^k\right) $$
        </div>
      </div>
      <img src="/cam/part1.png" alt="框架图" class="right-image">
    </div>
    <hr>
    <div>
      <div class="image-grid">
        <div class="row" :class="{ 'single-row': !uploadSuccess }">
          <div class="image-container">
            <p>上传用户图像</p>
            <el-upload class="avatar-uploader" action="/api/cam_image"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
              :auto-upload="true" accept=".jpg, .jpeg, .png" name="image" >
              <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>人脸解析器结果</p>
            <img :src="parsedFaceImgUrl" alt="人脸解析器结果" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>CAM图像</p>
            <img :src="camImgUrl" alt="CAM图像" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>结果</p>
            <img :src="resultImgUrl" alt="结果" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="chart-container">
            <p>数据</p>
            <ChartScore :chartData="data" class="chart"/>
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
          <div class="image-container">
            <p>人脸解析器结果</p>
            <img src="/cam/p2_parse.jpg" alt="人脸解析器结果" class="responsive-image">
          </div>
          <div class="image-container">
            <p>CAM图像</p>
            <img src="/cam/p2_cam.jpg" alt="CAM图像" class="responsive-image">
          </div>
          <div class="image-container">
            <p>结果</p>
            <img src="/cam/p2_res.jpg" alt="结果" class="responsive-image">
          </div>
          <div class="chart-container">
            <p>数据</p>
            <ChartScore :chartData="data_example_1" class="chart"/>
          </div>
        </div>

        <div class="row">
          <div class="image-container">
            <img src="/cam/p1_ori.jpg" alt="原始图像" class="responsive-image">
          </div>
          <div class="image-container">
            <img src="/cam/p1_parse.jpg" alt="人脸解析器结果" class="responsive-image">
          </div>
          <div class="image-container">
            <img src="/cam/p1_cam.jpg" alt="CAM图像" class="responsive-image">
          </div>
          <div class="image-container">
            <img src="/cam/p1_res.jpg" alt="结果" class="responsive-image">
          </div>
          <div class="chart-container">
            <ChartScore :chartData="data_example_2" class="chart"/>
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

import ChartScore from './ChartScore.vue'
import axios from 'axios';

onMounted(() => {
  setTimeout(() => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }, 100);
});

// const baseUrl= process.env.VUE_APP_BASE_URL;
// console.log(process.env.VUE_APP_BASE_URL);
const imageUrl = ref('')
const uploadSuccess = ref(false)
const parsedFaceImgUrl = ref('')
const camImgUrl = ref('')
const resultImgUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = async (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  try {
    const parsedFaceResponse = await axios.get('/api/static/processed/parsed_face_img.jpg', { responseType: 'blob' });
    parsedFaceImgUrl.value = URL.createObjectURL(parsedFaceResponse.data);

    const camResponse = await axios.get('/api/static/processed/visualization_all.jpg', { responseType: 'blob' });
    camImgUrl.value = URL.createObjectURL(camResponse.data);

    const resultResponse = await axios.get('/api/static/processed/visualization.jpg', { responseType: 'blob' });
    resultImgUrl.value = URL.createObjectURL(resultResponse.data);

    // 更新 data
    data.value = [
      { name: 'Hair', value: response.hair },
      { name: 'Eyebrows', value: response.eyebrows },
      { name: 'Eyes', value: response.eyes },
      { name: 'Mouth', value: response.mouth },
      { name: 'Nose', value: response.nose },
    ];
  } catch (error) {
    ElMessage.error('获取图像失败');
  }

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
  parsedFaceImgUrl.value = ''
  camImgUrl.value = ''
  resultImgUrl.value = ''
}

const data = ref([
  { name: 'Hair', value: 120 },
  { name: 'Eyebrows', value: 200 },
  { name: 'Eyes', value: 150 },
  { name: 'Mouth', value: 80 },
  { name: 'Nose', value: 70 },
]);

const data_example_1 = ref([
  { name: 'Hair', value: 0.03 },
  { name: 'Eyebrows', value: 0.16 },
  { name: 'Eyes', value: 0.20 },
  { name: 'Mouth', value: 0.32 },
  { name: 'Nose', value: 0.28 },
]);

const data_example_2 = ref([
  { name: 'Hair', value: 0.08 },
  { name: 'Eyebrows', value: 0.16 },
  { name: 'Eyes', value: 0.21 },
  { name: 'Mouth', value: 0.27 },
  { name: 'Nose', value: 0.28 },
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
  width: 30%;
  font-size: 17px;
  font-family: 'Times New Roman', 'Microsoft YaHei';
  line-height: 1.5;
  margin-left: 10px;
}

.description i {
  font-family: 'Cambria Math', 'Microsoft YaHei';
}

.latex {
  font-family: 'Cambria Math', 'Microsoft YaHei';
  display: block;
  text-align: center;
  font-size: 16px;
  margin: 0 0;
}

.right-image {
  width: 70%;
  height: auto;
}

.image-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* padding-bottom: 20px; */
  margin-left: 50px;
  margin-right: 50px; 

  /* width: 100%; */
}

.row {
  display: flex;
  align-items: stretch; /* 子元素高度一致 */
  justify-content: space-between;
  gap: 10px;
  width: 100%;
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
  padding-left: 10px;
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

  padding-left: 0;
  margin-right: 0;
  flex-grow: 1; /* 占据父控件剩余的全部高度 */
}
</style>