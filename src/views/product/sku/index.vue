<template>
    <div v-show="scene === 1">
        <el-table :data="skuList" border>
            <el-table-column type="index" width="60px" label="序号" />
            <el-table-column label="名称" width="300px" prop="skuName" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="默认图片" width="200px">
                <template #="{ row, $index }">
                    <img :src="row?.images?.[0]?.imgUrl" alt=""
                        style="width: 200px; height: 200px;object-fit: contain;">
                </template>
            </el-table-column>
            <el-table-column label="重量(g)" width="200px" prop="weight" />
            <el-table-column label="价格(元)" width="200px" prop="price" />
            <el-table-column fixed="right" label="操作" width="300px">
                <template #="{ row, $index }">
                    <!-- <el-button type="success" size="default" @click="" style="width: 35px;height: 25px;" label="切换上一个"
                        icon="Top"></el-button> -->
                    <el-button type="primary" size="default" @click="updateSku(row)" style="width: 35px;height: 25px;"
                        icon="Edit" title="编辑SKU"></el-button>
                    <el-button type="info" size="default" @click="openDrawer(row)" style="width: 35px;height: 25px;"
                        icon="InfoFilled" title="查看SKU详情"></el-button>
                    <el-popconfirm :title="`确认删除${row.skuName}吗？`" width="200px" @confirm="handleDelete(row.id)">
                        <template #reference>
                            <el-button type="danger" size="default" style="width: 35px;height: 25px;" icon="Delete"
                                title="删除SKU"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
            @current-change="getHasSKU" @size-change="sizeChange" />
        <!-- 商品详情 -->
        <el-drawer v-model="drawer" :direction="direction" :before-close="handleClose" title="查看商品详情" size="40%">
            <div class="drawer-content">
                <div><strong>名称：</strong>{{ detailData?.skuName }}</div>
                <div><strong>描述：</strong>{{ detailData?.description }}</div>
                <div><strong>价格：</strong>{{ detailData?.price }}</div>
                <div><strong>平台属性：</strong>
                    <el-tag type="danger" size="normal" v-for="item in detailData?.readableAttr" :key="item.valueId"
                        class="mr-1">
                        {{ item.valueName }}</el-tag>
                </div>
                <div><strong>销售属性：</strong>
                    <el-tag v-for="(item, index) in detailData?.saleAttr" :key="index" class="mr-1" type="success">
                        {{ item.valueName }}
                    </el-tag>
                </div>
                <div><strong>商品图片：</strong>
                    <el-carousel height="200px" motion-blur interval="3000">
                        <el-carousel-item v-for="item in detailData?.images" :key="item.imgUrl">
                            <el-image :src="item.imgUrl" fit="contain"
                                style="width: 100%; height: 100%; margin-top: 10px;"></el-image>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </el-drawer>
        <el-drawer v-model="drawer2" :direction="direction">
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
    <!-- 修改sku -->
    <skuForm v-show="scene === 2" ref="childSkuForm" :skuArr="currentSku" @changeScene="changeScene"
        @refreshSkuList="getHasSKU"></skuForm>
</template>

<script setup lang="ts">
import { reqGetSkuListAll, reqDeleteSku } from '@/api/product/sku';
import { onMounted, ref } from 'vue';
import type { SkuList, SkuListValue, responseAddData } from '@/api/product/sku/type';
import type { DrawerProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import skuForm from './skuForm.vue';

let skuList = ref<SkuListValue[]>([])
// 分页器相关
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 详情页抽屉
let drawer = ref<boolean>(false)
let drawer2 = ref<boolean>(false)
const direction = ref<DrawerProps['direction']>('rtl')
let detailData = ref<SkuListValue>()
// 修改相关
let scene = ref<number>(1)
let childSkuForm = ref()
let currentSku = ref<SkuListValue>()

onMounted(() => {
    getHasSKU()
})
const getHasSKU = async (pager = 1) => {
    currentPage.value = pager
    let result: SkuList = await reqGetSkuListAll(currentPage.value, pageSize.value)
    // console.log("获取到的数据", result.data);
    if (result.code === 200) {
        skuList.value = result.data.list
        total.value = result.data.total
    }

}
const sizeChange = () => {
    getHasSKU();
}
// 取消退出详情页
const cancelClick = () => {
    drawer2.value = true
}
// 确定退出详情页
const confirmClick = () => {
    drawer2.value = false
}
// 点击关闭详情页
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确认关闭详情页吗？')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
// 查看商品详情
const openDrawer = (row: SkuListValue) => {
    drawer.value = true
    detailData.value = row
}
// 删除sku
const handleDelete = async (id: number) => {
    // console.log("删除商品的id",id);
    try {
        let result: responseAddData = await reqDeleteSku(id)
        if (result.code === 200) {
            ElMessage.success('删除成功')
            // 重新获取当前列表
            getHasSKU()
        } else {
            ElMessage.error('删除失败')
        }
    } catch (error) {
        console.log("网络出现问题", error);
    }
}
// 修改sku
const updateSku = (row:SkuListValue) => {
    scene.value = 2
    currentSku.value = row
    console.log("传给子组件的数据",row);
    if(childSkuForm.value){
        childSkuForm.value.init()
    }
}
const changeScene = () => {
    scene.value = 1
}
</script>

<style scoped lang="scss">
.drawer-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.mr-1 {
    margin-right: 6px;
    margin-bottom: 4px;
}

</style>