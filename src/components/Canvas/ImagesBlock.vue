<template>
  <div v-for="(relateImage, index) in relatedImages" :key="index">
    <image-element
      :imageHeight="imageHeight"
      :imageWidth="imageWidth"
      :imagePosition="calculatePositions(index)"
      :isTop="true"
      :isLeft="false"
      :hasFocus="false"
      :tag="relateImage.tag"
      :imageId="relateImage.imageId"
    />
  </div>
</template>

<script>
import ImageElement from "./ImageElement.vue";
export default {
  components: { ImageElement },
  props: {
    currentTopPosition: Number,
    currentLeftPosition: Number,
    relatedImages: Array,
    nextPosition: Array,
  },
  data() {
    return {
      newImagePositions: [],
      imageHeight: 600,
      imageWidth: 400,
    };
  },
  methods: {
    calculatePositions(index) {
      const positionNumber = this.nextPosition[index];
      switch (positionNumber) {
        case 1:
          return {
            top: this.currentTopPosition - 1.5 * this.imageHeight,
            left: this.currentLeftPosition - 1.5 * this.imageWidth,
          };
        case 2:
          return {
            top: this.currentTopPosition,
            left: this.currentLeftPosition - 1.5 * this.imageWidth,
          };
        case 3:
          return {
            top: this.currentTopPosition + 1.5 * this.imageHeight,
            left: this.currentLeftPosition - 1.5 * this.imageWidth,
          };
        case 4:
          return {
            top: this.currentTopPosition - 1.5 * this.imageHeight,
            left: this.currentLeftPosition + 1.5 * this.imageWidth,
          };
        case 5:
          return {
            top: this.currentTopPosition,
            left: this.currentLeftPosition + 1.5 * this.imageWidth,
          };
        case 6:
          return {
            top: this.currentTopPosition + 1.5 * this.imageHeight,
            left: this.currentLeftPosition + 1.5 * this.imageWidth,
          };
      }
    },
  },
};
</script>

<style scoped></style>
