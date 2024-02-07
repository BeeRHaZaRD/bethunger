<template>
    <div class="section-header">
        <div class="title">
            <h2>{{title}}</h2>
        </div>
    </div>

    <div v-if="items.length > 0" class="items">
        <template v-for="item in items" :key="item.id">
            <ItemListItem :item="item" @remove="removeItemWrapper"/>
        </template>
    </div>
    <div v-else class="card">
        <p class="text-center p-text-secondary">Нет предметов</p>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import ItemListItem from "@/components/ItemListItem.vue";
import {mapActions} from "vuex";
export default defineComponent({
    name: "ItemList",
    components: {ItemListItem},
    props: {
        title: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        ...mapActions({
            removeItem: 'game/removeItem'
        }),
        async removeItemWrapper(item) {
            await this.removeItem({
                gameId: this.$route.params.id,
                item: item
            });
            this.$toast.add({ severity: 'success', summary: 'Предмет успешно удален', life: 3000 });
        },
    }
})
</script>

<style scoped>

</style>