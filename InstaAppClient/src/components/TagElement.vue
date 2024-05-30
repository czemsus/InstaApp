<template>
  <div>
    <p>{{ value }}</p>
    <span class="del">-</span>
  </div>
</template>

<script>
export default {
  props: ["value"],
};
</script>

<style scoped>
p {
  font-size: 80%;
}

div {
  display: flex;
  border: 1px solid lightgray;
  border-radius: 4px 12px 12px 4px;
  padding: 4px;
  justify-content: space-between;
}
</style>
