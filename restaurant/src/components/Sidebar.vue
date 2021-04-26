<template>
  <div class="sidebar">
    <div class="content" v-for="(route, index) in routes" :key="index">
      <router-link :to="route.path">{{ route.name }}</router-link>
    </div>

    <div class="socialMedia">
      <span class="icons"><i class="fab fa-instagram"></i></span>
      <span class="icons"><i class="fab fa-twitter"></i></span>
      <span class="icons"><i class="fab fa-facebook-f"></i></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {
          name: 'Orders',
          path: '/orders',
        },
        {
          name: 'Tables',
          path: '/tables',
        },
        {
          name: 'Menu',
          path: '/menu',
        },
        {
          name: 'Categories',
          path: '/categories',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.sidebar {
  text-align: left;
  padding-left: 1.5%;
  padding-top: 5%;
  background-color: #33adff;
  width: 15%;
  height: 100%;
  float: left;
  position: fixed;
  top: 0;
  left: 0;
  word-wrap: break-word;
}

.icons {
  color: #ffffff;
  padding: 1%;
}

.socialMedia {
  position: fixed;
  bottom: 5%;
  width: 100%;
}
</style>
