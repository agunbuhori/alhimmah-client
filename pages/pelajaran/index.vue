<template lang="pug">
    .content
        .cards(v-if="classroom.courses && started")
            nuxt-link.card(v-for="(course, $index) in classroom.courses" :to="'/pelajaran/'+course.code" :key="$index") 
                h4 {{ $string.title(course.title) }}
                p.text-muted.text-small {{ course.member_materies_count +'/'+ course.materies_count + ' Pertemuan • ' + course.teacher.front_degree + ' ' + course.teacher.name }}

                .progress.mt-1
                    .progress-value(:style="{width: getWidth(course.member_materies_count, course.materies_count)}")
        
        .not-found.centered-column.p-4(v-else)
            img.placeholder(src="/quiz.svg")
            h2.text-center.text-muted Antum belum mendaftar kelas atau kelas belum mulai

            .p-v2.text-center(v-if="classroom.courses")
                p.mt-2.text-muted Kelas dimulai pada {{ $moment(classroom.started).format('dddd, DD MMM YYYY') }}
                button.btn.btn-primary.mt-2(@click="startClass()") Bismillah, mulai sekarang saja
</template>

<script>
import CourseLoading from '~/components/Loading/CourseLoading';
export default {
    middleware: 'auth',
    async asyncData({ $axios, $moment }) {
        const classroom = await $axios.$get('courses');
        let started = classroom.started <= $moment().format('YYYY-MM-DD');
        return { classroom, started }
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
        getWidth(current, total) {
            let percentage = (current/total)*100 + '%';

            return percentage;
        },
        async startClass() {
            this.$axios.$post('start_class')
            .then(response => {
                this.started = true;
            })
        }
    }
}
</script>