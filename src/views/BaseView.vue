
<template>
   <div class="w-full h-full flex flex-row" v-if="isLogin">
      <div :class="menuClass + ' h-full p-4 transition-all overflow-y-hidden'">
         <!-- 菜单控制按钮 -->
         <div class="absolute w-4 h-4 bg-slate-900 z-10 bottom-2 left-2 rounded-full leading-4 cursor-pointer hover:dark:bg-slate-800" @click="menuContorl">
            <i :class="menuControlButtonClass"></i>
         </div>
         <!-- 菜单 -->
         <div class="w-full h-full rounded-md dark:bg-slate-800 dark:highlight-white/5 drop-shadow-2xl px-1 py-1" >
            <!-- 菜单头部 -->
            <template v-if="!menuControlStatus" v-for="item in routeList">
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
import { useLoginStore } from '../stores/counter';
import { ref, watch, onMounted } from 'vue';
import router from '../router/index';

const loginStore = useLoginStore()

const isLogin = ref<boolean>(loginStore.isLogin())
// 监听登录状态
watch(loginStore, () => {
   isLogin.value = loginStore.isLogin()
})

// 监听路由变化
const routeList = router.getRoutes()

console.log(routeList)


const menuControlStatus = ref<boolean>(true)
const menuControlButtonClass = ref<string>('ri-arrow-left-line')
const menuItemClass = ref<string>('basis-3/12')
const menuClass = ref<string>('w-72')


// 处理菜单伸缩
const menuContorl = () => {
   if (menuControlStatus.value) {
      menuControlStatus.value = false
      menuControlButtonClass.value = 'ri-arrow-right-line'
      menuItemClass.value = 'w-full'
      menuClass.value = 'w-28'
   } else {
      menuControlStatus.value = true
      menuControlButtonClass.value = 'ri-arrow-left-line'
      menuItemClass.value = 'basis-3/12'
      menuClass.value = 'w-72'
   }
}

</script>