<template>
  <div class="container">
    <div class="content is-large">
      <div class="columns">
        <div class="column">
          <h1>Tables</h1>
        </div>
        <div class="column is-one-quarter">
          <button class="button is-info is-medium" @click="showCreateTableModal">NEW TABLE</button>
        </div>
      </div>

      <div class="content is-medium">
        <table class="table is-narrow is-small">
          <thead>
            <tr class="table-header">
              <th>Table Number</th>
              <th>Waiter</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-for="(table, index) in setTables" :key="index">
            <tr>
              <td>{{ table.number }}</td>
              <td>{{ table.waiter }}</td>
              <td>{{ table.price }}</td>
              <td>{{ table.status }}</td>
              <td>
                <div class="select is-info is-rounded is-focused is-medium">
                  <select @change="modifyTable($event, table)">
                    <option value="" disabled selected hidden>Acions</option>
                    <option value="edit">Edit</option>
                    <hr class="dropdown-divider" />
                    <option value="delete">Delete</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <modal v-show="shouldShowCreateTableModal" @close="shouldShowCreateTableModal = false">
        <template>
          <div class="box">
            <h1>Create table</h1>

            <div class="field">
              <label class="label is-medium">Table number</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g 4"
                  v-model="tableNumber"
                />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Table Capacity</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g 10"
                  v-model="tableCapacity"
                />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Location</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Garden"
                  v-model="location"
                />
              </div>
            </div>

            <button class="button is-info is-medium" @click="createTable">Save</button>
          </div>
        </template>
      </modal>

      <modal v-show="shouldShowEditModal" @close="shouldShowEditModal = false" class="has-text-centered">
        <template>
          <div class="box">
            <h1>Edit table</h1>

            <div class="field">
              <label class="label is-medium">Table number</label>
              <div class="control">
                <input class="input is-info is-rounded is-medium" type="text" v-model="editTableNumber" />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Waiter's name</label>
              <div class="control">
                <input class="input is-info is-rounded is-medium" type="text" v-model="waiterName" />
              </div>
            </div>

            <button class="button is-info is-medium" @click="editTable">Save</button>
          </div>
        </template>
      </modal>

      <modal v-show="shouldShowDeleteModal" @close="shouldShowDeleteModal = false" class="has-text-centered">
        <template>
          <div class="box">
            <h1>Are you sure you want to delete this product?</h1>

            <div class="columns">
              <div class="column"></div>
              <div class="column is-one-fifth">
                <button class="button is-info" @click="deleteProduct()">Yes</button>
              </div>
              <div class="column is-one-fifth">
                <button class="button is-info" @click="closeDeleteModal()">No</button>
              </div>
              <div class="column"></div>
            </div>
          </div>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import Modal from '../components/Modal';
import getActiveOrder from '../helpers/OrderHelper';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      tablesData: [],
      shouldShowCreateTableModal: false,
      shouldShowEditModal: false,
      shouldShowDeleteModal: false,
      tableId: 0,
      tableNumber: '',
      tableCapacity: '',
      location: '',
      editTableNumber: '',
      waiterName: '',
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
            waiter: '-',
            price: '-',
            status: '-',
          };
        } else {
          const waiter = this.users.find((user) => user.id === order.user);

          tableObj = {
            id: this.tables[i].id,
            number: this.tables[i].number,
            waiter: waiter?.name,
            price: `${order.total_price.toFixed(2)} BGN`,
            status: 'Active',
          };
        }

        tablesList.push(tableObj);
      }

      return tablesList;
    },
  },
  methods: {
    createTable() {
      const table = {
        number: this.tableNumber,
        capacity: this.tableCapacity,
      };

      this.$store.dispatch('table/createTable', table);
      this.closeCreateModal();
    },
    showCreateTableModal() {
      this.shouldShowCreateTableModal = true;
    },
    modifyTable(event, table) {
      event.preventDefault();
      this.tableId = table.id;

      if (event.target.value === 'edit') {
        this.editTableNumber = table.number;
        this.waiterName = table.waiter;

        this.shouldShowEditModal = true;
      } else if (event.target.value === 'delete') {
        this.shouldShowDeleteModal = true;
      }

      event.target.value = '';
    },
    editTable() {
      const order = getActiveOrder(this.orders, this.tableId);

      console.log(order);
      if (order) {
        const user = this.users.find((user) => user.name.toUpperCase() === this.waiterName.toUpperCase());

        const waiter = {
          id: order?.id,
          user: user?.id,
        };

        console.log(waiter);
        this.$store.dispatch('order/editOrder', waiter);
      }

      const table = {
        id: this.tableId,
        number: this.editTableNumber,
      };

      this.$store.dispatch('table/editTable', table);

      this.closeEditModal();
    },
    deleteProduct() {
      this.$store.dispatch('table/deleteTable', this.tableId);
      this.closeDeleteModal();
    },
    closeCreateModal() {
      this.tableNumber = '';
      this.tableCapacity = '';
      this.shouldShowCreateTableModal = false;
    },
    closeEditModal() {
      this.shouldShowEditModal = false;
    },
    closeDeleteModal() {
      this.shouldShowDeleteModal = false;
    },
  },
  async created() {
    await this.$store.dispatch('order/getOrders');
    await this.$store.dispatch('table/getTables');
    await this.$store.dispatch('user/getUsers');
  },
};
</script>

<style>
.table-header {
  background-color: #b3e0ff;
}
</style>
