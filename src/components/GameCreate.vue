<template>
    <div class="data-form mb-4">
        <div class="field p-fluid">
            <label for="gameCreateName">Название</label>
            <InputText id="gameCreateName" v-model="game.name" type="text" :class="{'p-invalid': v$.game.name.$error}"/>
            <small class="p-error">{{v$.game.name.$errors[0]?.$message}}</small>
        </div>
        <div class="field p-fluid">
            <label for="gameCreateManager">Распорядитель</label>
            <Dropdown v-model="game.manager" editable :options="availableManagers" optionLabel="fullName"
                      :class="{'p-invalid': v$.game.manager.$error}" :disabled="availableManagers.length === 0"
                      :placeholder="availableManagers.length === 0 ? 'Нет доступных менеджеров' : ''"/>
            <small class="p-error">{{v$.game.manager.$errors[0]?.$message}}</small>
        </div>
    </div>
    <Button label="Создать игру" severity="success" :disabled="v$.$error" @click="createGameWrapper"/>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions} from "vuex";
import {maxLength, required} from "@/utils/localized-validators";
import {useVuelidate} from "@vuelidate/core";

export default defineComponent({
    name: "GameCreate",
    emits: ['success'],
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            game: {
                name: 'Голодные игры #',
                manager: null
            },
            availableManagers: []
        }
    },
    validations() {
        return {
            game: {
                name: {
                    required: required(),
                    maxLength: maxLength(32)
                },
                manager: {
                    id: {
                        required: required()
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions({
            getAllManagers: 'game/getAllManagers',
            createGame: 'game/createGame'
        }),
        async createGameWrapper() {
            if (!(await this.v$.$validate())) {
                return;
            }
            try {
                const game = await this.createGame({
                    name: this.game.name,
                    managerId: this.game.manager.id
                });
                this.$emit('success', game);
                this.$toast.add({ severity: 'success', summary: 'Игра успешно создана', life: 3000 });
            } catch (e) {
                this.$toast.add({severity: 'error', summary: 'Ошибка создания игры', detail: e.response.data.detail, life: 3000});
            }
        }
    },
    async mounted() {
        this.availableManagers = await this.getAllManagers();
    }
})
</script>

<style scoped>

</style>