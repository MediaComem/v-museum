import { createApp } from "vue";
import { createStore } from "vuex";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";

export const mutations = {
  setNextContext(state, payload) {
    state.images = state.images.concat(payload.images);
    state.nextPageOffset = payload.page;
    state.isLoadingImage = false;
  },
  setNextDecade(state, decade) {
    state.nextDecade = decade;
  },
  loadingState(state) {
    state.isLoadingImage = true;
  },
  provideRelatedImages(state, relatedImages) {
    state.relatedImages = relatedImages;
  },
};

export const actions = {
  initializeCarousel(context, { decade }) {
    context.commit("setNextDecade", decade);
    dataFetch
      .getImages(decade, context.state.nextPageOffset)
      .then((images) => {
        context.commit("setNextContext", {
          images: images,
          page: 2,
        });
      })
      .catch((err) => console.log(err));
  },
  loadNextContent(context) {
    context.commit("loadingState");
    dataFetch
      .getImages(context.state.nextDecade, context.state.nextPageOffset)
      .then((images) => {
        if (images.length > 0) {
          context.commit("setNextContext", {
            images: images,
            page: context.state.nextPageOffset + 1,
          });
        }
      });
  },
  // TODO: Optimize the time consuming of this part!!!
  loadRelatedImages(context, { tags, id }) {
    const relatedImages = [];
    const promises = [];
    tags.sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .forEach((tag) => {
      promises.push(
        dataFetch.getRelatedImages(tag, id).then((result) => {
          if (result) {
            relatedImages.push({tag: tag, result: result});
          }
        })
      );
    });

    Promise.all(promises).then(() => {
        context.commit("provideRelatedImages", relatedImages);
    });
  },
};

const store = createStore({
  state() {
    return {
      isLoadingImage: false,
      nextDecade: 0,
      nextPageOffset: 1,
      images: [],
      relatedImages: [],
    };
  },
  mutations: mutations,
  actions: actions,
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
