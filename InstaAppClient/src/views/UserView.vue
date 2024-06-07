<template>
  <div class="main">
    <Navbar />
    <div class="profile-container">
      <div class="user-data">
        {{ clicked }}

        <ProfileData :mail="email" />
      </div>
      <div class="user-photos">
        <PhotoComponent
          v-for="photo in photos"
          :key="photo.id"
          :id="photo.id"
          @click="setClicked(photo.id)"
        />
        <PhotoDetails
          v-for="photo in photos"
          v-show="clicked == photo.id"
          :id="photo.id"
          :desc="photo.desc"
          :tagi="photo.tags"
          @close="closePhoto()"
        />
      </div>
    </div>
    <h1>User Component</h1>
    <p>Email: {{ email }}</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ProfileData from "@/components/ProfileData.vue";
import PhotoComponent from "@/components/PhotoComponent.vue";
export default {
  data() {
    return {
      email: "",
      user: null,
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
  async created() {
    this.email = this.$route.params.email;
  },
  components: { Navbar, PhotoComponent, ProfileData },
};
</script>

<style scoped>
.main {
  display: flex;
}
</style>
