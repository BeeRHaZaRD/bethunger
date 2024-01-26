<template>
    <h2 class="title">
        <span>Участники</span>
        <span class="players-number p-text-secondary" v-if="gameStatus === 'ONGOING'">
            <span class="p-text-green">{{playersLeft}}</span>/24
        </span>
    </h2>
    <div class="players">
        <div class="header text-center">Дистрикт</div>
        <div class="header text-center">Мужчина</div>
        <div class="header text-center">Женщина</div>
        <template v-for="(players, district) in playersByDistrict" :key="district">
            <div class="district">{{district}}</div>
            <template v-for="(player, idx) in players">
                <PlayerListItem v-if="player" :player="player" :game-status="gameStatus" @select-player="openModalPlayer(player)" @remove-player="removePlayerWrapper"/>
                <div v-else-if="pageMode === 'VIEW'" class="empty p-text-secondary">Пусто</div>
                <Button v-else-if="pageMode === 'EDIT'" class="add-player" label="ДОБАВИТЬ" severity="secondary" @click="openOverlay($event, parseInt(district), idx)"/>
            </template>
        </template>
    </div>

    <Dialog v-if="player" v-model:visible="modalPlayerVisible" modal :showHeader="false" :dismissableMask="true" :style="{width: '1100px'}" @hide="player = null">
        <PlayerInfo/>
    </Dialog>
    <OverlayPanel ref="selectPlayerOp">
        <div class="field p-fluid mb-3">
            <label for="item">Игрок</label>
            <AutoComplete v-model="player" input-id="item" dropdown :suggestions="suggestedPlayers" optionLabel="fullName" @complete="searchPlayer" @item-select="addPlayerWrapper"/>
        </div>
    </OverlayPanel>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters, mapActions, mapState} from 'vuex';
import {SEX} from "@/enums/enums"
import PlayerInfo from "@/components/PlayerInfo.vue";
import PlayerListItem from "@/components/PlayerListItem.vue";

export default defineComponent({
    name: "PlayerList",
    components: {PlayerListItem, PlayerInfo},
    data() {
        return {
            modalPlayerVisible: false,
            availablePlayers: null,
            suggestedPlayers: null,
            player: null
        }
    },
    props: {
        playersByDistrict: {
            type: Object,
            required: true
        },
        gameStatus: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState({
            pageMode: state => state.game.pageMode
        }),
        ...mapGetters({
            playersLeft: 'game/playersLeft'
        })
    },
    methods: {
        ...mapActions({
            getAvailablePlayers: 'game/getAvailablePlayers',
            addPlayer: 'game/addPlayer',
            removePlayer: 'game/removePlayer'
        }),
        openModalPlayer(player) {
            this.player = player;
            this.modalPlayerVisible = true;
        },
        async openOverlay(event, district, idx) {
            this.$refs.selectPlayerOp.toggle(event);
            this.availablePlayers = await this.getAvailablePlayers({
                district: district,
                sex: SEX[idx]
            });
        },
        searchPlayer(event) {
            this.suggestedPlayers = event.query
                ? this.availablePlayers.filter(player => player.fullName.toLowerCase().includes(event.query.toLowerCase()))
                : [...this.availablePlayers];
        },
        async addPlayerWrapper(event) {
            this.$refs.selectPlayerOp.toggle(event.originalEvent);
            await this.addPlayer({
                gameId: this.$route.params.id,
                player: this.player
            });
            this.resetData();
            this.$toast.add({ severity: 'success', summary: 'Игрок успешно добавлен', life: 3000 });
        },
        async removePlayerWrapper(player) {
            await this.removePlayer({
                gameId: this.$route.params.id,
                player: player
            });
            this.$toast.add({ severity: 'success', summary: 'Игрок успешно удален', life: 3000 });
        },
        resetData() {
            this.player = null;
            this.availablePlayers = null;
        }
    }
})
</script>

<style scoped>
.title .players-number {
    margin-left: 1rem;
}

.players {
    display: grid;
    grid-template-columns: max-content 1fr 1fr;
    gap: 1rem;
}

.players .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.25rem;
    background-color: var(--bg-2);
    font-weight: 500;
    min-height: 70px;
}

.players .header {
    color: var(--text-color-secondary);
    font-weight: 500;
}

.players .district {
    display: flex;
    justify-content: center;
    align-items: center;
}

.add-player {
    min-height: 70px;
}
</style>