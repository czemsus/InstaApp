<template>
  <main>
    <div class="main">
      <Navbar />
      <div class="profile-container">
        <div class="user-data">
          <ProfileData />
        </div>
        <div class="user-photos">
          <PhotoComponent v-for="photo in getUserPhotos()" :id="photo.id" />
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
      user: {},
      photos: [],
    };
  },
  methods: {
    async fetchUser(token) {
      await this.$store.dispatch("FETCH_USER_DATA", token);
      this.user = this.$store.state.user;
    },
    getToken() {
      return this.$store.getters.GET_TOKEN;
    },
    getUser() {
      return this.$store.getters.GET_USER_DATA;
    },
    getUserPhotos() {
      return this.$store.getters.GET_USER_PHOTOS;
    },
    async fetchUserPhotos() {
      await this.$store.dispatch("GET_USER_PHOTOS", this.getUser().mail);
    },
  },
  async created() {
    try {
      const token = this.getToken();
      if (token) {
        await this.fetchUser(token);
        await this.fetchUserPhotos(this.getUser().email);
        console.log(this.getUserPhotos());
        this.user = this.getUser();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
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
