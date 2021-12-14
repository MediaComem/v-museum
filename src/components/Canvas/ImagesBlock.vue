<template>
  <div v-for="(relateImage, index) in imageBlock.relatedImages" :key="index">
    <image-element
      :ref="'image-element-' + index"
      :imagePosition="calculatePositions(index)"
      :isTop="true"
      :isLeft="false"
      :focus="relateImage.hasFocus"
      :tag="relateImage.tag"
      :imageId="relateImage.imageId"
      :imageFactor="imageFactor"
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
  },
  data() {
    return {
      newImagePositions: [],
      // Small factor uses to simulate a small shift in the related alignement.
      smallShiftFactor: Math.random() * (1 - 0.75) + 0.75,
    };
  },
  methods: {
    calculatePositions(index) {
      const positionNumber = this.imageBlock.imagePositions[index];
      switch (positionNumber) {
        case 1:
          return {
            top:
              this.imageBlock.centralImageTopPosition - 1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImageLeftPosition - 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 2:
          return {
            top: this.imageBlock.centralImageTopPosition,
            left:
              this.imageBlock.centralImageLeftPosition - 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 3:
          return {
            top:
              this.imageBlock.centralImageTopPosition + 1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImageLeftPosition - 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 4:
          return {
            top:
              this.imageBlock.centralImageTopPosition - 1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImageLeftPosition + 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 5:
          return {
            top: this.imageBlock.centralImageTopPosition,
            left:
              this.imageBlock.centralImageLeftPosition + 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
        case 6:
          return {
            top:
              this.imageBlock.centralImageTopPosition + 1.5 * thumbnailHeight(this.imageFactor) * this.smallShiftFactor,
            left:
              this.imageBlock.centralImageLeftPosition + 1.5 * thumbnailWidth(this.imageFactor) * this.smallShiftFactor,
          };
      }
    },
  },
};
</script>

<style scoped></style>
