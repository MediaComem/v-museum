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

const parseImagesByTag = (data) => {
  const images = [];
  data.forEach((element) => {
    images.push({id: element["dcterms:identifier"][0]["@value"], url: element["thumbnail_display_urls"]["square"]})
  })
  return images;
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
    const { headers } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return headers["omeka-s-total-results"];
  },

  async getImages(decade, offset, skipIds) {
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
    const { headers, data } = await axios.get(
      process.env.VUE_APP_FETCH_BASE,
      params
    );

    let dataResult = parseImages(data);

    skipIds.forEach((id) => {
      let result = dataResult.filter(d => d.id !== id);
      dataResult = result;
    });

    return {
      totalImages: headers["omeka-s-total-results"],
      images: dataResult,
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

  // Voir si en utilisant le full text search avec l'id c'est mieux
  async getRelatedImages(tag, id) {
    const params = {
      params: {
        fulltext_search: `"${tag["@value"]}"`,
        per_page: 1000
      },
    };

    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    if (data.length > 1) {
      // take random image among 1000 with same tag
      let idx = Math.floor(Math.random() * data.length);
      let image = parseElement(data[idx]);
      if (image.id !== id) {
        return image
      }
      // bad luck we pick the current one, let's take next one
      idx = (idx+1 % data.length);
      return parseElement(data[idx]);
    }
    return undefined;
  },

  async getNbPagePerTag(tag) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 14,
        "property[0][type]": "eq",
        "property[0][text]": tag,
      }
    }
    const { headers } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return headers["omeka-s-total-results"];
  },

  async getImagesByTag(tag, step) {
    const params = {
      params: {
        "property[0][joiner]": "and",
        "property[0][property]": 14,
        "property[0][type]": "eq",
        "property[0][text]": tag,
        page: step
      }
    }
    const { data } = await axios.get(process.env.VUE_APP_FETCH_BASE, params);
    return parseImagesByTag(data);
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
