import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from "@/App.vue";
import {createApp} from "vue";

const router = createRouter({
        history: createWebHistory(),
        routes
})

createApp(App).use(router).mount('#app')