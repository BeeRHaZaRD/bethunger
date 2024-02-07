<template>
    <div class="content-center text-center">
        <h2 class="code">403</h2>
        <p class="title">Forbidden</p>
        <p class="detail">Доступ к запрашиваемому ресурсу запрещен</p>
        <Button label="На главную" size="large" @click="$router.push('/games')"/>
    </div>
</template>

<script>
export default {
    name: "Error403"
}
</script>

<style scoped>
.code {
    font-size: 8rem;
    line-height: 8rem;
    margin-bottom: 0;
}

.title {
    font-weight: 300;
    font-size: 3rem;
    margin-bottom: 1.5rem;
}

.detail {
    font-weight: 300;
    font-size: 2rem;
    margin-bottom: 2rem;
}
</style>