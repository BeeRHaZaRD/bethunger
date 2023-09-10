<template>
    <div class="grid">
        <div class="col-12">
            <div class="content-header">
                <div class="title">
                    <h1>Все игры</h1>
                </div>
                <div class="controls">
                    <Button label="Создать игру" icon="pi pi-plus" iconPos="left"/>
                </div>
            </div>
        </div>
        <div class="col-12">
            <DataTable :value="games" dataKey="id" selectionMode="single" @rowSelect="openGame">
                <Column field="name" header="Название"></Column>
                <Column field="arena" header="Арена"></Column>
                <Column field="dateStart" header="Начало"></Column>
                <Column field="status" header="Статус"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            games: [
                {
                    id: 75,
                    name: "Голодные игры #75",
                    arena: "Джунгли",
                    dateStart: "23/06/2145",
                    status: "Запланирована"
                },
                {
                    id: 74,
                    name: "Голодные игры #74",
                    arena: "Лес",
                    dateStart: "23/06/2145",
                    status: "В процессе"
                },
                {
                    id: 73,
                    name: "Голодные игры #73",
                    arena: "Разрушенный город",
                    dateStart: "23/06/2145",
                    status: "Завершена"
                },
                {
                    id: 72,
                    name: "Голодные игры #72",
                    arena: "Остров",
                    dateStart: "23/06/2145",
                    status: "Завершена"
                }
            ]
        }
    },
    methods: {
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        }
    }
}
</script>

<style scoped>

</style>