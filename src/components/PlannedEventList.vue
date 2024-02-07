<template>
    <div class="section-header">
        <div class="title">
            <h2>{{title}}</h2>
        </div>
        <div class="controls" v-if="gameStatus === 'ONGOING'">
            <Button class="hidden md:inline-flex" icon="pi pi-play" label="Событие" @click="visibleModals.plannedEventRun = true"/>
            <Button class="md:hidden" icon="pi pi-play" @click="visibleModals.plannedEventRun = true"/>
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

    <Dialog v-model:visible="visibleModals.plannedEventRun" class="run-planned-event" modal :show-header="false" :dismissableMask="true" :style="{width: '400px'}">
        <PlannedEventEdit type="run" @success="visibleModals.plannedEventRun = false"/>
    </Dialog>
</template>

<script>
import {defineComponent, watchEffect} from "vue";
import PlannedEventListItem from "@/components/PlannedEventListItem.vue";
import {mapActions, mapState} from "vuex";
import {useTimer} from 'vue-timer-hook';
import {formatTimer} from "@/utils/util";
import PlannedEventEdit from "@/components/PlannedEventEdit.vue";

export default defineComponent({
    name: "PlannedEventList",
    components: {PlannedEventEdit, PlannedEventListItem},
    props: {
        title: {
            type: String,
            required: true
        },
        plannedEvents: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            visibleModals: {
                plannedEventRun: false
            },
            nextPlannedEvent: null,
            timer: null
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode,
            gameStatus: state => state.game.status
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
            removePlannedEvent: 'game/removePlannedEvent'
        }),
        async removePlannedEventWrapper(plannedEvent) {
            await this.removePlannedEvent({
                gameId: this.$route.params.id,
                plannedEvent: plannedEvent
            });
            this.$toast.add({ severity: 'success', summary: 'Событие успешно удалено', life: 3000 });
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

</style>