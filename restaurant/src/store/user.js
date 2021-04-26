import axios from 'axios';
import router from '../router';
import store from '../store';

const user = {
  namespaced: true,
  state: {
    isLoading: false,
    authError: false,
    isAuthenticated: false,
    userData: {},
    usersList: [],
  },
  getters: {
    isAdmin: (state) => state.userData.roles === store.state.common.userRole.admin,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setAuthError(state, error) {
      state.authError = error;
    },
    setIsAuthenticated(state, isAuth) {
      state.isAuthenticated = isAuth;
    },
    setUser(state, user) {
      state.userData = user;
    },
    setUsers(state, users) {
      state.usersList = users;
    },
  },
  actions: {
    setIsLoading({ commit }, isLoading) {
      commit('setIsLoading', isLoading);
    },
    setAuthError({ commit }, hasError) {
      commit('setAuthError', hasError);
    },
    setAuth0Data({ commit }, payload) {
      commit('setIsAuthenticated', payload.isAuthenticated);
      commit('setUser', payload.user);
    },
    getUsers({ commit }) {
      axios.get(`${process.env.VUE_APP_API_URL}/users/`).then((response) => commit('setUsers', response.data));
    },
    createUser(_, payload) {
      axios.post(`${process.env.VUE_APP_API_URL}/sign_up/`, payload).then(() => router.push({ name: 'Login' }));
    },
  },
};

export default user;
