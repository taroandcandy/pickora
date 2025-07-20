<template>
    <div class="tabbar">
        <!-- 顶部左侧 -->
        <div class="tabbar-left">
            <el-icon style="margin-right: 10px;" @click="foldChange">
                <component :is="FoldSettingStore.fold ? 'Fold' : 'Expand'" />
            </el-icon>
            <!-- 左侧的面包屑 -->
            <Breadcrumb />
        </div>
        <div class="tabbar-right">
            <Setting />
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
// 引入fold属性,来自pinia
import useLayoutFoldSettingStore from '@/store/modules/setting';

const FoldSettingStore = useLayoutFoldSettingStore()
const foldChange = () => {
    FoldSettingStore.fold = !FoldSettingStore.fold
}
</script>
<script lang="ts">
export default {
    name: 'Tabbar'
}
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(to right, rgb(232, 223, 223), rgb(236, 230, 230), rgb(224, 240, 219));

    .tabbar-left {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .tabbar-right {
        display: flex;
        align-items: center;

        .el-button {
            background-color: white;
        }
    }
}
</style>