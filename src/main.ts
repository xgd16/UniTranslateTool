import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import { createPinia } from 'pinia'
import './assets/style/tailwind.css'

import router from './router'

import ElementPlus from 'element-plus'
import piniaPersist from 'pinia-plugin-persist'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'remixicon/fonts/remixicon.css'
import { useBaseConfigStore } from './stores/counter'

const pinia = createPinia()

pinia.use(piniaPersist)

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
