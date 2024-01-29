<template>
    <div v-if="isDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>{{name}}</h1>
                        <Tag :value="GAME_STATUS[status]" :severity="GAME_STATUS_SEVERITY[status]"></Tag>
                    </div>
                    <div class="controls">
                        <template v-if="status === 'DRAFT' || status === 'PLANNED'">
                            <Button class="hidden md:inline-flex" icon="pi pi-file-edit" label="Редактировать" outlined @click="$router.push($route.path + '/edit')"/>
                            <Button class="md:hidden" icon="pi pi-file-edit" outlined/>
                        </template>
                        <template v-if="status === 'DRAFT'">
                            <Button class="hidden md:inline-flex" icon="pi pi-check" label="Опубликовать" @click="checkValidity"/>
                            <Button class="md:hidden" icon="pi pi-check" @click="checkValidity"/>
                        </template>
                        <template v-else-if="status === 'PLANNED'">
                            <Button class="hidden md:inline-flex" icon="pi pi-play" label="Начать"/>
                            <Button class="md:hidden" icon="pi pi-play"/>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <div class="section-time mb-5" v-if="status === 'ONGOING' || status === 'COMPLETED'">
                    <div class="time-panel">
                        <i class="pi pi-clock"></i>
                        <div class="time-passed">
                            <span v-if="status === 'ONGOING'">{{timeLeft}}</span>
                            <span v-else>{{durationString}}</span>
                        </div>
                    </div>
                </div>
                <div class="section-info mb-5">
                    <h2>Об игре</h2>
                    <div class="card">
                        <div v-if="status === 'DRAFT'" class="data-list">
                            <div class="key">Распорядитель:</div>
                            <div v-if="manager" class="value">{{manager.firstName}} {{manager.lastName}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>

                            <div class="key">Начало:</div>
                            <div v-if="dateStart" class="value">{{dateStartString}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>

                            <div class="key">Тип арены:</div>
                            <div v-if="arenaType" class="value">{{arenaType}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>

                            <div class="key">Описание арены:</div>
                            <div v-if="arenaDescription" class="value">{{arenaDescription}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>

                            <div class="key">Описание турнира:</div>
                            <div v-if="description" class="value">{{description}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>
                        </div>
                        <div v-else class="data-list">
                            <template v-if="manager">
                                <div class="key">Распорядитель:</div>
                                <div class="value">{{manager.firstName}} {{manager.lastName}}</div>
                            </template>
                            <template v-if="dateStart">
                                <div class="key">Начало:</div>
                                <div class="value">{{dateStartString}}</div>
                            </template>
                            <template v-if="arenaType">
                                <div class="key">Тип арены:</div>
                                <div class="value">{{arenaType}}</div>
                            </template>
                            <template v-if="arenaDescription">
                                <div class="key">Описание арены:</div>
                                <div class="value">{{arenaDescription}}</div>
                            </template>
                            <template v-if="description">
                                <div class="key">Описание турнира:</div>
                                <div class="value">{{description}}</div>
                            </template>
                            <template v-if="winner">
                                <div class="key">Победитель:</div>
                                <div class="value">{{winner.fullName}}</div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="section-events mb-5">
                    <h2>Ход игры</h2>
                    <HappenedEventList :events="happenedEvents"/>
                </div>
                <div class="section-planned-events mb-5">
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
        <Dialog v-model:visible="modalPublishVisible" modal header="Вы действительно хотите оубликовать эту игру?" :style="{width: '600px'}">
            <p>Внимание: публикация игры приведет к тому, что она станет доступна всем пользователям. Отменить данное действие невозможно!</p>
            <template #footer>
                <Button label="Опубликовать" severity="success" @click="publishGameWrapper"/>
                <Button label="Отмена" class="bg-2" @click="modalPublishVisible = false" text/>
            </template>
        </Dialog>
        <OverlayPanel ref="opMakeBet">
            <div class="op-content">
                <p class="op-title">Ставка</p>
                <InputNumber v-model="betSum" class="bet-sum" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="1000000" suffix=" &#8381;"/>
                <Button severity="success" label="Поставить"/>
            </div>
        </OverlayPanel>
    </div>
    <div v-else class="progress-spinner">
        <ProgressSpinner strokeWidth="2"/>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import PlayerList from "@/components/PlayerList.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import ItemList from "@/components/ItemList.vue";
import HappenedEventList from "@/components/HappenedEventList.vue";
import PlannedEventList from "@/components/PlannedEventList.vue";
import {dateTimeToString, formatTimer} from "@/util";
import {useStopwatch} from 'vue-timer-hook';
import moment from "moment/moment";

export default {
    components: {PlannedEventList, ItemList, PlayerList, HappenedEventList, PlayerInfo},
    data() {
        return {
            GAME_STATUS: GAME_STATUS,
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY,
            isDataLoaded: false,
            betSum: null,
            modalPublishVisible: false,
            eventPollingId: null
        }
    },
    computed: {
        ...mapState({
            publishRequiredFields: state => state.game.publishRequiredFields,
            id: state => state.game.id,
            name: state => state.game.name,
            arenaType: state => state.game.arenaType,
            arenaDescription: state => state.game.arenaDescription,
            dateStart: state => state.game.dateStart,
            duration: state => state.game.duration,
            status: state => state.game.status,
            description: state => state.game.description,
            manager: state => state.game.manager,
            winner: state => state.game.winner,
            eventTypes: state => state.game.eventTypes,
            happenedEvents: state => state.game.happenedEvents,
            plannedEvents: state => state.game.plannedEvents,
            players: state => state.game.players,
            items: state => state.game.items
        }),
        dateStartString() {
            return dateTimeToString(this.dateStart);
        },
        durationString() {
            const duration = moment.duration(this.duration, 'seconds');
            return formatTimer(duration.days(), duration.hours(), duration.minutes(), duration.seconds());
        },
        timeLeft() {
            const timer = useStopwatch(Math.round((new Date() - this.dateStart) / 1000), true);
            return formatTimer(timer.days.value, timer.hours.value, timer.minutes.value, timer.seconds.value);
        },
    },
    methods: {
        ...mapMutations({
            setIsEditMode: 'game/setIsEditMode'
        }),
        ...mapActions({
            fetchGame: 'game/fetchGame',
            fetchHappenedEvents: 'game/fetchHappenedEvents',
            publishGame: 'game/publishGame'
        }),
        checkValidity() {
            if (this.publishRequiredFields.every(field => this[field] !== null)) {
                this.modalPublishVisible = true;
            } else {
                this.$toast.add({ severity: 'error', summary: 'Ошибка публикации', detail: 'Данные об игре не заполнены', life: 3000 });
            }
        },
        async publishGameWrapper() {
            this.modalPublishVisible = false;
            await this.publishGame(this.$route.params.id);
            this.$toast.add({ severity: 'success', summary: 'Игра успешно опубликована', life: 3000 });
        },
        pollEvents() {
            if (this.status !== 'ONGOING')
                return
            this.eventPollingId = setInterval(() => {
                this.fetchHappenedEvents({
                    gameId: this.$route.params.id,
                    after: this.happenedEvents[0].happenedAt
                })
            }, 10000);
        }
    },
    async mounted() {
        await this.fetchGame(this.$route.params.id);
        this.setIsEditMode(false);

        this.isDataLoaded = true;

        // TODO watcher on status to start/stop polling
        // this.pollEvents();
    },
    beforeUnmount() {
        if (this.eventPollingId) {
            clearInterval(this.eventPollingId);
            this.eventPollingId = null;
        }
    }
}
</script>

<style scoped>
.content-header .controls {
    display: flex;
    align-items: center;
    column-gap: 1rem;
}

.controls > button {
    height: fit-content;
}

.time-panel {
    display: flex;
    column-gap: 1.5rem;
    align-items: center;
}

.time-panel > i {
    font-size: 4rem;
}

.time-panel .time-passed {
    font-size: 3rem;
    font-variant-numeric: tabular-nums;
}

.section-info .data-list {
    grid-template-columns: auto;
}

.bet-sum {
    margin-right: 0.5rem;
}

/* Medium */
@media screen and (min-width: 768px) {
    .section-info .data-list {
        grid-template-columns: max-content auto;
    }
}
</style>