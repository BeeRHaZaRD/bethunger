<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>{{game.name}}</h1>
                    <Tag :value="game.status" :severity="gameStatusSeverity"></Tag>
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
                        <div class="key">Распорядитель:</div>
                        <div class="value">{{game.manager.firstName}} {{game.manager.lastName}}</div>
                        <div class="key">Начало:</div>
                        <div class="value">{{game.dateStart}}</div>
                        <div class="key">Арена:</div>
                        <div class="value">{{game.arenaType}}. {{game.arenaDescription}}</div>
                        <div class="key">Описание:</div>
                        <div class="value">{{game.description}}</div>
                    </div>
                </div>
            </div>
            <div class="section-events">
                <h2>Ход игры</h2>
                <div class="card">
                    <div class="data-list">
                        <template v-for="event in gameEvents" :key="event.id">
                            <div class="key">{{event.time}}</div>
                            <div class="value">
                                <span v-if="event.participantName" class="p-text-blue">{{event.participantName + ' '}}</span>
                                <span v-if="event.type === 'randomEvent'">Началось <span class="p-text-orange">событие</span> - </span>
                                <span>{{event.message}}</span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <h2>Участники</h2>
            <div class="participants">
                <div class="header text-center">Дистрикт</div>
                <div class="header text-center">Мужчина</div>
                <div class="header text-center">Женщина</div>
                <template v-for="(participants, district) in participantsByDistrict" :key="district">
                    <div class="district">{{district}}</div>
                    <template v-for="p in participants">
                        <div v-if="p" class="item" @click="openModalParticipant(p)">
                            <div class="avatar">
                                <Avatar size="large" shape="circle"></Avatar>
                            </div>
                            <div class="item-data">
                                <div class="name">{{p.firstName}} {{p.lastName}}</div>
                                <div class="buttons">
                                    <Button label="Ставка x1.5" severity="secondary" @click.stop="$refs.opMakeBet.toggle($event)"></Button>
                                    <Button class="lg:hidden xl:inline-flex" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                                    <Button class="hidden lg:inline-flex xl:hidden" label="Спонсировать" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="item item-empty p-text-secondary">Пусто</div>
                    </template>
                </template>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="modalPublishVisible" modal header="Вы действительно хотите оубликовать эту игру?" :style="{width: '600px'}">
        <p class="p-text-secondary">Внимание: публикация игры приведет к тому, что она станет доступна всем пользователям. Отменить данное действие невозможно!</p>
        <template #footer>
            <Button label="Опубликовать" severity="success" @click="publishGame" autofocus/>
            <Button label="Отмена" class="bg-2" @click="modalPublishVisible = false" text />
        </template>
    </Dialog>
    <Dialog v-if="currentParticipant" v-model:visible="modalParticipantVisible" modal :showHeader="false" :dismissableMask="true" :style="{width: '1100px'}">
        <ParticipantInfo/>
        <!-- TODO -->
    </Dialog>
    <OverlayPanel ref="opMakeBet">
        <div class="op-content">
            <p class="op-title">Ставка</p>
            <InputNumber v-model="betSum" class="bet-sum" :minFractionDigits="0" :maxFractionDigits="2" :useGrouping="false" :min="10" :max="1000000" suffix=" &#8381;"/>
            <Button severity="success" label="Поставить"/>
        </div>
    </OverlayPanel>
    <Toast position="bottom-right"/>
</template>

