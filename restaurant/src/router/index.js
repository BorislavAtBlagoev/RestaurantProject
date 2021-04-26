import Vue from 'vue';
import VueRouter from 'vue-router';
import { isAuthenticated } from './guards/AuthGuards';

const Categories = () => import('../views/Categories.vue');
const Menu = () => import('../views/Menu.vue');
const Orders = () => import('../views/Orders.vue');
const WaiterTable = () => import('../views/WaiterTable.vue');
const Profile = () => import('../views/Profile.vue');
const Tables = () => import('../views/Tables.vue');
const Login = () => import('../views/Login.vue');
const Registration = () => import('../views/Registration.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/table/:tableId',
    name: 'WaiterTable',
    component: WaiterTable,
    props: true,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
