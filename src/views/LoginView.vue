
<template>
    <div class="flex justify-center items-center h-screen" >
      <div class="text-center py-3 px-1 w-96">
        <el-form ref="formRef" :model="form" label-width="80px">
            <el-form-item label="服务地址" prop="serviceAddr" :rules="[
                { required: true, message: '请输入服务地址', trigger: 'blur' },
                { type: 'url', message: '请输入正确的服务地址', trigger: 'blur'}
            ]">
                <el-input v-model="form.serviceAddr" placeholder="请输入服务地址"></el-input>
            </el-form-item>
            <el-form-item label="密钥" :rules="[
                { required: true, message: '请输入密钥', trigger: 'blur' }
            ]">
                <el-input v-model="form.key" type="password" placeholder="请输入密钥" show-password></el-input>
            </el-form-item>
            <el-form-item class="">
                <el-button type="primary" @click="loginEvent(formRef)" plain>登录</el-button>
            </el-form-item>
        </el-form>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useLoginStore, useLoginLastStore } from '../stores/counter';
import { reactive,ref } from 'vue';
import { ElMessage,FormInstance } from 'element-plus';
import router from '../router/index';

const loginStore = useLoginStore()
const loginLastStore = useLoginLastStore()

const form = reactive({
    serviceAddr: loginLastStore.serviceAddr,
    key: loginLastStore.key,
})

const formRef = ref<FormInstance>()

const loginEvent = (formEl: FormInstance | undefined) => {
    if (!formEl) return

    formEl.validate((valid) => {
        if (valid) {
            loginStore.serviceAddr = form.serviceAddr
            loginStore.key = form.key
            loginStore.save()
            return router.push({ path: '/' })
        } else {
            ElMessage({
                message: '登录失败',
                type: 'error'
            })
            return false
        }
    })
}

</script>