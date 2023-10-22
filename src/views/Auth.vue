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
                <div class="form-auth p-fluid">
                    <div class="field">
                        <label class="input-label" for="login">Логин</label>
                        <InputText id="login" v-model="credentials.login" type="text" autofocus/>
                    </div>
                    <div class="field">
                        <label class="input-label" for="password">Пароль</label>
                        <InputText id="password" v-model="credentials.password" type="password"/>
                    </div>
                    <Button type="submit" label="Войти" @click="authorize"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import {axiosInstance as axios} from "@/axios";

export default {
    data() {
        return {
            credentials: {
                login: "admin",
                password: "admin"
            }
        }
    },
    methods: {
        ...mapActions({
            login: 'currentUser/login',
            fetchBalance: 'account/fetchBalance',
        }),
        async authorize() {
            let login = this.credentials.login.trim();
            let password = this.credentials.password.trim();

            if (!login || !password) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Данные для входа указаны неверно', life: 3000 });
                return;
            }
            try {
                await this.login({login, password});
                await this.fetchBalance();
                this.$router.push('/games');
            } catch (e) {
                console.log(e);
            }
        }
    }
}
</script>

<style scoped>
.section-auth {
    max-width: 200px;
}
</style>