<template>
    <template v-if="event.type === 'PLAYER'">
        <div class="key monospaced">{{happenedAt}}</div>
        <div class="value" v-if="event.playerEventType === 'KILLED'">
            <span class="p-text-primary">{{playerFullName}}&nbsp;</span>
            <span class="p-text-red">погиб</span>
        </div>
        <div class="value" v-else>
            <span class="p-text-primary">{{playerFullName}}&nbsp;</span>
            <span>получил {{INJURY_DEGREE[event.playerEventType]}}&nbsp;</span>
            <span class="p-text-red">ранение&nbsp;</span>
        </div>
    </template>
    <template v-if="event.type === 'PLANNED_EVENT'">
        <div class="key monospaced">{{happenedAt}}</div>
        <div class="value">
            <span>Началось событие —&nbsp;</span>
            <span class="p-text-orange">{{event.plannedEvent.eventType.name}}</span>
            <span>.&nbsp;{{event.plannedEvent.eventType.description}}</span>
        </div>
    </template>
    <template v-if="event.type === 'SUPPLY'">
        <div class="key monospaced">{{happenedAt}}</div>
        <div class="value">
            <span class="p-text-primary">{{event.supply.player.firstName + ' ' + event.supply.player.lastName}}&nbsp;</span>
            <span>получил от спонсора&nbsp;</span>
            <span class="p-text-purple">{{event.supply.item.name}}</span>
        </div>
    </template>
    <template v-if="event.type === 'OTHER'">
        <div class="key monospaced">{{happenedAt}}</div>
        <div class="value">
            <span v-if="event.player" class="p-text-primary">{{playerFullName}}&nbsp;</span>
            <span :class="{'first-lower': event.player}">{{event.message}}</span>
        </div>
    </template>
</template>

<script>
import {defineComponent} from 'vue'
import {INJURY_DEGREE} from "@/enums/enums";
import moment from "moment";
import {makeFullName} from "@/utils/util";

export default defineComponent({
    name: "HappenedEventListItem",
    data() {
        return {
            INJURY_DEGREE: INJURY_DEGREE
        }
    },
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    computed: {
        happenedAt() {
            return moment(this.event.happenedAt).format('DD.MM HH:mm:ss');
        },
        playerFullName() {
            return makeFullName(this.event.player);
        }
    }
})
</script>

<style scoped>

</style>