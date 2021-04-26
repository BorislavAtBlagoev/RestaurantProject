<template>
  <div>
    <nav class="navbar is-info">
      <div class="navbar-item">
        <h2 class="content is-large">{{ getUsername }}</h2>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <span class="button is-info">
              <i class="fas fa-search"></i>
            </span>

            <span class="button is-info">
              <i class="fas fa-bell"></i>
            </span>

            <span class="button is-info">
              <router-link to="/profile"><i class="fas fa-user"></i></router-link>
            </span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    getUsername() {
      return this.$store.state.user.userData.name;
    },
  },
};
</script>

<style>
.navbar-item {
  color: #ffffff;
}
</style>
