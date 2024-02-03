<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Все турниры</h1>
                </div>
                <div class="controls">
                    <Button label="Создать игру" icon="pi pi-plus" @click="openModal"/>
                </div>
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="games" dataKey="id" selectionMode="single" sort-field="id" :sort-order="1" @rowSelect="openGame">
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

    <Dialog v-model:visible="modalVisible" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <h2>Новая игра</h2>
        <div class="data-form">
            <div class="field p-fluid">
                <label for="gameName">Название</label>
                <InputText id="gameName" v-model="newGame.name" type="text"/>
            </div>
            <div class="field p-fluid">
                <label for="gameManager">Распорядитель</label>
                <AutoComplete v-model="newGame.manager" input-id="gameManager" dropdown :suggestions="suggestedManagers" optionLabel="fullName" @complete="searchManager"
                              :disabled="availableManagers.length === 0" :placeholder="availableManagers.length === 0 ? 'Нет доступных менеджеров' : ''"/>
            </div>
        </div>
        <template #footer>
            <Button label="Создать игру" severity="success" :disabled="!newGame.name.trim() || !newGame.manager?.id" @click="createGameWrapper"/>
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
            isAvailableManagersLoaded: false,
            availableManagers: [],
            suggestedManagers: [],
            newGame: {
                name: '',
                manager: null
            }
        }
    },
    methods: {
        ...mapActions({
            getAllGames: 'game/getAllGames',
            getAllManagers: 'game/getAllManagers',
            createGame: 'game/createGame'
        }),
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        },
        async openModal() {
            if (!this.isAvailableManagersLoaded) {
                this.availableManagers = await this.getAllManagers();
                this.isAvailableManagersLoaded = true;
            }
            this.modalVisible = true;
        },
        searchManager(event) {
            this.suggestedManagers = event.query
                ? this.availableManagers.filter(manager => manager.fullName.toLowerCase().includes(event.query.toLowerCase()))
                : [...this.availableManagers];
        },
        async createGameWrapper() {
            const game = await this.createGame(this.newGame);
            this.games.push(game);
            this.modalVisible = false;
            this.resetData();
            this.$toast.add({ severity: 'success', summary: 'Игра успешно создана', life: 3000 });
        },
        resetData() {
            this.newGame.name = '';
            this.newGame.manager = null;
            this.suggestedManagers = [];
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