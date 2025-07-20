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
                <el-input placeholder="sku描述" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <div v-for="(attr, index) in platformAttrs" :key="attr.id"
                    style="display: flex; align-items: center; margin-bottom: 10px;">
                    <p style="margin: 0 10px; white-space: nowrap;">{{ attr.attrName }}</p>
                    <el-select  v-if="selectedPlatformAttrs[index]" placeholder="请选择" style="width: 240px" v-model="selectedPlatformAttrs[index].valueId">
                        <el-option v-for="item in attr.attrValueList" :key="item.id" :label="item.valueName"
                            :value="item.id" />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="销售属性">
                <p style="margin: 0px 10px;">颜色</p>
                <el-select placeholder="请选择" style="width: 240px" v-model="selectedAttrs['颜色']">
                    <el-option
                        v-for="(item, index) in currentSaleAttrList.find(item => item.attrName === '颜色')?.attrValues || []"
                        :key="index" :label="item" :value="item" />
                </el-select>
                <p style="margin: 0px 10px;">版本</p>
                <el-select placeholder="请选择" style="width: 240px" v-model="selectedAttrs['版本']">
                    <el-option
                        v-for="item in currentSaleAttrList.find(item => item.attrName === '版本')?.attrValues || []"
                        :key="item" :label="item" :value="item" />
                </el-select>
                <p style="margin: 0px 10px;">尺码</p>
                <el-select placeholder="请选择" style="width: 240px" v-model="selectedAttrs['尺码']">
                    <el-option
                        v-for="item in currentSaleAttrList.find(item => item.attrName === '尺码')?.attrValues || []"
                        :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="图片名称">
                <el-table border :data="currentImageList" @selection-change="addToImageLists">
                    <el-table-column type="selection" width="80px">
                    </el-table-column>
                    <el-table-column label="图片">
                        <template #="{ row, $index }">
                            <img :src="row.imgUrl" alt="" style="width: 80px; height: 80px;">
                        </template>
                    </el-table-column>
                    <el-table-column width="200px" label="名称">
                        <template #="{ row, $index }">
                            <p>{{ row.imgName }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="200px" label="操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" @click="changeImageName(row.imgUrl)" icon="Edit">
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
import { reqUpdateSku, reqSpuPosterAndImageList, reqCategory3Id } from '@/api/product/sku';
import { reactive, ref, watch, nextTick } from 'vue';
import type { Attr, AttrResponseData } from '@/api/product/attr/type';
import type { platformValue, saleValue, imagesValue, spuPosterandImageList, responseAddData } from '@/api/product/sku/type';
import type { SpuPoster } from '@/api/product/spu/type';
import type { SkuListValue } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { reqAttr } from '@/api/product/attr';

const props = defineProps<{
    skuArr?: SkuListValue
}>()

// 表单
const form = reactive<SkuListValue>({
    id: Number(''),
    skuName: '',
    price: 0,
    weight: 0,
    description: '',
    platformAttr: [],
    saleAttr: [],
    images: [],
    spuId: Number('')
})

// 存储当前返回的平台属性
const platformAttrs = ref<Attr[]>([])
// 存储每个平台属性选中的属性值对象
let selectedPlatformAttrs = ref<platformValue[]>([])

// 获取当前spu的销售属性:---通过接口得到
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
    内存: ''
})
// 存储当前图片名称
let imageName = ref<string>('')
// 当前图片索引
let imageIndex = ref<number>(-1)
// 对话框
let dialogVisible = ref<boolean>(false)
// 映射图片名称
const getImgName = (url: string) => url.split('/').pop()!.split('.')[0];

