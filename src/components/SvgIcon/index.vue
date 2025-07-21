<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '10px',
  },
  height: {
    type: String,
    default: '10px',
  },
})
</script>

<style scoped></style>
