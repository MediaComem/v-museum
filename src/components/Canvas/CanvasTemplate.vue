<template>
  <div
    :style="pageSize"
    @mousewheel="wheelMove"
    @mousedown="moveClickEnable"
    @mouseup="moveClickDisable"
    @mouseleave="moveClickDisable"
    @mousemove="mouseMove"
    @touchstart="moveClickEnable"
    @touchend="moveClickDisable"
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
    <!-- This is the initial central image that changes over the time -->
    <image-element
      :ref="'image-element'"
      :imagePosition="{
        top: imageBlockController[0].centralImageTopPosition,
        left: imageBlockController[0].centralImageLeftPosition,
      }"
      :isTop="true"
      :isLeft="false"
      :focus="initialImageFocus.hasFocus"
      :imageId="imageBlockController[0].centralId"
      :imageFactor="imageFactor"
      :tag="imageBlockController[0].oldCentralImageTag"
      :class="getOpacity"
    />
    <div v-for="(imageBlock, index) in imageBlockController" :key="index">
      <div>
        <images-block
          :ref="'image-block-' + index"
          :imageBlock="imageBlock"
          :imageFactor="imageFactor"
          :currentGlobalPosition="index"
          :isFull="imageBlockController.length === maxArraySize"
        />
      </div>
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
  shouldInsert,
  newSelectedImage,
  changeSelectedImage,
} from "./image_management_service";

import { generatePosition } from "./positions_management_service";

import ImageBlock from "../../models/ImageBlock";

