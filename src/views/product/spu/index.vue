<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px, 0px">
      <div v-show="scene === 1">
        <el-button
          type="primary"
          size="default"
          @click="addSpu"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px" :data="SpuArr">
          <el-table-column
            type="index"
            width="55px"
            label="序号"
            align="center"
          />
          <el-table-column
            width="150px"
            label="SPU名称"
            prop="spuName"
          ></el-table-column>
          <!-- 使用show-overflow-tooltip设置内容过长时隐藏 -->
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column width="300px" label="操作">
            <template #="{ row, $index }">
              <el-button
                style="width: 35px; height: 25px"
                type="primary"
                size="default"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                style="width: 35px; height: 25px"
                type="primary"
                size="default"
                @click="updateSpu(row)"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                style="width: 35px; height: 25px"
                type="primary"
                size="default"
                @click="viewSku(row.id)"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <!-- <el-button style="width: 35px;height: 25px;" type="primary" size="default" @click="deleteSpu(row.id)"
                                icon="Delete" title="删除SPU"></el-button> -->
              <el-popconfirm
                :title="`确认删除${row.spuName}吗？`"
                width="200px"
                @confirm="deleteSpu(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    icon="Delete"
                    style="width: 35px; height: 25px"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <spuForm
        v-show="scene === 2"
        @changeScene="changeScene"
        ref="childSpuForm"
        :spuArr="currentSpu"
        @refreshSpuList="getHasSPU"
      ></spuForm>
      <skuForm
        v-show="scene === 3"
        ref="childSkuForm"
        :spuArr="currentSpu"
        @changeScene="changeScene"
        @refreshSpuList="getHasSPU"
      ></skuForm>
    </el-card>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasSPU"
      @size-change="sizeChange"
    />
    <!-- 修改图片对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="SKU列表"
      width="600px"
      height="400px"
    >
      <el-table :data="skuList" border stripe>
        <el-table-column label="sku名字" width="100px" prop="skuName" />
        <el-table-column label="sku价格" width="100px" prop="price" />
        <el-table-column label="sku重量" width="100px" prop="weight" />
        <el-table-column label="sku图片">
          <template #="{ row, $index }">
            <div style="display: flex; gap: 8px; align-items: center">
              <el-image
                v-for="(item, index) in row.images"
                :key="index"
                :src="item.imgUrl"
                :preview-src-list="row.images.map((img: any) => img.imgUrl)"
                :initial-index="index"
                style="width: 80px; height: 80px; margin-right: 8px"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSPU, reqRemoveSpu } from '@/api/product/spu'
import type {
  SpuData,
  HasSpuResponseData,
  SpuRecordList,
} from '@/api/product/spu/type'
import type { SkuList1, SkuListValue } from '@/api/product/sku/type'
import skuForm from './skuForm.vue'
import spuForm from './spuForm.vue'
import { reqGetSkuList } from '@/api/product/sku'
import { ElMessage } from 'element-plus'
// 当前啊场景控制
let scene = ref<number>(1)
// 分页器相关
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 可以不设置pager_count
// const pager_count = ref(3)

// 接收传过来的spu数据
let SpuArr = ref<SpuRecordList>([])
// 获取spu子组件
const childSpuForm = ref()
// 获取sku子组件
const childSkuForm = ref()
// 控制查看sku弹窗
let dialogVisible = ref<boolean>(false)
// 收集拿到的sku数据
const skuList = ref<SkuListValue[]>([])
// 监听三级id
let categoryStore = useCategoryStore()
//
watch(
  () => categoryStore.c3Id,
  () => {
    // 如果有c3Id时再请求数据
    if (categoryStore.c3Id) {
      getHasSPU()
    }
  },
)
// 获取已有SPU
const getHasSPU = async (pager = 1) => {
  // 如果不传入pager，默认访问第一页
  currentPage.value = pager
  let result: HasSpuResponseData = await reqHasSPU(
    currentPage.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    SpuArr.value = result.data.records
    total.value = result.data.total
  }
  // console.log("当前SpuArr", SpuArr.value);
}
const sizeChange = () => {
  getHasSPU()
}
// 通过currentSpu的值控制修改或者删除
const currentSpu = ref<SpuData | undefined>(undefined)
// 新增spu
const addSpu = () => {
  scene.value = 2
  currentSpu.value = undefined
  // 点击添加时调用子组件的方法获取品牌数据
  if (childSpuForm.value) {
    childSpuForm.value.getAttrList()
  }
}
// 编辑spu
const updateSpu = (row: SpuData) => {
  scene.value = 2
  currentSpu.value = row
  // 点击修改时调用子组件的方法获取品牌数据
  if (childSpuForm.value) {
    childSpuForm.value.getAttrList()
  }
  // console.log("当前行的数据",row);
}
// 新增sku
const addSku = (row: SpuData) => {
  scene.value = 3
  // console.log("当前行的数据",row);
  currentSpu.value = row
  if (childSkuForm.value) {
    childSkuForm.value.init()
  }
}
// spuForm子组件改变场景
const changeScene = (num: number) => {
  scene.value = num
}
// 查看当前spu下的sku
const viewSku = async (row: number) => {
  dialogVisible.value = true
  try {
    let result: SkuList1 = await reqGetSkuList(row)
    // console.log("返回的sku数据",result.data);
    if (result.code === 200) {
      skuList.value = result.data
    } else {
      ElMessage.warning('获取数据失败')
    }
  } catch (error) {
    console.log('网络出现问题', error)
  }
}
// 删除已有spu
const deleteSpu = async (id: number) => {
  let result: any = await reqRemoveSpu(id as number)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasSPU(
      SpuArr.value.length > 1 ? currentPage.value : currentPage.value - 1,
    )
  } else {
    ElMessage.error('删除失败')
  }
}
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
