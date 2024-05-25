<template>
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
      <RouterLink to="/nnn"
        ><font-awesome-icon :icon="['fas', 'plus']" /> Utwórz</RouterLink
      >
      <RouterLink to="/profile"
        ><font-awesome-icon :icon="['far', 'compass']" /> Profil</RouterLink
      >
    </div>
  </div>
</template>

<script>
export default {};
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
  height: 100vh;
}

.menu a {
  color: black;
  text-decoration: none;
  padding: 1rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu a:hover {
  background-color: rgb(242, 242, 242);
}

.menu a.router-link-active {
  font-weight: 900;
  color: black;
}
</style>
