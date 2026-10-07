<template>
  <ErrorField
    v-show="getStatus()"
    :status="getStatus()"
    :message="getMessage()"
  />
  <div class="formContainer">
    <form name="login-form" @submit.prevent="logIn">
      <a href=""><img src="@/assets/instagram_text.png" alt="" /></a>
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
          <img src="@/assets/facebook_logo.png" width="20" />
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
import ErrorField from "@/components/ErrorField.vue";

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
    getToken() {
      return this.$store.getters.GET_TOKEN;
    },
  },
  components: { ErrorField },
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
</style>
