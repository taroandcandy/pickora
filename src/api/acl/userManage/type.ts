// 权限管理中的用户管理中的数据类型
// 获取用户列表
export interface userList {
    userNumber: string,
    passWord: string,
    token: string,
    userName: string,
    avatar: string,
    routes: string[],
    userId: string,
    updateTime: string,
    createTime: string,
    Email: string,
    brief: string,
    userSex: string,
    userPhone: string,
    roles: string[]
}
export interface userData {
    total: number,
    pageNum: number,
    pageSize: number,
    list: userList[],

}
export interface userResponseData {
    code: number,
    data: userData
}
// 添加用户
export interface responseData {
    code: number,
    message: string
}
export interface AddUserData {
    userId?: string,
    userNumber: string,
    userName: string,
    userSex: string,
    userPhone: string,
    Email: string,
    brief: string,
    passWord: string,
}
export interface AddUserInfo {
    userData: AddUserData
}
// 删除用户
export interface deleteUser extends responseData {
    deletedCount: number,
    ok: boolean
}
// 获取角色列表
// export interface roleListsResponseData extends responseData {
//     data: string[]
// }
export interface roleLists {
    userName: string,
    userId: string,
    roles: string[]
}
// 分配角色
export interface assignRoles extends responseData {
    ok: boolean
}