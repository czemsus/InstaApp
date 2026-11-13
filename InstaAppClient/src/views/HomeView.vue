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
        :likes-count="photo.likesCount"
        :liked-by-user="photo.likedByUser"
        @open="openPhoto"
      />
      <p v-if="loadError" class="load-error" role="alert">{{ loadError }}</p>
    </div>
    <PhotoDetails
      v-if="selectedPhoto"
      :id="selectedPhoto.id"
      :desc="selectedPhoto.desc"
      :tagi="selectedPhoto.tags"
      :photo-owner="selectedPhoto.album"
      :editable="false"
      @close="selectedPhotoId = null"
    />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import PhotoCard from "@/components/PhotoCard.vue";
import PhotoDetails from "@/components/PhotoDetails.vue";

export default {
  components: { Navbar, PhotoCard, PhotoDetails },
  data() {
    return {
      loadError: "",
      selectedPhotoId: null,
    };
  },
  computed: {
    photos() {
      return this.$store.getters.GET_LIST;
    },
    selectedPhoto() {
      return this.photos.find(
        (photo) => String(photo.id) === String(this.selectedPhotoId),
      );
    },
  },
  methods: {
    openPhoto(id) {
      this.selectedPhotoId = id;
    },
  },
  async created() {
    try {
      const result = await this.$store.dispatch("FETCH_PHOTOS");
      if (result === false) {
        this.loadError = "Nie udało się załadować zdjęć. Odśwież stronę i spróbuj ponownie.";
      }
    } catch (error) {
      this.loadError = "Nie udało się załadować zdjęć. Odśwież stronę i spróbuj ponownie.";
    }
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
  padding: 16px 0;
  gap: 16px;
}

.load-error {
  color: #c62828;
  text-align: center;
}
</style>
