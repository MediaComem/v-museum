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
  getNextPageByDecade: (state) => (decade) => {
    return state.nextPageOffset.find((e) => e.decade === decade);
  },
  getSkipIdsByDecade: (state) => (decade) => {
    return state.loadSkipIds.find((e) => e.decade === decade);
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
    if (payload.page !== undefined){
      if (store.getters.getNextPageByDecade(payload.decade) === undefined) {
        state.nextPageOffset.push({ decade: payload.decade, page: payload.page });
      } else {
        const nextPage = store.getters.getNextPageByDecade(payload.decade);
        nextPage.page = payload.page;
      }
    }
    state.isLoadingImage = false;
  },
  insertSkipId(state, payload) {
    const skipIds = store.getters.getSkipIdsByDecade(payload.decade);
    if (skipIds === undefined){
      state.loadSkipIds.push({ decade: payload.decade, ids: [payload.id] });
    } else {
      skipIds.ids.push(payload.id);
    }
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
  initializeCarousel(context, { decade }) {
    if (store.getters.getImagesByDecade(decade) === undefined) {
      dataFetch
        .getImages(decade, 1, [])
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
    }
  },
  insertSkipId(context, {decade, id} ) {
    context .commit("insertSkipId", {
      decade: decade,
      id: id
    });
  },
  loadNextContent(context, { decade, id }) {
    context.commit("loadingState");
    let nextPage = store.getters.getNextPageByDecade(decade);
    if (nextPage === undefined) {
      nextPage = 0;
    }
    if (id !== undefined) {
      dataFetch.getImageById(id).then((result) => {
        context.commit("setNextContext", {
          images: result,
          decade: decade
        })
      })
    }
    let skipIds = store.getters.getSkipIdsByDecade(decade);
    if (skipIds === undefined) {
      skipIds = {ids: []};
    }
    dataFetch.getImages(decade, nextPage, skipIds.ids).then((result) => {
      if (result.images.length > 0) {
        context.commit("setNextContext", {
          images: result.images,
          decade: decade,
          page: nextPage + 1,
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
      nextPageOffset: [],
      images: [],
      relatedImages: [],
      secondRelatedImages: [],
      completionData: [],
      history: [],
      loadSkipIds: [],
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
