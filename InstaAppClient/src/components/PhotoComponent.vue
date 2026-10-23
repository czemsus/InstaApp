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
  flex: 0 0 calc(33.33% - 10px);
  max-width: calc(33.33% - 10px);
  aspect-ratio: 1;
  margin: 2px;
}

img {
  max-width: 100%;
}
</style>
