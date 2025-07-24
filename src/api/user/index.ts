// 统一管理项目用户相关的接口
import request from '@/utils/request'
import type { loginForm, loginResponseData, userInfoResponseData } from './type'
// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/myApi/login',
  USERINFO_URL = '/myApi/getUserinfo',
  LOGOUT_URL = '/myApi/logout',
}
// 登录接口
export const reqLogin = (data: loginForm) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取当前登录的用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)
// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
