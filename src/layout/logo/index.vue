<template>
  <div class="logo-container" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="" />
    <h1 class="">{{ setting.title }}</h1>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
</script>
<script lang="ts">
export default {
  name: 'Logo',
}
</script>

<style scoped lang="scss">
.logo-container {
  height: $base-menu-logo-height;
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  color: white;
  img {
    height: 40px;
    width: 40px;
  }
  h1 {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
