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
              <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
            <div class="image-container">
              <p>上传图像</p>
              <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
          </div>
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="70" color="#8b0012" />
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
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="70" color="#8b0012" />
        </div>
      </div>

      <el-divider class="divider">
        人脸库匹配
      </el-divider>

      <div class="search">
        <div class="image-container">
          <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="responsive-image" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <p>上传图像</p>
        </div>

        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="70" color="#8b0012" />
        </div>
        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="70" color="#8b0012" />
        </div>
        <div class="image-container">
          <img src="/cam/p2_ori.jpg" alt="原始图像" class="responsive-image">
          <el-progress class="progress" :text-inside="true" :stroke-width="26" :percentage="70" color="#8b0012" />
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

const imageUrl = ref('/cam/p2_ori.jpg')
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