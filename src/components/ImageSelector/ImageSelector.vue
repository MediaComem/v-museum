<template>
  <!--el-row :class="{ customTransitionMask: step !== 3 }" :gutter="10" :align="'middle'"-->
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
    },
    nbItemsLoadInThePast: function(nbItemsLoad) {
      if (nbItemsLoad !== 0) {
        this.carousel.setActiveItem(this.currentSlide + nbItemsLoad);
      }
    },
  },
  data() {
    return {
      data: undefined,
      step: 3,
      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      totalCarouselIndex: 0,
      isLoading: false,
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
    rangeChange() {
      this.step = 3;
      this.stopTimeout();
    },
    // Vitesse Max = 1 image toutes les 50ms: Devra être fait Peut-être avec un 4ème cran
    changeImage(nextImageIndex) {
      switch (this.step) {
        case 0:
          this.loadNextImages(nextImageIndex, 80, 100);
          break;
        case 1:
          this.loadNextImages(nextImageIndex, 40, 500);
          break;
        case 2:
          this.loadNextImages(nextImageIndex, 20, 1000);
          break;
        case 3:
          this.stopTimeout();
          break;
        case 4:
          this.loadPreviousImages(nextImageIndex, 20, 1000);
          break;
        case 5:
          this.loadPreviousImages(nextImageIndex, 40, 500);
          break;
        case 6:
          this.loadPreviousImages(nextImageIndex, 80, 100);
          break;
      }
    },
    loadPreviousImages(nextImageIndex, indexOfLoading, intervalTransitionTime) {
      this.currentSlide = nextImageIndex;
      if (nextImageIndex < indexOfLoading && !this.isLoadingImage) {
        this.$store.dispatch("loadPreviousContent");
      }
      this.timeout = setTimeout(() => {
        this.carousel.prev();
      }, intervalTransitionTime);
    },
    loadNextImages(
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
  computed: mapState(["images", "nbItemsLoadInThePast", "isLoadingImage"]),
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
