<template lang="pug">
    .content
        .profile-header.ph-2
            .photo
                .circle-img
                    img(:src="user.avatar")
            .name
                h3 {{ profile.name }}
                h5.text-muted {{ user.email }}
            .setting
                nuxt-link(to="/edit_profil")
                    span.ti-settings
        .profile-detail
            .list.ph-2.pv-1
                .alert.alert-warning.mb-2(v-if="! profile.member_id") Lengkapi profil dengan mengisi jenis kelamin dan tanggal lahir agar antum bisa mendapatkan NIP & Syahadah.
                label.text-muted.text-small Nomor Induk Peserta
                strong(v-if="profile.member_id") {{ profile.member_id }}
                span.text-muted(v-else)
                    i Profil tidak lengkap

            .list.ph-2.pv-1
                label.text-muted.text-small Jenis Kelamin
                strong(v-if="profile.gender") {{ profile.gender === 'male' ? 'Ikhwan' : 'Akhwat' }}
                span.text-muted(v-else)
                    i Belum diisi

            .list.ph-2.pv-1
                label.text-muted.text-small Tanggal Lahir
                strong(v-if="profile.birthday") {{ $moment(profile.birthday).format('DD MMMM YYYY') }}
                span.text-muted(v-else)
                    i Belum diisi

            .list.ph-2.pv-1
                label.text-muted.text-small Whatsapp
                strong(v-if="profile.whatsapp") {{ profile.whatsapp }}
                span.text-muted(v-else)
                    i Belum diisi

            .list.ph-2.pv-1
                label.text-muted.text-small Domisili
                strong(v-if="profile.domicilie") {{ $string.title(profile.domicilie) }}
                span.text-muted(v-else)
                    i Belum diisi
            
            .list.ph-2.pv-1.text-center
                a(@click.prevent="logout()")
                    strong.text-danger Keluar

</template>

<script>
export default {
    middleware: 'auth',
    async asyncData({ $axios, $auth }) {

        try {
            const user = await $axios.$get('profile');
            const profile = user.profile;
            return { user, profile };
        } catch (error) {
            $auth.logout();        
        }

        
    },
    methods: {
        async logout() {
            if (confirm("Yakin akan keluar?")) {
                await this.$auth.logout();
            }
        }
    }
}
</script>

<style lang="sass" scoped>
.profile-header
    height: 80px
    display: grid
    grid-template-columns: 70px 1fr 30px
    background-color: white
    border-bottom: 1px solid #eee

    .photo
        display: flex
        align-items: center

    .name
        display: flex
        justify-content: center
        flex-direction: column

        h2
            line-height: 25px

    .setting
        display: flex
        align-items: center
        justify-content: flex-end
        a
            font-size: 25px
            font-weight: bold
            color: #888
.profile-detail
    background-color: white
    margin-bottom: 20px

    .list
        border-bottom: 1px solid #eee
        display: flex
        flex-direction: column

.circle-img
    img
        width: 60px
        height: 60px
        border-radius: 40px
        overflow: hidden
</style>