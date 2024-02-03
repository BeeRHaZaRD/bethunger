import {createRouter, createWebHistory} from "vue-router";

import Games from "@/views/Games.vue";
import Game from "@/views/Game.vue";
import GameEdit from "@/views/GameEdit.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import Account from "@/views/Account.vue";
import Auth from "@/views/Auth.vue";

const routes = [
    {
        path: '/auth/login',
        component: Auth
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     component: Games,
    //     meta: {
    //         requireAuth: true
    //     }
    // },
    {
        path: '/games',
        component: Games,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/games/:id',
        component: Game,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/games/:id/edit',
        component: GameEdit,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/account',
        component: Account,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admin',
        component: AdminPanel,
        meta: {
            requireAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const requireAuth = to.matched.some(record => record.meta.requireAuth);

    if (requireAuth && !currentUser) {
        next('/auth/login');
        return;
    }

    if (to.path === '/auth/login' && currentUser) {
        next('/games');
    } else {
        next();
    }
});

export default router;