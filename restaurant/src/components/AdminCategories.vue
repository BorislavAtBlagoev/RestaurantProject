<template>
  <div class="container">
    <div class="content is-large">
      <div class="columns">
        <div class="column">
          <h1>Categories</h1>
        </div>
        <div class="column is-one-quarter">
          <button class="button is-info is-medium" @click="showCreateCategoryModal">NEW CATEGORY</button>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <accordion-category v-for="category in mainCategories" :key="category.id">
            <accordion-item-category>
              <template slot="accordion-trigger">
                <category-list :category="category"></category-list>
              </template>

              <template slot="accordion-content">
                <accordion-category v-for="(subcategory, index) in getSubcategories(category)" :key="index">
                  <accordion-item-category>
                    <template slot="accordion-trigger">
                      <category-list :category="subcategory"></category-list>
                    </template>

                    <template slot="accordion-content">
                      <accordion-category v-for="(subcategory, index) in getSubcategories(subcategory)" :key="index">
                        <accordion-item-category>
                          <template slot="accordion-trigger">
                            <category-list :category="subcategory"></category-list>
                          </template>
                        </accordion-item-category>
                      </accordion-category>
                    </template>
                  </accordion-item-category>
                </accordion-category>
              </template>
            </accordion-item-category>
          </accordion-category>
        </div>
      </div>

      <modal v-show="shouldShowModal" @close="shouldShowModal = false">
        <template>
          <div class="box">
            <h1>Create category</h1>
            <div class="field">
              <label class="label is-medium">Name</label>
              <div class="control">
                <input class="input is-info is-rounded is-medium" type="text" placeholder="e.g Meat" v-model="name" />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Description</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Something to eat"
                  v-model="description"
                />
              </div>
            </div>

            <div class="field">
              <label class="label is-medium">Parent category</label>
              <div class="control">
                <input
                  class="input is-info is-rounded is-medium"
                  type="text"
                  placeholder="e.g Food"
                  v-model="parentCategory"
                />
              </div>
            </div>

            <button class="button is-info is-medium" @click="createCategory">Save</button>
          </div>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import AccordionCategory from '../components/AccordionCategory';
import AccordionItemCategory from '../components/AccordionItemCategory';
import Modal from '../components/Modal';
import { mapGetters } from 'vuex';
import CategoryList from '../components/CategoryList';

export default {
  components: {
    AccordionCategory,
    AccordionItemCategory,
    Modal,
    CategoryList,
  },
  data() {
    return {
      shouldShowModal: false,
      name: '',
      description: '',
      parentCategory: '',
    };
  },
  computed: {
    ...mapGetters('category', ['mainCategories']),
    categories() {
      return this.$store.state.category.categoriesList;
    },
  },
  methods: {
    getSubcategories(currentCategory) {
      return this.categories.filter((category) => category.parent_category === currentCategory.id);
    },
    createCategory() {
      const category = {
        name: this.name,
        description: this.description,
        parent_category: this.parentCategory,
      };

      this.$store.dispatch('category/createCategory', category);
      this.closeModal();
    },
    showCreateCategoryModal() {
      this.name = '';
      this.description = '';
      this.parentCategory = '';

      this.shouldShowModal = true;
    },
    closeModal() {
      this.shouldShowModal = false;
    },
  },
  async created() {
    await this.$store.dispatch('category/getCategories');
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-right: 10%;
}
</style>
