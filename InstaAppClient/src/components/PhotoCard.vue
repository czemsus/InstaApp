<template>
  <article class="photo-card">
    <header class="card-header">
      <RouterLink
        class="user-link"
        :to="{ name: 'user', params: { email: user } }"
        :title="user"
      >
        <img
          v-if="profileimage"
          class="avatar"
          :src="profileimage"
          alt=""
          @error="profileimage = null"
        />
        <span v-else class="avatar avatar-fallback" aria-hidden="true">
          {{ userInitials }}
        </span>
        <span class="username">{{ user }}</span>
      </RouterLink>
      <span class="post-menu" aria-hidden="true">•••</span>
    </header>

    <div
      class="photo-frame"
      role="button"
      tabindex="0"
      :aria-label="`Pokaż zdjęcie i komentarze użytkownika ${user}`"
      @click="$emit('open', id)"
      @keydown.enter="$emit('open', id)"
      @keydown.space.prevent="$emit('open', id)"
    >
      <img
        class="photo-image"
        :src="`${apiBaseUrl}/api/getimage/${id}`"
        :alt="desc ? `Zdjęcie użytkownika ${user}: ${desc}` : `Zdjęcie użytkownika ${user}`"
      />
    </div>

    <div class="card-content">
      <button
        class="like-button"
        :class="{ liked: likedByUser }"
        type="button"
        :aria-pressed="likedByUser"
        :aria-label="likedByUser ? 'Usuń polubienie' : 'Polub zdjęcie'"
        :disabled="isLiking"
        @click="toggleLike"
      >
        <span class="like-icon" aria-hidden="true">{{ likedByUser ? "♥" : "♡" }}</span>
        <span>{{ likedByUser ? "Polubiono" : "Lubię to" }}</span>
      </button>
      <p class="like-count">
        {{ likesCount }} {{ likesLabel }}
      </p>

      <p v-if="desc" class="photo-description">
        <RouterLink
          class="caption-user"
          :to="{ name: 'user', params: { email: user } }"
          >{{ user }}</RouterLink
        >
        {{ desc }}
      </p>
      <div v-if="tags?.length" class="tags">
        <span v-for="(tag, index) in tags" :key="`${tag}-${index}`">
          #{{ String(tag).replace(/^#/, "") }}
        </span>
      </div>
      <p v-if="likeError" class="like-error" role="alert">{{ likeError }}</p>
    </div>
  </article>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "@/api/api";

export default {
  props: {
    id: { type: [Number, String], required: true },
    user: { type: String, required: true },
    desc: { type: String, default: "" },
    tags: { type: Array, default: () => [] },
    likesCount: { type: Number, default: 0 },
    likedByUser: { type: Boolean, default: false },
  },
  data() {
    return {
      profileimage: null,
      apiBaseUrl: API_BASE_URL,
      isLiking: false,
      likeError: "",
    };
  },
  computed: {
    userInitials() {
      return this.user?.trim().charAt(0).toUpperCase() || "?";
    },
    likesLabel() {
      const remainder = this.likesCount % 10;
      const lastTwoDigits = this.likesCount % 100;
      if (this.likesCount === 1) {
        return "polubienie";
      }
      if (remainder >= 2 && remainder <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
        return "polubienia";
      }
      return "polubień";
    },
  },
  methods: {
    async fetchProfileImage(user) {
      try {
        const response = await axios.get(
          `${this.apiBaseUrl}/api/profile/getprofilepicture/${encodeURIComponent(user)}`,
          { responseType: "blob" },
        );
        this.profileimage = URL.createObjectURL(response.data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching profile image:", error);
        }
      }
    },
    async toggleLike() {
      if (this.isLiking) {
        return;
      }
      this.isLiking = true;
      this.likeError = "";
      try {
        const succeeded = await this.$store.dispatch("TOGGLE_PHOTO_LIKE", {
          id: this.id,
          liked: !this.likedByUser,
        });
        if (!succeeded) {
          this.likeError = "Nie udało się zaktualizować polubienia.";
        }
      } finally {
        this.isLiking = false;
      }
    },
  },
  beforeUnmount() {
    if (this.profileimage) {
      URL.revokeObjectURL(this.profileimage);
    }
  },
  created() {
    this.fetchProfileImage(this.user);
  },
};
</script>

<style scoped>
.photo-card {
  width: calc(100% - 20px);
  max-width: 420px;
  overflow: hidden;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px rgb(0 0 0 / 4%);
}

.card-header {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}

.user-link {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  color: #262626;
  text-decoration: none;
}

.avatar {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-fallback {
  display: grid;
  place-items: center;
  background: #efefef;
  color: #555;
  font-weight: 700;
}

.username {
  overflow: hidden;
  font-size: 14px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-menu {
  color: #555;
  font-weight: 700;
  letter-spacing: 2px;
}

.photo-frame {
  display: grid;
  width: 100%;
  aspect-ratio: 4 / 5;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-content {
  padding: 10px 16px 16px;
}

.like-button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 8px;
  border: 1px solid #e6e6e6;
  border-radius: 20px;
  background: #fff;
  color: #262626;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 650;
}

.like-icon {
  display: inline-block;
  width: 24px;
  color: #555;
  font-size: 25px;
  line-height: 1;
  text-align: center;
  transition:
    color 120ms ease,
    transform 120ms ease;
}

.like-button:hover .like-icon {
  transform: scale(1.1);
}

.like-button.liked {
  color: #ed4956;
  border-color: #f3c5ca;
  background: #fff8f8;
}

.like-button.liked .like-icon {
  color: #ed4956;
}

.like-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.like-count {
  margin: 2px 0 8px;
  font-size: 14px;
  font-weight: 650;
}

.photo-description {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.caption-user {
  margin-right: 4px;
  color: #262626;
  font-weight: 650;
  text-decoration: none;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 8px;
  color: #255a9b;
  font-size: 13px;
}

.like-error {
  margin: 8px 0 0;
  color: #c62828;
  font-size: 13px;
}

@media (max-width: 520px) {
  .photo-card {
    border-radius: 10px;
  }

  .card-header {
    padding-inline: 12px;
  }

  .card-content {
    padding-inline: 12px;
  }
}
</style>
