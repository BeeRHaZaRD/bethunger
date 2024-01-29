<template>
    <div class="item">
        <div class="image">
            <img src="@/assets/img/item0.png" alt="item">
        </div>
        <div class="text">
            <span class="name">{{item.name}}</span>
            <span class="description">{{item.description}}</span>
        </div>
        <Button v-if="isEditMode" class="btn-remove" icon="pi pi-times" severity="secondary" text @click="$emit('remove', item)"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {mapState} from "vuex";

export default defineComponent({
    name: "ItemListItem",
    emits: ['remove'],
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState({
            isEditMode: state => state.game.isEditMode
        }),
    },
})
</script>


<style scoped>
.item {
    display: flex;
    position: relative;
    border-radius: 6px;
    background-color: var(--bg-2);
}

.item:not(:last-child) {
    margin-bottom: 1rem;
}

.item .image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px;
    background-color: #232323;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.item .text {
    display: flex;
    padding: 0.5rem 1rem;
    flex-direction: column;
    justify-content: center;
}

.item .name {
    margin-bottom: 0.2rem;
}

.item .description {
    color: var(--text-color-secondary);
}

.item .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
}
</style>