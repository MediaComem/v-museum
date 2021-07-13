import axios from "axios";

import Data from "../models/Data";

const request = async (url) => {
  return axios.get(url);
};

export default {
  async findMaxOffsetOfYear(year) {
    const req = process.env.VUE_APP_FIND_OFFSET + year;
    return request(req);
  },

  async extractDataFromDb(data) {
    const images = [];

    data.forEach((element) => {
      let title = element["dcterms:title"];
      if (title) {
        images.push(
          new Data(
            element["o:id"],
            title[0]["@value"],
            element["thumbnail_display_urls"],
            element["dcterms:subject"]
          )
        );
      } else {
        images.push(
          new Data(
            element["o:id"],
            null,
            element["thumbnail_display_urls"],
            element["dcterms:subject"]
          )
        );
      }
    });
    return images;
  },

  async getImages(year, offset) {
    const req = process.env.VUE_APP_FETCH_BASE + year + "&page=";
    return request(req + offset);
  },
};
