<template>
  <div class="container is-fullhd">
    <div class="content is-large">
      <h1>Tables</h1>
    </div>
    <div class="columns is-multiline">
      <div class="column is-one-third" v-for="(table, index) in setTables" :key="index">
        <div class="card">
          <div class="card-content">
            <div class="content is-medium has-text-left is-primary">
              <div class="columns">
                <div class="column">Table number: {{ table.number }}</div>
              </div>
              <div class="columns">
                <div class="column">Max Capacity: {{ table.capacity }}</div>
              </div>
              <div class="columns">
                <div class="column">Waiter: {{ table.waiter }}</div>
              </div>
              <div class="columns">
                <div class="column">Total: {{ table.price }}</div>
                <div class="column content has-text-right">
                  <button class="button is-info is-large" @click="tableDetails(table)">
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getActiveOrder from '../helpers/OrderHelper';

export default {
  data() {
    return {
      reRender: 0,
    };
  },
  computed: {
    tables() {
      return this.$store.state.table.tablesList;
    },
    orders() {
      return this.$store.state.order.ordersList;
    },
    users() {
      return this.$store.state.user.usersList;
    },
    setTables() {
      let tableObj = {};
      let tablesList = [];

      for (let i = 0; i < this.tables.length; i++) {
        const order = getActiveOrder(this.orders, this.tables[i].id);

        if (!order) {
          tableObj = {
            id: this.tables[i].id,
            number: this.tables[i].number,
            capacity: this.tables[i].capacity,
            waiter: '-',
            price: '0.00',
          };
        } else {
          const waiter = this.users.find((user) => user.id === order.user);

          tableObj = {
            id: this.tables[i].id,
            number: this.tables[i].number,
            capacity: this.tables[i].capacity,
            waiter: waiter.name,
            price: `${order.total_price.toFixed(2)} BGN`,
            orderId: order?.id,
            waiterId: waiter.id,
          };
        }

        tablesList.push(tableObj);
      }

      return tablesList;
    },
  },
  methods: {
    tableDetails(table) {
      this.$router.push({
        name: 'WaiterTable',
        params: { tableId: table?.id },
        query: { order: table?.orderId, waiter: table?.waiterId },
      });
    },
  },
  async created() {
    await this.$store.dispatch('order/getOrders');
    await this.$store.dispatch('user/getUsers');
    await this.$store.dispatch('table/getTables');
  },
};
</script>

<style>
.column.content.has-text-right .button.is-info {
  border-radius: 50%;
  padding-top: 17%;
  padding-bottom: 17%;
}
</style>
