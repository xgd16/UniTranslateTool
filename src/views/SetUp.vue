<template>
    <div class="h-8 bg-slate-700 rounded-md leading-8 flex flex-row py-1 px-1 overscroll-y-none overflow-x-hidden">
        <button v-for="item in displayButtonList" class="bg-slate-600 mr-1 h-6 leading-6 px-2 rounded-md hover:bg-slate-500 transition-all" @click="scrollToElement(item.id)">{{ item.name }}</button>
    </div>

    <div class="mt-2 bg-slate-800 rounded-md overflow-y-auto px-2 py-1" style="height: calc(100% - 2.5rem);">
        <el-form  label-width="120px">
            <el-divider id="loginInfo"  class="bg-slate-700" content-position="left">登陆信息</el-divider>
            <el-form-item>
                <el-row :gutter="20" class="w-full">
                    <el-col :span="12">
                        <el-input class="w-full" v-model="formData.serviceAddr" placeholder="请输入服务地址"></el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-input class="w-full" v-model="formData.key" type="password" placeholder="请输入密钥" show-password></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-divider id="base" class="bg-slate-700" content-position="left">基本设置</el-divider>
            
            <el-form-item>
                <el-row :gutter="20" class="w-full">
                    <el-col :span="8">
                        <el-form-item label="默认菜单状态">
                            <el-switch v-model="formData.menuOpen"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-row :gutter="10" class="w-full">
                            <el-col :span="16">
                                <el-form-item label="文件输出地址">
                                    <el-input class="w-full" placeholder="" v-model="outputDirPath"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-button type="info" plain @click="selectDirPath">选择位置</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-button style="position: absolute;z-index: 20;"  class="right-21 bottom-5" type="info" @click="unLogin" plain>注销</el-button>
            <el-button style="position: absolute;z-index: 20;"  class="right-5 bottom-5" type="success" @click="submitButton" plain>提交</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { scrollToElement } from '../utils/common';
import { ref, reactive, onMounted } from 'vue';
import { useLoginLastStore, useLoginStore, useBaseConfigStore } from '../stores/counter';
import { ElMessage } from 'element-plus';
import router from '../router';
import { ipcRenderer } from 'electron';

const loginStore = useLoginStore()
const loginLastStore = useLoginLastStore()
const baseConfigStore = useBaseConfigStore()

const submitButton = () => {
    // 保存登陆信息
    loginStore.key = formData.key
    loginStore.serviceAddr = formData.serviceAddr
    loginStore.save()
    // 保存基础配置
    baseConfigStore.menuOpen = formData.menuOpen
    // 保存默认文件输出文件夹
    ipcRenderer.send('save-base-config', {
        path: outputDirPath.value
    })

    ElMessage({
        message: '保存成功',
        type: 'success'
    })
}

onMounted(() => {
    ipcRenderer.once('get-base-config-back', (e, data) => {
        outputDirPath.value = data.defaultOutPutPath
    })
    ipcRenderer.send('get-base-config')
})

const outputDirPath = ref('')
const selectDirPath = () => {
    // 开启事件订阅
    ipcRenderer.once('windows-select-dir-back', (e, data) => {
        if (data.path == '') {
            ElMessage({
                message: '没有选择任何文件。',
                grouping: true,
                type: 'warning',
            })
            return
        }
        outputDirPath.value = data.path
    })
    // 吊起选择文件夹
    ipcRenderer.send('windows-select-dir', {
      e: 'setUpOpenAddress'
    })
}


type labelPositionType = {
    id: string,
    name: string,
}


const displayButtonList = ref<labelPositionType[]>([
    {
        id: 'base',
        name: '基本设置'
    },
    {
        id: 'loginInfo',
        name: '登陆信息'
    }
])

const formData = reactive({
    serviceAddr: loginLastStore.serviceAddr,
    key: loginLastStore.key,
    menuOpen: baseConfigStore.menuOpen
})

const unLogin = () => {
    router.push('/login')
    loginStore.clean()
}

</script>

<style>
.el-divider__text {
    background-color: rgba(0, 0, 0, 0) !important;
}
</style>