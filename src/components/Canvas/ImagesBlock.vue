<template>
  <div v-for="(relatedImage, index) in imageBlock.relatedImages" :key="index">
    <image-element
      v-if="relatedImage"
      :ref="'image-element-' + index"
      :imagePosition="calculatePositions(relatedImage)"
      :focus="relatedImage.hasFocus"
      :tag="relatedImage.tag"
      :imageId="relatedImage.imageId"
      :imageFactor="imageFactor"
      :blockPosition="relatedImage.position"
      :class="{
        last_block:
          allBlockFill &&
          currentGlobalPosition === 0 &&
          relatedImage.imageId !== imageBlock.oldCentralImage &&
          !relatedImage.hasFocus,
      }"
    />
  </div>
</template>

<script>
import ImageElement from "./ImageElement.vue";

import ImageBlock from "../../models/ImageBlock";

import { thumbnailHeight, thumbnailWidth } from "./image_management_service";

export default {
  components: { ImageElement },
  props: {
    imageBlock: ImageBlock,
    imageFactor: Number,
    currentGlobalPosition: Number,
    allBlockFill: Boolean,
  },
  data() {
    return {
      newImagePositions: [],
      // Small factor uses to simulate a small shift in the related alignement.
      smallShiftFactor: Math.random() * (1 - 0.75) + 0.75,
    };
  },
  methods: {
    calculatePositions(relatedImage) {
      switch (relatedImage.position) {
        case 1:
          return {
            top:
              this.imageBlock.centralImagePosition.top -
              1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left -
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 2:
          return {
            top: this.imageBlock.centralImagePosition.top,
            left:
              this.imageBlock.centralImagePosition.left -
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 3:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left -
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 4:
          return {
            top:
              this.imageBlock.centralImagePosition.top -
              1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left +
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 5:
          return {
            top: this.imageBlock.centralImagePosition.top,
            left:
              this.imageBlock.centralImagePosition.left +
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 6:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left +
              1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
      }
    },
  },
};
</script>

<style scoped>
@import "./canvas.css";
</style>
