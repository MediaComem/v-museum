<template>
  <div class="canvas-size overflow">
    <div v-if="imageUrls.length === 0" class="loader central-loader-position" />
    <ul v-infinite-scroll="loadMoreImages" infinite-scroll-distance="1000">
      <div class="canvas-display">
        <div v-for="(image, index) in imageUrls" :key="index">
          <div class="image-canvas">
            <img
              :src="image.url"
              @click="loadImage(image.id)"
              class="image-size"
            />
          </div>
        </div>
      </div>
    </ul>
  </div>
  <div class="footer-canvas">
    <div v-if="imageUrls.length > 0">
      <div v-if="isMoreImagesLoading" class="loader footer-loader-position" />
      <p>{{ imageUrls.length }} / {{ totalImages }}</p>
    </div>
  </div>
</template>

<script>
import dataFetch from "../../api/dataFetching";

export default {
  watch: {
    tag: function() {
      this.currentPage = 1;
      this.nbPage = 0;
      this.imageUrls = [];
      this.loadInitialImages();
    },
  },
  methods: {
    loadImage(imageId) {
      this.$router.push({
        path: `/canvas`,
        query: {
          imageId: encodeURIComponent(imageId),
          tag: encodeURIComponent(this.tag),
        },
      });
    },
    loadInitialImages() {
      // Get the 25 first images
      dataFetch.getImagesByTag(this.tag, this.currentPage).then((images) => {
        this.imageUrls = images;
      });
      // Load all others
      dataFetch.getNbPagePerTag(this.tag).then((nbPage) => {
        this.totalImages = nbPage;
        this.nbPage = Math.ceil(nbPage / 25);
      });
    },
    loadMoreImages() {
      this.currentPage = this.currentPage + 1;
      if (this.currentPage <= this.nbPage) {
        this.isMoreImagesLoading = true;
        dataFetch.getImagesByTag(this.tag, this.currentPage).then((images) => {
          this.imageUrls = this.imageUrls.concat(images);
          this.isMoreImagesLoading = false;
        });
      }
    },
  },
  props: {
    tag: String,
  },
  data() {
    return {
      imageUrls: [],
      currentPage: 1,
      nbPage: 0,
      totalImages: 0,
      isMoreImagesLoading: false,
    };
  },
};
</script>

<style scoped>
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

@media only screen and (min-width: 300px) and (max-width: 699px) {
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

.loader {
  border: 1px solid #f3f3f3; /* Light grey */
  border-top: 1px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
