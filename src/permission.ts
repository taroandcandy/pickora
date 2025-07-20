// 做路由鉴权，某个路由什么条件下可以访问，什么条件下不能访问
import setting from "./setting";
import router from "./router";
// 引入进度条及其样式
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
// 取消进度条加载时的小圈
nprogress.configure({ showSpinner: false });
// 获取用户相关的小仓库内部token数据
import pinia from "./store";
import useUserStore from "./store/modules/user";
// 传入小仓库前要先传入大仓库pinia
const userStore = useUserStore(pinia)
// 全局守卫：项目当中任意路由切换都会出发的钩子

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    document.title = `${setting.title} - ${to.meta["title"]}`
    nprogress.start()
    try {
        // 获取token，去判断用户是否登录
        let token = userStore.token
        let username = userStore.username
        // 登录成功
        if (token) {
            if (to.path == '/login') {
                next({ path: '/' })
            } else {
                if (username) {
                    next()
                } else {
                    // 在访问每个路由前获取用户信息
                    // 优化：pinia持久化,路由拦截器中判断token是否过期，再进行路由跳转
                    try {
                        await userStore.userInfo()
                        next()
                    } catch (error) {
                        // token过期时执行
                        // 用户手动修改本地存储token
                        // 退出登录->用户相关的数据清空
                        await userStore.userLogout()
                        next({ path: '/login', query: { redirect: to.path } })
                    }
                }
            }
        } else {
            // 未登录
            if (to.path == '/login') {
                next()
            } else {
                next({ path: '/login', query: { redirect: to.path } })
            }
        }
    } catch (error) {
        console.error("路由跳转出错：", error)
        next('/login')
    }
    // next()
})

// 全局后置守卫
router.afterEach((to, from) => {
    nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[访问时指向首页],其余的路由可以访问