<template>
    <div class="player-card">
        <div class="section-info">
            <div>
                <div class="avatar">
                    <Avatar :image="'https://api.dicebear.com/7.x/personas/svg?seed=' + player.id" size="xlarge" shape="circle"></Avatar>
                </div>
            </div>
            <div class="info-text">
                <h2 class="title">{{player.fullName}}</h2>
                <h4 class="title-description">
                    <span>{{SEX_NAME[player.sex]}},&nbsp;</span>
                    <span>{{player.district}}-й дистрикт</span>
                </h4>
            </div>
        </div>
        <div class="section-trains data-form mt-3">
            <div class="field" v-for="(statValue, statName) in trainResults">
                <label :for="statName">{{TRAIN_RESULTS_NAME[statName]}}</label>
                <InputNumber v-model="trainResults[statName]" :input-id="statName" class="w-full" readonly :min="0" :max="10" :input-style="{'text-align': 'center'}"/>
                <Slider v-model="trainResults[statName]" class="w-full" :max="10"/>
            </div>
        </div>
        <Button class="mt-4 w-full" label="Сохранить результаты" severity="success" @click="updateTrainResultsWrapper"/>
    </div>
</template>

<script>
import {mapActions} from "vuex";
import {SEX_NAME, TRAIN_RESULTS_NAME} from "@/enums/enums";

export default {
    name: "PlayerTrainsEdit",
    emits: ['success'],
    props: {
        player: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            TRAIN_RESULTS_NAME: TRAIN_RESULTS_NAME,
            SEX_NAME: SEX_NAME,
            trainResults: {
                strength: 0,
                endurance: 0,
                agility: 0,
                stealth: 0,
                steelArms: 0,
                weapon: 0,
                archery: 0,
                handToHand: 0
            }
        }
    },
    methods: {
        ...mapActions({
            updateTrainResults: 'game/updateTrainResults'
        }),
        async updateTrainResultsWrapper() {
            try {
                await this.updateTrainResults({
                    player: {...this.player},
                    trainResults: {...this.trainResults}
                });
                this.$emit('success');
                this.$toast.add({ severity: 'success', summary: 'Тренировки успешно обновлены', life: 3000 });
            } catch (e) {
                this.$toast.add({ severity: 'error', summary: 'Ошибка обновления тренировок', detail: e.response.data.detail, life: 3000 });
            }
        },
    },
    async mounted() {
        if (this.player.trainResults) {
            this.trainResults = {...this.player.trainResults};
        }
    }
}
</script>

<style scoped>
.section-trains.data-form {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem 3rem;
}
</style>