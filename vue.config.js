module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/v-museum" : "/",

  devServer: {
    proxy: {
      "^/api/items": {
        target: "https://v-museum.heig-vd.ch/",  
      },
      "^/api/media": {
        target: "https://v-museum.heig-vd.ch/",
      },
    },
  },
};
