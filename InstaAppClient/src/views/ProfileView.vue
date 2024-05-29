<template>
  <main>
    <div class="main">
      <Navbar />
      <div class="profile-container">
        <div class="user-data">
          <ProfileData/>
        </div>
        <div class="user-photos"></div>
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ProfileData from "@/components/ProfileData.vue";

export default {
  components: {
    Navbar,ProfileData
  },
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: row;
}
</style>
