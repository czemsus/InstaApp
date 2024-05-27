<template>
  <div class="overlay" @click="closeForm">
    <div class="next" v-show="selected">
      <button @click="sendImage()">Prześlij</button>
    </div>

    <div
      class="form-container"
      @click.stop
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <FileUpload
        name="demo[]"
        url="/api/photos"
        :multiple="false"
        accept="image/*"
        :max-file-size="1000000"
        @select="handleSelect"
      >
        <template #content>
          <div class="drop-area">
            <img src="../assets/files.png" width="50px" alt="" />
            <p>Drag and drop files here to upload.</p>
          </div>
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
      thumbnailUrl: "",
      selected: false,
      file: null,
    };
  },
  methods: {
    closeForm(event) {
      if (event.target.classList.contains("overlay")) {
        this.$emit("close");
      }
    },
    handleSelect(event) {
      console.log("Files selected:", event.files);
      this.file = event.files[0];
      if (this.file) {
        this.generateThumbnail(this.file);
      } else {
        console.error("No file selected");
      }
    },
    generateThumbnail(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailUrl = e.target.result;
        this.selected = true;
      };
      reader.readAsDataURL(file);
    },
    sendImage() {
      const formdata = new FormData();
      formdata.append("album", "user_album");
      formdata.append("file", this.file);
      this.$store.dispatch("SEND_IMAGE", formdata);
    },
    handleDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.file = files[0];
        this.handleSelect({ files: [this.file] });
      }
    },
  },
  components: {
    FileUpload,
  },
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
  width: 600px;
  height: 600px;
}

.drop-area {
  text-align: center;
}

.thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 0px 0px 8px 8px;
  z-index: 3;
}

.next {
  position: absolute;
  background: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 600px;
  height: 50px;
  z-index: 4;
  top: 124px;
}

button {
  background: none;
  border: none;
  padding: 0px;
  color: #3498db;
  margin: 0;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
</style>
