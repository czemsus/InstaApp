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
      <div class="description-box" v-show="selected">
        <label for="name">Opis</label>
        <textarea
          MaxLength="106"
          v-model="description"
          placeholder="Dodaj opis zdjęcia"
          class="description-input"
          name="desc"
        />
        <span :class="{ red: description.length === 106 }">
          {{ description.length }}/106
        </span>
        <label for="tags">Tagi</label>
        <div class="tags-box" v-show="selected">
          <input
            type="text"
            class="tags-input"
            maxlength="16"
            v-model="newTag"
            name="tags"
          />
          <span class="add" @click="addToTags(newTag)">+</span>
          <div class="tagsList">
            <TagElement
              v-for="(tag, index) in tagsList"
              :value="tag"
              @delete="deleteItem(index)"
            />
          </div>
          <div class="msg" style="color: red">{{ msg }}</div>
          <span id="listLen" :class="{ red: tagsList.length === 8 }"
            >{{ tagsList.length }}/8</span
          >
        </div>
      </div>

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
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters(["GET_TOKEN"]),
    shouldShowButtons() {
      return this.selected && this.description.trim() !== "";
    },
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
      console.log("Sending image...");
      const formdata = new FormData();
      formdata.append("album", "user_album");
      formdata.append("file", this.file);
      formdata.append("description", this.description);

      console.log(formdata);

      await this.$store.dispatch("SEND_IMAGE", { formdata, token: this.token });
      this.dontShow();
      this.reloadProfile();
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
  },
  components: {
    FileUpload,
    TagElement,
  },
};
</script>

<style scoped>
span {
  font-size: 60%;
  position: absolute;
  right: 50px;
  top: 200px;
}
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
  width: 630px;
  height: 630px;
}

.drop-area {
  text-align: center;
}

.thumbnail {
  position: absolute;
  top: 0;
  left: -100px;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 0px 0px 0px 8px;
  z-index: 3;
}

.next {
  position: absolute;
  background: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 830px;
  height: 60px;
  z-index: 4;
  top: 98px;
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

.description-input {
  width: 100%;
  padding: 8px;
  margin-top: 20px;
  border-radius: 4px;
}

.tagsList {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-box {
  position: absolute;
  right: -100px;
  top: 0px;
  width: 200px;
  height: 630px;
  background: white;
  padding: 20px;
  border-radius: 0px 0px 8px 0px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.tags-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
textarea {
  border: none;
  height: 150px;
}

.msg {
  font-size: 70%;
  position: absolute;
  top: 0;
}

input {
  outline: none;
  background-color: white;
  margin-top: 20px;
  border-radius: 0px 18px 18px 0px;
  overflow: hidden;
  width: 170px;
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

span[id="listLen"] {
  position: absolute;
  right: 0px;
  top: 370px;
}
</style>
