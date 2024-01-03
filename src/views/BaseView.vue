
<template>
   <div class="w-full h-full flex flex-row" v-if="isLogin">
      <div :class="menuClass + ' h-full p-4  overflow-y-hidden'">
         <!-- 菜单控制按钮 -->
         <div class="absolute w-4 h-4 bg-slate-900 z-10 bottom-2 left-2 rounded-full leading-4 cursor-pointer hover:dark:bg-slate-800" @click="menuControlStatus = !menuControlStatus">
            <i :class="menuControlButtonClass"></i>
         </div>
         <!-- 菜单 -->
         <div class="w-full h-full rounded-md dark:bg-slate-800 dark:highlight-white/5 drop-shadow-2xl px-1 py-1" >
            <!-- 菜单头部 -->
            <div  class="h-5 overflow-hidden leading-5 w-full bg-slate-700 highlight-white/5 rounded-md flex flex-row cursor-pointer hover:bg-slate-600 select-none mb-2">
               <div class="basis-1/3 text-center bg-red-900 hover:bg-red-700" @click="closeWindow">
                  <i class="ri-close-fill"></i>
               </div>
               <div class="basis-1/3 text-center bg-yellow-900 hover:bg-yellow-700" @click="minWindow">
                  <i class="ri-subtract-fill"></i>
               </div>
               <div class="basis-1/3 text-center bg-green-900 hover:bg-green-700" @click="fullScreenWindow">
                  <i class="ri-expand-left-right-line" v-if="!windowSize"></i>
                  <i class="ri-contract-left-right-line" v-else></i>
               </div>
            </div>
            <template  v-if="!menuControlStatus" v-for="item in routeList">
               <el-tooltip
                  v-if="!item.meta.notView"
                  class="box-item"
                  effect="dark"
                  :content="item.meta.title"
                  placement="right-start"
               >
                  <div class="h-10 w-full bg-slate-700 highlight-white/5 rounded-md flex flex-row cursor-pointer hover:bg-slate-600 select-none mb-2" @click="router.push({path: item.path})" >
                     <div :class="menuItemClass + ' text-center'">
                        <i :class="item.meta.icon + ' leading-10'" ></i>
                     </div>
                     <div v-if="menuControlStatus" class="basis-9/12 leading-10 pl-2" >{{item.meta.title}}</div>
                  </div>
               </el-tooltip>
            </template>

            <template v-else v-for="item in routeList">
               <div v-if="!item.meta.notView"  class="h-10 w-full bg-slate-700 highlight-white/5 rounded-md flex flex-row cursor-pointer hover:bg-slate-600 select-none mb-2" @click="router.push({path: item.path})">
                  <div :class="menuItemClass + ' text-center'">
                     <i :class="item.meta.icon + ' leading-10'" ></i>
                  </div>
                  <div v-if="menuControlStatus" class="basis-9/12 leading-10 pl-2" >{{item.meta.title}}</div>
               </div>
            </template>
         </div>
      </div>
      <div class="basis-full h-full pr-4 py-4">
         <div class="h-full w-full overflow-y-hidden">
            <RouterView />
         </div>
      </div>
   </div>
   <RouterView v-else />
</template>

<script setup lang="ts">
import { useLoginStore, useBaseConfigStore } from '../stores/counter';
import { ref, watch, onMounted } from 'vue';
import {ipcRenderer} from "electron";
import router from '../router/index';

const loginStore = useLoginStore()
const baseConfigStore = useBaseConfigStore()

const isLogin = ref<boolean>(loginStore.isLogin())
const menuControlStatus = ref<boolean>(false)


// false 为小窗口 true 为大窗口
const windowSize = ref<boolean>(false)
ipcRenderer.removeAllListeners('windowResizeEvent');
ipcRenderer.on('windowResizeEvent', (e, value) => {
   windowSize.value = value
})

const closeWindow = () => {
   ipcRenderer.send("windows-close")
}

const fullScreenWindow = () => {
   ipcRenderer.send('windows-max')
}

const minWindow = () => {
   ipcRenderer.send('windows-min');
}


onMounted(() => {
   menuControlStatus.value = baseConfigStore.menuOpen

   initMenu()
}),

// 监听登录状态
watch(loginStore, () => {
   isLogin.value = loginStore.isLogin()
})


// 监听路由变化
const routeList = router.getRoutes()

const menuControlButtonClass = ref<string>('ri-arrow-left-line')
const menuItemClass = ref<string>('basis-3/12')
const menuClass = ref<string>('w-72')


// 处理菜单伸缩
watch(menuControlStatus, () => {
   initMenu()
})

watch(baseConfigStore, () => {
   menuControlStatus.value = baseConfigStore.menuOpen
})

const initMenu = () => {
   if (!menuControlStatus.value) {
      menuControlButtonClass.value = 'ri-arrow-right-line'
      menuItemClass.value = 'w-full'
      menuClass.value = 'w-28'
   } else {
      menuControlButtonClass.value = 'ri-arrow-left-line'
      menuItemClass.value = 'basis-3/12'
      menuClass.value = 'w-72'
   }
}

</script>