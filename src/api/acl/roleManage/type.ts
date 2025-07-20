// 角色管理相关的数据类型
export interface ResponseData {
    code: number,
    message: string,
}
export interface RoleResponseValue {
    id: number,
    roleName: string,
    createTime: string,
    updateTime: string,
    selected:string[]
}
// 获取的角色列表
export interface RoleResponseData extends ResponseData {
    data: RoleResponseValue[],
    total: number
}
// 添加或修改角色名称
export interface AddOrUpdateRole {
    id?: number,
    roleName: string
}
// 菜单与按钮数据类型
export interface MenuData {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: string
    type: number
    status: null
    level: number
    children?: MenuList
    select: boolean
}
export type MenuList = MenuData[]
//菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
