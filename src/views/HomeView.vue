<template>
    <div class="h-8 bg-slate-700 rounded-md leading-8 flex items-center justify-center" >
        <el-form class="flex" size="small" :model="formData">
            <el-form-item style="margin-bottom: 0;">
                <el-select v-model="formData.platform" class="w-24 mr-2 select-none">
                    <el-option
                        v-for="item in selectTranslatePlatformList"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item class="flex-initial" style="margin-bottom: 0;">
                <el-select v-model="formData.fromLang">
                    <el-option
                        v-for="item in getSelectViewData('from')"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <i class="ri-arrow-left-right-fill flex-initial mx-2 cursor-pointer" @click="switchLang"></i>
            <el-form-item class="flex-initial" style="margin-bottom: 0;">
                <el-select v-model="formData.toLang">
                    <el-option
                        v-for="item in getSelectViewData('to')"
                        :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
                <el-button type="primary" class="mx-2" size="small" plain @click="translateEvent">翻译</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="flex flex-row pt-2" style="height: calc(100% - 2rem);" v-loading="loading">
        <div class="h-full basis-6/12 pr-1"><textarea class="h-full w-full resize-none bg-slate-800 rounded-md px-2 py-1" placeholder="请输入需要翻译的内容" @change="changeFormText" v-model="translateText.fromText"></textarea></div>
        <div class="h-full basis-6/12 pl-1"><textarea class="h-full w-full resize-none bg-slate-800 rounded-md px-2 py-1" readonly placeholder="结果会在这里。。。" v-model="translateText.toText"></textarea></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { getLangList } from '../api/translate';
import { langArr } from '../utils/common';
import { translate } from '../utils/translate';

const translateText = reactive({
    fromText: '',
    toText: ''
})

const loading = ref(false)

const translateEvent = async () => {
    loading.value = true
    translateText.toText = ''
    try {
        translateText.toText = await translate(translateText.fromText, formData.fromLang, formData.toLang, formData.platform)
    } catch {
        ElNotification({
            message: '翻译失败',
            title: '异常提示',
            type: 'error',
            duration: 1000,
        })
    }
    loading.value = false
}

const changeFormText = () => {
    if (translateText.fromText == '') translateText.toText = ''
}

type selectDataType = {
    label: string,
    value: string
}

const autoLang: string = ''

const getSelectViewData = (type: string) => {
    if (type == 'from') {
        return selectViewData.value
    } else {
        return selectViewData.value.slice(1, -1)
    }
}

const formData = reactive({
    fromLang: 'auto',
    toLang: 'en',
    platform: ''
})

const switchLang = () => {
    const fromLang = formData.fromLang
    const toLang = formData.toLang
    if (fromLang == toLang) return false
    if (fromLang == 'auto' && autoLang == '') {
        ElNotification({
            message: '自动检测语言需要先输入内容翻译一次',
            title: '异常提示',
            type: 'warning',
            duration: 1000,
        })
        return false
    }
    if (fromLang == 'auto' && autoLang != '') {
        formData.fromLang = toLang
        formData.toLang = autoLang
        return false
    }

    formData.fromLang = toLang
    formData.toLang = fromLang
}

const selectViewData = ref<selectDataType[]>([
    {
        label: '自动检测',
        value: 'auto'
    }
])

const selectTranslatePlatformList = ref<selectDataType[]>([
    {
        label: '自动',
        value: ''
    },
    {
        label: '百度翻译',
        value: 'Baidu'
    },
    {
        label: '有道翻译',
        value: 'YouDao'
    },
    {
        label: '谷歌翻译',
        value: 'Google'
    },
    {
        label: 'Deepl',
        value: 'Deepl'
    },
    {
        label: 'ChatGPT',
        value: 'ChatGPT'
    },
    {
        label: '讯飞',
        value: 'XunFei'
    },
    {
        label: '讯飞 (niu)',
        value: 'XunFeiNiu'
    }
])

onMounted(() => {
    getLangList().then(res => {
        if (res.code != 1000) return

        for (const key in res.data) {
            selectViewData.value.push({
                label: langArr[res.data[key]],
                value: key
            })
        }
    })
})

</script>