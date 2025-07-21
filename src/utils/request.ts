// 对axios二次封装：使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
// 1、利用axios对象的create方法，创建axios实例（其他配置：基础路径、超时时间）
const request = axios.create({
  baseURL: import.meta.env['VITE_APP_BASE_API'],
  timeout: 5000,
})

// 2、request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  // config配置对象，headers属性请求头，经常给服务器端携带公共参数
  // 返回配置对象
  // config.headers['token'] = '123'//配置请求时带上一个参数
  // 获取用户仓库
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers['token'] = userStore.token
  }
  return config
})
let hasShownTokenError = false // 控制只提示一次401
// 3、响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调
    // 简化数据
    // console.log(response);
    return response.data
  },
  (error) => {
    // 失败的回调：处理http网路错误
    // 定义一个变量：存储网络错误信息
    let message = ''
    const status = error.response.status
    switch (status) {
      case 401:
        // 如果修改了token，刷新后就跳转到登录页
        message = 'TOKEN过期 or 密码错误'
        if (!hasShownTokenError) {
          hasShownTokenError = true // 设置标志，防止重复弹出
          ElMessage({
            type: 'error',
            message,
            duration: 3000,
          })
          const userStore = useUserStore()
          setTimeout(() => {
            userStore.userLogout()
            // 强制跳转到登录页
            window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`
          }, 2000)
        }
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    if (status != 401) {
      // 提示错误信息
      ElMessage({
        type: 'error',
        message,
      })
    }
    return Promise.reject(error)
  },
)
// 二者是一样的，只是request进行了一些封装
// console.log(axios);
// console.log(request);
export default request
