<template>
  <el-button
    icon="Refresh"
    circle
    size="small"
    @click="refresh"
    style="background-color: #409eff; color: white; border: none"
  />
  <el-button
    icon="FullScreen"
    circle
    size="small"
    @click="fullScreen"
    style="background-color: #409eff; color: white; border: none"
  />
  <el-popover title="主题设置" width="300px" trigger="hover">
    <el-form label-width="80px" :inline="false" size="normal">
      <el-form-item label="主题颜色">
        <!-- :teleported='false'解决color闪退问题 -->
        <el-color-picker
          v-model="color"
          @change="setColor"
          show-alpha
          :predefine="predefineColors"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" @change="handleDark" />
      </el-form-item>
    </el-form>

    <template #reference>
      <el-button
        icon="Setting"
        circle
        size="small"
        style="background-color: #409eff; color: white; border: none"
      />
    </template>
  </el-popover>
  <div style="margin-left: 5px">
    {{ userStore.username }}
  </div>
  <img
    :src="userStore.avatar"
    style="width: 30px; height: 30px; margin: 0px 10px; border-radius: 50%"
  />
  <!-- 下拉框：退出登录 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// 获取布局设置信息
import useLayoutSettingStore from '@/store/modules/setting'
// 获取用户仓库信息
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
// 提示组件
// import { ElNotification } from 'element-plus'

const userStore = useUserStore()
const layoutSettingStore = useLayoutSettingStore()
// 刷新
const refresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 全屏
const fullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
// 获取路由信息
const $router = useRouter()
const $route = useRoute()
// 退出登录
const logout = async () => {
  await userStore.userLogout()
  // 重定向到登录页，并记录当前页路径（方便登录后返回）
  $router.push({
    path: '/login',
    query: { redirect: $route.path },
  })
  // 如果退出失败，会在响应拦截器里提示信息
}
// 主题颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
// 暗黑模式
let dark = ref<boolean>(false)
const handleDark = () => {
  let html = document.documentElement
  if (dark.value) {
    html.className = 'dark'
  } else {
    html.className = ''
  }
}
</script>

<script lang="ts">
export default {
  name: 'TabbarRight',
}
</script>

<style scoped></style>
