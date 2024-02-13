<template>
    <div class="field p-fluid mb-1">
        <label>Игрок</label>
        <Dropdown v-model="player" editable :options="availablePlayers" optionLabel="fullName" @change="selectPlayer"
                  :class="{'p-invalid': v$.player.$error}" :disabled="availablePlayers.length === 0"
                  :placeholder="availablePlayers.length === 0 ? 'Нет доступных игроков' : ''"/>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions} from "vuex";
import {required} from "@/utils/localized-validators";
import {useVuelidate} from "@vuelidate/core";

export default defineComponent({
    name: "PlayerAdd",
    emits: ['select'],
    props: {
        district: {
            type: Number,
            required: true
        },
        sex: {
            type: String,
            required: true
        }
    },
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            player: null,
            availablePlayers: []
        }
    },
    validations() {
        return {
            player: {
                id: {
                    required: required()
                }
            }
        }
    },
    methods: {
        ...mapActions({
            getAvailablePlayers: 'game/getAvailablePlayers',
            addPlayer: 'game/addPlayer',
        }),
        selectPlayer(event) {
            if (this.player?.id) {
                this.addPlayerWrapper();
                this.$emit('select', event.originalEvent);
            }
        },
        async addPlayerWrapper() {
            if (!(await this.v$.$validate())) {
                return;
            }
            try {
                await this.addPlayer({
                    gameId: this.$route.params.id,
                    player: this.player
                });
                this.$toast.add({ severity: 'success', summary: 'Игрок успешно добавлен', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка добавления игрока', detail: e.response.data.detail, life: 3000 });
            }
        }
    },
    async mounted() {
        this.availablePlayers = await this.getAvailablePlayers({
            district: this.district,
            sex: this.sex
        });
    }
})
</script>

<style scoped>

</style>