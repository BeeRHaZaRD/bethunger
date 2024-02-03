<template>
    <div class="section-header">
        <div class="title">
            <h2>{{title}}</h2>
        </div>
        <div class="controls" v-if="gameStatus === 'ONGOING'">
            <Button class="hidden md:inline-flex" icon="pi pi-play" label="Событие" @click="openModalRun"/>
            <Button class="md:hidden" icon="pi pi-play" @click="openModalRun"/>
        </div>
    </div>

    <div class="mb-3" v-if="gameStatus === 'ONGOING'">
        <h3>
            <span class="text-color-secondary mr-2">Следующее событие:</span>
            <span v-if="nextPlannedEvent">{{nextPlannedEvent.eventType.name}}</span>
            <span v-else>—</span>
        </h3>
        <h3>
            <span class="text-color-secondary mr-2">До следующего события:</span>
            <span v-if="nextPlannedEvent" class="monospaced">{{timeToNextPlannedEvent}}</span>
            <span v-else>—</span>
        </h3>
    </div>

    <div v-if="plannedEvents.length > 0" class="planned-events">
        <template v-for="plannedEvent in sortedPlannedEvents" :key="plannedEvent.id">
            <PlannedEventListItem :planned-event="plannedEvent" @remove="removePlannedEventWrapper"/>
        </template>
    </div>
    <div v-else class="card">
        <p class="text-center p-text-secondary">Нет запланированных событий</p>
    </div>

    <Button v-if="isEditMode" class="mt-3" label="ДОБАВИТЬ" icon="pi pi-plus" severity="secondary" text @click="openModalAdd"/>

    <Dialog v-model:visible="modalAddVisible" class="edit-planned-event" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <h2>Новое событие</h2>
        <div class="data-form">
            <div class="field p-fluid">
                <label for="eventType">Тип события</label>
                <AutoComplete v-model="plannedEvent.eventType" input-id="eventType" dropdown :suggestions="suggestedEventTypes" optionLabel="name" @complete="searchEventType"
                              :disabled="eventTypes.length === 0" :placeholder="eventTypes.length === 0 ? 'Нет доступных событий' : ''"/>
            </div>
            <div class="field p-fluid">
                <label for="startAt">Время запуска</label>
                <Calendar v-model="plannedEvent.startAt" input-id="startAt" showTime hourFormat="24" :min-date="gameDateStart" :panel-style="{width: '359px'}"/>
            </div>
        </div>
        <template #footer>
            <Button label="Добавить событие" severity="success" :disabled="!plannedEvent.eventType?.id || !plannedEvent.startAt" @click="addPlannedEventWrapper"/>
        </template>
    </Dialog>

    <Dialog v-model:visible="modalRunVisible" class="run-planned-event" modal :show-header="false" :dismissableMask="true" :style="{width: '400px'}">
        <h2>Ручной запуск события</h2>
        <div class="data-form">
            <div class="field p-fluid">
                <label for="eventType">Тип события</label>
                <AutoComplete v-model="plannedEvent.eventType" input-id="eventType" dropdown :suggestions="suggestedEventTypes" optionLabel="name" @complete="searchEventType"
                              :disabled="eventTypes.length === 0" :placeholder="eventTypes.length === 0 ? 'Нет доступных событий' : ''"/>
            </div>
        </div>
        <template #footer>
            <Button label="Запустить событие" severity="success" :disabled="!plannedEvent.eventType?.id" @click="runPlannedEventWrapper"/>
        </template>
    </Dialog>
</template>

<script>
import {defineComponent, watchEffect} from "vue";
import PlannedEventListItem from "@/components/PlannedEventListItem.vue";
import {mapActions, mapState} from "vuex";
import {useTimer} from 'vue-timer-hook';
import {formatTimer} from "@/utils/util";

export default defineComponent({
    name: "PlannedEventList",
    components: {PlannedEventListItem},
    props: {
        title: {
            type: String,
            required: true
        },
        plannedEvents: {
            type: Array,
            required: true
        },
        eventTypes: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            modalAddVisible: false,
            modalRunVisible: false,
            suggestedEventTypes: [],
            plannedEvent: {
                eventType: null,
                startAt: null
            },
            nextPlannedEvent: null,
            timer: null
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode,
            gameStatus: state => state.game.status,
            gameDateStart: state => state.game.dateStart
        }),
        sortedPlannedEvents() {
            return this.plannedEvents.sort((a,b) => new Date(a.startAt) - new Date(b.startAt));
        },
        timeToNextPlannedEvent() {
            const timer = this.timer;
            return timer ? formatTimer(timer.days, timer.hours, timer.minutes, timer.seconds) : null;
        }
    },
    methods: {
        ...mapActions({
            addPlannedEvent: 'game/addPlannedEvent',
            removePlannedEvent: 'game/removePlannedEvent',
            runPlannedEvent: 'game/runPlannedEvent'
        }),
        openModalAdd() {
            this.modalAddVisible = true;
        },
        openModalRun() {
            this.modalRunVisible = true;
        },
        searchEventType(event) {
            this.suggestedEventTypes = event.query
                ? this.eventTypes.filter(eventType => eventType.name.toLowerCase().startsWith(event.query.toLowerCase()))
                : [...this.eventTypes];
        },
        async addPlannedEventWrapper() {
            try {
                await this.addPlannedEvent({
                    gameId: this.$route.params.id,
                    eventTypeId: this.plannedEvent.eventType.id,
                    startAt: this.plannedEvent.startAt
                });
                this.modalAddVisible = false;
                this.resetData();
                this.$toast.add({ severity: 'success', summary: 'Событие успешно добавлено', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка добавления события', detail: e.response.data.detail, life: 5000 });
            }
        },
        async runPlannedEventWrapper() {
            await this.runPlannedEvent({
                gameId: this.$route.params.id,
                eventTypeId: this.plannedEvent.eventType.id
            });
            this.modalRunVisible = false;
            this.resetData();
            this.$toast.add({ severity: 'success', summary: 'Событие успешно запрошено', life: 3000 });
        },
        async removePlannedEventWrapper(plannedEvent) {
            await this.removePlannedEvent({
                gameId: this.$route.params.id,
                plannedEvent: plannedEvent
            });
            this.$toast.add({ severity: 'success', summary: 'Событие успешно удалено', life: 3000 });
        },
        resetData() {
            this.plannedEvent.eventType = null;
            this.plannedEvent.startAt = null;
            this.suggestedEventTypes = [];
        },
        getNextPlannedEvent() {
            return this.plannedEvents.find(plannedEvent => new Date(plannedEvent.startAt) > new Date());
        }
    },
    mounted() {
        if (this.gameStatus === 'ONGOING') {
            this.nextPlannedEvent = this.getNextPlannedEvent();
            if (this.nextPlannedEvent) {
                const time = new Date(this.nextPlannedEvent.startAt);
                this.timer = useTimer(time);
            }
            watchEffect(() => {
                if (this.timer?.isExpired) {
                    this.nextPlannedEvent.status = 'REQUESTED';
                    this.nextPlannedEvent = this.getNextPlannedEvent();
                    if (this.nextPlannedEvent) {
                        const time = new Date(this.getNextPlannedEvent().startAt);
                        this.timer.restart(time);
                    } else {
                        this.timer = null;
                    }
                }
            });
        }
    }
})
</script>


<style scoped>
.run-planned-event .data-form {
    grid-template-columns: auto;
}
</style>