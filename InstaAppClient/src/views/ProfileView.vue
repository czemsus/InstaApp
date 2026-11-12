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
            @click="setClicked(photo.id)"
          />
        </div>
        <PhotoDetails
          v-if="selectedPhoto"
          :id="selectedPhoto.id"
          :desc="selectedPhoto.desc"
          :tagi="selectedPhoto.tags"
          @close="closePhoto()"
        />
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ProfileData from "@/components/ProfileData.vue";
import PhotoComponent from "@/components/PhotoComponent.vue";
import PhotoDetails from "@/components/PhotoDetails.vue";

export default {
  data() {
    return {
      user: this.$store.getters.GET_USER_DATA,
      clicked: null,
    };
  },
  watch: {
    "$store.getters.GET_USER_DATA": {
      handler(newValue) {
        this.user = newValue;
      },
      immediate: true,
    },
  },
  computed: {
    photos() {
      return this.$store.getters.GET_USER_PHOTOS;
    },
    selectedPhoto() {
      return this.photos.find(
        (photo) => String(photo.id) === String(this.clicked),
      );
    },
  },
  created() {
    this.$store.dispatch("RELOAD_USER_DATA");
  },
  components: {
    Navbar,
    ProfileData,
    PhotoComponent,
    PhotoDetails,
  },
  methods: {
    setClicked(id) {
      this.clicked = id;
    },
    closePhoto() {
      this.clicked = null;
    },
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
