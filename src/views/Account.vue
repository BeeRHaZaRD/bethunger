<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Счет</h1>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="section section-balance">
                <h3 class="balance">
                    <span>Текущий баланс:</span>
                    <span class="font-semibold ml-2" v-if="balance !== null">{{balance}} &#8381;</span>
                </h3>
                <div class="balance-buttons">
                    <Button class="mr-3" label="Пополнить" @click="$refs.opDeposit.toggle($event)"/>
                    <Button label="Вывести" @click="$refs.opWithdraw.toggle($event)"/>
                </div>
            </div>
        </div>

        <OverlayPanel ref="opDeposit">
            <div class="op-content">
                <p class="op-title">Пополнение счета</p>
                <InputNumber v-model="depositAmount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="100000" suffix=" &#8381;" :input-style="{width: '10rem'}"/>
                <Button severity="success" label="Пополнить" :disabled="!depositAmount" @click="requestDeposit"/>
            </div>
        </OverlayPanel>

        <OverlayPanel ref="opWithdraw">
            <div class="op-content">
                <p class="op-title">Вывод средств</p>
                <InputNumber v-model="withdrawAmount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="100000" suffix=" &#8381;" :input-style="{width: '10rem'}"/>
                <Button severity="success" label="Вывести" :disabled="!withdrawAmount" @click="requestWithdraw"/>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    data() {
        return {
            depositAmount: null,
            withdrawAmount: null
        }
    },
    computed: {
        ...mapState({
            balance: state => state.account.balance
        })
    },
    methods: {
        requestDeposit() {
            this.$router.push(`/payment?action=deposit&amount=${this.depositAmount}`);
        },
        requestWithdraw() {
            this.$router.push(`/payment?action=withdraw&amount=${this.withdrawAmount}`);
        }
    }
}
</script>

<style scoped>
.balance {
    margin-bottom: 1.5rem;
}

.deposit-amount {
    margin-right: 0.5rem;
}
</style>