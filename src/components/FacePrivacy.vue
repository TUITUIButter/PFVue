<template>
  <div class="face-evaluation">
    <h1 class="title">完整隐私编辑Pipline</h1>
    <div class="top-img">
      <img src="/framework.jpg" alt="框架图" class="framework-image">
    </div>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>

    <div class="loss-function">
      <div class="latex">
        $$\mathcal{L}_{appr}=\|\min \left(P_{skin}\left(I_o\right)-P_{attr}\left(I_p\right),0\right)\odot (I_p-I_o) \|_2^2 $$
      </div>
      <div class="latex">
        $$\mathcal{L}_{attr}=\frac{1}{K_{attr}} \sum_{k=1}^{K_{attr}}D_{KL} (C_{k}(I_p),L_t^k ) $$
      </div>
      <div class="latex">
        $$\mathcal{L}_{ID}=\triangle_{\cos}(R(I_p),R(I_o)) $$
      </div>
      <div class="latex">
        $$\mathcal{L}_{mask}= \|\max \left(P_{attr}\left(I_o\right)+P_{attr}\left(I_p\right),1\right)-P_{attr}(I_p) \|_2^2 $$
      </div>

      <div class="latex">
        $$\mathcal{L}_{total}=\lambda_{appr} \mathcal{L}_{appr}+\lambda_{attr} \mathcal{L}_{attr}+ \lambda_{ID} \mathcal{L}_{ID}+\lambda_{mask} \mathcal{L}_{mask} $$
      </div>
    </div>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>

    <div class="content">
      <div class="privacy-edit">
        <div class="image-container">
          <p>上传待隐私编辑图像</p>
          <el-upload class="avatar-uploader" action="/api/pipline"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
            :auto-upload="true" accept=".jpg, .jpeg, .png" name="image" 
            :data="{ imageName: 'privacy_ori.jpg' }">
            <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </div>

        <div v-if="uploadSuccess" class="image-container">
          <p>结果</p>
          <img :src="imageRes" alt="结果" class="responsive-image">
        </div>

        <div v-if="uploadSuccess" class="image-container">
          <p>结果</p>
          <img :src="imageRes" alt="结果" class="responsive-image">
        </div>

        <div class="image-container">
          <p>上传匹配图像</p>
          <el-upload class="avatar-uploader" action="/api/upload"
                :show-file-list="false" :on-success="handleAvatarSuccess_compare" :before-upload="beforeAvatarUploadCompare"
                :auto-upload="true" accept=".jpg, .jpeg, .png" name="image"
                :data="{ imageName: 'privacyCompare.jpg'}" >
                <img v-if="imageUrl_compare" :src="imageUrl_compare" class="responsive-image" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
        </div>
      </div>
      <!-- <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="50" color="#8b0012" /> -->
      <div class="privacy-edit">
        <el-progress v-if="uploadSuccess" class="progress" :text-inside="true" :stroke-width="26" :percentage="face_distance_1 * 100" color="#8b0012" :format="formatPercentage" />
        <el-progress v-if="uploadSuccess" class="progress" :text-inside="true" :stroke-width="26" :percentage="face_distance_2 * 100" color="#8b0012" :format="formatPercentage" />
      </div>
    </div>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>
  </div>
</template>

<script lang="ts" setup>
import { StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

import { onMounted, ref } from 'vue';
import axios from 'axios';

const imageUrl = ref('')
const imageRes = ref('')
const imageUrl_compare = ref('')
const uploadSuccess = ref(false)
const face_distance_1 = ref(0)
const face_distance_2 = ref(0)

onMounted(() => {
  setTimeout(() => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }, 100);
});

const handleAvatarSuccess: UploadProps['onSuccess'] = async (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  const ResResponse = await axios.get('/api/static/upload/privacyRes.jpg', { responseType: 'blob' });
  imageRes.value = URL.createObjectURL(ResResponse.data);

  face_distance_1.value = response.cos_dis
  uploadSuccess.value = true
}

const handleAvatarSuccess_compare: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl_compare.value = URL.createObjectURL(uploadFile.raw!)
  if (uploadSuccess.value) {
    axios.get('/api/cos_dis?image_a=privacyCompare.jpg&image_b=privacyRes.jpg').then((res) => {
      console.log(res.data.cos_dis)
      face_distance_2.value = res.data.cos_dis
    })
  }
}

const validateAvatarFile = (rawFile) => {  
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/png') {  
    ElMessage.error('Avatar picture must be JPG/JPEG/PNG format!');  
    return false;  
  } else if (rawFile.size / 1024 / 1024 > 10) {  
    ElMessage.error('Avatar picture size can not exceed 10MB!');  
    return false;  
  }  
  return true;  
}  

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {  
  const isValid = validateAvatarFile(rawFile);  
  if (isValid) {   
    imageUrl.value = URL.createObjectURL(rawFile);  
  }  
  return isValid;  
}  

const beforeAvatarUploadCompare: UploadProps['beforeUpload'] = (rawFile) => {  
  return validateAvatarFile(rawFile); // 只需验证文件  
} 

function formatPercentage(percentage: number) {
  return (percentage / 100).toFixed(2);
}


</script>

<style scoped>
.face-evaluation {
  margin-bottom: 10px;
  width: 100%;
}

.latex {
  height: auto;
  width: 100%;
  font-size: 0.8em;
}

.title {
  font-size: 24px;
  /* 增大文字大小 */
  margin-bottom: 10px;
}

.top-img {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 15%;
  height: auto;
}

.framework-image {
  width: 100%;
  height: auto;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* width: 100%; */
  margin: 0 auto;
}

.loss-function {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  /* gap: 8%; */
}

.privacy-edit {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 3%;
  margin: 0 0%;
}

.avatar-uploader {
  width: 100%;
  /* height: auto; */
  max-width: 300px;
  max-height: 300px;
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
  /* 让border算入宽度和高度 */
}

.image-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  width: 20%;
}

.responsive-image {
  width: 100%;
  height: auto;
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
}

.progress {
  margin: 30px 0;
  /* max-width: 600px; */
  width: 43%;
}
</style>