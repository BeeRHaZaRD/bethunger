<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Все турниры</h1>
                </div>
                <div class="controls">
                    <Button v-if="isAdmin" label="Создать игру" icon="pi pi-plus" @click="visibleModals.gameCreate = true"/>
                </div>
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="games" dataKey="id" selectionMode="single" sort-field="id" :sort-order="1" @rowSelect="openGame">
                <template #empty>
                    <div class="text-center text-color-secondary">Нет данных</div>
                </template>
                <template #loading>
                    <div class="text-center text-color-secondary">Загрузка данных...</div>
                </template>
                <Column field="name" header="Название"></Column>
                <Column field="manager.fullName" header="Распорядитель"></Column>
                <Column field="arenaType" header="Арена"></Column>
                <Column field="dateStart" header="Начало"></Column>
                <Column header="Статус">
                    <template #body="{data}">
                        <span>{{GAME_STATUS[data.status]}}</span>
                    </template>
                </Column>
                <Column header="Победитель">
                    <template #body="{data}">
                        <span>{{data.winner?.fullName}}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <Dialog v-model:visible="visibleModals.gameCreate" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <GameCreate @success="addCreatedGame"/>
    </Dialog>
</template>

<script>
import moment from "moment";
import {mapActions, mapGetters} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import GameCreate from "@/components/GameCreate.vue";
export default {
    components: {GameCreate},
    data() {
        return {
            games: [],
            GAME_STATUS: GAME_STATUS,
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY,
            visibleModals: {
                gameCreate: false
            }
        }
    },
    computed: {
        ...mapGetters({
            isAdmin: 'currentUser/isAdmin'
        })
    },
    methods: {
        ...mapActions({
            getAllGames: 'game/getAllGames'
        }),
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        },
        addCreatedGame(game) {
            this.games.push(game);
            this.visibleModals.gameCreate = false;
        }
    },
    async mounted() {
        const games = await this.getAllGames();
        this.games.push(...games);
    }

}
</script>

<style scoped>
.data-form {

}
</style>