<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Авторизация</h1>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="section section-auth">
                <div class="data-form">
                    <div class="field p-fluid">
                        <label for="username">Логин</label>
                        <InputText id="username" v-model="credentials.username" type="text" autofocus/>
                    </div>
                    <div class="field p-fluid">
                        <label for="password">Пароль</label>
                        <InputText id="password" v-model="credentials.password" type="password"/>
                    </div>
                    <Button type="submit" label="Войти" :disabled="!credentials.username.trim() || !credentials.password.trim()" @click="loginWrapper"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    data() {
        return {
            credentials: {
                username: "admin",
                password: "admin"
            }
        }
    },
    methods: {
        ...mapActions({
            login: 'currentUser/login'
        }),
        async loginWrapper() {
            let username = this.credentials.username.trim();
            let password = this.credentials.password.trim();

            try {
                await this.login({username, password});
                this.$router.push('/games');
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка авторизации', detail: e.response.data.detail, life: 3000 });
            }
        }
    }
}
</script>

<style scoped>
.section-auth {
    max-width: 200px;
}

.data-form {
    grid-template-columns: auto;
}
</style>