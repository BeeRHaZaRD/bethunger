<template>
    <h2>{{title}}</h2>
    <div class="data-form">
        <div class="field p-fluid">
            <label for="eventType">Тип события</label>
            <AutoComplete v-model="eventType" input-id="eventType" dropdown :suggestions="suggestedEventTypes" optionLabel="name" @complete="search"
                          :disabled="availableEventTypes.length === 0" :placeholder="availableEventTypes.length === 0 ? 'Нет доступных событий' : ''"/>
        </div>
        <div class="field p-fluid" v-if="type === 'add'">
            <label for="startAt">Время запуска</label>
            <Calendar v-model="startAt" input-id="startAt" showTime hourFormat="24" :min-date="gameDateStart" :panel-style="{width: '359px'}"/>
        </div>
    </div>
    <Button v-if="type === 'add'" class="mt-4" label="Добавить событие" severity="success" :disabled="!eventType?.id || !startAt" @click="addPlannedEventWrapper"/>
    <Button v-else-if="type === 'run'" class="mt-4" label="Запустить событие" severity="success" :disabled="!eventType?.id" @click="runPlannedEventWrapper"/>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions, mapState} from "vuex";

export default defineComponent({
    name: "PlannedEventEdit",
    emits: ['success'],
    props: {
        type: { // add | run
            type: String,
            required: true
        }
    },
    data() {
        return {
            eventType: null,
            startAt: null,
            availableEventTypes: [],
            suggestedEventTypes: []
        }
    },
    computed: {
        ...mapState({
            gameEventTypes: state => state.game.eventTypes,
            gameDateStart: state => state.game.dateStart
        }),
        title() {
            switch (this.type) {
                case 'add':
                    return 'Новое событие'
                case 'run':
                    return 'Ручной запуск события'
            }
        }
    },
    methods: {
        ...mapActions({
            addPlannedEvent: 'game/addPlannedEvent',
            runPlannedEvent: 'game/runPlannedEvent'
        }),
        search(event) {
            this.suggestedEventTypes = event.query
                ? this.availableEventTypes.filter(eventType => eventType.name.toLowerCase().startsWith(event.query.toLowerCase()))
                : [...this.availableEventTypes];
        },
        async addPlannedEventWrapper() {
            try {
                await this.addPlannedEvent({
                    gameId: this.$route.params.id,
                    eventTypeId: this.eventType.id,
                    startAt: this.startAt
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Событие успешно создано', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка создания события', detail: e.response.data.detail, life: 5000 });
            }
        },
        async runPlannedEventWrapper() {
            try {
                await this.runPlannedEvent({
                    gameId: this.$route.params.id,
                    eventTypeId: this.eventType.id
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Событие успешно запрошено', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка запроса события', detail: e.response.data.detail, life: 5000 });
            }
        },
    },
    mounted() {
        this.availableEventTypes = this.gameEventTypes;
    }
})
</script>

<style scoped>
.data-form {
    grid-template-columns: auto;
}
</style>