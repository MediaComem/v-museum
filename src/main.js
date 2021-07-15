import { createApp } from "vue";
import { createStore } from "vuex";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";

export const mutations = {
  setPastContext(state, payload) {
    state.images = payload.images.concat(state.images);
    state.nbItemsLoadInThePast = payload.images.length;
    state.previousPageOffset = payload.page;
    state.isLoadingImage = false;
  },
  setNextContext(state, payload) {
    state.images = state.images.concat(payload.images);
    state.nextPageOffset = payload.page;
    state.isLoadingImage = false;
  },
  setPreviousDecade(state, decade) {
    state.previousDecade = decade;
  },
  setNextDecade(state, decade) {
    state.nextDecade = decade;
  },
  setPreviousPageOffset(state, pageOffset) {
    state.previousPageOffset = pageOffset;
  },
  loadingState(state) {
    state.isLoadingImage = true;
  }
};

const nbImageDataPerPage = process.env.VUE_APP_NB_ITEM_PER_PAGE;

export const actions = {
  initializeCarousel(context, { decade }) {
    context.commit("setPreviousDecade", +decade - 1);
    context.commit("setNextDecade", decade);
    dataFetch
      .findNbItemsPerDecade(+decade - 1)
      .then((nbItems) => {
        let nbPages = Math.ceil(nbItems.length / nbImageDataPerPage);
        context.commit("setPreviousPageOffset", nbPages);
        dataFetch
          .getImages(+decade - 1, nbPages)
          .then((images) => {
            context.commit("setPastContext", {
              images: images,
              page: nbPages - 1,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

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
  loadPreviousContent(context) {
    context.commit("loadingState");
    if (context.state.previousPageOffset === 0) {
      dataFetch
        .findNbItemsPerDecade(+context.state.previousDecade - 1)
        .then((nbItems) => {
          let nbPages = Math.ceil(nbItems.length / nbImageDataPerPage);
          context.commit("setPreviousPageOffset", nbPages);
          dataFetch
            .getImages(+context.state.previousDecade - 1, nbPages)
            .then((images) => {
              context.commit("setPastContext", {
                images: images,
                page: nbPages - 1,
              });
              context.commit(
                "setPreviousDecade",
                +context.state.previousDecade - 1
              );
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      dataFetch
        .getImages(
          context.state.previousDecade,
          context.state.previousPageOffset
        )
        .then((images) => {
          context.commit("setPastContext", {
            images: images,
            page: context.state.previousPageOffset - 1,
          });
        });
    }
  },
  loadNextContent(context) {
    context.commit("loadingState");
    dataFetch
      .getImages(context.state.nextDecade, context.state.nextPageOffset)
      .then((images) => {
        if (images.length === 0) {
          dataFetch
            .getImages(+context.state.nextDecade + 1, 1)
            .then((images) => {
              context.commit("setNextContext", {
                images: images,
                page: 2,
              });
              context.commit("setNextDecade", +context.state.nextDecade + 1);
            });
        } else {
          context.commit("setNextContext", {
            images: images,
            page: context.state.nextPageOffset + 1,
          });
        }
      });
  },
};

const store = createStore({
  state() {
    return {
      isLoadingImage: false,
      nbItemsLoadInThePast: 0,
      previousDecade: 0,
      previousPageOffset: 1,
      nextDecade: 0,
      nextPageOffset: 1,
      images: [],
    };
  },
  mutations: mutations,
  actions: actions,
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
