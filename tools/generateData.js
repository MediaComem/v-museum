// At the end of the processing, you must:
// 1) add the { char at the beginning of the file
// 2) Replace all occurencies of },] by }]
// 3) Remove the latest , and replace it by }

const fs = require("fs");

const axios = require("axios");

const VUE_APP_FETCH_BASE = "https://v-museum.heig-vd.ch/api/items?";

const parseElement = (element) => {
  return {
    id: element["dcterms:identifier"][0]["@value"],
    decade: element["dcterms:created"][0]["@value"],
    tags: element["dcterms:coverage"],
  };
};

const parseImages = (data) => {
  const images = [];
  data.forEach((element) => {
    images.push(parseElement(element));
  });
  return images;
};

const getFullSize = async () => {
  try {
    const { headers } = await axios.get(VUE_APP_FETCH_BASE);
    return headers["omeka-s-total-results"];
  } catch (e) {
    console.log(e);
  }
};

const getImage = async (currentPage) => {
  const params = {
    params: {
      sort_by: "dcterms=identifier",
      sort_order: "asc",
      per_page: 1,
      "property[0][property]": 14,
      "property[0][type]": "ex",
      page: currentPage,
    },
  };
  try {
    const { data } = await axios.get(VUE_APP_FETCH_BASE, params);
    return {
      images: parseImages(data),
    };
  } catch (e) {
    console.log(e);
  }
};

const getRelatedImageInformation = async (tag, currentImageId) => {
  const params = {
    params: {
      "property[0][property]": 14,
      "property[0][type]": "eq",
      "property[0][text]": tag,
      "property[1][joiner]": "and",
      "property[1][property]": 10,
      "property[1][type]": "neq",
      "property[1][text]": currentImageId,
      per_page: 1,
    },
  };
  try {
    const { headers } = await axios.get(VUE_APP_FETCH_BASE, params);
    const nbPage = headers["omeka-s-total-results"];
    const selectedPage = Math.floor(Math.random() * nbPage);
    params.params["page"] = selectedPage;
    try {
      const { data } = await axios.get(VUE_APP_FETCH_BASE, params);
      let result = {};
      data.forEach((e) => {
        result = { id: e["dcterms:identifier"][0]["@value"], tag: tag };
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};

const load = async () => {
  try {
    const totalImages = await getFullSize();
    let relatedImages = [];

    for (let i = 1; i <= totalImages; i++) {
      console.log(i);
      relatedImages = [];
      const data = await getImage(i);
      const id = data.images[0].id;
      const relatedTags = data.images[0].tags
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      let element = await getRelatedImageInformation(
        relatedTags[0]['@value'],
        id
      );
      relatedImages.push(element);
      element = await getRelatedImageInformation(
        relatedTags[1]['@value'],
        id
      );
      relatedImages.push(element);
      element = await getRelatedImageInformation(
        relatedTags[2]['@value'],
        id
      );
      relatedImages.push(element);
      let json = `"${id}": [`;
      relatedImages.forEach((value) => {
        if (value) {
          json = json + '{"imageId": ' + value.id + ', "tag": "' + value.tag + '"},';
        }
      });
      json = json + "],";
      fs.appendFileSync("process.json", json);
    }
  } catch (e) {
    console.log(e);
  }
};

load();
