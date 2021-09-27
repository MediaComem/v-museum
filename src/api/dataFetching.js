import axios from "axios";

import ImageData from "../models/ImageData";

const parseElement = (element) => {
  let title = element["dcterms:title"];
  let description = element["dcterms:description"] ? element["dcterms:description"][0]["@value"] : null
  if (title) {
    return new ImageData(
      element["dcterms:identifier"][0]["@value"],
      title[0]["@value"],
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:coverage"],
      element["dcterms:created"][0]["@value"],
      element["o:media"][0]["@id"],
      description
    );
  } else {
    return new ImageData(
      element["dcterms:identifier"][0]["@value"],
      null,
      element["dcterms:creator"][0]["@value"],
      element["dcterms:medium"][0]["@value"],
      element["thumbnail_display_urls"],
      element["dcterms:coverage"],
      element["dcterms:created"][0]["@value"],
      element["o:media"][0]["@id"],
      description
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
  async getHeadersByDecade(decade) {
    const params = {
      params: {
        sort_by: "dcterms=identifier",
        sort_order: "asc",
        per_page: 1,
        "property[0][property]": 14,
        "property[0][type]": "ex",
        "property[1][joiner]": "and",
        "property[1][property]": 20,
        "property[1][type]": "in",
        "property[1][text]": decade,
      },
    };
    const { headers } = await axios.get(
      process.env.VUE_APP_FETCH_BASE,
      params
    );
    return headers["omeka-s-total-results"];
  },

  async getImages(decade, offset, skipIds) {
    let queryParameterId = 2;

    const params = {
      params: {
        sort_by: "dcterms=identifier",
        sort_order: "asc",
        per_page: 100,
        "property[0][property]": 14,
        "property[0][type]": "ex",
        "property[1][joiner]": "and",
        "property[1][property]": 20,
        "property[1][type]": "in",
        "property[1][text]": decade,
        page: offset,
      },
    };
    skipIds.forEach((id) => {
      params.params["property[" + queryParameterId + "][joiner]"] = "and";
      params.params["property[" + queryParameterId + "][property]"] = "10";
      params.params["property[" + queryParameterId + "][type]"] = "neq";
      params.params["property[" + queryParameterId + "][text]"] = id;
      queryParameterId = queryParameterId + 1;
    });

    const { headers, data } = await axios.get(
      process.env.VUE_APP_FETCH_BASE,
      params
    );
    return {
      totalImages: headers["omeka-s-total-results"],
      images: parseImages(data),
    };
  },

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

  async getRelatedImages(tag, id) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 14,
        "property[0][type]": "eq",
        "property[0][text]": tag["@value"],
        "property[1][joiner]": "and",
        "property[1][property]": 10,
        "property[1][type]": "neq",
        "property[1][text]": id,
      },
    };

    const { headers } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);

    const totalImages = headers["omeka-s-total-results"];

    params.params["per_page"] = 1;
    params.params["page"] = Math.floor(Math.random() * (totalImages));

    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    if (data.length > 0) {
      return parseElement(data[0]);
    }
    return undefined;
  },

  async getImageByTitle(title) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 1,
        "property[0][type]": "eq",
        "property[0][text]": title,
      }
    };
    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return parseImages(data);
  },

  async getOriginalImage(url) {
    let req;
    if (process.env.NODE_ENV === 'development'){
      req = url.slice(process.env.VUE_APP_URL.length, url.length)
    }
    else {
      req = url;
    }
    const { data } = await axios.get(req);
    return data["o:original_url"];
  }
};