const resetForm = () => {
    form.id = Number('');
    form.spuId = Number('');
    form.skuName = '';
    form.price = 0;
    form.weight = 0;
    form.description = '';
    form.platformAttr = [];
    form.saleAttr = [];
    form.images = [];
    form.readableAttr = [];

    selectedPlatformAttrs.value = [];
    selectedAttrs.颜色 = '';
    selectedAttrs.版本 = '';
    selectedAttrs.内存 = '';
    saleAttrList.value = [];
    imageLists.value = [];
    imageIndex.value = -1;
    imageName.value = '';
};
// 父组件点击时进入子组件的初始化方法
const init = async () => {
    resetForm()
    await nextTick();
    if (props.skuArr) {
        form.id = props.skuArr?.id
        form.spuId = props.skuArr.spuId
        form.skuName = props.skuArr.skuName
        form.price = props.skuArr.price
        form.weight = props.skuArr.weight
        form.description = props.skuArr.description
        form.platformAttr = props.skuArr.platformAttr
        form.saleAttr = props.skuArr.saleAttr
        // form.images = props.skuArr.images
        getSaleList()
        getAttrList()
        selectedAttrs.颜色 = ''
        selectedAttrs.版本 = ''
        selectedAttrs.内存 = ''
        saleAttrList.value = []
    }
}

// 修改图片名称
const changeImageName = (row: string) => {
    const index = currentImageList.value.findIndex(item => item.imgUrl === row)
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
// 获取当前sku所在spu的销售属性
const getSaleList = async () => {
    if (form.spuId) {
        let result: spuPosterandImageList = await reqSpuPosterAndImageList(form.spuId)
        if (result.code === 200) {
            currentSaleAttrList.value = result.data.spuPosterList
            currentImageList.value = result.data.spuImageList.map(url => ({
                imgUrl:url,
                imgName: getImgName(url)
            }))
        }
    }

}
// 获取当前sku所在spu所在的类别下的平台属性
let curretCategory3Id = ref<string>('')
const getCategory3Id = async () => {
    if (form.spuId) {
        let result = await reqCategory3Id(form.spuId)
        if (result.code === 200) {
            curretCategory3Id.value = result.data
        } else {
            ElMessage.error('获取参数失败')
        }
    }
}
const getAttrList = async () => {
    await getCategory3Id()
    let result: AttrResponseData = await reqAttr(curretCategory3Id.value)
    if (result.code === 200) {
        platformAttrs.value = result.data
        selectedPlatformAttrs.value = result.data.map(item => ({
            attrId: item.id as string,
            valueId: ''
        }))
    }
}

// 更新销售属性对象的回调
const updateSaleAttr = (attrName: string, value: string) => {
    // 找到当前属性的索引
    const index = saleAttrList.value.findIndex(item => item.attrName === attrName)
    if (index !== -1) {
        saleAttrList.value[index].valueName == value
    } else {
        saleAttrList.value.push({
            attrName,
            valueName: value
        })
    }
}
// 监视selectedAttrs，有变化就更新saleAttrList
watch(() => ({ ...selectedAttrs }), (newVal) => {
    for (const [key, value] of Object.entries(newVal)) {
        if (value) {
            updateSaleAttr(key, value)
        }
    }
}, { deep: true })

// 存储当前spu的图片
const addToImageLists = (row: imagesValue) => {
    const index = imageLists.value.findIndex(item => item.imgUrl === row.imgUrl)
    if (index !== -1) {
        imageLists.value[index] = row
    } else {
        imageLists.value.push(row)
    }
}

// 暴露给父组件的方法
defineExpose({
    init
})
const $emit = defineEmits(['changeScene', 'refreshSkuList'])

// 取消
const cancel = () => {
    resetForm()
    $emit('changeScene', 1)
    $emit('refreshSkuList')
}
const submit = async () => {
    try {
        form.platformAttr = selectedPlatformAttrs.value
        form.saleAttr = saleAttrList.value
        form.images = imageLists.value
        let result: responseAddData = await reqUpdateSku(form.id, form)
        // console.log("添加是否成功",result);
        if (result.code === 200) {
            ElMessage.success('修改sku成功')
            $emit('changeScene', 1)
            $emit('refreshSkuList')
            resetForm()
        } else {
            ElMessage.error('修改sku失败')
        }
    } catch (error) {
        console.log('网路出现问题', error)
    }
}
</script>

<style scoped></style>