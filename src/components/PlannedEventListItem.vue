<template>
    <div class="planned-event">
        <div class="date-start">{{startAtView}}</div>
        <div class="info">
            <div class="name">
                <span>{{plannedEvent.eventType.name}}</span>
                <Badge v-if="!isEditMode" class="ml-2" :value="PLANNED_EVENT_STATUS[plannedEvent.status]" :severity="PLANNED_EVENT_STATUS_SEVERITY[plannedEvent.status]"/>
            </div>
            <div class="description">{{plannedEvent.eventType.description}}</div>
        </div>
        <Button v-if="isEditMode" class="btn-remove" icon="pi pi-times" severity="secondary" text @click="$emit('remove', plannedEvent)"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import moment from "moment/moment";
import {mapState} from "vuex";
import {PLANNED_EVENT_STATUS, PLANNED_EVENT_STATUS_SEVERITY} from "@/enums/enums";

export default defineComponent({
    name: "PlannedEventListItem",
    emits: ['remove'],
    props: {
        plannedEvent: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            PLANNED_EVENT_STATUS: PLANNED_EVENT_STATUS,
            PLANNED_EVENT_STATUS_SEVERITY: PLANNED_EVENT_STATUS_SEVERITY
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode
        }),
        startAtView() {
            return this.plannedEvent.startAt ? moment(this.plannedEvent.startAt).format('HH:mm DD.MM') : null;
        }
    }
})
</script>

<style scoped>
.planned-event {
    display: flex;
    position: relative;
    align-items: center;
    column-gap: 2rem;
    background-color: var(--bg-2);
    padding: 1rem;
    border-radius: 6px;
}

.planned-event:not(:last-child) {
    margin-bottom: 1rem;
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

.planned-event .info .name {
    margin-bottom: 0.2rem;
}

.planned-event .info .name > span {
    vertical-align: bottom;
}

.planned-event .info .description {
    color: var(--text-color-secondary);
}

.planned-event .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
}
</style>