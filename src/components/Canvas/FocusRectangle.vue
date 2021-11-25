<template>
  <svg
    :width="getImageWidth"
    :height="getImageHeight"
    :style="{ top: getTopPosition, left: getLeftPosition }"
  >
    <line x1="0" y1="0" :x2="20" y2="0" stroke="black" stroke-width="2" />
    <line x1="0" y1="0" x2="0" y2="20" stroke="black" stroke-width="2" />

    <line
      :x1="getImageWidth - 20"
      y1="0"
      :x2="getImageWidth"
      y2="0"
      stroke="black"
      stroke-width="2"
    />
    <line
      :x1="getImageWidth"
      y1="0"
      :x2="getImageWidth"
      y2="20"
      stroke="black"
      stroke-width="2"
    />

    <line
      x1="0"
      :y1="getImageHeight - 20"
      x2="0"
      :y2="getImageHeight"
      stroke="black"
      stroke-width="2"
    />
    <line
      x1="0"
      :y1="getImageHeight"
      x2="20"
      :y2="getImageHeight"
      stroke="black"
      stroke-width="2"
    />

    <line
      :x1="getImageWidth"
      :y1="getImageHeight - 20"
      :x2="getImageWidth"
      :y2="getImageHeight"
      stroke="black"
      stroke-width="2"
    />
    <line
      :x1="getImageWidth - 20"
      :y1="getImageHeight"
      :x2="getImageWidth"
      :y2="getImageHeight"
      stroke="black"
      stroke-width="2"
    />
  </svg>
</template>

<script>
import {
  getImageHeight,
  getImageWidth
} from "./image_management_service";
export default {
  props: {
    offsetX: Number,
    offsetY: Number,
    hasFocus: Boolean,
    imageFactor: Number,
  },
  name: "FocusRectangle",
  computed: {
    getTopPosition() {
      return (this.offsetY - getImageHeight(this.hasFocus, this.imageFactor)) / 2 + "px";
    },
    getLeftPosition() {
      return (this.offsetX - getImageWidth(this.hasFocus, this.imageFactor)) / 2 + "px";
    },
    getImageHeight() {
      return getImageHeight(this.hasFocus, this.imageFactor) + 20;
    },
    getImageWidth() {
      return getImageWidth(this.hasFocus, this.imageFactor) + 20;
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
