import { createApp } from "vue";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";
import router from "./router";

import images from "./assets/data/images.json";

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
  getTags: (state) => {
    return state.tags
  },
  getImages: (state) => {
    return state.images
  },
  getFullTagPageOrigin: (state) => {
    return state.full_tag_page_origin
  }
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
  addTag (state, tag) {
   state.tags.push(tag)
  },
  removeTag(state, index) {
    state.tags.splice(index, 1)
  },
  updateImages(state, images) {
    state.images = images
  },
  updateFullTagPageOrigin(state, origin) {
    state.full_tag_page_origin = origin
  }
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
  insertTag(context, tag) {
    context.commit("addTag", tag)
  },
  removeTag(context, index) {
    context.commit("removeTag", index)
  },
  setImages(context, images) {
    context.commit("updateImages", images)
  },
  setFullTagPageOrigin(context, origin) {
    context.commit("updateFullTagPageOrigin", origin)
  }
};

const store = createStore({
  state() {
    return {
      history: [], tags: [''], images: [images], full_tag_page_origin: '',
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  plugins: [vuexLocal.plugin],
});

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
