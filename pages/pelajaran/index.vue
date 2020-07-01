<template lang="pug">
    .content
        header.content-header
            span.text-muted Kelas
            h2 {{ titleCase(classroom.name) }}
        main.courses(v-if="classroom.courses.length")
            nuxt-link.course(v-for="(course, $index) in classroom.courses" :to="'/pelajaran/'+course.code" :key="$index") 
                h3 {{ titleCase(course.title) }}
                p.text-muted {{ course.member_materies_count +'/'+ course.materies_count + ' Pertemuan • ' + course.teacher.front_degree + ' ' + course.teacher.name }}

                .progress
                    .progress-value(:style="{width: getWidth(course.member_materies_count, course.materies_count)}")
        CourseLoading(v-else)
</template>

<script>
import CourseLoading from '~/components/Loading/CourseLoading';
export default {
    async asyncData({ $axios }) {
        const classroom = await $axios.$get('courses');
        return { classroom }
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

.courses
    padding: 20px
    a.course
        display: block
        text-decoration: none
        width: 100%
        padding: 15px 20px
        margin-bottom: 15px
        border-radius: 10px
        box-shadow: 0px 5px 60px -10px rgba(0, 0, 0, 0.2)
        background-color: #fff
</style>
