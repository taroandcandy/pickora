import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入登录请求数据和响应数据的类型
// import type { loginForm, loginResponseData } from '@/api/user/type'

// 引入user的state类型
import type { userState } from './types/type'
// 引入token存储/读取/清除方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由/任意路由/异步路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
// 引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

// 引入用户信息数据类型
import type {
  loginForm,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'

// // 过滤当前用户需要展示的异步路由
// function filterAsyncRoute(asyncRoute: any, routes: any) {
//   return asyncRoute.filter((item: any) => {
//     if (routes.includes(item.name)) {
//       if (item.children && item.children.length > 0) {
//         item.children = filterAsyncRoute(item.children, routes)
//       }
//       return true
//     }
//   })
// }
function filterAsyncRoute(asyncRoute: any[], routes: string[]): any[] {
  return asyncRoute.filter((route: any) => {
    if (routes.includes(route.name)) {
      // 当前路由命中
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRoute(route.children, routes)
      }
      return true
    } else if (route.children && route.children.length > 0) {
      // 判断子路由是否命中
      route.children = filterAsyncRoute(route.children, routes)
      if (route.children.length > 0) {
        return true // 子路由有命中，保留父级
      }
    }
    return false // 当前路由和子路由都没命中，过滤掉
  })
}

const useUserStore = defineStore('User', {
  state: (): userState => {
    return {
      // 获取token,用户唯一标识token
      token: GET_TOKEN(),
      // 仓库存储生成菜单需要数组（路由）
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: [],
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
        this.buttons = result.data.buttons
        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 菜单展示数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // console.log('当前菜单数据', this.menuRoutes)
        // console.log('当前路由', router.getRoutes())
        // 注册路由
        ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
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

      // 重置动态路由
      this.menuRoutes = constantRoute
      // 从 Router 中移除所有已注册的 asyncRoute
      asyncRoute.forEach((route: any) => {
        if (router.hasRoute(route.name)) {
          router.removeRoute(route.name)
        }
      })
      // 最后可选：跳转回登录页
      router.replace('/login')
    },
  },
  getters: {},
})
export default useUserStore
