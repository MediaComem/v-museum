import { createApp } from "vue";
import { createStore } from "vuex";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";

export const mutations = {
  setNavPrevSize(state, size) {
    state.navPrevSize = size;
  },
  setPrevDecade(state, year) {
    state.navPrevDecade = year;
  },
  setNextDecade(state, year) {
    state.navNextDecade = year;
  },
  setPreviousOffset(state, offset) {
    state.navPrevOffset = offset;
  },
  setNextOffset(state, offset) {
    state.navNextOffset = offset;
  },
  setPrevNavigation(state, response) {
    state.images = response.concat(state.images);
  },
  setNextNavigation(state, response) {
    state.images = state.images.concat(response);
  },
};

export const actions = {
  getInitState(context, { decade }) {
    context.commit("setPrevDecade", +decade - 1);
    context.commit("setNextDecade", +decade);
    dataFetch
      .findMaxOffsetOfYear(+decade - 1)
      .then((result) => {
        let maxOffset = Math.ceil(result.data.length / 100);
        context.commit("setPreviousOffset", maxOffset);
        dataFetch
          .getImages(+decade - 1, maxOffset)
          .then((result) => {
            dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
              context.commit("setPrevNavigation", result);
              context.commit("setNavPrevSize", result.length);
            });
            context.commit("setPreviousOffset", maxOffset - 1);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    dataFetch
      .getImages(decade, context.state.navNextOffset)
      .then((result) => {
        dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
          context.commit("setNextNavigation", result);
          context.commit("setNextOffset", 2);
        });
      })
      .catch((err) => console.log(err));
  },
  getPreviousContent(context) {
    if (context.state.navPrevOffset === 0) {
      dataFetch
        .findMaxOffsetOfYear(+context.state.navPrevDecade - 1)
        .then((result) => {
          let maxOffset = Math.ceil(result.data.length / 100);
          context.commit("setPreviousOffset", maxOffset);
          dataFetch
            .getImages(+context.state.navPrevDecade - 1, maxOffset)
            .then((result) => {
              dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
                context.commit("setPrevNavigation", result);
                context.commit("setNavPrevSize", result.length);
                context.commit(
                  "setPrevDecade",
                  +context.state.navPrevDecade - 1
                );
              });
              context.commit("setPreviousOffset", maxOffset - 1);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      dataFetch
        .getImages(context.state.navPrevDecade, context.state.navPrevOffset)
        .then((result) => {
          dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
            context.commit("setPrevNavigation", result);
            context.commit("setNavPrevSize", result.length);
            context.commit(
              "setPreviousOffset",
              context.state.navPrevOffset - 1
            );
          });
        });
    }
  },
  getNextContent(context) {
    dataFetch
      .getImages(context.state.navNextDecade, context.state.navNextOffset)
      .then((result) => {
        if (result.data.length === 0) {
          dataFetch
            .getImages(+context.state.navNextDecade + 1, 1)
            .then((result) => {
              dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
                context.commit("setNextNavigation", result);
                context.commit("setNextDecade", +context.state.navNextDecade + 1);
                context.commit("setNextOffset", 2);
              });
            });
        } else {
          dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
            context.commit("setNextNavigation", result);
            context.commit("setNextOffset", context.state.navNextOffset + 1);
          });
        }
      });
  },
};

const store = createStore({
  state() {
    return {
      navPrevSize: 0,
      navPrevDecade: String,
      navPrevOffset: 1,
      navNextDecade: String,
      navNextOffset: 1,
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
