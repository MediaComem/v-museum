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
        ref="myCarousel"
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
import axios from "axios";
import { useWindowSize } from "vue-window-size";
import { mapState } from "vuex";

export default {
  name: "SliderComponent",
  watch: {
    images: function(newVal) {
      this.data = newVal;
      this.maxCarouselSize = this.data.length;
    },
    navPrevSize: function(newVal) {
      console.log(newVal);
      if (newVal !== 0) {
        this.carousel.setActiveItem(this.currentSlide + newVal);
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
      maxCarouselSize: 0,
      isLoading: false,
      currentSlide: 0,
      shouldUpdateIndex: false,
      retrieveLength: 0,
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
    },
    // Vitesse Max = 1 image toutes les 50ms
    changeImage(nextIndex) {
      switch (this.step) {
        case 0:
          this.getNextImages(nextIndex, 80, 100);
          break;
        case 1:
          this.getNextImages(nextIndex, 40, 500);
          break;
        case 2:
          this.getNextImages(nextIndex, 20, 1000);
          break;
        case 3:
          break;
        case 4:
          this.getPreviousImages(nextIndex, 20, 1000);
          break;
        case 5:
          this.getPreviousImages(nextIndex, 40, 500);
          break;
        case 6:
          this.getPreviousImages(nextIndex, 80, 100);
          break;
      }
    },

    initContent() {
      this.shouldUpdateIndex = true;
      // The parameter for the year search will come from the previous selection view.
      // Currently, this value is hard-coded for testing purpose.
      this.$store.dispatch("getInitState", {
        decade: "191",
      });
    },
    getPreviousImages(nextIndex, sizeBeforeLoad, intervalTransitionTime) {
      this.currentSlide = nextIndex;
      if (nextIndex < sizeBeforeLoad && !this.isLoading) {
        this.isLoading = true;
        this.shouldUpdateIndex = true;
        this.$store.dispatch("getPreviousContent");
        this.isLoading = false;
      }
      setTimeout(() => {
        this.carousel.prev();
      }, intervalTransitionTime);
    },
    getNextImages(nextIndex, sizeBeforeLoad, intervalTransitionTime) {
      this.currentSlide = nextIndex;
      if (
        nextIndex > this.maxCarouselSize - sizeBeforeLoad &&
        !this.isLoading
      ) {
        this.isLoading = true;
        this.$store.dispatch("getNextContent");
        this.isLoading = false;
      }
      setTimeout(() => {
        this.carousel.next();
      }, intervalTransitionTime);
    },
  },
  computed: mapState(["images", "navPrevSize"]),
  mounted() {
    // Due to the mandatory height for carousel element in vertical mode.
    // This lib is used for reponsive purpose
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    axios.defaults.withCredentials = true;
    this.carousel = this.$refs.myCarousel;
    //this.carousel.$el.addEventListener("wheel", this.mouseWheelAction);
    this.initContent();
  },
  unmounted() {
    //this.carousel.$el.removeEventListener("wheel", this.keyEvent);
  },
};
</script>

<style scoped>
@import "./imageselector.css";
</style>
