<template>
  <el-row :gutter="10" :align="'middle'">
    <el-col :span="9"> </el-col>
    <el-col :span="6" :style="sliderPosition">
      <div class="sliderMask">
        <ul
          :class="selectZoomAnimation"
          class="infinite-list slider-mask"
          style=""
          :style="[componentSize, scrollingDisplay]"
        >
          <li
            :class="selectSliderTransitionSpeed"
            :style="scrollingMovement"
            v-for="(value, index) in data"
            :key="index"
            class="infinite-list-item"
          >
            <div :style="componentSize">
              <img
                :style="imageDisplay"
                :ref="'image-' + index"
                :src="value.imagePaths.square"
                :alt="value.id"
              />
            </div>
          </li>
        </ul>
      </div>
    </el-col>
    <el-col :span="2">
      <el-row :justify="'center'" :align="'middle'">
        <el-slider
          ref="slider"
          vertical
          v-model="step"
          :height="windowHeight / 5 + 'px'"
          :max="600"
          :show-tooltip="false"
          @input="sliderChange"
          @change="releaseSlider"
        >
        </el-slider>
      </el-row>
    </el-col>
    <el-col :span="7"> </el-col>
  </el-row>
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
      // This part analyse if the loop transition is necessary and reset it after.
      if (this.isLooped && (newVal === 1 || newVal === this.data.length - 2)) {
        this.isLooped = false;
        if (newVal === 1) {
          this.currentIndex = this.currentIndex + 1;
        } else {
          this.currentIndex = this.currentIndex - 1;
        }
      }
    },
  },
  data() {
    return {
      data: undefined,
      // Use to know if we are in the loop process
      isLooped: false,
      // Information uses to manage the movement
      step: 300,
      speed: 6000,
      previousSpeed: 0,
      previousDirection: undefined,
      currentIndex: 0,
      // Information uses to manage the animations
      releaseStep: -1,
      zoomingStep: 3,
      // Information uses to manage the display
      windowHeight: undefined,
      windowWidth: undefined,
      // Management of the interval and timeout process
      interval: [],
      timeout: undefined,
    };
  },
  methods: {
    heightValue() {
      return (this.windowHeight / 6) * 4;
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
        if (this.currentIndex === this.data.length - 1) {
          this.loop(1, 0);
        } else {
          // Move the scroll
          this.currentIndex = this.currentIndex + 1;
        }
      }
      // Loop the scroll
      else if (this.currentIndex === 0) {
        this.loop(-1, this.data.length - 1);
      } else {
        // Move the scroll
        this.currentIndex = this.currentIndex - 1;
      }
    },
    movementAnalysis(newSpeed, direction) {
      if (
        newSpeed !== this.previousSpeed ||
        this.previousDirection !== direction
      ) {
        this.stopInterval();
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.move(direction), 50);
        this.speed = newSpeed;
        this.interval.push(
          setInterval(() => {
            this.move(direction);
          }, this.speed)
        );
      }
    },
    sliderChange() {
      if (this.isStop()) {
        clearTimeout(this.timeout);
        // Wait to ensure that we are stopped in the stopping step and not change the direction
        this.timeout = setTimeout(() => {
          if (this.isStop()) {
            this.releaseSlider(300);
          }
        }, 200);
      } else {
        const newSpeed = this.speedSelection();
        this.animationStepAnalysis(newSpeed);

        const direction = this.step <= 290;
        this.movementAnalysis(newSpeed, direction);

        // Keep track of the state for next step of the slider change
        this.previousSpeed = newSpeed;
        this.previousDirection = direction;
      }
    },
    getBackPreviousPosition() {
      const transitionPosition = this.$refs[
        "image-" + this.currentIndex
      ].getBoundingClientRect().y;
      if (
        this.previousDirection &&
        transitionPosition > 0 &&
        transitionPosition > this.heightValue() / 2 &&
        this.currentIndex !== 0
      ) {
        this.currentIndex = this.currentIndex - 1;
      } else if (
        !this.previousDirection &&
        transitionPosition < 0 &&
        transitionPosition < -(this.heightValue() / 2)
      ) {
        this.currentIndex = this.currentIndex + 1;
      }
    },
    releaseSlider(releaseStep) {
      // Reset Interval and Timeout
      clearTimeout(this.timeout);
      this.stopInterval();

      // This part analyze where we are in the sliding process to get back to the previous image in case we stop the slider.
      this.getBackPreviousPosition();

      // Reset movement and animation parameters
      if (releaseStep < 100 || releaseStep > 500) {
        this.releaseStep = 0;
      }
      this.step = 300;
      this.zoomingStep = -1;
      this.speed = 6000;
      this.previousSpeed = 0;
      this.previousDirection = undefined;
    },
    animationStepAnalysis(speed) {
      if (this.previousSpeed > speed) {
        this.releaseStep = -1;
        this.zoomingStep = 2;
      } else if (this.previousSpeed <= 125 && this.previousSpeed !== 0) {
        this.zoomingStep = 1;
      } else if (this.previousSpeed < speed && this.speed > 1000) {
        this.zoomingStep = 2;
      }
    },
    stopInterval() {
      this.interval.forEach(clearInterval);
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
  },
  computed: {
    sliderPosition() {
      return {
        marginTop: this.windowHeight / 10 + "px",
        marginBottom: this.windowHeight / 10 + "px",
      };
    },
    imageDisplay() {
      return {
        height: this.heightValue() + "px",
        transform: "translateX(-" + (this.windowWidth / 24) * 1.5 + "px)",
      };
    },
    scrollingDisplay() {
      return {
        overflow: "hidden",
        padding: 0,
      };
    },
    componentSize() {
      return {
        height: this.heightValue() + "px",
        width: (this.windowWidth / 24) * 6 + "px",
      };
    },
    // Setup image display and translation for the scrolling
    scrollingMovement() {
      return {
        transform:
          "translateY(-" + this.heightValue() * this.currentIndex + "px)",
        height: this.heightValue() + "px",
      };
    },
    // Base on the movement step and speed, select the right animation
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          this.speed <= 125 &&
          (this.zoomingStep === 1 || this.zoomingStep === 2),
        zoomTransitionImageMedium:
          this.speed > 125 && this.speed <= 1000 && this.zoomingStep === 2,
        zoomTransitionImageSlow:
          this.speed > 1000 && this.speed < 6000 && this.zoomingStep === 2,
        unzoomTransitionImageFastEnd:
          this.speed === 6000 && this.releaseStep === 0,
        unzoomTransitionImageFast: this.speed > 125 && this.zoomingStep === 1,
      };
    },
    selectSliderTransitionSpeed() {
      return {
        "v-museum-none": this.isLooped,
        "v-museum-end": this.speed === 6000 && !this.isLooped,
        "v-museum-025": this.speed === 4000 && !this.isLooped,
        "v-museum-05": this.speed === 2000 && !this.isLooped,
        "v-museum-075": this.speed === 1500 && !this.isLooped,
        "v-museum-1": this.speed === 1000 && !this.isLooped,
        "v-museum-2": this.speed === 500 && !this.isLooped,
        "v-museum-4": this.speed === 250 && !this.isLooped,
        "v-museum-8": this.speed === 125 && !this.isLooped,
        "v-museum-16": this.speed === 62 && !this.isLooped,
        "v-museum-20": this.speed === 50 && !this.isLooped,
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
