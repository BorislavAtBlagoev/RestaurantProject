import axios from 'axios';
import store from '../store';

const table = {
  namespaced: true,
  state: {
    tablesList: [],
  },
  mutations: {
    setTables(state, tables) {
      state.tablesList = tables;
    },
  },
  actions: {
    getTables({ commit }) {
      axios.get(`${process.env.VUE_APP_API_URL}/tables/`).then((response) => commit('setTables', response.data));
    },
    createTable(_, payload) {
      axios.post(`${process.env.VUE_APP_API_URL}/tables/`, payload).then(() => store.dispatch('table/getTables'));
    },
    editTable(_, payload) {
      axios
        .patch(`${process.env.VUE_APP_API_URL}/tables/${payload.id}/`, payload)
        .then(() => store.dispatch('table/getTables'));
    },
    deleteTable(_, payload) {
      axios.delete(`${process.env.VUE_APP_API_URL}/tables/${payload}/`).then(() => store.dispatch('table/getTables'));
    },
  },
};

export default table;
