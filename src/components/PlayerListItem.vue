<template>
    <div class="player" :class="{'dead': player.state === 'DEAD'}" @click="$emit('selectPlayer', player)">
        <div class="avatar">
            <Avatar :image="'https://api.dicebear.com/7.x/personas/svg?seed=' + player.id" size="large" shape="circle"/>
            <Badge v-if="gameStatus === 'ONGOING'" class="status-badge" :severity="playerStatusSeverity[player.state]"/>
        </div>
        <div class="player-data">
            <div class="name">{{player.fullName}}</div>
            <template v-if="gameStatus === 'ONGOING'">
                <div class="buttons" v-if="player.state !== 'DEAD'">
                    <Button label="Ставка x1.5" severity="secondary" @click.stop="$refs.opMakeBet.toggle($event)"></Button>

                    <Button class="lg:hidden xl:inline-flex" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                    <Button class="hidden lg:inline-flex xl:hidden" label="Спонсировать" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                </div>
                <div v-else>
                    <span class="p-text-red">Погиб</span>
                </div>
            </template>
        </div>
        <Button class="btn-remove" icon="pi pi-times" severity="secondary" text @click.stop="$emit('removePlayer', player)"/>
    </div>
</template>

<script>
import {PLAYER_STATUS_SEVERITY} from "@/enums/enums";
import {mapState} from "vuex";

export default {
    name: "PlayerListItem",
    emits: ['selectPlayer', 'removePlayer'],
    data() {
        return {
            playerStatusSeverity: PLAYER_STATUS_SEVERITY,
        }
    },
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
    computed: {
        ...mapState({
            pageMode: state => state.game.pageMode
        })
    }
}
</script>

<style scoped>
.player {
    display: flex;
    position: relative;
    column-gap: 1rem;
    border-radius: 0.25rem;
    background-color: var(--bg-2);
    padding: 1rem;
    font-size: 1.06rem;
    align-items: center;
    cursor: pointer;
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
    top: 24px;
    right: -2px;
    width: 20px;
    height: 20px;
    border: 2px solid var(--bg-2);
}

.player .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
}
</style>