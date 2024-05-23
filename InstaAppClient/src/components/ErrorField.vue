<template>
  <div>
    <div class="errorBox">
      <h1>{{ status }}</h1>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  props: ["status", "message"],
};
</script>

<style scoped></style>
