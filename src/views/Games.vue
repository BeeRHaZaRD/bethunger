<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Все игры</h1>
                </div>
                <div class="controls">
                    <Button label="Создать игру" icon="pi pi-plus" iconPos="left"/>
                </div>
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="games" dataKey="id" selectionMode="single" @rowSelect="openGame">
                <Column field="name" header="Название"></Column>
                <Column field="manager.fullName" header="Распорядитель"></Column>
                <Column field="arenaType" header="Арена"></Column>
                <Column field="dateStartView" header="Начало"></Column>
                <Column header="Статус">
                    <template #body="{data}">
                        <span :class="'p-text-' + GAME_STATUS_SEVERITY[data.status]">{{GAME_STATUS[data.status]}}</span>
                    </template>
                </Column>
                <Column field="winner.firstName" header="Победитель"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import {mapActions} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
export default {
    data() {
        return {
            games: [],
            GAME_STATUS: GAME_STATUS,
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY
        }
    },
    methods: {
        ...mapActions({
            getAllGames: 'game/getAllGames'
        }),
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        },
        transformGamesData(games) {
            return games.map(game => {
                game.dateStartView = game.dateStart ? moment(game.dateStart).format('DD.MM.YYYY HH:mm') : null;
                game.manager.fullName = game.manager ? (game.manager.firstName + ' ' + game.manager.lastName) : null;
                return game;
            });
        },
    },
    async mounted() {
        let allGames = await this.getAllGames();
        if (allGames) {
            allGames = this.transformGamesData(allGames);
            this.games.push(...allGames);
        }
    }

}
</script>

<style scoped>

</style>