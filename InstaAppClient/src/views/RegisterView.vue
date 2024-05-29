<template>
  <div>
    <ErrorField
      v-show="getStatus()"
      :status="getStatus()"
      :message="getMessage()"
    />
    <div class="formContainer">
      <form name="login-form" @submit.prevent="register">
        <a href=""
          ><img
            src="../assets/Instagram_text.png"
            alt=""
            style="padding-left: 18px"
        /></a>
        <div>
          <p style="text-align: center">
            Zarejestruj się, aby przeglądać <br />zdjęcia i filmy znajomych.
          </p>
        </div>
        <a href="">
          <div class="fb">
            <img src="../assets/facebook_logo.png" width="20" />
            Zarejestruj się przez Facebooka
          </div></a
        >
        <p class="lined-text">LUB</p>
        <div>
          <input
            id="username"
            type="email"
            placeholder="Adres e-mail"
            v-model="email"
            required
          />
        </div>
        <div>
          <input type="text" v-model="name" placeholder="Imię" requierd />
        </div>
        <div>
          <input
            type="text"
            v-model="lastname"
            placeholder="Nazwisko"
            requierd
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            placeholder="Hasło"
            v-model="password"
            required
          />
        </div>
        <button type="submit">
          <div class="loader" v-show="getLoading()"></div>
          <p v-show="!getLoading()">Zarejestruj się</p>
        </button>

        <p class="desc">
          Rejestrując się, akceptujesz Regulamin. Informacje<br />
          o tym, jak gromadzimy, wykorzystujemy i <br />udostępniamy Twoje dane,
          zawierają nasze Zasady<br />
          dotyczące plików cookie. O korzystaniu z plików<br />
          cookie i podobnych technologii informują<br />
          Zasady dotyczące plików cookie.<br />
        </p>
      </form>

      <div class="hasAccount">
        <p>Masz już konto?</p>
        <RouterLink to="/login">Zaloguj się</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorField from "@/components/ErrorField.vue";
export default {
  data() {
    return {
      name: "",
      lastname: "",
      email: "",
      password: "",
    };
  },
  methods: {
    getLoading() {
      return this.$store.getters.GET_LOGIN_LOADER;
    },
    getStatus() {
      return this.$store.getters.GET_STATUS;
    },
    getMessage() {
      return this.$store.getters.GET_MESSAGE;
    },
    register() {
      const user = {
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      };
      this.$store.dispatch("REGISTER", user);
    },
  },
  components: { ErrorField },
};
</script>

<style scoped>
.hasAccount {
  display: flex;
  flex-direction: row;
  border: 1px solid lightgray;
  padding: 40px 70px;
  gap: 10px;
}

.desc {
  font-size: 70%;
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
