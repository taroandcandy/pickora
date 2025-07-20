<template>
    <el-button icon="Refresh" circle size="small" @click="refresh"
        style="background-color: #409EFF; color: white; border: none;" />
    <el-button icon="FullScreen" circle size="small" @click="fullScreen"
        style="background-color: #409EFF; color: white; border: none;" />
    <el-button icon="Setting" circle size="small" style="background-color: #409EFF; color: white; border: none;" />
    {{ userStore.username }}
    <img :src="userStore.avatar" style="width: 30px;height: 30px; margin:0px 10px; border-radius: 50%;">
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
import useLayoutSettingStore from '@/store/modules/setting';
// 获取用户仓库信息
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
// 提示组件
import { ElNotification } from 'element-plus';

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
        document.exitFullscreen();
    }
}
// 获取路由信息
const $router = useRouter()
const $route = useRoute()
// 退出登录
const logout = async () => {
    await userStore.userLogout();
    // 重定向到登录页，并记录当前页路径（方便登录后返回）
    $router.push({
        path: '/login',
        query: { redirect: $route.path }
    });
    // 如果退出失败，会在响应拦截器里提示信息
};

</script>
<script lang="ts">
export default {
    name: 'TabbarRight'
}
</script>

<style scoped></style>