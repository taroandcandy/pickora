<template>
  <div class="not-found">
    <img class="image" :src="errorImage" alt="404" />
    <div class="content">
      <h1 class="title">你访问的界面不存在！</h1>
      <h2 class="subtitle">管理员说你不能进入此页面</h2>
      <p class="desc">请检查你的 URL 是否正确，或点击下面按钮回到首页</p>
      <button @click="goHome">返回到首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import errorImage from '@/assets/images//error_images/error_404.png'

const router = useRouter()

function goHome() {
  router.push('/') // 根据你的首页路径修改
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
}

.image {
  width: 500px;
  max-width: 100%;
}

.content {
  margin-left: 50px;
  max-width: 500px;
}

.title {
  color: #007bff;
  font-size: 26px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
