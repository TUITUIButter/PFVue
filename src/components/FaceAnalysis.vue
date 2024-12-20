<template>
  <div class="face-evaluation">
    <h1 class="title">面部元素对身份识别影响优先级</h1>
    <div class="top-section">
      <div class="description">
        <p>
          我们首先计算卷积层在 softmax 之前的特征激活图 <i>A<sup>k</sup></i> 的类别 <i>c</i> 的梯度分数 <i>y <sup>c</sup></i>。
          通过对反向传播梯度的宽度和高度进行全局平均池化，得到重要性权重 <i>α<sub>k</sub><sup>c</sup></i>：
        </p>
        <div class="latex" v-html="ak"></div>
        <p>
          最终的 CAM 图像通过加权求和得到：
        </p>
        <div class="latex" v-html="score"></div>
      </div>
      <img src="/cam/part1.png" alt="框架图" class="right-image">
    </div>
    <hr>
    <div>
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
          <div v-if="uploadSuccess" class="image-container">
            <p>人脸解析器结果</p>
            <img src="/cam/p2_parse.jpg" alt="人脸解析器结果" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>CAM图像</p>
            <img src="/cam/p2_cam.jpg" alt="CAM图像" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>结果</p>
            <img src="/cam/p2_res.jpg" alt="结果" class="responsive-image">
          </div>
          <div v-if="uploadSuccess" class="image-container">
            <p>数据</p>
            <ScoreChart :chartData="data"/>
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
          <div class="image-container">
            <p>数据</p>
            <ScoreChart :chartData="data"/>
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
          <div class="image-container">
            <ScoreChart :chartData="data"/>
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
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

import ScoreChart from './ScoreChart.vue'

const ak = ref('');
ak.value = katex.renderToString('\\alpha_k^c = \\frac{1}{Z} \\sum_i \\sum_j \\frac{\\partial y^c}{\\partial A_{ij}^k}', {
  throwOnError: false
});
const score = ref('');
score.value = katex.renderToString('S_{Grad-CAM}^c = ReLU\\left(\\sum_k \\alpha_k^c A^k\\right)', {
  throwOnError: false
});

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
  { name: 'Hair', value: 120 },
  { name: 'Eyebrows', value: 200 },
  { name: 'Eyes', value: 150 },
  { name: 'Mouth', value: 80 },
  { name: 'Nose', value: 70 },
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

.latex {
  font-family: 'Cambria Math', 'Microsoft YaHei';
  display: block;
  text-align: center;
  font-size: 19px;
  margin: 5px 0;
}

.right-image {
  width: 70%;
  height: auto;
}

.image-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
  margin-left: 8%;
  margin-right: 8%;
}

/* .divider {
  margin: 20px
} */

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.single-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.image-container {
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  text-align: center;
}

.responsive-image, .avatar{
  width: 300px;
  height: 300px;
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
}

.clear-button {
  margin-top: 0px;
  /* align-self: center; */
  background-color: #8b0012;
  border-color: #8b0012;
  color: white;
}
</style>


<style>
.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 300px;
  height: 300px;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
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
</style>