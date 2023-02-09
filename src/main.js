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
  getFullHistoryMode: (state) => {
    return state.fullHistory;
  },
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
  },
  getImagesWithNbTags: (state) => {
    return state.imagesWithNbTags
  }
};

export const mutations = {
  updateFullHistory(state, payload) {
    state.fullHistory = payload.isOpen;
  },
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
    state.tags.push(tag);
   },
   removeTag(state, index) {
     state.tags.splice(index, 1);
   },
   updateImages(state, images) {
     state.images = images;
   },
   updateFullTagPageOrigin(state, origin) {
     state.full_tag_page_origin = origin;
   },
   ImagesWithNbTags(state, images) {
    state.imagesWithNbTags = images;
   }
};

export const actions = {
  updateFullHistory(context, payload) {
    context.commit("updateFullHistory", payload)
  },
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
  },
  setImagesWithNbTags(context, images) {
    context.commit("ImagesWithNbTags", images)
  }
};

const store = createStore({
  state() {
    return {
      history: [],
      fullHistory: false,
      tags: [''], 
      images: images,
      full_tag_page_origin: '',
      imagesWithNbTags: [],
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
  plugins: [vuexLocal.plugin],
});

const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const app = createApp(App);
app.config.globalProperties.isSafariBrowser = isSafari;
app.config.globalProperties.isFirefoxBrowser = isFirefox;
app.config.globalProperties.isSafariIphone = isSafari && iOS;
app.config.globalProperties.isMobileDevice = isAndroid || iOS;

console.log(navigator)

app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
