import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeViewVue from '../views/HomeView.vue'
import LoginViewVue from '../views/LoginView.vue'
import { useLoginStore } from '../stores/counter'
import SetUpVue from '../views/SetUp.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: HomeViewVue,
            meta: {
                title: "首页",
                icon: "ri-home-6-line"
            }
        },
        {
            path: '/login',
            component: LoginViewVue,
            meta: {
                noLogin: true,
                notView: true
            }
        },
        {
            path: '/setup',
            component: SetUpVue,
            meta: {
                title: '设置',
                icon: 'ri-settings-3-line'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const loginStore = useLoginStore()

    if (!loginStore.isLogin() && !to.meta.noLogin) {
        return next({ path: '/login' })
    }
    return next();
})

export default router