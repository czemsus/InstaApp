<template>
  <div class="overlay" @click="closeForm($event)">
    <div class="main">
      <div class="photo-container">
        <div class="thumbnail">
          <img class="photo-image" :src="imageUrl" alt="zdjęcie" />
        </div>
        <div class="description-box">
          <template v-if="editable">
          <label for="name">Opis</label>
          <textarea
            maxlength="106"
            v-model="description"
            placeholder="Dodaj opis zdjęcia"
            class="description-input"
            name="desc"
          />
          <span :class="{ red: description.length === 106 }">
            {{ description.length }}/106
          </span>
          <label for="tags">Tagi</label>
          <div class="tags-box">
            <div class="tag-input-row">
              <input
                type="text"
                class="tags-input"
                maxlength="16"
                v-model="newTag"
                name="tags"
              />
              <button
                class="add"
                type="button"
                aria-label="Dodaj tag"
                @click="addToTags(newTag)"
              >
                +
              </button>
            </div>
            <div v-if="tagsList.length" class="tagsList">
              <TagElement
                v-for="(tag, index) in tagsList"
                :key="`${tag}-${index}`"
                :value="tag"
                @delete="deleteItem(index)"
              />
            </div>
            <p v-if="msg" class="msg" role="alert">{{ msg }}</p>
            <span class="list-length" :class="{ red: tagsList.length === 8 }">
              {{ tagsList.length }}/8 tagów
            </span>
            <button
              class="save-button"
              type="button"
              :disabled="isSaving"
              @click="modifyImageData()"
            >
              {{ isSaving ? "Zapisywanie..." : "Zapisz zmiany" }}
            </button>
          </div>
          <p v-if="saveError" class="save-error" role="alert">{{ saveError }}</p>
          <div class="filters">
            <FiltersComponent :id="this.id" />
          </div>
          </template>
          <template v-else>
            <p class="read-only-description">{{ desc || "Brak opisu zdjęcia." }}</p>
            <div v-if="tagi?.length" class="read-only-tags">
              <span v-for="(tag, index) in tagi" :key="`${tag}-${index}`">
                #{{ String(tag).replace(/^#/, "") }}
              </span>
            </div>
          </template>
          <section class="comments-section" aria-labelledby="comments-heading">
            <h2 id="comments-heading">Komentarze</h2>
            <p v-if="commentsLoading" class="comments-status" role="status">
              Ładowanie komentarzy...
            </p>
            <p v-else-if="commentsError" class="comments-error" role="alert">
              {{ commentsError }}
            </p>
            <p v-else-if="comments.length === 0" class="comments-status">
              Brak komentarzy.
            </p>
            <ul v-else class="comments-list">
              <li v-for="comment in comments" :key="comment.id">
                <strong>{{ comment.userEmail }}</strong>
                <p>{{ comment.content }}</p>
              </li>
            </ul>
          </section>
          <button
            v-if="!editable"
            class="close-button"
            type="button"
            @click="$emit('close')"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagElement from "./TagElement.vue";
