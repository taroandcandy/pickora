// 定义属性管理相关数据的类型
export interface responseData{
    code:number,
    message:string
}
export interface categoryObj{
    id:string,
    name:string,
    parentId?:string
}
// 相应的分类接口返回数据的类型
export interface categoryResponseData extends responseData{
    data:categoryObj[]
}
// 属性值对象的ts类型
export interface AttrValue{
    id?:string,
    valueName:string,
    attrId?:string,
    flag:boolean
}
// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr{
    id?:string,
    attrName:string,
    categoryId:string,
    categoryLevel:number,
    attrValueList: AttrValueList
}
// 属性接口返回的数据类型
export interface AttrResponseData extends responseData{
    data: Attr[]
}
