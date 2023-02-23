import { defineStore } from 'pinia';
import dataFetch from "./api/dataFetching";
import images from "./assets/data/images.json";

export default defineStore('store', {
  state: () => {
    return {
      history: [],
      fullHistory: false,
      tags: [''],
      images: images,
      full_tag_page_origin: '',
      imagesWithNbTags: [],
    };
  },

  persist: {
    storage: localStorage,
    paths: ['history'],
  },

  getters: {
    getFullHistoryMode: (state) => {
      return state.fullHistory;
    },
    getHistory: (state) => {
      return state.history;
    },
    getTags: (state) => {
      return state.tags;
    },
    getImages: (state) => {
      return state.images;
    },
    getFullTagPageOrigin: (state) => {
      return state.full_tag_page_origin;
    },
    getImagesWithNbTags: (state) => {
      return state.imagesWithNbTags;
    },
  },

  actions: {
    updateFullHistory(payload) {
      this.fullHistory = payload.isOpen;
    },
    insertHistory(payload) {
      dataFetch.getImageById(payload.imageId).then((data) => {
        if (data.length > 0) {
          const isExist = this.history.find(
            (e) => e.imageId === payload.imageId
          );
          if (isExist === undefined) {
            if (this.history.length === 100) {
              this.history.shift();
            }
            this.history.push({
              imageId: payload.imageId,
              data: data[0].imagePaths.square,
              tag: payload.tag,
            });
          }
        }
      });
    },
    insertTag(tag) {
      this.tags.push(tag);
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    setImages(images) {
      this.images = images;
    },
    setFullTagPageOrigin(origin) {
      this.full_tag_page_origin = origin;
    },
    setImagesWithNbTags(images) {
      this.imagesWithNbTags = images;
    },
  },
});
