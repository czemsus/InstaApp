<template>
  <div class="overlay" @click="closeForm">
    <div class="form-container" @click.stop>
      <FileUpload
        name="demo[]"
        url="/api/photos"
        :multiple="false"
        accept="image/*"
        :maxFileSize="1000000"
        @select="handleSelect($event)"
      >
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
      <div
        v-if="thumbnailUrl"
        class="thumbnail"
        :style="{ backgroundImage: 'url(' + thumbnailUrl + ')' }"
      ></div>
    </div>
  </div>
</template>

<script>
import FileUpload from "primevue/fileupload";
export default {
  data() {
    return {
      name: "",
      thumbnailUrl: "",
    };
  },
  methods: {
    handleSubmit() {
      console.log("Form submitted:", this.name);
      this.$emit("close");
    },
    closeForm(event) {
      if (event.target.classList.contains("overlay")) {
        this.$emit("close");
      }
    },

    handleSelect(event) {
      console.log("Files selected:", event.files);
      const file = event.files[0];
      if (file) {
        this.generateThumbnail(file);
      } else {
        console.error("No file selected");
      }
    },
    generateThumbnail(file) {
      if (file.objectURL) {
        this.thumbnailUrl = file.objectURL; // Use the Blob URL directly
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.thumbnailUrl = e.target.result; // Set thumbnail URL as background image
        };
        reader.readAsDataURL(file);
      }
    },
  },
  components: { FileUpload },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
}

.thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}
</style>
