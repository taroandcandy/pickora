<template>
    <div>
        <Category :scene="scene" />
        <el-card :body-style="{ padding: '20px' }">
            <div v-if="scene === 1">
                <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                    @click="addAttr">添加属性</el-button>
                <el-table style="margin:10px 0px" border :data="attrArr">
                    <el-table-column width="80px" label="序号" type="index" align="center" />
                    <el-table-column width="200px" label="属性名称" prop="attrName" />
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList">{{ item.valueName
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="200px" label="操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Edit" style="width: 35px;height: 25px;"
                                @click="updateAttr(row)"></el-button>

                            <el-popconfirm :title="`确认删除${row.attrName}吗？`" width="200px" @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"
                                        style="width: 35px;height: 25px;"></el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else>
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性的名称" v-model="attrObj.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="default" @click="addAttrVlue" icon="Plus"
                    :disabled="attrObj.attrName ? false : true">添加属性值</el-button>
                <el-button plain size="default" @click="" style="width: 35px;height: 25px;">取消</el-button>
                <el-table border :data="attrObj.attrValueList">
                    <el-table-column width="55px" label="序号" align="center" type="index" />
                    <el-table-column label="属性值">
                        <template #="{ row, $index }">
                            <!-- 将每一行收集在inputArr中-->
                            <el-input v-if="row.flag" @blur="changeToDiv(row, $index)" v-model="row.valueName"
                                placeholder="请输入属性值" :ref="(vc: any) => inputArr[$index] = vc" />
                            <div v-else @click="changeToInput(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="100px" label="操作" align="center"></el-table-column>
                </el-table>
                <div style="margin: 10px 0px;">
                    <el-button type="primary" size="default" style="width: 35px;height: 25px;"
                        @click="save">保存</el-button>
                    <el-button plain size="default" @click="cancel" style="width: 35px;height: 25px;">取消</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { reactive, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqUpdateOrAddAttr, reqDeleteAttr } from '@/api/product/attr';
import type { Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';
import _ from 'lodash'

// 存储属性数据
let attrArr = ref<Attr[]>([])
// 控制卡片展示内容
let scene = ref<number>(1)
// 存储属性对象
let attrObj = reactive<Attr>({
    attrName: '',
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})
let inputArr = ref<any>([])
// 如果有三个id就发送请求属性数据,用watch实现，如果有c3id就调用接口拿数据
let categoryStore = useCategoryStore()
watch(() => categoryStore.c3Id, () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()
})
// 获取三级选项下的属性目录
const getAttr = async () => {
    // 这个id一定要在函数内部获取
    const {c3Id } = categoryStore;
    // console.log(c3Id);
    let result = await reqAttr(c3Id)
    if (result.code === 200) {
        attrArr.value = result.data
    }
    // console.log(result);
}
// 添加属性
const addAttr = () => {
    // 添加前清空之前的选项数据
    attrObj.attrName = ''
    attrObj.attrValueList = []
    attrObj.categoryLevel = 3
    attrObj.categoryId = String(categoryStore.c3Id)
    // 切换回视图1
    scene.value = 2
}
// 编辑属性
const updateAttr = (row: Attr) => {
    scene.value = 2
    // 获取已有的属性，并展示
    // Object.assign(attrObj, row)// 这是浅拷贝，如果没有保存也会更新到数据库里
    // 使用JSON:把 row 的属性深拷贝一份，并浅合并到 attrObj 中，覆盖原有属性值。
    // Object.assign(attrObj, JSON.parse(JSON.stringify(row)))

    // 也可以用lodash
    Object.assign(attrObj, _.cloneDeep(row))
}

// 新增属性
const addAttrVlue = () => {
    // 将新增的属性名称加进去
    attrObj.attrValueList.push({
        valueName: '',
        flag: true
    })
    nextTick(() => {
        inputArr.value[attrObj.attrValueList.length - 1].focus()
    })
}
// 取消
const cancel = () => {
    scene.value = 1
}
// 保存
const save = async () => {
    let result: any = await reqUpdateOrAddAttr(attrObj)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: attrObj.id ? '修改属性成功' : '添加属性成功'
        })
        scene.value = 1
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: attrObj.id ? '修改属性失败' : '添加属性失败'
        })
    }
}
// 切换成div模式
const changeToDiv = (row: AttrValue, $index: number) => {
    // 属性值为空
    if (row.valueName.trim() === '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        // 删除当前为空的属性值
        attrObj.attrValueList.splice($index, 1)
        return
    }
    // 属性值重复
    let repeat = attrObj.attrValueList.find((item) => {
        // 一定要排除当前元素来寻找
        if (row != item) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        attrObj.attrValueList.splice($index, 1)
        return
    }
    row.flag = false
}
// 切换成编辑模式
const changeToInput = (row: AttrValue, $index: number) => {
    row.flag = true
    // 点击div就聚焦,但不是拿到数据就聚焦，要等DOM元素渲染完成后再聚焦
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}
// 删除某个属性
const deleteAttr = async (id: string) => {
    let result: any = await reqDeleteAttr(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
// 路由跳转时清空仓库中的数据
onBeforeUnmount(() => {
    categoryStore.$reset()
})

</script>

<style scoped></style>