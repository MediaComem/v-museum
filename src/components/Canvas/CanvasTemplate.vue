<template>
  <!-- History Part-->
  <history
    :topPosition="windowHeight - 63"
    :leftPosition="10"
    :fullWidth="windowWidth"
    :isSpecialDevice="isSpecialDevice"
  />
  <div
    :style="pageSize"
    @mousedown="moveClickEnable"
    @mouseup="moveClickDisable"
    @mouseleave="moveClickDisable"
    @mousemove="mouseMove"
    @touchstart="moveClickEnable"
    @touchend="moveClickDisable"
    @gesturestart="disableZoomGesture"
    :ref="'page'"
    class="navigation-pointer"
  >
    <div class="return" :style="backPosition">
      <div @click="loadTagView" class="return-element clickable">
        <img src="@/assets/shared/Vector.svg" :style="imageSize" />
        <h2 :style="fontSize">{{ initialCentralTag }}</h2>
      </div>
    </div>
    <focus-rectangle
      :ref="'rectangle'"
      :offsetX="windowWidth"
      :offsetY="windowHeight"
      :imageFactor="imageFactor"
      :hoverImage="focusHoverImage"
      :focus="imageHasFocus"
      :border="isOnImage"
    />
    <div v-for="(imageBlock, index) in imageBlocks" :key="index">
      <div>
        <images-block
          :ref="'image-block-' + index"
          :imageBlock="imageBlock"
          :imageFactor="imageFactor"
          :currentGlobalPosition="index"
          :blockInsertionState="index !== currentInsertionState"
          :isSpecialDevice="isSpecialDevice"
          @data-loaded="dataIsLoaded(index)"
          @is-in-screen="checkImageOutsideScreen($event, index)"
          @indicator-move="indicatorMove($event, index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ImagesBlock from './ImagesBlock.vue';
import FocusRectangle from './FocusRectangle.vue';
import History from '../History/History.vue';

import { useWindowSize } from 'vue-window-size';
import smoothscroll from 'smoothscroll-polyfill';

import relatedImageData from '../../assets/data/process.json';

import {
  getFactor,
  thumbnailWidth,
  thumbnailHeight,
  relatedThumbnailWidth,
  relatedThumbnailHeight,
  isNewSelectedImage,
  isChangeSelectedImage,
  getNextIndexBaseOnState,
  getPreviousIndexBaseOnState,
  resetBlockFocus,
  isFocusShouldHover,
} from './service/image_management_service';

import {
  generatePosition,
  isOutsideViewPort,
  getIndicatorPosition,
} from './service/positions_management_service';

import ImageBlock from '../../models/ImageBlock';
import RelatedImage from '../../models/RelatedImage';

