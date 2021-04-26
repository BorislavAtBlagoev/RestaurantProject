import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Auth0Plugin } from './services/Auth0Service';
import store from './store';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { responseInterceptor } from './interceptors';

Vue.config.productionTip = false;

Vue.use(Auth0Plugin);
Vue.use(VueToast);

responseInterceptor();

new Vue({
  router,
  store,
  render: (h) => h(App),
  async created() {
    await this.$auth.createClient();
  },
}).$mount('#app');
