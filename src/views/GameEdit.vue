<template>
    <div v-if="isDataLoaded">
        <div class="grid">
            <div class="col-12">
                <div class="content-header">
                    <div class="title">
                        <h1>Редактирование игры</h1>
                        <Tag :value="GAME_STATUS[status]" :severity="GAME_STATUS_SEVERITY[status]"/>
                    </div>
                    <div class="controls">
                        <Button label="К игре" icon="pi pi-link" outlined @click="$router.push('/games/' + $route.params.id)"/>
                    </div>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <div class="section-info mb-5">
                    <div class="section-header">
                        <div class="title">
                            <h2>Информация об игре</h2>
                        </div>
                    </div>
                    <div class="data-form w-min">
                        <div class="field">
                            <label for="gameUpdateName">Название</label>
                            <InputText id="gameUpdateName" v-model="game.name" type="text" :class="{'p-invalid': v$.game.name.$error}"/>
                            <small class="p-error">{{v$.game.name.$errors[0]?.$message}}</small>
                        </div>
                        <div class="field">
                            <label for="gameUpdateDescription">Описание</label>
                            <Textarea id="gameUpdateDescription" v-model="game.description" autoResize rows="3" cols="50" :class="{'p-invalid': v$.game.description.$error}"/>
                            <small class="p-error">{{v$.game.description.$errors[0]?.$message}}</small>
                        </div>
                        <div class="field">
                            <label for="gameUpdateArenaType">Тип арены</label>
                            <InputText id="gameUpdateArenaType" v-model="game.arenaType" type="text" :class="{'p-invalid': v$.game.arenaType.$error}"/>
                            <small class="p-error">{{v$.game.arenaType.$errors[0]?.$message}}</small>
                        </div>
                        <div class="field">
                            <label for="gameUpdateArenaDescription">Описание арены</label>
                            <Textarea id="gameUpdateArenaDescription" v-model="game.arenaDescription" autoResize rows="3" cols="50" :class="{'p-invalid': v$.game.arenaDescription.$error}"/>
                            <small class="p-error">{{v$.game.arenaDescription.$errors[0]?.$message}}</small>
                        </div>
                        <div class="field">
                            <label for="gameUpdateDateStart">Время начала</label>
                            <Calendar v-model="game.dateStart" input-id="gameUpdateDateStart" showTime hourFormat="24" manual-input :min-date="new Date()"
                                      :panel-style="{width: '19rem'}" :class="{'p-invalid': v$.game.dateStart.$error}"/>
                            <small class="p-error">{{v$.game.dateStart.$errors[0]?.$message}}</small>
                        </div>
                        <Button class="w-full mt-2" label="Сохранить" severity="success" :disabled="!game.name.trim()" @click="updateGameInfoWrapper"/>
                    </div>
                </div>
                <div class="section-planned-events mb-5">
                    <PlannedEventList :planned-events="plannedEvents" title="Запланированные события"/>
                    <Button class="mt-3" label="ДОБАВИТЬ" icon="pi pi-plus" severity="secondary" text @click="visibleModals.plannedEventAdd = true"/>
                </div>
                <div class="section-items">
                    <ItemList :items="items" title="Предметы"/>
                    <Button class="mt-3" label="ДОБАВИТЬ" icon="pi pi-plus" severity="secondary" text @click="visibleModals.itemAdd = true"/>
                </div>
            </div>
            <div class="col-12 xl:col-6">
                <PlayerList :players="players"/>
            </div>
        </div>

        <Dialog v-model:visible="visibleModals.plannedEventAdd" modal :show-header="false" :dismissableMask="true" :style="{width: '400px'}">
            <PlannedEventEdit type="add" @success="visibleModals.plannedEventAdd = false"/>
        </Dialog>

        <Dialog v-model:visible="visibleModals.itemAdd" modal :show-header="false" :dismissableMask="true" :style="{width: '500px'}">
            <ItemAdd @success="visibleModals.itemAdd = false"/>
        </Dialog>
    </div>
    <div v-else class="content-center">
        <ProgressSpinner strokeWidth="2"/>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import ItemList from "@/components/ItemList.vue";
import HappenedEventList from "@/components/HappenedEventList.vue";
import PlayerList from "@/components/PlayerList.vue";
import PlannedEventList from "@/components/PlannedEventList.vue";
import PlayerTrainsEdit from "@/components/PlayerTrainsEdit.vue";
import ItemAdd from "@/components/ItemAdd.vue";
import PlannedEventEdit from "@/components/PlannedEventEdit.vue";
import {useVuelidate} from "@vuelidate/core";
import {maxLength, required} from "@/utils/localized-validators";

export default {
    name: "GameEdit",
    components: {PlannedEventEdit, ItemAdd, PlayerTrainsEdit, PlannedEventList, PlayerList, HappenedEventList, ItemList},
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            GAME_STATUS: GAME_STATUS,
            GAME_STATUS_SEVERITY: GAME_STATUS_SEVERITY,
            isDataLoaded: false,
            game: {
                name: null,
                description: null,
                arenaType: null,
                arenaDescription: null,
                dateStart: null
            },
            visibleModals: {
                itemAdd: false,
                plannedEventAdd: false
            }
        }
    },
    validations() {
        return {
            game: {
                name: {
                    required: required(),
                    maxLength: maxLength(32)
                },
                description: {
                    required: required()
                },
                arenaType: {
                    required: required(),
                    maxLength: maxLength(32)
                },
                arenaDescription: {
                    required: required()
                },
                dateStart: {
                    required: required()
                }
            }
        }
    },
    computed: {
        ...mapState({
            id: state => state.game.id,
            name: state => state.game.name,
            description: state => state.game.description,
            arenaType: state => state.game.arenaType,
            arenaDescription: state => state.game.arenaDescription,
            dateStart: state => state.game.dateStart,
            status: state => state.game.status,
            eventTypes: state => state.game.eventTypes,
            plannedEvents: state => state.game.plannedEvents,
            items: state => state.game.items,
            players: state => state.game.players
        })
    },
    methods: {
        ...mapMutations({
            setIsEditMode: 'game/setIsEditMode',
            resetGame: 'game/resetGame'
        }),
        ...mapActions({
            fetchGame: 'game/fetchGame',
            updateGameInfo: 'game/updateGameInfo'
        }),
        setGameData() {
            this.game.name = this.name;
            this.game.description = this.description;
            this.game.arenaType = this.arenaType;
            this.game.arenaDescription = this.arenaDescription;
            this.game.dateStart = this.dateStart;
        },
        async updateGameInfoWrapper() {
            if (await this.v$.$validate() === false) return;
            try{
                await this.updateGameInfo({
                    gameId: this.$route.params.id,
                    game: this.game
                });
                this.$router.push('/games/' + this.$route.params.id);
                this.$toast.add({ severity: 'success', summary: 'Игра успешно обновлена', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка при обновлении игры', detail: e.response.data.detail, life: 3000 });
            }
        }
    },
    async mounted() {
        try {
            await this.fetchGame(this.$route.params.id);
            if (this.status === 'ONGOING') {
                this.$router.go(-1);
            } else {
                this.setGameData();
                this.setIsEditMode(true);
                this.isDataLoaded = true;
            }
        } catch {}
    },
    beforeUnmount() {
        // for the watcher to work correctly
        if (this.isDataLoaded) {
            this.resetGame();
        }
    }
}
</script>

<style scoped>
.data-form {
    grid-template-columns: auto;
}
</style>