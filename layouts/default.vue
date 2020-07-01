<template>
  <div>
    <div class="container">
      <Nuxt />
      <BottomNav/>
    </div>
  </div>
</template>

<script>
import BottomNav from '~/components/BottomNav';
export default {
  components: {
    BottomNav
  }
}
</script>