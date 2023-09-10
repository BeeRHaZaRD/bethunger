<template>
    <div class="grid">
        <div class="col-12 md:col-6 sections">
            <div class="section-info">
                <div>
                    <div class="avatar">
                        <Avatar size="xlarge" shape="circle"></Avatar>
                    </div>
                    <Tag value="ЗДОРОВ" severity="success"></Tag>
                </div>
                <div class="info-text">
                    <h2 class="title">{{participant.firstName}} {{participant.lastName}}</h2>
                    <h4 class="title-description">женщина, 26 лет, 2-й дистрикт</h4>
                    <p class="description">{{participant.description}}</p>
                </div>
                <div class="buttons">
                    <!-- TODO -->
                </div>
            </div>
            <div class="section-trains">
                <h2>Результаты тренировок</h2>
                <div class="progress-items">
                    <div class="item" v-for="stat in participant.trains" :key="stat.key">
                        <div class="title">
                            <span class="key">{{stat.name}}</span>
                            <span class="value">{{stat.value}}/10</span>
                        </div>
                        <ProgressBar :value="stat.value * 10" :showValue="false"></ProgressBar>
                    </div>
                </div>
            </div>
            <div class="section-items">
                <h2>Полученные предметы</h2>
                <div class="supply-items">
                    <div class="item">
                        <div class="image">
                            <img src="@/assets/img/item0.png" alt="item">
                        </div>
                        <div class="text">
                            <span class="title">Кинжал</span>
                            <span class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6 sections">
            <div class="section-events">
                <h2>Связанные события</h2>
                <p>...</p>
                <p>...</p>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "ParticipantInfo",
    data() {
        return {
            participant: {
                id: 1,
                firstName: "Кашмира",
                lastName: "Ритчсон",
                age: 20,
                gender: "f",
                state: "well",
                description: "Кашмира тренировалась вместе со своим братом. Они метали ножи и показали в данной дисциплине отличные результаты.",
                trains: [
                    {
                        key: 'strength',
                        name: 'Сила',
                        value: 6
                    },
                    {
                        key: 'endurance',
                        name: 'Выносливость',
                        value: 3
                    },
                    {
                        key: 'agility',
                        name: 'Ловкость',
                        value: 3
                    },
                    {
                        key: 'stealth',
                        name: 'Скрытность',
                        value: 2
                    },
                    {
                        key: 'steelArms',
                        name: 'Холодное оружие',
                        value: 8
                    },
                    {
                        key: 'weapon',
                        name: 'Стрелковое оружие',
                        value: 6
                    },
                    {
                        key: 'archery',
                        name: 'Стрельба из лука',
                        value: 5
                    },
                    {
                        key: 'handToHand',
                        name: 'Рукопашный бой',
                        value: 4
                    },
                ]
            }
        }
    }
})
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

.progress-items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    row-gap: 1rem;
}

.progress-items .item .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.progress-items .item .value {
    color: var(--text-color-secondary);
}

.supply-items .item {
    display: flex;
    border-radius: 6px;
    background-color: var(--bg-2);
}

.supply-items .item .image {
    padding: 5px;
    background-color: #232323;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.supply-items .item .text {
    display: flex;
    padding: 1rem;
    flex-direction: column;
    justify-content: center;
}

.supply-items .item .description {
    color: var(--text-color-secondary);
}

.p-progressbar {
    height: 4px;
}
</style>