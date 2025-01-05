<template>
  <div>
    <h1 class="title">人脸库</h1>
    <div class="top-section">
      <p>人脸库来源于FFHQ与VGGFaceHQ的共一万两千张人脸图像。在两个数据集上，分别随机选择了1000对相同身份的人脸对和2000对不同身份的人脸对进行人脸隐私保护操作与识别验证。</p>
    </div>
    <div class="image-grid">
      <div v-for="(image, index) in paginatedImages" :key="index" class="image-item">
        <img :src="image" @click="viewImage(image)" />
      </div>
    </div>
    <div class="pagination">
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </button>
      </div>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span> <!-- 显示页数信息 -->
    </div>
    <transition name="el-fade-in">
      <div v-if="selectedImage" class="modal" @click="closeModal">
        <img :src="selectedImage" class="modal-content" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import {
  ArrowRightBold,
  ArrowLeftBold
} from '@element-plus/icons-vue'

// const imagePath_1 = '/people.jpg'; // 使用相对路径
// const imagePath_2 = '/draw.jpg'; // 使用相对路径
// const imagePaths_1 = Array(15).fill(imagePath_1); // 生成包含 10 个相同元素的数组
// const imagePaths_2 = Array(15).fill(imagePath_2); // 生成包含 10 个相同元素的数组
// const imagePaths = imagePaths_1.concat(imagePaths_2); // 合并两个数组

// // 打乱数组顺序
// imagePaths.sort(() => Math.random() - 0.5);

const images = ref([]);  

// 使用组合式 API 生成图像名称  
for (let i = 1; i <= 50; i++) {  
  // 格式化图像名称为三位数格式  
  const imageName = '/lib/' + String(i).padStart(3, '0') + '.jpg';
  images.value.push(imageName);  
  // console.log(imageName);
}

// const images = ref<string[]>(imagePaths);

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(images.value.length / itemsPerPage));

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return images.value.slice(start, end);
});

const selectedImage = ref<string | null>(null);

const viewImage = (image: string) => {
  selectedImage.value = image;
};

const closeModal = () => {
  selectedImage.value = null;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.title {
  font-size: 24px;
  margin-bottom: 0px;
  /* 增大文字大小 */
}

.top-section {
  font-size: 18px;
  font-family: 'Times New Roman', 'Microsoft YaHei';
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 更改为5列 */
  gap: 10px;
}

.image-item img {
  width: 100%;
  height: 100%;
  /* 保持宽高比 */
  /* max-height: 150px; 限制图像高度 */
  cursor: pointer;
}

.pagination {
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  /* 使其占据可用空间 */
}

.pagination button {
  background: none;
  border: none;
  font-size: 1.5em;
  /* 增加图标大小 */
  cursor: pointer;
  margin: 0 10px;
  /* 增加箭头之间的间距 */
}

.pagination .page-info {
  font-size: 1.1em;
  margin-left: auto;
  /* 将页数信息推到最右侧 */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
{
  opacity: 0;
}
</style>