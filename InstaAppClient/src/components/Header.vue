<template>
  <div class="header">
    <img src="../assets/logo.png" alt="" class="logo" />
    <div class="menu">
      <RouterLink to="/" exact>Home</RouterLink>
      <RouterLink to="/login">About</RouterLink>
      <RouterLink to="/nnn">Not found</RouterLink>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.header {
  display: flex;
  padding: 30px;
}

.logo {
  width: 50px;
  height: 50px;
}

.menu {
  display: flex;
  justify-content: center;
  background-color: #333;
  padding: 1rem;
}

.menu a {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu a:hover {
  background-color: #575757;
}

.menu a.router-link-active {
  background-color: #007bff;
  color: white;
}
</style>
