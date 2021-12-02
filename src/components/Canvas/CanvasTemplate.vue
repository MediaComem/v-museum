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
      v-if="firstImageEnable"
      :ref="'image-element'"
      :imagePosition="{
        top: imageBlockController[0].centralImageTopPosition,
        left: imageBlockController[0].centralImageLeftPosition,
      }"
      :isTop="true"
      :isLeft="false"
      :focus="true"
      :imageId="initialImageId"
      :imageFactor="imageFactor"
    />
    <div v-for="(imageBlock, index) in imageBlockController" :key="index">
      <images-block
        :ref="'image-block-' + index"
        :relatedImages="imageBlock.relatedImages"
        :imageFactor="imageFactor"
        :currentLeftPosition="imageBlock.centralImageLeftPosition"
        :currentTopPosition="imageBlock.centralImageTopPosition"
        :nextPosition="imageBlock.imagePositions"
      />
    </div>
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
  relatedThumbnailWidth,
  relatedThumbnailHeight,
} from "./image_management_service";

import { generatePosition } from "./positions_management_service";

import ImageBlock from "../../models/ImageBlock";

export default {
  components: { ImageElement, ImagesBlock, FocusRectangle },
  data() {
    return {
      // Images management part
      relatedImages: relatedImage,
      // Display management part
      initialImageId: 3,
      imageBlockController: [],
      firstImageEnable: true,
      windowHeight: 0,
      windowWidth: 0,
      pageHeight: 0,
      pageWidth: 0,
      // Movement management part
      isDrag: false,
      currentXPosition: 0,
      currentYPosition: 0,
      // Array of focus elements to manage the rectangle focus
      currentFocus: [],
      // Variable used to stop the centering of an image in case of moving in the page
      focusMoveTimeout: undefined,
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
      clearTimeout(this.focusMoveTimeout);
      this.focusMoveTimeout = undefined;
      // Retrieve current center window position in the page
      const currentCenterLeftPosition =
        -this.$refs["page"].getBoundingClientRect().x + this.windowWidth / 2;
      const currentCenterTopPosition =
        -this.$refs["page"].getBoundingClientRect().y + this.windowHeight / 2;
        
      // Initial central image analyzis
      if (this.firstImageEnable) {
        this.initialImageAnalyzis(
          currentCenterLeftPosition,
          currentCenterTopPosition
        );
      }

      // Analysis of each related images
      // first loop to analyze each blocks
      // Second loop to analyze each images in the block
      for (let i = 0; i <= this.imageBlockController.length; i++) {
        const currentImageBlock = this.$refs["image-block-" + i];
        if (currentImageBlock) {
          const nbElementsInBlock = Object.keys(currentImageBlock.$refs).length;
          for (let j = 0; j < nbElementsInBlock; j++) {
            const currentImageElement =
              currentImageBlock.$refs["image-element-" + j];
            if (currentImageElement) {
              const currentImageLeftPositionString =
                currentImageElement.position.left;
              const currentImageLeftPosition = +currentImageLeftPositionString.substring(
                0,
                currentImageLeftPositionString.length - 2
              );
              const currentImageTopPositionString =
                currentImageElement.position.top;
              const currentImageTopPosition = +currentImageTopPositionString.substring(
                0,
                currentImageTopPositionString.length - 2
              );
              const imageId = currentImageElement.imageId;
              // Check collision
              this.collisionAnalysis(
                imageId,
                currentCenterLeftPosition,
                currentCenterTopPosition,
                currentImageLeftPosition,
                currentImageTopPosition,
                currentImageElement
              );
            }
          }
        }
      }

      // Manage size of the focus rectangle
      this.$refs["rectangle"].hasFocus = this.currentFocus.includes(true);
    },
    initialImageAnalyzis(currentCenterLeftPosition, currentCenterTopPosition) {
      const initialCentralImage = this.$refs["image-element"];
      if (initialCentralImage) {
        const currentImageLeftPositionString =
          initialCentralImage.position.left;
        const currentCenterImageLeftPosition = +currentImageLeftPositionString.substring(
          0,
          currentImageLeftPositionString.length - 2
        );
        const currentImageTopPositionString = initialCentralImage.position.top;
        const currentCenterImageTopPosition = +currentImageTopPositionString.substring(
          0,
          currentImageTopPositionString.length - 2
        );
        // Check collision
        this.collisionAnalysis(
          this.firstCentralImageId,
          currentCenterLeftPosition,
          currentCenterTopPosition,
          currentCenterImageLeftPosition,
          currentCenterImageTopPosition,
          this.$refs["image-element"]
        );
      }
    },
    collisionAnalysis(
      imageId,
      currentCenterLeftPosition,
      currentCenterTopPosition,
      currentImageLeftPosition,
      currentImageTopPosition,
      focusElement
    ) {
      const factor = getFactor(this.windowHeight, this.windowWidth);
      // Compare the position of an image with the current center window position
      // The number if arbitrary defined to have a margin between the center of the window and the
      // center of the image.
      if (
        currentImageLeftPosition <= currentCenterLeftPosition &&
        currentImageLeftPosition + relatedThumbnailWidth(factor) >=
          currentCenterLeftPosition &&
        currentImageTopPosition <= currentCenterTopPosition &&
        currentImageTopPosition + relatedThumbnailHeight(factor) >=
          currentCenterTopPosition
      ) {
        focusElement.hasFocus = true;
        this.currentFocus.push(true);
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
        this.focusMoveTimeout = setTimeout(() => {
          window.scrollTo({
            left: newLeftPosition,
            top: newTopPosition,
            behavior: "smooth",
          });
          if (this.imageBlockController.length === 2) {
            this.firstImageEnable = false;
            this.imageBlockController.shift();
          }
          this.imageBlockController.push(
            new ImageBlock(
              currentImageTopPosition,
              currentImageLeftPosition,
              generatePosition(),
              this.relatedImages[imageId]
            )
          );
        }, 200);
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
        this.imageBlockController.forEach((imageBlock) => {
          imageBlock.centralImageTopPosition =
            imageBlock.centralImageTopPosition - deltaY;
        });
      }
      if (deltaY > 0 && offsetY > this.pageHeight - this.windowHeight) {
        this.pageHeight = this.pageHeight + deltaY;
      }
      if (deltaX < 0 && offsetX > this.windowWidth) {
        this.pageWidth = this.pageWidth - deltaX;
        this.imageBlockController.forEach((imageBlock) => {
          imageBlock.centralImageLeftPosition =
            imageBlock.centralImageLeftPosition - deltaX;
        });
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

    // Default page size set to two times the current windows size
    this.pageHeight = 2 * this.windowHeight;
    this.pageWidth = 2 * this.windowWidth;

    const factor = getFactor(this.windowHeight, this.windowWidth);

    // Find the middle of the page to insert the first image
    const firstBlockCentralImageTopPosition =
      this.pageHeight / 2 - thumbnailHeight(factor) / 2;
    const firstBlockCentralImageLeftPosition =
      this.pageWidth / 2 - thumbnailWidth(factor) / 2;

    this.imageBlockController.push(
      new ImageBlock(
        firstBlockCentralImageTopPosition,
        firstBlockCentralImageLeftPosition,
        generatePosition(),
        this.relatedImages[this.initialImageId]
      )
    );

    this.currentXPosition = firstBlockCentralImageLeftPosition;
    this.currentYPosition = firstBlockCentralImageTopPosition;
  },
  activated() {
    window.scrollTo(this.currentXPosition, this.currentYPosition);
  },
};
</script>

<style scoped></style>
