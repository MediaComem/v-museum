import { createApp } from "vue";
import { createStore } from "vuex";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";
import router from "./router";

export const getters = {
  getCompletionByDecade: (state) => (decade) => {
    return state.completionData.filter((e) => e.position === decade)[0];
  },
  getImagesByDecade: (state) => (decade) => {
    return state.images.find((e) => e.decade === decade);
  },
  getHistory: (state) => {
    return state.history;
  },
};

export const mutations = {
  setNextContext(state, payload) {
    if (store.getters.getImagesByDecade(payload.decade) === undefined) {
      state.images.push({ decade: payload.decade, data: payload.images });
    } else {
      const images = store.getters.getImagesByDecade(payload.decade);
      images.data = images.data.concat(payload.images);
    }
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
    if (store.getters.getCompletionByDecade(payload.year) === undefined) {
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
  provideSecondRelatedImages(state, relatedImages) {
    state.secondRelatedImages = relatedImages;
  },
  addHistoryElement(state, payload) {
    const isExist = state.history.find(
      (e) => e.index === payload.index && e.decade === payload.decade
    );
    if (isExist === undefined) {
      state.history.push({
        decade: payload.decade,
        index: payload.index,
        data: payload.data,
      });
    }
  },
  /* removeHistoryElement(state, payload) {
    console.log(payload.historyElement);
    const result = state.history.filter((e) => e.decade !== payload.historyElement.decade && e.index !== payload.historyElement.index);
    console.log(result);
  }, */
};

export const actions = {
  updateCompletion(context, payload) {
    context.commit("updateCompletion", {
      year: payload.decade,
      completion: payload.completion,
    });
  },
  insertHistory(context, payload) {
    context.commit("addHistoryElement", {
      decade: payload.decade,
      index: payload.index,
      data: payload.data,
    });
  },
  /*   removeElementHistory(context, payload) {
    context.commit("removeHistoryElement", {
      historyElement: payload.historyElement,
    });
  }, */
  initializeCarousel(context, { decade }) {
    context.commit("setNextDecade", decade);
    dataFetch
      .getImages(decade, context.state.nextPageOffset)
      .then((result) => {
        context.commit("setNextContext", {
          images: result.images,
          decade: decade,
          page: 2,
        });
        context.commit("setCompletion", {
          year: decade,
          totalImages: result.totalImages,
        });
      })
      .catch((err) => console.log(err));
  },
  loadNextContent(context, { decade }) {
    context.commit("loadingState");
    dataFetch
      .getImages(context.state.nextDecade, context.state.nextPageOffset)
      .then((result) => {
        if (result.images.length > 0) {
          context.commit("setNextContext", {
            images: result.images,
            decade: decade,
            page: context.state.nextPageOffset + 1,
          });
        }
      });
  },
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
  loadSecondRelatedImages(context, { tags, id }) {
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
      context.commit("provideSecondRelatedImages", relatedImages);
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
      secondRelatedImages: [],
      completionData: [],
      history: [],
    };
  },
  getters: getters,
  mutations: mutations,
  actions: actions,
});

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
