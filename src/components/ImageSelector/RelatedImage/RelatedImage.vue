<template>
  <img
    v-if="this.image.display"
    draggable="false"
    class="related-image"
    :class="{relatedImageBase: runTransition && !isTransitionExecuted}"
    :src="this.image.image.result.imagePaths.large"
    :alt="image.image.result.id"
  />
</template>

<script>
export default {
  props: {
    image: Object,
    runTransition: Boolean,
    isTransitionExecuted: Boolean,
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
