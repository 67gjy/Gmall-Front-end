import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import request from "@/utils/request";
import store from  './store';
import axios from "axios";

Vue.use(ElementUI,{size: "small"});
Vue.config.productionTip = false
Vue.prototype.request=request
axios.defaults.baseURL = '/proxy_url'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
