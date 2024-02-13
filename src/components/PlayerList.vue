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
        <template v-for="(pair, district) in players" :key="district">
            <div class="district">{{district}}</div>
            <template v-for="(player, sexNum) in pair">
                <PlayerListItem v-if="player" :player="player" :game-status="gameStatus" @select-player="openModal(player)" @remove-player="removePlayerWrapper"/>
                <Button v-else-if="isEditMode && gameStatus === 'DRAFT'" class="add-player-btn" label="ДОБАВИТЬ" severity="secondary" @click="openOpSelectPlayer($event, parseInt(district), sexNum)"/>
                <div v-else class="empty p-text-secondary">Нет игрока</div>

                <!-- Добавление игрока -->
                <OverlayPanel ref="opSelectPlayer">
                    <PlayerAdd :district="parseInt(district)" :sex="SEX[sexNum]" @select="closeOpSelectPlayer"/>
                </OverlayPanel>
            </template>
        </template>
    </div>

    <!-- Подробная информация об игроке -->
    <Dialog v-model:visible="visibleModals.playerInfo" modal :showHeader="false" :dismissableMask="true" @hide="currentPlayer = null">
        <PlayerInfo :player="currentPlayer"/>
    </Dialog>

    <!-- Изменение результатов тренировок -->
    <Dialog v-model:visible="visibleModals.playerTrainsEdit" modal header="Результаты тренировок" :dismissableMask="true" :draggable="false" @hide="currentPlayer = null">
        <PlayerTrainsEdit :player="currentPlayer" @success="this.visibleModals.playerTrainsEdit = false"/>
    </Dialog>
</template>

<script>
import {defineComponent} from 'vue'
import {mapGetters, mapActions, mapState} from 'vuex';
import PlayerInfo from "@/components/PlayerInfo.vue";
import PlayerListItem from "@/components/PlayerListItem.vue";
import PlayerTrainsEdit from "@/components/PlayerTrainsEdit.vue";
import Supply from "@/components/Supply.vue";
import {getPlayerIndex, focusDropdown} from "@/utils/util";
import PlayerAdd from "@/components/PlayerAdd.vue";
import {SEX} from "@/enums/enums";

export default defineComponent({
    name: "PlayerList",
    components: {PlayerAdd, Supply, PlayerTrainsEdit, PlayerListItem, PlayerInfo},
    props: {
        players: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            visibleModals: {
                playerInfo: false,
                playerTrainsEdit: false
            },
            opSelectPlayerRef: null,
            currentPlayer: null,
            SEX: SEX
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode,
            gameStatus: state => state.game.status
        }),
        ...mapGetters({
            playersLeft: 'game/playersLeft'
        })
    },
    methods: {
        ...mapActions({
            removePlayer: 'game/removePlayer'
        }),
        openModal(player) {
            this.currentPlayer = player;
            if (this.isEditMode) {
                this.visibleModals.playerTrainsEdit = true;
            } else {
                this.visibleModals.playerInfo = true;
            }
        },
        openOpSelectPlayer(event, district, sexNum) {
            this.opSelectPlayerRef = this.$refs.opSelectPlayer[getPlayerIndex(district, sexNum)];
            this.opSelectPlayerRef.toggle(event);
            // auto open dropdown
            focusDropdown(this.opSelectPlayerRef);
        },
        closeOpSelectPlayer() {
            this.opSelectPlayerRef.hide();
        },
        async removePlayerWrapper(player) {
            try {
                await this.removePlayer({
                    gameId: this.$route.params.id,
                    player: player
                });
                this.$toast.add({ severity: 'success', summary: 'Игрок успешно удален', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка удаления игрока', detail: e.response.data.detail, life: 3000 });
            }
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

.add-player-btn {
    min-height: 70px;
}
</style>