export default {
  components: { ImagesBlock, FocusRectangle, History },
  beforeRouteUpdate(to) {
    if (to.query.imageId) {
      this.centralImageId = +decodeURIComponent(to.query.imageId);
      if (to.query.tag) {
        this.initialCentralTag = decodeURIComponent(to.query.tag);
      }
      this.isInitialLoad = true;
      this.loadInitialImage();
    }
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.query.imageId) {
        vm.centralImageId = +decodeURIComponent(to.query.imageId);
        if (to.query.tag) {
          vm.initialCentralTag = decodeURIComponent(to.query.tag);
        }
        vm.isInitialLoad = true;
        vm.loadInitialImage();
      }
    });
  },
  data() {
    return {
      // Data in the JSON file to find images
      isSpecialDevice: false,
      relatedImages: relatedImageData,
      maxArraySize: 3,
      // Display management part
      // The two following parameters will remove when the navigation will implement
      centralImageId: 3,
      initialCentralTag: 'Fly',
      imageBlocks: [],
      windowHeight: 0,
      windowWidth: 0,
      pageHeight: 0,
      pageWidth: 0,
      fullHistoryMode: false,
      currentInsertionState: 1,
      centralImageIndex: 0,
      // Movement management part
      isDrag: false,
      currentXPosition: 0,
      currentYPosition: 0,
      currentCenterLeftPosition: 0,
      currentCenterTopPosition: 0,
      lastScroll: { x: 0, y: 0 },
      // Focus management part
      imageHasFocus: true,
      isOnImage: false,
      isInitialLoad: true,
      // Variable used to stop the centering of an image in case of moving in the page
      focusMoveTimeout: undefined,
      currentIndicatorMove: undefined,
      indicatorMoveInProgress: false,
      animationTimer: 500,
      focusHoverImage: false,
      diffTime: 0,
      researchInterval: null,
      countResearch: 0,
    };
  },
  methods: {
    disableZoomGesture(event){
      event.preventDefault();
    },
    loadTagView() {
      this.$router.push({
        path: `/full_tag`,
        query: { tag: encodeURIComponent(this.initialCentralTag) },
      });
    },
    moveClickEnable(event) {
      if (event.touches && event.touches.length >= 2) {
        event.preventDefault();
      }
      this.isDrag = true;
      this.diffTime = Date.now();
    },
    moveClickDisable() {
      this.isDrag = false;
      if (Date.now() - this.diffTime > 300) {
        this.animationTimer = 25;
      }
      this.checkCollision();
    },
    mouseMove(event) {
      if (this.isDrag) {
        this.move(event);
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
    scrollMove() {
      const currentScrollX = window.scrollX;
      const currentScrollY = window.scrollY;
      if (!this.isDrag) {
        this.updateCurrentPosition(currentScrollX, currentScrollY);
      }
      const diffScrollX = currentScrollX - this.lastScroll.x;
      const diffScrollY = currentScrollY - this.lastScroll.y;
      this.updatePageSize(
        diffScrollX,
        diffScrollY,
        currentScrollX,
        currentScrollY
      );

      this.lastScroll.x = currentScrollX;
      this.lastScroll.y = currentScrollY;

      // Setup the scroll animation only when we move with
      // the scroll.
      if (!this.indicatorMoveInProgress) {
        this.animationTimer = 500;
      }

      this.checkCollision();
    },
    // Launch collision analysis only when the data is fully loaded.
    dataIsLoaded(index) {
      if (index === 0 && this.isInitialLoad) {
        this.checkCollision();
        this.isInitialLoad = false;
      }
    },
    // When we click on an indicator, this method is launched.
    // First, we find the position of the image
    // Then we scroll to it.
    indicatorMove(event, block) {
      this.currentIndicatorMove = {
        position: event.position,
        block: block,
        element: event.element,
      };
      let leftPosition = event.position.left;
      let topPosition = event.position.top;
      if (this.indicatorMoveInProgress) {
        const position = this.$refs['image-block-' + block].$refs[
          'image-element-' + event.element
        ].position;
        leftPosition = +position.left.substring(0, position.left.length - 2);
        topPosition = +position.top.substring(0, position.top.length - 2);
      }
      const factor = getFactor(this.windowHeight, this.windowWidth);
      const imageTop =
        topPosition -
        this.windowHeight / 2 +
        thumbnailHeight(factor.sizeFactor) / 2 -
        10;
      const imageLeft =
        leftPosition -
        this.windowWidth / 2 +
        thumbnailWidth(factor.sizeFactor) / 2 -
        10;
      this.indicatorMoveInProgress = true;
      window.scrollTo({
        left: imageLeft,
        top: imageTop,
        behavior: 'smooth',
      });
      setTimeout(() => this.animationTimer = 25, 400);
    },
    isInScreen(
      image,
      imageToAnalyzeImageLeftPosition,
      imageToAnalyzeImageTopPosition,
      tag
    ) {
      if (
        isOutsideViewPort(
          window,
          {
            top: imageToAnalyzeImageTopPosition,
            left: imageToAnalyzeImageLeftPosition,
          },
          this.currentCenterLeftPosition,
          this.currentCenterTopPosition,
          getFactor(this.windowHeight, this.windowWidth).sizeFactor
        )
      ) {
        image.indicatorInformation = getIndicatorPosition(
          {
            top: imageToAnalyzeImageTopPosition,
            left: imageToAnalyzeImageLeftPosition,
          },
          {
            top: this.currentCenterTopPosition - this.windowHeight / 2,
            left: this.currentCenterLeftPosition - this.windowWidth / 2,
          },
          this.windowHeight,
          this.windowWidth,
          tag.childNodes[0].length * 15
        );
      } else {
        image.indicatorInformation = { visible: false, textRotation: 0 };
      }
    },
    checkImageOutsideScreen(event, index) {
      const image = this.$refs['image-block-' + index].$refs[
        'image-element-' + event
      ];
      const tag = image.$refs['tag'];
      const imageToAnalyzeLeftPositionWithPixel = image.position.left;
      // Remove px chars and convert to number
      const imageToAnalyzeImageLeftPosition = +imageToAnalyzeLeftPositionWithPixel.substring(
        0,
        imageToAnalyzeLeftPositionWithPixel.length - 2
      );
      const imageToAnalyzeTopPositionWithPixel = image.position.top;
      // Remove px chars and convert to number
      // Add tag height + margin bottom to center have the real image position
      const imageToAnalyzeImageTopPosition =
        +imageToAnalyzeTopPositionWithPixel.substring(
          0,
          imageToAnalyzeTopPositionWithPixel.length - 2
        ) +
        tag.clientHeight +
        8;
      this.isInScreen(
        image,
        imageToAnalyzeImageLeftPosition,
        imageToAnalyzeImageTopPosition,
        tag
      );
    },
    checkCollision() {
      // Reset focus when no image is focused
      this.imageHasFocus = isFocusShouldHover(this.imageBlocks);
      this.focusHoverImage = isFocusShouldHover(this.imageBlocks);
      this.isOnImage = isFocusShouldHover(this.imageBlocks);
      // In case of a collision was detected and we continue the movement, reset the timeout that
      // enable new related images and center the screen.
      clearTimeout(this.focusMoveTimeout);
      this.focusMoveTimeout = undefined;
      // Retrieve current center window position in the page
      this.currentCenterLeftPosition =
        -this.$refs['page'].getBoundingClientRect().x + this.windowWidth / 2;
      this.currentCenterTopPosition =
        -this.$refs['page'].getBoundingClientRect().y + this.windowHeight / 2;

      // Analysis of each related images
      // first loop to analyze each blocks
      // Second loop to analyze each images in the block
      for (let i = 0; i <= this.imageBlocks.length; i++) {
        const currentImageBlock = this.$refs['image-block-' + i];
        if (currentImageBlock) {
          const nbElementsInBlock = Object.keys(currentImageBlock.$refs).length;
          for (let j = 0; j < nbElementsInBlock; j++) {
            // param 1: div to check position collistion
            // param 2: image vue element including (focus state, position)
            this.imageCollisionAnalyzis(
              currentImageBlock.$refs['image-element-' + j],
              this.imageBlocks[i].relatedImages[j]
            );
          }
        }
      }
    },
    imageCollisionAnalyzis(imageToAnalyze, focusElement) {
      if (imageToAnalyze && imageToAnalyze.imageData !== undefined) {
        const tag = imageToAnalyze.$refs['tag'];
        if (tag) {
          const imageToAnalyzeLeftPositionWithPixel =
            imageToAnalyze.position.left;
          // Remove px chars and convert to number
          const imageToAnalyzeImageLeftPosition = +imageToAnalyzeLeftPositionWithPixel.substring(
            0,
            imageToAnalyzeLeftPositionWithPixel.length - 2
          );
          const imageToAnalyzeTopPositionWithPixel =
            imageToAnalyze.position.top;
          // Remove px chars and convert to number
          // Add tag height + margin bottom to center have the real image position
          const imageToAnalyzeImageTopPosition =
            +imageToAnalyzeTopPositionWithPixel.substring(
              0,
              imageToAnalyzeTopPositionWithPixel.length - 2
            ) +
            tag.clientHeight +
            8;
          // Check collision
          this.collisionAnalysis(
            imageToAnalyze,
            {
              top: imageToAnalyzeImageTopPosition,
              left: imageToAnalyzeImageLeftPosition,
            },
            focusElement
          );
          this.isInScreen(
            imageToAnalyze,
            imageToAnalyzeImageLeftPosition,
            imageToAnalyzeImageTopPosition,
            tag
          );
        }
      }
    },
    collisionAnalysis(imageToAnalyze, currentImagePosition, focusElement) {
      const factor = getFactor(this.windowHeight, this.windowWidth);
      // Compare the position of an image with the current center window position
      // The number if arbitrary defined to have a margin between the center of the window and the
      // center of the image.
      if (
        currentImagePosition.left <= this.currentCenterLeftPosition &&
        currentImagePosition.left + relatedThumbnailWidth(factor.sizeFactor) >=
          this.currentCenterLeftPosition &&
        currentImagePosition.top <= this.currentCenterTopPosition &&
        currentImagePosition.top + relatedThumbnailHeight(factor.sizeFactor) >=
          this.currentCenterTopPosition
      ) {
        resetBlockFocus(this.imageBlocks, imageToAnalyze.imageId);
        focusElement.wasSelected = true;
        // The calculation works as following:
        // 1) Current image position (provide at the top left of the window)
        // 2) remove the half of the window size
        // 3) move half of the image size to center the image in the window
        // 4) move half of margin of the focus
        const newLeftPosition =
          currentImagePosition.left -
          this.windowWidth / 2 +
          thumbnailWidth(factor.sizeFactor) / 2 -
          10;
        const newTopPosition =
          currentImagePosition.top -
          this.windowHeight / 2 +
          thumbnailHeight(factor.sizeFactor) / 2 -
          10;
        this.focusHoverImage = true;
        this.focusMoveTimeout = setTimeout(() => {
          this.animationTimer = 500;
          this.indicatorMoveInProgress = false;
          if (!this.isDrag) {
            this.imageHasFocus = true;
            focusElement.hasFocus = true;
            this.isOnImage = true;
            window.scrollTo({
              left: newLeftPosition,
              top: newTopPosition,
              behavior: 'smooth',
            });
            setTimeout(() => {
              this.insertionManagement(
                imageToAnalyze,
                currentImagePosition,
                focusElement.position
              );
            }, 200);
          }
        }, this.animationTimer);
      } else {
        focusElement.hasFocus = false;
      }
    },
    // This method analyzes the state of the canvas and insert the new block when and where it's necessary
    insertionManagement(imageToAnalyze, currentImagePosition, imagePosition) {
      // First, check if it's necessary to do something.
      if (isNewSelectedImage(imageToAnalyze.imageId, this.imageBlocks)) {
        // Second, check if it's a image of another block or the current one
        // If it is another one, replace the current block by the new one
        if (
          isChangeSelectedImage(
            imageToAnalyze.imageId,
            this.imageBlocks[this.centralImageIndex].relatedImages
          ) &&
          this.imageBlocks.length > 1
        ) {
          // Replace the needed block
          this.imageBlocks[this.currentInsertionState].relatedImages.forEach(
            (element) => {
              element.shouldDisapear = true;
            }
          );
          setTimeout(() => {
            this.imageBlocks[this.currentInsertionState] = this.insertBlock(
              imageToAnalyze,
              currentImagePosition,
              imagePosition,
              this.relatedImages[imageToAnalyze.imageId]
            );
          }, 500);
        }
        // Finally, check if it's a new block is needed and load it.
        else if (isNewSelectedImage(imageToAnalyze.imageId, this.imageBlocks)) {
          // Replace the old block by the new one
          if (this.imageBlocks.length >= this.maxArraySize) {
            this.currentInsertionState = getNextIndexBaseOnState(
              this.currentInsertionState
            );
            this.imageBlocks[this.currentInsertionState].relatedImages.forEach(
              (element) => {
                element.shouldDisapear = true;
              }
            );
            setTimeout(() => {
              this.imageBlocks[this.currentInsertionState] = this.insertBlock(
                imageToAnalyze,
                currentImagePosition,
                imagePosition,
                this.relatedImages[imageToAnalyze.imageId]
              );
            }, 500);
            this.centralImageIndex = getPreviousIndexBaseOnState(
              this.currentInsertionState
            );
          }
          // In case of the image block is not full, just add one more block
          else {
            this.imageBlocks.push(
              this.insertBlock(
                imageToAnalyze,
                currentImagePosition,
                imagePosition,
                this.relatedImages[imageToAnalyze.imageId]
              )
            );
            this.centralImageIndex = this.centralImageIndex + 1;
            this.currentInsertionState = this.currentInsertionState + 1;
          }
          // Take the oldest block and remove the not selected image so all the images that weren't central.
          const oldestBlock = this.$refs[
            'image-block-' + getNextIndexBaseOnState(this.currentInsertionState)
          ];
          const nbElementsInBlock = Object.keys(oldestBlock.$refs).length;
          for (let j = 0; j < nbElementsInBlock; j++) {
            const imageElement = oldestBlock.$refs['image-element-' + j];
            if (!imageElement.wasSelected) {
              imageElement.shouldDisapear = true;
              imageElement.imageData = undefined;
              imageElement.indicatorInformation.visible = false;
            }
          }
        }
        this.centralImageId = imageToAnalyze.imageId;
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
      let shouldScroll = false;
      // The four next block discovered the movement direction and modify the page size if necessary and also the position
      // of the image if necessary
      if (deltaY < 0 && offsetY < this.windowHeight) {
        this.currentYPosition = this.currentYPosition + this.windowHeight;
        this.pageHeight = this.pageHeight + this.windowHeight;
        this.imageBlocks.forEach((imageBlock) => {
          imageBlock.centralImagePosition.top =
            imageBlock.centralImagePosition.top + this.windowHeight;
        });
        shouldScroll = true;
      }
      if (deltaY > 0 && offsetY > this.pageHeight / 2) {
        this.pageHeight = this.pageHeight + this.windowHeight;
      }
      if (deltaX < 0 && offsetX < this.windowWidth) {
        this.currentXPosition = this.currentXPosition + this.windowWidth;
        this.pageWidth = this.pageWidth + this.windowWidth;
        this.imageBlocks.forEach((imageBlock) => {
          imageBlock.centralImagePosition.left =
            imageBlock.centralImagePosition.left + this.windowWidth;
        });
        shouldScroll = true;
      }
      if (deltaX > 0 && offsetX > this.pageWidth / 2) {
        this.pageWidth = this.pageWidth + this.windowWidth;
      }

      if (shouldScroll) {
        window.scrollTo(this.currentXPosition, this.currentYPosition);
        if (this.indicatorMoveInProgress) {
          setTimeout(
            () =>
              this.indicatorMove(
                this.currentIndicatorMove,
                this.currentIndicatorMove.block
              ),
            25
          );
        }
      }
    },
    loadInitialImage() {
      this.lastScroll = { x: window.scrollX, y: window.scrollY };
      this.currentInsertionState = 1;
      this.centralImageIndex = 0;
      this.imageBlocks = [];
      const factor = getFactor(this.windowHeight, this.windowWidth);
      // Find the middle of the page to insert the first image
      const firstBlockCentralImageTopPosition =
        this.pageHeight / 2 - thumbnailHeight(factor.sizeFactor) / 2;
      const firstBlockCentralImageLeftPosition =
        this.pageWidth / 2 - thumbnailWidth(factor.sizeFactor) / 2;

      this.imageBlocks.push(
        new ImageBlock(
          0,
          {
            top: firstBlockCentralImageTopPosition,
            left: firstBlockCentralImageLeftPosition,
          },
          0,
          []
        )
      );

      this.imageBlocks[0].relatedImages.push(
        new RelatedImage(
          { imageId: this.centralImageId, tag: this.initialCentralTag },
          0,
          true,
          true
        )
      );

      this.imageBlocks.push(
        this.insertBlock(
          { imageId: this.centralImageId, tag: this.initialCentralTag },
          {
            top: firstBlockCentralImageTopPosition,
            left: firstBlockCentralImageLeftPosition,
          },
          0,
          this.relatedImages[this.centralImageId]
        )
      );
      this.currentXPosition = this.pageWidth / 2 - this.windowWidth / 2;
      this.currentYPosition = this.pageHeight / 2 - this.windowHeight / 2;

      setTimeout(() => {
        window.scrollTo({
          left:
            firstBlockCentralImageLeftPosition -
            this.windowWidth / 2 +
            thumbnailWidth(factor.sizeFactor) / 2,
          top:
            firstBlockCentralImageTopPosition -
            this.windowHeight / 2 +
            thumbnailHeight(factor.sizeFactor) / 2,
        });
      }, 100);
    },
    insertBlock(
      imageToAnalyze,
      currentImagePosition,
      currentPosition,
      relatedImages
    ) {
      this.$store.dispatch('insertHistory', {
        imageId: imageToAnalyze.imageId,
        tag: imageToAnalyze.tag,
      });

      return new ImageBlock(
        imageToAnalyze.imageId,
        currentImagePosition,
        generatePosition(currentPosition),
        relatedImages
      );
    },
  },
  computed: {
    imageFactor() {
      return getFactor(this.windowHeight, this.windowWidth);
    },
    backPosition() {
      return {
        top: this.isSpecialDevice ? '100px' : '25px',
        left: this.isSpecialDevice ? '100px' : '29px',
      };
    },
    imageSize() {
      return {  
        height: this.isSpecialDevice ? '100px' : '24px',
        width: this.isSpecialDevice ? '100px' : '24px',
        'margin-right': '5px',
      };
    },
    fontSize() {
      return {
        'font-size': this.isSpecialDevice ? '5rem' : '1.5rem',
      }
    },
    pageSize() {
      return {
        position: 'absolute',
        height: this.pageHeight + 'px',
        width: this.pageWidth + 'px',
      };
    },
  },
  created() {
    smoothscroll.polyfill();
    const { width, height } = useWindowSize();
    this.windowHeight = height.value;
    this.windowWidth = width.value;

    // Default page size set. The values have selected randomly but seems to be a good compromise
    this.pageHeight = this.windowHeight * 20;
    this.pageWidth = this.windowWidth * 20;

    // This part of code is used to detect if we receveive CSS or Device pixels.
    // When the page is loaded, we receive the CSS size. After few time, the real
    // visible size is provided.
    this.researchInterval = setInterval(() => {
      if (this.windowHeight * 1.2 < window.innerHeight){
        this.windowHeight = window.innerHeight - 384;
        this.isSpecialDevice = true;
        setInterval(() => {
          if (this.windowHeight + 384 !== window.innerHeight) {
            this.windowHeight = window.innerHeight - 384;
          }
        }, 100);
      }
      if (this.windowWidth * 1.2 < window.innerWidth){
        this.windowWidth = window.innerWidth;
        this.isSpecialDevice = true;
      }
      this.countResearch += 1;
      if (this.countResearch === 10) {
        clearInterval(this.researchInterval);
        this.researchInterval = null;
      }
    },100)
  },
  activated() {
    window.addEventListener('scroll', this.scrollMove);
    window.scrollTo(this.currentXPosition, this.currentYPosition);
  },
  deactivated() {
    window.removeEventListener('scroll', this.scrollMove);
  },
};
</script>

<style scoped>
@import './css/canvas.css';
@import '../shared/pointer.css';
</style>
