import axios from "axios";

import ImageData from "../models/ImageData";

const request = async (url) => {
  return axios.get(url);
};

const parseImages = (data) => {
  const images = [];

  data.forEach((element) => {
    let title = element["dcterms:title"];
    if (title) {
      images.push(
        new ImageData(
          element["o:id"],
          title[0]["@value"],
          element["thumbnail_display_urls"],
          element["dcterms:subject"]
        )
      );
    } else {
      images.push(
        new ImageData(
          element["o:id"],
          null,
          element["thumbnail_display_urls"],
          element["dcterms:subject"]
        )
      );
    }
  });
  return images;
};

export default {
  async findMaxOffsetOfYear(year) {
    const req = process.env.VUE_APP_FIND_OFFSET + year;
    return request(req);
  },
  async getImages(year, offset) {
    const req = process.env.VUE_APP_FETCH_BASE + year + "&page=";
    return request(req + offset).then((result) => {
      return parseImages(result.data);
    });
  },
};
