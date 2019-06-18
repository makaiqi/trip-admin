import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import filter from '@/filter'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import 'swagger-ui/dist/swagger-ui.css'
import AppCfg from '@/appconfig'
import store from './store'
import ElKit from '@/utils/ElKit'
import commonFun from '@/commons';

// 高德地图
import AMap from 'vue-amap';
Vue.use(AMap);
AMap.initAMapApiLoader({
  key: '47c019a133686563ad5e1ebb71b9f7f2',
  plugin: ["AMap.Autocomplete","AMap.Bounds","AMap.PlaceSearch","AMap.Scale","AMap.OverView","AMap.ToolBar","AMap.MapType","AMap.PolyEditor","AMap.CircleEditor","AMap.Geocoder","AMap.convertFrom","AMap.Geolocation","Geocoder"],
  v: '1.4.4'
  });

import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false
Vue.prototype.$elKit = ElKit

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee)


import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'rqh1NP8Xjcs8yMR7RwLYkPsY2gMQTEXz'
})

import Calendar from 'vue-calendar-component';
Vue.use(Calendar);

// 拖拽上传组件
import VueDND from 'awe-dnd'
Vue.use(VueDND)

import fullCalendar from 'vue-fullcalendar';
Vue.component('full-calendar', fullCalendar);
Vue.component('font-awesome-icon', FontAwesomeIcon);
const instance = axios.create(AppCfg.http);
instance.interceptors.response.use(payload => {
  if(payload.data && payload.data.code == 100){
    return window.location.href = `${window.location.href.split('/#')[0]}/#/login`
  }
  return payload;
}, error =>{
  // 对请求错误做些什么
  console.log(error);
  return Promise.reject(error);
});
Vue.prototype.$http = instance;
Vue.prototype.$httpSocket = axios.create(AppCfg.httpSocket)

Vue.use(ElementUI, {size: 'small'})

Vue.prototype.$appCfg = AppCfg;

router.beforeEach((to, from, next) => {
  store.commit('save_last_route', from)
  // Vue.prototype.sessionStorage.pageShare();
  next()

  // let userInfo = Vue.prototype.sessionStorage.getItem('user');
  // userInfo = userInfo && JSON.parse(userInfo);
  // if(to.path == '/pwd-reset' || to.path == '/login' || (userInfo && userInfo.id)) {
  //   next()
  // } else {
  // 	next({
  //     path: '/login',
  //     query: to.query,
  //     params: to.params
  //   });
  // }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
