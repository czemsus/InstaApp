<template>
  <div class="container">
    <form name="login-form">
      <a href=""><img src="../assets/Instagram_text.png" alt="" /></a>
      <div class="mb-3">
        <input id="username" type="email" placeholder="Adres e-mail" />
      </div>
      <div class="mb-3">
        <input id="password" type="password" placeholder="Hasło" />
      </div>
      <button class="btn btn-outline-dark" type="submit">Zaloguj się</button>
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  padding: 40px;
}

input {
  padding: 10px 5px;
  margin-top: 12px;
  background-color: azure;
  border-radius: 4px;
  border: 1px solid lightgrey;
  width: 100%;
}

button {
  background-color: skyblue;
  border-radius: 10px;
  border: 1px solid lightgrey;
  color: aliceblue;
  margin-top: 20px;

  padding: 12px 60px;
}
</style>
