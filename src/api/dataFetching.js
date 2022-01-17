import axios from "axios";

import ImageData from "../models/ImageData";

const parseElement = (element) => {
  let title = element["dcterms:title"];
  let description = element["dcterms:description"]
    ? element["dcterms:description"][0]["@value"]
    : null;
  return new ImageData(
    element["dcterms:identifier"][0]["@value"],
    title ? title[0]["@value"] : null,
    element["dcterms:creator"][0]["@value"],
    element["dcterms:medium"][0]["@value"],
    element["thumbnail_display_urls"],
    element["dcterms:coverage"],
    element["dcterms:created"][0]["@value"],
    element["o:media"][0]["@id"],
    description
  );
};

const parseImages = (data) => {
  const images = [];
  data.forEach((element) => {
    images.push(parseElement(element));
  });
  return images;
};

export default {
  async getImageById(id) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 10,
        "property[0][type]": "eq",
        "property[0][text]": id,
      },
    };
    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return parseImages(data);
  },

  async getImagesByTitle(title) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 1,
        "property[0][type]": "eq",
        "property[0][text]": title,
      },
    };
    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return parseImages(data);
  },

  async getOriginalImage(url) {
    let req;
    if (process.env.NODE_ENV === "development") {
      req = url.slice(process.env.VUE_APP_URL.length, url.length);
    } else {
      req = url;
    }
    const { data } = await axios.get(req);
    return data["o:original_url"];
  },
};
