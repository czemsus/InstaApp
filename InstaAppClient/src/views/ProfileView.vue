<template>
  <main>
    <div class="main">
      <Navbar />
    </div>
  </main>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}
</style>
