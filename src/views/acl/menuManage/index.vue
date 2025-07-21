<template>
  <div>
    <el-table :data="permissionList" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称" sortable />
      <el-table-column prop="code" label="权限值" sortable />
      <el-table-column prop="updateTime" label="修改时间" sortable />
      <el-table-column label="操作" sortable>
        <template #="{ row, $index }">
          <el-button type="primary" size="small" @click="handleAdd(row)" :disabled="row.level === 4"
            :style="row.level === 3 ? 'background-color: #99CC99;' : 'default'" style="padding: 5px;">{{ row.level == 3
            ?
            '添加功能' : '添加菜单'
            }}</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(row)" :disabled="row.level === 1"
            style="padding: 5px;">编辑</el-button>
          <el-button type="primary" size="small" @click="" :disabled="row.level === 1"
            style="padding: 5px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或者编辑 -->
    <el-dialog :title="title" v-model="isDialog" width="30%">
      <el-form :model="form"  label-width="80px" :inline="false" size="normal">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input v-model="form.code" placeholder="请输入权限值"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="isDialog = false">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  MenuResponseData,
  MenuList,
  MenuData
} from '@/api/acl/roleManage/type'
import type { UpdateOrAddMenuData } from '@/api/acl/menuManage/type'
import { reqGetAllPermission } from '@/api/acl/menuManage'

onMounted(() => {
  handlePermission()
})
// 存储菜单列表
let permissionList = ref<MenuList>([])
// 弹窗
let title = ref<string>('')
let isDialog = ref<boolean>(false)
// 表单
let form = ref<UpdateOrAddMenuData>({
  name: '',
  code: ''
})
// 提交表单
const submit = async() => {
  isDialog.value = false
}

// 编辑
const handleUpdate = (row: MenuData) => {
  title.value = '编辑菜单'
  isDialog.value = true
  form.value.code = row.code
  form.value.name = row.name
  form.value.id = row.id
}
// 新增
const handleAdd = (row: MenuData) => {
  title.value = '新增菜单'
  isDialog.value = true
  form.value.code = ''
  form.value.name = ''
  form.value.pid = row.pid
}
// 获取菜单数据
const handlePermission = async () => {
  try {
    let result: MenuResponseData = await reqGetAllPermission()
    // console.log("树形数据", result.data);
    if (result.code === 200) {
      permissionList.value = result.data
    }
  } catch (error) {
    console.log('服务器出现问题', error)
  }
}
</script>

<style scoped></style>
