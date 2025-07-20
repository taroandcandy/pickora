import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下的对应变量
  let env = loadEnv(mode, process.cwd())
  // console.log('当前代理路径：', env.VITE_APP_BASE_API, env.VITE_SERVE)
  // console.log('完整env:', env)

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        // 保证开发阶段能用mock
        localEnabled: command === 'serve',
        // localEnabled: false,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // javascriptEnabled: true,
          additionalData: '@use "@/styles/variable.scss" as *;'
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        // 放在[]中表示是变量，会解析，否则是字符串
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址
          target: env.VITE_SERVE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: path => path.replace(/^\/api/, '')
          // rewrite: (path) => path
        },
        [env.VITE_APP_ANOTHER_API]: {
          target: env.VITE_ANOTHER_SERVE,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_ANOTHER_API}`), '')
        }
      }
    },

  }
})
