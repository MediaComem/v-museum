<template>
  <div class="canvas-size overflow">
    <ul v-infinite-scroll="loadMoreImages" :infinite-scroll-disabled="disableScroll" :infinite-scroll-distance="200">
      <div class="canvas-display" v-if="origin == 'tags_slide'">
        <div v-for="(image, index) in this.images" :key="index">
          <div class="image-canvas">
            <img :src="image.url" @click="loadImage(image.id)" class="image-size clickable" />
          </div>
        </div>
      </div>
      <div v-else class="canvas-display">
        <div v-for="(image, index) in imageUrls" :key="index">
          <div class="image-canvas">
            <img :src="image.url" @click="loadImage(image.imageId)" class="image-size clickable" />
          </div>
        </div>
      </div>
    </ul>
  </div>
  <div class="footer-canvas">
    <div v-if="imageUrls.length > 0">
      <div class="footer-loader-position">
        <div v-if="isMoreImagesLoading" class="loader" style="position: absolute" />
        <div v-if="isMoreImagesLoading" class="rotated-half-circle" />
      </div>

      <p>{{ imageUrls.length }} / {{ data.length }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  watch: {
    tag: function () {
      this.disableScroll = true;
      this.imageUrls = [];
      this.loadInitialImages();
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
    methods: {
    loadImage(imageId) {
      if (this.origin == "tags_slide") {
        const img = this.images.filter( im => im.id == imageId)[0]
        console.log(img)
        this.$router.push({
          path: `/image/${imageId}`,
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
            console.log("result", result);
          });
    },
    loadMoreImages() {
      if (this.imageUrls.length < this.data.length) {
        this.isMoreImagesLoading = true;
        this.imageUrls = this.imageUrls.concat(this.data.slice(this.imageUrls.length, this.imageUrls.length + 100));
        this.isMoreImagesLoading = false;
      }
    },
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

p {
  margin: 0;
  margin-top: 1vh;
  color: white;
}

ul {
  padding: 0;
}

.canvas-size {
  height: 81vh;
  background: black;
}

.footer-canvas {
  height: 10vh;
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

@media only screen and (min-width: 300px) and (max-width: 799px) {
  .image-canvas {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-size {
    width: 150px;
    height: 150px;
    object-fit: fill;
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
    object-fit: fill;
  }
}

.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}

.loader {
  border: 1px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
}

.central-loader-position {
  position: absolute;
  top: 50vh;
  left: 50vw;
}

.footer-loader-position {
  position: relative;
  left: 1vw;
}

.rotated-half-circle {
  width: 14px;
  height: 14px;
  border: 2px solid white;
  border-radius: 50%;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
