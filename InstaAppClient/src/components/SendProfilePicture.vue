<template>
  <div class="overlay" @click.self="closeForm">
    <section class="dialog" aria-labelledby="upload-title">
      <h2 id="upload-title">Zmień zdjęcie profilowe</h2>
      <label
        class="drop-area"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleSelect"
        />
        <img v-if="thumbnailUrl" :src="thumbnailUrl" alt="Podgląd zdjęcia" />
        <span v-else>Wybierz zdjęcie lub przeciągnij je tutaj</span>
      </label>
      <p v-if="file" class="file-name">{{ file.name }}</p>
      <p v-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </p>
      <div class="actions">
        <button type="button" class="cancel-button" @click="closeForm">
          Anuluj
        </button>
        <button
          type="button"
          :disabled="!file || isUploading"
          @click="sendImage"
        >
          {{ isUploading ? "Przesyłanie..." : "Prześlij" }}
        </button>
      </div>
    </section>
  </div>
</template>

<script>
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default {
  data() {
    return {
      file: null,
      thumbnailUrl: "",
      errorMessage: "",
      isUploading: false,
    };
  },
  beforeUnmount() {
    this.clearThumbnail();
  },
  methods: {
    closeForm() {
      if (!this.isUploading) {
        this.$emit("close");
      }
    },
    clearThumbnail() {
      if (this.thumbnailUrl) {
        URL.revokeObjectURL(this.thumbnailUrl);
        this.thumbnailUrl = "";
      }
    },
    selectFile(file) {
      this.clearThumbnail();
      this.errorMessage = "";

      if (!file) {
        this.file = null;
        return;
      }
      if (!file.type.startsWith("image/")) {
        this.file = null;
        this.errorMessage = "Wybierz plik graficzny.";
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        this.file = null;
        this.errorMessage = "Zdjęcie może mieć maksymalnie 5 MB.";
        return;
      }

      this.file = file;
      this.thumbnailUrl = URL.createObjectURL(file);
    },
    handleSelect(event) {
      this.selectFile(event.target.files[0]);
      if (!this.file) {
        event.target.value = "";
      }
    },
    handleDrop(event) {
      this.selectFile(event.dataTransfer.files[0]);
    },
    async sendImage() {
      if (!this.file || this.isUploading) {
        return;
      }

      this.isUploading = true;
      this.errorMessage = "";
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const result = await this.$store.dispatch("SEND_PROFILE_PICTURE", {
          formdata: formData,
        });
        if (result === false) {
          this.errorMessage = "Nie udało się przesłać zdjęcia. Spróbuj ponownie.";
          return;
        }

        this.$emit("uploaded");
        this.$emit("close");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        this.errorMessage = "Nie udało się przesłać zdjęcia. Spróbuj ponownie.";
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
}

.dialog {
  width: min(100%, 520px);
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

h2 {
  margin: 0 0 20px;
  font-size: 20px;
}

.drop-area {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px dashed #aaa;
  border-radius: 8px;
  color: #555;
  cursor: pointer;
  text-align: center;
}

.drop-area input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.drop-area img {
  width: 100%;
  height: 100%;
  max-height: 360px;
  object-fit: contain;
}

.file-name {
  overflow-wrap: anywhere;
}

.error-message {
  color: #c62828;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #0095f6;
  color: white;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-button {
  background: #777;
}
</style>
