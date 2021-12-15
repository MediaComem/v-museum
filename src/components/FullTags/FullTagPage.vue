<template>
  <div class="canvas-size overflow">
    <ul v-infinite-scroll="loadMoreImages" class="canvas-display">
      <div v-for="(image, index) in imageUrls" :key="index">
        <div class="image-size">
          <img :src="image.url" />
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
import dataFetch from "../../api/dataFetching";

export default {
  methods: {
    loadMoreImages() {
      this.currentPage = this.currentPage + 1;
      if (this.currentPage <= this.nbPage) {
        dataFetch.getImagesByTag(this.tag, this.currentPage).then((images) => {
          this.imageUrls = this.imageUrls.concat(images);
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
    };
  },
  created() {
    // Get the 25 first images
    dataFetch.getImagesByTag(this.tag, this.currentPage).then((images) => {
      this.imageUrls = images;
    });
    // Load all others
    dataFetch.getNbPagePerTag(this.tag).then((nbPage) => {
      this.nbPage = Math.ceil(nbPage / 25);
    });
  },
};
</script>

<style scoped>
.canvas-size {
  height: 90vh;
  background: black;
}

.canvas-display {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
}

.image-size {
  width: 25vw;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
