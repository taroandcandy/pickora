<template>
  <div class="user-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin-bottom: 10px">
      <div class="form-row">
        <div class="input-group">
          <span>用户名</span>
          <el-input v-model="userName" placeholder="请输入用户名" clearable style="width: 200px; margin-left: 10px" />
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
      <el-button type="primary" size="large" @click="handleAdd" style="margin-right: 5px; padding: 5px 10px">
        添加
      </el-button>
      <el-button type="danger" size="large" @click="handleDelete" style="padding: 5px 5px">
        批量删除
      </el-button>
      <el-table :data="userList" border stripe style="margin-top: 10px" @selection-change="selectChange">
        <el-table-column type="selection" width="60px" />
        <el-table-column type="index" width="60px" label="序号" />
        <el-table-column label="id" width="60px" prop="userId"></el-table-column>
        <el-table-column label="账户" width="100px" prop="userNumber"></el-table-column>
        <el-table-column label="昵称" width="100px" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" width="100px" prop="roles" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" width="100px" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" width="100px" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="default" @click="handleRoles(row)" icon="User">
              分配角色
            </el-button>
            <el-button type="primary" size="default" @click="handleUpdate(row)" icon="Edit">
              编辑
            </el-button>
            <el-popconfirm :title="`确认删除${row.userName}吗？`" width="200px" @confirm="handleDeleteOne(row.userNumber)">
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
      @current-change="getHasUserList" @size-change="sizeChange" />
    <!-- 添加/修改用户 -->
    <el-dialog :title="title" v-model="isDialog" width="50%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" :inline="false" size="normal" status-icon>
        <el-form-item label="账号" prop="userNumber">
          <el-input v-model="form.userNumber" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="form.passWord" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.userSex">
            <el-radio value="男" size="large">男</el-radio>
            <el-radio value="女" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话号码" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input v-model="form.Email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="form.brief" placeholder="请输入简介" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色抽屉 -->
    <el-drawer title="给用户分配角色" v-model="isDrawer" direction="rtl" size="30%" :destroy-on-close="true" :show-close="true"
      :wrapperClosable="true">
      <el-form :model="roleForm" label-width="80px" :inline="false" size="normal">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="roleForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" prop="roles">
          <el-checkbox-group v-model="roleForm.roles">
            <el-checkbox v-for="(item, index) in roleList" :key="item" :label="item" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="isDrawer = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确认</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqALLUserInfo,
  reqAddorUpdateUser,
  reqDeleteUser,
  reqGetRoleList,
  reqAssignRoles,
} from '@/api/acl/userManage'
import type {
  userResponseData,
  userList,
  AddUserData,
  responseData,
  deleteUser,
  roleLists,
} from '@/api/acl/userManage/type'
import type { RoleResponseData } from '@/api/acl/roleManage/type'
import { ElMessage } from 'element-plus'

onMounted(() => {
  getHasUserList()
})
// 用户名
let userName = ref<string>('')
// 用户列表
let userList = ref<userList[]>([])
// 分页器相关
let currentPage = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
// 删除的用户id
let userIds = ref<string[]>([])
// 弹出框的title
let title = ref<string>('')
// 用户表单
let form = reactive<AddUserData>({
  userNumber: '',
  userName: '',
  userSex: '',
  userPhone: '',
  Email: '',
  brief: '',
  passWord: '',
})
// 角色表单
let roleForm = reactive<roleLists>({
  userName: '',
  userId: '',
  roles: [],
})
const resetForm = () => {
  form.userNumber = ''
  form.userName = ''
  form.userSex = ''
  form.userPhone = ''
  form.Email = ''
  form.brief = ''
  form.passWord = ''
}
// 是否显示添加用户对话框
let isDialog = ref<boolean>(false)
// 是否弹出抽屉
let isDrawer = ref<boolean>(false)
// 存储拿到的角色列表
let roleList = ref<string[]>([])

// 搜索,通过用户名来搜索相关用户
const handleSearch = () => {
  if (userName.value.trim() === '') {
    ElMessage.warning('用户名不能为空')
    return
  }
  const currentUserList: userList[] = userList.value.filter((item) => {
    return item.userName === userName.value
  })
  if (!currentUserList.length) {
    ElMessage.warning('没有该用户')
    return
  }
  userList.value = currentUserList
}
// 重置
const handleReset = () => {
  getHasUserList()
  userName.value = ''
}

