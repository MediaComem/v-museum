<template>
  <div v-if="this.imageData" class="information">
    <el-row>
      <cross @click="backToCanvasView()" />
    </el-row>
    <el-row>
      <h1>
        {{ this.imageData[0].title }}
      </h1>
    </el-row>
    <el-row>
      <h2>Author</h2>
    </el-row>
    <el-row>
      <h3>
        {{ this.imageData[0].author }}
      </h3>
    </el-row>
    <el-row>
      <p>
        {{ this.imageData[0].medium }}
      </p>
    </el-row>
    <el-row v-if="collection">
      <p>{{ currentImage + 1 }} / {{ collection.length }}</p>
    </el-row>
    <el-row>
      <div style="display: flex; cursor: pointer" @click="previousImage()">
        <arrow-left />
        <p>&nbsp; Previous &nbsp;</p>
      </div>
      <p>|</p>
      <div style="display: flex; cursor: pointer" @click="nextImage()">
        <p>&nbsp; Next &nbsp;</p>
        <arrow-right />
      </div>
    </el-row>
    <el-row>
      <span>{{ this.imageData[0].description }}</span>
    </el-row>
  </div>
  <div class="page">
    <div id="viewer" class="viewer"></div>
  </div>
</template>

<script>
import OpenSeadragon from "openseadragon";
import Cross from "./Cross.vue";
import ArrowLeft from "./ArrowLeft.vue";
import ArrowRight from "./ArrowRight.vue";

import dataFetching from "../../api/dataFetching";

export default {
  components: { Cross, ArrowLeft, ArrowRight },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.imageId = to.params.index;
    });
  },
  data() {
    return {
      imageId: undefined,
      currentImage: undefined,
      imageData: undefined,
      collection: undefined,
      viewer: undefined,
    };
  },
  methods: {
    previousImage() {
      if (this.currentImage > 0) {
        this.currentImage = this.currentImage - 1;
        this.imageData[0] = this.collection[this.currentImage];
        this.imageId = this.imageData[0].id;
        dataFetching.getOriginalImage(this.imageData[0].media).then((image) => {
          this.viewer.destroy();
          this.openImage(image);
          this.$store.dispatch("loadTotalImageByDecade", {
            decade: this.imageData[0].decade.slice(0, 3),
          });
        });
      }
    },
    nextImage() {
      if (this.currentImage < this.collection.length - 1) {
        this.currentImage = this.currentImage + 1;
        this.imageData[0] = this.collection[this.currentImage];
        this.imageId = this.imageData[0].id;
        dataFetching.getOriginalImage(this.imageData[0].media).then((image) => {
          this.viewer.destroy();
          this.openImage(image);
          this.$store.dispatch("loadTotalImageByDecade", {
            decade: this.imageData[0].decade.slice(0, 3),
          });
        });
      }
    },
    backToCanvasView() {
      this.$router.push({
        path: `/selector/${this.imageData[0].decade.slice(0, 3)}`,
        query: { id: this.imageId },
      });
    },

    openImage(image) {
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
            this.currentImage = this.collection.findIndex((e) => {
              return e.id === this.imageId;
            });
            this.$store.dispatch("loadTotalImageByDecade", {
              decade: this.imageData[0].decade.slice(0, 3),
            });
          })
          .catch((err) => console.log(err));
        dataFetching.getOriginalImage(this.imageData[0].media).then((image) => {
          this.openImage(image);
        });
      }
    });
  },
  unmounted() {
    this.viewer.destroy();
  },
};
</script>

<style scoped>
h1 {
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  padding-bottom: 1vh;
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
  padding-bottom: 1vh;
}

p {
  font-weight: normal;
  font-size: 14px;
  margin: 0;
  padding-bottom: 1vh;
}

span {
  font-weight: normal;
  font-size: 16px;
  margin: 0;
}

@media only screen and (min-width: 1200px) {
  .information {
    width: 20vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 5vh;
    background: white;
  }
}

@media only screen and (min-width: 900px) and (max-width: 1199px) {
  .information {
    width: 30vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 5vh;
    background: white;
  }
}

@media only screen and (min-width: 700px) and (max-width: 899px) {
  .information {
    width: 40vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 5vh;
    background: white;
  }
}

@media only screen and (min-width: 300px) and (max-width: 699px) {
  .information {
    width: 50vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 5vh;
    background: white;
  }
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
