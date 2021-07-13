import axios from "axios";

import Data from "../models/Data";

const request = async (url) => {
  return axios.get(url);
};

export default {
  async findMaxOffsetOfYear(year) {
    const req =
      "api/items?property%5B0%5D%5Bproperty%5D=3&property%5B0%5D%5Btype%5D=ex&property%5B1%5D%5Bjoiner%5D=and&property%5B1%5D%5Bproperty%5D=20&property%5B1%5D%5Btype%5D=in&property%5B1%5D%5Btext%5D=" +
      year +
      "&per_page=1000000";
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
    const req =
      "api/items?per_page=100&property%5B0%5D%5Bproperty%5D=3&property%5B0%5D%5Btype%5D=ex&property%5B1%5D%5Bjoiner%5D=and&property%5B1%5D%5Bproperty%5D=20&property%5B1%5D%5Btype%5D=in&property%5B1%5D%5Btext%5D=" +
      year +
      "&page=";
    return request(req + offset);
  },
};
