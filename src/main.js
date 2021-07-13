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
    setPreviousNavigation(state, response) {
      state.images = response.concat(state.images);
    },
    setNextNavigation(state, response) {
      state.images = state.images.concat(response);
    },
  },
  actions: {
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
                context.commit("setPreviousNavigation", result);
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
            context.commit("setNextNavigation", result);
            context.commit("setNextOffset", 2);
          });
        })
        .catch((err) => console.log(err));
    },
    getPreviousContent(context) {
      if (context.state.navPrevOffset === 0) {
        dataFetch
        .findMaxOffsetOfYear(+context.state.navPrevYear - 1)
        .then((result) => {
          let maxOffset = Math.ceil(result.data.length / 100);
          context.commit("setPreviousOffset", maxOffset);
          dataFetch
            .getImages(+context.state.navPrevYear - 1, maxOffset)
            .then((result) => {
              dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
                context.commit("setPreviousNavigation", result);
                context.commit("setNavPrevSize", result.length);
                context.commit("setPreviousYear", +context.state.navPrevYear - 1)
              });
              context.commit("setPreviousOffset", maxOffset - 1);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));

      } else {
        dataFetch
          .getImages(context.state.navPrevYear, context.state.navPrevOffset)
          .then((result) => {
            dataFetch.extractDataFromDb(result.data.flat()).then((result) => {
              context.commit("setPreviousNavigation", result);
              context.commit("setNavPrevSize", result.length);
              context.commit("setPreviousOffset", context.state.navPrevOffset - 1);
            });
          });
      }
    },
    getNextContent(context) {
      dataFetch
        .getImages(context.state.navNextYear, context.state.navNextOffset)
        .then((result) => {
          console.log(result.data.length);
          if (result.data.length === 0) {
            dataFetch
              .getImages(+context.state.navNextYear + 1, 1)
              .then((result) => {
                console.log(result);
                dataFetch
                  .extractDataFromDb(result.data.flat())
                  .then((result) => {
                    context.commit("setNextNavigation", result);
                    context.commit(
                      "setNextYear",
                      +context.state.navNextYear + 1
                    );
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
  },
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
