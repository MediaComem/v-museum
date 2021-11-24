<template>
  <div :style="pageSize" @mousewheel="updatePageSize">
    <rectangle
      :width="425"
      :height="650"
      :offsetX="windowWidth"
      :offsetY="windowHeight"
      ref="rectangle"
    />
    <image-element
      :imageHeight="600"
      :imageWidth="400"
      :imagePosition="{
        top: centralImageTopPosition,
        left: centralImageLeftPosition,
      }"
      :isTop="true"
      :isLeft="false"
      :hasFocus="true"
      :imageId="relatedImages[0].imageId"
    />
    <images-block
      :relatedImages="relatedImages[0].relatedImages"
      :currentLeftPosition="centralImageLeftPosition"
      :currentTopPosition="centralImageTopPosition"
      :nextPosition="generateNextPositions"
    />
  </div>
</template>

<script>
import ImageElement from "./ImageElement.vue";
import ImagesBlock from "./ImagesBlock.vue";
import Rectangle from "../ImageSelector/Rectangle.vue";

import { useWindowSize } from "vue-window-size";

import relatedImage from "../../assets/data/process.json";

export default {
  components: { ImagesBlock, ImageElement, Rectangle },
  data() {
    return {
      potentialPositions: [1, 2, 3, 4, 5, 6],
      relatedImages: relatedImage,
      windowHeight: 0,
      windowWidth: 0,
      pageHeight: 0,
      pageWidth: 0,
      centralImageTopPosition: 0,
      centralImageLeftPosition: 0,
      nextPositions: [],
    };
  },
  methods: {
    getNextPositions() {
      return this.potentialPositions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    },
    updatePageSize(event) {
      if (event.deltaY < 0 && event.offsetY < this.windowHeight) {
        this.pageHeight = this.pageHeight - event.deltaY;
        this.centralImageTopPosition =
          this.centralImageTopPosition - event.deltaY;
      }
      if (
        event.deltaY > 0 &&
        event.offsetY > this.pageHeight - this.windowHeight
      ) {
        this.pageHeight = this.pageHeight + event.deltaY;
      }
      if (event.deltaX < 0 && event.offsetX > this.windowWidth) {
        this.pageWidth = this.pageWidth - event.deltaX;
        this.centralImageLeftPosition =
          this.centralImageLeftPosition - event.deltaX;
      }
      if (
        event.deltaX > 0 &&
        event.offsetX > this.pageWidth - this.windowWidth
      ) {
        this.pageWidth = this.pageWidth + event.deltaX;
      }
    },
  },
  computed: {
    generateNextPositions() {
      return this.getNextPositions();
    },
    pageSize() {
      return {
        height: this.pageHeight + "px",
        width: this.pageWidth + "px",
      };
    },
  },
  created() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.pageHeight = 2 * this.windowHeight;
    this.pageWidth = 2 * this.windowWidth;

    this.centralImageTopPosition = this.pageHeight / 2 - 300;
    this.centralImageLeftPosition = this.pageWidth / 2 - 200;

    window.scrollTo({
      left: this.centralImageTopPosition,
      top: this.centralImageLeftPosition,
    });
  },
};
</script>

<style scoped></style>
