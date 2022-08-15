<template>
  <div style="height: 100vh; width: 100vw" @touchstart="disableZoom" @gesturestart="disableZoomGesture">
    <div class="information-manager" style="margin-left: 12px">
      <el-row>
        <page-manager @changeDisplay="display = !display" :display="display" :from="from"/>
      </el-row>
    </div>

    <div
      v-if="imageData"
      class="information information-padding hide-scrollbar"
      :style="collapse"
    >
      <data-information ref="information" @loadImage="loadImage" :imageData="imageData" :tags="tags" :storyCollection="storyCollection"/>
    </div>
    <div class="page">
      <div id="viewer" class="viewer" @canvasDoubleClick="doubleClick"></div>
    </div>
    <div v-if="displayImage && imageData">
      <img class="page page-image" :src="imageData.imagePaths.large" />
    </div>
  </div>
  
</template>

<script>
import OpenSeadragon from "openseadragon";
import { useWindowSize } from "vue-window-size";

import PageManager from "./Manager/PageManager.vue";
import DataInformation from "./DataInformation/DataInformation.vue";
import dataFetching from "../../api/dataFetching";

export default {
  components: { PageManager, DataInformation },
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
      windowWidth: undefined,
      // Previous page URL
      from: undefined,
      // ID of the image, used to search index position of the storyCollection.
      // And to send the identifier of the image in the slider views
      display: true,
      displayImage: true,
      imageId: undefined,
      // Represent the current image displayed with all its information
      imageData: undefined,
      tags: [],
      // All the images related to a story
      storyCollection: undefined,
      // Open sea dragon viewer element
      viewer: undefined,
      shouldZoom: true,
    };
  },
  methods: {
    click(event) {
      event.preventDefaultAction = true;
    },
    doubleClick(event) {
      event.preventDefaultAction = true;
      if (this.shouldZoom) {
        this.viewer.viewport.zoomBy(2);
      } else {
        this.viewer.viewport.zoomBy(0.5);
      }
      this.shouldZoom = !this.shouldZoom;
    },
    disableZoom(event) {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    },
    disableZoomGesture(event){
      console.log(event);
      event.preventDefault();
    },
    loadImage(index) {
      this.imageData = this.storyCollection[index];
      this.tags = [];
      if (this.imageData.tags) {
        this.imageData.tags.forEach((tag) => this.tags.push(tag["@value"]));
      }
      dataFetching.getOriginalImage(this.imageData.media).then((image) => {
        this.viewer.destroy();
        this.openImage(image);
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
          if (this.currentIndex === -1) {
            this.storyCollection.push(this.imageData);
            this.currentIndex = this.storyCollection.findIndex((e) => {
              return e.id === this.imageId;
            });
          }
          this.$refs.information.setupCurrentIndex(this.currentIndex);
        })
        .catch((err) => console.log(err));
    },
    loadMedia() {
      dataFetching.getOriginalImage(this.imageData.media).then((image) => {
        if (this.viewer) {
          this.viewer.destroy();
        }
        this.openImage(image);
      });
    },
    openImage(image) {
      this.viewer = OpenSeadragon({
        id: "viewer",
        autoresize: false,
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        preserveImageSizeOnResize: false,
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

      // Close the png only when an action is done on openseadragon.
      this.viewer.addHandler('viewport-change', function() {
        this.userData.displayImage = false;
      }, this);

      this.viewer.addHandler('canvas-click', this.click, this);
      this.viewer.addHandler('canvas-double-click', this.doubleClick, this);
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
  activated() {
    const { width } = useWindowSize();
    this.windowWidth = width;
    this.tags = [];
    this.storyCollection = undefined;
    this.currentIndex = undefined;
    this.displayImage = true;
    if (this.windowWidth <= 800) {
      this.display = false;
    } else {
      this.display = true;
    }
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
  deactivated() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  },
};
</script>
<style>
.information-padding {
  padding: 24px;
  padding-top: 130px;
}

@media only screen and (min-height: 1200px) {
  .information-manager {
    width: 106px;
    height: 53px;
    z-index: 2;
    position: relative;
    left: 8px;
    top: 20px;
    background: white;
  }
}

@media only screen and (min-height: 900px) and (max-height: 1199px) {
  .information-manager {
    width: 106px;
    height: 53px;
    z-index: 2;
    position: relative;
    left: 8px;
    top: 20px;
    background: white;
  }
}

@media only screen and (min-height: 700px) and (max-height: 899px) {
  .information-manager {
    width: 106px;
    height: 53px;
    z-index: 2;
    position: relative;
    left: 8px;
    top: 20px;
    background: white;
  }
}

@media only screen and (min-height: 300px) and (max-height: 699px) {
  .information-manager {
    width: 106px;
    height: 53px;
    z-index: 2;
    position: relative;
    left: 8px;
    top: 20px;
    background: white;
  }
}

@media only screen and (min-width: 1200px) {
  .information {
    width: 20vw;
    z-index: 1;
    position: relative;
    left: 8px;
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
    left: 8px;
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
    left: 8px;
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
    left: 8px;
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
  height: 80vh;
  width: 80vw;
  top: 10vh;
  left: 10vw;
  position: absolute;
}

.page-image {
  justify-content: center;
  display: flex;
  z-index: -1;
  object-fit: contain;
}

.image-element {
  height: 80vh;
  width: 80vw;
}

.viewer {
  width: 80vw;
  height: 80vh;
}

.viewer > .openseadragon-container > .openseadragon-canvas { outline: none; }

.hide-scrollbar {
  overflow: auto;
  scrollbar-width: none;
}


</style>
