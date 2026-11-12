<template>
  <div class="main">
    <label for="filter">Wybierz filtr</label>
    <select name="filter" id="filter" v-model="toShow">
      <option v-for="filter in filters" :key="filter" :value="filter">
        {{ filter }}
      </option>
    </select>
    <div class="filters-forms">
      <div class="tint" v-if="toShow == 'tint'">
        <label for="red">Red: {{ red }}</label>
        <input
          type="range"
          max="255"
          step="1"
          min="0"
          name="red"
          v-model="red"
        />
        <label for="green">Green: {{ green }}</label>
        <input
          type="range"
          max="255"
          step="1"
          min="0"
          name="green"
          v-model="green"
        />
        <label for="blue">Blue: {{ blue }}</label>
        <input
          type="range"
          max="255"
          step="1"
          min="0"
          name="blue"
          v-model="blue"
        />
      </div>
      <div class="crop" v-if="toShow == 'crop'">
        <label for="w">Szerokość: {{ w }}px</label>
        <input type="range" :max="getW" name="w" v-model="w" />
        <label for="w">Wysokość: {{ h }}px</label>
        <input type="range" :max="getH" name="h" v-model="h" />
        <label for="w">od lewej: {{ l }}px</label>
        <input type="range" :max="getL" name="l" v-model="l" />
        <label for="w">od góry: {{ t }}px</label>
        <input type="range" :max="getT" name="t" v-model="t" />
      </div>
      <div class="resize" v-if="toShow == 'resize'">
        <label for="w">Szerokość: {{ w }}px</label>
        <input type="range" :max="maxWidth" name="w" v-model="w" min="1" />
        <label for="w">Wysokość: {{ h }}px</label>
        <input type="range" :max="maxHeigth" name="h" v-model="h" min="1" />
      </div>
      <div class="rotate" v-if="toShow == 'rotate'">
        <label for="blue">Angle: {{ angle }}</label>

        <input
          type="range"
          max="360"
          min="0"
          step="1"
          name="angle"
          v-model="angle"
        />
      </div>
      <div class="reformat" v-if="toShow == 'reformat'">
        <label for="reformat">Format</label>
        <input type="text" name="reformat" v-model="format" />
      </div>
      <button @click="ChangePhoto()">Apply filter</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: [
        "tint",
        "crop",
        "resize",
        "rotate",
        "reformat",
        "greyscale",
        "flip",
        "flop",
        "negate",
      ],
      toShow: "",
      red: 0,
      green: 0,
      blue: 0,
      angle: 0,
      format: "",
      w: 0,
      h: 0,
      t: 0,
      l: 0,
      maxWidth: 0,
      maxHeigth: 0,
    };
  },
  methods: {
    async ChangePhoto() {
      let obj = {};
      switch (this.toShow) {
        case "tint":
          obj = {
            red: this.red,
            green: this.green,
            blue: this.blue,
          };
          break;
        case "crop":
          obj = {
            width: this.w,
            height: this.h,
            top: this.t,
            left: this.l,
          };
          break;
        case "resize":
          obj = {
            width: this.w,
            height: this.h,
          };
          break;
        case "rotate":
          obj = {
            angle: this.angle,
          };
          break;
        case "reformat":
          obj = {
            format: this.format,
          };
          break;
        default:
          obj = {};
          break;
      }
      await this.$store.dispatch("FILTER_PHOTO", {
        type: this.toShow,
        id: this.id,
        obj,
      });
    },
  },
  computed: {
    getW() {
      return this.maxWidth - this.l;
    },
    getH() {
      return this.maxHeigth - this.t;
    },
    getL() {
      return this.maxWidth - this.w;
    },
    getT() {
      return this.maxHeigth - this.h;
    },
  },
  async created() {
    let data = await this.$store.dispatch("GET_META", this.id);
    this.maxWidth = data.meta.width;
    this.maxHeigth = data.meta.height;
  },
  props: ["id"],
};
</script>

<style scoped>
.main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 12px;
}

.filters-forms,
.tint,
.crop,
.resize,
.rotate,
.reformat {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}

input[type="range"],
input[type="text"],
select {
  box-sizing: border-box;
  max-width: 100%;
}

input[type="range"] {
  width: 100%;
}

select {
  width: 100%;
  background: white;
  padding: 10px 5px;
  border: 1px solid lightgray;
  border-radius: 10px;
}
.reformat input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid lightgray;
  border-radius: 8px;
}

button {
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  width: 100%;
}
</style>
