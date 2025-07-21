<template>
  <div class="user-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 10px">
      <div class="form-row">
        <div class="input-group">
          <span>角色名称</span>
          <el-input v-model="roleName" placeholder="请输入角色名称" clearable style="width: 200px; margin-left: 10px" />
        </div>
        <div class="button-group">
          <el-button type="primary" size="default" @click="handleSearch" style="width: 50px; height: 25px">
            搜索
          </el-button>
          <el-button type="default" size="default" @click="handleReset" style="width: 50px; height: 25px">
            重置
          </el-button>
        </div>
      </div>
    </el-card>
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 10px">
      <el-button type="primary" size="large" @click="handleAdd" style="margin-right: 5px; padding: 5px 10px"
        icon="Plus">
        添加角色
      </el-button>
      <el-table :data="roleList" border stripe style="margin-top: 10px">
        <el-table-column type="index" width="60px" label="序号" />
        <el-table-column label="ID" width="60px" prop="id"></el-table-column>
        <el-table-column label="角色名称" width="100px" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #="{ row, $index }">
            <el-button type="primary" size="default" @click="handlePermission(row)" icon="User">
              分配权限
            </el-button>
            <el-button type="primary" size="default" @click="handleUpdate(row)" icon="Edit">
              编辑
            </el-button>
            <el-popconfirm :title="`确认删除${row.roleName}吗？`" width="200px" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="primary" size="default" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
      @current-change="getHasRoleList" @size-change="sizeChange" />
    <!-- 添加/修改角色 -->
    <el-dialog :title="title" v-model="isDialog" width="50%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" :inline="false" size="normal" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限抽屉 -->
    <el-drawer title="分配权限" v-model="isDrawer" direction="rtl" size="30%" :destroy-on-close="true" :show-close="true"
      :wrapperClosable="true">
      <!-- <el-form :model="permissionForm" label-width="80px" :inline="false" size="normal">
                <el-form-item label="全部数据" prop="roles">
                    <el-checkbox-group v-model="permissionForm.permissions">
                        <el-checkbox v-for="(item, index) in permissionList" :key="item" :label="item" />
                    </el-checkbox-group>
                </el-form-item>
            </el-form> -->
      <el-tree style="max-width: 300px; max-height: 400px" :data="permissionList" show-checkbox node-key="id"
        default-expand-all :default-checked-keys="defaultCheckedKeys" :props="defaultProps" @check="handleCheck" />
      <template #footer>
        <span>
          <el-button @click="isDrawer = false">取消</el-button>
          <el-button type="primary" @click="submitPermissionForm">
            确认
          </el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqGetRoleList1 } from '@/api/acl/userManage'
import type {
  RoleResponseData,
  RoleResponseValue,
  ResponseData,
  AddOrUpdateRole,
  MenuList,
  MenuResponseData,
  MenuData,
} from '@/api/acl/roleManage/type'
import {
  reqDeleteRole,
  reqAddOrUpdateRole,
  reqGetPermission,
  reqUpdatePermission,
} from '@/api/acl/roleManage'

let roleName = ref<string>('')
let roleList = ref<RoleResponseValue[]>([])
// 分页器相关
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 权限列表
let permissionList = ref<MenuList>([])
// 选中的权限列表
let defaultCheckedKeys = ref<number[]>([])
// 弹窗标题
let title = ref<string>('')
// 弹窗控制
let isDialog = ref<boolean>(false)
// 抽屉控制
let isDrawer = ref<boolean>(false)

onMounted(() => {
  getHasRoleList()
})
// 角色表单
let form = reactive<AddOrUpdateRole>({
  roleName: '',
})

// 表单校验规则
const validateRoleName = (rule: any, value: string, callback: any) => {
  if (value.length > 15) {
    return callback(new Error('名称不能超过15字'))
  } else {
    callback()
  }
}
const rules = {
  roleName: [
    { required: true, trigger: 'change', validator: validateRoleName },
  ],
}
// 弹窗关闭
const cancel = () => {
  isDialog.value = false
  form.id = Number('')
  form.roleName = ''
}
// 提交表单
const submit = async () => {
  try {
    let result = await reqAddOrUpdateRole(form)
    if (result.code === 200) {
      if (form.id) {
        ElMessage.success('修改角色名成功')
        getHasRoleList(currentPage.value)
      } else {
        ElMessage.success('添加角色名成功')
        getHasRoleList(
          (currentPage.value = Math.ceil((total.value + 1) / pageSize.value)),
        )
      }
      isDialog.value = false
    }
  } catch (error) {
    console.log('服务器出错', error)
  }
}

