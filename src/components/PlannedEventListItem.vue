<template>
    <div class="planned-event">
        <div class="date-start">{{dateStartView}}</div>
        <div class="info">
            <div class="name">{{plannedEvent.eventType.name}}</div>
            <div class="description">{{plannedEvent.eventType.description}}</div>
        </div>
        <Button class="btn-remove" icon="pi pi-times" severity="secondary" text @click="$emit('remove', plannedEvent)"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import moment from "moment/moment";

export default defineComponent({
    name: "PlannedEventListItem",
    emits: ['remove'],
    props: {
        plannedEvent: {
            type: Object,
            required: true
        }
    },
    computed: {
        dateStartView() {
            return this.plannedEvent.startAt && moment(this.plannedEvent.startAt).format('HH:mm DD.MM')
        }
    }
})
</script>

<style scoped>
.planned-event {
    display: flex;
    position: relative;
    background-color: var(--bg-2);
    margin-bottom: 1rem;
    padding: 1rem;
    column-gap: 2rem;
    border-radius: 6px;
}

.planned-event::before {
    content: "";
    position: absolute;
    width: 2px;
    top: 0;
    left: 65px;
    bottom: -14px;
    background-color: var(--primary-color);
}

.planned-event:last-child::before {
    bottom: 0;
}

.planned-event::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    top: calc(50% - 5px);
    left: 61px;
    border-radius: 50%;
    border: 2px solid var(--bg-2);
    background-color: #fff;
}

.planned-event .date-start {
    width: 40px;
    text-align: center;
}

.planned-event .description {
    color: var(--text-color-secondary);
}

.planned-event .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
}
</style>