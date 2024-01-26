<template>
    <div class="wrapper">
        <div class="topbar-wrapper">
            <div class="topbar">
                <div class="topbar-left">
                    <div class="sidebar-burger">
                        <Button icon="pi pi-bars" plain text size="large" @click="sidebarVisible = true"/>
                    </div>
                </div>
                <div class="topbar-right" v-if="isUserAuthorized">
                    <div class="balance">
                        <div class="p-text-secondary">Баланс</div>
                        <div>{{userBalance}} &#8381;</div>
                    </div>
                    <Button :label="userFullName" @click="toggleUserMenu" text icon="pi pi-user"/>
                    <Menu ref="userMenu" :model="userMenuItems" :popup="true"/>
                </div>
            </div>
        </div>
        <div class="sidebar-wrapper" :class="{'active': sidebarVisible}">
            <div class="sidebar">
                <router-link class="logo" to="/" @click.native="closeSidebar">BH</router-link>
                <div class="main-menu">
                    <router-link class="main-menu-item" to="/" @click.native="closeSidebar">
                        <i class="pi pi-home"></i>
                    </router-link>
                    <router-link class="main-menu-item" to="/admin" @click.native="closeSidebar">
                        <i class="pi pi-th-large"></i>
                    </router-link>
                    <router-link class="main-menu-item" to="/account" @click.native="closeSidebar">
                        <i class="pi pi-wallet"></i>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="sidebar-bg" :class="{'active': sidebarVisible}" @click="sidebarVisible = false"></div>
        <div class="content-wrapper">
            <div class="content">
                <router-view/>
            </div>
        </div>
    </div>
    <Toast position="bottom-right"/>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
export default {
    data() {
        return {
            sidebarVisible: false,
            userMenuItems: [
                { label: 'Профиль', icon: 'pi pi-fw pi-user' },
                { label: 'Настройки', icon: 'pi pi-fw pi-cog' },
                { separator: true },
                {
                    label: 'Выход',
                    icon: 'pi pi-fw pi-sign-out',
                    command: this.logout
                },
            ]
        }
    },
    computed: {
        ...mapState({
            userBalance: state => state.account.balance,
            isUserAuthorized: state => state.currentUser.isAuthorized
        }),
        ...mapGetters({
            userFullName: 'currentUser/fullName'
        })
    },
    methods: {
        ...mapMutations({
            setIsAuthorized: 'currentUser/setIsAuthorized'
        }),
        ...mapActions({
            fetchBalance: 'account/fetchBalance',
            setUser: 'currentUser/setUser',
            setAxiosToken: 'currentUser/setAxiosToken',
            logout: 'currentUser/logout'
        }),
        closeSidebar() {
            this.sidebarVisible = false;
        },
        toggleUserMenu(event) {
            this.$refs.userMenu.toggle(event);
        }
    },
    created() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            this.setAxiosToken(JSON.parse(localStorage.getItem('authToken')));
            this.setUser(currentUser);
            this.fetchBalance();
        }
    }
}
</script>

<style>
textarea {
    display: block;
}

.topbar-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding: 0 1rem;
    height: 70px;
    background-color: var(--bg-1);
    border-bottom: 1px solid var(--bg-3);
    z-index: 200;
}

.topbar {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
}

.topbar > div {
    display: flex;
    align-items: center;
}

.topbar-right {
    column-gap: 1rem;
}

.topbar .balance {
    text-align: right;
}

.balance > div:nth-child(1) {
    margin-bottom: 0.1rem;
}

.balance > div:nth-child(2) {
    font-weight: 500;
}

.content-wrapper {
    min-height: 100vh;
    padding-left: 1rem;
    padding-right: 1rem;
}

.sidebar-wrapper {
    min-height: 100vh;
    position: fixed;
    width: 70px;
    background-color: var(--bg-2);
    transform: translateX(-70px);
    z-index: 300;
    transition: transform .2s;
}

.sidebar-wrapper.active {
    transform: translateX(0);
}

.sidebar-bg {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.35);
    opacity: 0;
    visibility: hidden;
    z-index: 299;
    transition: opacity .2s, visibility .2s;

}

.sidebar-bg.active {
    opacity: 1;
    visibility: visible;
}

.sidebar .logo {
    display: block;
    padding: 20px 0;
    color: #DE9B00;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
}

.main-menu-item {
    display: block;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
    padding: 15px 0;
}

.main-menu-item > i {
    font-size: 1.5rem;
}

.main-menu-item.router-link-active,
.main-menu-item:hover {
    color: #D8D8D8;
}

.main-menu-item.router-link-active {
    background-color: var(--bg-1);
}

.content-wrapper {
    position: relative;
    padding-top: 90px;
    z-index: 100;
}

.content-header {
    display: flex;
    justify-content: space-between;
}

.content-header .title {
    display: flex;
    height: fit-content;
    align-items: center;
    column-gap: 1rem;
}

.sections > div:not(:last-child) {
    margin-bottom: 2rem;
}

.card {
    background-color: var(--bg-2);
    padding: 0.9rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.data-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 2rem;
}

.data-form .field {
    width: auto;
}

.data-list {
    display: grid;
    gap: 0.75rem 1rem;
    line-height: 1.4rem;
}

.data-list .key {
    font-weight: 500;
    color: var(--text-color-secondary);
}

.op-title {
    margin-bottom: 1rem;
}

/* X-small */
@media screen and (min-width: 0px) {

}
/* Small */
@media screen and (min-width: 576px) {

}
/* Medium */
@media screen and (min-width: 768px) {
    .sidebar-wrapper {
        transform: translateX(0);
    }

    .sidebar-burger {
        display: none;
    }

    .content-wrapper {
        padding-left: 5rem;
        padding-right: 5rem;
        margin-left: 70px;
    }

    .topbar-wrapper {
        padding: 0 5rem;
        left: 70px;
    }
}
/* Large */
@media screen and (min-width: 992px) {
}
/* X-large */
@media screen and (min-width: 1200px) {

}

</style>