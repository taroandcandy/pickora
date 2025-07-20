// 权限管理中的相关接口
import request from "@/utils/request";
import type { userResponseData, AddUserInfo, responseData, deleteUser, roleLists, assignRoles } from './type'
import type { RoleResponseData } from "../roleManage/type";

enum API {
    GETUSERINFO_URL = '/myApi/getAclUserData',
    ADDUSER_URL = '/myApi/createUserData',
    DELETEUSER_URL = '/myApi/deleteUser',
    GETROLELISTS_URL = '/myApi/getRoleList',
    ASSIGNROLES_URL = '/myApi/assignUserRoles'
}
// 获取已有用户
export const reqUserInfo = (currentPage: number, pageSize: number) => request.get<any, userResponseData>(API.GETUSERINFO_URL, {
    params:{
        currentPage,
        pageSize
    }
})
// 添加用户
export const reqAddorUpdateUser = (userData: AddUserInfo) => request.post<AddUserInfo, responseData>(API.ADDUSER_URL, userData)
// 删除用户
export const reqDeleteUser = (userIds: string[]) => request.post<string[],deleteUser>(API.DELETEUSER_URL, {userIds})
// 获取所有角色列表
export const reqGetRoleList = () => request.get<any, RoleResponseData>(API.GETROLELISTS_URL)
// 获取所有角色列表--分页
export const reqGetRoleList1 = (page: number, pageSize: number) => request.get<any, RoleResponseData>(API.GETROLELISTS_URL, {
    params: {
        page,
        pageSize
    }
})
// 分配角色
export const reqAssignRoles = (roleLists: roleLists) => request.post<roleLists, assignRoles>(API.ASSIGNROLES_URL, roleLists)