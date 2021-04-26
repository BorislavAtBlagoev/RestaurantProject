import axios from 'axios';
import store from '../store';

const category = {
  namespaced: true,
  state: {
    categoriesList: [],
    category: {},
    parentCategoryId: 0,
  },
  mutations: {
    setCategories(state, categories) {
      state.categoriesList = categories;
    },
    setParentCategory(state, parentCategoryId) {
      state.parentCategoryId = parentCategoryId;
    },
  },
  getters: {
    mainCategories: (state) => state.categoriesList.filter((category) => category.parent_category === null),
  },
  actions: {
    getCategories({ commit }) {
      axios
        .get(`${process.env.VUE_APP_API_URL}/categories/`)
        .then((response) => commit('setCategories', response.data));
    },
    async fetchParentCategory({ commit }, payload) {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/categories/`);

      let parentCategory = response.data.find(
        (category) => category.name.toUpperCase() === payload.parent_category.toUpperCase(),
      );

      if (parentCategory !== undefined) {
        commit('setParentCategory', parentCategory.id);
      } else {
        commit('setParentCategory', payload.parent_category);
      }
    },
    async createCategory(_, payload) {
      await store.dispatch('category/fetchParentCategory', payload);

      const createCategoryData = {
        name: payload.name,
        description: payload.description,
        parent_category: store.state.category.parentCategoryId,
      };

      await axios.post(`${process.env.VUE_APP_API_URL}/categories/`, createCategoryData);
      await store.dispatch('category/getCategories');
    },
    async editCategory(_, payload) {
      await store.dispatch('category/fetchParentCategory', payload);

      const editCategoryData = {
        id: payload.id,
        name: payload.name,
        description: payload.description,
        parent_category: store.state.category.parentCategoryId,
      };

      await axios.patch(`${process.env.VUE_APP_API_URL}/categories/${editCategoryData.id}/`, editCategoryData);
      await store.dispatch('category/getCategories');
    },
    async deleteCategory(_, payload) {
      await axios.delete(`${process.env.VUE_APP_API_URL}/categories/${payload}/`);
      await store.dispatch('category/getCategories');
    },
  },
};

export default category;
