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
});

export const getters = {
  getCompletionByDecade: (state) => (decade) => {
    return state.completionData.find((e) => e.year == decade);
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
  getVisitedIndexByDecade: (state) => (decade) => {
    return state.lastVisitedIndex.find((e) => e.decade === decade);
  },
  getHistory: (state) => {
    return state.history;
  },
  getSecondRelatedTagsByPosition: (state) => (position) => {
    return state.secondRelatedTags.find((e) => e.position === position).tags;
  },
  getSecondRelatedImageById: (state) => (id) => {
    return state.secondRelatedImages.find((e) => e.id === id)
  }
};

export const mutations = {
  setNextContext(state, payload) {
    if (store.getters.getImagesByDecade(payload.decade) === undefined) {
      state.images.push({ decade: payload.decade, data: payload.images });
    } else {
      const images = store.getters.getImagesByDecade(payload.decade);
      images.data = images.data.concat(payload.images);
    }
    if (payload.page !== undefined) {
      if (store.getters.getNextPageByDecade(payload.decade) === undefined) {
        state.nextPageOffset.push({
          decade: payload.decade,
          page: payload.page,
        });
      } else {
        const nextPage = store.getters.getNextPageByDecade(payload.decade);
        nextPage.page = payload.page;
      }
    }
    state.isLoadingImage = false;
  },
  insertSkipId(state, payload) {
    const skipIds = store.getters.getSkipIdsByDecade(payload.decade);
    if (skipIds === undefined) {
      state.loadSkipIds.push({ decade: payload.decade, ids: [payload.id] });
    } else {
      skipIds.ids.push(payload.id);
    }
  },
  loadingState(state, val) {
    state.isLoadingImage = val;
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
  updateLastVisitedElement(state, payload) {
    const visited = store.getters.getVisitedIndexByDecade(payload.decade);
    if (visited) {
      visited.lastIndex = payload.index;
    } else {
      state.lastVisitedIndex.push({
        decade: payload.decade,
        lastIndex: payload.index,
      });
    }
  },
  updateCompletion(state, payload) {
    const completions = store.getters.getCompletionByDecade(payload.year);
    completions.completion = payload.completion;
    completions.maxVisitedIndex = payload.maxVisitedIndex;
  },
  provideRelatedImages(state, relatedImages) {
    state.relatedImages = relatedImages;
  },
  provideSecondRelatedImages(state, relatedImages) {
    if (relatedImages.length === 0) {
      state.secondRelatedImages = [];
    } else {
      state.secondRelatedImages.push(relatedImages);
    }
  },
  setSecondRelatedTags(state, selectedTags) {
    if (selectedTags.length === 0) {
      state.secondRelatedTags = [];
    }
    else {
      state.secondRelatedTags.push(selectedTags);
    }
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
  restartLoadingState(context) {
    context.commit("loadingState", false);
  },
  updateLastVisitedElement(context, payload) {
    context.commit("updateLastVisitedElement", {
      decade: payload.decade,
      index: payload.index,
    });
  },
  updateCompletion(context, payload) {
    context.commit("updateCompletion", {
      year: payload.decade,
      completion: payload.completion,
      maxVisitedIndex: payload.maxVisitedIndex,
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
  insertSkipId(context, { decade, id }) {
    context.commit("insertSkipId", {
      decade: decade,
      id: id,
    });
  },
  loadTotalImageByDecade(context, { decade }) {
    dataFetch.getHeadersByDecade(decade).then((totalImages) => {
      context.commit("setCompletion", {
        year: decade,
        totalImages: totalImages,
      });
    });
  },
  loadNextContent(context, { decade, id }) {
    context.commit("loadingState", true);
    let nextPage = store.getters.getNextPageByDecade(decade);
    if (nextPage === undefined) {
      nextPage = 0;
    } else {
      nextPage = nextPage.page;
    }
    if (id !== undefined) {
      dataFetch.getImageById(id).then((result) => {
        context.commit("setNextContext", {
          images: result,
          decade: decade,
        });
      });
    }
    let skipIds = store.getters.getSkipIdsByDecade(decade);
    if (skipIds === undefined) {
      skipIds = { ids: [] };
    }
    dataFetch
      .getImages(decade, nextPage, skipIds.ids)
      .then((result) => {
        if (result.images.length > 0) {
          context.commit("setNextContext", {
            images: result.images,
            decade: decade,
            page: nextPage + 1,
          });
        } else {
          context.commit("loadingState", false);
        }
      })
      .catch((err) => {
        context.commit("loadingState", false);
        console.log(err);
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
              relatedImages.push({ tag: tag, result: result, originalId: id });
            }
          })
        );
      });

    Promise.all(promises).then(() => {
      context.commit("provideRelatedImages", relatedImages);
    });
  },
  removeSecondRelatedInformation(context) {
    context.commit("setSecondRelatedTags", []);
    context.commit("provideSecondRelatedImages", []);
  },
  loadSecondRelatedImages(context, { tags, id, position }) {
    const promises = [];
    const relatedImages = [];
    const selectedTags = [];
    tags
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .forEach((tag) => {
        selectedTags.push(tag);
        promises.push(
          dataFetch.getRelatedImages(tag, id).then((result) => {
            if (result) {
              relatedImages.push({
                tag: tag,
                result: result,
                originalId: id,
                position: position,
              });
            }
          })
        );
      });

    context.commit("setSecondRelatedTags", {position: position, tags: selectedTags});

    Promise.all(promises).then(() => {
      context.commit("provideSecondRelatedImages", {
        id: id,
        images: relatedImages,
      });
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
      lastVisitedIndex: [],
      secondRelatedTags: [],
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
