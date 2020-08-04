<template lang="pug">
    .content
        .materies
            .matery-list
                nuxt-link.matery(v-for="(matery, $index) in course.materies" :to="'/stream/'+matery.secret" :key="$index") 
                    .number.centered 
                        span {{ $index+1 }}
                    .detail
                        h4 {{ matery.title }}
                        span.text-muted.text-small(v-if="matery.video_url") Video, {{ matery.duration }} menit
                        span.text-muted.text-small(v-else-if="matery.audio_url") Audio, {{ matery.duration }} menit
                        span.text-muted.text-small(v-else="matery.article_url") Artikel
                    .button.centered
                        button.centered(:class="{success: matery.member_materies_count}")
                            span.ti-book(v-if="matery.member_materies_count")
                            span.ti-control-forward(v-else="matery.member_materies_count")

</template>

<script>
export default {
    middleware: 'auth',
    async asyncData({ $axios, store, route }) {
        const course = await $axios.$get('materies?course_code='+route.params.code);
        store.commit('setHeader', {title: course.title, backButton: true});
        return { course }
    },

    methods: {
        titleCase(str) {
            let result = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            return result;
        }
    }
}
</script>

<style lang="sass" scoped>
.content-header
    display: grid
    grid-template-columns: 50px 1fr  
    .back-button-top
        display: flex
        align-items: flex-end
        a
            span
                font-size: 25pt
                color: #888
.materies
    .matery-list
        background-color: white
        .matery
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
            .button
                button
                    font-size: 14pt
                    background-color: none
                    border: none
                    background-color: #eee
                    border-radius: 20px
                    width: 30px
                    height: 30px

                    &.success
                        background-color: green
                        color: white
</style>