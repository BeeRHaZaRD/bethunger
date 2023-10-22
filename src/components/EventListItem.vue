<template>
    <template v-if="event.type === 'player_killed'">
        <div class="key">{{time}}</div>
        <div class="value">
            <span class="p-text-blue">{{event.body.player.firstName + ' ' + event.body.player.lastName}}&nbsp;</span>
            <span>погиб</span>
        </div>
    </template>
    <template v-if="event.type === 'player_injured'">
        <div class="key">{{time}}</div>
        <div class="value">
            <span class="p-text-blue">{{event.body.player.firstName + ' ' + event.body.player.lastName}}&nbsp;</span>
            <span>получил {{injuryDegree[event.body.degree]}}&nbsp;</span>
            <span class="p-text-red">ранение&nbsp;</span>
        </div>
    </template>
    <template v-if="event.type === 'supply'">
        <div class="key">{{time}}</div>
        <div class="value">
            <span class="p-text-blue">{{event.body.player.firstName + ' ' + event.body.player.lastName}}&nbsp;</span>
            <span>получил от спонсора <span class="p-text-purple">предмет</span> -&nbsp;</span>
            <span>{{event.body.item.name}}</span>
        </div>
    </template>
    <template v-if="event.type === 'random'">
        <div class="key">{{time}}</div>
        <div class="value" v-if="event.type === 'random'">
            <span>Началось <span class="p-text-orange">событие</span> -&nbsp;</span>
            <span>{{event.body.name}}</span>
        </div>
    </template>
    <template v-if="event.type === 'other'">
        <div class="key">{{time}}</div>
        <div class="value">
            <span v-if="event.body.player" class="p-text-blue">{{event.body.player.firstName + ' ' + event.body.player.lastName}}&nbsp;</span>
            <span>{{event.body.text}}</span>
        </div>
    </template>
    <template v-if="event.type === 'player'">
        <div class="key">{{time}}</div>
        <div class="value">
            <span class="p-text-blue">{{event.body.player.firstName + ' ' + event.body.player.lastName}}&nbsp;</span>
            <span v-if="event.body.degree === 'dead'">погиб</span>
            <template v-else>
                <span>получил {{injuryDegree[event.body.degree]}}&nbsp;</span>
                <span class="p-text-red">ранение</span>
            </template>
        </div>
    </template>
</template>

<script>
import {defineComponent} from 'vue'
import {transformDate} from "@/util";
import {INJURY_DEGREE} from "@/enums/enums";

export default defineComponent({
    name: "EventListItem",
    data() {
        return {
            injuryDegree: INJURY_DEGREE
        }
    },
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    computed: {
        time() {
            return transformDate(this.event.time);
        }
    }
})
</script>

<style scoped>
.key {
    font-variant-numeric: tabular-nums;
}
</style>