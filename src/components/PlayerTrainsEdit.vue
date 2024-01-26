<template>
    <Dialog v-model:visible="modalVisible" modal :show-header="true" header="Результаты тренировок" :draggable="false" :style="{width: '800px'}">
        <div class="section-info">
            <div>
                <div class="avatar">
                    <Avatar size="xlarge" shape="circle"></Avatar>
                </div>
                <Tag value="ЗДОРОВ" severity="success"></Tag>
            </div>
            <div class="info-text">
                <h2 class="title">{{player.fullName}}</h2>
                <h4 class="title-description">женщина, 26 лет, 2-й дистрикт</h4>
                <p class="description">{{player.description}}</p>
            </div>
        </div>
        <div class="section-trains data-form">
            <div class="field" v-for="(stat, key) in trainStats">
                <label :for="key">{{stat.name}}</label>
                <InputNumber v-model.number="stat.value" :input-id="key" class="w-full" readonly :min="0" :max="10"/>
                <Slider v-model="stat.value" class="w-full" :max="10"/>
            </div>
        </div>
        <Button label="Сохранить результаты" severity="success" @click=""/>
    </Dialog>
</template>

<script>
export default {
    name: "PlayerTrainsEdit",
    props: {
        player: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            modalVisible: true,
            trainStats: {
                strength: {
                    name: 'Сила',
                    value: 0
                },
                endurance: {
                    name: 'Выносливость',
                    value: 0
                },
                agility: {
                    name: 'Ловкость',
                    value: 0
                },
                stealth: {
                    name: 'Скрытность',
                    value: 0
                },
                steelArms: {
                    name: 'Холодное оружие',
                    value: 0
                },
                weapon: {
                    name: 'Стрелковое оружие',
                    value: 0
                },
                archery: {
                    name: 'Стрельба из лука',
                    value: 0
                },
                handToHand: {
                    name: 'Рукопашный бой',
                    value: 0
                }
            }
        }
    }
}
</script>

<style scoped>
.section-info {
    display: flex;
    column-gap: 1rem;
}

.section-info .avatar {
    text-align: center;
    margin-bottom: 0.5rem;
}

.section-info .title {
    margin-bottom: 0.25rem;
}

.section-trains.data-form {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem 5rem;
}
</style>