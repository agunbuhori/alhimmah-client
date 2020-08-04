<template lang="pug">
    .bottom-nav(:class="{hidden: ! checkRoute()}")
        nuxt-link(v-for="(nav, $index) in navs" :to="nav.path" :class="{active: $route.path === nav.path}" :key="$index")
            span(:class="'ti-'+nav.icon")
            span.nav-label {{ nav.label }}
        
</template>

<script>
export default {
    data() {
        return {
            navs: [
                {label: "Home", icon: "home", path: "/"},
                {label: "Pelajaran", icon: "agenda", path: "/pelajaran"},
                {label: "Ujian", icon: "ruler-pencil", path: "/ujian"},
                {label: "Peringkat", icon: "bar-chart-alt", path: "/peringkat"},
                {label: "Profil", icon: "user", path: "/profil"},
            ]
        }
    },
    methods: {
        checkRoute() {
            return  this.navs.findIndex(nav => nav.path === this.$route.path) !== -1;
        }
    }
}
</script>

<style lang="sass" scoped>
@import "~/assets/sass/_dimensions"
@import "~/assets/sass/_colors"
.bottom-nav
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    display: flex
    justify-content: space-around
    align-items: center
    height: $navbar-height
    background-color: #fafafa
    border-top: 1px solid #ddd
    transition: bottom 300ms
    z-index: 999

    a
        text-decoration: none
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        color: #666

        span[class^='ti']
            font-size: 14pt
            margin-bottom: 3px
        .nav-label
            font-size: 9pt
            font-weight: bold

        &.active
            color: $primary

.hidden
    bottom: -$navbar-height

</style>