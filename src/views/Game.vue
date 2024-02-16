<template>
    <div v-if="isDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>{{name}}</h1>
                        <Tag :value="GAME_STATUS[status]" :severity="GAME_STATUS_SEVERITY[status]"></Tag>
                    </div>
                    <div class="controls" v-if="isManager || isAdmin">
                        <template v-if="status === 'DRAFT' || status === 'PLANNED'">
                            <Button class="hidden md:inline-flex" icon="pi pi-file-edit" label="Редактировать" outlined @click="$router.push($route.path + '/edit')"/>
                            <Button class="md:hidden" icon="pi pi-file-edit" outlined @click="$router.push($route.path + '/edit')"/>
                        </template>
                        <template v-if="status === 'DRAFT'">
                            <Button class="hidden md:inline-flex" icon="pi pi-check" label="Опубликовать" @click="confirmPublish"/>
                            <Button class="md:hidden" icon="pi pi-check" @click="confirmPublish"/>
                        </template>
                        <template v-else-if="status === 'PLANNED'">
                            <Button class="hidden md:inline-flex" icon="pi pi-play" label="Начать" @click="confirmStart"/>
                            <Button class="md:hidden" icon="pi pi-play" @click="confirmStart"/>
                        </template>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <div class="section-time mb-5" v-if="status === 'ONGOING' || status === 'COMPLETED'">
                    <div class="time-panel">
                        <i class="pi pi-clock"></i>
                        <div class="time-passed monospaced">
                            <span v-if="status === 'ONGOING'">{{timeLeft}}</span>
                            <span v-else>{{durationString}}</span>
                        </div>
                    </div>
                </div>
                <div class="section-info mb-5">
                    <div class="section-header">
                        <div class="title">
                            <h2>Об игре</h2>
                        </div>
                    </div>
                    <div class="card">
                        <div class="data-list">
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

                            <template v-if="winner">
                                <div class="key">Победитель:</div>
                                <div class="value">{{winner.fullName}}</div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="section-planned-events mb-5" v-if="isManager || isAdmin">
                    <PlannedEventList :planned-events="plannedEvents" title="Планировка событий"/>
                </div>
                <div class="section-items mb-5" v-if="(isManager || isAdmin) && (status === 'DRAFT' || status === 'PLANNED')">
                    <ItemList :items="items" title="Предметы"/>
                </div>
                <div class="section-events" v-if="status === 'ONGOING' || status === 'COMPLETED'">
                    <HappenedEventList :events="happenedEvents" title="Ход игры"/>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <PlayerList :players="players"/>
            </div>
        </div>
        <Dialog v-model:visible="modalPublishVisible" modal header="Вы действительно хотите оубликовать эту игру?" :style="{width: '600px'}">
            <p>Внимание: публикация игры приведет к тому, что она станет доступна всем пользователям. Отменить данное действие невозможно!</p>
            <template #footer>
                <Button label="Опубликовать" severity="success" @click="publishGameWrapper"/>
                <Button label="Отмена" severity="secondary" text class="bg-2" @click="modalPublishVisible = false"/>
            </template>
        </Dialog>
        <Dialog v-model:visible="modalStartVisible" modal header="Вы действительно хотите запустить эту игру?" :style="{width: '600px'}">
            <p>Внимание: убедитесь, что все готово для запуска игры. Отменить данное действие невозможно!</p>
            <template #footer>
                <Button label="Запустить" severity="success" @click="startGameWrapper"/>
                <Button label="Отмена" severity="secondary" text class="bg-2" @click="modalStartVisible = false"/>
            </template>
        </Dialog>
    </div>
    <div v-else class="content-center">
        <ProgressSpinner strokeWidth="2"/>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import PlayerList from "@/components/PlayerList.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import ItemList from "@/components/ItemList.vue";
