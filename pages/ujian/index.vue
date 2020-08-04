<template lang="pug">
    .content
        .nav-tabs
                a(@click.prevent="filterFetch(false)" :class="{active: !hasEnded}") Belum Dikerjakan
                a(@click.prevent="filterFetch(true)" :class="{active: hasEnded}") Sudah Dikerjakan
        main.quizzes.cards.p1(v-if="quizzes.length")
            
            nuxt-link.card(v-for="(quiz, $index) in quizzes" :to="'/ujian/'+quiz.secret" :key="$index") 
                .detail
                    h4 {{ $string.title(quiz.matery.course.title) }} - {{ $string.title(quiz.matery.title) }}
                    span.text-muted.text-small Ujian Harian • {{ JSON.parse(quiz.quiz_questions).length }} Soal
                    //- span.text-success.ti-pencil(v-if="quiz.quiz_score") &nbsp;
                    //- span.text-success(v-if="quiz.quiz_score") Sudah Dikerjakan
                    span.text-warning.text-small(v-if="! quiz.quiz_score && $moment().format('YYYY-MM-DD') < $moment(quiz.quiz_enabled).format('YYYY-MM-DD')") &nbsp;• Aktif Besok
                    br
                    .result.text-center.text-success.text-small(v-if="quiz.quiz_score") 
                        span.ti-pencil
                        | &nbsp; {{ quiz.quiz_score }} &nbsp;
                        
                        span.ti-alarm-clock
                        | &nbsp; {{ quiz.quiz_duration - quiz.quiz_ended }}s &nbsp;

                        
                        span.ti-medall
                        | &nbsp; {{ getPredicate(quiz.quiz_score) }}



                //- .score(v-if="quiz.quiz_score")
                //-     span.text-muted Nilai
                //-     h4
                //-         span.ti-alarm-clock
                //-         | {{ quiz.quiz_duration - quiz.quiz_ended }}s
                //-     h4 {{ quiz.quiz_score }}
        .not-found.centered-column.p-2(v-else)
            img.placeholder(src="/quiz.svg")
            h2.text-muted Tidak Ada Ujian
</template>

<script>
import CourseLoading from '~/components/Loading/CourseLoading';
export default {
    middleware: 'member',
    async asyncData({ $axios }) {
        const quizzes = await $axios.$get('quizzes?ended=false');
        return { quizzes }
    },
    data() {
        return {
            hasEnded: false
        }
    },
    components: {
        CourseLoading
    },
    computed: {
        loadingIndicator() {
            return this.$root.$loading.get()
        }
    },
    methods: {
        async filterFetch(status) {
            this.hasEnded = status;
            this.$nuxt.$loading.start();
            await this.$axios.$get('quizzes', {
                params: {
                    ended: this.hasEnded
                }
            })
            .then(response => {
                this.quizzes = response;
                this.$nuxt.$loading.finish()
            });
        },
        getPredicate(score) {
            score = Math.round(score);

            if (score == 100) {
                return "Mumtaz Murtafi";
            } else if (score > 90) {
                return "Mumtaz";
            } else if (score > 80) {
                return "Jayyid Jiddan";
            } else if (score > 70) {
                return "Jayyid";
            } else if (score > 50) {
                return "Makbul";
            } else if (score > 1) {
                return "Rasib";
            } else {
                return "Ghayib";
            }
        }
    }
}
</script>

<style lang="sass" scoped>
@import "~/assets/sass/_dimensions"

.quizzes
    padding-top: $header-height
    a.quiz
        display: grid
        grid-template-columns: 1fr
        text-decoration: none
        .score
            display: flex
            justify-content: center
            align-items: flex-end
            flex-direction: column
            border-left: 1px solid #ddd
            .text-muted
                font-size: 14px
            h4
                color: #333
.result
    border-top: 1px solid #eee
    padding-top: 10px
    margin-top: 5px
</style>
