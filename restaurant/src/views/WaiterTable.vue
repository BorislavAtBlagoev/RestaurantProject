<template>
  <div class="container">
    <div class="columns">
      <div class="column content has-text-left is-large">
        <h1>Table {{ tableNumber }}</h1>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <waiter-order-details :tableId="this.$route.params"></waiter-order-details>
      </div>
    </div>
  </div>
</template>

<script>
import WaiterOrderDetails from '../components/WaiterOrderDetails';

export default {
  components: {
    WaiterOrderDetails,
  },
  computed: {
    tables() {
      return this.$store.state.table.tablesList;
    },
    tableNumber() {
      const tableId = this.$route.params['tableId'];

      if (tableId) {
        const table = this.tables.find((table) => table.id === tableId);
        return table?.number;
      }

      return undefined;
    },
  },
  async created() {
    await this.$store.dispatch('table/getTables');
  },
};
</script>
