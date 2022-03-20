<template>
    <div id="wrapper">
        <div class="head">
            <slot name="head"></slot>
        </div>
        <div class="container">
            <div class="aside">
                <slot name="aside"></slot>
            </div>
            <div class="main">
                <slot name="main"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
#wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.container {
    display: flex;
    flex: 1;
}
.aside {
    height: 100%;
}
.main {
    height: 100%;
    flex: 1;
}
</style>
