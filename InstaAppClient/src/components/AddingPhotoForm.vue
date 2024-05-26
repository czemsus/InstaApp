<template>
  <div class="overlay" @click="closeForm">
    <div class="form-container" @click.stop>
      <form @submit.prevent="handleSubmit">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" name="name" />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  methods: {
    handleSubmit() {
      console.log("Form submitted:", this.name);
      this.$emit("close"); // Emit close event to parent
    },
    closeForm(event) {
      // Close the form only if the overlay is clicked directly
      if (event.target.classList.contains("overlay")) {
        this.$emit("close"); // Emit close event to parent
      }
    },
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
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 2;
}
</style>
