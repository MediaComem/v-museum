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
  props: {
    tags: Array,
  },
  data() {
    return {
      imageUrls: [],
    };
  },
  created() {
    this.tags.forEach((id) => {
      dataFetch.getImageById(id).then((data) => {
        if (data.length > 0) {
          this.imageUrls.push({ id: id, url: data[0].imagePaths.square });
        }
      });
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
}

.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
