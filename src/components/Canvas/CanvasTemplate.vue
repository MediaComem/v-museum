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
      :focus="rectangleFocus"
    />
    <!-- This is the initial central image that changes over the time -->
    <image-element
      :ref="'image-element'"
      :imagePosition="{
        top: imageBlocks[0].centralImageTopPosition,
        left: imageBlocks[0].centralImageLeftPosition,
      }"
      :isTop="true"
      :isLeft="false"
      :focus="initialImageFocus.hasFocus"
      :imageId="imageBlocks[0].centralId"
      :imageFactor="imageFactor"
      :tag="imageBlocks[0].oldCentralImageTag"
      :class="getOpacity"
    />
    <div v-for="(imageBlock, index) in imageBlocks" :key="index">
      <div>
        <images-block
          :ref="'image-block-' + index"
          :imageBlock="imageBlock"
          :imageFactor="imageFactor"
          :currentGlobalPosition="index"
          :isFull="imageBlocks.length === maxArraySize"
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
  isNewSelectedImage,
  isChangeSelectedImage,
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
      // The two following parameters will remove when the navigation will implement
      initialImageId: 3,
      initialCentralTag: "Fly",
      initialImageFocus: { hasFocus: false },
      imageBlocks: [],
      windowHeight: 0,
      windowWidth: 0,
      pageHeight: 0,
      pageWidth: 0,
      // Movement management part
      isDrag: false,
      currentXPosition: 0,
      currentYPosition: 0,
      currentCenterLeftPosition: 0,
      currentCenterTopPosition: 0,
      // Focus management part
      rectangleFocus: true,
      imageHasFocus: false,
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
      this.imageHasFocus = false
      // In case of a collision was detected and we continue the movement, reset the timeout that
      // enable new related images and center the screen.
      clearTimeout(this.focusMoveTimeout);
      this.focusMoveTimeout = undefined;
      // Retrieve current center window position in the page
      this.currentCenterLeftPosition =
        -this.$refs["page"].getBoundingClientRect().x + this.windowWidth / 2;
      this.currentCenterTopPosition =
        -this.$refs["page"].getBoundingClientRect().y + this.windowHeight / 2;

      // Initial central image analyzis
      this.imageCollisionAnalyzis(
        this.$refs["image-element"],
        this.initialImageFocus,
        0
      );

      // Analysis of each related images
      // first loop to analyze each blocks
      // Second loop to analyze each images in the block
      for (let i = 0; i <= this.imageBlocks.length; i++) {
        const currentImageBlock = this.$refs["image-block-" + i];
        if (currentImageBlock) {
          const nbElementsInBlock = Object.keys(currentImageBlock.$refs).length;
          for (let j = 0; j < nbElementsInBlock; j++) {
            this.imageCollisionAnalyzis(
              currentImageBlock.$refs["image-element-" + j],
              this.imageBlocks[i].relatedImages[j],
              this.imageBlocks[i].imagePositions[j]
            );
          }
        }
      }

      // Manage size of the focus rectangle
      this.rectangleFocus = this.imageHasFocus;
    },
    imageCollisionAnalyzis(imageToAnalyze, focusElement, imagePosition) {
      console.log(imageToAnalyze);
      console.log(focusElement);
      console.log(imagePosition)
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
          imageToAnalyzeImageLeftPosition,
          imageToAnalyzeImageTopPosition,
          focusElement,
          imagePosition
        );
      }
    },
    collisionAnalysis(
      imageId,
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
        currentImageLeftPosition <= this.currentCenterLeftPosition &&
        currentImageLeftPosition + relatedThumbnailWidth(factor) >=
          this.currentCenterLeftPosition &&
        currentImageTopPosition <= this.currentCenterTopPosition &&
        currentImageTopPosition + relatedThumbnailHeight(factor) >=
          this.currentCenterTopPosition
      ) {
        focusElement.hasFocus = true;
        this.imageHasFocus = true;
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
          this.insertionManagement(
            imageId,
            currentImageTopPosition,
            currentImageLeftPosition,
            imagePosition
          );
        }, 200);
      } else {
        focusElement.hasFocus = false;
      }
    },
    // This method analyzes the state of the canvas and insert the new block when and where it's necessary
    insertionManagement(
      imageId,
      currentImageTopPosition,
      currentImageLeftPosition,
      imagePosition
    ) {
      // First, check if it's necessary to do something.
      if (shouldInsert(imageId, this.imageBlocks)) {
        // Second, check if it's a image of another block or the current one
        const shouldChangeSelectedImage = isChangeSelectedImage(
          imageId,
          this.imageBlocks
        );
        // If it is another one, replace the current block by the new one
        if (shouldChangeSelectedImage.shouldChange) {
          // This part is used to find the tag for the central image
          let oldImageBlock = this.imageBlocks[0];
          let oldTag = "";
          if (oldImageBlock) {
            const index = oldImageBlock.relatedImages.findIndex(
              (e) => e.imageId === oldImageBlock.oldCentralImage
            );
            oldTag = oldImageBlock.relatedImages[index].tag;
          }
          // Index + 1 because we know which one is the current but we must remove the next one.
          this.imageBlocks.splice(
            shouldChangeSelectedImage.index + 1,
            1
          );
          this.insertBlock(
            imageId,
            currentImageTopPosition,
            currentImageLeftPosition,
            imagePosition,
            this.relatedImages[imageId]
          );
          // Keep track of the central image id to use it when the block disappear
          // Store in the block the tag of the old central image
          oldImageBlock = this.imageBlocks[
            shouldChangeSelectedImage.index
          ];
          if (oldImageBlock) {
            if (oldTag.length !== 0) {
              oldImageBlock.oldCentralImageTag = oldTag;
            }
            oldImageBlock.oldCentralImage = imageId;
          }
        }
        // Finally, check if it's a new block is needed and load it.
        else if (isNewSelectedImage(imageId, this.imageBlocks)) {
          // This part is used to find the tag for the central image
          let oldImageBlock = this.imageBlocks[0];
          let oldTag = "";
          if (oldImageBlock) {
            const index = oldImageBlock.relatedImages.findIndex(
              (e) => e.imageId === oldImageBlock.oldCentralImage
            );
            if (index !== -1) {
              oldTag = oldImageBlock.relatedImages[index].tag;
            }
          }
          this.insertBlock(
            imageId,
            currentImageTopPosition,
            currentImageLeftPosition,
            imagePosition,
            this.relatedImages[imageId]
          );
          // Remove first block in case of there are three blocks in the array
          if (this.imageBlocks.length > 2) {
            this.imageBlocks.shift();
          }
          // Keep track of the central image id to use it when the block disappear
          // Store in the block the tag of the old central image
          oldImageBlock = this.imageBlocks[0];
          if (oldImageBlock) {
            if (oldTag.length !== 0) {
              oldImageBlock.oldCentralImageTag = oldTag;
            }
            oldImageBlock.oldCentralImage = imageId;
          }
        }
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
        this.imageBlocks.forEach((imageBlock) => {
          imageBlock.centralImageTopPosition =
            imageBlock.centralImageTopPosition - deltaY;
        });
      }
      if (deltaY > 0 && offsetY > this.pageHeight - this.windowHeight) {
        this.pageHeight = this.pageHeight + deltaY;
      }
      if (deltaX < 0 && offsetX > this.windowWidth) {
        this.pageWidth = this.pageWidth - deltaX;
        this.imageBlocks.forEach((imageBlock) => {
          imageBlock.centralImageLeftPosition =
            imageBlock.centralImageLeftPosition - deltaX;
        });
      }
      if (deltaX > 0 && offsetX > this.pageWidth - this.windowWidth) {
        this.pageWidth = this.pageWidth + deltaX;
      }
    },
    insertBlock(
      imageId,
      centralTopImagePosition,
      centralLeftImagePosition,
      currentPosition,
      relatedImages
    ) {
      this.imageBlocks.push(
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
          this.imageBlocks.length > 1 &&
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

    this.insertBlock(
      this.initialImageId,
      firstBlockCentralImageTopPosition,
      firstBlockCentralImageLeftPosition,
      0,
      this.relatedImages[this.initialImageId]
    );
    this.imageBlocks[0].oldCentralImageTag = this.initialCentralTag;
    this.imageBlocks[0].oldCentralImage = this.initialImageId;

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
