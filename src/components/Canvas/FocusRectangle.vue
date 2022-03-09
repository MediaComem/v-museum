<template>
  <svg
    class="transition"
    :width="imageWidth"
    :height="imageHeight"
    :style="{ top: topPosition, left: leftPosition }"
  >
    <line x1="0" y1="0" x2="20" y2="0" stroke="black" stroke-width="2" />
    <line x1="0" y1="0" x2="0" y2="20" stroke="black" stroke-width="2" />

    <line
      :x1="imageWidth - 20"
      y1="0"
      :x2="imageWidth"
      y2="0"
      stroke="black"
      stroke-width="2"
    />
    <line
      :x1="imageWidth"
      y1="0"
      :x2="imageWidth"
      y2="20"
      stroke="black"
      stroke-width="2"
    />

    <line
      x1="0"
      :y1="imageHeight - 20"
      x2="0"
      :y2="imageHeight"
      stroke="black"
      stroke-width="2"
    />
    <line
      x1="0"
      :y1="imageHeight"
      x2="20"
      :y2="imageHeight"
      stroke="black"
      stroke-width="2"
    />

    <line
      :x1="imageWidth"
      :y1="imageHeight - 20"
      :x2="imageWidth"
      :y2="imageHeight"
      stroke="black"
      stroke-width="2"
    />
    <line
      :x1="imageWidth - 20"
      :y1="imageHeight"
      :x2="imageWidth"
      :y2="imageHeight"
      stroke="black"
      stroke-width="2"
    />
  </svg>
</template>

<script>
import {
  getImageHeight,
  getImageWidth,
  focusIntermediaryHeight,
} from "./service/image_management_service";
export default {
  props: {
    offsetX: Number,
    offsetY: Number,
    focus: Boolean,
    hoverImage: Boolean,
    imageFactor: Object,
    border: Boolean,
  },
  name: "FocusRectangle",
  computed: {
    topPosition() {
      let imageHeight = getImageHeight(this.focus, this.imageFactor.sizeFactor);
      if (!this.focus && this.hoverImage) {
        imageHeight = focusIntermediaryHeight(this.imageFactor.sizeFactor);
      }
      return (this.offsetY - imageHeight) / 2 + "px";
    },
    leftPosition() {
      return (this.offsetX - getImageWidth(this.hoverImage, this.imageFactor.sizeFactor)) / 2 + "px";
    },
    imageHeight() {
      let imageHeight = getImageHeight(this.focus, this.imageFactor.sizeFactor) + 20;
      if (!this.focus && this.hoverImage) {
        imageHeight = focusIntermediaryHeight(this.imageFactor.sizeFactor);
      }
      return imageHeight;
    },
    imageWidth() {
      return this.focus ? getImageWidth(this.focus, this.imageFactor.sizeFactor) + 20 : getImageWidth(this.hoverImage, this.imageFactor.sizeFactor) + 20;
    },
    background() {
      return {
        'background': this.focus ? 'rgba(0, 0, 0, 0.1)' : 'unset',
      }
    }
  },
};
</script>

<style scoped>
svg {
  position: fixed;
  z-index: -11;
}

.transition {
  transition: all 0.2s,
}
</style>
