import axios from "axios";

import ImageData from "../models/ImageData";

const request = async (url) => {
  return axios.get(url);
};

const parseElement = (element) => {
  let title = element["dcterms:title"];
  if (title) {
    return new ImageData(
      element["o:id"],
      title[0]["@value"],
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:subject"]
    );
  } else {
    return new ImageData(
      element["o:id"],
      null,
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:subject"]
    );
  }
};

const parseImages = (data) => {
  const images = [];
  data.forEach((element) => {
    images.push(parseElement(element));
  });
  return images;
};

export default {
  async getImages(decade, offset) {
    const req = process.env.VUE_APP_FETCH_BASE + decade + "&page=" + offset;
    const { data } = await request(req);
    return parseImages(data);
  },

  async getRelatedImages(tag) {
    const req = process.env.VUE_APP_SEARCH_BY_TAG + tag["@value"];
    const { data } = await request(req);
    if (data.length > 0) {
      return parseElement(data[Math.floor(Math.random() * data.length)]);
    }
    return undefined;
  },
};
