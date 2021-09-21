<template>
  <div v-if="this.imageData" class="information" :style="setHeigth">
    <cross class="information-position" @click="backToCanvasView()" />
    <br />
    <h1 class="information-position" style="top: 5vh">
      {{ this.imageData[0].title }}
    </h1>
    <br />
    <h2 class="information-position" style="top: 10vh">Author</h2>
    <br />
    <h3 class="information-position" style="top: 13vh">
      {{ this.imageData[0].author }}
    </h3>
    <br />
    <p class="information-position" style="top: 17vh">
      {{ this.imageData[0].medium }}
    </p>
    <br />
    <div v-for="(item, index) in collection" :key="index">
      <v-circle
        :left="index * 2 + 'vw'"
        :top="22 + 'vh'"
        :shouldFill="isCurrentImage(item)"
        @click="loadOtherImage(item)"
      />
    </div>
    <br />
    <span class="information-position" style="top: 27vh">{{
      this.imageData[0].description
    }}</span>
  </div>
  <div class="page">
    <div id="viewer" class="viewer"></div>
  </div>
</template>

<script>
import OpenSeadragon from "openseadragon";
import Cross from "./Cross.vue";
import VCircle from "./Circle.vue";

import dataFetching from "../../api/dataFetching";

export default {
  components: { Cross, VCircle },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.imageId = to.params.index;
    });
  },
  data() {
    return {
      imageId: undefined,
      imageData: undefined,
      collection: undefined,
      viewer: undefined,
    };
  },
  methods: {
    isCurrentImage(item) {
      return item.id === this.imageId;
    },
    loadOtherImage(item) {
      this.imageId = item.id;
      this.imageData[0] = item;
      dataFetching.getOriginalImage(this.imageData[0].media).then((image) => {
        this.viewer.open(image);
      });
    },
    backToCanvasView() {
      this.$router.push({
        path: `/selector/${this.imageData[0].decade.slice(0, 3)}`,
        query: { id: this.imageId },
      });
    },
  },
  computed: {
    setHeigth() {
      return {
        height: this.imageData[0].description ? "80vh" : "35vh",
      };
    },
  },
  mounted() {
    dataFetching.getImageById(this.imageId).then((result) => {
      this.imageData = result;
      if (this.imageData.length > 0 && this.imageData[0].title) {
        dataFetching
          .getImageByTitle(this.imageData[0].title)
          .then((result) => {
            this.collection = result;
          })
          .catch((err) => console.log(err));
        dataFetching.getOriginalImage(this.imageData[0].media).then((image) => {
          this.viewer = OpenSeadragon({
            id: "viewer",
            showZoomControl: false,
            showHomeControl: false,
            showFullPageControl: false,
            tiles: [
              {
                scaleFactors: [1, 2, 4, 8, 16, 32],
              },
            ],
            tileSources: {
              type: "image",
              prefixUrl: "/openseadragon/images",
              url: image,
            },
          });
        });
      }
    });
  },
};
</script>

<style scoped>
h1 {
  font-weight: normal;
  font-size: 24px;
  margin: 0;
}

h2 {
  font-weight: normal;
  font-size: 18px;
  color: gray;
  margin: 0;
}

h3 {
  font-weight: normal;
  font-size: 18px;
  margin: 0;
}

p {
  font-weight: normal;
  font-size: 14px;
  margin: 0;
}

span {
  font-weight: normal;
  font-size: 16px;
  margin: 0;
}

.information {
  width: 20vw;
  z-index: 1;
  position: relative;
  left: 1vw;
  top: 5vh;
  background: white;
}

.information-position {
  position: absolute;
  left: 0;
  text-align: left;
}

.page {
  height: 100vh;
  width: 100vw;
  top: 0;
  position: absolute;
}

.viewer {
  width: 100%;
  height: 100vh;
}
</style>
