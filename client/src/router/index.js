import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../App.vue' // 例：元々あるホームページ
import TestView from '../pages/Test.vue'   // ★ 1. 作成したビューをインポート

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    // ... 他のルート ...
    { // ★ 2. 新しいルート設定を追加
        path: '/test',
        name: 'test',
        component: TestView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router