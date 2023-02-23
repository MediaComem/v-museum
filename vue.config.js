module.exports = {

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ] 
    }
  },

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
