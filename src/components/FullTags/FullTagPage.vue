<template>
  <div class="canvas-size overflow">
    <div v-for="(image, index) in imageUrls" :key="index">
      <img :src="image.url" />
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
          this.imageUrls.push({id: id, url: data[0].imagePaths.square});
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
}

.overflow {
  overflow-x: hidden;
  overflow-y: auto;
}

</style>
