import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 引入暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

import 'virtual:svg-icons-register'
import globalcomponents from '@/components/index.ts'
import router from './router'
import pinia from './store'
// 引入全局样式
import '@/styles/index.scss'
// 引入Particles
import Particles from '@tsparticles/vue3'
import { loadFull } from 'tsparticles' // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// 引入全局路由守卫
import './permission'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
// app.component('Particles', Particles)
app.use(Particles as any, {
  init: async (engine: any) => {
    await loadFull(engine)
  },
})
// console.log(globalcomponents);
app.use(globalcomponents)
// console.log(import.meta.env)
app.use(router)
app.use(pinia)
app.mount('#app')
