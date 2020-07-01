<template lang="pug">
    .loading
        .lb
        .lb
        .lb
</template>
<style lang="sass" scoped>
.loading
    padding: 20px
    .lb
        background-color: #eee
        display: block
        height: 100px
        border-radius: 10px
        animation: loading 1.5s infinite
        margin-bottom: 15px
@keyframes loading
    0%
        opacity: 0.7
    50%
        opacity: 1
    100%
        opacity: 0.7
</style>