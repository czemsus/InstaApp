<template>
  <div class="container">
    <form name="login-form" @submit.prevent="logIn">
      <a href=""><img src="../assets/Instagram_text.png" alt="" /></a>
      <div>
        <input
          id="username"
          type="email"
          placeholder="Adres e-mail"
          v-model="email"
        />
      </div>
      <div>
        <input
          id="password"
          type="password"
          placeholder="Hasło"
          v-model="password"
        />
      </div>
      <button type="submit">
        <div class="loader" v-show="getLoading()"></div>
        <p v-show="!getLoading()">Zaloguj się</p>
      </button>
      <p class="lined-text">LUB</p>
      <a href="">Nie pamiętasz hasła?</a>
      <a href="">
        <div class="fb">
          <img src="../assets/facebook_logo.png" width="20" />
          Zaloguj się przez Facebooka
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
export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    logIn() {
      const user = {
        email: this.email,
        password: this.password,
      };
      console.log(user);

      this.$store.dispatch("LOGIN", user);
    },
    getLoading() {
      return this.$store.getters.GET_LOGIN_LOADER;
    },
  },
};
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
  display: flex;
  justify-content: center;
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

.loader {
  display: flex;
  justify-content: center;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
