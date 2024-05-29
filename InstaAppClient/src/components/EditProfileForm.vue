<template>
  <div class="form">
    <img src="../assets/Instagram_text.png" alt="" />

    <div class="image">
      <img src="../assets/pfp.png" alt="" />
      <p>{{ user.email }}</p>
      <button>Zmień zdjęcie</button>
    </div>
    <label for="name">Imię</label>
    <input type="text" name="name" :placeholder="user.name" v-model="newName" />
    <label for="lastname">Nazwisko</label>
    <input
      type="text"
      name="lastname"
      :placeholder="user.lastname"
      v-model="newLastname"
    />
    <label for="bio">Biogram</label>
    <textarea name="bio" :placeholder="user.bio" v-model="newBio"></textarea>
    <button @click="patchUserData">Prześlij</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      newName: "",
      newLastname: "",
      newBio: "",
    };
  },
  methods: {
    async fetchUser(token) {
      await this.$store.dispatch("FETCH_USER_DATA", token);
      this.user = this.$store.state.user;
    },
    getToken() {
      return this.$store.getters.GET_TOKEN;
    },
    getUser() {
      return this.$store.getters.GET_USER_DATA;
    },
    patchUserData() {
      let token = this.getToken();
      this.$store.dispatch("PATCH_USER_DATA", {
        obj: {
          name: this.newName,
          lastname: this.newLastname,
          bio: this.newBio,
        },
        token: token,
      });
    },
  },
  async created() {
    try {
      const token = this.getToken();
      if (token) {
        await this.fetchUser(token);
        this.user = this.getUser();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  },
};
</script>

<style scoped>
.form {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid lightgrey;
  padding: 10px 30px;
}

input {
  background-color: white;
  border-radius: 10px;
  margin: 20px 0px;
}

textarea {
  height: 200px;
  resize: none;
  font-family: inherit;
  font-size: inherit;
  padding: 10px;
  margin: 30px 0px;
}

label {
  margin-top: 20px;
  margin-bottom: 5px;
}

.image img {
  width: 50px;
}

.image {
  border-radius: 20px;
  background-color: rgb(235, 235, 235);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

button {
  background-color: rgb(0, 149, 246);
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  color: white;
}
</style>
