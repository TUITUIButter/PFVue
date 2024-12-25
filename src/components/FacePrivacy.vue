<template>
  <div class="face-evaluation">
    <h1 class="title">面部元素对身份识别影响优先级</h1>
    <div class="top-imgage">
      <img src="/framework.jpg" alt="框架图" class="framework-image">
    </div>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>

    <div class="loss-function">
      <div class="latex" v-html="score"></div>
    </div>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>

    <div class="content">
      <div class="privacy-edit">
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
          <p>结果</p>
          <img src="/cam/p2_res.jpg" alt="结果" class="responsive-image">
        </div>

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
      </div>
      <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="50" color="#8b0012" />
      <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="75" color="#8b0012" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { StarFilled } from '@element-plus/icons-vue'
import { ref } from 'vue';

import katex from "katex"

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const imageUrl = ref('')
const uploadSuccess = ref(false)

const score = ref('');
score.value = katex.renderToString('S_{Grad-CAM}^c = ReLU\\left(\\sum_k \\alpha_k^c A^k\\right)', {
  throwOnError: false
});


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

</script>

<style scoped>
.face-evaluation {
  /* display: flex;
  flex-direction: column;

  width: 100%; */
  margin-bottom: 100px;
  /* overflow-y: hidden; */
}

.title {
  font-size: 24px;
  /* 增大文字大小 */
  margin-bottom: 0px;
}

.top-imgage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.framework-image {
  width: 80%;
  height: auto;
  margin-top: 30px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.loss-function {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 100px;
  gap: 8%;

  overflow: hidden;
}

.latex {
  font-family: 'Cambria Math', 'Microsoft YaHei';
  display: block;
  text-align: center;
  font-size: 16px;
  margin: 3px 0;
  overflow: hidden;
  max-height: 100%;
}

.privacy-edit {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8%;
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
  font-size: 20px;
  font-family: 'Microsoft YaHei';
  text-align: center;
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
  margin: 15px 0;
  /* max-width: 600px; */
  width: 75%;
}


</style>