<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>История ставок</h1>
                </div>
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="bets" dataKey="id" sort-field="id" :sort-order="1">
                <template #empty>
                    <div class="text-center text-color-secondary">Нет данных</div>
                </template>
                <template #loading>
                    <div class="text-center text-color-secondary">Загрузка данных...</div>
                </template>
                <Column field="id" header="№" style="width: 5%"></Column>
                <Column field="game.name" header="Игра"></Column>
                <Column header="Игрок">
                    <template #body="{data}">
                        <span>{{data.player.firstName + ' ' + data.player.lastName}}</span>
                    </template>
                </Column>
                <Column header="Коэфф." style="width: 12%">
                    <template #body="{data}">
                        <span>{{data.player.odd.toFixed(2)}}</span>
                    </template>
                </Column>
                <Column header="Результат" style="width: 18%">
                    <template #body="{data}">
                        <span>{{BET_STATUS[data.status]}}</span>
                    </template>
                </Column>
                <Column header="Сумма" style="width: 12%">
                    <template #body="{data}">
                        <span>{{data.amount}} ₽</span>
                    </template>
                </Column>
                <Column header="Итог" style="width: 10%">
                    <template #body="{data}">
                        <span v-if="data.status === 'WIN'" class="p-text-green">+{{data.amount * data.player.odd}} ₽</span>
                        <span v-else-if="data.status === 'LOSS'" class="p-text-red">-{{data.amount}} ₽</span>
                        <span v-else>—</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import {BET_STATUS} from "@/enums/enums";

export default {
    name: "BetHistory",
    data() {
        return {
            BET_STATUS: BET_STATUS,
            bets: null
        }
    },
    methods: {
        ...mapActions({
            getAllBets: 'commons/getAllBets'
        })
    },
    async mounted() {
        try {
            this.bets = await this.getAllBets();
        } catch {}
    }
}
</script>

<style scoped>

</style>