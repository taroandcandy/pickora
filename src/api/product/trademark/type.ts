export interface responseData {
  code: number
}
// 已有品牌的数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
  createTime: string
  updateTime: string
}
// 包含全部品牌数据的ts类型
export type tableData = TradeMark[]
// 获取已有的全部品牌的数据类型
export interface TradeMarkResponseData extends responseData {
  data: {
    tableData: tableData
    total: number
  }
}

export interface AddTradeMarkData {
  tmName: string
  logoUrl: string
}
// 修改时要带上id
export interface UpdateTradeMarkData extends AddTradeMarkData {
  id: string
}
