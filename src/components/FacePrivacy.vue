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
          <p>上传匹配图像</p>
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
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

import { onMounted, ref } from 'vue';

const imageUrl = ref('')
const uploadSuccess = ref(false)

onMounted(() => {
  setTimeout(() => {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }, 100);
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
  margin: 0 10%;
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