export default {
  components: { ImageElement, ImagesBlock, FocusRectangle },
  data() {
    return {
      // Data in the JSON file to find images
      relatedImages: relatedImage,
      maxArraySize: 2,
      // Display management part
      initialImageId: 3,
      centralImageTag: "Fly",
      initialImageFocus: { hasFocus: false },
      imageBlockController: [],
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
    moveClickEnable() {
      this.isDrag = true;
    },
    moveClickDisable() {
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
    checkCollision() {
      // Reset the focus to have version of this analyzis.
      this.currentFocus = [];
      // In case of a collision was detected and we continue the movement, reset the timeout that
      // enable new related images and center the screen.
      clearTimeout(this.focusMoveTimeout);
      this.focusMoveTimeout = undefined;
      // Retrieve current center window position in the page
      const currentCenterLeftPosition =
        -this.$refs["page"].getBoundingClientRect().x + this.windowWidth / 2;
      const currentCenterTopPosition =
        -this.$refs["page"].getBoundingClientRect().y + this.windowHeight / 2;

      // Initial central image analyzis
      this.imageCollisionAnalyzis(
        currentCenterLeftPosition,
        currentCenterTopPosition,
        this.$refs,
        "image-element",
        this.initialImageFocus,
        0
      );

      // Analysis of each related images
      // first loop to analyze each blocks
      // Second loop to analyze each images in the block
      for (let i = 0; i <= this.imageBlockController.length; i++) {
        const currentImageBlock = this.$refs["image-block-" + i];
        if (currentImageBlock) {
          const nbElementsInBlock = Object.keys(currentImageBlock.$refs).length;
          for (let j = 0; j < nbElementsInBlock; j++) {
            this.imageCollisionAnalyzis(
              currentCenterLeftPosition,
              currentCenterTopPosition,
              currentImageBlock.$refs,
              "image-element-" + j,
              this.imageBlockController[i].relatedImages[j],
              this.imageBlockController[i].imagePositions[j]
            );
          }
        }
      }

      // Manage size of the focus rectangle
      this.$refs["rectangle"].hasFocus = this.currentFocus.includes(true);
    },
    imageCollisionAnalyzis(
      currentCenterLeftPosition,
      currentCenterTopPosition,
      refToAnalyze,
      ref,
      focusElement,
      imagePosition
    ) {
      const imageToAnalyze = refToAnalyze[ref];
      if (imageToAnalyze) {
        const imageToAnalyzeLeftPositionWithPixel =
          imageToAnalyze.position.left;
        // Remove px chars and convert to number
        const imageToAnalyzeImageLeftPosition = +imageToAnalyzeLeftPositionWithPixel.substring(
          0,
          imageToAnalyzeLeftPositionWithPixel.length - 2
        );
        const imageToAnalyzeTopPositionWithPixel = imageToAnalyze.position.top;
        // Remove px chars and convert to number
        const imageToAnalyzeImageTopPosition = +imageToAnalyzeTopPositionWithPixel.substring(
          0,
          imageToAnalyzeTopPositionWithPixel.length - 2
        );
        const imageId = imageToAnalyze.imageId;
        // Check collision
        this.collisionAnalysis(
          imageId,
          currentCenterLeftPosition,
          currentCenterTopPosition,
          imageToAnalyzeImageLeftPosition,
          imageToAnalyzeImageTopPosition,
          focusElement,
          imagePosition
        );
      }
    },
    collisionAnalysis(
      imageId,
      currentCenterLeftPosition,
      currentCenterTopPosition,
      currentImageLeftPosition,
      currentImageTopPosition,
      focusElement,
      imagePosition
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
          if (shouldInsert(imageId, this.imageBlockController)) {
            const changeSelected = changeSelectedImage(
              imageId,
              this.imageBlockController
            );
            if (changeSelected.shouldChange) {
              let oldBlock = this.imageBlockController[0];
              let oldTag = "";
              if (oldBlock) {
                const index = oldBlock.relatedImages.findIndex(
                  (e) => e.imageId === oldBlock.oldCentralImage
                );
                oldTag = oldBlock.relatedImages[index].tag;
              }
              // Index + 1 because we know which one is the current but we must remove the next one.
              this.imageBlockController.splice(changeSelected.index + 1, 1);
              this.insertElement(
                imageId,
                currentImageTopPosition,
                currentImageLeftPosition,
                imagePosition,
                this.relatedImages[imageId]
              );
              oldBlock = this.imageBlockController[changeSelected.index];
              if (oldBlock) {
                if (oldTag.length !== 0) {
                  oldBlock.oldCentralImageTag = oldTag;
                }
                oldBlock.oldCentralImage = imageId;
              }
            } else if (newSelectedImage(imageId, this.imageBlockController)) {
              let oldBlock = this.imageBlockController[0];
              let oldTag = "";
              if (oldBlock) {
                const index = oldBlock.relatedImages.findIndex(
                  (e) => e.imageId === oldBlock.oldCentralImage
                );
                if (index !== -1) {
                  oldTag = oldBlock.relatedImages[index].tag;
                }
              }
              this.insertElement(
                imageId,
                currentImageTopPosition,
                currentImageLeftPosition,
                imagePosition,
                this.relatedImages[imageId]
              );

              if (this.imageBlockController.length > 2) {
                this.imageBlockController.shift();
              }
              oldBlock = this.imageBlockController[0];
              if (oldBlock) {
                if (oldTag.length !== 0) {
                  oldBlock.oldCentralImageTag = oldTag;
                }
                oldBlock.oldCentralImage = imageId;
              }
            }
          }
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
    insertElement(
      imageId,
      centralTopImagePosition,
      centralLeftImagePosition,
      currentPosition,
      relatedImages
    ) {
      this.imageBlockController.push(
        new ImageBlock(
          imageId,
          0,
          centralTopImagePosition,
          centralLeftImagePosition,
          generatePosition(currentPosition),
          relatedImages
        )
      );
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
    getOpacity() {
      return {
        last_block:
          this.imageBlockController.length > 1 &&
          !this.initialImageFocus.hasFocus,
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

    this.insertElement(
      this.initialImageId,
      firstBlockCentralImageTopPosition,
      firstBlockCentralImageLeftPosition,
      0,
      this.relatedImages[this.initialImageId]
    );
    this.imageBlockController[0].oldCentralImageTag = this.centralImageTag;
    this.imageBlockController[0].oldCentralImage = this.initialImageId;

    this.currentXPosition = firstBlockCentralImageLeftPosition;
    this.currentYPosition = firstBlockCentralImageTopPosition;
  },
  activated() {
    window.scrollTo(this.currentXPosition, this.currentYPosition);
  },
};
</script>

<style scoped>
@import "./canvas.css";
</style>
