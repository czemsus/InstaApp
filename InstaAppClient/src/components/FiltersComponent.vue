<template>
  <div class="main">
    <label for="filter">Wybierz filtr</label>
    <select name="filter" id="filter">
      <option v-for="filter in filters" :key="filter" :value="filter">
        {{ filter }}
      </option>
    </select>
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
    };
  },
};
</script>

<style scoped></style>
