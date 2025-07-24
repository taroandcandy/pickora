import request from '@/utils/request'
import type { ResponseData, AddOrUpdateRole, MenuResponseData } from './type'

enum API {
  DELETEROLE_URL = '/myApi/roles',
  ADDorUPDATEROLE_URL = '/myApi/roles',
  GETPERMISSION_URL = '/myApi/roles',
  UPDATEPERMISSION_URL = '/myApi/role',
}
// 删除某个角色
export const reqDeleteRole = (id: number) =>
  request.delete<any, ResponseData>(`${API.DELETEROLE_URL}/${id}`)
// 添加或者修改某个角色
export const reqAddOrUpdateRole = (form: AddOrUpdateRole) =>
  request.post<{ id?: number; roleName: string }, ResponseData>(
    API.ADDorUPDATEROLE_URL,
    form,
  )
// 获取权限列表
export const reqGetPermission = (id: number) =>
  request.get<any, MenuResponseData>(
    `${API.GETPERMISSION_URL}/${id}/permissions`,
  )
// 更新权限
export const reqUpdatePermission = (id: number, selected: string[]) =>
  request.post<any, ResponseData>(
    `${API.UPDATEPERMISSION_URL}/${id}/permissions`,
    { selected },
  )
