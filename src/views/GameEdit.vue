<template>
    <div v-if="isDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>Редактирование игры</h1>
                        <Tag :value="statusText" :severity="statusSeverity"></Tag>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6 sections">
                <div class="section-info">
                    <h2>Информация об игре</h2>
                    <div class="w-min">
                        <div class="field">
                            <label for="gameName">Название</label>
                            <InputText id="gameName" v-model="game.name" type="text" disabled/>
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
                        <Button class="w-full mt-2" label="Сохранить" severity="success" @click="updateGameInfoWrapper"/>
                    </div>
                </div>
                <div class="section-planned-events">
                    <h2>Планировка событий</h2>
                    <PlannedEventList :planned-events="plannedEvents" :event-types="eventTypes"/>
                </div>
                <div class="section-items">
                    <h2>Предметы</h2>
                    <ItemList :items="items"/>
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
<!--    <PlayerTrainsEdit :player=""/>-->
</template>

<script>
import ItemList from "@/components/ItemList.vue";
import HappenedEventList from "@/components/HappenedEventList.vue";
import PlayerList from "@/components/PlayerList.vue";
import PlannedEventList from "@/components/PlannedEventList.vue";
import PlayerTrainsEdit from "@/components/PlayerTrainsEdit.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import moment from "moment/moment";

export default {
    name: "GameEdit",
    components: {PlayerTrainsEdit, PlannedEventList, PlayerList, HappenedEventList, ItemList},
    data() {
        return {
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
        }),
        statusText() {
            return GAME_STATUS[this.status]
        },
        statusSeverity() {
            return GAME_STATUS_SEVERITY[this.status]
        }
    },
    methods: {
        ...mapMutations({
            setPageMode: 'game/setPageMode'
        }),
        ...mapActions({
            fetchGame: 'game/fetchGame',
            fetchHappenedEvents: 'game/fetchHappenedEvents',
            updateGameInfo: 'game/updateGameInfo',
            publishGame: 'game/publishGame'
        }),
        setGame() {
            this.game.name = this.name;
            this.game.description = this.description;
            this.game.arenaType = this.arenaType;
            this.game.arenaDescription = this.arenaDescription;
            this.game.dateStart = this.dateStart ? moment(this.dateStart).format("DD.MM.YYYY HH:mm") : null;
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
        this.setGame();
        this.setPageMode('EDIT');

        this.isDataLoaded = true;
    },
}
</script>

<style scoped>

</style>