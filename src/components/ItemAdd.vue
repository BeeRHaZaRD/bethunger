<template>
    <h2>Новый предмет</h2>
    <div class="data-form">
        <div class="field p-fluid">
            <label for="item">Предмет</label>
            <Dropdown v-model="item" editable :options="availableItems" optionLabel="name"
                      :class="{'p-invalid': v$.item.$error}" :disabled="availableItems.length === 0"
                      :placeholder="availableItems.length === 0 ? 'Нет доступных предметов' : ''"/>
            <small class="p-error">{{v$.item.$errors[0]?.$message}}</small>
        </div>
    </div>
    <div v-if="availableItems.length > 0" class="data-list mt-3">
        <div class="key">Название:</div>
        <div v-if="item?.id" class="value">{{item.name}}</div>
        <div v-else class="value">-</div>

        <div class="key">Описание:</div>
        <div v-if="item?.id" class="value">{{item.description}}</div>
        <div v-else class="value">-</div>

        <div class="key">Цена:</div>
        <div v-if="item?.id" class="value">{{item.price}} &#8381;</div>
        <div v-else class="value">-</div>
    </div>
    <Button class="mt-4 w-full" label="Добавить предмет" severity="success" :disabled="v$.$error" @click="addItemWrapper"/>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions, mapState} from "vuex";
import {useVuelidate} from "@vuelidate/core";
import {required, requiredIf} from "@/utils/localized-validators";
export default defineComponent({
    name: "ItemAdd",
    emits: ['success'],
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            item: null,
            availableItems: []
        }
    },
    validations() {
        return {
            item: {
                id: {
                    required: required()
                }
            }
        }
    },
    computed: {
        ...mapState({
            addedItems: state => state.game.items
        })
    },
    methods: {
        ...mapActions({
            getAllItems: 'game/getAllItems',
            addItem: 'game/addItem'
        }),
        async addItemWrapper() {
            if (!(await this.v$.$validate())) {
                return;
            }
            try {
                await this.addItem({
                    gameId: this.$route.params.id,
                    item: this.item
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Предмет успешно добавлен', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка добавления предмета', detail: e.response.data.detail, life: 3000 });
            }
        }
    },
    async mounted() {
        const items = await this.getAllItems();
        // filter already added items
        this.availableItems = items.filter(item => !this.addedItems.some(addedItem => addedItem.id === item.id));
    }
})
</script>

<style scoped>
.data-form {
    grid-template-columns: auto;
}

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