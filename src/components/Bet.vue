<template>
    <div class="make-bet">
        <p class="mb-2">Ставка на {{player.fullName}}</p>
        <div class="data-list mb-2">
            <div class="key">Коэффициент:</div>
            <div class="value">{{coefficient}}</div>
        </div>
        <InputNumber v-model="amount" class="mr-2" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false"
                     suffix=" &#8381;" :input-style="{width: '100px'}" @input="onInputUpdate"/>
        <Button severity="success" label="Поставить" :disabled="v$.$error" @click="makeBetWrapper"/>
        <small class="p-error">{{v$.amount.$errors[0]?.$message}}</small>
    </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {maxValue, minValue, required} from "@/utils/localized-validators";

export default {
    name: "Bet",
    props: {
        player: {
            type: Object,
            required: true
        },
        coefficient: {
            type: Number,
            required: true
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
    methods: {
        async makeBetWrapper() {
            if (await this.v$.$validate() === false) return;
            // TODO
        },
        onInputUpdate(event) {
            this.amount = event.value;
        }
    }
}
</script>

<style scoped>
.data-list {
    grid-template-columns: max-content auto;
}

small {
    display: block;
    margin-top: 2px;
    margin-bottom: -5px;
}
</style>