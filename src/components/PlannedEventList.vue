<template>
    <div v-if="plannedEvents.length > 0" class="planned-events">
        <template v-for="plannedEvent in sortedPlannedEvents" :key="plannedEvent.id">
            <PlannedEventListItem :planned-event="plannedEvent" @remove="removePlannedEventWrapper"/>
        </template>
    </div>
    <div v-else class="card">
        <p class="text-center p-text-secondary">Нет запланированных событий</p>
    </div>
    <Button class="mr-2" label="ДОБАВИТЬ" icon="pi pi-plus" severity="secondary" text @click="openModal"/>

    <Dialog v-model:visible="modalVisible" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <h2>Новое событие</h2>
        <div class="data-form">
            <div class="field p-fluid">
                <label for="eventType">Тип события</label>
                <AutoComplete v-model="plannedEvent.eventType" input-id="eventType" dropdown :suggestions="suggestedEventTypes" optionLabel="name" @complete="searchEventType"/>
            </div>
            <div class="field p-fluid">
                <label for="dateStart">Время запуска</label>
                <Calendar v-model="plannedEvent.dateStart" input-id="dateStart" showTime hourFormat="24" :min-date="minDate" :panel-style="{width: '359px'}"/>
            </div>
        </div>
        <template #footer>
            <Button label="Добавить событие" severity="success" :disabled="!plannedEvent.eventType?.id || !plannedEvent.dateStart" @click="addPlannedEventWrapper"/>
        </template>
    </Dialog>
</template>

<script>
import {defineComponent} from "vue";
import PlannedEventListItem from "@/components/PlannedEventListItem.vue";
import {mapActions} from "vuex";
import moment from "moment/moment";

export default defineComponent({
    name: "PlannedEventList",
    components: {PlannedEventListItem},
    data() {
        return {
            modalVisible: false,
            availableEventTypes: null,
            suggestedEventTypes: null,
            plannedEvent: {
                eventType: null,
                dateStart: null
            }
        }
    },
    computed: {
        sortedPlannedEvents() {
            return this.plannedEvents.sort((a,b) => new Date(a.startAt) - new Date(b.startAt))
        },
        minDate() {
            return new Date();
        }
    },
    props: {
        plannedEvents: {
            type: Array,
            required: true
        },
        eventTypes: {
            type: Array,
            required: true
        }
    },
    methods: {
        ...mapActions({
            addPlannedEvent: 'game/addPlannedEvent',
            removePlannedEvent: 'game/removePlannedEvent'
        }),
        openModal() {
            this.modalVisible = true;
        },
        searchEventType(event) {
            this.suggestedEventTypes = event.query
                ? this.eventTypes.filter(eventType => eventType.name.toLowerCase().startsWith(event.query.toLowerCase()))
                : [...this.eventTypes];
        },
        async addPlannedEventWrapper() {
            this.modalVisible = false;
            await this.addPlannedEvent({
                gameId: this.$route.params.id,
                eventTypeId: this.plannedEvent.eventType.id,
                startAt: moment(this.plannedEvent.dateStart).format("YYYY-MM-DDTHH:mm:00")
            });
            this.resetData();
            this.$toast.add({ severity: 'success', summary: 'Событие успешно добавлено', life: 3000 });
        },
        async removePlannedEventWrapper(plannedEvent) {
            await this.removePlannedEvent(plannedEvent);
            this.$toast.add({ severity: 'success', summary: 'Событие успешно удалено', life: 3000 });
        },
        resetData() {
            this.plannedEvent.eventType = null;
            this.plannedEvent.dateStart = null;
        }
    }
})
</script>


<style scoped>
.data-form {
    grid-template-columns: 1fr 1fr;
}
</style>