// 对上传服务的axios二次封装
import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from '@/store/modules/user'

// 创建axios实例
const anotherRequest = axios.create({
    baseURL: import.meta.env["VITE_APP_ANOTHER_API"], // .env 中配置
    timeout: 10000
})

// 请求拦截器
anotherRequest.interceptors.request.use((config) => {
    const userStore = useUserStore()
    if (userStore.token) {
        config.headers["token"] = userStore.token
    }
    return config
})

// 控制只提示一次 token 过期
let hasShownTokenError = false;

// 响应拦截器
anotherRequest.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        let message = '';
        const status = error.response?.status;

        switch (status) {
            case 401:
                message = "TOKEN过期 or 密码错误";
                if (!hasShownTokenError) {
                    hasShownTokenError = true;
                    ElMessage({ type: 'error', message, duration: 3000 });
                    const userStore = useUserStore();
                    setTimeout(() => {
                        userStore.userLogout();
                        window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
                    }, 2000);
                }
                break;
            case 403:
                message = "无权访问";
                break;
            case 404:
                message = "请求地址错误";
                break;
            case 500:
                message = "服务器出现问题";
                break;
            default:
                message = "网络出现问题";
                break;
        }

        if (status !== 401) {
            ElMessage({ type: 'error', message });
        }

        return Promise.reject(error);
    }
)

export default anotherRequest;
