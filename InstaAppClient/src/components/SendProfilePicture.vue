<template>
  <div class="overlay" @click="closeForm" v-if="a">
    <div class="next" v-show="selected">
      <button @click="sendImage">Prześlij</button>
      <button @click="dontShow" class="anuluj">Anuluj</button>
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
import TagElement from "./TagElement.vue";

export default {
  data() {
    return {
      thumbnailUrl: "",
      selected: false,
      file: null,
      token: "",
      a: true,
      bio: "",
      description: "",
      newTag: "",
      tagsList: [],
      msg: "",
    };
  },
  created() {
    this.token = this.getToken();
  },
  methods: {
    dontShow() {
      this.a = false;
    },
    closeForm(event) {
      if (event.target.classList.contains("overlay")) {
        this.$emit("close");
      }
    },
    handleSelect(event) {
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
    reloadProfile() {
      this.$store.dispatch("RELOAD_USER_DATA");
    },
    async sendImage() {
      const formdata = new FormData();
      formdata.append("album", "user_album");
      formdata.append("file", this.file);
      formdata.append("description", this.description);
      formdata.append("tags", JSON.stringify(this.tagsList));

      await this.$store.dispatch("SEND_PROFILE_PICTURE", {
        formdata,
        token: this.token,
      });
      this.dontShow();
      this.reloadProfile();
      this.$store.dispatch("RELOAD_USER_DATA");
    },
    handleDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.file = files[0];
        this.handleSelect({ files: [this.file] });
      }
    },
    getToken() {
      return this.$store.getters.GET_TOKEN;
    },
  },
  components: {
    FileUpload,
    TagElement,
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
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
  width: 650px;
  height: 650px;
  left: 10px;
}

.drop-area {
  text-align: center;
}

.thumbnail {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 0px 0px 8px 8px;
  z-index: 3;
  left: 0px;
}

.next {
  position: absolute;
  background: white;
  padding: 20px;
  margin-left: 20px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 650px;
  height: 60px;
  z-index: 4;
  top: 150px;
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
  width: 100px;
}

.anuluj {
  position: absolute;
  color: red;
  left: 20px;
}

.add {
  position: absolute;
  border: 1px solid lightgray;
  font-size: 180%;
  padding: 0px 8px;
  border-radius: 50%;
  right: -10px;
  top: 21px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
}

.add:hover {
  background-color: #099dff;
}
</style>
