<template>
  <img
    :style="thumbnailHeight"
    v-if="this.image.display"
    style="object-fit: none; width: 100%;"
    class="relatedImageBase"
    :src="this.image.image.result.imagePaths.large"
    :alt="image.image.result.id"
  />
</template>

<script>
export default {
  methods: {
    getHeight() {
      return this.image.hover ? 100 : 50;
    },
  },
  props: {
    image: Object,
  },
  computed: {
    thumbnailHeight() {
      return {
        height: this.getHeight() + "%",
        transition: 'height 0.3s',
      };
    },
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
