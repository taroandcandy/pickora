// 菜单管理相关数据类型
// 请求表单
export interface UpdateOrAddMenuData{
    id?:number,
    pid?:number,
    name:string,
    code:string
}
export interface ResponseData {
    code:number,
    message:string
}