<template>
    <h2 class="title">
        <span>Участники турнира</span>
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
            <template v-for="(player, sexNum) in players">
                <PlayerListItem v-if="player" :player="player" :game-status="gameStatus" @select-player="openModal(player)" @remove-player="removePlayerWrapper"/>
                <Button v-else-if="isEditMode" class="add-player" label="ДОБАВИТЬ" severity="secondary" @click="openOverlay($event, parseInt(district), sexNum)"/>
                <div v-else class="empty p-text-secondary">Нет игрока</div>
            </template>
        </template>
    </div>

    <!-- Подробная информация об игроке -->
    <Dialog v-if="player" v-model:visible="modalPlayerVisible" modal :showHeader="false" :dismissableMask="true" :style="{width: '1100px'}">
        <PlayerInfo :player="player"/>
    </Dialog>

    <!-- Изменение результатов тренировок -->
    <Dialog v-if="player" v-model:visible="modalTrainsEditVisible" modal header="Результаты тренировок" :dismissableMask="true" :draggable="false">
        <PlayerTrainsEdit :player="player" @close-modal="this.modalTrainsEditVisible = false"/>
    </Dialog>

    <!-- Добавление игрока -->
    <OverlayPanel ref="selectPlayerOp">
        <div class="field p-fluid mb-3">
            <label for="player">Игрок</label>
            <AutoComplete v-model="player" input-id="player" dropdown :suggestions="suggestedPlayers" optionLabel="fullName" @complete="searchPlayer" @item-select="addPlayerWrapper"/>
        </div>
    </OverlayPanel>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters, mapActions, mapState} from 'vuex';
import {SEX} from "@/enums/enums"
import PlayerInfo from "@/components/PlayerInfo.vue";
import PlayerListItem from "@/components/PlayerListItem.vue";
import PlayerTrainsEdit from "@/components/PlayerTrainsEdit.vue";

export default defineComponent({
    name: "PlayerList",
    components: {PlayerTrainsEdit, PlayerListItem, PlayerInfo},
    data() {
        return {
            modalPlayerVisible: false,
            modalTrainsEditVisible: false,
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
            isEditMode: state => state.game.isEditMode
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
        openModal(player) {
            this.player = player;
            if (this.isEditMode) {
                this.modalTrainsEditVisible = true;
            } else {
                this.modalPlayerVisible = true;
            }
        },
        async openOverlay(event, district, sexNum) {
            this.$refs.selectPlayerOp.toggle(event);
            this.availablePlayers = await this.getAvailablePlayers({
                district: district,
                sex: SEX[sexNum]
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