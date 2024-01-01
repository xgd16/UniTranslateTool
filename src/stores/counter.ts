import { defineStore } from 'pinia'
import type { PersistOptions } from 'pinia-plugin-persist'

const saveToDisk: PersistOptions = {
    enabled: true,
    strategies: [{
        storage: localStorage
    }]
}

export const useLoginLastStore = defineStore('loginLastStore', {
    state: () => ({
        serviceAddr: '',
        key: ''
    }),
    persist: saveToDisk
})

export const useLoginStore = defineStore('loginStore', {
    state: () => ({
        serviceAddr: '',
        key: ''
    }),
    actions: {
        isLogin (): boolean {
            return this.serviceAddr !== '' && this.key !== ''
        },
        save() {
            const loginLastStore = useLoginLastStore()
            loginLastStore.serviceAddr = this.serviceAddr
            loginLastStore.key = this.key
        }
    },
    persist: {
        enabled: true
    }
})