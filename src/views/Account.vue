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
                <InputNumber v-model="depositAmount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="100000" locale="ru" :input-style="{width: '10rem'}"/>
                <Button severity="success" label="Пополнить" @click="depositWrapper"/>
            </div>
        </OverlayPanel>

        <OverlayPanel ref="opWithdraw">
            <div class="op-content">
                <p class="op-title">Вывод средств</p>
                <InputNumber v-model="withdrawAmount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="100000" suffix=" &#8381;" :input-style="{width: '10rem'}"/>
                <Button severity="success" label="Вывести" @click="withdrawWrapper"/>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";

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
        ...mapActions({
            deposit: 'account/deposit',
            withdraw: 'account/withdraw'
        }),
        async depositWrapper() {
            await this.deposit(this.depositAmount);
            this.depositAmount = null;
            this.$refs.opDeposit.hide();
            this.$toast.add({ severity: 'success', summary: 'Успешное пополнение', detail: 'Счет пополнен на ' + this.depositAmount + ' Р', life: 5000 });
        },
        async withdrawWrapper() {
            await this.withdraw(this.depositAmount);
            this.withdrawAmount = null;
            this.$refs.opWithdraw.hide();
            this.$toast.add({ severity: 'success', summary: 'Успешное пополнение', detail: 'Средства выведены со счета: ' + this.withdrawAmount + ' Р', life: 5000 });
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