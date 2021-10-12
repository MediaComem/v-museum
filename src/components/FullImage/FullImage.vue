<template>
  <div class="information-manager" style="margin-left: 12px">
    <el-row>
      <div
        style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
      >
        <img
          src="@/assets/shared/cross.svg"
          @click="backToCanvasView()"
          style="width: 30px; height: 29px"
        />
      </div>
      <div
        style="width: 53px; height: 53px; display: flex; justify-content: center; align-items: center;"
      >
        <infos @click="display = !display" :display="display" />
      </div>
    </el-row>
  </div>

  <div
    v-if="imageData"
    class="information information-padding"
    :style="collapse"
  >
    <el-row style="height: 1;"> </el-row>
    <el-row>
      <h1>
        {{ this.imageData.title }}
      </h1>
    </el-row>
    <el-row>
      <p class="gray-text">Illustrator</p>
    </el-row>
    <el-row>
      <h3>
        {{ this.imageData.author }}
      </h3>
    </el-row>
    <el-row>
      <p class="gray-text">
        Magazine Issue
      </p>
    </el-row>
    <el-row>
      <p>
        {{ this.imageData.medium }}
      </p>
    </el-row>
    <el-row>
      <p class="gray-text">
        Key words
      </p>
    </el-row>
    <el-row>
      <p style="text-align: left">{{ tags.join(", ") }}</p>
    </el-row>
    <el-row v-if="storyCollection">
      <p>{{ currentIndex + 1 }} / {{ storyCollection.length }}</p>
    </el-row>
    <el-row v-if="storyCollection && storyCollection.length > 1">
      <div style="display: flex; cursor: pointer" @click="previousImage()">
        <img class="svg-position" src="@/assets/fullimage/left_arrow.svg" />
        <p>&nbsp; Previous &nbsp;</p>
      </div>
      <p>|</p>
      <div style="display: flex; cursor: pointer" @click="nextImage()">
        <p>&nbsp; Next &nbsp;</p>
        <img class="svg-position" src="@/assets/fullimage/right_arrow.svg" />
      </div>
    </el-row>
    <el-row style="height: auto; padding-bottom: 24px; max-height: 15vh">
      <span>{{ this.imageData.description }}</span>
    </el-row>
  </div>
  <div class="page">
    <div id="viewer" class="viewer"></div>
  </div>
  <div class="page page-image" v-if="displayImage && imageData">
    <img :src="imageData.imagePaths.large" />
  </div>
</template>

<script>
import OpenSeadragon from "openseadragon";

import Infos from "./Infos.vue";
import dataFetching from "../../api/dataFetching";

export default {
  components: { Infos },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.imageId = to.params.index;
      if (to.query.image) {
        vm.imageData = JSON.parse(to.query.image);
        vm.from = from;
      }
    });
  },
  data() {
    return {
      // Previous page URL
      from: undefined,
      // ID of the image, used to search index position of the storyCollection.
      // And to send the identifier of the image in the slider views
      display: true,
      displayImage: true,
      imageId: undefined,
      // Index of the current displayed image
      currentIndex: undefined,
      // Represent the current image displayed with all its information
      imageData: undefined,
      tags: [],
      // All the images related to a story
      storyCollection: undefined,
      // Open sea dragon viewer element
      viewer: undefined,
    };
  },
  methods: {
    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex = this.currentIndex - 1;
      } else {
        this.currentIndex = this.storyCollection.length - 1;
      }
      this.loadImage();
    },
    nextImage() {
      if (this.currentIndex < this.storyCollection.length - 1) {
        this.currentIndex = this.currentIndex + 1;
      } else {
        this.currentIndex = 0;
      }
      this.loadImage();
    },
    loadImage() {
      this.imageData = this.storyCollection[this.currentIndex];
      this.tags = [];
      if (this.imageData.tags) {
        this.imageData.tags.forEach((tag) => this.tags.push(tag["@value"]));
      }
      dataFetching.getOriginalImage(this.imageData.media).then((image) => {
        this.viewer.destroy();
        this.openImage(image);
        this.$store.dispatch("loadTotalImageByDecade", {
          decade: this.imageData.decade.slice(0, 3),
        });
      });
    },
    backToCanvasView() {
      this.$router.push({
        path: `${this.from.fullPath}`,
      });
    },
    loadImagesByTitle() {
      dataFetching
        .getImagesByTitle(this.imageData.title)
        .then((result) => {
          this.storyCollection = result;
          this.currentIndex = this.storyCollection.findIndex((e) => {
            return e.id === this.imageId;
          });
          this.$store.dispatch("loadTotalImageByDecade", {
            decade: this.imageData.decade.slice(0, 3),
          });
        })
        .catch((err) => console.log(err));
    },
    loadMedia() {
      dataFetching.getOriginalImage(this.imageData.media).then((image) => {
        if (this.viewer) {
          this.viewer.destroy();
        }
        this.openImage(image);
        this.$nextTick(() => {
          this.displayImage = false;
        })
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
  computed: {
    collapse() {
      return {
        transform: this.display ? "translateX(0)" : "translate(-70vw)",
        transition: "transform 0.3s ease-in-out",
      };
    },
  },
  mounted() {
    if (this.imageData) {
      if (this.imageData.tags) {
        this.imageData.tags.forEach((tag) => this.tags.push(tag["@value"]));
      }
      this.loadImagesByTitle();
      this.loadMedia();
    } else {
      dataFetching.getImageById(this.imageId).then((result) => {
        this.imageData = result[0];
        this.tags = [];
        if (this.imageData.tags) {
          this.imageData.tags.forEach((tag) => this.tags.push(tag["@value"]));
        }
        if (this.imageData && this.imageData.title) {
          this.loadImagesByTitle();
          this.loadMedia();
        }
      });
    }
  },
  unmounted() {
    if (this.viewer) {
      this.viewer.destroy();
    }
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

.open-information {
  left: 1vw;
  top: 1vh;
  position: relative;
  width: 20px;
  height: 20px;
  z-index: 1;
}

.information-padding {
  padding: 24px;
  padding-top: 130px;
}

.information-manager {
  width: 106px;
  height: 53px;
  z-index: 2;
  position: relative;
  left: 1vw;
  top: 4vh;
  background: white;
}

@media only screen and (min-width: 1200px) {
  .information {
    width: 20vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 0vh;
    background: white;
    overflow: scroll;
  }
}

@media only screen and (min-width: 900px) and (max-width: 1199px) {
  .information {
    width: 30vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 0vh;
    background: white;
    overflow: scroll;
  }
}

@media only screen and (min-width: 700px) and (max-width: 899px) {
  .information {
    width: 40vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 0vh;
    background: white;
    overflow: scroll;
  }
}

@media only screen and (min-width: 300px) and (max-width: 699px) {
  .information {
    width: 50vw;
    z-index: 1;
    position: relative;
    left: 1vw;
    top: 0vh;
    background: white;
    overflow: scroll;
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

.page-image {
  justify-content: center;
  display: flex;
  z-index: -1;
}

.viewer {
  width: 100%;
  height: 100vh;
}

.svg-position {
  margin-bottom: 13px;
}

.gray-text {
  padding: 0;
  color: gray;
}
</style>
