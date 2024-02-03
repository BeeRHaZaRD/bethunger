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
            <template v-if="gameStatus === 'ONGOING'">
                <div class="buttons" v-if="player.status !== 'DEAD'">
                    <Button label="Ставка x1.5" severity="info" @click.stop="$refs.opMakeBet.toggle($event)"/>

                    <Button class="lg:hidden xl:inline-flex" icon="pi pi-box" @click.stop="console.log('supply')"/>
                    <Button class="hidden lg:inline-flex xl:hidden" label="Спонсировать" icon="pi pi-box" @click.stop="console.log('supply')"/>
                </div>
                <div v-else>
                    <span class="p-text-red">Погиб</span>
                </div>
            </template>
        </div>
        <Button v-if="isEditMode && gameStatus === 'DRAFT'" class="btn-remove" icon="pi pi-times" severity="secondary" text @click.stop="$emit('removePlayer', player)"/>
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
            PLAYER_STATUS_SEVERITY: PLAYER_STATUS_SEVERITY,
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
            isEditMode: state => state.game.isEditMode
        })
    },
    methods: {
        emitSelectPlayer() {
            this.$emit('selectPlayer', this.player);
        }
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