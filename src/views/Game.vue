<template>
    <div v-if="isGameDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>{{name}}</h1>
                        <Tag :value="statusText" :severity="statusSeverity"></Tag>
                    </div>
                    <div class="controls">
                        <template v-if="status === 'draft'">
                            <Button class="hidden md:inline-flex" icon="pi pi-check" label="Опубликовать" @click="checkValidity"/>
                            <Button class="md:hidden" icon="pi pi-check" @click="checkValidity"/>
                        </template>
                        <template v-if="status === 'planned'">
                            <Button class="hidden md:inline-flex" icon="pi pi-play" label="Начать"/>
                            <Button class="md:hidden" icon="pi pi-play"/>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6 sections">
                <div class="section-time" v-if="status === 'ongoing' || status === 'completed'">
                    <div class="time-panel">
                        <i class="pi pi-clock"></i>
                        <div class="passed-time">1:14:35:21</div>
                    </div>
                </div>
                <div class="section-info">
                    <h2>Об игре</h2>
                    <div class="card">
                        <div v-if="status === 'draft'" class="data-list">
                            <div class="key">Распорядитель:</div>
                            <div v-if="manager" class="value">{{manager.firstName}} {{manager.lastName}}</div>
                            <div v-else class="value p-text-secondary">Пусто</div>

                            <div class="key">Начало:</div>
                            <div v-if="dateStartView" class="value">{{dateStartView}}</div>
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
                            <template v-if="dateStartView">
                                <div class="key">Начало:</div>
                                <div class="value">{{dateStartView}}</div>
                            </template>
                            <template v-if="dateEndView">
                                <div class="key">Конец:</div>
                                <div class="value">{{dateEndView}}</div>
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
                                <div class="value">{{winner.firstName}} {{winner.lastName}}</div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="section-events">
                    <EventList :events="happenedEvents"/>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <PlayerList :players-by-district="players" @open-modal="openModalPlayer"/>
            </div>
        </div>
        <Dialog v-model:visible="modalPublishVisible" modal header="Вы действительно хотите оубликовать эту игру?" :style="{width: '600px'}">
            <p>Внимание: публикация игры приведет к тому, что она станет доступна всем пользователям. Отменить данное действие невозможно!</p>
            <template #footer>
                <Button label="Опубликовать" severity="success" @click="publishGameWrapper" autofocus/>
                <Button label="Отмена" class="bg-2" @click="modalPublishVisible = false" text/>
            </template>
        </Dialog>
        <Dialog v-if="currentPlayer" v-model:visible="modalPlayerVisible" modal :showHeader="false" :dismissableMask="true" :style="{width: '1100px'}">
            <PlayerInfo/>
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
import moment from "moment";
import EventList from "@/components/EventList.vue";
import PlayerList from "@/components/PlayerList.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import {mapActions, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";

export default {
    components: {
        PlayerList,
        EventList,
        PlayerInfo
    },
    data() {
        return {
            currentPlayer: null,
            betSum: null,
            modalPublishVisible: false,
            modalPlayerVisible: false,
            isGameDataLoaded: false
        }
    },
    computed: {
        ...mapState({
            requiredFields: state => state.game.requiredFields,
            id: state => state.game.id,
            name: state => state.game.name,
            arenaType: state => state.game.arenaType,
            arenaDescription: state => state.game.arenaDescription,
            dateStart: state => state.game.dateStart,
            dateEnd: state => state.game.dateEnd,
            status: state => state.game.status,
            description: state => state.game.description,
            manager: state => state.game.manager,
            winner: state => state.game.winner,
            happenedEvents: state => state.game.happenedEvents,
            players: state => state.game.players
        }),
        statusText() {
            return GAME_STATUS[this.status]
        },
        statusSeverity() {
            return GAME_STATUS_SEVERITY[this.status]
        },
        dateStartView() {
            return this.dateStart && moment(this.dateStart).format('DD.MM.YYYY HH:mm')
        },
        dateEndView() {
            return this.dateEnd && moment(this.dateEnd).format('DD.MM.YYYY HH:mm')
        }
    },
    methods: {
        ...mapActions({
            fetchGame: 'game/fetchGame',
            fetchHappenedEvents: 'game/fetchHappenedEvents',
            publishGame: 'game/publishGame'
        }),
        openModalPlayer(player) {
            this.currentPlayer = player;
            this.modalPlayerVisible = true;
        },
        checkValidity() {
            if (this.requiredFields.every(field => this[field] !== null)) {
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
        checkEvents() {
            this.fetchHappenedEvents({
                gameId: this.$route.params.id,
                after: this.happenedEvents[0].time
            });
        }
    },
    async mounted() {
        await this.fetchGame(this.$route.params.id);
        this.isGameDataLoaded = true;
        // TODO - watcher on status to start/stop polling
        // setInterval(this.checkEvents, 3000);
    }
}
</script>

<style scoped>
.time-panel {
    display: flex;
    column-gap: 1.5rem;
    align-items: center;
}

.time-panel > i {
    font-size: 4rem;
}

.time-panel .passed-time {
    font-size: 3rem;
    font-variant-numeric: tabular-nums;
}

.section-info .data-list {
    grid-template-columns: auto;
}

.bet-sum {
    margin-right: 0.5rem;
}

.progress-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Medium */
@media screen and (min-width: 768px) {
    .section-info .data-list {
        grid-template-columns: max-content auto;
    }
}
</style>