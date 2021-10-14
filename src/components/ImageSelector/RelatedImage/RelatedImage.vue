<template>
  <img
    v-if="image.display"
    draggable="false"
    class="related-image"
    :class="{relatedImageBase: runTransition && !isTransitionExecuted && state}"
    :src="image.image.result.imagePaths.large"
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
  data() {
    return {
      state: true,
    }
  },
  activated() {
    this.state = false;
  },
};
</script>

<style>
@import "../css/imageselector.css";
@import "../css/relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
