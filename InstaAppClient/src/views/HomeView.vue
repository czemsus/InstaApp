<template>
  <div class="main">
    <Navbar />
    <div class="photos">
      <PhotoCard
        v-for="photo in photos"
        :key="photo.id"
        :id="photo.id"
        :desc="photo.desc"
        :tags="photo.tags"
        :user="photo.album"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import PhotoCard from "@/components/PhotoCard.vue";

export default {
  components: { Navbar, PhotoCard },
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
  async created() {
    await this.$store.dispatch("FETCH_PHOTOS");
    this.photos = this.getPhotos();
    console.log(this.photos);
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-wrap: wrap;
}

.photos {
  display: flex;
  flex-direction: column;
  width: 70%;
  align-items: center;
}
</style>
