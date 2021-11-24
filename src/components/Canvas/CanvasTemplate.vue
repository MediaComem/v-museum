<template>
  <div
    :style="pageSize"
    @mousewheel="wheelMove"
    @mousedown="startPosition"
    @mouseup="endPosition"
    @mouseleave="endPosition"
    @mousemove="mouseMove"
    @touchstart="startPosition"
    @touchend="endPosition"
    @touchmove="touchMove"
  >
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
      isDrag: false,
      currentXPosition: 0,
      currentYPosition: 0,
    };
  },
  methods: {
    getNextPositions() {
      return this.potentialPositions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    },
    startPosition() {
      this.isDrag = true;
    },
    endPosition() {
      this.isDrag = false;
    },
    touchMove() {
      if (this.isDrag) {
        // TODO: Collision analysis
      }
    },
    mouseMove(event) {
      if (this.isDrag) {
        // The movement is inversed due to the fact that sign of each movements are inversed between mousewhell and mouse move.
        this.updatePageSize(
          -event.movementX,
          -event.movementY,
          this.currentXPosition,
          this.currentYPosition
        );
        this.move(event);
      }
    },
    wheelMove(event) {
      // Calculate the mouse movement and apply it on the current position
      const xMovement = this.currentXPosition + event.deltaX;
      const yMovement = this.currentYPosition + event.deltaY;
      this.updateCurrentPosition(xMovement, yMovement);

      this.updatePageSize(
        event.deltaX,
        event.deltaY,
        event.offsetX,
        event.offsetY
      );
    },
    move(event) {
      // Calculate the mouse movement and apply it on the current position
      const xMovement = this.currentXPosition - event.movementX;
      const yMovement = this.currentYPosition - event.movementY;
      this.updateCurrentPosition(xMovement, yMovement);

      // Move
      window.scrollTo({
        left: this.currentXPosition,
        top: this.currentYPosition,
      });
    },
    updateCurrentPosition(newXPosition, newYPosition) {
      // Ensure that the scroll is in the page
      if (newXPosition > 0 || newXPosition < this.pageWidth) {
        this.currentXPosition = newXPosition;
      }
      // Ensure that the scroll is in the page
      if (newYPosition > 0 || newYPosition < this.pageHeight) {
        this.currentYPosition = newYPosition;
      }
    },
    updatePageSize(deltaX, deltaY, offsetX, offsetY) {
      // The four next block discovered the movement direction and modify the page size if necessary and also the position of the image if necessary
      if (deltaY < 0 && offsetY < this.windowHeight) {
        this.pageHeight = this.pageHeight - deltaY;
        this.centralImageTopPosition = this.centralImageTopPosition - deltaY;
      }
      if (deltaY > 0 && offsetY > this.pageHeight - this.windowHeight) {
        this.pageHeight = this.pageHeight + deltaY;
      }
      if (deltaX < 0 && offsetX > this.windowWidth) {
        this.pageWidth = this.pageWidth - deltaX;
        this.centralImageLeftPosition = this.centralImageLeftPosition - deltaX;
      }
      if (deltaX > 0 && offsetX > this.pageWidth - this.windowWidth) {
        this.pageWidth = this.pageWidth + deltaX;
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

    // Default page size set to two times the current windows size
    this.pageHeight = 2 * this.windowHeight;
    this.pageWidth = 2 * this.windowWidth;

    // Find the middle of the page to insert the first image
    this.centralImageTopPosition = this.pageHeight / 2 - 300;
    this.centralImageLeftPosition = this.pageWidth / 2 - 200;

    this.currentXPosition = this.centralImageLeftPosition;
    this.currentYPosition = this.centralImageTopPosition;
  },
  activated() {
    window.scrollTo({
      left: this.centralImageTopPosition,
      top: this.centralImageLeftPosition,
    });
  },
};
</script>

<style scoped></style>
