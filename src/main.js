import { createApp } from "vue";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";
import router from "./router";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: [
    "history",
  ],
});

export const getters = {
  getHistory: (state) => {
    return state.history;
  },
};

export const mutations = {
  addHistoryElement(state, payload) {
    const isExist = state.history.find((e) => e.imageId === payload.imageId);
    if (isExist === undefined) {
      if (state.history.length === 100) {
        state.history.shift();
      }
      state.history.push({
        imageId: payload.imageId,
        data: payload.data,
        tag: payload.tag,
      });
    }
  },
};

export const actions = {
  insertHistory(context, payload) {
    dataFetch.getImageById(payload.imageId).then((data) => {
      if (data.length > 0) {
        context.commit("addHistoryElement", {
          imageId: payload.imageId,
          data: data[0].imagePaths.square,
          tag: payload.tag,
        });
      }
    });
  },
};

const store = createStore({
  state() {
    return {
      history: [],
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  plugins: [vuexLocal.plugin],
});

const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const app = createApp(App);
if (isSafari && iOS) {
  app.config.globalProperties.isSafariIphone = true;
}
else {
  app.config.globalProperties.isSafariIphone = false;
}
app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
