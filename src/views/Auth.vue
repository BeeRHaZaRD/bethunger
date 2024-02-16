<template>
    <div class="content-auth">
        <TabView>
            <TabPanel header="Авторизация">
                <div class="section">
                    <LoginForm/>
                </div>
            </TabPanel>
            <TabPanel header="Регистрация">
                <div class="section">
                    <RegisterForm/>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

export default {
    components: {RegisterForm, LoginForm}
}
</script>

<style scoped>
.content-auth {
    width: fit-content;
    margin: 0 auto;
}

.section {
    margin-top: 0.5rem;
}

.data-form {
    grid-template-columns: auto;
}
</style>