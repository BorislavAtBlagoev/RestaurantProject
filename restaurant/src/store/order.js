import axios from 'axios';
import store from '../store';

const orders = {
  namespaced: true,
  state: {
    ordersList: [],
    url: `${process.env.VUE_APP_API_URL}/orders/`,
    ordersProductsList: [],
    order: {},
    activeOrder: {},
  },
  mutations: {
    setOrders(state, orders) {
      orders.forEach((order) => {
        state.ordersList.push(order);
      });
    },
    clearList(state) {
      state.ordersList = [];
    },
    setUrl(state, url) {
      state.url = url;
    },
    setOrdersProducts(state, ordersProducts) {
      state.ordersProductsList = ordersProducts;
    },
    setCreatedOrder(state, order) {
      state.order = order;
    },
    setActiveOrder(state, activeOrder) {
      state.activeOrderProducts = activeOrder;
    },
  },
  actions: {
    getActiveOrder({ commit }, payload) {
      axios
        .get(`${process.env.VUE_APP_API_URL}/orders/${payload}`)
        .then((response) => commit('setActiveOrder', response));
    },
    async createOrder({ commit }, payload) {
      const response = await axios.post(`${process.env.VUE_APP_API_URL}/orders/`, payload);
      commit('setCreatedOrder', response.data);
    },
    async getOrders({ commit }) {
      commit('clearList');
      while (store.state.order.url !== null) {
        await axios
          .get(store.state.order.url)
          .then((response) => {
            commit('setOrders', response.data.results);
            commit('setUrl', response.data.next);
          })
          .catch((error) => console.warn(error));
      }

      commit('setUrl', `${process.env.VUE_APP_API_URL}/orders/`);
    },
    async editOrder(_, payload) {
      await axios.patch(`${process.env.VUE_APP_API_URL}/orders/${payload.id}/`, payload);

      await store.dispatch('order/getOrders');
    },
    deleteOrder(_, payload) {
      axios.delete(`${process.env.VUE_APP_API_URL}/orders/${payload}/`).then(() => store.dispatch('order/getOrders'));
    },
    async getOrdersProducts({ commit }) {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/orders_products/`);

      commit('setOrdersProducts', response.data);
    },
    async addProductToOrder(_, payload) {
      // await store.dispatch('order/getOrdersProducts');

      const ordersProducts = store.state.order.ordersProductsList;
      const listOfUniqueOrderProduct = ordersProducts.filter(
        (orderProduct) => orderProduct?.order === payload?.order && orderProduct?.product === payload?.product,
      );

      if (listOfUniqueOrderProduct.length > 0) {
        const editOrderProductData = {
          id: listOfUniqueOrderProduct[0].id,
          quantity: listOfUniqueOrderProduct[0].quantity + parseInt(payload.quantity),
        };

        await axios.patch(
          `${process.env.VUE_APP_API_URL}/orders_products/${editOrderProductData.id}/`,
          editOrderProductData,
        );
      } else {
        await axios.post(`${process.env.VUE_APP_API_URL}/orders_products/`, payload);
      }

      await store.dispatch('order/getOrdersProducts');
      await store.dispatch('order/getOrders');
    },
    async removeProductFromOrder(_, payload) {
      // await store.dispatch('order/getOrdersProducts');

      const ordersProducts = store.state.order.ordersProductsList;
      const listOfUniqueOrderProduct = ordersProducts.filter(
        (orderProduct) => orderProduct?.order === payload?.order && orderProduct?.product === payload?.product,
      );

      if (listOfUniqueOrderProduct.length > 0) {
        const orderProductId = listOfUniqueOrderProduct[0].id;
        await axios.delete(`${process.env.VUE_APP_API_URL}/orders_products/${orderProductId}/`);
      }

      await store.dispatch('order/getOrders');
    },
  },
};

export default orders;
