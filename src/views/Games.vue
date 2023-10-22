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
                <Column field="dateStart" header="Начало"></Column>
                <Column field="status" header="Статус"></Column>
                <Column field="winner.firstName" header="Победитель"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import {GAME_STATUS} from '@/enums/enums.js'
import {mapActions} from "vuex";
import {timestampToDateTime} from "@/util";
export default {
    data() {
        return {
            games: []
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
                game.dateStart = game.dateStart ? timestampToDateTime(game.dateStart) : null;
                game.status = game.status ? GAME_STATUS[game.status] : null;
                game.manager.fullName = game.manager ? (game.manager.firstName + ' ' + game.manager.lastName) : null;
                return game;
            });
        },
    },
    async mounted() {
        let allGames = await this.getAllGames();
        allGames = this.transformGamesData(allGames);
        this.games.push(...allGames);
    }

}
</script>

<style scoped>

</style>