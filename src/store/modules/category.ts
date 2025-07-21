// 定义商品属性分类的相关数据
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { categoryResponseData } from '@/api/product/attr/type'
import type { categoryState } from './types/type'
const useCategoryStore = defineStore('category', {
  state: (): categoryState => {
    return {
      c1Arr: [],
      c1Id: '',
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      const result: categoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    async getC2() {
      const result: categoryResponseData = await reqC2(this.c1Id)
      // console.log("this.c1id", this.c1Id);
      // console.log(result);
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    //获取三级分类的数据
    async getC3() {
      const result: categoryResponseData = await reqC3(this.c2Id)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
