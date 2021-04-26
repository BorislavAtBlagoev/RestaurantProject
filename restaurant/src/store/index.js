import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import category from './category';
import menu from './menu';
import table from './table';
import profile from './profile';
import order from './order';
import common from './common';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAdmin: true,
    isUserLoggedIn: true,
  },
  mutations: {},
  actions: {},
  modules: {
    user,
    category,
    menu,
    table,
    profile,
    order,
    common,
  },
});
