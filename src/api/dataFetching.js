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
  async findNbItemsPerDecade(decade) {
    const req = process.env.VUE_APP_FIND_OFFSET + decade;
    const { headers } = await request(req);
    return headers["omeka-s-total-results"];
  },

  async getImages(decade, offset) {
    const req = process.env.VUE_APP_FETCH_BASE + decade + "&page=" + offset;
    const { data } = await request(req);
    return parseImages(data);
  },
};
