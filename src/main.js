import { createApp } from "vue";
import { createStore } from "vuex";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";

import dataFetch from "./api/dataFetching";
//import store from "./store/index"

const store = createStore({
  state() {
    return {
      navPrevSize: 0,
      navPrevYear: String,
      navPrevOffset: 1,
      navNextYear: String,
      navNextOffset: 1,
      images: [],
    };
  },
  getters: {
    images: (state) => state.images,
  },
  mutations: {
    setNavPrevSize(state, size) {
      state.navPrevSize = size;
    },
    setPreviousYear(state, year) {
      state.navPrevYear = year;
    },
    setNextYear(state, year) {
      state.navNextYear = year;
    },
    setPreviousOffset(state, offset) {
      state.navPrevOffset = offset;
    },
    setNextOffset(state, offset) {
      state.navNextOffset = offset;
    },
    setupPreviousNavigation(state, response) {
      state.images = response.concat(state.images);
    },
    setupNextNavigation(state, response) {
      state.images = state.images.concat(response);
    },
  },
  actions: {
    // The parameter for the year search will come from the previous selection view.
    // Currently, this value is hard-coded for testing purpose.
    getInitState(context, { year }) {
      context.commit("setPreviousYear", +year - 1);
      context.commit("setNextYear", +year);
      dataFetch
        .findMaxOffsetOfYear(+year - 1)
        .then((result) => {
          let maxOffset = Math.ceil(result.data.length / 100);
          context.commit("setPreviousOffset", maxOffset);
          dataFetch
            .getImages(+year - 1, maxOffset)
            .then((result) => {
              dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
                context.commit("setupPreviousNavigation", result);
                context.commit("setNavPrevSize", result.length);
              });
              context.commit("setPreviousOffset", maxOffset - 1);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      dataFetch
        .getImages(year, context.state.navNextOffset)
        .then((result) => {
          dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
            context.commit("setupNextNavigation", result);
          });
        })
        .catch((err) => console.log(err));
    },
    getNextContent(context) {

    },
  },
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
