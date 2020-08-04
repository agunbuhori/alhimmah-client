<template lang="pug">
    .content
        .members(v-if="! ranks.no_classroom")
            .p-2
                .alert.alert-primary Peringkat perkelas diambil berdasarkan seringnya melihat materi dan besar nilai ujian.
            .member-list
                .member(v-for="(rank, $index) in ranks" :class="{active: rank.is_you}") 
                    .number.centered 
                        span {{ $index+1 }}
                    .detail
                        h4 {{ (rank.member_id ? rank.member_id + ' - ' : "") + rank.name }}******
                        span.text-muted.text-small {{ rank.point }} poin, {{ rank.exp }} exp
                    .ach.centered(v-if="$index === 0")
                        img(src="/menu/046-achievement.png")
        .not-found.centered-column.p-4(v-else)
            img.placeholder(src="/quiz.svg")
            h2.text-center.text-muted Antum belum mendaftar kelas atau kelas belum mulai
                        
</template>

<script>
export default {
    async asyncData({ $axios, $auth }) {
        const ranks = await $axios.$get('ranks');
        return { ranks }
    },
}
</script>

<style lang="sass" scoped>
.members
    .member-list
        background-color: white
        .member
            border-bottom: 1px solid #eee
            display: grid
            text-decoration: none
            color: #333
            grid-template-columns: 50px 1fr 60px

            .number
                border-right: 1px solid #eee
                span
                    font-size: 16pxs
                    font-weight: bold
                    color: #888
            .detail
                padding: 10px
            .ach
                img
                    width: 30px
        .active
            background-color: #E0F7FA
            border-bottom-color: #00BCD4
            .number span
                color: #00838F !important
</style>