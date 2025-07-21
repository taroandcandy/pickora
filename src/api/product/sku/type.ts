import type { SpuPoster } from '../spu/type'

// 定义sku相关的数据
export interface responseData {
  code: number
  message: string
}
// 添加sku返回数据
export interface responseAddData extends responseData {
  data: any
}
// 定义平台属性对象
export interface platformValue {
  // 选中的属性id
  attrId: number | string
  // 选中的属性值的id
  valueId: number | string
}
// 定义销售属性对象
export interface saleValue {
  attrName: string
  valueName: string
}
// 定义图片对象
export interface imagesValue {
  imgName: string
  imgUrl: string
}
// skudata新增请求数据
export interface SkuData {
  spuId: number
  skuName: string
  price: number
  weight: number
  description: string
  platformAttr: platformValue[]
  saleAttr: saleValue[]
  images: imagesValue[]
}
export interface readableValue extends platformValue {
  attrName: string
  valueName: string
}
// 定义SkuListValue--spu查看那里
export interface SkuListValue {
  id: number
  spuId: number
  skuName: string
  price: string | number
  weight: string | number
  description: string
  images: imagesValue[]
  platformAttr: platformValue[]
  saleAttr: saleValue[]
  readableAttr?: readableValue[]
}
export interface SkuList1 extends responseData {
  data: SkuListValue[]
}
// 全部skulist列表
export interface SkuResponseData {
  total: number
  currentPage: number
  pageSize: number
  list: SkuListValue[]
}
// 定义返回sku查看列表数据
export interface SkuList extends responseData {
  data: SkuResponseData
}
// 定义获取销售属性/图片的返回列表
export interface spuPosterandImageListValue {
  spuPosterList: SpuPoster[]
  spuImageList: string[]
}
export interface spuPosterandImageList extends responseData {
  data: spuPosterandImageListValue
}
// 定义获取三级id的返回数据
export interface category3Id extends responseData {
  data: string
}
