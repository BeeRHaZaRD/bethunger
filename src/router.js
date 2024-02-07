import {createRouter, createWebHistory} from "vue-router";

import Games from "@/views/Games.vue";
import Game from "@/views/Game.vue";
import GameEdit from "@/views/GameEdit.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import Account from "@/views/Account.vue";
import Auth from "@/views/Auth.vue";
import Page403 from "@/views/Page403.vue";
import Page404 from "@/views/Page404.vue";
import store from "@/store";

const routes = [
  {
    path: '/auth/login',
    component: Auth
  },
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
  },
  {
    path: '/forbidden',
    component: Page403
  },
  {
    path: '/not-found',
    component: Page404
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/games'
  },
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

  if (requireAuth && currentUser.role === 'USER') {
    store.dispatch('account/fetchBalance');
  }

  if (to.path.includes('/auth') && currentUser) {
    next('/games');
  } else {
    next();
  }
});

export default router;