<template>
  <div class="container">
    <div class="content">
      <div class="columns">
        <div class="column">
          <h1>Login</h1>
          <button class="button is-info is-large" @click="login()">Login</button>
          <router-link :to="{ name: 'Registration' }"><h4>Sign up</h4></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.login();
    },
  },
};
</script>
