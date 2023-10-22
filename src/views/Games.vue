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
                <Column field="arenaType" header="Арена"></Column>
                <Column field="dateStart" header="Начало"></Column>
                <Column field="status" header="Статус"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import {axiosInstance as axios} from "@/axios";
import * as util from '@/util.js';
import {GAME_STATUS} from '@/enums/enums.js'
export default {
    data() {
        return {
            games: []
        }
    },
    methods: {
        openGame(event) {
            this.$router.push(`/games/${event.data.id}`)
        },
        transformGamesData() {
            this.games.map(game => {
                game.dateStart = util.transformDate(game.dateStart);
                game.status = GAME_STATUS[game.status];
            });
        },
        async getData() {
            await axios({
                method: 'get',
                url: '/games'
            }).then(response => {
                console.log(response.data);
                this.games.push(...response.data);
                this.transformGamesData();
            }).catch(e => {
                console.log(e);
            });
        }
    },
    mounted() {
        this.getData();
    }

}
</script>

<style scoped>

</style>