<template>
    <div class="player-card">
        <div class="section-info mb-3">
            <div>
                <div class="avatar">
                    <Avatar :image="'https://api.dicebear.com/7.x/personas/svg?seed=' + player.id" size="xlarge" shape="circle"></Avatar>
                </div>
                <Tag :value="PLAYER_STATUS[player.status]" :severity="PLAYER_STATUS_SEVERITY[player.status]"></Tag>
            </div>
            <div class="info-text">
                <h2 class="title">{{player.fullName}}</h2>
                <h4 class="title-description mb-2">
                    <span>{{SEX_NAME[player.sex]}},&nbsp;</span>
                    <span>{{player.district}}-й дистрикт</span>
                </h4>
                <p class="description">{{player.description}}</p>
            </div>
            <div class="buttons">
                <!-- TODO -->
            </div>
        </div>
        <div class="section-trains mb-5">
            <h2>Результаты тренировок</h2>
            <div v-if="player.trainResults" class="progress-items">
                <div class="item" v-for="(statValue, statName) in player.trainResults">
                    <div class="title">
                        <span class="key">{{TRAIN_RESULTS_NAME[statName]}}</span>
                        <span class="value">{{statValue}}/10</span>
                    </div>
                    <ProgressBar :value="statValue * 10" :showValue="false"></ProgressBar>
                </div>
            </div>
            <div v-else class="card">
                <p class="text-center p-text-secondary">Нет данных</p>
            </div>
        </div>
        <div class="section-items">
            <h2>Полученные предметы</h2>
            <ItemList :items="[]"/>
        </div>
        <div class="section-events">
            <h2>Связанные события</h2>
            <HappenedEventList :events="happenedEvents"/>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {PLAYER_STATUS, PLAYER_STATUS_SEVERITY, SEX_NAME, TRAIN_RESULTS_NAME} from "@/enums/enums";
import HappenedEventList from "@/components/HappenedEventList.vue";
import ItemList from "@/components/ItemList.vue";
import {mapActions} from "vuex";

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
            happenedEvents: []
        }
    },
    methods: {
        ...mapActions({
            getHappenedEventsByPlayer: 'game/getHappenedEventsByPlayer'
        })
    },
    async mounted() {
        this.happenedEvents = await this.getHappenedEventsByPlayer({
            gameId: this.$route.params.id,
            playerId: this.player.id
        });
    }
})
</script>

<style scoped>
.player-card {
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
    "info events"
    "trains events"
    "items events";
}

.player-card .section-info {
    grid-area: info;
}

.player-card .section-trains {
    grid-area: trains;
}

.player-card .section-items {
    grid-area: items;
}

.player-card .section-events {
    grid-area: events;
}

.progress-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    row-gap: 1.25rem;
}

.progress-items .item .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.progress-items .item .value {
    color: var(--text-color-secondary);
}

.supply-items .item {
    display: flex;
    border-radius: 6px;
    background-color: var(--bg-2);
}

.supply-items .item .image {
    padding: 5px;
    background-color: #232323;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.supply-items .item .text {
    display: flex;
    padding: 1rem;
    flex-direction: column;
    justify-content: center;
}

.supply-items .item .description {
    color: var(--text-color-secondary);
}

.p-progressbar {
    height: 4px;
}
</style>