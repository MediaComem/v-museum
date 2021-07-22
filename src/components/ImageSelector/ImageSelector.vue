<template>
  <el-row>
    <el-col :span="7">
      <related-image
        :image="firstImage"
        :display="displayFirstImage"
        :imageHeight="(windowHeight / 6) * 4"
        :align="'bottom'"
        :justify="'end'"
      />
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6"> </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="7">
      <div ref="position 2">
      <!--related-image
        :image="firstImage"
        :display="displayFirstImage"
        :imageHeight="(windowHeight / 6) * 4"
        :align="'bottom'"
        :justify="'start'"
      /-->
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="7"> </el-col>
    <el-col :span="2"> </el-col>
    <el-col
      :span="6"
      :style="{ marginTop: windowHeight / 14 + 'px' }"
      :align="'bottom'"
    >
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <p>333</p>
            </el-col>
            <el-col :span="6">
              <p>1910's</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row :justify="'end'">
            <p
              v-if="firstImage && step === 3"
              class="index-font data-information"
              :class="{ removeRelatedImageBaseText: displayFirstImage }"
            >
              {{ firstImage.tag["@value"] }} &nbsp;
            </p>
            <p
              v-if="secondImage && step === 3"
              class="index-font data-information"
              :class="{ removeRelatedImageBaseText: displaySecondImage }"
            >
              {{ secondImage.tag["@value"] }} &nbsp;
            </p>
            <p
              v-if="thirdImage && step === 3"
              class="index-font data-information"
              :class="{ removeRelatedImageBaseText: displayThirdImage }"
            >
              {{ thirdImage.tag["@value"] }} &nbsp;
            </p>
            <p class="index-font data-information">
              {{ currentIndex + 1 }}
            </p>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="7"> </el-col>
  </el-row>
  <el-row :gutter="10" :align="'middle'">
    <el-col :span="7">
      <!--div>
        <related-image
          :image="secondImage"
          :display="displaySecondImage"
          :imageHeight="(windowHeight / 6) * 4"
          :align="'top'"
          :justify="'end'"
        />
      </div-->
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6">
      <div class="sliderMask">
        <el-carousel
          :indicator-position="'none'"
          :height="(windowHeight / 6) * 4 + 'px'"
          direction="vertical"
          :loop="false"
          :autoplay="false"
          ref="carousel"
          :class="{
            zoomTransitionImageFast:
              (step === 0 || step === 6) && zoomingStep === 3,
            zoomTransitionImageMedium:
              (step === 1 || step === 5) && zoomingStep === 3,
            zoomTransitionImageSlow:
              (step === 2 || step === 4) && zoomingStep === 3,
            unzoomTransitionImageFastEnd:
              step === 3 &&
              zoomingStep === 3 &&
              (releaseStep === 0 || releaseStep === 6),
            unzoomTransitionImageFast:
              (step === 1 || step === 5) && zoomingStep === 2,
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
          @change="rangeChange"
          @input="changeImage"
        >
        </el-slider>
      </el-row>
    </el-col>
    <el-col :span="7">
      <div :style="{ marginLeft: windowWidth / 6 + 'px' }">
        <related-image
          :image="secondImage"
          :display="displaySecondImage"
          :imageHeight="(windowHeight / 6) * 4"
          :align="'top'"
          :justify="'start'"
        />
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="7"> </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6">
      <el-row>
        <p v-if="data" class="data-information">
          {{ data[currentIndex].author }} <br />
          {{ data[currentIndex].medium }}
        </p>
      </el-row>
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="7"> </el-col>
  </el-row>
  <el-row>
    <el-col :span="7">
      <related-image
        :image="thirdImage"
        :display="displayThirdImage"
        :imageHeight="(windowHeight / 6) * 4"
        :align="'top'"
        :justify="'end'"
      />
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6"> </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="7">
      <!--related-image
        :image="thirdImage"
        :display="displayThirdImage"
        :imageHeight="(windowHeight / 6) * 4"
        :align="'top'"
        :justify="'start'"
      /-->
    </el-col>
  </el-row>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { mapState } from "vuex";
