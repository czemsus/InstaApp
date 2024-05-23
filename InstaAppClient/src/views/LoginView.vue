<template>
  <div class="container">
    <form name="login-form">
      <a href=""><img src="../assets/Instagram_text.png" alt="" /></a>
      <div>
        <input id="username" type="email" placeholder="Adres e-mail" />
      </div>
      <div>
        <input id="password" type="password" placeholder="Hasło" />
      </div>
      <button type="submit">Zaloguj się</button>
      <p class="lined-text">LUB</p>
      <a href="">Nie pamiętasz hasła?</a>
      <a href="">
        <div class="fb">
          <img src="../assets/facebook_logo.png" width="20" /> Zaloguj się przez
          Facebooka
        </div></a
      >
    </form>
    <div class="noAccount">
      <p>Nie masz konta?</p>
      <RouterLink to="/register">Zarejestruj się</RouterLink>
    </div>
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
  flex-direction: column;
  gap: 40px;
}

form {
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  padding: 40px;
  gap: 10px;
}

input {
  padding: 10px 5px;
  margin-top: 2px;
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

a {
  text-align: center;
}

.lined-text {
  display: flex;
  align-items: center;
  text-align: center;
}

.lined-text::before,
.lined-text::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #ccc;
  margin: 0 10px;
}

.fb {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.noAccount {
  display: flex;
  flex-direction: row;
  border: 1px solid lightgray;
  padding: 40px 56px;
  gap: 10px;
}
</style>
