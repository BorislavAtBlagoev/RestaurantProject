import axios from 'axios';
import store from '../store';

const menu = {
  namespaced: true,
  state: {
    productsList: [],
  },
  mutations: {
    setProducts(state, products) {
      state.productsList = products;
    },
  },
  actions: {
    getProducts({ commit }) {
      axios
        .get(`${process.env.VUE_APP_API_URL}/products/`)
        .then((response) => commit('setProducts', response.data.results));
    },
    editProduct(_, payload) {
      axios
        .patch(`${process.env.VUE_APP_API_URL}/products/${payload.id}/`, payload)
        .then(() => store.dispatch('menu/getProducts'));
    },
    deleteProduct(_, payload) {
      axios
        .delete(`${process.env.VUE_APP_API_URL}/products/${payload}/`)
        .then(() => store.dispatch('menu/getProducts'));
    },
  },
};

export default menu;
