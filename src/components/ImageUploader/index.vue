<template>
    <el-upload :action="action" list-type="picture-card" multiple :limit="limit" :file-list="fileList"
        :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview"
        :before-upload="handleBeforeUpload">
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible" width="600px">
        <img :src="dialogImageUrl" style="width: 100%" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
    imageList: string[],
    action: string,
    limit?: number
}>()

const emit = defineEmits<{
    (e: 'update:imageList', val: string[]): void
}>()

const fileList = ref<any[]>([])

//  初始化：将 imageList 映射为 fileList
// 把父组件传进来的图片 URL 列表（imageList）转换成 el-upload 组件识别的格式，用于图片的预览显示。
// 'http://localhost:3000/images/spu/2.jpg' --->
// name: '1.jpg',
// url: 'http://localhost:3000/images/spu/1.jpg'
watch(() => props.imageList, (newList) => {
    fileList.value = newList.map((url) => ({
        name: url.split('/').pop() || '',
        url
    }))
}, { immediate: true })

//  上传成功后添加 URL
// 上传成功后，从响应中提取图片 URL，添加到绑定的图片列表中（imageList），并通过 emit 更新父组件。
const handleSuccess = (response: any) => {
    const url = response.filePaths?.[0] || response.url
    // console.log("上传成功后的地址",url);
    if (url) {
        const updated = [...props.imageList, url]
        emit('update:imageList', updated)
    }
}

//  删除图片时从 imageList 中移除
const handleRemove = (file: any) => {
    const url = file.response?.filePaths?.[0] || file.url
    const updated = props.imageList.filter(item => item !== url)
    emit('update:imageList', updated)
}

// 上传前校验类型/大小
const handleBeforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 4

    if (!isJPG) {
        ElMessage.error('只允许上传 JPG/PNG 格式图片！')
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 4MB！')
    }
    return isJPG && isLt2M
}

// 图片预览相关的
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const handlePreview = (file: any) => {
    // console.log("1",file.url);
    // console.log("2",file.response?.filePaths?.[0]);//undefined
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
</script>
