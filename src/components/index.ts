// import Pagination from './Pagination/index.vue'
import SvgIcon from './SvgIcon/index.vue'
import type { App, Component } from 'vue'
// 引入所有element-icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入三级分类全局组件
import Category from './Category/index.vue'

// 对象中每个key（字符串）对应的值，都是vue的component类型
const allGlobalComponents = { SvgIcon, Category } as Record<string, Component>

export default {
    // 一定要叫install方法
    install(app: App) {
        // 将svg图标挂载到全局
        for (const [key, component] of Object.entries(allGlobalComponents)) {
            app.component(key, component)
        }
        // 将icon图标挂载到全局
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}
