<template>
  <svg
    :width="imageWidth"
    :height="imageHeight"
    :style="{ top: topPosition, left: leftPosition }"
  >
    <line x1="0" y1="0" :x2="20" y2="0" stroke="black" stroke-width="2" />
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
  getImageWidth
} from "./service/image_management_service";
export default {
  props: {
    offsetX: Number,
    offsetY: Number,
    focus: Boolean,
    imageFactor: Number,
  },
  name: "FocusRectangle",
  computed: {
    topPosition() {
      return (this.offsetY - getImageHeight(this.focus, this.imageFactor)) / 2 + "px";
    },
    leftPosition() {
      return (this.offsetX - getImageWidth(this.focus, this.imageFactor)) / 2 + "px";
    },
    imageHeight() {
      return getImageHeight(this.focus, this.imageFactor) + 20;
    },
    imageWidth() {
      return getImageWidth(this.focus, this.imageFactor) + 20;
    },
  },
};
</script>

<style scoped>
svg {
  position: fixed;
  z-index: -11;
}
</style>
