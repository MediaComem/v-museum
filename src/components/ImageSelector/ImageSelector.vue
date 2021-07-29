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
        <el-carousel
          :height="(windowHeight / 6) * 4 + 'px'"
          direction="vertical"
          :loop="true"
          :autoplay="false"
          ref="carousel"
          :style="marginCarourel"
          :class="selectZoomAnimation"
          @change="changeImage"
        >
          <el-carousel-item
            v-for="(value, index) in data"
            :key="index"
            :class="selectSliderTransitionSpeed"
          >
            <img
              :ref="'image-' + index"
              class="custom-image"
              :src="value.imagePaths.large"
              :alt="value.id"
            />
          </el-carousel-item>
        </el-carousel>
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
          @change="releaseSlider"
          @input="sliderChange"
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
  name: "ImageSelector",
  watch: {
    images: function(newImages) {
      this.data = newImages;
      this.totalCarouselIndex = this.data.length;
      if (this.isInitialLoad) {
        this.$nextTick(() => {
          this.carousel.setActiveItem(0);
          this.isInitialLoad = false;
        });
      }
    },
  },
  data() {
    return {
      autoplay: false,
      previousSpeed: 0,
      currentIndex: 0,
      isInitialLoad: true,
      data: undefined,
      releaseStep: -1,
      previousStep: 3,
      zoomingStep: 3,
      step: 30,
      modifiedStep: 3,
      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      totalCarouselIndex: 0,
      currentSlide: 0,
      timeout: undefined,
    };
  },
  methods: {
    mouseWheelAction(event) {
      if (event.deltaY < 0) {
        this.getPreviousImages(this.currentSlide - 1, 80, 100);
      } else if (event.deltaY > 0) {
        this.getNextImages(this.currentSlide + 1, 80, 100);
      }
    },
    // This method reset some properties in case of the user release the slider
    releaseSlider(releaseStep) {
      this.previousStepElement = 30;
      this.zoomingStep = 2;
      this.releaseStep = releaseStep;
      this.step = 30;
      this.stopTimeout();
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
    isFirstMove(move) {
      return move && this.previousStep === 3;
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
          return 0;
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
    sliderChange() {
      this.changeImage(undefined);
    },
    changeImage(nextImageIndex) {
      if (nextImageIndex) {
        this.currentIndex = nextImageIndex;
      }
      this.modifiedStep =
        this.step > 30 ? Math.ceil(this.step / 10) : Math.floor(this.step / 10);
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

      const newSpeed = this.speedSelection();

      if (forward) {
        this.navigateNextImage(
          nextImageIndex,
          80,
          newSpeed,
          newSpeed !== this.previousSpeed
        );
      }

      if (backward) {
        this.navigatePreviousImage(
          nextImageIndex,
          newSpeed,
          newSpeed !== this.previousSpeed
        );
      }

      this.previousSpeed = newSpeed;
      // Keep track of this step for animation analysis purpose
      this.previousStep = this.modifiedStep;
    },
    navigatePreviousImage(nextImageIndex, intervalTransitionTime, speedChange) {
      if (speedChange) {
        this.stopTimeout();
        this.carousel.prev();
      }
      if (nextImageIndex) {
        this.stopTimeout();
      }
      this.timeout = setTimeout(
        () => this.carousel.prev(),
        intervalTransitionTime
      );
    },
    navigateNextImage(
      nextImageIndex,
      diffMaxIndexBeforeLoad,
      intervalTransitionTime,
      speedChange
    ) {
      if (
        nextImageIndex > this.totalCarouselIndex - diffMaxIndexBeforeLoad &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent");
      }
      if (speedChange) {
        this.stopTimeout();
        let image;
        if (this.carousel.activeIndex === this.totalCarouselIndex) {
          image = "image-" + 0;
        } else {
          image = "image-" + (this.carousel.data.activeIndex + 1);
        }
        console.log(this.$refs[image].getBoundingClientRect().y);
        this.carousel.next();
      }
      if (nextImageIndex) {
        this.stopTimeout();

        this.timeout = setTimeout(
          () => this.carousel.next(),
          intervalTransitionTime
        );
      }
    },
    stopTimeout() {
      clearTimeout(this.timeout);
    },
  },
  computed: {
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
        "v-museum-025":
          (this.step > 26 && this.step <= 29) ||
          (this.step < 34 && this.step >= 31),
        "v-museum-05":
          (this.step > 23 && this.step <= 26) ||
          (this.step < 37 && this.step >= 34),
        "v-museum-075":
          (this.step > 20 && this.step <= 23) ||
          (this.step < 40 && this.step >= 37),
        "v-museum-1":
          (this.step > 17 && this.step <= 20) ||
          (this.step < 44 && this.step >= 40),
        "v-museum-2":
          (this.step > 14 && this.step <= 17) ||
          (this.step < 48 && this.step >= 44),
        "v-museum-4":
          (this.step > 10 && this.step <= 14) ||
          (this.step < 51 && this.step >= 48),
        "v-museum-8":
          (this.step > 6 && this.step <= 10) ||
          (this.step < 54 && this.step >= 51),
        "v-museum-16":
          (this.step > 2 && this.step <= 6) ||
          (this.step < 58 && this.step >= 54),
        "v-museum-20": this.step <= 2 || this.step >= 58,
      };
    },
    marginCarourel() {
      return { marginTop: this.windowHeight / 14 + "px" };
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
@import "./sliderspeed.css";
</style>
