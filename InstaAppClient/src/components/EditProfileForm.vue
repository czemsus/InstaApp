<template>
  <SendProfilePicture v-show="showModal" @close="changeModal()" />
  <div class="form">
    <img src="../assets/instagram_text.png" alt="" />

    <div class="image">
      <img :src="profileImage" alt="" width="50px" />
      <p>{{ user.email }}</p>
      <button @click="changeModal()">Zmień zdjęcie</button>
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
import axios from "axios";
import SendProfilePicture from "./SendProfilePicture.vue";
import AddingPhotoForm from "./AddingPhotoForm.vue";
export default {
  data() {
    return {
      user: {},
      newName: "",
      newLastname: "",
      newBio: "",
      profileImage: null,
      token: null,
      showModal: false,
    };
  },
  methods: {
    async fetchUser(token) {
      await this.$store.dispatch("FETCH_USER_DATA", token);
      this.user = this.$store.state.user;
    },
    changeModal() {
      this.showModal = !this.showModal;
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
    async fetchProfileImage() {
      try {
        const response = await axios.get(
          "https://instaappfinal.onrender.com/api/profile/pfp",
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            responseType: "blob",
          }
        );
        let reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          let base64data = reader.result;
          this.profileImage = base64data;
        };
      } catch (error) {
        console.error("Error fetching profile image", error);
      }
    },
  },
  async created() {
    try {
      const token = this.getToken();
      this.token = this.getToken();
      await this.fetchProfileImage();
      if (token) {
        await this.fetchUser(token);
        this.user = this.getUser();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  },
  components: { SendProfilePicture, AddingPhotoForm },
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
