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
          :loop="false"
          :autoplay="false"
          ref="carousel"
          class="custom-carousel"
          :style="marginCarourel"
          :class="selectZoomAnimation"
          @change="changeImage"
        >
          <el-carousel-item v-for="(value, index) in data" :key="index">
            <img
              ref="image"
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
          :max="6"
          :show-tooltip="false"
          @change="releaseSlider"
          @input="changeImage"
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
      isInitialLoad: true,
      data: undefined,
      releaseStep: -1,
      previousStep: 3,
      zoomingStep: 3,
      step: 3,
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
      this.zoomingStep = 2;
      this.releaseStep = releaseStep;
      this.step = 3;
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
    changeImage(nextImageIndex) {
      // In case of we move to top for animation analysis purpose
      const forward = this.step < 3;
      let slower = this.step - this.previousStep >= 1;
      let faster = this.step - this.previousStep <= -1;
      this.animationStepAnalysis(forward, faster, slower);

      // In case of we move to bottom for animation analysis purpose
      const backward = this.step > 3;
      faster = this.step - this.previousStep >= 1;
      slower = this.step - this.previousStep <= -1;
      this.animationStepAnalysis(backward, faster, slower);

      // Moving carousel part
      switch (this.step) {
        case 0:
          this.navigateNextImage(nextImageIndex, 80, 50);
          break;
        case 1:
          this.navigateNextImage(nextImageIndex, 40, 250);
          break;
        case 2:
          this.navigateNextImage(nextImageIndex, 20, 1000);
          break;
        case 3:
          this.stopTimeout();
          break;
        case 4:
          this.navigatePreviousImage(1000);
          break;
        case 5:
          this.navigatePreviousImage(250);
          break;
        case 6:
          this.navigatePreviousImage(50);
          break;
      }
      // Keep track of this step for animation analysis purpose
      this.previousStep = this.step;
    },
    navigatePreviousImage(intervalTransitionTime) {
      this.stopTimeout();
      this.timeout = setTimeout(() => {
        this.carousel.prev();
      }, intervalTransitionTime);
    },
    navigateNextImage(
      nextImageIndex,
      diffMaxIndexBeforeLoad,
      intervalTransitionTime
    ) {
      this.currentSlide = nextImageIndex;
      if (
        nextImageIndex > this.totalCarouselIndex - diffMaxIndexBeforeLoad &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent");
      }
      this.stopTimeout();
      this.timeout = setTimeout(() => {
        this.carousel.next();
      }, intervalTransitionTime);
    },
    stopTimeout() {
      clearTimeout(this.timeout);
    },
  },
  computed: {
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          (this.step === 0 || this.step === 6) && this.zoomingStep === 2,
        zoomTransitionImageMedium:
          (this.step === 1 || this.step === 5) && this.zoomingStep === 2,
        zoomTransitionImageSlow:
          (this.step === 2 || this.step === 4) &&
          (this.zoomingStep === 2 || this.zoomingStep === 1),
        unzoomTransitionImageFastEnd:
          this.step === 3 && (this.releaseStep === 0 || this.releaseStep === 6),
        unzoomTransitionImageFast:
          (this.step === 1 || this.step === 5) && this.zoomingStep === 1,
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
</style>
