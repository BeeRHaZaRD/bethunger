<template>
    <template v-if="isDataLoaded">
        <div class="wrapper mt-4">
            <h2>Данные о карте</h2>
            <div class="card-template mb-3">
                <div class="card-form">
                    <div class="field card-number">
                        <label for="cardNumber">Номер карты</label>
                        <InputMask id="cardNumber" v-model="card.number" mask="9999 9999 9999 9999"/>
                    </div>
                    <div class="field card-exp">
                        <label for="cardExp">Месяц/год</label>
                        <InputMask id="cardExp" v-model="card.expDate" mask="99/99"/>
                    </div>
                    <div class="field card-holder">
                        <label for="cardHolder">Владелец</label>
                        <InputText id="cardHolder" v-model="card.holder"/>
                    </div>
                    <div class="field card-cvv">
                        <label for="cardCvv">CVV2</label>
                        <InputMask id="cardCvv" v-model="card.cvv" mask="999" slotChar="*"/>
                    </div>
                </div>
            </div>
            <Button class="w-full" :label="actionString + amount + ' Р'" severity="success" @click="doPayment"/>
        </div>
    </template>
    <div v-else class="content-center">
        <ProgressSpinner strokeWidth="2"/>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import {delay} from "@/utils/util";

export default {
    name: "Payment",
    data() {
        return {
            action: this.$route.query.action,
            amount: this.$route.query.amount,
            card: {
                number: null,
                expDate: null,
                holder: null,
                cvv: null
            },
            isDataLoaded: false
        }
    },
    computed: {
        actionString() {
            return this.action === 'deposit' ? 'Пополнить на ' : 'Вывести ';
        }
    },
    methods: {
        ...mapActions({
            deposit: 'account/deposit',
            withdraw: 'account/withdraw'
        }),
        async depositWrapper() {
            try {
                await this.deposit(this.amount);
                this.$router.push('/account');
                this.$toast.add({ severity: 'success', summary: 'Успешное пополнение', detail: 'Счет пополнен на ' + this.amount + ' ₽', life: 5000 });
            } catch (e) {
                this.$router.push('/account');
                this.$toast.add({ severity: 'error', summary: 'Ошибка пополнения', detail: e.response.data.detail, life: 5000 });
            }
        },
        async withdrawWrapper() {
            try {
                await this.withdraw(this.amount);
                this.$router.push('/account');
                this.$toast.add({ severity: 'success', summary: 'Успешное снятие средств', detail:this.amount + ' ₽ выведены со счета', life: 5000 });
            } catch (e) {
                this.$router.push('/account');
                this.$toast.add({ severity: 'error', summary: 'Ошибка снятия средств', detail: e.response.data.detail, life: 5000 });
            }
        },
        doPayment() {
            if (this.action === 'deposit') {
                this.depositWrapper();
            } else {
                this.withdrawWrapper();
            }
        }
    },
    async mounted() {
        if (!this.$route.query.action || !this.$route.query.amount) {
            this.$router.push('/');
        }
        if (this.$route.query.action !== 'deposit' && this.$route.query.action !== 'withdraw') {
            this.$router.push('/');
        }
        await delay(3000);
        this.isDataLoaded = true;
    }

}
</script>

<style scoped>
.wrapper {
    width: 320px;
    margin: 0 auto;
}

.card-template {
    padding: 1rem;
    background-color: var(--bg-2);
    border: 1px solid var(--bg-3);
    border-radius: 6px;
}

.card-form {
    display: grid;
    grid-template-columns: auto 85px;
    gap: 1rem;
}

.card-form label {
    font-size: 0.9rem;
}

.card-form input {
    width: 100%;
}
</style>