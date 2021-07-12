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
      navPrevYear: String,
      navPrevOffset: 0,
      navNextYear: String,
      navNextOffset: 0,
      data: [],
    };
  },
  getters: {
    data: (state) => state.data,
  },
  mutations: {
    setupInitialState(state, response) {
      state.data = response;
    },
  },
  actions: {
    getInitState(context) {
      dataFetch
        .getImages("193", 0)
        .then((result) => {
          let midRes = result.data;
          if (midRes.length > 0) {
            dataFetch.extractDataFromDb(midRes.flat()).then((result) => {
              context.commit("setupInitialState", result);
            });
          } else {
            context.commit("setupInitialState", []);
          }
        })
        .catch((err) => console.log(err));
    },
  },
});

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
