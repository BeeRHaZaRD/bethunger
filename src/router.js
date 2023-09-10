import {createRouter, createWebHistory} from "vue-router";

import Games from "@/views/Games.vue";
import Game from "@/views/Game.vue";
import Account from "@/views/Account.vue";

const routes = [
    {
        path: "/:pathMatch(.*)*",
        component: Games,
        // meta: {
        //     requiresAuth: true
        // }
    },
    {
        path: "/account",
        component: Account
    },
    {
        path: "/games/:id",
        component: Game
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
//     const isAuth = localStorage.getItem('accessToken');
//     if (to.meta.requiresAuth && !isAuth)
//         next({name: 'login'});
//     else
//         next();
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (store.getters.accessToken) {
//             next();
//         } else {
//             next('/login');
//         }
//     } else {
//         if (to.name === 'login') {
//             next('/calendar');
//         } else {
//             next();
//         }
//     }
// });

export default router;