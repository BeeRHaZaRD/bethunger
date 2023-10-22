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
                        <Button class="hidden md:inline-flex" label="Опубликовать" @click="checkValidity"/>
                        <Button class="md:hidden" icon="pi pi-check" @click="checkValidity"/>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6 sections">
                <div class="section-info">
                    <h2>Об игре</h2>
                    <div class="card">
                        <div class="data-list">
                            <template v-if="manager.firstName">
                                <div class="key">Распорядитель:</div>
                                <div class="value">{{manager.firstName}} {{manager.lastName}}</div>
                            </template>
                            <template v-if="dateStart">
                                <div class="key">Начало:</div>
                                <div class="value">{{dateStart}}</div>
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
                        </div>
                    </div>
                </div>
                <div class="section-events">
                    <EventList :events="happenedEvents"/>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <h2>Участники</h2>
                <PlayerList :players-by-district="playersByDistrict" @open-modal="openModalPlayer"/>
            </div>
        </div>
        <Dialog v-model:visible="modalPublishVisible" modal header="Вы действительно хотите оубликовать эту игру?" :style="{width: '600px'}">
            <p>Внимание: публикация игры приведет к тому, что она станет доступна всем пользователям. Отменить данное действие невозможно!</p>
            <template #footer>
                <Button label="Опубликовать" severity="success" @click="publishGameWrapper" autofocus/>
                <Button label="Отмена" class="bg-2" @click="modalPublishVisible = false" text />
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
import EventList from "@/components/EventList.vue";
import PlayerList from "@/components/PlayerList.vue";
import PlayerInfo from "@/components/PlayerInfo.vue";
import {mapActions, mapGetters, mapState} from "vuex";
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
        ...mapGetters({
            statusSeverity: 'game/statusSeverity',
            statusText: 'game/statusText',
            playersByDistrict: 'game/playersByDistrict'
        })
        // gameInfoValid() {
        //     return !isEmpty(this.game.name) && !isEmpty(this.game.arenaType) && this.game.manager.id !== null && !isEmpty(this.game.description);
        // },
        // playersValid() {
        //     return Object.values(this.playersByDistrict).every(pair => pair[0] && pair[1]);
        // }
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
            this.modalPublishVisible = true;
            // if (this.gameInfoValid && this.playersValid) {
            //     this.modalPublishVisible = true;
            // } else {
            //     this.$toast.add({ severity: 'error', summary: 'Ошибка публикации', detail: 'Данные об игре не заполнены', life: 3000 });
            // }
        },
        async publishGameWrapper() {
            await this.publishGame(this.$route.params.id);
            this.modalPublishVisible = false;
            // TODO
            // await this.fetchGame(this.$route.params.id);
            // this.$toast.add({ severity: 'success', summary: 'Игра успешно опубликована', life: 3000 });
            this.$router.go(0)
        },
        checkEvents() {
            setInterval(this.fetchHappenedEvents, 5000);
        }
    },
    async mounted() {
        await this.fetchGame(this.$route.params.id);
        this.isGameDataLoaded = true;
        // this.fetchHappenedEvents(this.$route.params.id);
    }
}
</script>

<style scoped>
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