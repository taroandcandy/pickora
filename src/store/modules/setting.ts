// 控制面包屑前图标点击时折叠与否的仓库
import { defineStore } from "pinia";
const useLayoutSettingStore = defineStore('FoldSettingStore',{
    state:()=> {
        return{
            fold:false,
            refresh:false
        }
    }
})
export default useLayoutSettingStore