import { createApp, Directive } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { loadAllPlugins } from './plugins'
import '@/styles/index.scss'
import 'normalize.css'
import * as directives from '@/directives'
import '@/router/permission'
import loadSvg from '@/icons'

const app = createApp(App)
// 加载所有插件
loadAllPlugins(app)
// 加载全局SVG
loadSvg(app)
// 自定义指令
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})

app.use(store).use(router).mount('#app')
