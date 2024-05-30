<template>
  <main>
    <div class="main">
      <Navbar />
      <div class="profile-container">
        <div class="user-data">
          <ProfileData />
        </div>
        <div class="user-photos">
          <PhotoComponent
            v-for="photo in photos"
            :key="photo.id"
            :id="photo.id"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ProfileData from "@/components/ProfileData.vue";
import PhotoComponent from "@/components/icons/PhotoComponent.vue";

export default {
  data() {
    return {
      user: this.$store.getters.GET_USER_DATA,
      photos: this.$store.getters.GET_USER_PHOTOS,
    };
  },
  watch: {
    "$store.getters.GET_USER_DATA": {
      handler(newValue) {
        this.user = newValue;
      },
      immediate: true,
    },
    "$store.getters.GET_USER_PHOTOS": {
      handler(newValue) {
        this.photos = newValue;
      },
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch("RELOAD_USER_DATA");
  },
  components: {
    Navbar,
    ProfileData,
    PhotoComponent,
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}

.user-photos {
  display: flex;
  flex-wrap: wrap;
  padding: 10vh 20vw;
}
</style>
