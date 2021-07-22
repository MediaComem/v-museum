<template>
  <el-row>
    <el-col :span="7">
      <div ref="position1">
        <related-image
          :image="firstImage"
          :display="displayFirstImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'bottom'"
          :justify="'end'"
        />
      </div>
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6"> </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="7">
      <div ref="position2">
        <related-image
          :image="secondImage"
          :display="displaySecondImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'bottom'"
          :justify="'start'"
        />
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
        <el-col :span="10">
          <el-row>
            <el-col :span="5">
              <p>333</p>
            </el-col>
            <el-col :span="5">
              <p class="year-font">1910's</p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="14">
          <el-row :justify="'end'">
            <p
              v-if="displayImageOrder.length >= 1 && step === 3"
              class="index-font data-information"
              :class="{
                removeRelatedImageBaseText: loadImageOrder.length >= 1,
              }"
            >
              {{ loadImages[0].tag["@value"] }} &nbsp;
            </p>
            <p
              v-if="displayImageOrder.length >= 2 && step === 3"
              class="index-font data-information"
              :class="{
                removeRelatedImageBaseText: loadImageOrder.length >= 2,
              }"
            >
              {{ loadImages[1].tag["@value"] }} &nbsp;
            </p>
            <p
              v-if="displayImageOrder.length >= 3 && step === 3"
              class="index-font data-information"
              :class="{
                removeRelatedImageBaseText: loadImageOrder.length >= 3,
              }"
            >
              {{ loadImages[2].tag["@value"] }} &nbsp;
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
      <div ref="position3">
        <related-image
          :image="thirdImage"
          :display="displayThirdImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'top'"
          :justify="'end'"
        />
      </div>
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
    <el-col :span="7">
      <div :style="{ marginLeft: windowWidth / 6 + 'px' }" ref="position4">
        <related-image
          :image="fourthImage"
          :display="displayFourthImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'middle'"
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
      <div ref="position5">
        <related-image
          :image="fifthImage"
          :display="displayFifthImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'top'"
          :justify="'end'"
        />
      </div>
    </el-col>
    <el-col :span="2"> </el-col>
    <el-col :span="6"> </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="7">
      <div ref="position6">
        <related-image
          :image="sixthImage"
          :display="displaySixthImage"
          :imageHeight="(windowHeight / 6) * 4"
          :imageWidth="(windowWidth / 24) * 6"
          :align="'top'"
          :justify="'start'"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { mapState } from "vuex";
import RelatedImage from "./RelatedImage/RelatedImage.vue";

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
      fourthImage: undefined,
      displayFourthImage: false,
      fifthImage: undefined,
      displayFifthImage: false,
      sixthImage: undefined,
      displaySixthImage: false,
      displayImageOrder: [],
      loadImageOrder: [],
      loadImages: [],
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
    // This method reset some properties in case of the user release the slider
    releaseSlider(releaseStep) {
      this.zoomingStep = 2;
      this.releaseStep = releaseStep;
      this.step = 3;
      this.stopChangeImageTimeout();
      this.$store.dispatch("loadRelatedImages", {
        tags: this.data[this.currentIndex].tags,
        id: this.data[this.currentIndex].id,
      });
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

      this.stopDisplayRelatedImages();
      
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
      this.displayFourthImage = false;
      this.displayFifthImage = false;
      this.displaySixthImage = false;
      this.firstImage = undefined;
      this.secondImage = undefined;
      this.thirdImage = undefined;
      this.fourthImage = undefined;
      this.fifthImage = undefined;
      this.sixthImage = undefined;
      this.displayImageOrder = [];
      this.loadImageOrder = [];
      this.loadImages = [];
      this.loadImages = [];
      this.displayRelatedImageTimeout.forEach(clearTimeout);
      this.displayRelatedImageTimeout = [];
    },
    setupDisplayRelatedImage(id) {
      switch (id) {
        case 1:
          this.displayFirstImage = true;
          break;
        case 2:
          this.displaySecondImage = true;
          break;
        case 3:
          this.displayThirdImage = true;
          break;
        case 4:
          this.displayFourthImage = true;
          break;
        case 5:
          this.displayFifthImage = true;
          break;
        case 6:
          this.displaySixthImage = true;
          break;
      }
      this.loadImageOrder.push(1);
    },
    displayRelatedImages(images) {
      let counter = 0;
      let positions = [1, 2, 3, 4, 5, 6]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      positions.forEach((position) => {
        switch (position) {
          case 1:
            this.firstImage = images[counter];
            this.displayImageOrder.push(1);
            break;
          case 2:
            this.secondImage = images[counter];
            this.displayImageOrder.push(2);
            break;
          case 3:
            this.thirdImage = images[counter];
            this.displayImageOrder.push(3);
            break;
          case 4:
            this.fourthImage = images[counter];
            this.displayImageOrder.push(4);
            break;
          case 5:
            this.fifthImage = images[counter];
            this.displayImageOrder.push(5);
            break;
          case 6:
            this.sixthImage = images[counter];
            this.displayImageOrder.push(6);
            break;
        }
        this.loadImages.push(images[counter]);
        counter++;
      });
      this.$nextTick(() => {
        this.displayRelatedImageTimeout.push(
          setTimeout(
            () => this.setupDisplayRelatedImage(this.displayImageOrder[0]),
            1000
          )
        );
        this.displayRelatedImageTimeout.push(
          setTimeout(
            () => this.setupDisplayRelatedImage(this.displayImageOrder[1]),
            3000
          )
        );
        this.displayRelatedImageTimeout.push(
          setTimeout(
            () => this.setupDisplayRelatedImage(this.displayImageOrder[2]),
            5000
          )
        );
      });
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
@import "./carouselAnimation.css";
@import "./relatedImageAnimation.css";
</style>
