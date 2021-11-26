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
    :ref="'page'"
  >
    <focus-rectangle
      :ref="'rectangle'"
      :offsetX="windowWidth"
      :offsetY="windowHeight"
      :imageFactor="imageFactor"
      :focus="true"
    />
    <image-element
      :ref="'image-element'"
      :imagePosition="{
        top: centralImageTopPosition,
        left: centralImageLeftPosition,
      }"
      :isTop="true"
      :isLeft="false"
      :focus="true"
      :imageId="firstId"
      :imageFactor="imageFactor"
    />
    <images-block
      :ref="'image-block'"
      :relatedImages="relatedImages[firstId]"
      :currentLeftPosition="centralImageLeftPosition"
      :currentTopPosition="centralImageTopPosition"
      :nextPosition="nextPositions"
      :imageFactor="imageFactor"
    />
  </div>
</template>

<script>
import ImageElement from "./ImageElement.vue";
import ImagesBlock from "./ImagesBlock.vue";
import FocusRectangle from "./FocusRectangle.vue";

import { useWindowSize } from "vue-window-size";

import relatedImage from "../../assets/data/process.json";

import {
  getFactor,
  thumbnailWidth,
  thumbnailHeight,
} from "./image_management_service";

export default {
  components: { ImagesBlock, ImageElement, FocusRectangle },
  data() {
    return {
      // Should be replaced when we come from onboarding view.
      firstId: 70764,
      potentialPositions: [1, 2, 3, 4, 5, 6],
      relatedImages: relatedImage,
      windowHeight: 0,
      windowWidth: 0,
      pageHeight: 0,
      pageWidth: 0,
      centralImageTopPosition: 0,
      centralImageLeftPosition: 0,
      isDrag: false,
      currentXPosition: 0,
      currentYPosition: 0,
      nextPositions: [],
      currentFocus: [],
    };
  },
  methods: {
    startPosition() {
      this.isDrag = true;
    },
    endPosition() {
      this.isDrag = false;
    },
    touchMove() {
      if (this.isDrag) {
        this.checkCollision();
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
        this.checkCollision();
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
      this.checkCollision();
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
    checkCollision() {
      this.currentFocus = [];
      // Retrieve current center window position in the page
      const currentCenterLeftPosition =
        -this.$refs["page"].getBoundingClientRect().x + this.windowWidth / 2;
      const currentCenterTopPosition =
        -this.$refs["page"].getBoundingClientRect().y + this.windowHeight / 2;
      // retrieve the center image positions in the page
      const currentImageLeftPositionString = this.$refs["image-element"]
        .position.left;
      const currentCenterImageLeftPosition = +currentImageLeftPositionString.substring(
        0,
        currentImageLeftPositionString.length - 2
      );
      const currentImageTopPositionString = this.$refs["image-element"].position
        .top;
      const currentCenterImageTopPosition = +currentImageTopPositionString.substring(
        0,
        currentImageTopPositionString.length - 2
      );
      this.collisionAnalysis(
        currentCenterLeftPosition,
        currentCenterTopPosition,
        currentCenterImageLeftPosition,
        currentCenterImageTopPosition,
        this.$refs["image-element"]
      );
      // Analysis of each related images
      for (let i = 0; i <= 2; i++) {
        // Retrieve current image position in the page
        const currentImageLeftPositionString = this.$refs["image-block"].$refs[
          "image-element-" + i
        ].position.left;
        const currentImageLeftPosition = +currentImageLeftPositionString.substring(
          0,
          currentImageLeftPositionString.length - 2
        );
        const currentImageTopPositionString = this.$refs["image-block"].$refs[
          "image-element-" + i
        ].position.top;
        const currentImageTopPosition = +currentImageTopPositionString.substring(
          0,
          currentImageTopPositionString.length - 2
        );
        this.collisionAnalysis(
          currentCenterLeftPosition,
          currentCenterTopPosition,
          currentImageLeftPosition,
          currentImageTopPosition,
          this.$refs["image-block"].$refs["image-element-" + i]
        );
      }
      this.$refs["rectangle"].hasFocus = this.currentFocus.includes(true);
    },
    collisionAnalysis(
      currentCenterLeftPosition,
      currentCenterTopPosition,
      currentImageLeftPosition,
      currentImageTopPosition,
      focusElement
    ) {
      // Compare the position of an image with the current center window position
      // The number if arbitrary defined to have a margin between the center of the window and the
      // center of the image.
      if (
        currentImageLeftPosition - 200 <= currentCenterLeftPosition &&
        currentImageLeftPosition + 200 >= currentCenterLeftPosition &&
        currentImageTopPosition - 200 <= currentCenterTopPosition &&
        currentImageTopPosition + 200 >= currentCenterTopPosition
      ) {
        focusElement.hasFocus = true;
        this.currentFocus.push(true);
        const factor = getFactor(this.windowHeight, this.windowWidth);
        // The calculation works as following:
        // 1) Current image position (provide at the top left of the window)
        // 2) remove the half of the window size
        // 3) move half of the image size to center the image in the window
        // 4) move half of margin of the focus
        const newLeftPosition =
          currentImageLeftPosition -
          this.windowWidth / 2 +
          thumbnailWidth(factor) / 2 -
          10;
        const newTopPosition =
          currentImageTopPosition -
          this.windowHeight / 2 +
          thumbnailHeight(factor) / 2 -
          10;
        window.scrollTo({
          left: newLeftPosition,
          top: newTopPosition,
          behavior: "smooth",
        });
      } else {
        focusElement.hasFocus = false;
        this.currentFocus.push(false);
      }
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
      // The four next block discovered the movement direction and modify the page size if necessary and also the position
      // of the image if necessary
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
    imageFactor() {
      return getFactor(this.windowHeight, this.windowWidth);
    },
    pageSize() {
      return {
        position: "absolute",
        height: this.pageHeight + "px",
        width: this.pageWidth + "px",
      };
    },
  },
  created() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.nextPositions = this.potentialPositions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Default page size set to two times the current windows size
    this.pageHeight = 2 * this.windowHeight;
    this.pageWidth = 2 * this.windowWidth;

    const factor = getFactor(this.windowHeight, this.windowWidth);

    // Find the middle of the page to insert the first image
    this.centralImageTopPosition =
      this.pageHeight / 2 - thumbnailHeight(factor) / 2;
    this.centralImageLeftPosition =
      this.pageWidth / 2 - thumbnailWidth(factor) / 2;

    this.currentXPosition = this.centralImageLeftPosition;
    this.currentYPosition = this.centralImageTopPosition;

    window.scrollTo({
      left: this.currentXPosition,
      top: this.currentYPosition,
    });
  },
};
</script>

<style scoped></style>