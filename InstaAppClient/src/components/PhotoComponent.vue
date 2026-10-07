<template>
  <div class="main">
    <img :src="`https://instaappfinal.onrender.com/api/getimage/${id}`" alt="zdjęcie" />
  </div>
</template>

<script>
export default {
  props: ["id"],
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
