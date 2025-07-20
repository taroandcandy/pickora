// import type { responseData } from "../attr/type"

// // 服务器全部返回接口的数据类型
// export interface ResponseData {
//     code: number,
//     message: string,
//     // ok?: boolean
// }
// // SKU数据类型
// export interface SpuData {
//     id?: number,
//     spuName: string,
//     description: string,
//     category3Id: string | number,
//     tmId: number,
//     spuSaleAttrList: null,
//     spuImageList: null
// }
// // 数组包含元素类型
// export type Records = SpuData[]
// // 定义获取已有spu接口返回数据的类型
// export interface HasSpuResponseData extends responseData {
//     data: {
//         records: Records,
//         total: number,
//         size: number,
//         current: number,
//         searchCount: boolean,
//         pages: number
//     }
// }
// // 定义spu下的品牌数据类型
// export interface spuAttrValue {
//     id:number,
//     tmName:string,
//     category3Id:number
// }
// export type attrData = spuAttrValue[]
// export interface spuAttrResponseData extends responseData{
//     data:attrData
// }


// 通用接口响应结构（支持泛型）
export interface ResponseData<T = any> {
    code: number
    message: string
    data: T
}

// ---------- SPU 数据结构 ----------

// 定义销售属性的返回值类型
export interface SpuSaleAttr {
    attrName: '颜色' | '版本' | '尺码',
    flag: 0 | 1
}

export interface EditableSpuPoster {
    attrName: string
    attrValues: { value: string; editing: boolean }[]
}
// 定义销售属性的属性值
export interface SpuPoster {
    attrName: string,
    attrValues: string[]
}
// 单个 SPU 数据类型
export interface SpuData {
    id?: number
    spuName: string
    description: string
    category3Id: string | number
    tmId: number | string
    spuSaleAttrList: SpuSaleAttr[]
    spuPosterList: SpuPoster[]
    spuImageList:string[]
}

// SPU 列表类型
export type SpuRecordList = SpuData[]

// 分页数据结构（可复用）
export interface Paginated<T> {
    records: T
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
}

// 获取已有 SPU 的接口返回类型
export type HasSpuResponseData = ResponseData<Paginated<SpuRecordList>>

// ---------- 品牌数据结构 ----------

// 单个品牌属性
export interface SpuAttrValue {
    id: number
    tmName: string
    category3Id: number
}

// 获取品牌属性列表的接口返回类型
export type SpuAttrResponseData = ResponseData<SpuAttrValue[]>

