<template>
  <div :style="setPage">
    <div :style="imagePosition">
      <h3 style="margin: 0; height: 30px;">{{ currentIndex + 1 }}</h3>
      <div :style="[componentSize]" style="overflow:hidden;" class="sliderMask">
        <div :style="componentSize" :class="selectZoomAnimation">
          <ul
            ref="ul-image"
            :class="selectSliderTransitionSpeed"
            :style="[scrollingDisplay, scrollingMovement]"
          >
            <li
              v-for="(value, index) in data"
              :key="index"
              :style="[componentSize]"
              :ref="'li-' + index"
            >
              <div :style="componentSize">
                <img
                  style="object-fit: none"
                  :style="[componentSize]"
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
    <div :style="sliderPosition">
      <el-slider
        :class="selectArrayDisplay"
        style="width: 42px"
        ref="slider"
        vertical
        v-model="step"
        :height="'150px'"
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

export default {
  name: "TestImageSelector",
  watch: {
    images: function(newImages) {
      this.data = newImages;
    },
    currentIndex: function(newVal) {
      this.isBeginning = newVal === 0;
      this.isEnd = newVal === this.data.length - 1;
      this.shouldRunSideAnimation = this.isBeginning || this.isEnd;
    },
  },
  data() {
    return {
      isBeginning: true,
      isEnd: false,
      shouldRunSideAnimation: false,
      shouldRunDecelerateAnimation: false,
      data: undefined,
      // Information uses to manage the movement
      step: 300,
      speed: 6000,
      previousSpeed: 0,
      previousDirection: undefined,
      currentIndex: 0,
      // Information uses to manage the animations
      releaseStep: -1,
      zoomingStep: 3,
      nbImageMove: 0,
      // Information uses to manage the display
      windowHeight: undefined,
      windowWidth: undefined,
      // Management of the interval and timeout process
      interval: [],
      timeout: undefined,
      decelerateTimouts: [],
    };
  },
  methods: {
    heightValue() {
      return 17 * 4 * this.defineReponsiveFactor();
    },
    widthValue() {
      return 9 * 4 * this.defineReponsiveFactor();
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
    loop(move, index) {
      this.isLooped = true;
      this.currentIndex = index;
      // Use to ensure that no stop occurs when we loop
      this.timeout = setTimeout(
        () => (this.currentIndex = this.currentIndex + move),
        100
      );
    },
    move(forward) {
      this.loadMoreContent(80);

      if (forward) {
        // Loop the scroll
        if (this.currentIndex !== this.data.length - 1) {
          this.currentIndex = this.currentIndex + 1;
        }
      }
      // Loop the scroll
      else if (this.currentIndex !== 0) {
        this.currentIndex = this.currentIndex - 1;
      }
      // This incrementation is to manage the animation
      this.nbImageMove = this.nbImageMove + 1;
    },
    launchMovement(newSpeed, direction) {
      //if (this.$refs["ul-image"].classList.value === "v-museum-end") {
      this.move(direction);
      //}
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
        clearTimeout(this.timeout);
        this.timeout = undefined;
        this.stopInterval();
        this.launchMovement(newSpeed, direction);
      }
    },
    sliderChange() {
      // Release animation
      if (
        this.previousSpeed === 0 &&
        this.releaseStep === 0 &&
        this.step !== 300
      ) {
        this.releaseStep = -1;
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
          setTimeout(() => this.shouldRunDecelerateAnimation = false, 1000);
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
        case this.step <= 170:
          return 500;
        case this.step <= 200:
          return 1000;
        case this.step <= 230:
          return 1500;
        case this.step <= 260:
          return 2000;
        case this.step <= 290:
          return 4000;
        case this.step > 290 && this.step < 310:
          return 6000;
        case this.step <= 330:
          return 4000;
        case this.step <= 360:
          return 2000;
        case this.step <= 390:
          return 1500;
        case this.step <= 430:
          return 1000;
        case this.step <= 470:
          return 500;
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
      return (this.windowHeight - this.heightValue()) / 2;
    },
    defineLeftImagePosition() {
      return (this.windowWidth - this.widthValue()) / 2;
    },
    defineTopSliderPosition() {
      return (
        (this.windowHeight - this.heightValue()) / 2 +
        this.heightValue() / 2 -
        75
      );
    },
    defineLeftSliderPosition() {
      return this.windowWidth / 2 + this.widthValue() / 2;
    },
  },
  computed: {
    setPage() {
      return {
        height: this.windowHeight + "px",
        width: this.windowWidth + "px",
      };
    },
    imagePosition() {
      return {
        position: "absolute",
        top: this.defineTopImagePosition() - 30 + "px",
        left: this.defineLeftImagePosition() + "px",
      };
    },
    sliderPosition() {
      return {
        position: "absolute",
        top: this.defineTopSliderPosition() + "px",
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
      return {
        height: this.heightValue() + "px",
        width: 9 * 4 * this.defineReponsiveFactor() + "px",
      };
    },
    // Setup image display and translation for the scrolling
    scrollingMovement() {
      return {
        "-webkit-transform":
          "translateY(-" + this.heightValue() * this.currentIndex + "px)",
        "-moz-transform":
          "translateY(-" + this.heightValue() * this.currentIndex + "px)",
        transform:
          "translateY(-" + this.heightValue() * this.currentIndex + "px)",
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
        "v-museum-2": this.speed === 500,
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
    ...mapState(["images", "isLoadingImage"]),
  },
  mounted() {
    // Use to find the ratio and to add the content correctly in the scroll and to know the translation size
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

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
@import "./sliderspeedTest.css";
</style>
