<template>
  <div class="layout-container">
    <div class="layout-slider" :class="{ fold: FoldSettingStore.fold }">
      <!-- 顶部logo -->
      <Logo />
      <!-- 左侧菜单滚动条 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu :default-active="$route.path" class="custom-menu" :collapse="FoldSettingStore.fold">
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout-tabbar" :class="{ fold: FoldSettingStore.fold }">
      <Tabbar />
    </div>
    <!-- 右边内容 -->
    <div class="layout-body" :class="{ fold: FoldSettingStore.fold }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入logo
import Logo from '@/layout/logo/index.vue'
// 引入菜单组件
import Menu from '@/layout/menu/index.vue'
// 获取用户相关的仓库
import useUserStore from '@/store/modules/user'
// 引入右边内容
import Main from '@/layout/main/index.vue'
// 引入顶部导航
import Tabbar from '@/layout/tabbar/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 获取fold属性,来自store中的小仓库
import useLayoutFoldSettingStore from '@/store/modules/setting'
const FoldSettingStore = useLayoutFoldSettingStore()
let $route = useRoute()
let userStore = useUserStore()
</script>
<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;

    &.fold {
      width: $base-menu-mini-width; 
    }

    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);
      width: 100%;

      // 清除菜单右侧的边框
      .el-menu {
        border-right: none;
      }

      // 自定义菜单样式
      .custom-menu {
        --el-menu-bg-color: #333;
        --el-menu-text-color: #fff;
        --el-menu-active-color: #9ce51d;
        --el-menu-hover-bg-color: #0974ef;
        /* 鼠标悬停高亮背景色 */
      }
    }
  }

  .layout-tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0px;
    left: $base-menu-width;
    transition: all .3s;

    &.fold {
      width: calc(100vw - $base-menu-mini-width);
      left: $base-menu-mini-width;
    }
  }

  .layout-body {
    position: absolute;
    height: calc(100vh - $base-tabbar-height);
    width: calc(100% - $base-menu-width);
    padding: 20px;
    top: $base-tabbar-height;
    left: $base-menu-width;
    overflow: auto;
    transition: all .3s;

    &.fold {
      width: calc(100vw - $base-menu-mini-width);
      left: $base-menu-mini-width;
    }
  }
}
</style>