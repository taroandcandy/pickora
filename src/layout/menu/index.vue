<template>
  <!-- <p>{{ props.menuList }}</p> -->
  <template v-for="item in filteredMenu" :key="item.path">
    <!-- 如果没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item v-if="!item.meta?.hidden" :index="item.path" @click="goRoute">
        <!-- 将图标放在插槽的外面,防止折叠时图标消失 -->
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 如果只有一个子路由 -->
    <template v-else-if="item.children && item.children.length === 1 && item.name === 'Layout'">
      <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta?.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 如果有多个子路由 -->
    <el-sub-menu v-else="item.children && item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 自迭代,将所有子级路由全部展示出来 -->
      <MenuLeft :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'
// 使用路由
import { useRouter } from 'vue-router'
// 获取父组件传过来的全部路由数组
const props = defineProps<{
  menuList: RouteRecordRaw[]
}>()
// 使用路由跳转
const $router = useRouter()
const goRoute = (vc: any) => {
  $router.push(vc.index)
  // console.log(vc);
}
// defineProps(['menuList'])
const filteredMenu = computed(() => {
  return props.menuList.filter(item => {
    // 过滤掉隐藏的或无 meta/title 的
    return item.meta?.title && !item.meta.hidden
  })
})

</script>

<script lang="ts">
export default {
  name: 'MenuLeft',
}
</script>

<style scoped></style>
