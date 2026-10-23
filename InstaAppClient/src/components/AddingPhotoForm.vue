<template>
  <div class="overlay" @click.self="closeForm">
    <section
      class="post-form"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-form-title"
      @click.stop
    >
      <header class="form-header">
        <button class="header-button cancel" type="button" @click="closeForm">
          Anuluj
        </button>
        <h2 id="post-form-title">Utwórz nowy post</h2>
        <button
          class="header-button share"
          type="button"
          :disabled="!file || uploading"
          @click="sendImage"
        >
          {{ uploading ? "Przesyłanie..." : "Udostępnij" }}
        </button>
      </header>

      <div class="form-content">
        <div
          class="photo-panel"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <template v-if="thumbnailUrl">
            <img
              class="preview-image"
              :src="thumbnailUrl"
              alt="Podgląd zdjęcia do opublikowania"
            />
            <label class="change-photo" for="post-photo-input">
              Zmień zdjęcie
            </label>
          </template>
          <div v-else class="upload-prompt">
            <img src="@/assets/home.png" width="48" height="48" alt="" />
            <span>Przeciągnij zdjęcie tutaj</span>
            <label class="choose-photo" for="post-photo-input">
              Wybierz z urządzenia
            </label>
          </div>
          <input
            id="post-photo-input"
            class="file-input"
            type="file"
            accept="image/*"
            @change="handleSelect"
          />
        </div>

        <div class="post-fields">
          <label for="post-description">Opis</label>
          <textarea
            id="post-description"
            v-model="description"
            maxlength="106"
            placeholder="Napisz coś o tym zdjęciu..."
          />
          <span class="counter" :class="{ red: description.length === 106 }">
            {{ description.length }}/106
          </span>

          <label for="post-tag-input">Tagi</label>
          <div class="tag-entry">
            <input
              id="post-tag-input"
              v-model="newTag"
              type="text"
              maxlength="16"
              placeholder="Dodaj tag"
              @keydown.enter.prevent="addToTags(newTag)"
            />
            <button
              class="add-tag"
              type="button"
              aria-label="Dodaj tag"
              @click="addToTags(newTag)"
            >
              +
            </button>
          </div>

          <div class="tag-list">
            <TagElement
              v-for="(tag, index) in tagsList"
              :key="tag"
              :value="tag"
              @delete="deleteItem(index)"
            />
          </div>
          <p class="message" role="status">{{ msg }}</p>
          <span class="counter" :class="{ red: tagsList.length === 8 }">
            {{ tagsList.length }}/8
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TagElement from "./TagElement.vue";

export default {
  data() {
    return {
      thumbnailUrl: "",
      file: null,
      token: "",
      description: "",
      newTag: "",
      tagsList: [],
      msg: "",
      uploading: false,
    };
  },
  created() {
    this.token = this.$store.getters.GET_TOKEN;
  },
  methods: {
    closeForm() {
      this.$emit("close");
    },
    handleSelect(event) {
      const input = event.target;
      this.setFile(input.files[0]);
      input.value = "";
    },
    setFile(file) {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        this.msg = "Wybierz plik graficzny.";
        return;
      }
      if (file.size > 1000000) {
        this.msg = "Maksymalny rozmiar zdjęcia to 1 MB.";
        return;
      }

      this.file = file;
      this.msg = "";
      const reader = new FileReader();
      reader.onload = (event) => {
        this.thumbnailUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    handleDrop(event) {
      this.setFile(event.dataTransfer.files[0]);
    },
    async sendImage() {
      if (!this.file || this.uploading) return;

      const formdata = new FormData();
      formdata.append("album", "user_album");
      formdata.append("file", this.file);
      formdata.append("description", this.description);
      formdata.append("tags", JSON.stringify(this.tagsList));

      this.uploading = true;
      const result = await this.$store.dispatch("SEND_IMAGE", {
        formdata,
        token: this.token,
      });
      this.uploading = false;

      if (result === false) {
        this.msg = "Nie udało się opublikować posta. Spróbuj ponownie.";
        return;
      }

      this.closeForm();
    },
    addToTags(tag) {
      const value = tag.trim();
      if (!value) return;
      if (this.tagsList.includes(value)) {
        this.msg = "Ten tag jest już na liście.";
      } else if (this.tagsList.length >= 8) {
        this.msg = "Możesz dodać maksymalnie 8 tagów.";
      } else {
        this.tagsList.push(value);
        this.newTag = "";
        this.msg = "";
      }
    },
    deleteItem(index) {
      this.tagsList.splice(index, 1);
    },
  },
  components: { TagElement },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  background: rgb(0 0 0 / 65%);
}

.post-form {
  width: min(900px, 100%);
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 40px rgb(0 0 0 / 25%);
}

.form-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 58px;
  padding: 0 18px;
  border-bottom: 1px solid #e5e5e5;
}

.form-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.header-button {
  width: auto;
  padding: 8px 0;
  border: 0;
  background: transparent;
  font-weight: 600;
}

.header-button.cancel {
  justify-self: start;
  color: #444;
}

.header-button.share {
  justify-self: end;
  color: #1877d2;
}

.header-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.form-content {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
}

.photo-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  overflow: hidden;
  background: #f7f7f7;
}

.preview-image {
  display: block;
  width: 100%;
  height: 100%;
  max-height: min(70vh, 620px);
  object-fit: contain;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px;
  color: #444;
  text-align: center;
  cursor: pointer;
}

.choose-photo,
.change-photo {
  padding: 9px 14px;
  border-radius: 7px;
  color: #fff;
  background: #1877d2;
  font-size: 0.9rem;
  font-weight: 600;
}

.file-input {
  position: absolute;
  display: block;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}

.change-photo {
  position: absolute;
  bottom: 14px;
  cursor: pointer;
}

.post-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 20px;
}

.post-fields > label {
  margin-top: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.post-fields textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border: 1px solid #d4d4d4;
  border-radius: 7px;
  line-height: 1.5;
}

.counter {
  align-self: flex-end;
  color: #737373;
  font-size: 0.75rem;
}

.tag-entry {
  display: flex;
  gap: 8px;
}

.tag-entry input {
  min-width: 0;
  margin: 0;
  padding: 9px 10px;
  border: 1px solid #d4d4d4;
  border-radius: 7px;
}

.add-tag {
  position: static;
  flex: 0 0 40px;
  width: 40px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: #1877d2;
  font-size: 1.3rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-list :deep(> div) {
  width: auto;
  max-width: 100%;
}

.message {
  min-height: 18px;
  margin: 0;
  color: #c62828;
  font-size: 0.8rem;
}

.red {
  color: #c62828;
}

@media (max-width: 640px) {
  .overlay {
    align-items: flex-start;
    padding: 12px;
  }

  .form-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .photo-panel {
    min-height: 250px;
    max-height: 42vh;
  }

  .post-fields {
    padding: 16px;
  }
}
</style>
