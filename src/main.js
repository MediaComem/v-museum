import { createApp } from "vue";
import { createStore } from "vuex";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";

export const getters = {
  getCompletionByDecade: (state) => (decade) => {
    return state.completionData.filter((e) => e.position === decade)[0];
  },
};

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
  setCompletion(state, payload) {
    if (payload.getters.getCompletionByDecade(payload.year)) {
      state.completionData.push({
        year: payload.year,
        totalImages: payload.totalImages,
        maxVisitedIndex: 0,
        completion: 0,
      });
    }
  },
  updateCompletion(state, payload) {
    state.completionData.filter(
      (e) => e.position === payload.decade
    )[0].completion = payload.completion;
  },
  provideRelatedImages(state, relatedImages) {
    state.relatedImages = relatedImages;
  },
};

export const actions = {
  updateCompletion(context, payload) {
    context.commit("updateCompletion", {
      year: payload.decade,
      completion: payload.completion,
    });
  },
  initializeCarousel(context, { decade }) {
    context.commit("setNextDecade", decade);
    dataFetch
      .getImages(decade, context.state.nextPageOffset)
      .then((result) => {
        context.commit("setNextContext", {
          images: result.images,
          page: 2,
        });
        context.commit("setCompletion", {
          year: decade,
          totalImages: result.totalImages,
          getters: getters,
        });
      })
      .catch((err) => console.log(err));
  },
  loadNextContent(context) {
    context.commit("loadingState");
    dataFetch
      .getImages(context.state.nextDecade, context.state.nextPageOffset)
      .then((result) => {
        if (result.images.length > 0) {
          context.commit("setNextContext", {
            images: result.images,
            page: context.state.nextPageOffset + 1,
          });
        }
      });
  },
  // TODO: Optimize the time consuming of this part!!!
  loadRelatedImages(context, { tags, id }) {
    const relatedImages = [];
    const promises = [];
    tags
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .forEach((tag) => {
        promises.push(
          dataFetch.getRelatedImages(tag, id).then((result) => {
            if (result) {
              relatedImages.push({ tag: tag, result: result });
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
      completionData: [],
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
