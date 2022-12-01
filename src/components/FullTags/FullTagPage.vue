<template>
  <Footer v-if="isSafariIphone && imageUrls && data" :nbLoadImages="imageUrls.length" :nbTotalImages="data.length" :isMoreImagesLoading="isMoreImagesLoading" />
  <div class="canvas-size overflow">
    <div v-if="imageUrls.length === 0 && origin != 'tags_slide'" class="loader central-loader-position" />
    <div
      v-if="imageUrls.length === 0  && origin != 'tags_slide'"
      class="rotated-half-circle central-loader-position"
    />
    <div v-if="origin == 'tags_slide'" class="exit-button-wrapper">
      <svg @mouseover="changeButtonColor(true)" @mouseleave="changeButtonColor(false)" @click="$emit('exitFullScreen')"
        class="exit-button" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="exit-full-screen-path"
          d="M11.579 47.4166V36.2541H0.416504V31.2184H16.6147V47.4166H11.579ZM31.2183 47.4166V31.2184H47.4165V36.2541H36.254V47.4166H31.2183ZM0.416504 16.6148V11.5791H11.579V0.416626H16.6147V16.6148H0.416504ZM31.2183 16.6148V0.416626H36.254V11.5791H47.4165V16.6148H31.2183Z"
          fill="white" />
      </svg>
    </div>
    <ul
      v-infinite-scroll="loadMoreImages"
      :infinite-scroll-disabled="disableScroll"
      :infinite-scroll-distance="200"
    >
      <div class="canvas-display-tags-slide" v-if="origin == 'tags_slide'">
        <div v-for="(image, index) in this.images" :key="index">
          <div class="image-canvas">
            <img :src="image.url" @click="loadImage(image.id)" class="image-size clickable" />
          </div>
        </div>
      </div>
      <div v-else class="canvas-display">
        <div v-for="(image, index) in imageUrls" :key="index">
          <div class="image-canvas">
            <img
              :src="image.url"
              @click="loadImage(image.imageId)"
              class="image-size clickable"
            />
          </div>
        </div>
      </div>
    </ul>
  </div>
  <Footer v-if="!isSafariIphone && imageUrls && data" :nbLoadImages="imageUrls.length" :nbTotalImages="data.length" :isMoreImagesLoading="isMoreImagesLoading" />
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

import dataFetch from "../../api/dataFetching";
import Footer from "./Footer.vue";

export default {
  watch: {
    tag: function() {
      this.disableScroll = true;
      this.imageUrls = [];
      this.loadInitialImages();
    },
  },
  components: { Footer },
  emits: ["exitFullScreen"],
  methods: {
    loadImage(imageId) {
      if (this.origin == "tags_slide") {
        dataFetch.getImageById(imageId).then((data) => {
          if (data.length > 0) {
            const img_data = data[0];
            this.$router.push({
              path: `/image/${imageId}`,
              query: { image: JSON.stringify(img_data) },
            });
          }
        });
      } else {
        this.$router.push({
          path: `/canvas`,
          query: {
            imageId: encodeURIComponent(imageId),
            tag: encodeURIComponent(this.tag),
          },
        });
      }
    },
    loadInitialImages() {
      let fileName = this.tag;
      if (fileName.includes("/")) {
        fileName = fileName.replace("/", "");
      }
      axios
        .get(window.location.origin + process.env.VUE_APP_FULLTAG_LINK + fileName + ".json")
        .then((result) => {
          this.data = result.data;
          this.imageUrls = this.data.slice(0, 100);
          this.disableScroll = false;
        });
    },
    loadMoreImages() {
      if (this.imageUrls.length < this.data.length) {
        this.isMoreImagesLoading = true;
        this.imageUrls = this.imageUrls.concat(
          this.data.slice(this.imageUrls.length, this.imageUrls.length + 100)
        );
        this.isMoreImagesLoading = false;
      }
    },
    changeButtonColor(hover) {
      if (hover) {
        document.querySelector('.exit-full-screen-path').setAttribute("fill", "#616161")
      } else {
        document.querySelector('.exit-full-screen-path').setAttribute("fill", "#ffffff")
      }
    },
  },
  props: {
    tag: String,
  },
  data() {
    return {
      data: undefined,
      imageUrls: [],
      disableScroll: true,
      isMoreImagesLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      images: "getImages",
      origin: "getFullTagPageOrigin",
    })
  }
};
</script>

<style scoped>
@import "../shared/pointer.css";
@import "./loader.css";

ul {
  padding: 0;
}

.canvas-size {
  width: 100%;
  flex-grow: 1;
  background: black;
}

.footer-canvas {
  height: 50px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-display {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
}

.canvas-display-tags-slide {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 90vh;
}

@media only screen and (min-width: 300px) and (max-width: 799px) {
  .image-canvas {
    width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-size {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
}

@media only screen and (min-width: 800px) {
  .image-canvas {
    width: 400px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-size {
    width: 300px;
    height: 300px;
    object-fit: contain;
  }
}

.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}

.central-loader-position {
  position: absolute;
  top: 50vh;
  left: 50vw;
}
</style>
