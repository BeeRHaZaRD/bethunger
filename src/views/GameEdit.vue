<template>
    <div v-if="isDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>Редактирование игры</h1>
                        <Tag :value="GAME_STATUS[status]" :severity="GAME_STATUS_SEVERITY[status]"></Tag>
                    </div>
                    <div class="controls">
                        <Button label="К игре" icon="pi pi-link" outlined @click="$router.push('/games/' + $route.params.id)"/>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <div class="section-info mb-5">
                    <div class="section-header">
                        <div class="title">
                            <h2>Информация об игре</h2>
                        </div>
                    </div>
                    <div class="data-form w-min">
                        <div class="field">
                            <label for="gameName">Название</label>
                            <InputText id="gameName" v-model="game.name" type="text" :class="{'p-invalid': !game.name.trim()}"/>
                        </div>
                        <div class="field">
                            <label for="gameDescription">Описание</label>
                            <Textarea id="gameDescription" v-model="game.description" autoResize rows="3" cols="50"/>
                        </div>
                        <div class="field">
                            <label for="arenaType">Тип арены</label>
                            <InputText id="arenaType" v-model="game.arenaType" type="text"/>
                        </div>
                        <div class="field">
                            <label for="arenaDescription">Описание арены</label>
                            <Textarea id="arenaDescription" v-model="game.arenaDescription" autoResize rows="3" cols="50"/>
                        </div>
                        <div class="field">
                            <label for="dateStart">Время начала</label>
                            <Calendar v-model="game.dateStart" input-id="dateStart" showTime hourFormat="24" :min-date="new Date()" :panel-style="{width: '359px'}"/>
                        </div>
                        <Button class="w-full mt-2" label="Сохранить" severity="success" :disabled="!game.name.trim()" @click="updateGameInfoWrapper"/>
                    </div>
                </div>
                <div class="section-planned-events mb-5">
                    <PlannedEventList :planned-events="plannedEvents" :event-types="eventTypes" title="Запланированные события"/>
                </div>
                <div class="section-items">
                    <ItemList :items="items" title="Предметы"/>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <PlayerList :players-by-district="players" :game-status="status"/>
            </div>
        </div>
    </div>
    <div v-else class="progress-spinner">
        <ProgressSpinner strokeWidth="2"/>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import ItemList from "@/components/ItemList.vue";
import HappenedEventList from "@/components/HappenedEventList.vue";
import PlayerList from "@/components/PlayerList.vue";
import PlannedEventList from "@/components/PlannedEventList.vue";
import PlayerTrainsEdit from "@/components/PlayerTrainsEdit.vue";

export default {
    name: "GameEdit",
    components: {PlayerTrainsEdit, PlannedEventList, PlayerList, HappenedEventList, ItemList},
    data() {
        return {
            GAME_STATUS: GAME_STATUS,
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY,
            isDataLoaded: false,
            game: {
                name: null,
                description: null,
                arenaType: null,
                arenaDescription: null,
                dateStart: null
            }
        }
    },
    computed: {
        ...mapState({
            id: state => state.game.id,
            name: state => state.game.name,
            description: state => state.game.description,
            arenaType: state => state.game.arenaType,
            arenaDescription: state => state.game.arenaDescription,
            dateStart: state => state.game.dateStart,
            status: state => state.game.status,
            eventTypes: state => state.game.eventTypes,
            plannedEvents: state => state.game.plannedEvents,
            items: state => state.game.items,
            players: state => state.game.players
        })
    },
    methods: {
        ...mapMutations({
            setIsEditMode: 'game/setIsEditMode',
            resetGame: 'game/resetGame'
        }),
        ...mapActions({
            fetchGame: 'game/fetchGame',
            fetchHappenedEvents: 'game/fetchHappenedEvents',
            updateGameInfo: 'game/updateGameInfo',
            publishGame: 'game/publishGame'
        }),
        setGameData() {
            this.game.name = this.name;
            this.game.description = this.description;
            this.game.arenaType = this.arenaType;
            this.game.arenaDescription = this.arenaDescription;
            this.game.dateStart = this.dateStart;
        },
        async updateGameInfoWrapper() {
            await this.updateGameInfo({
                gameId: this.$route.params.id,
                game: this.game
            });
            this.$toast.add({ severity: 'success', summary: 'Игра успешно обновлена', life: 3000 });
        }
    },
    async mounted() {
        await this.fetchGame(this.$route.params.id);
        if (this.status === 'ONGOING') {
            this.$router.go(-1);
        } else {
            this.setGameData();
            this.setIsEditMode(true);
            this.isDataLoaded = true;
        }
    },
    beforeUnmount() {
        // for the watcher to work correctly
        this.resetGame();
    }
}
</script>

<style scoped>
.data-form {
    grid-template-columns: auto;
}
</style>