<template>
  <div class="container">
    <div class="content is-large">
      <div class="columns">
        <div class="column">
          <h1>Menu</h1>
        </div>
      </div>
    </div>

    <div class="content is-medium has-text-left">
      <table class="table is-narrow is-small">
        <thead>
          <tr class="table-header">
            <th>Name</th>
            <th>Price</th>
            <th>Categories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-for="product in products" :key="product.id">
          <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.price }} BGN</td>
            <td v-if="typeof getCategories(product) === 'object'">
              <div class="columns">
                <div v-for="productCategory in getCategories(product)" :key="productCategory.id">
                  <div class="column">
                    <button class="button is-info is-light">{{ productCategory }}</button>
                  </div>
                </div>
              </div>
            </td>
            <td v-else>
              <button class="button is-info is-light">{{ getCategories(product) }}</button>
            </td>
            <td v-if="isAdmin">
              <div class="select is-info is-rounded is-focused is-medium">
                <select @change="modifyMenu($event, product)">
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

      <modal v-show="shouldShowEditModal" @close="shouldShowEditModal = false" class="has-text-centered">
        <template>
          <div class="box">
            <h1>Edit product</h1>
            <div class="field">
              <label class="label is-medium">Name</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Meat"
                  v-model="product.name"
                />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Price</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Something to eat"
                  v-model="product.price"
                />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Category</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Food"
                  v-model="product.category"
                />
              </div>
            </div>

            <button class="button is-info" @click="editProduct()">Save</button>
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
import { mapGetters } from 'vuex';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      shouldModify: '',
      shouldShowEditModal: false,
      shouldShowDeleteModal: false,
      product: {
        id: '',
        name: '',
        price: '',
        category: '',
        categoryObj: {},
        firstSubcategory: '',
        firstSubcategoryObj: {},
      },
    };
  },
  computed: {
    ...mapGetters('user', ['isAdmin']),
    products() {
      return this.$store.state.menu.productsList;
    },
    categories() {
      return this.$store.state.category.categoriesList;
    },
  },
  methods: {
    getCategories(product) {
      let allCategoriesOfCertainProduct = [];

      let categoryOfCertainProduct = this.categories.find((category) => category.id === product.category);

      if (categoryOfCertainProduct.parent_category === null) {
        return categoryOfCertainProduct.name;
      }

      allCategoriesOfCertainProduct.push(categoryOfCertainProduct.name);

      for (let i = 0; i < 2; i++) {
        if (categoryOfCertainProduct.parent_category === null) {
          break;
        }

        categoryOfCertainProduct = this.categories.find(
          (category) => category.id === categoryOfCertainProduct.parent_category,
        );

        allCategoriesOfCertainProduct.push(categoryOfCertainProduct.name);
      }

      return allCategoriesOfCertainProduct.reverse();
    },
    modifyMenu(event, product) {
      if (event.target.value === 'edit') {
        this.product.id = product.id;
        this.product.name = product.name;
        this.product.price = product.price;
        this.product.categoryObj = this.categories.find((category) => category.id === product.category);
        this.product.category = this.product.categoryObj.name;

        this.shouldShowEditModal = true;
      } else if (event.target.value === 'delete') {
        this.shouldShowDeleteModal = true;
        this.product.id = product.id;
      }

      event.target.value = '';
    },
    editProduct() {
      const newCategoryOfProduct = this.categories.find(
        (category) => category.name.toUpperCase() === this.product.category.toUpperCase(),
      );

      try {
        this.product.category = newCategoryOfProduct.id;
        this.$store.dispatch('menu/editProduct', this.product);
      } catch (error) {
        console.warn(error);
      } finally {
        this.closeEditModal();
      }
    },
    deleteProduct() {
      this.$store.dispatch('menu/deleteProduct', this.product.id);
      this.closeDeleteModal();
    },
    closeEditModal() {
      this.shouldShowEditModal = false;
    },
    closeDeleteModal() {
      this.shouldShowDeleteModal = false;
    },
  },
  async created() {
    await this.$store.dispatch('category/getCategories');
    await this.$store.dispatch('menu/getProducts');
  },
};
</script>

<style>
.table-header {
  background-color: #b3e0ff;
}
</style>
