<template>
  <AddingPhotoForm v-if="isVisible" @close="closeForm" />
  <div class="header">
    <img src="../assets/instagram_text.png" width="160px" />
    <div class="menu">
      <RouterLink to="/" exact>
        <font-awesome-icon :icon="['fas', 'home']" /> Strona główna</RouterLink
      >
      <RouterLink to="/search"
        ><font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        Szukaj</RouterLink
      >
      <RouterLink to="/nnn"
        ><font-awesome-icon :icon="['far', 'compass']" /> Eksploruj</RouterLink
      >
      <RouterLink to="/nnn"
        ><font-awesome-icon :icon="['fas', 'video']" /> Rolki</RouterLink
      >
      <RouterLink to="/nnn"
        ><font-awesome-icon :icon="['far', 'paper-plane']" />
        Wiadomości</RouterLink
      >
      <RouterLink to="/nnn"
        ><font-awesome-icon :icon="['far', 'heart']" /> Polubienia</RouterLink
      >
      <p @click="toggleForm">
        <font-awesome-icon :icon="['fas', 'plus']" /> Utwórz
      </p>
      <RouterLink to="/profile"
        ><font-awesome-icon :icon="['far', 'compass']" /> Profil</RouterLink
      >
    </div>
  </div>
</template>

<script>
import AddingPhotoForm from "./AddingPhotoForm.vue";
export default {
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    toggleForm() {
      this.isVisible = !this.isVisible;
    },
    closeForm() {
      this.isVisible = false;
    },
  },
  components: { AddingPhotoForm },
};
</script>

<style scoped>
img {
  padding: 24px 8px;
}

.header {
  display: flex;
  flex-direction: column;
  border-right: 1px solid lightgray;
  padding-right: 70px;
  min-width: 306px;
}

.logo {
  width: 50px;
  height: 50px;
}

.menu {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 1rem;
}

.header {
  height: 100vh;
}

.menu a,
.menu p {
  color: black;
  text-decoration: none;
  padding: 1rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu a:hover,
.menu p:hover {
  background-color: rgb(242, 242, 242);
  cursor: pointer;
}

.menu a.router-link-active {
  font-weight: 900;
  color: black;
}
</style>
