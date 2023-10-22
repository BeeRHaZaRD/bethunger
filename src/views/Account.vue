<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Аккаунт</h1>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="section section-balance">
                <h2>Управление балансом</h2>
                <p class="balance">Текущий баланс: <strong>{{balance}} &#8381;</strong></p>
                <div class="balance-buttons">
                    <Button label="Пополнить" @click="$refs.opReplenish.toggle($event)"/>
                    <Button label="Вывести"/>
                </div>
            </div>
        </div>

        <OverlayPanel ref="opReplenish">
            <div class="op-content">
                <p class="op-title">Пополнение баланса</p>
                <InputNumber v-model="depositAmount" class="replenish-sum" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="1000000" suffix=" &#8381;"/>
                <Button severity="success" label="Пополнить" @click="deposit(depositAmount)" />
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    data() {
        return {
            depositAmount: null
        }
    },
    computed: {
        ...mapState({
            balance: state => state.account.balance
        }),
    },
    methods: {
        ...mapActions({
            fetchBalance: 'account/fetchBalance',
            deposit: 'account/deposit'
        })
    },
    mounted() {
        this.fetchBalance();
    }
}
</script>

<style scoped>
.balance {
    margin-bottom: 1rem;
}

.balance-buttons > * {
    margin-right: 10px;
}

.replenish-sum {
    margin-right: 0.5rem;
}
</style>