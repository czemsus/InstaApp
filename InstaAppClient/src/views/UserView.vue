<template>
  <div class="main">
    <Navbar />
    <div class="profile-container">
      <div v-if="user?.user" class="user-data">
        <div class="profile-header">
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
        </div>

        <div class="user-bio">{{ user.user.bio }}</div>
      </div>
      <div v-if="user?.user" class="user-photos">
        <p v-if="photosError" class="photos-error" role="alert">
          {{ photosError }}
        </p>
        <p v-else-if="userPhotos.length === 0" class="empty-photos">
          Uytkownik nie opublikował jeszcze zdjęć
        </p>
        <PhotoComponent
          v-else
          v-for="photo in userPhotos"
          :key="photo.id"
          :id="photo.id"
          role="button"
          tabindex="0"
          :aria-label="`Pokaż szczegóły zdjęcia ${photo.desc || ''}`"
          @click="openPhoto(photo.id)"
          @keydown.enter="openPhoto(photo.id)"
          @keydown.space.prevent="openPhoto(photo.id)"
        />
      </div>
      <PhotoDetails
        v-if="selectedPhoto"
        :id="selectedPhoto.id"
        :desc="selectedPhoto.desc"
        :tagi="selectedPhoto.tags"
        :editable="isOwnProfile"
        @close="selectedPhotoId = null"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";
import PhotoComponent from "@/components/PhotoComponent.vue";
import PhotoDetails from "@/components/PhotoDetails.vue";
import { API_BASE_URL } from "@/api/api";
export default {
  data() {
    return {
      email: "",
      user: null,
      profileImage: null,
      apiBaseUrl: API_BASE_URL,
      selectedPhotoId: null,
      photosError: "",
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
    userPhotos() {
      return Array.isArray(this.photos) ? this.photos : this.photos?.photos || [];
    },
    selectedPhoto() {
      return this.userPhotos.find((photo) => photo.id === this.selectedPhotoId);
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
    openPhoto(id) {
      this.selectedPhotoId = id;
    },
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
      this.selectedPhotoId = null;
      this.photosError = "";

      await this.$store.dispatch("GET_SOMEONES_DATA", email);
      const photos = await this.$store.dispatch("GET_SOMEONES_PHOTOS", email);
      if (this.email !== email) {
        return;
      }

      this.user = this.$store.getters.GET_USER_DATA;
      if (photos === false) {
        this.photosError = "Nie udało się załadować zdjęć użytkownika.";
      }
      await this.fetchProfileImage(email);
    },
  },
  components: { Navbar, PhotoComponent, PhotoDetails },
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
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.profile-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-photos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(900px, calc(100% - 32px));
  gap: 5px;
  margin-top: 50px;
}

.photos-error,
.empty-photos {
  grid-column: 1 / -1;
  padding: 24px;
  color: #666;
  text-align: center;
}

.photos-error {
  color: #c62828;
}

@media (max-width: 640px) {
  .user-photos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
