<template>
  <div class="order-sidebar">
    <div class="columns">
      <div class="column">
        <div class="content is-large">
          <h1>Order</h1>
        </div>
      </div>
    </div>
    <div class="overflow-auto">
      <div class="columns" v-for="(product, index) in productsObj" :key="index">
        <div class="column">
          <div class="card mr-3 content is-medium">
            <div class="card-header">
              <div class="card-header-title">
                <div class="columns">
                  <div class="column">{{ product.name }}</div>
                  <div class="column">{{ product.quantity }}</div>
                  <div class="column">{{ product.price }}</div>
                  <div class="column">
                    <button class="button is-info is-right" @click="removeProductFromList(product)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns content is-large mt-3">
      <div class="column">Total Amount</div>
      <div class="column">{{ totalPrice | formatPrice }}</div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="buttons is-centered">
          <button class="button is-info is-medium" @click="completeOrder()">Finish</button>
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
      order: 0,
    };
  },
  props: {
    product: Object,
    table: Object,
  },
  computed: {
    orderProducts() {
      return this.$store.state.order.ordersProductsList;
    },
    orders() {
      return this.$store.state.order.ordersList;
    },
    products() {
      return this.$store.state.menu.productsList;
    },
    totalPrice() {
      return getActiveOrder(this.orders, this.table.tableId)?.total_price;
    },
    productsObj() {
      const productList = [];
      const currentOrderProducts = getActiveOrder(this.orders, this.table.tableId);

      for (let i = 0; i < currentOrderProducts?.products.length; i++) {
        const product = this.products.find((product) => product.id === currentOrderProducts.products[i]);
        const orderProduct = this.orderProducts.find(
          (orderProduct) => orderProduct?.order === currentOrderProducts.id && orderProduct?.product === product?.id,
        );

        const productObj = {
          name: product?.name,
          price: `${product?.price}`,
          quantity: orderProduct?.quantity,
          product: product,
        };

        productList.push(productObj);
      }

      return productList;
    },
  },
  methods: {
    completeOrder() {
      const order = getActiveOrder(this.orders, this.table.tableId);

      const editOrderData = {
        id: order?.id,
        status: 'Completed',
      };

      this.$store.dispatch('order/editOrder', editOrderData);
      this.$router.push({ path: '/' });
    },
    async removeProductFromList(product) {
      const order = getActiveOrder(this.orders, this.table.tableId);
      const orderProduct = this.orderProducts.find(
        (orderProduct) => orderProduct?.order === order?.id && orderProduct?.product === product.product?.id,
      );

      await this.$store.dispatch('order/removeProductFromOrder', orderProduct);
    },
  },
  async created() {
    await this.$store.dispatch('order/getOrdersProducts');
  },
  filters: {
    formatPrice(price) {
      return price?.toFixed(2);
    },
  },
};
</script>

<style>
.order-sidebar {
  text-align: left;
  padding-left: 1.5%;
  padding-top: 7%;
  background-color: #e6f3ff;
  width: 34%;
  height: 100%;
  float: right;
  position: fixed;
  top: 0;
  right: 0;
  word-wrap: break-word;
}

.overflow-auto {
  height: 340px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
