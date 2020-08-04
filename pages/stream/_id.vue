<template lang="pug">
    .content
        div(v-if="! matery.limited")
            .media
                iframe(v-if="matery.video_url.match(/youtube/)" width='100%' height="300px" :src="matery.video_url" frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen='')
                video(controls="true" preload="auto" width="100%" autoplay="true" v-if="matery.video_url && ! matery.video_url.match(/youtube/)")
                    source(:src="matery.video_url")
                .ph3.mt3(v-if="matery.audio_url")
                    audio(controls="true" preload="auto" width="100%" autoplay="true")
                        source(:src="matery.audio_url")

            .detail
                h4.text-muted Materi {{ titleCase(matery.course.title) }}
                h2 {{ matery.title }}

                .article(v-html="matery.article")
        .afwan.text-center(v-else)
            img(src="/afwan.svg")            
            h1 Afwan
            p.text-muted Hari ini sudah mempelajari 2 materi, silakan coba lagi besok. Antum juga bisa muroja'ah materi yang telah dibuka hari ini dan sebelumnya.
            a.btn.btn-primary.btn-rounded.mt-2(@click="$router.go(-1)") Kembali
</template>

<script>
export default {
    middleware: 'auth',
    async asyncData({ $axios, route }) {
        const matery = await $axios.$get('stream/'+route.params.id);
        return { matery }
    },
    data() {
        return {
            timeout: null,
        }
    },
    mounted() {
        this.readPost();
    },
    deactivated() {
        clearInterval(this.timeout);
    },
    methods: {
        async readPost() {
            let time = 0;
            let interval;

            if (! this.matery.limited) {                
                this.timeout = setInterval(async () => {
                    time++;
                    if (time === 5) {
                        if (this.$route.name === 'stream-id') {
                            await this.$axios.$put('/read/'+this.$route.params.id)
                            .then(response => {

                            });
                        }
                        clearInterval(this.timeout);
                        
                        time = 0;
                    }
                }, 1000);
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
.media
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    flex-direction: column
.detail
    padding: 20px

.article
    margin-top: 15px

.afwan
    padding: 40px

    img
        width: 150px
</style>