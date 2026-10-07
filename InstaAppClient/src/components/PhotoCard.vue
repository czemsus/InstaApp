<template>
  <div class="photo-card">
    <div class="user-name">
      <p style="display: none">{{ profileimage }}</p>
      <img :src="profileimage" alt="" width="50px" height="50px" />
      <b>{{ user }}</b>
    </div>
    <div class="image">
      <img
        :src="`https://instaappfinal.onrender.com/api/getimage/${id}`"
        alt=""
        width="400px"
      />
    </div>
    <div class="buttons"></div>
    <div class="photo-desc">
      <b>{{ user }}</b> {{ desc }}
    </div>
    <div class="tags">
      <div class="photo-tags" v-for="tag in tags">
        <b>#{{ tag }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      profileimage: null,
    };
  },
  methods: {
    async fetchProfileImage(user) {
      try {
        const response = await axios.get(
          `https://instaappfinal.onrender.com/api/profile/getprofilepicture/${user}`,
          {
            responseType: "blob",
          }
        );
        let reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          let base64data = reader.result;
          this.profileimage = base64data;
        };
      } catch (error) {
        console.error("Error fetching profile image", error);
      }
    },
  },

  props: ["id", "user", "desc", "tags"],
  async created() {
    await this.fetchProfileImage(this.user);
  },
};
</script>

<style scoped>
.photo-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  max-width: 420px;
  overflow-wrap: break-word;
}

img {
  border-radius: 4px;
  aspect-ratio: 4/5;
}

.user-name {
  padding: 15px 0px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  overflow-wrap: break-word;
}

.photo-tag {
  background-color: #f7f7f7;
  padding: 5px 10px;
  border-radius: 16px;
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-desc {
  overflow-wrap: break-word;
}
</style>
