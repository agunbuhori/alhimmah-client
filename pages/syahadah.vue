<template lang="pug">
    .content
        .cards(v-if="syahadahs.length")
            .card(v-for="syahadah in syahadahs")
                .icon
                    img(src="/certificate.png")
                .detail
                    h4 {{ syahadah.name }}
                    p.text-success Mumtaz Murtafi'
                    button.btn.btn-success.btn-small.mt-1 Unduh
        .not-found.centered-column.p-4(v-else)
            img.placeholder(src="/quiz.svg")
            h2.text-center.text-muted Antum belum mendapatkan syahadah, silakan selesaikan kelas
                        
</template>

<script>
export default {
    async asyncData({ $axios, $auth }) {
        const syahadahs = await $axios.$get('syahadah');
        return { syahadahs }
    },
}
</script>

<style lang="sass" scoped>
.card
    display: grid
    grid-template-columns: 70px 1fr

    .icon
        img
            height: 70px
</style>

