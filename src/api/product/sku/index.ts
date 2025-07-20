// sku相关的接口
import request from "@/utils/request";
import type { SkuData, responseAddData, SkuList, SkuList1, SkuListValue, spuPosterandImageList, category3Id } from "./type";
enum API {
    ADDSKU_URL = '/myApi/product/sku/add',
    GETSKU_URL = '/myApi/product/sku/list',
    GETSKUALL_URL = '/myApi/product/sku/list',
    DELETESKU_URL = '/myApi/product/sku',
    UPDATESKU_URL = '/myApi/product/sku',
    GETSPUPOSTERandIMAGE_URL = '/myApi/product/spu/posterAndimage',
    GETCATEGORY3IDBySPUID_URL = '/myApi/product/spu/category3'
}
// 新增一个sku
export const reqAddSku = (data: SkuData) => request.post<SkuData, responseAddData>(API.ADDSKU_URL, data)
// 获取sku--通过spuId获得
export const reqGetSkuList = (spuId: number) => request.get<number, SkuList1>(`${API.GETSKU_URL}/${spuId}`)
// 获取全部skulist
export const reqGetSkuListAll = (currentPage: number, pageSize: number) => request.get<any, SkuList>(API.GETSKUALL_URL, {
    params: {
        currentPage,
        pageSize
    }
})
// 删除sku
export const reqDeleteSku = (id: number) => request.delete<number, responseAddData>(`${API.DELETESKU_URL}/${id}`)
// 修改sku
export const reqUpdateSku = (id: number, data: SkuListValue) => request.put<any, responseAddData>(`${API.UPDATESKU_URL}/${id}`, data)
// 获取指定spuId下的销售属性选择列表
export const reqSpuPosterAndImageList = (spuId: number) => request.get<number, spuPosterandImageList>(`${API.GETSPUPOSTERandIMAGE_URL}/${spuId}`)
// 获取当前sku所在spu的category3Id
export const reqCategory3Id = (spuId: number) => request.get<number, category3Id>(`${API.GETCATEGORY3IDBySPUID_URL}/${spuId}`)