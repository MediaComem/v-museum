<template>
  <div :style="setPage" @mousewheel="mouseWheel" ref="display">
    <!-- Target display part -->
    <rectangle
      :width="rectangleWidth"
      :height="rectangleHeight"
      :offsetX="windowWidth"
      :offsetY="windowHeight"
      style="cursor: pointer; user-select:none;"
      ref="rectangle"
    />
    <!-- Related Image display part -->
    <div
      ref="position0"
      :style="relatedImagePosition1"
      v-if="relatedImagesPosition.length > 0"
    >
      <related-image :image="relatedImagesPosition[0]" />
    </div>
    <div
      ref="position1"
      :style="relatedImagePosition2"
      v-if="relatedImagesPosition.length > 1"
    >
      <related-image :image="relatedImagesPosition[1]" />
    </div>
    <div
      ref="position2"
      :style="relatedImagePosition3"
      v-if="relatedImagesPosition.length > 2"
    >
      <related-image :image="relatedImagesPosition[2]" />
    </div>

    <!-- Image information part -->
    <div v-if="carouselHover" :style="imageInformationPosition">
      <p
        v-if="relatedImagesPosition.length > 0"
        style="margin: 0;"
        :class="{
          removeRelatedImageBaseText: relatedImagesPosition[0].display,
        }"
      >
        {{ relatedImagesPosition[0].image.tag["@value"] }} &nbsp;
      </p>
      <p
        v-if="relatedImagesPosition.length > 1"
        style="margin: 0;"
        :class="{
          removeRelatedImageBaseText: relatedImagesPosition[1].display,
        }"
      >
        {{ relatedImagesPosition[1].image.tag["@value"] }} &nbsp;
      </p>
      <p
        v-if="relatedImagesPosition.length > 2"
        style="margin: 0;"
        :class="{
          removeRelatedImageBaseText: relatedImagesPosition[2].display,
        }"
      >
        {{ relatedImagesPosition[2].image.tag["@value"] }} &nbsp;
      </p>
      <h3 style="margin: 0; height: 30px;">{{ currentIndex + 1 }}</h3>
    </div>
    <!-- Slider display part -->
    <div :style="imagePosition">
      <div :style="componentSize" style="overflow:hidden;" class="sliderMask">
        <div :style="componentSize" :class="selectZoomAnimation" ref="divCar">
          <ul
            class="ul-image"
            ref="ul-image"
            :class="selectSliderTransitionSpeed"
            :style="[scrollingDisplay, scrollingMovement]"
          >
            <li
              v-for="(value, index) in data"
              :key="index"
              :style="componentSize"
              :ref="'li-' + index"
            >
              <div :style="componentSize" style="overflow:hidden">
                <img
                  style="object-fit: none; height: 100%; width: 100%;"
                  :ref="'image-' + index"
                  :src="value.imagePaths.large"
                  :alt="value.id"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="carouselHover" class="font-slider" :style="fontSliderPosition"></div>
    <div :style="sliderPosition">
      <el-slider
        v-if="carouselHover"
        :class="selectArrayDisplay"
        style="width: 42px"
        ref="slider"
        vertical
        v-model="step"
        :height="'240px'"
        :max="600"
        :show-tooltip="false"
        @input="sliderChange"
        @change="releaseSlider"
      >
      </el-slider>
    </div>
  </div>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { mapState } from "vuex";

import Rectangle from "./Rectangle.vue";
import RelatedImage from "./RelatedImage/RelatedImage.vue";

