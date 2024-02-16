<template>
    <div class="data-form">
        <div class="field p-fluid">
            <label for="userRegUsername">Логин</label>
            <InputText id="userRegUsername" v-model="username" type="text" autofocus :class="{'p-invalid': v$.username.$error}"/>
            <small class="p-error">{{v$.username.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="userRegPassword">Пароль</label>
            <InputText id="userRegPassword" v-model="password" type="password" :class="{'p-invalid': v$.password.$error}"/>
            <small class="p-error">{{v$.password.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="userRegConfirmPassword">Подтверждение пароля</label>
            <InputText id="userRegConfirmPassword" v-model="passwordConfirm" type="password" :class="{'p-invalid': v$.passwordConfirm.$error}"/>
            <small class="p-error">{{v$.passwordConfirm.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="userRegFirstName">Имя</label>
            <InputText id="userRegFirstName" v-model="firstName" type="text" :class="{'p-invalid': v$.firstName.$error}"/>
            <small class="p-error">{{v$.firstName.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="userRegLastName">Фамилия</label>
            <InputText id="userRegLastName" v-model="lastName" type="text" :class="{'p-invalid': v$.lastName.$error}"/>
            <small class="p-error">{{v$.lastName.$errors[0]?.$message}}</small>
        </div>

        <Button type="submit" label="Зарегистрироваться" :disabled="v$.$error" @click="registerWrapper"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {sameAs, alphaNum, maxLength, minLength, required} from "@/utils/localized-validators";
import {mapActions} from "vuex";

export default defineComponent({
    name: "RegisterForm",
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            username: null,
            password: null,
            passwordConfirm: null,
            firstName: null,
            lastName: null
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
            },
            passwordConfirm: {
                sameAsPassword: sameAs(this.password)
            },
            firstName: {
                required: required(),
                minLength: minLength(2),
                maxLength: maxLength(16)
            },
            lastName: {
                required: required(),
                minLength: minLength(2),
                maxLength: maxLength(16)
            },
        }
    },
    methods: {
        ...mapActions({
            login: 'currentUser/login',
            register: 'currentUser/register'
        }),
        async registerWrapper() {
            if (await this.v$.$validate() === false) return;
            try {
                await this.register({
                    username: this.username,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName
                });
                this.$router.push('/games');
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка регистрации', detail: e.response.data.detail, life: 3000 });
            }
        }
    }
})
</script>

<style scoped>

</style>