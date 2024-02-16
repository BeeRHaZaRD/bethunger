<template>
    <div class="player" :class="{'dead': player.status === 'DEAD'}" @click="emitSelectPlayer">
        <div class="avatar">
            <Avatar :image="'https://api.dicebear.com/7.x/personas/svg?seed=' + player.id" size="large" shape="circle"/>
            <Badge v-if="gameStatus === 'ONGOING'" class="status-badge" :severity="PLAYER_STATUS_SEVERITY[player.status]"/>
        </div>
        <div class="player-data">
            <div class="name">{{player.fullName}}</div>
            <template v-if="isEditMode">
                <Badge v-if="player.trainResults" value="тренировки"/>
                <Badge v-else value="тренировки" severity="danger"/>
            </template>
            <template v-else-if="gameStatus === 'PLANNED' || gameStatus === 'ONGOING'">
                <div v-if="player.status !== 'DEAD'" ref="playerButtons" class="buttons">
                    <Button v-if="gameStatus === 'PLANNED'" label="Ставка x1.50" severity="info" @click="openMakeBetOp"/>
                    <Button v-if="gameStatus === 'ONGOING'" label="x1.50" severity="info" disabled/>

                    <template v-if="gameStatus === 'ONGOING'">
                        <Button v-if="isSuppliable" icon="pi pi-box" @click="openMakeSupplyOp"/>
                        <Button v-else disabled>
                            <div class="flex align-items-end">
                                <span class="pi pi-box mr-2"></span>
                                <Countdown :time="msToCooldown" @end="onCountdownEnd" v-slot="{days, hours, minutes, seconds}">
                                    <span class="monospaced">
                                        {{ formatCountdown(days, hours, minutes, seconds) }}
                                    </span>
                                </Countdown>
                            </div>
                        </Button>
                    </template>
                </div>
                <div v-else>
                    <span class="p-text-red">Погиб</span>
                </div>
            </template>
        </div>
        <Button v-if="isEditMode && gameStatus === 'DRAFT'" class="btn-remove" icon="pi pi-times" severity="secondary" text @click.stop="$emit('removePlayer', player)"/>
    </div>

    <OverlayPanel ref="opMakeBet">
        <Bet :player="player" :coefficient="2.7"/>
    </OverlayPanel>
    <OverlayPanel ref="opMakeSupply">
        <Supply :player="player" @success="closeMakeSupplyOp"/>
    </OverlayPanel>
</template>

<script>
import {PLAYER_STATUS_SEVERITY} from "@/enums/enums";
import {mapState} from "vuex";
import Supply from "@/components/Supply.vue";
import {focusDropdown, formatTime} from "@/utils/util";
import Bet from "@/components/Bet.vue";

export default {
    name: "PlayerListItem",
    components: {Bet, Supply},
    emits: ['selectPlayer', 'removePlayer'],
    props: {
        player: {
            type: Object,
            required: true
        },
        gameStatus: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            PLAYER_STATUS_SEVERITY: PLAYER_STATUS_SEVERITY
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode
        }),
        isSuppliable() {
            return this.player.cooldownTo ? new Date(this.player.cooldownTo) < new Date() : true;
        },
        msToCooldown() {
            if (!this.player.cooldownTo) {
                return null;
            }
            return new Date(this.player.cooldownTo) - new Date();
        }
    },
    methods: {
        emitSelectPlayer(event) {
            if (!this.$refs.playerButtons?.contains(event.target)) {
                this.$emit('selectPlayer', this.player);
            }
        },
        openMakeSupplyOp(event) {
            this.$refs.opMakeSupply.toggle(event);
            focusDropdown(this.$refs.opMakeSupply);
        },
        closeMakeSupplyOp() {
            this.$refs.opMakeSupply.hide();
        },
        openMakeBetOp(event) {
            this.$refs.opMakeBet.toggle(event);
        },
        closeMakeBetOp() {
            this.$refs.opMakeBet.hide();
        },
        onCountdownEnd() {
            this.isSuppliable = true;
        },
        formatCountdown: formatTime
    }
}
</script>

<style scoped>
.player {
    display: flex;
    position: relative;
    column-gap: 1rem;
    border-radius: 0.25rem;
    background-color: var(--bg-secondary);
    padding: 1rem;
    font-size: 1.06rem;
    align-items: center;
    cursor: pointer;
    transition: var(--transition);
}

.player:hover {
    background-color: var(--bg-secondary-hover);
}

.player .buttons {
    display: grid;
    grid-template-columns: auto max-content;
    column-gap: 0.5rem;
}

.player.dead {
    opacity: 0.5;
}

.player-data {
    flex-grow: 1;
}

.player-data > div:not(:last-child) {
    margin-bottom: 0.5rem;
}

.avatar {
    position: relative;
}

.status-badge {
    position: absolute;
    bottom: -2px;
    right: 0;
    width: 16px;
    height: 16px;
    outline: 2px solid var(--bg-2);
}

.player .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
}
</style>