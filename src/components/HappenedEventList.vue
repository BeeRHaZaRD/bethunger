<template>
    <div class="card">
        <div v-if="events.length !== 0" class="data-list">
            <template v-for="event in events" :key="event.id">
                <HappenedEventListItem :event="event"/>
            </template>
        </div>
        <p v-else class="text-center p-text-secondary">Пусто</p>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import HappenedEventListItem from "@/components/HappenedEventListItem.vue";

export default defineComponent({
    name: "HappenedEventList",
    components: { HappenedEventListItem },
    props: {
        events: {
            type: Array,
            required: true
        }
    }
})
</script>

<style scoped>
.data-list {
    grid-template-columns: max-content auto;
    gap: 1rem 0.75rem;
}
</style>