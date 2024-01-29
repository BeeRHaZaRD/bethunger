<template>
    <div v-if="items.length > 0" class="items">
        <template v-for="item in items" :key="item.id">
            <ItemListItem :item="item" @remove="removeItemWrapper"/>
        </template>
    </div>
    <div v-else class="card">
        <p class="text-center p-text-secondary">Нет предметов</p>
    </div>
    <Button v-if="isEditMode" class="mt-3" label="ДОБАВИТЬ" icon="pi pi-plus" severity="secondary" text @click="openModal"/>

    <Dialog v-model:visible="modalVisible" modal :show-header="false" :dismissableMask="true" :style="{width: '900px'}">
        <h2>Новый предмет</h2>
        <div class="data-form mb-2">
            <div class="field p-fluid">
                <label for="item">Предмет</label>
                <AutoComplete v-model="item" input-id="item" dropdown :suggestions="suggestedItems" optionLabel="name" @complete="searchItem"/>
            </div>
        </div>
        <div class="data-list">
            <div class="key">Название:</div>
            <div v-if="item && item.id" class="value">{{item.name}}</div>
            <div v-else class="value">-</div>

            <div class="key">Описание:</div>
            <div v-if="item && item.id" class="value">{{item.description}}</div>
            <div v-else class="value">-</div>

            <div class="key">Цена:</div>
            <div v-if="item && item.id" class="value">{{item.price}} &#8381;</div>
            <div v-else class="value">-</div>
        </div>
        <template #footer>
            <Button label="Добавить предмет" severity="success" :disabled="!item?.id" @click="addItemWrapper"/>
        </template>
    </Dialog>
</template>

<script>
import {defineComponent} from "vue";
import ItemListItem from "@/components/ItemListItem.vue";
import {mapActions, mapState} from "vuex";
export default defineComponent({
    name: "ItemList",
    components: {ItemListItem},
    data() {
        return {
            modalVisible: false,
            availableItems: null,
            suggestedItems: null,
            item: null
        }
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode
        }),
    },
    methods: {
        ...mapActions({
            getAllItems: 'game/getAllItems',
            addItem: 'game/addItem',
            removeItem: 'game/removeItem'
        }),
        async openModal() {
            this.modalVisible = true;
            if (this.availableItems === null) {
                this.availableItems = await this.getAllItems();
            }
        },
        searchItem(event) {
            let availableItems = [...this.availableItems];
            // filter already added items
            availableItems = availableItems.filter(item => !this.items.some(addedItem => addedItem.id === item.id));
            this.suggestedItems = event.query
                ? availableItems.filter(item => item.name.toLowerCase().startsWith(event.query.toLowerCase()))
                : availableItems;
        },
        async addItemWrapper() {
            await this.addItem({
                gameId: this.$route.params.id,
                item: this.item
            });
            this.modalVisible = false;
            this.resetData();
            this.$toast.add({ severity: 'success', summary: 'Предмет успешно добавлен', life: 3000 });
        },
        async removeItemWrapper(item) {
            await this.removeItem({
                gameId: this.$route.params.id,
                item: item
            });
            this.$toast.add({ severity: 'success', summary: 'Предмет успешно удален', life: 3000 });
        },
        resetData() {
            this.item = null;
        }
    }
})
</script>

<style scoped>
.data-list {
    grid-template-columns: auto;
}

/* Medium */
@media screen and (min-width: 768px) {
    .data-list {
        grid-template-columns: max-content auto;
    }
}
</style>