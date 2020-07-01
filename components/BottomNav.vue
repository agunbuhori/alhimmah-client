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
                {label: "Nilai", icon: "bar-chart-alt", path: "/nilai"},
                {label: "Akun", icon: "user", path: "/akun"},
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
$navHeight: 55px
.bottom-nav
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    display: flex
    justify-content: space-around
    align-items: center
    height: $navHeight
    background-color: #f1f1f1
    transition: bottom 300ms

    a
        text-decoration: none
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        color: #333

        span[class^='ti']
            font-size: 14pt
            margin-bottom: 3px
        .nav-label
            font-size: 9pt
            font-weight: bold

        &.active
            color: purple

.hidden
    bottom: -$navHeight

</style>