// 存储已选中的 name权限列表
const selectedNames = ref<string[]>([])
// 存储分配权限的roleid
let selectedId = ref<number>(-1)
// 递归处理，满足“父全选保存父，否则保存子”
const collectOptimizedNames = (
  nodes: MenuData[],
  selectedIds: number[],
): string[] => {
  const result: string[] = []

  const isFullySelected = (node: MenuData): boolean => {
    if (!node.children || node.children.length === 0) {
      return selectedIds.includes(node.id)
    }
    return node.children.every((child) => isFullySelected(child))
  }

  const traverse = (node: MenuData) => {
    if (node.children && node.children.length > 0) {
      if (node.children.every((child) => isFullySelected(child))) {
        result.push(node.name)
      } else {
        node.children.forEach(traverse)
      }
    } else {
      if (selectedIds.includes(node.id)) {
        result.push(node.name)
      }
    }
  }
  nodes.forEach(traverse)
  return result
}

// 最终绑定的事件函数
const handleCheck = (
  _: MenuData[],
  checkedKeys: { checkedKeys: number[]; halfCheckedKeys: number[] },
) => {
  const ids = checkedKeys.checkedKeys
  selectedNames.value = collectOptimizedNames(permissionList.value, ids)
  // console.log(" 最终保存的权限名称：", selectedNames.value)
}
// 提交权限表单
const submitPermissionForm = async () => {
  try {
    let result: ResponseData = await reqUpdatePermission(
      selectedId.value,
      selectedNames.value,
    )
    if (result.code === 200) {
      ElMessage.success('分配权限成功')
      isDrawer.value = false
    } else {
      ElMessage.error('分配权限失败')
    }
  } catch (error) {
    console.log('服务器出错', error)
  }
}
// 树形结构设置
const defaultProps = {
  children: 'children',
  label: 'name',
}
// 分配权限--获取菜单列表
const handlePermission = async (row: RoleResponseValue) => {
  isDrawer.value = true
  selectedNames.value = row.selected
  selectedId.value = row.id
  try {
    let result: MenuResponseData = await reqGetPermission(row.id)
    // console.log("树形数据", result.data);
    if (result.code === 200) {
      permissionList.value = result.data
      // 将选中的设置为勾选
      getCheckedIds(permissionList.value)
    }
  } catch (error) {
    console.log('服务器出现问题', error)
  }
}
// 将传过来的数据中select为true的选中
const getCheckedIds = (tree: MenuList) => {
  const checkedIds: number[] = []

  const traverse = (nodes: MenuList) => {
    nodes.forEach((node: MenuData) => {
      if (node.select) {
        checkedIds.push(node.id)
      }
      if (node.children) {
        traverse(node.children)
      }
    })
  }

  traverse(tree)
  defaultCheckedKeys.value = checkedIds
}

// 搜索,通过用户名来搜索相关用户
const handleSearch = () => {
  if (roleName.value.trim() === '') {
    ElMessage.warning('用户名不能为空')
    return
  }
  const currentUserList: RoleResponseValue[] = roleList.value.filter((item) => {
    return item.roleName === roleName.value
  })
  if (!currentUserList.length) {
    ElMessage.warning('没有该角色')
    return
  }
  roleList.value = currentUserList
}
// 重置
const handleReset = () => {
  getHasRoleList()
  roleName.value = ''
}
// 添加角色
const handleAdd = () => {
  title.value = '添加角色'
  isDialog.value = true
  form.roleName = ''
}
// 编辑角色
const handleUpdate = (row: RoleResponseValue) => {
  title.value = '修改角色'
  isDialog.value = true
  form.id = row.id
  form.roleName = row.roleName
}

// 删除
const handleDelete = async (id: number) => {
  try {
    let result: ResponseData = await reqDeleteRole(id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
      getHasRoleList()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    console.log('服务器出错', error)
  }
}
// 获取已有角色列表
const getHasRoleList = async (pager = 1) => {
  try {
    currentPage.value = pager
    let result: RoleResponseData = await reqGetRoleList1(
      currentPage.value,
      pageSize.value,
    )
    if (result.code === 200) {
      roleList.value = result.data
      total.value = result.total
    } else {
      ElMessage.error('获取数据失败')
    }
  } catch (error) {
    console.log('服务器出错', error)
  }
}
// 分页器
const sizeChange = () => {
  getHasRoleList()
}
</script>

<style scoped lang="scss">
.user-container {
  height: 100%;
  width: 100%;

  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input-group {
      display: flex;
      align-items: center;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
