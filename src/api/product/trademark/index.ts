import request from '@/utils/request'
import type {
  TradeMarkResponseData,
  AddTradeMarkData,
  UpdateTradeMarkData,
} from './type'
enum API {
  TRADEMARK_URL = '/myApi/getBrandData/',
  ADDTRADEMARK_URL = '/myApi/addBrandData',
  UPDATETRADEMARK_URL = '/myApi/updateBrandData',
  DELETETRADEMARK_URL = '/myApi/deleteBrand',
}
// 获取已有品牌
export const reqHasTrademark = (currentPage: number, pageSize: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${currentPage}/${pageSize}`,
  )
//添加与修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (
  data: AddTradeMarkData | UpdateTradeMarkData,
) => {
  //修改已有品牌的数据
  if ('id' in data) {
    return request.post<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}
// 删除已有品牌
export const reqDeleteTrademark = (id: string) =>
  request.delete<any, any>(`${API.DELETETRADEMARK_URL}/${id}`)
