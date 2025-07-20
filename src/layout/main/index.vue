<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由组件的子路由 -->
            <component :is="Component" v-if="flag" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
let flag = ref(true)
watch(() => layoutSettingStore.refresh, () => {
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})
</script>
<script lang="ts">
export default {
    name: 'LayoutMain'
}
</script>
<style scoped>
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transform: all .3s;
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>