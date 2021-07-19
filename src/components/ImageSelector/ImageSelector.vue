<template>
  <el-row :gutter="10" :align="'middle'">
    <el-col :xs="10" :sm="9" :md="8" :lg="8" :xl="8"> </el-col>
    <el-col
      :xs="3"
      :sm="5"
      :md="7"
      :lg="8"
      :xl="8"
      :style="{
        marginTop: windowHeight / 10 + 'px',
        marginBottom: windowHeight / 10 + 'px',
      }"
    >
      <el-carousel
        :height="(windowHeight / 5) * 4 + 'px'"
        direction="vertical"
        :loop="false"
        :autoplay="false"
        ref="carousel"
        class="custom-carousel"
        :class="{
          zoomTransitionImageFast, sliderMask:
            (step === 0 || step === 6) && zoomingStep === 3,
          zoomTransitionImageMedium:
            (step === 1 || step === 5) && zoomingStep === 3,
          zoomTransitionImageSlow:
            (step === 2 || step === 4) && zoomingStep === 3,
          unzoomTransitionImageSlow:
            step === 3 &&
            (releaseStep === 2 ||
              releaseStep == 4 ||
              (step === 3 && zoomingStep === 0)),
          unzoomTransitionImageMedium:
            (step === 2 || step === 4) && zoomingStep === 1,
          unzoomTransitionImageMediumEnd:
            step === 3 &&
            zoomingStep === 3 &&
            (releaseStep === 1 || releaseStep === 5),
          unzoomTransitionImageFast:
            (step === 1 || step === 5) && zoomingStep === 2,
          unzoomTransitionImageFastEnd:
            step === 3 &&
            zoomingStep === 3 &&
            (releaseStep === 0 || releaseStep === 6),
        }"
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
    </el-col>
    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
      <el-row :justify="'center'" :align="'middle'">
        <el-slider
          ref="slider"
          vertical
          v-model="step"
          :height="windowHeight / 5 + 'px'"
          :max="6"
          :show-tooltip="false"
          @change="rangeChange"
          @input="changeImage"
        >
        </el-slider>
      </el-row>
    </el-col>
    <el-col :xs="9" :sm="8" :md="7" :lg="6" :xl="6"> </el-col>
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
    rangeChange(releaseStep) {
      this.zoomingStep = 3;
      this.releaseStep = releaseStep;
      this.step = 3;
      this.stopTimeout();
    },
    // Vitesse Max = 1 image toutes les 50ms: Devra être fait Peut-être avec un 4ème cran
    changeImage(nextImageIndex) {
      switch (this.step) {
        case 0:
          if (this.previousStep === 1) {
            this.zoomingStep = 3;
          }
          this.navigateNextImage(nextImageIndex, 80, 100);
          break;
        case 1:
          if (this.previousStep === 2) {
            this.zoomingStep = 3;
          }
          if (this.previousStep === 0) {
            this.zoomingStep = 2;
          }
          this.navigateNextImage(nextImageIndex, 40, 500);
          break;
        case 2:
          if (this.previousStep === 3) {
            this.zoomingStep = 3;
          }
          if (this.previousStep === 1) {
            this.zoomingStep = 1;
          }
          this.navigateNextImage(nextImageIndex, 20, 1000);
          break;
        case 3:
          if (this.previousStep === 4 || this.previousStep === 2) {
            this.zoomingStep = 0;
          }
          this.stopTimeout();
          break;
        case 4:
          if (this.previousStep === 3) {
            this.zoomingStep = 3;
          }
          if (this.previousStep === 5) {
            this.zoomingStep = 1;
          }
          this.navigatePreviousImage(1000);
          break;
        case 5:
          if (this.previousStep === 4) {
            this.zoomingStep = 3;
          }
          if (this.previousStep === 6) {
            this.zoomingStep = 2;
          }
          this.navigatePreviousImage(500);
          break;
        case 6:
          if (this.previousStep === 5) {
            this.zoomingStep = 3;
          }
          this.navigatePreviousImage(100);
          break;
      }
      this.previousStep = this.step;
    },

    navigatePreviousImage(intervalTransitionTime) {
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
      this.timeout = setTimeout(() => {
        this.carousel.next();
      }, intervalTransitionTime);
    },
    stopTimeout() {
      clearTimeout(this.timeout);
    },
  },
  computed: mapState(["images", "isLoadingImage"]),
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