<script>
import ParticipantInfo from "@/components/ParticipantInfo.vue";
export default {
    components: {
        ParticipantInfo
    },
    data() {
        return {
            game: {
                id: 75,
                name: "Голодные игры #75",
                arenaType: "Джунгли",
                arenaDescription: "Состоит из 12 секторов, в каждом из которых по очереди активируется определенное опасное явление. Рог Изобилия находится посередине и представляет собой остров, окруженный соленой водой.",
                dateStart: "23.06.2145",
                status: "В процессе",
                manager: {
                    id: 0,
                    firstName: "Плутарх",
                    lastName: "Хэвенсби"
                },
                description: "Квартальная бойня. Все участники являются победителями прошлых игр. Единственный источник воды - стволы деревьев, растущие в лесу."
            },
            gameEvents: [
                {
                    id: 5,
                    type: "other",
                    time: "17:10:34",
                    participantName: "Блеск Ритчсон",
                    message: "достиг Рога Изобилия"
                },
                {
                    id: 4,
                    type: "injury",
                    time: "16:20:07",
                    participantName: "Майкл Уарен",
                    message: "получил легкое ранение"
                },
                {
                    id: 3,
                    type: "randomEvent",
                    time: "14:00:00",
                    participantName: null,
                    message: "Метеоритный дождь"
                },
                {
                    id: 2,
                    type: "supply",
                    time: "13:34:51",
                    participantName: "Энобария Голдинг",
                    message: "получила от спонсора предмет - антидот"
                },
                {
                    id: 1,
                    type: "injury",
                    time: "12:05:44",
                    participantName: "Финник Одэйр",
                    message: "получил легкое ранение"
                },
                {
                    id: 0,
                    type: "gameStarted",
                    time: "12:05:44",
                    participantName: null,
                    message: "Игра началась"
                }
            ],
            participantsByDistrict: {
                1: [
                    {
                        id: 0,
                        firstName: "Блеск",
                        lastName: "Ритчсон",
                        age: 20,
                        gender: "m",
                        state: "well"
                    },
                    {
                        id: 1,
                        firstName: "Кашмира",
                        lastName: "Ритчсон",
                        age: 20,
                        gender: "f",
                        state: "well"
                    }
                ],
                2: [
                    {
                        id: 3,
                        firstName: "Брут",
                        lastName: "Ганн",
                        age: 20,
                        gender: "m",
                        state: "well"
                    },
                    {
                        id: 4,
                        firstName: "Энобария",
                        lastName: "Голдинг",
                        age: 20,
                        gender: "f",
                        district: 2,
                        state: "well"
                    }
                ],
                3: [
                    {
                        id: 5,
                        firstName: "Бити",
                        lastName: "Литье",
                        age: 20,
                        gender: "m",
                        state: "well"
                    },
                    {
                        id: 6,
                        firstName: "Вайресс",
                        lastName: null,
                        age: 20,
                        gender: "f",
                        state: "well"
                    }
                ],
                4: [
                    {
                        id: 7,
                        firstName: "Финник",
                        lastName: "Одэйр",
                        age: 20,
                        gender: "m",
                        state: "well"
                    },
                    null
                ],
                5: [
                    {
                        id: 9,
                        firstName: "Джеймс",
                        lastName: "Логан",
                        age: 20,
                        gender: "m",
                        district: 5,
                        state: "well"
                    },
                    {
                        id: 10,
                        firstName: "Пит",
                        lastName: "Мелларк",
                        age: 20,
                        gender: "f",
                        district: 5,
                        state: "well"
                    }
                ],
                6: [null, null],
                7: [null, null],
                8: [null, null],
                9: [null, null],
                10: [null, null],
                11: [null, null],
                12: [null, null]
            },
            currentParticipant: null,
            betSum: null,
            modalPublishVisible: false,
            modalParticipantVisible: false
        }
    },
    computed: {
        gameStatusSeverity() {
            switch(this.game.status) {
                case 'Черновик':
                    return 'warning';
                case 'Запланирована':
                    return 'primary';
                case 'В процессе':
                    return 'success';
                case 'Завершена':
                    return 'danger';
                default:
                    return 'primary';
            }
        },
        // gameInfoValid() {
        //     return !isEmpty(this.game.name) && !isEmpty(this.game.arenaType) && this.game.manager.id !== null && !isEmpty(this.game.description);
        // },
        // participantsValid() {
        //     return Object.values(this.participantsByDistrict).every(pair => pair[0] && pair[1]);
        // }
    },
    methods: {
        openModalParticipant(participant) {
            this.currentParticipant = participant;
            this.modalParticipantVisible = true;
        },
        checkValidity() {
            this.modalPublishVisible = true;
            // if (this.gameInfoValid && this.participantsValid) {
            //     this.modalPublishVisible = true;
            // } else {
            //     this.$toast.add({ severity: 'error', summary: 'Ошибка публикации', detail: 'Данные об игре не заполнены', life: 3000 });
            // }
        },
        publishGame() {
            this.game.status = "Запланирована";
            this.modalPublishVisible = false;
            this.$router.push("/games");
        }
    }
}
</script>

<style scoped>
.data-list {
    display: grid;
    gap: 0.75rem 1rem;
    line-height: 1.3rem;
}

.section-info .data-list {
    grid-template-columns: auto;
}

.section-events .data-list {
    grid-template-columns: max-content auto;
}

.section-events .data-list .key {
    font-variant-numeric: tabular-nums;
}

.participants {
    display: grid;
    grid-template-columns: max-content 1fr 1fr;
    gap: 1rem;
}

.participants .header {
    color: var(--text-color-secondary);
    font-weight: 500;
}

.participants .district {
    display: flex;
    justify-content: center;
    align-items: center;
}

.participants .item {
    display: flex;
    column-gap: 1rem;
    border-radius: 0.25rem;
    background-color: var(--bg-2);
    padding: 1rem;
}

.participants .item:not(.item-empty) {
    cursor: pointer;
}

.participants .item-data {
    flex-grow: 1;
}

.participants .item .name {
    margin-bottom: 0.5rem;
}

.participants .buttons {
    display: grid;
    grid-template-columns: auto max-content;
    column-gap: 0.5rem;
}

.participants .item-empty {
    justify-content: center;
    align-items: center;
    font-weight: 500;
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