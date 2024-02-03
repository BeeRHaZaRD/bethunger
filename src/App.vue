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
                    <Button label="Выйти" @click="logoutWrapper" icon="pi pi-sign-out"/>
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
            <div class="footer"></div>
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
                    command: this.logoutWrapper
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
            setUser: 'currentUser/setUser'
        }),
        ...mapActions({
            fetchBalance: 'account/fetchBalance',
            setAxiosToken: 'currentUser/setAxiosToken',
            logout: 'currentUser/logout'
        }),
        closeSidebar() {
            this.sidebarVisible = false;
        },
        toggleUserMenu(event) {
            this.$refs.userMenu.toggle(event);
        },
        logoutWrapper() {
            this.logout();
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
.first-lower {
    display: inline-block;
}

.first-lower::first-letter {
    text-transform: lowercase;
}

.monospaced {
    font-variant-numeric: tabular-nums;
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

.footer {
    height: 5rem;
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

.content-header,
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.content-header .title h1,
.section-header .title h2 {
    margin-bottom: 0;
}

.content-header .title {
    display: flex;
    height: fit-content;
    align-items: center;
    column-gap: 1rem;
}

.section-header {
    margin-bottom: 1rem;
}

.section-header:has(.controls) {
    margin-bottom: 0.75rem;
}

.card {
    background-color: var(--bg-2);
    padding: 0.9rem 1rem 1rem 1rem;
    border-radius: 6px;
}

.data-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 2rem;
}

.data-list {
    display: grid;
    row-gap: 0.857rem;
    column-gap: 1rem;
    line-height: 1.4rem;
}

.data-list .key {
    font-weight: 500;
    color: var(--text-color-secondary);
}

.op-title {
    margin-bottom: 1rem;
}

.progress-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.player-card .section-info {
    display: flex;
    column-gap: 1rem;
    align-items: center;
}

.player-card .section-info .avatar {
    text-align: center;
    margin-bottom: 0.5rem;
}

.player-card .section-info .title {
    margin-bottom: 0.25rem;
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