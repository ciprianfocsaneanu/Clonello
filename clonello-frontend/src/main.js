import Vue from 'vue'
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue'
import App from './App';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import NotFound from './components/NotFound';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios)

const routes = [
  {
    path: '/board/:id',
    name: 'Board',
    component: Board
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/*',
    name: 'Not found',
    component: NotFound
  }
];

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
