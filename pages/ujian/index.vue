<template lang="pug">
    .content
        header.content-header
            span.text-muted {{ $moment().format('dddd, DD MMMM YYYY') }}
            h2 Ujian
        main.quizzes(v-if="quizzes.length")
            nuxt-link.quiz(v-for="(quiz, $index) in quizzes" :to="'/ujian/'+quiz.secret" :key="$index") 
                .detail
                    h3 {{ titleCase(quiz.matery.course.title) }} : {{ titleCase(quiz.matery.title) }}
                    span.text-muted Ujian Harian • {{ JSON.parse(quiz.quiz_questions).length }} Soal
                        span.text-warning(v-if="$moment().format('YYYY-MM-DD') < $moment(quiz.quiz_enabled).format('YYYY-MM-DD')") &nbsp;• Besok
                .score(v-if="quiz.quiz_score")
                    span.text-muted Nilai
                    h3 90
        .no-quiz.text-center.p2(v-else)
            h4.text-muted Tidak ada ujian hari ini
</template>

<script>
import CourseLoading from '~/components/Loading/CourseLoading';
export default {
    async asyncData({ $axios }) {
        const quizzes = await $axios.$get('quizzes');
        return { quizzes }
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
        titleCase(str) {
            let result = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            return result;
        },
        getWidth(current, total) {
            let percentage = (current/total)*100 + '%';

            return percentage;
        }
    }
}
</script>

<style lang="sass" scoped>

.quizzes
    padding: 20px
    a.quiz
        display: grid
        grid-template-columns: 1fr 60px
        text-decoration: none
        width: 100%
        padding: 15px 20px
        margin-bottom: 15px

        border-radius: 10px
        box-shadow: 0px 5px 60px -10px rgba(0, 0, 0, 0.2)
        background-color: #fff

        .score
            display: flex
            justify-content: center
            align-items: flex-end
            flex-direction: column
            .text-muted
                font-size: 14px
            h3
                color: #333
</style>
