<template>
  <div class="face-evaluation">
    <h1 class="title">人脸匹配距离</h1>
    <div class="description">
      <p>
        人脸识别器<i>R</i> 采用 FaceNet，首先使用 MTCNN 将人脸调整为 160 * 160 像素的分辨率，然后通过多个卷积层输出 512 维人脸特征向量。
        通过计算两个人脸特征向量之间的欧氏距离，可以得到人脸匹配的相似度分数。
      </p>
    </div>

    <div class="content">

      <div class="image-distance">
        <div class="image-progress">
          <div class="images-up">
            <div class="image-container">
              <p>上传图像</p>
              <el-upload class="avatar-uploader" action="/api/upload_a"
                :show-file-list="false" :on-success="handleAvatarSuccess_a" :before-upload="beforeAvatarUpload"
                :auto-upload="true" accept=".jpg, .jpeg, .png" name="image" >
                <img v-if="imageUrl_a" :src="imageUrl_a" class="responsive-image" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
            <div class="image-container">
              <p>上传图像</p>
              <el-upload class="avatar-uploader" action="/api/upload_b"
                :show-file-list="false" :on-success="handleAvatarSuccess_b" :before-upload="beforeAvatarUpload"
                :auto-upload="true" accept=".jpg, .jpeg, .png" name="image" >
                <img v-if="imageUrl_b" :src="imageUrl_b" class="responsive-image" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
          </div>
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="percentage * 100" color="#8b0012" :format="formatPercentage" />
        </div>

        <div class="image-progress">
          <div class="images-up">
            <div class="image-container">
              <p>示例图像</p>
              <img src="/cam/p2_ori.jpg" alt="示例图像" class="responsive-image">
            </div>

            <div class="image-container">
              <p>示例图像</p>
              <img src="/cam/p2_ori.jpg" alt="示例图像" class="responsive-image">
            </div>
          </div>
          <el-progress class="progress" :text-inside="true" :stroke-width="26" percentage="69" color="#8b0012" :format="formatPercentage" />
        </div>
      </div>

      <el-divider class="divider">
        人脸库匹配
      </el-divider>

      <div class="search">
        <div class="image-container">
          <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false" :on-success="handleAvatarSuccess_c" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl_c" :src="imageUrl_c" class="responsive-image" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <p>上传图像</p>
        </div>

        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="percentage_l1 * 100" color="#8b0012" :format="formatPercentage" />
        </div>
        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="percentage_l2 * 100" color="#8b0012" :format="formatPercentage" />
        </div>
        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="percentage_l3 * 100" color="#8b0012" :format="formatPercentage" />
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import axios from 'axios';

const imageUrl_a = ref('')
const imageUrl_b = ref('')
const imageUrl_c = ref('')
const percentage = ref(0.0)

const percentage_l1 = ref(0.8)
const percentage_l2 = ref(0.765)
const percentage_l3 = ref(0.354)

const handleAvatarSuccess_a: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl_a.value = URL.createObjectURL(uploadFile.raw!)
  get_dis()
}

const handleAvatarSuccess_b: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl_b.value = URL.createObjectURL(uploadFile.raw!)
  get_dis()
}

const handleAvatarSuccess_c: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl_c.value = URL.createObjectURL(uploadFile.raw!)
}

function get_dis() {
  if (imageUrl_a.value === '' || imageUrl_b.value === '') {
    return
  }
  
  axios.get('/api/cos_dis').then((res) => {
    console.log(res.data.cos_dis)
    percentage.value = res.data.cos_dis
  })
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

function formatPercentage(percentage: number) {
  return (percentage / 100).toFixed(2);
}

</script>

<style scoped>
.face-evaluation {
  margin-bottom: 10px;
}

.title {
  font-size: 24px;
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
  width: 100%;
  font-size: 20px;
  font-family: 'Times New Roman', 'Microsoft YaHei';
  line-height: 1.5;
  margin-left: 10px;
}

.description i {
  font-family: 'Cambria Math', 'Microsoft YaHei';
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

.image-distance {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.image-progress {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: 49%;
  margin: 0 auto;
}

.images-up {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  gap: 5%;
  align-items: stretch;
}

.image-container {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 40%;
}

.progress {
  margin: 20px 0;
  /* max-width: 600px; */
  width: 75%;
}


.search {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5%;
  width: 100%;
  margin: 0 auto;
}

.responsive-image {
  width: 100%;
  height: auto;
  max-width: 350px;
  max-height: 350px;
  object-fit: cover;
}

.avatar-uploader {
  width: 100%;
  /* height: auto; */
  max-width: 350px;
  max-height: 350px;
  aspect-ratio: 1 / 1;
  /* 宽高比为1:1 */

  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  display: flex;
  justify-content: center;
  align-items: center;
  /* 垂直居中 */

  box-sizing: border-box;
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

.divider {
  margin: 20px 0;
}
</style>