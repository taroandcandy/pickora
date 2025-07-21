// 菜单管理的api
import request from "@/utils/request";
import type { MenuResponseData } from "../roleManage/type";
enum API {
    ALLPERMISSION_URL = '/myApi/permissions'
}
// 获取所有权限
export const reqGetAllPermission = () => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL)