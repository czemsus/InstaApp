<template>
  <div class="main" v-if="user">
    <div class="profile-picture">
      <img class="profile-image" :src="profileImage" style="aspect-ratio: 1" />
    </div>
    <div class="user-data">
      <div class="user-mail">
        {{ user.email }}
        <RouterLink to="/edit">Edytuj profil</RouterLink>
      </div>
      <div class="user-name">{{ user.name }} {{ user.lastname }}</div>
      <div class="user-bio">{{ user.bio }}</div>
    </div>
  </div>
</template>

<script>
import profile from "@/store/profile";
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      token: null,
      profileImage: null,
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
    async fetchProfileImage() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/profile/pfp",
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
      this.token = this.getToken();
      await this.fetchProfileImage();
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
.main {
  display: flex;
  padding: 5vh 20vw;
  gap: 50px;
}

.profile-image {
  border-radius: 50%;
  width: 120px;
  border: 2px lightgray;
}

.user-mail {
  font-size: 150%;
  display: flex;
}

.user-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

button {
  padding: 20px;
}

a {
  color: black;
  text-decoration: none;
  border-radius: 4px;
  margin: 0px 30px;
  padding: 0px 10px;
  transition: background-color 0.3s ease;
  background-color: rgb(235, 235, 235);
}

a:hover {
  background-color: rgb(192, 192, 192);
}
</style>
