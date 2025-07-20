// 引入路由对象的类型
import type { RouteRecordRaw } from "vue-router"
import type { categoryObj } from "@/api/product/attr/type"
// 定义user小仓库state类型
export interface userState {
    token:string | null,
    menuRoutes: RouteRecordRaw[],
    username:string,
    avatar:string
}
// 定义分类对象小仓库state类型
export interface categoryState{
    c1Id:string | number,
    c1Arr: categoryObj[],
    c2Arr:categoryObj[],
    c2Id:string | number,
    c3Id:string | number,
    c3Arr:categoryObj[]
}