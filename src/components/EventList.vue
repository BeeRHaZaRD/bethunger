<template>
    <div>
        <h2>Ход игры</h2>
        <div class="card">
            <div v-if="events.length !== 0" class="data-list">
                <template v-for="event in events" :key="event.id">
                    <EventListItem :event="event"/>
                </template>
            </div>
            <p v-else class="text-center text-color-secondary">Пусто</p>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import EventListItem from "@/components/EventListItem.vue";

export default defineComponent({
    name: "EventList",
    components: {EventListItem},
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