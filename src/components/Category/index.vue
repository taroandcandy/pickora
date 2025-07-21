<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 1 ? false : true"
          placeholder="请选择"
          style="width: 200px"
          @change="handleC2"
          v-model="categoryStore.c1Id"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :label="c1.name"
            :key="c1.id"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 1 ? false : true"
          placeholder="请选择"
          style="width: 200px"
          v-model="categoryStore.c2Id"
          @change="handlerC3"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :label="c2.name"
            :value="c2.id"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 1 ? false : true"
          style="width: 200px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
onMounted(() => {
  getC1()
})

let categoryStore = useCategoryStore()
const getC1 = async () => {
  categoryStore.getC1()
}
// 获取二级分类
const handleC2 = async () => {
  //需要将二级、三级分类的数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // getC2()只会更新c2Arr
  categoryStore.getC2()
}
//此方法即为二级分类下拉菜单的change事件(选中值的时候会触发,保证二级分类ID有了)
const handlerC3 = () => {
  //清理三级分类的数据
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
defineProps(['scene'])
</script>

<style scoped></style>
