<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Все турниры</h1>
                </div>
                <div class="controls">
                    <Button label="Создать игру" icon="pi pi-plus" iconPos="left" @click="openModal"/>
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
                <Column header="Победитель">
                    <template #body="{data}">
                        <span>{{data.winner?.fullName}}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <Dialog v-model:visible="modalVisible" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <h2>Новая игра</h2>
        <div class="data-form">
            <div class="field">
                <label for="gameName">Название</label>
                <InputText id="gameName" v-model="game.name" type="text"/>
            </div>
            <div class="field">
                <label for="gameManager">Распорядитель</label>
                <AutoComplete v-model="game.manager" input-id="gameManager" dropdown :suggestions="suggestedManagers" optionLabel="name" @complete="searchManager"/>
            </div>
        </div>
        <template #footer>
            <Button label="Создать игру" severity="success" :disabled="!game.name" @click="createGameWrapper"/>
        </template>
    </Dialog>
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
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY,
            modalVisible: false,
            game: {
                name: null,
                manager: null
            },
            suggestedManagers: null
        }
    },
    methods: {
        ...mapActions({
            getAllGames: 'game/getAllGames'
        }),
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        },
        // TODO remove dateStartView
        transformGamesData(games) {
            return games.map(game => {
                game.dateStartView = game.dateStart ? moment(game.dateStart).format('DD.MM.YYYY HH:mm') : null;
                game.manager.fullName = game.manager ? (game.manager.firstName + ' ' + game.manager.lastName) : null;
                return game;
            });
        },
        openModal() {
            this.modalVisible = true;
        },
        createGameWrapper() {

        },
        searchManager() {

        }
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