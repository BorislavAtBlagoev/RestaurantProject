<template>
  <div>
    <div v-if="isAuthenticated">
      <div v-if="isAdmin">
        <admin-table></admin-table>
      </div>
      <div v-else>
        <waiter-tables></waiter-tables>
      </div>
    </div>
    <div v-else>
      <login-items></login-items>
    </div>
  </div>
</template>

<script>
import AdminTable from '../components/AdminTable';
import WaiterTables from '../components/WaiterTables';
import LoginItems from '../components/LoginItems.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    AdminTable,
    WaiterTables,
    LoginItems,
  },
  computed: {
    ...mapGetters('user', ['isAdmin']),
    isAuthenticated() {
      return this.$store.state.user.isAuthenticated;
    },
  },
};
</script>
