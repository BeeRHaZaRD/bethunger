<template>
    <div class="supply">
        <div class="field p-fluid">
            <Dropdown v-model="item" :options="availableItems" optionLabel="name" :disabled="availableItems.length === 0"
                      :placeholder="availableItems.length === 0 ? 'Нет доступных предметов' : 'Выберите предмет'"/>
        </div>
        <div v-if="item" class="data-list mt-3">
            <div class="key">Описание:</div>
            <div class="value">{{item.description}}</div>
        </div>
        <Button v-if="item" :label="'Отправить за ' + item.price + ' &#8381;'" class="mt-3 w-full" @click="makeSupplyWrapper" :disabled="!item?.id"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions, mapState} from "vuex";

export default defineComponent({
    name: "Supply",
    emits: ['success'],
    props: {
        player: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            item: null
        }
    },
    computed: {
        ...mapState({
            items: state => state.game.items
        }),
        availableItems() {
            return this.items.filter(item => item.available);
        }
    },
    methods: {
        ...mapActions({
            makeSupply: 'game/makeSupply'
        }),
        async makeSupplyWrapper() {
            try {
                await this.makeSupply({
                    playerId: this.player.id,
                    itemId: this.item.id
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Спонсирование выполнено успешно', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка спонсирования', detail: e.response.data.detail, life: 5000 });
            }
        }
    }
})
</script>

<style scoped>
.supply {
    min-width: 200px;
}

.key {
    margin-bottom: -0.5rem;
}
</style>