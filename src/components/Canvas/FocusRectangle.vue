<template>
  <div
    class="transition"
    :style="{
      position: 'fixed',
      top: topPosition,
      left: leftPosition,
      height: imageHeight + 'px',
      width: imageWidth + 'px',
    }"
  >
    <div class="top left" :style="angleSize"></div>
    <div class="top right" :style="angleSize"></div>
    <div class="bottom right" :style="angleSize"></div>
    <div class="bottom left" :style="angleSize"></div>
  </div>
</template>

<script>
import {
  getImageHeight,
  getImageWidth,
  focusIntermediaryHeight,
} from './service/image_management_service';
export default {
  props: {
    offsetX: Number,
    offsetY: Number,
    focus: Boolean,
    hoverImage: Boolean,
    imageFactor: Object,
    border: Boolean,
    isSpecialDevice: Boolean,
  },
  name: 'FocusRectangle',
  computed: {
    topPosition() {
      let imageHeight = getImageHeight(this.focus, this.imageFactor.sizeFactor);
      if (!this.focus && this.hoverImage) {
        imageHeight = focusIntermediaryHeight(this.imageFactor.sizeFactor);
      }
      return ((this.offsetY - imageHeight) / 2) + 8 + 'px';
    },
    leftPosition() {
      return (
        (this.offsetX -
          getImageWidth(this.hoverImage, this.imageFactor.sizeFactor)) /
          2 +
        'px'
      );
    },
    imageHeight() {
      let imageHeight =
        getImageHeight(this.focus, this.imageFactor.sizeFactor) + 20;
      if (!this.focus && this.hoverImage) {
        imageHeight = focusIntermediaryHeight(this.imageFactor.sizeFactor);
      }
      return imageHeight;
    },
    imageWidth() {
      return this.focus
        ? getImageWidth(this.focus, this.imageFactor.sizeFactor) + 20
        : getImageWidth(this.hoverImage, this.imageFactor.sizeFactor) + 20;
    },
    angleSize() {
      if (this.isSpecialDevice) {
        return {
          height: '50px',
          width: '50px',
          'border-width': '4px',
        };
      }
      return {};
    },
  },
};
</script>

<style scoped>
.top,
.bottom {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.top {
  top: 0;
  border-top: 1px solid;
}

.bottom {
  bottom: 0;
  border-bottom: 1px solid;
}

.left {
  left: 0;
  border-left: 1px solid;
}

.right {
  right: 0;
  border-right: 1px solid;
}

.transition {
  transition: all 0.2s;
}
</style>
