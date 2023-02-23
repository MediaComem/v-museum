import { createApp } from "vue";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from "./App.vue";

import router from "./router";

import store from './store';

const pinia = createPinia(store).use(piniaPluginPersistedstate);

const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
const isIpad = /iPad/.test(navigator.userAgent) && !window.MSStream;
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

const app = createApp(App);
if (isSafari && iOS) {
  app.config.globalProperties.isSafariIphone = true;
}
else {
  app.config.globalProperties.isSafariIphone = false;
}
app.config.globalProperties.isMobileDevice = isAndroid || iOS;
app.config.globalProperties.isIpad = isIpad

app.use(ElementPlus);
app.use(router);
app.use(pinia)
app.mount("#app");
