<template>
  <div v-for="(relatedImage, index) in imageBlock.relatedImages" :key="index">
    <image-element
      v-if="relatedImage"
      :ref="'image-element-' + index"
      :imagePosition="calculatePositions(relatedImage)"
      :focus="relatedImage.hasFocus"
      :wasSelected="relatedImage.wasSelected"
      :runDisapearAnimation="relatedImage.shouldDisapear"
      :tag="relatedImage.tag"
      :imageId="relatedImage.imageId"
      :imageFactor="imageFactor.sizeFactor"
      :blockPosition="relatedImage.position"
      :class="{
        last_block: blockInsertionState && !relatedImage.hasFocus,
      }"
    />
  </div>
</template>

<script>
import ImageElement from "./ImageElement.vue";

import ImageBlock from "../../models/ImageBlock";

import {
  thumbnailHeight,
  thumbnailWidth,
} from "./service/image_management_service";

export default {
  components: { ImageElement },
  props: {
    imageBlock: ImageBlock,
    imageFactor: Object,
    currentGlobalPosition: Number,
    blockInsertionState: Boolean,
  },
  data() {
    return {
      newImagePositions: [],
      // Small factor uses to simulate a small shift in the related alignement.
      smallShiftFactor: Math.random() * (1 - 0.85) + 0.85,
    };
  },
  methods: {
    calculatePositions(relatedImage) {
      switch (relatedImage.position) {
        case 1:
          return {
            top:
              this.imageBlock.centralImagePosition.top -
              this.imageFactor.moveTopHeightFactor *
                thumbnailHeight(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left -
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        case 2:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              (thumbnailHeight(this.imageFactor.sizeFactor) /
                this.imageFactor.moveCentralHeightFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left -
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        case 3:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              this.imageFactor.moveBottomHeightFactor *
                thumbnailHeight(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left -
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        case 4:
          return {
            top:
              this.imageBlock.centralImagePosition.top -
              this.imageFactor.moveTopHeightFactor *
                thumbnailHeight(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left +
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        case 5:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              (thumbnailHeight(this.imageFactor.sizeFactor) /
                this.imageFactor.moveCentralHeightFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left +
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        case 6:
          return {
            top:
              this.imageBlock.centralImagePosition.top +
              this.imageFactor.moveBottomHeightFactor *
                thumbnailHeight(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
            left:
              this.imageBlock.centralImagePosition.left +
              this.imageFactor.moveWidthFactor *
                thumbnailWidth(this.imageFactor.sizeFactor) *
                this.smallShiftFactor,
          };
        default:
          return {
            top: this.imageBlock.centralImagePosition.top,
            left: this.imageBlock.centralImagePosition.left,
          };
      }
    },
  },
};
</script>

<style scoped>
@import "./css/canvas.css";
</style>
