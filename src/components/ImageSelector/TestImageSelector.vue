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
          :style="{
            height: (windowHeight / 6) * 4 + 'px',
            width: (windowWidth / 24) * 6 + 'px',
          }"
        >
          <li
            :class="selectSliderTransitionSpeed"
            :style="imageStyle"
            v-for="(value, index) in data"
            :key="index"
            class="infinite-list-item"
          >
            <div
              :style="{
                height: (windowHeight / 6) * 4 + 'px',
                width: (windowWidth / 24) * 6 + 'px',
              }"
            >
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
          :max="60"
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
      this.totalCarouselIndex = this.data.length;
    },
    currentIndex: function(newVal) {
        console.log(newVal);
        if (this.isLooped && (newVal === 1 || newVal === this.totalCarouselIndex - 2 )){
            this.isLooped = false;
            if (newVal === 1){
                console.log("Start");
                this.currentIndex = this.currentIndex + 1;
            }
            else {
                console.log("END");
                this.currentIndex = this.currentIndex - 1;
            }
        }
    },
  },
  data() {
    return {
      isLooped: false,
      nbData: 2,
      speed: 6000,
      previousSpeed: 0,
      previousDirection: undefined,
      currentIndex: 0,
      data: undefined,
      releaseStep: -1,
      previousStep: 3,
      zoomingStep: 3,
      step: 30,
      modifiedStep: 3,
      windowHeight: undefined,
      windowWidth: undefined,
      totalCarouselIndex: 0,
      interval: [],
      globalTimeout: undefined,
    };
  },
  methods: {
    movingAnalysis(forward) {
      // Movement part
      if (forward) {
        if (this.currentIndex === this.totalCarouselIndex - 1) {
          this.isLooped = true;
          this.currentIndex = 0;
          setTimeout(() => this.currentIndex = this.currentIndex + 1, 50)
        } else {
          this.currentIndex = this.currentIndex + 1;
        }
      } else if (this.currentIndex === 0) {
        this.isLooped = true;
        this.currentIndex = this.totalCarouselIndex - 1;
        setTimeout(() => this.currentIndex = this.currentIndex - 1, 50)
      } else {
        this.currentIndex = this.currentIndex - 1;
      }
    },
    sliderChange() {
      this.modifiedStep =
        this.step > 30 ? Math.ceil(this.step / 10) : Math.floor(this.step / 10);
      if (this.step === 30) {
        setTimeout(() => {
          if (this.step === 30) {
            this.releaseSlider();
          }
        }, 200);
      } else {
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
      this.releaseStep =
        this.step > 30
          ? Math.ceil(releaseStep / 10)
          : Math.floor(releaseStep / 10);
      this.step = 30;
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

      this.speed = 6000;
      this.previousSpeed = 6000;
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
    translate() {
      return (
        "translateY(-" + (this.windowHeight / 6) * 4 * this.currentIndex + "px)"
      );
    },
    speedSelection() {
      // Moving carousel part
      switch (true) {
        case this.step <= 2:
          return 50;
        case this.step <= 6:
          return 62;
        case this.step <= 10:
          return 125;
        case this.step <= 14:
          return 250;
        case this.step <= 17:
          return 500;
        case this.step <= 20:
          return 1000;
        case this.step <= 23:
          return 1500;
        case this.step <= 26:
          return 2000;
        case this.step <= 29:
          return 4000;
        case this.step === 30:
          return 6000;
        case this.step <= 33:
          return 4000;
        case this.step <= 36:
          return 2000;
        case this.step <= 39:
          return 1500;
        case this.step <= 43:
          return 1000;
        case this.step <= 47:
          return 500;
        case this.step <= 50:
          return 250;
        case this.step <= 53:
          return 125;
        case this.step <= 57:
          return 62;
        case this.step <= 60:
          return 50;
      }
    },
  },
  computed: {
    imageStyle() {
      return {
        transform: this.translate(),
        height: (this.windowHeight / 6) * 4 + "px",
      };
    },
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
    // Due to the mandatory height for carousel element in vertical mode.
    // This lib is used for reponsive purpose
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.carousel = this.$refs.carousel;
    //this.carousel.$el.addEventListener("wheel", this.mouseWheelAction);

    // The parameter for the year search will come from the previous selection view.
    // Currently, this value is hard-coded for testing purpose.
    this.$store.dispatch("initializeCarousel", {
      decade: "191",
    });
  },
  unmounted() {
    //this.carousel.$el.removeEventListener("wheel", this.keyEvent);
  },
};
</script>

<style scoped>
@import "./imageselector.css";
@import "./sliderspeedTest.css";
</style>