// 表单校验规则
const validateUserNumber = (rule: any, value: string, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账户长度至少5位'))
  }
}
const validateUserName = (rule: any, value: string, callback: any) => {
  if (value.length >= 2 && value.length <= 20) {
    callback()
  } else {
    callback(new Error('用户名长度在5-20位'))
  }
}
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  if (value.length < 5 || value.length > 20) {
    return callback(new Error('密码长度需在5到20位之间'))
  }
  const hasLetter = /[a-zA-Z]/.test(value)
  const hasNumber = /\d/.test(value)
  if (!hasLetter || !hasNumber) {
    return callback(new Error('密码必须包含字母和数字'))
  }
  callback()
}
const validateUserPhone = (rule: any, value: string, callback: any) => {
  if (value.length !== 11) {
    return callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}
const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  const eamilPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  if (!eamilPattern.test(value)) {
    return callback(new Error('请输入合法的邮箱地址'))
  }
  callback()
}
const validatebrief = (rule: any, value: string, callback: any) => {
  if (value.length > 200) {
    return callback(new Error('简介不能超过200字'))
  } else {
    callback()
  }
}
const rules = {
  userNumber: [
    { required: true, trigger: 'change', validator: validateUserNumber },
  ],
  userName: [{ trigger: 'change', validator: validateUserName }],
  passWord: [
    { required: true, trigger: 'change', validator: validatePassword },
  ],
  userPhone: [{ trigger: 'change', validator: validateUserPhone }],
  Email: [{ trigger: 'blur', validator: validateEmail }],
  brief: [{ trigger: 'change', validator: validatebrief }],
}
// 添加
const handleAdd = async () => {
  isDialog.value = true
  title.value = '添加用户'
  resetForm()
}
// 编辑
const handleUpdate = (row: userList) => {
  isDialog.value = true
  title.value = '修改用户'
  form.userNumber = row.userNumber
  form.passWord = row.passWord
  form.userName = row.userName
  form.userSex = row.userSex
  form.userPhone = row.userPhone
  form.brief = row.brief
  form.Email = row.Email
  form.userId = row.userId
}
// 取消
const cancel = () => {
  isDialog.value = false
  resetForm()
}
// 提交表单
const submit = async () => {
  try {
    let result: responseData = await reqAddorUpdateUser({ userData: form })
    if (result.code === 200) {
      if (form.userId) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.success('添加成功')
      }
      getHasUserList()
    } else {
      if (form.userId) {
        ElMessage.error('修改失败')
      } else {
        ElMessage.error('添加失败')
      }
    }
  } catch (error) {
    console.log('服务器出现问题', error)
  }
  isDialog.value = false
}

// 批量删除
const selectChange = (selection: userList[]) => {
  userIds.value = selection.map((item) => item.userNumber)
  console.log('当前选中用户', userIds.value)
}
const handleDelete = async () => {
  try {
    if (!userIds.value.length) {
      ElMessage.warning('请选择要删除的用户')
      return
    } else {
      let result: deleteUser = await reqDeleteUser(userIds.value)
      if (result.code === 200) {
        ElMessage.success('删除成功')
        userIds.value = []
        getHasUserList()
      } else {
        ElMessage.error('删除失败')
      }
    }
  } catch (error) {
    console.log('服务器出错', error)
  }
}
// 删除一个
const handleDeleteOne = async (id: string) => {
  let currentId = []
  currentId.push(id)
  userIds.value = currentId
  await handleDelete()
  userIds.value = []
  getHasUserList()
}
// 获取已有用户数据
const getHasUserList = async (pager = 1) => {
  currentPage.value = pager
  let result: userResponseData = await reqALLUserInfo(
    currentPage.value,
    pageSize.value,
  )
  if (result.code === 200) {
    userList.value = result.data.list
    total.value = result.data.total
  }
}
const sizeChange = () => {
  getHasUserList()
}
// 分配角色
const handleRoles = async (row: userList) => {
  isDrawer.value = true
  roleForm.userName = row.userName
  roleForm.userId = row.userId
  try {
    let result: RoleResponseData = await reqGetRoleList()
    if (result.code === 200) {
      roleList.value = result.data.map((item) => item.roleName)
      roleForm.roles = row.roles
      // console.log("角色列表",roleList.value);
    } else {
      ElMessage.warning('获取数据失败')
    }
  } catch (error) {
    console.log('服务器出现问题', error)
  }
}
// 提交角色分配
const submitRoleForm = async () => {
  try {
    console.log("当前选中的角色",roleForm.roles);
    let result = await reqAssignRoles(roleForm)
    if (result.code === 200) {
      ElMessage.success('分配角色成功')
      isDrawer.value = false
      roleForm.roles = []
      roleForm.userName = ''
      roleForm.userId = ''
      getHasUserList()
    } else {
      ElMessage.error('分配角色失败')
    }
  } catch (error) { }
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
