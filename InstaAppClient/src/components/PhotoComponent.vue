<template>
  <div class="main">
    <img :src="imageUrl" alt="zdjęcie" />
  </div>
</template>

<script>
import { API_BASE_URL } from "@/api/api";

export default {
  props: ["id"],
  data() {
    return {
      apiBaseUrl: API_BASE_URL,
    };
  },
  computed: {
    imageUrl() {
      return `${this.apiBaseUrl}/api/getimage/${this.id}?v=${this.$store.getters.PHOTO_REVISION}`;
    },
  },
};
</script>

<style scoped>
.main {
  width: 100%;
  max-width: none;
  aspect-ratio: 1;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
