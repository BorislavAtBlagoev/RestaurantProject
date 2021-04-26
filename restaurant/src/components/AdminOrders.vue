<template>
  <div class="container">
    <div class="content is-large">
      <div class="columns">
        <div class="column">
          <h1>Orders</h1>
        </div>
      </div>
    </div>

    <div class="content is-medium overflow-auto">
      <table class="table is-narrow is-small">
        <thead>
          <tr class="table-header">
            <th>Order Number</th>
            <th>Table Number</th>
            <th>Waiter</th>
            <th>Date</th>
            <th>Current Price</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-for="(order, index) in setOrders" :key="index">
          <tr>
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.tableNumber }}</td>
            <td>{{ order.waiter }}</td>
            <td>{{ order.date }}</td>
            <td>{{ order.currentPrice }}</td>
            <td>{{ order.price }}</td>
            <td>{{ order.status }}</td>
            <td>
              <div class="select is-info is-rounded is-focused is-medium">
                <select @change="modifyTable($event, order)">
                  <option value="" disabled selected hidden>Acions</option>
                  <option value="view">View</option>
                  <hr class="dropdown-divider" />
                  <option value="edit">Edit</option>
                  <hr class="dropdown-divider" />
                  <option value="delete">Delete</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <modal class="has-text-center" v-show="shouldShowViewModal" @close="shouldShowViewModal = false">
        <template>
          <div class="box">
            <h1>Table {{ tableNumber }}</h1>
            <p class="h2">Total: {{ totalPriceOfOrder }}</p>
            <div class="columns">
              <div class="column">
                <div class="card" v-for="(product, index) in getProductsOfCurrentOrder()" :key="index">
                  <header class="card-content mb-2">
                    <p class="content">
                      <span>{{ product.name }} </span>
                      <span>{{ product.price }}</span>
                      <span>{{ product.time | formatData }}</span>
                    </p>
                  </header>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <button class="button is-large is-info" @click="completeOrder()">Complete Order</button>
              </div>
            </div>
          </div>
        </template>
      </modal>

      <modal class="has-text-center" v-show="shouldShowEditModal" @close="shouldShowEditModal = false">
        <template>
          <div class="box">
            <h1>Edit Order</h1>
            <p class="is-size-3">Order Number {{ orderId }}</p>

            <div class="columns">
              <div class="column">
                <div class="select is-large is-info is-rounded">
                  <select v-model="productId">
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="column">
                <input
                  class="input is-large is-info is-rounded"
                  type="text"
                  placeholder="Rounded input"
                  v-model="quantity"
                />
              </div>
            </div>
            <div class="columns">
              <div class="column"></div>
              <div class="column is-one-fifth">
                <button class="button is-large is-info" @click="addProductToOrder()">Add</button>
              </div>
              <div class="column is-one-fifth">
                <button class="button is-large is-info" @click="removeProductFromOrder()">Remove</button>
              </div>
              <div class="column"></div>
            </div>
          </div>
        </template>
      </modal>

      <modal class="has-text-centered" v-show="shouldShowDeleteModal" @close="shouldShowDeleteModal = false">
        <template>
          <div class="box">
            <h1>Are you sure you want to delete this order?</h1>

            <div class="columns">
              <div class="column"></div>
              <div class="column is-one-fifth">
                <button class="button is-info" @click="deleteOrder()">Yes</button>
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
import { DateTime } from 'luxon';
import Modal from '../components/Modal';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      shouldShowViewModal: false,
      shouldShowEditModal: false,
      shouldShowDeleteModal: false,
      orderId: 0,
      productId: 0,
      quantity: 1,
      orderStatus: '',
      tableNumber: '',
      totalPriceOfOrder: 0,
    };
  },
  computed: {
    orders() {
      return this.$store.state.order.ordersList;
    },
    tables() {
      return this.$store.state.table.tablesList;
    },
    users() {
      return this.$store.state.user.usersList;
    },
    products() {
      return this.$store.state.menu.productsList;
    },
    setOrders() {
      let orders = [];
      const ordersList = this.orders;

      for (let i = 0; i < ordersList.length; i++) {
        const order = ordersList[i];
        const orderTable = this.tables.find((table) => table.id === order.table);
        const orderWaiter = this.users.find((user) => user.id === order.user);
        const dateTimeOfOrder = DateTime.fromISO(order.updated_at).setLocale('en').toFormat('EEE LLLL yyyy HH:mm');

        const orderData = {
          orderNumber: order.id,
          tableNumber: orderTable.number,
          waiter: orderWaiter.name,
          date: dateTimeOfOrder,
          currentPrice: `${order.total_price} BGN`,
          price: `${order.total_price} BGN`,
          status: order.status,
        };

        orders.push(orderData);
      }

      return orders;
    },
  },
  methods: {
    modifyTable(event, order) {
      event.preventDefault();
      this.orderId = order.orderNumber;
      this.orderStatus = order.status;

      if (event.target.value === 'view') {
        this.tableNumber = order.tableNumber;
        this.totalPriceOfOrder = order.currentPrice;

        this.shouldShowViewModal = true;
      } else if (event.target.value === 'edit') {
        this.shouldShowEditModal = true;
      } else if (event.target.value === 'delete') {
        this.shouldShowDeleteModal = true;
      }

      event.target.value = '';
    },
    addProductToOrder() {
      if (this.orderStatus === 'In progress' && this.quantity >= 1) {
        const orderProductData = {
          order: this.orderId,
          product: this.productId,
          quantity: this.quantity,
        };

        this.clearEditForm();
        this.$store.dispatch('order/addProductToOrder', orderProductData);
      }
    },
    removeProductFromOrder() {
      if (this.orderStatus === 'In progress') {
        const orderProductData = {
          order: this.orderId,
          product: this.productId,
        };

        this.clearEditForm();
        this.$store.dispatch('order/removeProductFromOrder', orderProductData);
      }
    },
    deleteOrder() {
      this.$store.dispatch('order/deleteOrder', this.orderId);
      this.closeDeleteModal();
    },
    completeOrder() {
      const editOrderData = {
        id: this.orderId,
        status: 'Completed',
      };

      this.$store.dispatch('order/editOrder', editOrderData);
      this.closeViewModal();
    },
    getProductsOfCurrentOrder() {
      const order = this.orders.find((order) => order.id === this.orderId);
      const productsOfCertainOrder = [];

      if (order) {
        order.products.forEach((certainProduct) => {
          const matchingProduct = this.products.find((product) => product.id === certainProduct);

          const productData = {
            name: matchingProduct.name,
            price: `${matchingProduct.price} BGN`,
            time: order.updated_at,
          };

          productsOfCertainOrder.push(productData);
        });

        return productsOfCertainOrder;
      }
    },
    closeViewModal() {
      this.shouldShowViewModal = false;
    },
    closeEditModal() {
      this.shouldShowEditModal = false;
    },
    closeDeleteModal() {
      this.shouldShowDeleteModal = false;
    },
    clearEditForm() {
      this.productId = '';
      this.quantity = 1;
    },
  },
  filters: {
    formatData(time) {
      return DateTime.fromISO(time).setLocale('en').toFormat('HH:mm');
    },
  },
  async created() {
    await this.$store.dispatch('user/getUsers');
    await this.$store.dispatch('table/getTables');
    await this.$store.dispatch('menu/getProducts');
    await this.$store.dispatch('order/getOrders');
  },
};
</script>

<style scoped>
.overflow-auto {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
