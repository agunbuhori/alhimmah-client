<template lang="pug">
  .content
    button(@click="logout()") Logout
</template>

<script>
export default {
  middleware: 'member',
  methods: {
      logout() {
          this.$auth.logout();
          setTimeout(() => {
              window.location.href = '/login';
          }, 500);
      }
  }
}
</script>

<style lang="sass" scoped>

</style>