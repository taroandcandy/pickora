<template>
  <div>
    <el-form label-width="100px" :inline="false" size="normal">
      <el-form-item label="sku名称">
        <el-input placeholder="请输入sku名称" v-model="form.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="请输入sku价格" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="请输入sku重量" v-model="form.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input
          placeholder="sku描述"
          type="textarea"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          v-for="(attr, index) in platformAttrs"
          :key="attr.id"
          style="display: flex; align-items: center; margin-bottom: 10px"
        >
          <p style="margin: 0 10px; white-space: nowrap">{{ attr.attrName }}</p>
          <el-select
            placeholder="请选择"
            style="width: 240px"
            v-model="selectedPlatformAttrs[index].valueId"
          >
            <el-option
              v-for="item in attr.attrValueList"
              :key="item.id"
              :label="item.valueName"
              :value="item.id"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <p style="margin: 0px 10px">颜色</p>
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="selectedAttrs['颜色']"
        >
          <el-option
            v-for="(item, index) in currentSaleAttrList.find(
              (item) => item.attrName === '颜色',
            )?.attrValues || []"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <p style="margin: 0px 10px">版本</p>
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="selectedAttrs['版本']"
        >
          <el-option
            v-for="item in currentSaleAttrList.find(
              (item) => item.attrName === '版本',
            )?.attrValues || []"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <p style="margin: 0px 10px">尺码</p>
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="selectedAttrs['尺码']"
        >
          <el-option
            v-for="item in currentSaleAttrList.find(
              (item) => item.attrName === '尺码',
            )?.attrValues || []"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table
          border
          :data="currentImageList"
          @selection-change="addToImageLists"
        >
          <el-table-column type="selection" width="80px"></el-table-column>
          <el-table-column label="图片">
            <template #="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width: 80px; height: 80px" />
            </template>
          </el-table-column>
          <el-table-column width="200px" label="名称">
            <template #="{ row, $index }">
              <p>{{ row.imgName }}</p>
            </template>
          </el-table-column>
          <el-table-column width="200px" label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                @click="changeImageName(row.imgUrl)"
                icon="Edit"
              >
                修改图片名称
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 修改图片对话框 -->
    <el-dialog v-model="dialogVisible" title="设置图片名称" width="500">
      <el-input v-model="imageName" placeholder="请输入图片名称" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="comfirmChangeImageName">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reqAddSku } from '@/api/product/sku'
import { reqAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import { onMounted, reactive, ref, watch } from 'vue'
import type { Attr, AttrResponseData } from '@/api/product/attr/type'
import type {
  platformValue,
  saleValue,
  imagesValue,
  SkuData,
  responseData,
} from '@/api/product/sku/type'
import type { SpuData, SpuPoster } from '@/api/product/spu/type'
import { ElMessage, ElMessageBox } from 'element-plus'

let categoryStore = useCategoryStore()
const props = defineProps<{
  spuArr?: SpuData
}>()

// 表单
const form = reactive<SkuData>({
  spuId: Number(''),
  skuName: '',
  price: 0,
  weight: 0,
  description: '',
  platformAttr: [],
  saleAttr: [],
  images: [],
})
// 存储当前返回的平台属性
const platformAttrs = ref<Attr[]>([])
// 存储每个平台属性选中的属性值对象
let selectedPlatformAttrs = ref<platformValue[]>([])

// 获取当前spu的销售属性:从父组件获取
const currentSaleAttrList = ref<SpuPoster[]>([])
// 获取当前的图片展示列表
const currentImageList = ref<imagesValue[]>([])

// 存储当前图片列表
let imageLists = ref<imagesValue[]>([])
// 存储当前的销售属性值的选择
let saleAttrList = ref<saleValue[]>([])
// 各个销售属性的绑定值
const selectedAttrs = reactive<Record<string, string>>({
  颜色: '',
  版本: '',
  内存: '',
})
// 对话框
let dialogVisible = ref<boolean>(false)

// 父组件点击时进入子组件的初始化方法
const init = () => {
  getAttrList()
  form.spuId = Number('')
  form.skuName = ''
  form.price = 0
  form.weight = 0
  form.description = ''
  form.platformAttr = []
  form.saleAttr = []
  form.images = []
  selectedAttrs.颜色 = ''
  selectedAttrs.版本 = ''
  selectedAttrs.内存 = ''
  saleAttrList.value = []
}

// 存储当前图片名称
let imageName = ref<string>('')
// 当前图片索引
let imageIndex = ref<number>(-1)
// 映射图片名称
const getImgName = (url: string) => url.split('/').pop()!.split('.')[0]

// 修改图片名称
const changeImageName = (row: string) => {
  const index = currentImageList.value.findIndex((item) => item.imgUrl === row)
  if (index !== -1) {
    imageIndex.value = index
    imageName.value = currentImageList.value[index].imgName
    dialogVisible.value = true
  }
}

// 确认修改图片名称
const comfirmChangeImageName = () => {
  if (imageIndex.value !== -1) {
    currentImageList.value[imageIndex.value].imgName = imageName.value
  }
  dialogVisible.value = false
}
// 获取当前spu的平台属性
const getAttrList = async () => {
  if (categoryStore.c3Id) {
    let result: AttrResponseData = await reqAttr(categoryStore.c3Id)
    if (result.code === 200) {
      // console.log("当前平台属性", result.data);
      platformAttrs.value = result.data
      // console.log(platformAttrs);
      selectedPlatformAttrs.value = result.data.map((item) => ({
        attrId: item.id as string,
        valueId: '',
      }))
      // console.log(selectedPlatformAttrs.value);
    }
  }
}

// 更新销售属性对象的回调
const updateSaleAttr = (attrName: string, value: string) => {
  // 找到当前属性的索引
  const index = saleAttrList.value.findIndex(
    (item) => item.attrName === attrName,
  )
  if (index !== -1) {
    saleAttrList.value[index].valueName == value
  } else {
    saleAttrList.value.push({
      attrName,
      valueName: value,
    })
  }
}
// 监视selectedAttrs，有变化就更新saleAttrList
watch(
  () => ({ ...selectedAttrs }),
  (newVal) => {
    for (const [key, value] of Object.entries(newVal)) {
      if (value) {
        updateSaleAttr(key, value)
      }
    }
  },
  { deep: true },
)

// 监视传过来的值是不是空，判断是编辑还是新增
watch(
  () => props.spuArr,
  (newVal) => {
    // 销售属性列表
    if (Array.isArray(newVal?.spuPosterList) && newVal?.spuPosterList.length) {
      currentSaleAttrList.value = newVal?.spuPosterList.map((item) => ({
        attrName: item.attrName,
        attrValues: item.attrValues,
      }))
    } else {
      currentSaleAttrList.value = []
    }
    // 图片列表
    if (Array.isArray(newVal?.spuImageList) && newVal?.spuImageList.length) {
      currentImageList.value = newVal?.spuImageList.map((url) => ({
        imgUrl: url,
        imgName: getImgName(url),
      }))
    } else {
      currentImageList.value = []
    }
    // spuId
    if (newVal?.id) {
      form.spuId = newVal.id
    }
  },
  { immediate: true },
)
// console.log("当前的spu数据", props.spuArr);

// 存储当前spu的图片
const addToImageLists = (row: imagesValue) => {
  const index = imageLists.value.findIndex((item) => item.imgUrl === row.imgUrl)
  if (index !== -1) {
    imageLists.value[index] = row
  } else {
    imageLists.value.push(row)
  }
}

// 暴露给父组件的方法
defineExpose({
  init,
})
const $emit = defineEmits(['changeScene', 'refreshSpuList'])

// 取消
const cancel = () => {
  $emit('changeScene', 1)
  $emit('refreshSpuList')
}
const submit = async () => {
  try {
    form.platformAttr = selectedPlatformAttrs.value
    form.saleAttr = saleAttrList.value
    form.images = imageLists.value
    let result: responseData = await reqAddSku(form)
    // console.log("添加是否成功",result);
    if (result.code === 200) {
      ElMessage.success('添加sku成功')
      $emit('changeScene', 1)
    } else {
      ElMessage.error('添加sku失败')
    }
  } catch (error) {
    console.log('网路出现问题', error)
  }
}
</script>

<style scoped></style>
