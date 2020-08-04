<template lang="pug">
    .content
        .cards(v-if="! classroom")
            .card(v-for="classroom in cls.classrooms")
                .title
                    h4 {{ $string.title(classroom.name) }}
                    span.text-muted {{ classroom.courses_count }} Pelajaran
                a.btn.btn-primary.btn-block.btn-small(@click="selectClass(classroom)") Lihat
        .modal(v-else)
            .modal-box.p-2(v-if="! registration")
                h2.header-title {{ classroom.name }}
                .alert.alert-warning.mt-1(v-if="cls.classroom_member && cls.classroom_member.id === classroom.id") Antum sedang menjalani kelas ini.
                .description(v-html="classroom.description")
                .courses
                    .mapel.p-1.text-center
                        h4 Mata Pelajaran
                    .course(v-for="course in classroom.courses")
                        strong {{ $string.title(course.title) }}
                .buttons
                    button.btn.btn-danger.btn-small(@click="classroom = false") Tutup
                    button.btn.btn-primary.btn-small(@click="registration = true" v-if="! cls.classroom_member") Daftar Kelas Ini

            .modal-box.p-2(v-else)
                h2.header-title {{ classroom.name }}
                .alert.alert-warning.mv-1 Setelah mendaftar kelas ini antum tidak dapat mendaftar kelas lain sampai kelas ini selesai.
                .form-group
                    label Tanggal mulai
                    Datetime(v-model="start_date" placeholder="Pilih tanggal mulai belajar" required)
                .buttons
                    button.btn.btn-primary.btn-small(@click="registration = false") Batal
                    button.btn.btn-success.btn-small(@click="register()") Bismillah, Daftar
</template>

<script>
import { Settings } from 'luxon';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Settings.defaultLocale = 'id'

export default {
    async asyncData({ $axios, $auth }) {
        const cls = await $axios.$get('classrooms');
        return { cls }
    },
    components: {
        Datetime
    },
    data() {
        return {
            classroom: false,
            registration: false,
            start_date: this.$moment().format('YYYY-MM-DD')
        }
    },
    mounted() {
        
    },
    methods: {
        selectClass(classroom) {
            this.classroom = classroom;
        },
        async register() {
            await this.$axios.$post('register_classroom', {
                start_date: this.start_date,
                classroom_id: this.classroom.id
            })
            .then(response => {
                this.$router.push('/');
            });
        }
    }
}
</script>

<style lang="sass" scoped>
.cards
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 10px

.title
    height: 80px

.header-title
    border-bottom: 1px solid #ddd

.modal
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    z-index: 9999
    display: flex
    align-items: center
    transition: background 0.4s

    &-box
        animation: slideup 400ms
        width: 100%
        background-color: #f2f3f4
    a
        color: #2980b9 !important
        font-weight: 500
@keyframes slideup
    0%
        margin-bottom: -100%
.description
    line-height: 20px
    margin-top: 15px
    font-size: 15px
    color: #333

.buttons
    display: flex
    justify-content: space-between


.courses
    border-radius: 10px
    margin-bottom: 15px
    margin-top: 10px
    box-shadow: 0 7px 14px 0 rgba(60,66,87, 0.10), 0 3px 6px 0 rgba(0,0,0, 0.10)
    background-color: white
    .course
        padding: 5px 10px
        border-top: 1px solid #eee
        font-size: 14px
        
</style>