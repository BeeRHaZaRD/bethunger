<template>
    <div class="section-header">
        <div class="title">
            <h2>{{title}}</h2>
        </div>
    </div>

    <div class="card">
        <div v-if="events.length !== 0" class="data-list">
            <template v-for="event in events" :key="event.id">
                <HappenedEventListItem :event="event"/>
            </template>
        </div>
        <p v-else class="text-center p-text-secondary">Нет событий</p>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import HappenedEventListItem from "@/components/HappenedEventListItem.vue";

export default defineComponent({
    name: "HappenedEventList",
    components: { HappenedEventListItem },
    props: {
        title: {
            type: String,
            required: true
        },
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
    column-gap: 0.75rem;
}
</style>