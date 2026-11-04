<template>
  <div class="main">
    <Navbar />
    <div class="profile-container">
      <div v-if="user?.user" class="user-data">
        <div class="profile-picture">
          <img
            class="profile-image"
            :src="profileImage"
            style="aspect-ratio: 1"
          />
        </div>
        <div class="user-info">
          <div class="user-mail">
            {{ email }}
            <RouterLink v-if="isOwnProfile" to="/edit" class="edit-profile">
              Edytuj profil
            </RouterLink>
          </div>
          <div class="user-name">
            {{ user.user.name }} {{ user.user.lastname }}
          </div>
        </div>

        <div class="user-bio">{{ user.user.bio }}</div>
      </div>
      <div v-if="user?.user" class="user-photos">
        <div class="photo" v-for="photo in photos.photos">
          <img
            :src="`${apiBaseUrl}/api/getimage/${photo.id}`"
            alt="zdjęcie"
            style="aspect-ratio: 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";
import PhotoComponent from "@/components/PhotoComponent.vue";
import { API_BASE_URL } from "@/api/api";
export default {
  data() {
    return {
      email: "",
      user: null,
      profileImage: null,
      apiBaseUrl: API_BASE_URL,
    };
  },
  computed: {
    isOwnProfile() {
      const currentEmail = this.$store.getters.GET_EMAIL;
      return (
        typeof currentEmail === "string" &&
        currentEmail.toLowerCase() === this.email.toLowerCase()
      );
    },
    photos() {
      return this.$store.getters.GET_USER_PHOTOS;
    },
  },
  watch: {
    "$route.params.email": {
      handler(email) {
        this.loadProfile(email);
      },
      immediate: true,
    },
  },
  methods: {
    async fetchProfileImage(email) {
      try {
        const response = await axios.get(
          `${this.apiBaseUrl}/api/profile/getprofilepicture/${email}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: "blob",
          }
        );
        let reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          let base64data = reader.result;
          this.profileImage = base64data;
        };
      } catch (error) {
        console.error("Error fetching profile image", error);
      }
    },
    async loadProfile(email) {
      this.email = email;
      this.user = null;
      this.profileImage = null;

      await this.$store.dispatch("GET_SOMEONES_DATA", email);
      await this.$store.dispatch("GET_SOMEONES_PHOTOS", email);
      if (this.email !== email) {
        return;
      }

      this.user = this.$store.getters.GET_USER_DATA;
      await this.fetchProfileImage(email);
    },
  },
  components: { Navbar, PhotoComponent },
};
</script>

<style scoped>
.main {
  display: flex;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 40px;
}

.profile-image {
  border-radius: 50%;
  width: 120px;
  border: 2px lightgray;
}

.user-mail {
  font-size: 150%;
}

.edit-profile {
  margin-left: 16px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: rgb(235, 235, 235);
  color: #111;
  font-size: 14px;
  text-decoration: none;
}

.edit-profile:hover {
  background-color: rgb(210, 210, 210);
}

.user-data {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 50px;
  justify-content: flex-start;
}

.photo {
  flex: 0 0 calc(33.33% - 10px);
  aspect-ratio: 1;
  margin: 2px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.photo img {
  width: 290px;
  aspect-ratio: 1;
}
</style>
