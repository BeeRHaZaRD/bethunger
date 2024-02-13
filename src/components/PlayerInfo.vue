<template>
    <div class="player-card" :class="{'full': gameStatus === 'ONGOING' || gameStatus === 'COMPLETED'}">
        <div class="section-info">
            <div>
                <div class="avatar">
                    <Avatar :image="'https://api.dicebear.com/7.x/personas/svg?seed=' + player.id" size="xlarge" shape="circle"/>
                </div>
                <Tag :value="PLAYER_STATUS[player.status]" :severity="PLAYER_STATUS_SEVERITY[player.status]"/>
            </div>
            <div class="info-text">
                <h2 class="title">{{player.fullName}}</h2>
                <h4 class="title-description">
                    <span>{{SEX_NAME[player.sex]}},&nbsp;</span>
                    <span>{{player.district}}-й дистрикт</span>
                </h4>
            </div>
            <div class="buttons">
                <!-- TODO bet/supply buttons -->
            </div>
        </div>
        <div class="section-trains mt-3">
            <h2>Результаты тренировок</h2>
            <div v-if="player.trainResults" class="trains">
                <div class="train" v-for="(statValue, statName) in player.trainResults">
                    <div class="title">
                        <span class="key">{{TRAIN_RESULTS_NAME[statName]}}</span>
                        <span class="value">{{statValue}}/10</span>
                    </div>
                    <ProgressBar :value="statValue * 10" :showValue="false"/>
                </div>
            </div>
            <div v-else class="card">
                <p class="text-center p-text-secondary">Нет данных</p>
            </div>
        </div>
        <div class="section-items mt-5">
            <!-- TODO received items -->
            <ItemList :items="items" title="Полученные предметы"/>
        </div>
        <div class="section-events">
            <HappenedEventList :events="happenedEvents" title="Связанные события"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {PLAYER_STATUS, PLAYER_STATUS_SEVERITY, SEX_NAME, TRAIN_RESULTS_NAME} from "@/enums/enums";
import HappenedEventList from "@/components/HappenedEventList.vue";
import ItemList from "@/components/ItemList.vue";
import {mapActions, mapGetters, mapState} from "vuex";

export default defineComponent({
    name: "PlayerInfo",
    components: {HappenedEventList, ItemList},
    props: {
        player: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            PLAYER_STATUS: PLAYER_STATUS,
            PLAYER_STATUS_SEVERITY: PLAYER_STATUS_SEVERITY,
            TRAIN_RESULTS_NAME: TRAIN_RESULTS_NAME,
            SEX_NAME: SEX_NAME,
            happenedEvents: [],
            items: []
        }
    },
    computed: {
        ...mapState({
            gameStatus: state => state.game.status,
            gameHappenedEvents: state => state.game.happenedEvents
        }),
    },
    async mounted() {
        this.happenedEvents = this.gameHappenedEvents.filter(event => {
            switch (event.type) {
                case 'PLAYER':
                case 'OTHER':
                    return event.player?.id === this.player.id;
                case 'SUPPLY':
                    return event.supply.player.id === this.player.id;
            }
        });
        this.items = this.happenedEvents
            .filter(event => event.type === 'SUPPLY')
            .map(event => event.supply.item);
    }
})
</script>

<style scoped>
.player-card {
    min-width: 700px;
}

.player-card.full {
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
    "info events"
    "trains events"
    "items events";
    width: 1100px;
}

.player-card.full .section-info {
    grid-area: info;
}

.player-card.full .section-trains {
    grid-area: trains;
}

.player-card.full .section-items {
    grid-area: items;
}

.player-card.full .section-events {
    grid-area: events;
}

.trains {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    row-gap: 1.25rem;
}

.trains .train .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.trains .train .value {
    color: var(--text-color-secondary);
}

.section-items,
.section-events {
    display: none;
}

.player-card.full .section-items,
.player-card.full .section-events {
    display: block;
}

.p-progressbar {
    height: 4px;
}
</style>