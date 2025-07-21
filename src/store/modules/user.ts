import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入登录请求数据和响应数据的类型
// import type { loginForm, loginResponseData } from '@/api/user/type'

// 引入user的state类型
import type { userState } from './types/type'
// 引入token存储/读取/清除方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoute } from '@/router/routes'
// 引入用户信息数据类型
import type {
  loginForm,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
const useUserStore = defineStore('User', {
  state: (): userState => {
    return {
      // 获取token,用户唯一标识token
      token: GET_TOKEN(),
      // 仓库存储生成菜单需要数组（路由）
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    }
  },
  actions: {
    async userLogin(data: loginForm) {
      // 要用trycatch实现，否则前端收不到返回的状态信息
      try {
        const result: loginResponseData = await reqLogin(data)
        if (result.code === 200) {
          this.token = result.token as string
          SET_TOKEN(result.token)
          return 'ok'
        } else {
          // 逻辑错误，例如账号不存在、密码错误（非 HTTP 错误）
          return Promise.reject(new Error(result.message))
        }
      } catch (err: any) {
        // 网络或状态码异常，如 401、500 等
        if (err.response && err.response.data && err.response.data.message) {
          throw new Error(err.response.data.message) // 让调用者拿到 message
        } else {
          throw new Error('登录失败，请稍后重试')
        }
      }
    },
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo()
      // console.log("userinfo",result);
      if (result.code === 200) {
        this.username = result.data.userName
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userLogout() {
      //退出登录请求，一定要用trycatch，否则会出问题
      try {
        await reqLogout()
      } catch (error) {
        console.warn('退出登录接口失败（可能 token 已过期）：', error)
      }
      // 不管退出成功或失败，都清除token
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  getters: {},
})
export default useUserStore
