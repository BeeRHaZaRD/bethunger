<template>
    <div class="data-form">
        <div class="field p-fluid">
            <label for="userAuthUsername">Логин</label>
            <InputText id="userAuthUsername" v-model="username" type="text" autofocus :class="{'p-invalid': v$.username.$error}"/>
            <small class="p-error">{{v$.username.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="userAuthPassword">Пароль</label>
            <InputText id="userAuthPassword" v-model="password" type="password" :class="{'p-invalid': v$.password.$error}"/>
            <small class="p-error">{{v$.password.$errors[0]?.$message}}</small>
        </div>

        <Button type="submit" label="Войти" :disabled="v$.$error" @click="loginWrapper"/>
    </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {defineComponent} from "vue";
import {alphaNum, maxLength, minLength, required} from "@/utils/localized-validators";
import {mapActions} from "vuex";

export default defineComponent({
    name: "LoginForm",
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            username: null,
            password: null
        }
    },
    validations() {
        return {
            username: {
                required: required(),
                minLength: minLength(3),
                maxLength: maxLength(32),
                alphaNum: alphaNum()
            },
            password: {
                required: required(),
                minLength: minLength(3),
                maxLength: maxLength(32),
                alphaNum: alphaNum()
            }
        }
    },
    methods: {
        ...mapActions({
            login: 'currentUser/login'
        }),
        async loginWrapper() {
            if (await this.v$.$validate() === false) return;
            try {
                await this.login({
                    username: this.username.trim(),
                    password: this.password.trim()
                });
                this.$router.push('/games');
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка авторизации', detail: e.response.data.detail, life: 3000 });
            }
        }
    }
})
</script>

<style scoped>

</style>