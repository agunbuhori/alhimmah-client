<template>
  <div>
    <div class="container">
      <Header/>
      <Nuxt />
      <BottomNav/>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header';
import BottomNav from '~/components/BottomNav';
export default {
  components: {
    Header,
    BottomNav
  }
}
</script>