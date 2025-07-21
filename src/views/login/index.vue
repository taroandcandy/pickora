<template>
  <div class="login_wrapper">
    <!-- 粒子背景 -->
    <ParticleBackground />
    <div class="login_container">
      <el-row>
        <el-col :span="12" :xs="0"></el-col>
        <el-col :span="12" :xs="24">
          <el-form
            ref="loginForms"
            class="login_form"
            :model="loginForm"
            :rules="rules"
          >
            <h1>Hello</h1>
            <h2>欢迎来的PICKORA</h2>
            <el-form-item prop="username">
              <el-input v-model="loginForm.userNumber" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.passWord"
                type="password"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="login_btn"
                type="primary"
                size="default"
                :padding="loading"
                @click="login"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入登录/密码图标
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
// 引入用户store
import useUserStore from '@/store/modules/user'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
// 引入提示组件
import { ElNotification } from 'element-plus'
// 引入时间判断函数
import { getTime } from '@/utils/time'
// 引入Particles
import ParticleBackground from '@/components/ParticleBackground/index.vue'

// 定义用户名校验规则
const validateUserName = (rule: any, value: string, callback: any) => {
  // rule：校验规则
  // value：表单中的文本内容
  // callback:是一个函数,校验通过则放行,校验不通过则注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少为5位'))
  }
}
// 定义密码校验规则
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少为6位'))
  }
}
// 定义校验规则
const rules = {
  // username: [{ required: true, min: 5, max: 15, message: '用户名不能少于5位', trigger: 'change' }],
  userNumber: [{ trigger: 'change', validator: validateUserName }],
  // password: [{required: true, min: 6, max: 15, message: '密码不能少于6位', trigger: 'change'}]
  passWord: [{ trigger: 'change', validator: validatePassword }],
}
const userStore = useUserStore()
// 存储登录小圈是否转动
let loading = ref(false)
let loginForm = reactive({
  userNumber: 'admin',
  passWord: '111111',
})
// 拿到表单的ref
const loginForms = ref()
// 路由信息
const $router = useRouter()
const $route = useRoute()
const login = async () => {
  await loginForms.value.validate()
  loading.value = true
  try {
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到展示数据首页/退出时所在的那个页面
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // $router.push('/')
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi ${getTime()}好`,
    })
    loading.value = false
  } catch (err: any) {
    // 响应拦截器有判定，这里就不用展示了
    // ElNotification({
    //   type: 'error',
    //   message: (err as Error).message
    // })
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login_wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .login_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); // 垂直水平居中
    z-index: 1;
    width: 500px;
    padding: 30px;
    border-radius: 12px;
    background-color: #99cccc;
    backdrop-filter: blur(12px);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    color: white;

    .login_form {
      h1 {
        font-size: 32px;
        color: white;
        margin-bottom: 10px;
      }

      h2 {
        font-size: 16px;
        color: #ddd;
        margin-bottom: 20px;
      }

      .login_btn {
        width: 100%;
        background-color: #ffcc99;
      }
    }
  }
}
</style>
