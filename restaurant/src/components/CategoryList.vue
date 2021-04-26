<template>
  <div class="columns">
    <div class="column">
      <h3>
        {{ category.name }}
      </h3>
    </div>
    <div class="buttons">
      <div class="column">
        <button class="button is-info" @click="showEditModel(category)">Edit</button>
      </div>
      <div class="column">
        <button class="button is-danger" @click="shouldShowDeleteModal = true">Delete</button>
      </div>
    </div>

    <modal v-show="shouldShowEditModal" @close="shouldShowEditModal = false" class="has-text-centered">
      <template>
        <div class="box">
          <h1>Edit category</h1>

          <div class="field">
            <label class="label is-medium">Category name</label>
            <div class="control">
              <input class="input is-info is-rounded is-medium" type="text" v-model="editCategoryData.name" />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Description</label>
            <div class="control">
              <input class="input is-info is-rounded is-medium" type="text" v-model="editCategoryData.description" />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Parent category</label>
            <div class="control">
              <input
                class="input is-info is-rounded is-medium"
                type="text"
                v-model="editCategoryData.parent_category"
              />
            </div>
          </div>

          <button class="button is-info is-medium" @click="editCategory(category)">Save</button>
        </div>
      </template>
    </modal>

    <modal v-show="shouldShowDeleteModal" @close="closeDeleteModal()" class="has-text-centered">
      <template>
        <div class="box">
          <h1>Are you sure you want to delete this category?</h1>

          <div class="columns">
            <div class="column"></div>
            <div class="column is-one-fifth">
              <button class="button is-info" @click="deleteCategory(category)">Yes</button>
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
</template>

<script>
import Modal from './Modal';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      editCategoryData: {
        id: '',
        name: '',
        description: '',
        parent_category: '',
      },
      shouldShowEditModal: false,
      shouldShowDeleteModal: false,
    };
  },
  props: {
    category: Object,
  },
  computed: {
    categories() {
      return this.$store.state.category.categoriesList;
    },
  },
  methods: {
    editCategory() {
      this.$store.dispatch('category/editCategory', this.editCategoryData);
      this.closeEditModal();
    },
    deleteCategory(currentCategory) {
      this.$store.dispatch('category/deleteCategory', currentCategory.id);
    },
    showEditModel(currentCategory) {
      this.editCategoryData.id = currentCategory.id;
      this.editCategoryData.name = currentCategory.name;
      this.editCategoryData.description = currentCategory.description;
      try {
        const parentCategory = this.categories.find((category) => category.id === currentCategory.parent_category);
        this.editCategoryData.parent_category = parentCategory.name;
      } catch (error) {
        console.warn(error);
      }

      this.shouldShowEditModal = true;
    },
    closeEditModal() {
      this.shouldShowEditModal = false;
    },
    closeDeleteModal() {
      this.shouldShowDeleteModal = false;
    },
  },
};
</script>
