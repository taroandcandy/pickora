// // SPU的接口
// import anotherRequest from "@/utils/anotherRequest";
// import type { HasSpuResponseData } from './type'
// enum API{
//     HASSPU_URL = '/admin/product/',
// }
// export const reqHasSPU = (page: number, limit: number, category3Id: string | number) => anotherRequest.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}/?category3Id=${category3Id}`)

// SPU的接口--自己的
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  SpuAttrResponseData,
  SpuData,
  ResponseData,
} from './type'
enum API {
  HASSPU_URL = '/myApi/product/spu/list/',
  GETSPUATTR_URL = '/myApi/product/brand/category3',
  ADDorUPDATESPU_URL = '/myApi/product/spu/saveOrUpdate',
  REMOVESPU_URL = '/myApi/product/spu',
}
// 获取已有spu
export const reqHasSPU = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(`${API.HASSPU_URL}${page}/${limit}`, {
    params: { category3Id },
  })
// 获取已有spu品牌
export const reqSpuAttr = (category3Id: string | number) =>
  request.get<any, SpuAttrResponseData>(`${API.GETSPUATTR_URL}/${category3Id}`)
// 新增一个spu
export const reqAddOrUpdateSpu = (data: SpuData) =>
  request.post<SpuData, ResponseData>(API.ADDorUPDATESPU_URL, data)
// 删除一个spu
export const reqRemoveSpu = (id: number) =>
  request.delete<any, any>(`${API.REMOVESPU_URL}/${id}`)
