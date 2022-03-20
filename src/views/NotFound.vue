<template>
    <div class="not">
        404 Not Found
    </div>
</template>

<style scoped>
.not {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(rgb(255, 123, 0) 0%, rgb(255, 0, 255) 100%);
    color: transparent;
    background-clip: text;
    height: 100vh;
    font-size: 7rem;
    font-weight: bold;
    position: relative;
}
.not::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    background-color: rgb(255, 155, 155);
    z-index: -1;
}
</style>