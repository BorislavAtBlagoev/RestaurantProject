<template>
  <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="columns is-multiline">
          <div class="column is-one-quarter" v-for="category in categories" :key="category.id">
            <div class="card" @click="getProductsOfCertainCategory(category)">
              <header class="card-header">
                <p class="card-header-title">{{ category.name }}</p>
              </header>
            </div>
          </div>
        </div>
        <hr class="content-divider" />
        <div class="columns is-multiline">
          <div class="column is-one-quarter" v-for="product in productsFromCertainCategory" :key="product.id">
            <div class="card" @click="addProductToOrder(product)">
              <header class="card-header">
                <p class="card-header-title">{{ product.name }}</p>
              </header>
            </div>
          </div>
        </div>

        <div class="columns back-button">
          <div class="column">
            <router-link to="/">
              <button class="button is-large is-info">Back</button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="column">
        <order-sidebar :table="tableId"></order-sidebar>
      </div>
    </div>
  </div>
</template>

<script>
import OrderSidebar from './OrderSidebar';

export default {
  components: {
    OrderSidebar,
  },
  data() {
    return {
      filteredProducts: [],
      addedOrders: [],
      currentOrder: 0,
      shouldCreateNewOrder: true,
    };
  },
  props: {
    tableId: Object,
  },
  computed: {
    table() {
      return this.tableId.tableId;
    },
    order() {
      return this.$route.query.order;
    },
    categories() {
      return this.$store.state.category.categoriesList;
    },
    products() {
      return this.$store.state.menu.productsList;
    },
    orders() {
      return this.$store.state.order.ordersList;
    },
    createdOrderData() {
      return this.$store.state.order.order;
    },
    users() {
      return this.$store.state.user.usersList;
    },
    productsFromCertainCategory() {
      return this.filteredProducts;
    },
  },
  methods: {
    getProductsOfCertainCategory(category) {
      this.filteredProducts = this.products.filter((product) => product.category === category.id);
    },
    async addProductToOrder(product) {
      if (!this.order && this.shouldCreateNewOrder === true) {
        const createOrderData = {
          table: this.table,
          user: this.getUserId(),
        };

        await this.$store.dispatch('order/createOrder', createOrderData);
        this.shouldCreateNewOrder = false;
      }

      const addProductToOrderData = {
        order: this.order ? this.order : this.createdOrderData.id,
        product: product.id,
        quantity: 1,
      };

      await this.$store.dispatch('order/addProductToOrder', addProductToOrderData);
    },
    getUserId() {
      let userAuth0Id = this.$store.state.user.userData.sub;
      userAuth0Id = userAuth0Id.replace('|', '.');

      return this.users.find((user) => user.username === userAuth0Id)?.id;
    },
  },
  async created() {
    await this.$store.dispatch('category/getCategories');
    await this.$store.dispatch('menu/getProducts');
    await this.$store.dispatch('order/getOrders');
    await this.$store.dispatch('user/getUsers');
  },
};
</script>

<style>
.content-divider {
  background-color: #cccccc;
  height: 1px;
}

.columns.back-button {
  position: absolute;
  float: left;
  top: 540px;
}
</style>
