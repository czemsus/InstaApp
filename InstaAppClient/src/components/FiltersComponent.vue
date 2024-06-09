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
      <div class="crop"></div>
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
    };
  },
  methods: {
    async ChangePhoto() {
      let obj = {};
      console.log(this.r);
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
      console.log(obj);
      await this.$store.dispatch("FILTER_PHOTO", {
        type: this.toShow,
        id: this.id,
        obj,
      });
    },
  },
  props: ["id"],
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

select {
  padding: 10px 5px;
  border: 1px solid lightgray;
  border-radius: 10px;
  text-align: center;
}
.reformat input[type="text"] {
  background-color: none;
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
