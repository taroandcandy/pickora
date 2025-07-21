<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      :to="item.path"
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin-left: 3px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const $route = useRoute()
// console.log($route);
</script>
<script lang="ts">
export default {
  name: 'BreadCrumb',
}
</script>
<style scoped></style>