export default {
  name: "ImageSelector",
  components: { Rectangle, RelatedImage },
  watch: {
    images: function(newImages) {
      this.data = newImages;
      if (this.isInitialLoad) {
        this.$nextTick(() => {
          this.isInitialLoad = false;
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
        });
      }
    },
    currentIndex: function(newVal) {
      this.isBeginning = newVal === 0;
      this.isEnd = newVal === this.data.length - 1;
      this.shouldRunSideAnimation = this.isBeginning || this.isEnd;
    },
    relatedImages: function(images) {
      this.displayRelatedImages(images);
    },
  },
  data() {
    return {
      // Data informations
      isBeginning: true,
      isEnd: false,
      data: undefined,
      // Information uses to manage the movement
      step: 300,
      speed: 6000,
      previousSpeed: 0,
      previousDirection: undefined,
      currentIndex: 0,
      // Information uses to manage the animations
      zoomingStep: 3,
      nbImageMove: 0,
      shouldRunSideAnimation: false,
      shouldRunDecelerateAnimation: false,
      // Information uses to manage the display
      pageHeight: 3000,
      pageWidth: 5000,
      windowHeight: undefined,
      windowWidth: undefined,
      // Management of the interval and timeout process
      interval: [],
      timeout: undefined,
      decelerateTimouts: [],
      // Target properties
      rectangleWidth: 0,
      rectangleHeight: 0,
      moveToImageTimeout: [],
      carouselHover: true,
      // Related images properties
      isInitialLoad: true,
      potentialPosition: [1, 2, 3, 4, 5, 6],
      relatedImagesPosition: [],
      displayRelatedImageTimeout: [],
    };
  },
  methods: {
    thumbnailHeight() {
      return 17 * 4 * this.defineReponsiveFactor();
    },
    thumbnailWidth() {
      return 9 * 4 * this.defineReponsiveFactor();
    },
    relatedThumbnailHeight() {
      return 9 * 4 * this.defineReponsiveFactor();
    },
    relatedThumbnailWidth() {
      return 8 * 4 * this.defineReponsiveFactor();
    },
    checkPosition(x, y, rectangle) {
      if (
        x < rectangle.x + rectangle.width &&
        x + this.rectangleWidth > rectangle.x &&
        y < rectangle.y + rectangle.height &&
        this.rectangleHeight + y > rectangle.y
      ) {
        this.moveToImageTimeout.push(
          setTimeout(() => {
            const newX =
              this.$refs.display.getBoundingClientRect().x -
              (rectangle.x - (this.windowWidth - rectangle.width) / 2);
            const newY =
              this.$refs.display.getBoundingClientRect().y -
              (rectangle.y - (this.windowHeight - rectangle.height) / 2);
            window.scrollTo({ left: -newX, top: -newY, behavior: "smooth" });
          }, 200)
        );
        return true;
      }
      return false;
    },
    checkCollision() {
      this.moveToImageTimeout.forEach(clearTimeout);
      this.moveToImageTimeout = [];
      const rectangle = this.$refs.divCar.getBoundingClientRect();
      const x = (this.windowWidth - this.$refs.divCar.clientWidth + 20) / 2;
      const y = (this.windowHeight - this.$refs.divCar.clientHeight + 20) / 2;
      this.carouselHover = this.checkPosition(x, y, rectangle);
      this.relatedImagesPosition.forEach((rectangle, index) => {
        this.checkPosition(
          x,
          y,
          this.$refs["position" + index].getBoundingClientRect()
        )
          ? (rectangle.hover = true)
          : (rectangle.hover = false);
      });
      if (this.moveToImageTimeout.length === 0) {
        this.rectangleHeight = this.$refs.divCar.clientHeight + 20;
        this.rectangleWidth = this.thumbnailWidth() + 20;
      } else {
        if (this.carouselHover) {
          this.rectangleHeight = this.thumbnailHeight() + 20;
          this.rectangleWidth = this.thumbnailWidth() + 20;
        } else {
          this.rectangleHeight = this.relatedThumbnailHeight() * 2 + 20;
          this.rectangleWidth = this.relatedThumbnailWidth() + 20;
        }
      }
    },
    mouseWheel() {
      this.checkCollision();
    },
    isStop() {
      return this.step > 290 && this.step < 310;
    },
    loadMoreContent(diffMaxIndexBeforeLoad) {
      if (
        this.currentIndex > this.data.length - diffMaxIndexBeforeLoad &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent");
      }
    },
    move(forward) {
      this.loadMoreContent(80);

      if (forward) {
        if (this.currentIndex !== this.data.length - 1) {
          this.currentIndex = this.currentIndex + 1;
        }
      } else if (this.currentIndex !== 0) {
        this.currentIndex = this.currentIndex - 1;
      }
      // This incrementation is to manage the animation
      this.nbImageMove = this.nbImageMove + 1;
    },
    launchMovement(newSpeed, direction) {
      this.move(direction);
      this.speed = newSpeed;
      this.interval.push(
        setInterval(() => {
          this.move(direction);
        }, this.speed)
      );
    },
    movementAnalysis(newSpeed, direction) {
      if (
        newSpeed !== this.previousSpeed ||
        this.previousDirection !== direction
      ) {
        this.stopInterval();
        this.launchMovement(newSpeed, direction);
      }
    },
    sliderChange() {
      // Release animation
      if (this.previousSpeed === 0 && this.step !== 300) {
        this.nbImageMove = 0;
      }
      if (this.isStop()) {
        clearTimeout(this.timeout);
        // Wait to ensure that we are stopped in the stopping step and not change the direction
        this.timeout = setTimeout(() => {
          if (this.isStop()) {
            this.releaseSlider(300);
          }
        }, 200);
      } else {
        this.stopDisplayRelatedImages();
        this.decelerateTimouts.forEach(clearTimeout);
        const newSpeed = this.speedSelection();
        this.animationStepAnalysis(newSpeed);

        const direction = this.step <= 290;
        this.movementAnalysis(newSpeed, direction);

        // Keep track of the state for next step of the slider change
        this.previousSpeed = newSpeed;
        this.previousDirection = direction;
      }
    },
    launchDecelerate(direction) {
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 250;
          this.move(direction);
        }, 50)
      );
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 500;
          this.move(direction);
        }, 250)
      );
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 1000;
          this.move(direction);
          setTimeout(() => (this.shouldRunDecelerateAnimation = false), 1000);
        }, 500)
      );
    },
    getBackPreviousPosition() {
      const imagePosition = this.$refs[
        "image-" + this.currentIndex
      ].getBoundingClientRect();
      if (
        this.previousDirection &&
        imagePosition.y > imagePosition.height / 2 &&
        this.currentIndex !== 0
      ) {
        this.currentIndex = this.currentIndex - 1;
      } else if (!this.previousDirection && imagePosition.y < 0) {
        this.currentIndex = this.currentIndex + 1;
      }
    },
    releaseSlider(releaseStep) {
      // Reset Interval and Timeout
      clearTimeout(this.timeout);
      this.stopInterval();

      this.shouldRunSideAnimation = false;
      this.previousSpeed = 0;

      if (releaseStep <= 140 || releaseStep > 470) {
        // Reset movement and animation parameters
        if (releaseStep < 100 || releaseStep > 530) {
          this.shouldRunDecelerateAnimation = true;
        }
        this.launchDecelerate(this.previousDirection);
      }

      this.step = 300;

      if (releaseStep === 300) {
        // This part analyze where we are in the sliding process to get back to the previous image in case we stop the slider.
        this.getBackPreviousPosition();
        this.zoomingStep = -1;
        this.speed = 6000;
        this.previousDirection = undefined;
        this.$store.dispatch("loadRelatedImages", {
          tags: this.data[this.currentIndex].tags,
          id: this.data[this.currentIndex].id,
        });
      }
    },
    animationStepAnalysis(speed) {
      if (this.previousSpeed > speed) {
        this.zoomingStep = 2;
      } else if (this.previousSpeed <= 125 && this.previousSpeed !== 0) {
        this.zoomingStep = 1;
      } else if (this.previousSpeed < speed && this.speed > 1000) {
        this.zoomingStep = 2;
      }
    },
    stopInterval() {
      this.interval.forEach((element) => clearInterval(element));
      this.interval = [];
    },
    displayRelatedImages(images) {
      // Select randomly 3 display positions
      this.potentialPosition
        .sort(() => Math.random() - 0.5)
        .slice(0, images.length)
        .forEach((position, index) => {
          this.relatedImagesPosition.push({
            position: position,
            image: images[index],
            display: false,
            hover: false,
          });
        });
      // Setup the display animation
      this.$nextTick(() => {
        this.relatedImagesPosition.forEach((element, index) => {
          const animationDelay = 1000 + 2000 * index;
          this.displayRelatedImageTimeout.push(
            setTimeout(() => {
              this.relatedImagesPosition[index].display = true;
              this.$nextTick(() => {
                this.shouldUpdateDisplay = true;
              });
            }, animationDelay)
          );
        });
      });
    },
    stopDisplayRelatedImages() {
      this.relatedImagesPosition = [];
      this.displayRelatedImageTimeout.forEach(clearTimeout);
      this.displayRelatedImageTimeout = [];
    },
    speedSelection() {
      // Find the transition speed
      switch (true) {
        case this.step <= 20:
          return 50;
        case this.step <= 60:
          return 62;
        case this.step <= 100:
          return 125;
        case this.step <= 140:
          return 250;
        case this.step <= 150:
          return 375;
        case this.step <= 190:
          return 500;
        case this.step <= 210:
          return 750;
        case this.step <= 230:
          return 1000;
        case this.step <= 250:
          return 1500;
        case this.step <= 270:
          return 2000;
        case this.step <= 290:
          return 4000;
        case this.step > 290 && this.step < 310:
          return 6000;
        case this.step <= 330:
          return 4000;
        case this.step <= 350:
          return 2000;
        case this.step <= 370:
          return 1500;
        case this.step <= 390:
          return 1000;
        case this.step <= 410:
          return 750;
        case this.step <= 440:
          return 500;
        case this.step <= 470:
          return 375;
        case this.step <= 500:
          return 250;
        case this.step <= 530:
          return 125;
        case this.step <= 570:
          return 62;
        case this.step <= 600:
          return 50;
      }
    },
    defineReponsiveFactor() {
      switch (true) {
        case this.windowWidth >= 1000 && this.windowHeight >= 920:
          return 10;
        case this.windowWidth >= 700 && this.windowHeight >= 716:
          return 7;
        case this.windowWidth >= 550 && this.windowHeight >= 615:
          return 5.5;
        case this.windowWidth >= 450 && this.windowHeight >= 548:
          return 4.5;
        case this.windowWidth >= 400 && this.windowHeight >= 514:
          return 4;
        case this.windowWidth >= 350 && this.windowHeight >= 480:
          return 3.5;
        default:
          return 3;
      }
    },
    defineTopImagePosition() {
      return this.carouselHover ? (this.pageHeight - this.thumbnailHeight()) / 2 : (this.pageHeight - this.thumbnailHeight()) / 2 + this.thumbnailHeight() / 4;
    },
    defineLeftImagePosition() {
      return (this.pageWidth - this.thumbnailWidth()) / 2;
    },
    defineTopSliderPosition() {
      return (
        (this.pageHeight - this.thumbnailHeight()) / 2 +
        this.thumbnailHeight() / 2 -
        150
      );
    },
    defineLeftSliderPosition() {
      return this.pageWidth / 2 + this.thumbnailWidth() / 2;
    },
    defineLeftPositionCenterPage() {
      return this.pageWidth / 2 - this.windowWidth / 2;
    },
    defineTopPositionCenterPage() {
      return this.pageHeight / 2 - this.windowHeight / 2;
    },
    getRelatedImagePosition(relatedImage) {
      switch (relatedImage.position) {
        case 1:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 4) / 2 - this.thumbnailHeight() / 2.1,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 1.5,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 - this.thumbnailHeight() / 2.1,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 1.5,
          ];
        case 2:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 2) / 2 - this.thumbnailHeight() / 2.1,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 1.5,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 - this.thumbnailHeight() / 2.1,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 1.5,
          ];
        case 3:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 2) / 2 + this.thumbnailHeight() / 4,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 3,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 + this.thumbnailHeight() / 4,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 3,
          ];
        case 4:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 2) / 2 + this.thumbnailHeight() / 4,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 3,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 + this.thumbnailHeight() / 4,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 3,
          ];
        case 5:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 2) / 2 + this.thumbnailHeight() * 1.4,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 1.5,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 + this.thumbnailHeight() * 1.4,
            this.defineLeftImagePosition() - this.thumbnailWidth() * 1.5,
          ];
        case 6:
          return relatedImage.hover ? [
            (this.pageHeight - this.thumbnailHeight() - this.thumbnailHeight() / 2) / 2 + this.thumbnailHeight() * 1.4,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 1.5,
          ] : [
            (this.pageHeight - this.thumbnailHeight()) / 2 + this.thumbnailHeight() * 1.4,
            this.defineLeftImagePosition() + this.thumbnailWidth() * 1.5,
          ];
        default:
          return [0, 0];
      }
    },
  },
  computed: {
    setPage() {
      return {
        height: this.pageHeight + "px",
        width: this.pageWidth + "px",
        cursor: "pointer",
        "user-select": "none",
      };
    },
    imageInformationPosition() {
      return {
        height: "40px",
        position: "absolute",
        top: this.defineTopImagePosition() - 40 + "px",
        left: this.defineLeftImagePosition() + "px",
        display: "flex",
      };
    },
    imagePosition() {
      return {
        position: "absolute",
        top: this.defineTopImagePosition() + "px",
        left: this.defineLeftImagePosition() + "px",
      };
    },
    relatedImagePosition1() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[0]
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.relatedImagesPosition[0].hover ? this.relatedThumbnailHeight() * 2 + "px" : this.relatedThumbnailHeight() + "px",
        width: this.relatedThumbnailWidth() + "px",
        transition: 'height 0.3s',
      };
    },
    relatedImagePosition2() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[1]
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.relatedImagesPosition[1].hover ? this.relatedThumbnailHeight() * 2 + "px" : this.relatedThumbnailHeight() + "px",
        width: this.relatedThumbnailWidth() + "px",
        transition: 'height 0.3s',
      };
    },
    relatedImagePosition3() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[2]
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.relatedImagesPosition[2].hover ? this.relatedThumbnailHeight() * 2 + "px" : this.relatedThumbnailHeight() + "px",
        width: this.relatedThumbnailWidth() + "px",
        transition: 'height 0.3s',
      };
    },
    fontSliderPosition() {
      return {
        position: "absolute",
        top: this.defineTopSliderPosition() + 75 + "px",
        left: this.defineLeftSliderPosition() + 33 + "px",
      };
    },
    sliderPosition() {
      return {
        position: "absolute",
        top: this.defineTopSliderPosition() + 30 + "px",
        left: this.defineLeftSliderPosition() + 32 + "px",
      };
    },
    scrollingDisplay() {
      return {
        overflow: "hidden",
        margin: 0,
        padding: 0,
      };
    },
    componentSize() {
      const height = this.carouselHover ? this.thumbnailHeight() : this.thumbnailHeight() / 2;
      return {
        height: height + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    imageUnzoomEffect() {
      return {
        "v-zoom": this.step !== 300,
        "v-unzoom": this.step === 300,
      };
    },
    // Setup image display and translation for the scrolling
    scrollingMovement() {
      return {
        "-webkit-transform":
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
        "-moz-transform":
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
        transform:
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
      };
    },
    // Base on the movement step and speed, select the right animation
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          this.speed <= 125 &&
          !this.isBeginning &&
          !this.isEnd &&
          (this.zoomingStep === 1 || this.zoomingStep === 2),
        zoomTransitionImageMedium:
          this.speed > 125 &&
          this.speed <= 1000 &&
          this.zoomingStep === 2 &&
          !this.isBeginning &&
          !this.isEnd,
        zoomTransitionImageSlow:
          this.speed > 1000 &&
          this.speed < 6000 &&
          this.zoomingStep === 2 &&
          !this.isBeginning &&
          !this.isEnd,
        unzoomTransitionImageFastEnd:
          this.shouldRunDecelerateAnimation && !this.isBeginning && !this.isEnd,
        unzoomTransitionImageFast:
          (this.speed > 125 && this.zoomingStep === 1) ||
          ((this.isBeginning || this.isEnd) &&
            this.shouldRunSideAnimation &&
            this.speed <= 125),
      };
    },
    selectSliderTransitionSpeed() {
      return {
        "v-museum-end": this.speed === 6000,
        "v-museum-025": this.speed === 4000,
        "v-museum-05": this.speed === 2000,
        "v-museum-075": this.speed === 1500,
        "v-museum-1": this.speed === 1000,
        "v-museum-1_5": this.speed === 750,
        "v-museum-2": this.speed === 500,
        "v-museum-3": this.speed === 375,
        "v-museum-4": this.speed === 250,
        "v-museum-8": this.speed === 125,
        "v-museum-16": this.speed === 62,
        "v-museum-20": this.speed === 50,
      };
    },

    selectArrayDisplay() {
      return {
        "v-start": this.isBeginning,
        "v-normal": !this.isBeginning && !this.isEnd,
        "v-end": this.isEnd,
      };
    },
    ...mapState(["images", "isLoadingImage", "relatedImages"]),
  },
  mounted() {
    // Use to find the ratio and to add the content correctly in the scroll and to know the translation size
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.rectangleHeight = this.thumbnailHeight() + 20;
    this.rectangleWidth = this.thumbnailWidth() + 20;

    window.scrollTo(
      this.defineLeftPositionCenterPage(),
      this.defineTopPositionCenterPage()
    );

    // The parameter for the year search will come from the previous selection view.
    // Currently, this value is hard-coded for testing purpose.
    this.$store.dispatch("initializeCarousel", {
      decade: "193",
    });
  },
};
</script>

<style scoped>
@import "./imageselector.css";
@import "./sliderspeed.css";
@import "./carouselAnimation.css";
</style>
