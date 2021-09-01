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
    let req =
      process.env.VUE_APP_FETCH_BASE +
      "sort_by=dcterms%3Aidentifier&sort_order=asc&per_page=100&property%5B0%5D%5Bproperty%5D=3&property%5B0%5D%5Btype%5D=ex&property%5B1%5D%5Bjoiner%5D=and&property%5B1%5D%5Bproperty%5D=20&property%5B1%5D%5Btype%5D=in&property%5B1%5D%5Btext%5D=" +
      decade +
      "&page=" +
      offset;
    skipIds.forEach((id) => {
      req =
        req +
        "&property%5B" +
        queryParameterId +
        "%5D%5Bjoiner%5D=and&property%5B" +
        queryParameterId +
        "%5D%5Bproperty%5D=10&property%5B" +
        queryParameterId +
        "%5D%5Btype%5D=neq&property%5B" +
        queryParameterId +
        "%5D%5Btext%5D=" +
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
    const req =
      process.env.VUE_APP_FETCH_BASE +
      "property%5B0%5D%5Bjoiner%5D=and&property%5B0%5D%5Bproperty%5D=10&property%5B0%5D%5Btype%5D=eq&property%5B0%5D%5Btext%5D=" +
      id;
    const { data } = await request(req);
    return parseImages(data);
  },

  async getRelatedImages(tag, id) {
    const searchNbItems =
      process.env.VUE_APP_FETCH_BASE +
      "property%5B0%5D%5Bjoiner%5D=and&property%5B0%5D%5Bproperty%5D=3&property%5B0%5D%5Btype%5D=eq&property%5B0%5D%5Btext%5D=" +
      tag["@value"] +
      "&property%5B1%5D%5Bjoiner%5D=and&property%5B1%5D%5Bproperty%5D=10&property%5B1%5D%5Btype%5D=neq&property%5B1%5D%5Btext%5D=" +
      id;
    const { headers } = await request(searchNbItems);
    const req =
      process.env.VUE_APP_FETCH_BASE +
      "property%5B0%5D%5Bjoiner%5D=and&property%5B0%5D%5Bproperty%5D=3&property%5B0%5D%5Btype%5D=eq&property%5B0%5D%5Btext%5D=" +
      tag["@value"] +
      "&property%5B1%5D%5Bjoiner%5D=and&property%5B1%5D%5Bproperty%5D=10&property%5B1%5D%5Btype%5D=neq&property%5B1%5D%5Btext%5D=" +
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
