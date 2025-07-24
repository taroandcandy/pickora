// 菜单管理的api
import request from '@/utils/request'
import type { MenuResponseData } from '../roleManage/type'
import type { UpdateOrAddMenuData,ResponseData } from './type' 


enum API {
  ALLPERMISSION_URL = '/myApi/permissions',
  ADDorUPDATEPERMISSION_URL = '/myApi/permission/saveOrUpdate',
  DELETEPERMISSION_URL = '/myApi/permission/delete'
}
// 获取所有权限
export const reqGetAllPermission = () =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL)
// 更新或者修改权限
export const reqAddOrUpdatePermission = (form: UpdateOrAddMenuData) => request.post<UpdateOrAddMenuData, ResponseData>(API.ADDorUPDATEPERMISSION_URL, form)
// 删除菜单
export const reqDeletePermission = (id: number) => request.delete<any, ResponseData>(`${API.DELETEPERMISSION_URL}/${id}`)