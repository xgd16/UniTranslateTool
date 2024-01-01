<template>
    <div class="h-8 bg-slate-700 rounded-md leading-8 flex flex-row py-1 px-1 overscroll-y-none overflow-x-hidden">
        <button v-for="item in displayButtonList" class="bg-slate-600 h-6 leading-6 px-2 rounded-md" @click="scrollToElement(item.id)">{{ item.name }}</button>
    </div>

    <div class="mt-2 bg-slate-800 rounded-md overflow-y-auto" style="height: calc(100% - 2.5rem);">

    </div>
</template>

<script setup lang="ts">
import { scrollToElement } from '../utils/common';
import { ref } from 'vue';

type labelPositionType = {
    id: string,
    name: string,
}
const displayButtonList = ref<labelPositionType[]>([
    {
        id: 'test',
        name: '测试'
    }
])

</script>