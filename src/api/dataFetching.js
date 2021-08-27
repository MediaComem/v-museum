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
      element["dcterms:subject"],
      element["dcterms:created"][0]["@value"]
    );
  } else {
    return new ImageData(
      element["dcterms:identifier"][0]["@value"],
      null,
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:subject"],
      element["dcterms:created"][0]["@value"]
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
  async getImages(decade, offset, skipIds) {
    let queryParameterId = 2;
    let req = process.env.VUE_APP_FETCH_BASE + decade + "&page=" + offset;
    skipIds.forEach((id) => {
      req =
        req +
        process.env.VUE_APP_ADD_IDENT_REMOVER_PART_1 +
        queryParameterId +
        process.env.VUE_APP_ADD_IDENT_REMOVER_PART_2 +
        queryParameterId +
        process.env.VUE_APP_ADD_IDENT_REMOVER_PART_3 +
        queryParameterId +
        process.env.VUE_APP_ADD_IDENT_REMOVER_PART_4 +
        queryParameterId +
        process.env.VUE_APP_ADD_IDENT_REMOVER_PART_5 +
        id;
      queryParameterId = queryParameterId + 1;
    });
    const { headers, data } = await request(req);
    return {
      totalImages: headers["omeka-s-total-results"],
      images: parseImages(data),
    };
  },

  async getImageById(id) {
    const req = process.env.VUE_APP_SEARCH_BY_ID + id;
    const { data } = await request(req);
    return parseImages(data);
  },

  async getRelatedImages(tag, id) {
    const searchNbItems =
      process.env.VUE_APP_SEARCH_BY_TAG +
      tag["@value"] +
      process.env.VUE_APP_REMOVE_ID_FROM_SEARCH +
      id;
    const { headers } = await request(searchNbItems);
    const req =
      process.env.VUE_APP_SEARCH_BY_TAG +
      tag["@value"] +
      process.env.VUE_APP_REMOVE_ID_FROM_SEARCH +
      id +
      "&per_page=" +
      headers["omeka-s-total-results"];
    const { data } = await request(req);
    if (data.length > 0) {
      return parseElement(data[Math.floor(Math.random() * data.length)]);
    }
    return undefined;
  },
};
