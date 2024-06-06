<template>
  <div class="main">
    <Navbar />
    <p v-for="photo in photos">{{ photo }}</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  data() {
    return {
      photos: [],
    };
  },
  methods: {
    getPhotos() {
      return this.$store.getters.GET_LIST;
    },
  },
  components: { Navbar },
  async created() {
    await this.$store.dispatch("FETCH_PHOTOS");
    this.photos = await this.getPhotos();
    console.log(this.photos);
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}
</style>