import FiltersComponent from "./FiltersComponent.vue";
import { API_BASE_URL, getPhotoComments } from "@/api/api";
export default {
  data() {
    return {
      apiBaseUrl: API_BASE_URL,
      thumbnailUrl: "",
      selected: true,
      file: null,
      token: "",
      a: true,
      bio: "",
      description: "",
      newTag: "",
      tagsList: [],
      msg: "",
      isSaving: false,
      saveError: "",
      comments: [],
      commentsLoading: false,
      commentsError: "",
    };
  },
  props: {
    id: { type: [Number, String], required: true },
    tagi: { type: Array, default: () => [] },
    desc: { type: String, default: "" },
    editable: { type: Boolean, default: true },
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.loadComments();
      },
    },
    desc: {
      immediate: true,
      handler(value) {
        this.description = value || "";
      },
    },
    tagi: {
      immediate: true,
      handler(value) {
        this.tagsList = [...value];
      },
    },
  },
  computed: {
    imageUrl() {
      return `${this.apiBaseUrl}/api/getimage/${this.id}?v=${this.$store.getters.PHOTO_REVISION}`;
    },
  },
  methods: {
    async loadComments() {
      const requestedPhotoId = this.id;
      this.comments = [];
      this.commentsError = "";
      this.commentsLoading = true;

      try {
        const response = await getPhotoComments(requestedPhotoId);
        if (String(this.id) !== String(requestedPhotoId)) {
          return;
        }
        this.comments = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        if (String(this.id) === String(requestedPhotoId)) {
          this.commentsError = "Nie udało się załadować komentarzy.";
          console.error("Error fetching photo comments:", error);
        }
      } finally {
        if (String(this.id) === String(requestedPhotoId)) {
          this.commentsLoading = false;
        }
      }
    },
    closeForm(event) {
      if (event.target.classList.contains("overlay")) {
        this.$emit("close");
      }
    },
    addToTags(tag) {
      if (tag && this.tagsList.length < 8) {
        if (!this.tagsList.includes(tag)) {
          this.tagsList.push(tag);
          this.newTag = "";
          this.msg = "";
        } else {
          this.msg = "Jest już taki tag!!!";
        }
      }
    },
    deleteItem(index) {
      this.tagsList = this.tagsList.filter(
        (tag) => tag != this.tagsList[index]
      );
    },
    async modifyImageData() {
      if (this.isSaving) {
        return;
      }

      this.isSaving = true;
      this.saveError = "";
      try {
        const result = await this.$store.dispatch("MODIFY_IMAGE_DATA", {
          tags: this.tagsList,
          desc: this.description,
          id: this.id,
        });
        if (result === false) {
          this.saveError =
            "Nie udało się zapisać zmian. Sprawdź połączenie z serwerem i spróbuj ponownie.";
          return;
        }
        this.$emit("close");
      } finally {
        this.isSaving = false;
      }
    },
  },
  components: {
    TagElement,
    FiltersComponent,
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgb(0 0 0 / 70%);
}

.main {
  display: flex;
  width: min(1100px, 100%);
  max-height: 100%;
}

.photo-container {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
  gap: 20px;
  width: 100%;
  height: min(760px, calc(100dvh - 32px));
  padding: 20px;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 40px rgb(0 0 0 / 28%);
}

.thumbnail {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #111;
}

.photo-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.description-box {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  padding: 4px 8px 4px 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.description-box label {
  font-size: 13px;
  font-weight: 650;
}

.description-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  resize: vertical;
  border: 1px solid #ddd;
  border-radius: 8px;
  font: inherit;
}

.tags-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-input-row {
  display: flex;
  gap: 8px;
}

.tags-input {
  min-width: 0;
  flex: 1;
  margin: 0;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline-color: #3498db;
}

.add {
  display: grid;
  width: 38px;
  min-width: 38px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-size: 22px;
}

.add:hover {
  background: #1888d0;
}

.tagsList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-length {
  align-self: flex-end;
  color: #666;
  font-size: 12px;
}

.red,
.msg,
.save-error,
.comments-error {
  color: #c62828;
}

.msg,
.save-error,
.read-only-description {
  margin: 0;
  overflow-wrap: anywhere;
}

.save-button,
.close-button {
  position: static;
  width: 100%;
  min-height: 40px;
  padding: 10px 14px;
  border: 0;
  border-radius: 8px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

.close-button {
  margin-top: auto;
}

.save-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.filters {
  min-width: 0;
  padding-top: 12px;
  border-top: 1px solid #e6e6e6;
}

.read-only-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: #255a9b;
  font-size: 13px;
}

.comments-section {
  min-width: 0;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid #e6e6e6;
  font-size: 13px;
}

.comments-section h2 {
  margin: 0 0 8px;
  font-size: 15px;
}

.comments-list {
  display: flex;
  max-height: 220px;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.comments-list li,
.comments-list p {
  margin: 0;
  overflow-wrap: anywhere;
}

.comments-list strong {
  display: block;
  margin-bottom: 3px;
}

.comments-status {
  margin: 0;
  color: #666;
}

.comments-error {
  margin: 0;
}

@media (max-width: 760px) {
  .overlay {
    align-items: flex-start;
    padding: 12px;
    overflow-y: auto;
  }

  .main {
    max-height: none;
  }

  .photo-container {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    height: auto;
    max-height: none;
    padding: 14px;
    overflow: visible;
  }

  .thumbnail {
    height: min(55vh, 480px);
    min-height: 220px;
  }

  .description-box {
    max-height: none;
    padding: 0 2px 2px;
    overflow: visible;
  }
}
</style>
