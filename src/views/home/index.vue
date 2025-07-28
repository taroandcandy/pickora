<template>
  <div>
    <el-card shadow="always" style="margin: 10px">
      <div class="container">
        <div class="card-left">
          <img :src="avatar" alt="" />
        </div>
        <div class="card-right">
          <h2>{{ getTime() }}好{{ username }}</h2>
          <h3>PICKORA运营平台</h3>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
// 获取当前用户的信息
let userStore = useUserStore()
let avatar: string = userStore.$state.avatar
let username: string = userStore.$state.username
</script>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100px; // 让 container 有足够的高度以实现居中

  .card-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; // 垂直方向居中（在 column 方向中）
  }

  .card-right {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center; // 垂直方向居中（在 column 方向中）
    gap: 15px;
    text-align: left; // 让文字左对齐
  }
}
</style>
