<template lang="pug">
    header.main-header(:class="{hidden: ! show()}")
        .back.centered
            a(@click.prevent="$router.go(-1)" v-show="back()")
                span.ti-arrow-left
        .title.centered
            span.header-title {{ getTitle() }}
        .option.centered
</template>

<script>
export default {
    methods: {
        show() {
            let disabledRoutes = ['index', 'login', 'ujian-id'];
            let findIndex = disabledRoutes.findIndex(path => this.$route.name === path);
            
            return findIndex === -1;
        },
        back() {
            let enabledRoutes = [
                'pelajaran-code', 
                'stream-id', 
                'edit_profil', 
                'informasi',
                'kelas',
                'syahadah',
                'kuis',
                'rapor'
            ];
            let findIndex = enabledRoutes.findIndex(path => this.$route.name === path);
            
            return findIndex !== -1;
        },
        getTitle() {
            switch(this.$route.name) {
                case "index":
                    return "Beranda";
                case 'kuis':
                    return "Kuis";
                case 'rapor':
                    return "Rapor";
                case "syahadah":
                    return "Syahadah";
                case "kelas":
                    return "Kelas";
                case "informasi":
                    return "Informasi";
                case "pelajaran":
                    return "Mata Pelajaran";
                case "ujian":
                    return "Ujian";
                case "pelajaran-code":
                    return this.titleCase(this.$store.state.header.title);
                case "stream-id":
                    return "Materi"
                case "peringkat":
                    return "Peringkat";
                case "profil":
                    return "Profil";
                case "edit_profil":
                    return "Edit Profil"
            }
        },
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
@import "~/assets/sass/_dimensions"
@import "~/assets/sass/_colors"

.main-header
    background-color: $primary
    // box-shadow: 0 2px 5px 0 rgba(0,0,0,.3)
    position: fixed
    top: 0
    left: 0
    width: 100%
    z-index: 999
    height: $header-height
    display: grid
    grid-template-columns: 50px 1fr 50px
    transition: top 0.3s
    a
        margin-bottom: -4px
        span
            color: white
            transition: 300ms
            font-size: 20px
            font-weight: bold
    span.header-title
        transition: 300ms
        font-size: 20px
        color: white
        font-weight: 500

    &.hidden
        top: -$header-height
</style>