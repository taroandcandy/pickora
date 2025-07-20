// 属性管理相关的文件
import request from "@/utils/request";
import type { categoryResponseData, AttrResponseData, Attr } from "./type";
enum API {
    C1_URL = '/myApi/product/get/category1',
    C2_URL = '/myApi/product/get/category2',
    C3_URL = '/myApi/product/get/category3',
    ATTR_URL = '/myApi/product/attrInfoList',
    ADDorUPDATE_URL = '/myApi/product/saveOrUpdateAttr',
    DELETE_URL = '/myApi/product/attr'
}
// 一级分类的接口
export const reqC1 = () => request.get<any, categoryResponseData>(API.C1_URL)
// 二级分类接口
export const reqC2 = (C1_id: string| number) => request.get<any, categoryResponseData>(`${API.C2_URL}/${C1_id}`)
// 三级分类接口
export const reqC3 = (C2_id: string | number) => request.get<any, categoryResponseData>(`${API.C3_URL}/${C2_id}`)
// 属性接口
export const reqAttr = (C3_id: string | number) => request.get<any, AttrResponseData>(`${API.ATTR_URL}/${C3_id}`)
// 修改或新增属性
export const reqUpdateOrAddAttr = (data: Attr) => request.post<any, string | any>(API.ADDorUPDATE_URL, data)
// 删除某个属性
export const reqDeleteAttr = (id: string) => request.delete<any, any>(`${API.DELETE_URL}/${id}`)


// //这里书写属性相关的API文件---尚硅谷的
// import anotherRequest from "@/utils/anotherRequest";
// import type { categoryResponseData, AttrResponseData, Attr } from "./type";
// //属性管理模块接口地址
// enum API {
//     //获取一级分类接口地址
//     C1_URL = '/admin/product/getCategory1',
//     //获取二级分类接口地址
//     C2_URL = '/admin/product/getCategory2/',
//     //获取三级分类接口地址
//     C3_URL = '/admin/product/getCategory3/',
//     //获取分类下已有的属性与属性值
//     ATTR_URL = '/admin/product/attrInfoList/',
//     //添加或者修改已有的属性的接口
//     ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
//     //删除某一个已有的属性
//     DELETEATTR_URL = '/admin/product/deleteAttr/'
// }

// //获取一级分类的接口方法
// export const reqC1 = () => anotherRequest.get<any, categoryResponseData>(API.C1_URL);
// //获取二级分类的接口方法
// export const reqC2 = (category1Id: number | string) => anotherRequest.get<any, categoryResponseData>(API.C2_URL + category1Id);
// //获取二级分类的接口方法
// export const reqC3 = (category2Id: number | string) => anotherRequest.get<any, categoryResponseData>(API.C3_URL + category2Id);
// //获取对应分类下已有的属性与属性值接口
// export const reqAttr = (category1Id: string | number, category2Id: string | number, category3Id: string | number) => anotherRequest.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`);

// //新增或者修改已有的属性接口
// export const reqAddOrUpdateAttr = (data: Attr) => anotherRequest.post<any, any>(API.ADDORUPDATEATTR_URL, data);

// //删除某一个已有的属性业务
// export const reqRemoveAttr = (attrId: number) => anotherRequest.delete<any, any>(API.DELETEATTR_URL + attrId)