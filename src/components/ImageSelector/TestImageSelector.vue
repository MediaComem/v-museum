<template>
  <el-row :gutter="10" :align="'middle'">
    <el-col :span="9"> </el-col>
    <el-col
      :span="6"
      :style="{
        marginTop: windowHeight / 10 + 'px',
        marginBottom: windowHeight / 10 + 'px',
      }"
    >
      <div class="sliderMask">
        <ul
          :class="selectZoomAnimation"
          class="infinite-list slider-mask"
          style="overflow: hidden; padding: 0"
          :style="componentSize"
        >
          <li
            :class="selectSliderTransitionSpeed"
            :style="imageStyle"
            v-for="(value, index) in data"
            :key="index"
            class="infinite-list-item"
          >
            <div :style="componentSize">
              <img
                :style="{
                  height: (windowHeight / 6) * 4 + 'px',
                  transform: 'translateX(-' + (windowWidth / 24) * 1.5 + 'px)',
                }"
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
      if (
        this.isLooped &&
        (newVal === 1 || newVal === this.data.length - 2)
      ) {
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
      previousStep: 3,
      previousDirection: undefined,
      currentIndex: 0,
      // Information uses to manage the animations
      releaseStep: -1,
      modifiedStep: 3,
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
    movingAnalysis(forward) {
      // Loading more content if necessary
      if (
        this.currentIndex > this.data.length - 80 &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent");
      }

      // Movement part
      if (forward) {
        // Loop the scroll
        if (this.currentIndex === this.data.length - 1) {
          this.isLooped = true;
          this.currentIndex = 0;
          this.timeout = setTimeout(
            () => (this.currentIndex = this.currentIndex + 1),
            100
          );
        } else {
          // Move the scroll
          this.currentIndex = this.currentIndex + 1;
        }
      }
      // Loop the scroll
      else if (this.currentIndex === 0) {
        this.isLooped = true;
        this.currentIndex = this.data.length - 1;
        this.timeout = setTimeout(
          () => (this.currentIndex = this.currentIndex - 1),
          100
        );
      } else {
        // Move the scroll
        this.currentIndex = this.currentIndex - 1;
      }
    },
    sliderChange() {
      if (this.step > 290 && this.step < 310) {
        setTimeout(() => {
          if (this.step > 290 && this.step < 310) {
            this.releaseSlider(300);
          }
        }, 200);
      } else {
        // Calculate the attribute uses to define the right animation
        this.modifiedStep =
        this.step > 300
          ? Math.ceil(this.step / 100)
          : Math.floor(this.step / 100);
        // In case of we move to top for animation analysis purpose
        const forward = this.modifiedStep < 3;
        let slower = this.modifiedStep - this.previousStep >= 1;
        let faster = this.modifiedStep - this.previousStep <= -1;
        this.animationStepAnalysis(forward, faster, slower);
        // In case of we move to bottom for animation analysis purpose
        const backward = this.modifiedStep > 3;
        faster = this.modifiedStep - this.previousStep >= 1;
        slower = this.modifiedStep - this.previousStep <= -1;
        this.animationStepAnalysis(backward, faster, slower);

        // Manage the movement
        const newSpeed = this.speedSelection();
        if (
          newSpeed !== this.previousSpeed ||
          this.previousDirection !== forward
        ) {
          this.interval.forEach(clearInterval);
          this.interval = [];
          if (this.previousDirection && this.previousDirection !== forward) {
            this.movingAnalysis(forward);
          }
          if (
            this.speed > newSpeed ||
            !this.previousDirection ||
            this.previousDirection !== forward
          ) {
            this.movingAnalysis(forward);
          }
          this.speed = newSpeed;
          this.interval.push(
            setInterval(() => {
              this.movingAnalysis(forward);
            }, this.speed)
          );
        }

        // Keep track of the state for next step of the slider change
        this.previousSpeed = newSpeed;
        this.previousDirection = forward;
        this.previousStep = this.modifiedStep;
      }
    },
    releaseSlider(releaseStep) {
      // Start reset parameters part
      clearTimeout(this.timeout);
      if (releaseStep < 100 || releaseStep > 500) {
        this.releaseStep = 0;
      }
      this.step = 300;
      this.zoomingStep = 2;
      this.interval.forEach(clearInterval);
      this.interval = [];

      // This part analyze where we are in the sliding process to get back to the previous image in case we stop the slider.
      const transitionPosition = this.$refs[
        "image-" + this.currentIndex
      ].getBoundingClientRect().y;
      if (
        this.previousDirection &&
        transitionPosition > 0 &&
        transitionPosition > ((this.windowHeight / 6) * 4) / 2 &&
        this.currentIndex !== 0
      ) {
        this.currentIndex = this.currentIndex - 1;
      } else if (
        !this.previousDirection &&
        transitionPosition < 0 &&
        transitionPosition < ((-this.windowHeight / 6) * 4) / 2
      ) {
        this.currentIndex = this.currentIndex + 1;
      }

      // End of reset parameters part
      this.speed = 6000;
      this.previousSpeed = 0;
      this.previousDirection = undefined;
    },
    animationStepAnalysis(move, faster, slower) {
      if (move) {
        if (faster) {
          this.releaseStep = -1;
          this.zoomingStep = 2;
        } else if (slower) {
          this.zoomingStep = 1;
        }
      }
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
    componentSize() {
      return {
        height: (this.windowHeight / 6) * 4 + "px",
        width: (this.windowWidth / 24) * 6 + "px",
      };
    },
    // Setup image display and translation for the scrolling
    imageStyle() {
      return {
        transform:
          "translateY(-" +
          (this.windowHeight / 6) * 4 * this.currentIndex +
          "px)",
        height: (this.windowHeight / 6) * 4 + "px",
      };
    },
    // Base on the movement step and speed, select the right animation
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          (this.modifiedStep === 0 || this.modifiedStep === 6) &&
          this.zoomingStep === 2,
        zoomTransitionImageMedium:
          (this.modifiedStep === 1 || this.modifiedStep === 5) &&
          this.zoomingStep === 2,
        zoomTransitionImageSlow:
          (this.modifiedStep === 2 || this.modifiedStep === 4) &&
          (this.zoomingStep === 2 || this.zoomingStep === 1),
        unzoomTransitionImageFastEnd:
          this.modifiedStep === 3 &&
          (this.releaseStep === 0 || this.releaseStep === 6),
        unzoomTransitionImageFast:
          (this.modifiedStep === 1 || this.modifiedStep === 5) &&
          this.zoomingStep === 1,
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
