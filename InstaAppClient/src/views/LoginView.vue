<template>
  <div class="errorBox" v-show="getStatus()">
    <h1>{{ getStatus() }}</h1>
    <p>{{ getMessage() }}</p>
  </div>
  <div class="formContainer">
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
    getStatus() {
      return this.$store.getters.GET_STATUS;
    },
    getMessage() {
      return this.$store.getters.GET_MESSAGE;
    },
  },
};
</script>

<style scoped>
a {
  text-align: center;
}

.noAccount {
  display: flex;
  flex-direction: row;
  border: 1px solid lightgray;
  padding: 40px 40px;
  gap: 10px;
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