import HappenedEventList from "@/components/HappenedEventList.vue";
import PlannedEventList from "@/components/PlannedEventList.vue";
import {dateTimeToIso, dateTimeToString, formatTime} from "@/utils/util";
import {isGameInfoValid, isPlayersTrainResultsFull} from "@/utils/validations";
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
            modalStartVisible: false,
            eventPollingId: null,
            timer: null
        }
    },
    computed: {
        ...mapState({
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
            happenedEvents: state => state.game.happenedEvents,
            plannedEvents: state => state.game.plannedEvents,
            players: state => state.game.players,
            items: state => state.game.items
        }),
        ...mapGetters({
            isUser: 'currentUser/isUser',
            isManager: 'currentUser/isManager',
            isAdmin: 'currentUser/isAdmin',
            playersNum: 'game/playersNum'
        }),
        dateStartString() {
            return dateTimeToString(this.dateStart);
        },
        durationString() {
            const duration = moment.duration(this.duration, 'seconds');
            return formatTime(duration.days(), duration.hours(), duration.minutes(), duration.seconds());
        },
        timeLeft() {
            const timer = this.timer;
            return formatTime(timer.days, timer.hours, timer.minutes, timer.seconds);
        },
    },
    watch: {
        status(newStatus, oldStatus) {
            if (oldStatus !== null && newStatus !== null) {
                this.$router.go(0);
            }
        }
    },
    methods: {
        ...mapMutations({
            setIsEditMode: 'game/setIsEditMode',
            resetGame: 'game/resetGame'
        }),
        ...mapActions({
            fetchGame: 'game/fetchGame',
            fetchHappenedEvents: 'game/fetchHappenedEvents',
            publishGame: 'game/publishGame',
            startGame: 'game/startGame'
        }),
        confirmPublish() {
            if (!isGameInfoValid({name: this.name, description: this.description, arenaType: this.arenaType, arenaDescription: this.arenaDescription, dateStart: this.dateStart})) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка публикации игры', detail: 'Информация об игре не заполнена', life: 3000 });
                return;
            }
            if (this.playersNum !== 24) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка публикации игры', detail: 'Не все игроки добавлены', life: 3000 });
                return;
            }
            this.modalPublishVisible = true;
        },
        async publishGameWrapper() {
            this.modalPublishVisible = false;
            try {
                await this.publishGame(this.$route.params.id);
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка публикации игры', detail: e.response.data.detail, life: 3000 });
            }
        },
        confirmStart() {
            if (!isPlayersTrainResultsFull(this.players)) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка запуска игры', detail: 'Не у всех игроков заполнены результаты тренировок', life: 3000 });
                return;
            }
            if (this.dateStart > new Date()) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка запуска игры', detail: 'Дата начала игры еще не наступила', life: 3000 });
                return;
            }
            this.modalStartVisible = true;
        },
        async startGameWrapper() {
            this.modalStartVisible = false;
            try {
                await this.startGame(this.$route.params.id);
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка запуска игры', detail: e.response.data.detail, life: 3000 });
            }
        },
        pollEvents() {
            if (this.status !== 'ONGOING')
                return
            this.eventPollingId = setInterval(() => {
                this.fetchHappenedEvents({
                    gameId: this.$route.params.id,
                    after: this.happenedEvents.length > 0 ? this.happenedEvents[0].happenedAt : dateTimeToIso(this.dateStart)
                })
            }, 5000);
        }
    },
    async mounted() {
        try {
            await this.fetchGame(this.$route.params.id);
            this.setIsEditMode(false);
            this.isDataLoaded = true;

            if (this.status === 'ONGOING') {
                this.timer = useStopwatch(Math.round((new Date() - this.dateStart) / 1000), true);
            }
            this.pollEvents();
        } catch {}
    },
    beforeUnmount() {
        if (this.eventPollingId) {
            clearInterval(this.eventPollingId);
            this.eventPollingId = null;
        }
        // for the watcher to work correctly
        if (this.isDataLoaded) {
            this.resetGame();
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
}

.section-info .data-list {
    grid-template-columns: auto;
}

/* Medium */
@media screen and (min-width: 768px) {
    .section-info .data-list {
        grid-template-columns: max-content auto;
    }
}
</style>