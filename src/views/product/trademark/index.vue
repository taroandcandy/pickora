<template>
    <div>
        <el-card>
            <!-- 顶部添加品牌按钮 -->
            <el-button type="primary" size="small" icon="Plus" :plain="false" @click="addTradeMark">添加品牌</el-button>
            <!-- 下面表格区域 -->
            <el-table border style="margin: 10px 0px;" :data="tradeMarkArr">
                <el-table-column label="序号" width="80px" align="center" type="index" />
                <el-table-column label="品牌名称">
                    <template #="{ row, $index }">
                        <h3>{{ row.tmName }}</h3>
                    </template>
                </el-table-column>
                <el-table-column label="品牌LOGO">
                    <template #="{ row, $index }">
                        <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>icon
                <el-table-column label="品牌操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" @click="updateTradeMark(row)" icon="Edit"
                            style="width: 35px;height: 25px;"></el-button>
                        <el-popconfirm :title="`您确认删除[${row.tmName}]吗`" width="250px" icon="Delete"
                            @confirm="removeTradeMark(row.id)">
                            <template #reference>
                                <el-button type="primary" @click="" icon="Delete"
                                    style="width: 35px;height: 25px;"></el-button>
                            </template>
                        </el-popconfirm>
                        <!-- <span>{{ row.id }}</span> -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部分页 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasTrademark"  @size-change="sizeChange" />
        </el-card>
        <!-- 新增/修改品牌 -->
        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName" />
                </el-form-item>
                <!-- label-width="100px"使其字对其 -->
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/api/myApi/uploadImg" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file">
                        <!-- 修改时展示已有的logoUrl，新增时展示imageUrl -->
                        <img v-if="trademarkParams.logoUrl || imageUrl"
                            :src="trademarkParams.id ? trademarkParams.logoUrl : imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="cancel">取消</el-button>
                    <el-button type="primary" @click="comfirm">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import type { tableData, TradeMarkResponseData, AddTradeMarkData, TradeMark, UpdateTradeMarkData } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let currentPage = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
// const pager_count = ref(3)

let tradeMarkArr = ref<tableData>([])
let dialogFormVisible = ref<boolean>(false)
// 获取表单实例
let formRef = ref()

// 收集新增品牌数据
// <Partial>将 UpdateTradeMarkData 类型的所有属性变成可选（optional）属性
let trademarkParams = reactive<Partial<UpdateTradeMarkData>>({
    tmName: '',
    logoUrl: '',
});
const getHasTrademark = async (pager = 1) => {
    currentPage.value = pager
    const result: TradeMarkResponseData = await reqHasTrademark(currentPage.value, pageSize.value)
    if (result.code === 200) {
        total.value = result.data.total
        tradeMarkArr.value = result.data.tableData
    }
    // console.log("这是result", result);
}
// 组件挂载时就发送一次请求，获取数据
onMounted(() => {
    getHasTrademark()
})
// 分页器当前页码发生变化的时候会触发
// 对于当前页码发生变化自定义事件,组件pagination父组件回传了数据(当前的页码)
// 上面可以直接绑定getHasTrademark事件，不用再写这个方法了
// const changePageNo = () => {
//     getHasTrademark()
// }

//当下拉菜单发生变化的时候触发次方法
//这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
    // 当前每一页的数据量发生变化的时候，当前页码归1，
    // 通过getHasTrademark方法传参实现，
    // 如果是onMounted时请求，则返回第一页，
    // 如果是size-change时请求，不返回参数给父组件，也返回第一页
    getHasTrademark();
}
// 添加品牌按钮回调
const addTradeMark = () => {
    dialogFormVisible.value = true
    // 清空收集的数据
    trademarkParams.logoUrl = ''
    trademarkParams.tmName = ''
    // 这里要删除id这个属性
    delete trademarkParams.id;
    // 或者undefined也能行
    // trademarkParams.id = undefined
    // 清除表单校验的提示消息
    // 第一种方式
    // formRef.value?.clearValidate('tmName')
    // formRef.value?.clearValidate('logoUrl')
    // 第二种方式
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
}
// 修改已有品牌回调
// row即为当前已有的品牌
const updateTradeMark = (row: TradeMark) => {
    // console.log("这是row",row);
    dialogFormVisible.value = true
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
    // trademarkParams.logoUrl = row.logoUrl
    // trademarkParams.tmName = row.tmName
    // trademarkParams.id = row.id; 
    // 用一行代码实现
    Object.assign(trademarkParams, row)

}
// 上传图片前检查文件大小：图片上传成功之前执行
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 这段条件判断始终会为 true，因为 'image/png' 和 'image/gif' 是非空字符串，
    // 会被 JavaScript 当作 truthy 值。
    // if (rawFile.type === 'image/jpg' || 'image/png' || 'image/gif') 
    const isImageType = ['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type);
    const isLt4M = rawFile.size / 1024 / 1024 < 4;
    if (!isImageType) {
        ElMessage.error('图片格式只能是 jpeg/png/gif');
        return false;
    }
    if (!isLt4M) {
        ElMessage.error('图片大小不能超过 4MB');
        return false;
    }
    return true;
}
// 上传成功的回调
const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // console.log("服务器返回的数据",response);
    // 收集上传图片的地址，添加一个新的品牌时用到
    trademarkParams.logoUrl = response.filePath
    // 在图片刚上传（还未发送给服务器）时，立即生成本地预览图，让用户看到上传的内容。
    // 这样比从服务器读取过来再呈现要快一些
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    // 如果图片上传成功，就要清除表单校验时的提示消息
    formRef.value.clearValidate('logoUrl')
}
// 确定按钮
const comfirm = async () => {
    //在你发请求之前,要对于整个表单进行校验
    //调用这个方法进行全部表单相校验,如果校验全部通过，再执行后面的语法
    await formRef.value.validate()
    let result: any = await reqAddOrUpdateTrademark(trademarkParams as UpdateTradeMarkData | AddTradeMarkData)
    // 添加或修改品牌
    if (result.code === 200) {
        // 关闭对话框
        dialogFormVisible.value = false
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        })
        // 再次发请求获取一次数据
        getHasTrademark(trademarkParams.id ? currentPage.value : 1)
    } else {
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        })
        dialogFormVisible.value = false
    }
    // console.log("添加品牌后返回的信息",result);
}
// 取消按钮
const cancel = () => {
    dialogFormVisible.value = false
}
// 品牌校验自定义规则
const validatorTmName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('品牌名称必须大于等于2位'))
    }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
    if (value) {
        callback()
    } else {
        callback(new Error('品牌logo必须上传'))
    }
}
// 表单校验规则对象
const rules = {
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}
// 删除品牌的回调
const removeTradeMark = async (id: string) => {
    let result = await reqDeleteTrademark(id)
    if (result.code === 200) {
        getHasTrademark(tradeMarkArr.value.length ? currentPage.value : currentPage.value - 1)
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        })
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
}

</script>

<style scoped>
/* 上传图片区域的样式 */
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>