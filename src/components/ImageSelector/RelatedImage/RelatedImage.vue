<template>
  <img
    v-if="this.image.display"
    class="relatedImageBase related-image"
    :src="this.image.image.result.imagePaths.large"
    :alt="image.image.result.id"
  />
</template>

<script>
export default {
  props: {
    image: Object,
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
