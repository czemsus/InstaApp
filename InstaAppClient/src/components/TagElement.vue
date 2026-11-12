<template>
  <div>
    <p>{{ value }}</p>
    <span class="del" @click="deleteItem"><i class="fas fa-trash"></i></span>
  </div>
</template>

<script>
export default {
  props: ["value"],
  methods: {
    deleteItem() {
      this.$emit("delete", this.value);
    },
  },
};
</script>

<style scoped>
p {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 80%;
  padding: 4px 8px;
}

div {
  display: flex;
  min-width: 0;
  border: 1px solid lightgray;
  border-radius: 4px 16px 16px 4px;
  justify-content: space-between;
  width: 100%;
}

span {
  flex: 0 0 auto;
  padding: 6px 8px;
  background-color: rgb(240, 61, 61);
  border-radius: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

span:hover {
  background-color: rgb(255, 81, 81);
}
</style>
