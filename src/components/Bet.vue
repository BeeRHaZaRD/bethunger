<template>
    <div class="make-bet">
        <p class="bet-title mb-2">Ставка на {{player.fullName}}</p>
        <div class="bet-info mb-2">
            <div>
                <span class="key">Коэффициент:</span>
                <span v-if="odd" class="value">{{odd}}</span>
                <span v-else class="value">-</span>
            </div>
            <div>
                <span class="key">Выигрыш:</span>
                <span class="value">{{winning}}</span>
            </div>
        </div>
        <InputNumber v-model="amount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :max="100000" :useGrouping="false"
                     suffix=" &#8381;" :input-style="{width: '100px'}" @input="onInputUpdate"/>
        <Button severity="success" label="Поставить" :disabled="v$.$error" @click="makeBetWrapper"/>
        <small class="p-error">{{v$.amount.$errors[0]?.$message}}</small>
    </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {maxValue, minValue, required} from "@/utils/localized-validators";
import {mapActions} from "vuex";

export default {
    name: "Bet",
    emits: ['success'],
    props: {
        player: {
            type: Object,
            required: true
        },
        odd: {
            type: String
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            amount: null
        }
    },
    validations() {
        return {
            amount: {
                required: required(),
                minValue: minValue(10, '₽'),
                maxValue: maxValue(100000, '₽')
            }
        }
    },
    computed: {
        winning() {
            return (this.amount * this.odd).toFixed(2);
        }
    },
    methods: {
        ...mapActions({
            makeBet: 'game/makeBet'
        }),
        async makeBetWrapper() {
            if (await this.v$.$validate() === false) return;
            try {
                await this.makeBet({
                    playerId: this.player.id,
                    amount: this.amount
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Ставка совершена успешно', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка при совершении ставки', detail: e.response.data.detail, life: 5000 });
            }
        },
        onInputUpdate(event) {
            this.amount = event.value;
        }
    }
}
</script>

<style scoped>
.bet-title {
    font-size: 1.1rem;
}

.bet-info > div:not(:last-child) {
    margin-bottom: 0.5rem;
}

.bet-info .key {
    color: var(--text-color-secondary);
    margin-right: 0.5rem;
}

small {
    display: block;
    margin-top: 2px;
    margin-bottom: -5px;
}
</style>