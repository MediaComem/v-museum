import axios from "axios";

import ImageData from "../models/ImageData";

const request = async (url) => {
  return axios.get(url);
};

const parseElement = (element) => {
  let title = element["dcterms:title"];
  if (title) {
    return new ImageData(
      element["dcterms:identifier"][0]["@value"],
      title[0]["@value"],
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:subject"]
    );
  } else {
    return new ImageData(
      element["dcterms:identifier"][0]["@value"],
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

  async getRelatedImages(tag, id) {
    const searchNbItems = process.env.VUE_APP_SEARCH_BY_TAG + tag["@value"] + process.env.VUE_APP_REMOVE_ID_FROM_SEARCH + id;
    const { headers } = await request(searchNbItems);
    const req = process.env.VUE_APP_SEARCH_BY_TAG + tag["@value"] + process.env.VUE_APP_REMOVE_ID_FROM_SEARCH + id + "&per_page=" + headers["omeka-s-total-results"];
    const { data } = await request(req);
    if (data.length > 0) {
      return parseElement(data[Math.floor(Math.random() * data.length)]);
    }
    return undefined;
  },
};
