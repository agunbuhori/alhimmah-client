<template lang="pug">
  .content.no-header
    .welcome.text-center.centered-column.p2
      h3 اهلا وسهلا
      h2 {{ profile.name }}
      .class.mt-2.text-small {{ user.classroom ? "Kelas "+user.classroom.name : "Belum Mendaftar Kelas"}}
    .p-2
      .alert.alert-warning.mb-2(v-if="! profile.member_id") Lengkapi profil dengan mengisi nama, jenis kelamin dan tanggal lahir agar antum bisa mendapatkan NIP & Syahadah.

      .menus
        nuxt-link.menu.centered-column.card(to="/kelas")
          img(src="/menu/030-strategy.png")
          span Kelas
        
        nuxt-link.menu.centered-column.card(to="/kuis")
          img(src="/menu/008-rating.png")
          span Kuis
        
        nuxt-link.menu.centered-column.card(to="/rapor")
          img(src="/menu/047-pie chart.png")
          span Rapor

        
        nuxt-link.menu.centered-column.card(to="/informasi")
          img(src="/menu/044-promotion.png")
          span Informasi
        
        nuxt-link.menu.centered-column.card(to="/syahadah")
          img(src="/menu/005-id card.png")
          span Syahadah
        
        nuxt-link.menu.centered-column.card(to="/edit_profil")
          img(src="/menu/049-management.png")
          span Profil
      .posts
        h3.mb-1 Artikel & Berita
        //- ssr
        carousel(:nav="false" :autoWidth="true" v-if="posts.length")
          .post(v-for="post in posts") 
            img(:src="post.better_featured_image.source_url")
            .post-content
              strong {{ post.title.rendered }}

        
        
        //- a.menu.centered-column
        //-   img(src="/menu/030-strategy.png")
        //-   span Satistik
        
        //- a.menu.centered-column
        //-   img(src="/menu/030-strategy.png")
        //-   span Satistik
        
        //- a.menu.centered-column
        //-   img(src="/menu/030-strategy.png")
        //-   span Satistik
        
        
</template>

<script>
export default {
  middleware: 'auth',
  async asyncData({ $axios }) {
        const user = await $axios.$get('profile?with_classroom=true');
        const profile = user.profile;
        
        return { user, profile };
    },
    components: {
      // carousel
    },
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    this.getPosts();
  },
  methods: {
      logout() {
          this.$auth.logout();
          setTimeout(() => {
              window.location.href = '/login';
          }, 500);
      },
      async getPosts() {
        const posts = await this.$axios.$get("https://news.yoyaku.id/wp-json/wp/v2/posts");
        this.posts = posts;
      }
  }
}
</script>

<style lang="sass" scoped>
@import "~/assets/sass/_colors"
.welcome
  color: white
  padding: 30px 20px
  background-color: $primary

.class
  padding: 8px 15px
  background-color: darken($primary, 9)
  border-radius: 20px

.menus
  display: grid
  grid-gap: 10px
  grid-template-columns: repeat(3, 1fr)
  grid-template-rows: repeat(2, 1fr)
  width: 100%
  margin-bottom: 20px
  flex-wrap: wrap
  justify-content: space-between

  .menu
    padding: 15px
    display: flex
    border-radius: 10px
    box-shadow: 0 7px 14px 0 rgba(60,66,87, 0.10), 0 3px 6px 0 rgba(0,0,0, 0.10)
    background-color: #fff
    img
      width: 45px
      margin-bottom: 10px
    span
      font-size: 13px
      font-weight: bold

.posts
  margin-right: -20px
  .post
    overflow: hidden
    background-color: white
    border-radius: 10px
    margin-right: 10px
    width: 200px
    height: 120px
    position: relative
    .post-content
        color: white
        position: absolute
        padding: 10px
        background-color: rgba(0, 0, 0, 0.5)
        height: 100%
        line-height: 15px
        top: 0
        left: 0
    // border: 1px solid #eee
    img
      height: 100%
    strong
      font-size: 13px
.owl-item:first-child
  margin-left: 20px !important
</style>