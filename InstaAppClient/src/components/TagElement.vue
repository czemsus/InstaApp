<template>
  <div>
    <p>{{ value }}</p>
    <span class="del"><i class="fas fa-trash"></i></span>
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
  padding: 4px 8px;
}

div {
  display: flex;
  border: 1px solid lightgray;
  border-radius: 4px 16px 16px 4px;
  justify-content: space-between;
  width: 170px;
}

span {
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
