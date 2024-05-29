<template>
  <div class="main">
    <EditProfileForm />
  </div>
</template>

<script>
import EditProfileForm from "@/components/EditProfileForm.vue";
import Navbar from "@/components/Navbar.vue";
export default {
  components: { Navbar, EditProfileForm },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;

  justify-content: center;
}
</style>
