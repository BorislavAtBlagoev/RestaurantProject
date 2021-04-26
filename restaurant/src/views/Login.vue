<template>
  <div>
    <login-items></login-items>
  </div>
</template>

<script>
const LoginItems = () => import('../components/LoginItems.vue');

export default {
  components: {
    LoginItems,
  },
};
</script>