import RelatedImage from "./RelatedImage.vue";

export default {
  name: "ImageSelector",
  components: { RelatedImage },
  watch: {
    images: function(newImages) {
      this.data = newImages;
      this.totalCarouselIndex = this.data.length;
      if (this.isInitialLoad) {
        this.$nextTick(() => {
          this.carousel.setActiveItem(0);
          this.isInitialLoad = false;
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
        });
      }
    },
    relatedImages: function(images) {
      this.displayRelatedImages(images);
    },
  },
  data() {
    return {
      firstImage: undefined,
      displayFirstImage: false,
      secondImage: undefined,
      displaySecondImage: false,
      thirdImage: undefined,
      displayThirdImage: false,
      displayRelatedImageTimeout: [],

      isInitialLoad: true,
      data: undefined,
      currentIndex: 0,
      releaseStep: -1,
      previousStep: 3,
      zoomingStep: 3,
      step: 3,

      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      totalCarouselIndex: 0,
      currentSlide: 0,
      
      changeImageTimeout: undefined,
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
      this.stopChangeImageTimeout();
      this.$store.dispatch("loadRelatedImages", {
        tags: this.data[this.currentIndex].tags,
        id: this.data[this.currentIndex].id,
      });
    },
    // Vitesse Max = 1 image toutes les 50ms: Devra être fait Peut-être avec un 4ème cran
    changeImage(nextImageIndex) {
      this.stopDisplayRelatedImages();
      switch (this.step) {
        case 0:
          if (this.previousStep === 1) {
            this.zoomingStep = 3;
          }
          this.navigateNextImage(nextImageIndex, 80, 50);
          break;
        case 1:
          if (this.previousStep === 2) {
            this.zoomingStep = 3;
          }
          if (this.previousStep === 0) {
            this.zoomingStep = 2;
          }
          this.navigateNextImage(nextImageIndex, 40, 250);
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
          this.stopChangeImageTimeout();
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
          this.navigatePreviousImage(250);
          break;
        case 6:
          if (this.previousStep === 5) {
            this.zoomingStep = 3;
          }
          this.navigatePreviousImage(50);
          break;
      }
      this.previousStep = this.step;
    },

    navigatePreviousImage(intervalTransitionTime) {
      if (this.currentIndex > 0) {
        this.stopChangeImageTimeout();
        this.changeImageTimeout = setTimeout(() => {
          this.carousel.prev();
          this.currentIndex = this.currentIndex - 1;
        }, intervalTransitionTime);
      }
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
      if (this.currentIndex < this.totalCarouselIndex - 1) {
        this.stopChangeImageTimeout();
        this.changeImageTimeout = setTimeout(() => {
          this.carousel.next();
          this.currentIndex = this.currentIndex + 1;
        }, intervalTransitionTime);
      }
    },
    stopChangeImageTimeout() {
      clearTimeout(this.changeImageTimeout);
    },
    stopDisplayRelatedImages() {
      this.displayFirstImage = false;
      this.displaySecondImage = false;
      this.displayThirdImage = false;
      this.firstImage = undefined;
      this.secondImage = undefined;
      this.thirdImage = undefined;
      this.displayRelatedImageTimeout.forEach(clearTimeout);
      this.displayRelatedImageTimeout = [];
    },
    displayRelatedImages(images) {
      this.firstImage = images[0];
      this.secondImage = images[1];
      this.thirdImage = images[2];
      console.log(this.$refs);
      this.$nextTick(() => {
        this.displayRelatedImageTimeout.push(
          setTimeout(() => (this.displayFirstImage = true), 1000)
        );
        this.displayRelatedImageTimeout.push(
          setTimeout(() => (this.displaySecondImage = true), 3000)
        );
        this.displayRelatedImageTimeout.push(
          setTimeout(() => (this.displayThirdImage = true), 5000)
        );
      });
    },
  },
  computed: mapState(["images", "isLoadingImage", "relatedImages"]),
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
@import "./carouselAnimation.css";
@import "./relatedImageAnimation.css";
</style>
