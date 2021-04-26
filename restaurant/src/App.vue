<template>
  <div id="app">
    <div class="columns">
      <div class="column">
        <navbar></navbar>
      </div>
    </div>

    <div class="columns">
      <div class="column is-one-fifth" v-if="isAdmin">
        <sidebar></sidebar>
      </div>
      <div class="column is-four-fifth">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { mapGetters } from 'vuex';

export default {
  components: {
    Navbar,
    Sidebar,
  },
  computed: {
    ...mapGetters('user', ['isAdmin']),
  },
};
</script>

<style lang="scss">
a {
  font-weight: bold;
  color: #ffffff;

  &.router-link-exact-active {
    color: #ffffff;
  }
}

.content.is-large {
  text-align: left;
  margin-right: 2%;
  margin-left: 2%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
