<template>
  <div class="overlay" @click="closeForm($event)">
    <div class="main">
      <div class="photo-container">
        <div class="thumbnail">
          <img :src="src" alt="zdjęcie" />
        </div>
        <div class="description-box" v-show="selected">
          <label for="name">Opis</label>
          <textarea
            MaxLength="106"
            v-model="description"
            placeholder="Dodaj opis zdjęcia"
            class="description-input"
            name="desc"
            value="desc"
          />
          <span :class="{ red: desc.length === 106 }">
            {{ desc.length }}/106
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
            <button class="save-button" @click="modifyImageData()">
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagElement from "./TagElement.vue";
export default {
  data() {
    return {
      src: null,
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
    };
  },
  props: ["id", "tagi", "desc"],
  methods: {
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
      await this.$store.dispatch("MODIFY_IMAGE_DATA", {
        tags: this.tagsList,
        desc: this.description,
        id: this.id,
      });
    },
  },
  created() {
    this.src = `http://localhost:3000/api/getimage/` + this.id;
    this.tagsList = this.tagi;
    this.description = this.desc;
  },
  components: {
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

img {
  position: absolute;
  top: 0;
  left: -100px;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px 0px 0px 8px;
  z-index: 3;
}

.photo-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
  width: 680px;
  height: 680px;
}

.main {
  display: flex;
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
  height: 680px;
  background: white;
  padding: 20px;
  border-radius: 0px 8px 8px 0px;
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

.save-button {
  position: absolute;
  bottom: -70px;
  background-color: #099dff;
  color: white;
  padding: 10px 6px;
  width: 120px;
  border-radius: 14px;
}
</style>
