<template>
    <div class="players">
        <div class="header text-center">Дистрикт</div>
        <div class="header text-center">Мужчина</div>
        <div class="header text-center">Женщина</div>
        <template v-for="(players, district) in playersByDistrict" :key="district">
            <div class="district">{{district}}</div>
            <template v-for="player in players">
                <div v-if="player" class="item" @click="$emit('openModal', player)">
                    <div class="avatar">
                        <Avatar size="large" shape="circle"></Avatar>
                    </div>
                    <div class="item-data">
                        <div class="name">{{player.firstName}} {{player.lastName}}</div>
                        <div class="buttons">
                            <Button label="Ставка x1.5" severity="secondary" @click.stop="$refs.opMakeBet.toggle($event)"></Button>
                            <Button class="lg:hidden xl:inline-flex" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                            <Button class="hidden lg:inline-flex xl:hidden" label="Спонсировать" icon="pi pi-box" @click.stop="console.log('supply')"></Button>
                        </div>
                    </div>
                </div>
                <div v-else class="item item-empty p-text-secondary">Пусто</div>
            </template>
        </template>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "PlayerList",
    props: {
        playersByDistrict: {
            type: Object,
            required: true
        }
    }
})
</script>

<style scoped>
.players {
    display: grid;
    grid-template-columns: max-content 1fr 1fr;
    gap: 1rem;
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

.players .item {
    display: flex;
    column-gap: 1rem;
    border-radius: 0.25rem;
    background-color: var(--bg-2);
    padding: 1rem;
}

.players .item:not(.item-empty) {
    cursor: pointer;
}

.players .item-data {
    flex-grow: 1;
}

.players .item .name {
    margin-bottom: 0.5rem;
}

.players .buttons {
    display: grid;
    grid-template-columns: auto max-content;
    column-gap: 0.5rem;
}

.players .item-empty {
    justify-content: center;
    align-items: center;
    font-weight: 500;
}
</style>