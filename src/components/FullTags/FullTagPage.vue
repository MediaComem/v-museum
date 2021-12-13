<template>
  <div class="canvas-size overflow">
    <div v-for="(image, index) in imageUrls.length" :key="index">
      <div class="image-size">
        <img :src="imageUrls[index].url" />
      </div>
    </div>
  </div>
</template>

<script>
import dataFetch from "../../api/dataFetching";

export default {
  methods: {
    loadMoreImages() {
      for (let i = 2; i < this.nbPage; i++) {
        dataFetch.getImagesByTag(this.tag, i).then((images) => {
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
      nbPage: 0,
    };
  },
  created() {
    // Get the 25 first images
    dataFetch.getImagesByTag(this.tag, 1).then((images) => {
      this.imageUrls = images;
    });
    // Load all others
    dataFetch.getNbPagePerTag(this.tag).then((nbPage) => {
      this.nbPage = Math.ceil(nbPage / 25);
      this.loadMoreImages();
    });
  },
};
</script>

<style scoped>
.canvas-size {
  height: 90vh;
  background: black;
  display: flex;
  flex-wrap: wrap;
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
