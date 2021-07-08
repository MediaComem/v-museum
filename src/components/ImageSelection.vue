<template>
  <el-row :gutter="10"> </el-row>
  <el-row :gutter="10" :align="'middle'">
    <el-col :xs="10" :sm="9" :md="8" :lg="8" :xl="8"> </el-col>
    <el-col :xs="3" :sm="5" :md="7" :lg="8" :xl="8">
      <el-carousel
        v-bind:height="windowHeight + 'px'"
        direction="vertical"
        :loop="false"
        :autoplay="false"
        ref="myCarousel"
        class="custom-carousel"
        v-on:change="changeImage"
      >
        <el-carousel-item v-for="(value, index) in data" :key="index">
          <img
            class="custom-image"
            v-bind:src="value.imagePaths.large"
            v-bind:alt="value.imagePaths.large"
          />
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
      <el-row :justify="'center'" :align="'bottom'">
        <el-slider
          vertical
          v-model="step"
          height="100px"
          :max="6"
          :show-tooltip="false"
          v-on:change="rangeChange"
          v-on:input="changeImage"
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

export default {
  name: "SliderComponent",
  watch: {
    inLoading: function(state) {
      if (!state && this.shouldUpdateIndex) {
        this.currentSlide = this.currentSlide + this.retrieveLength;
        this.carousel.setActiveItem(this.currentSlide);
        this.shouldUpdateIndex = false;
      }
    },
  },
  data() {
    return {
      data: [],
      step: 3,
      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      maxCarouselSize: 0,
      inLoading: false,
      currentSlide: 0,
      shouldUpdateIndex: false,
      retrieveLength: 0,
    };
  },
  methods: {
    async initContent() {
      try {
        const response = await axios.get(
          "http://localhost:3000/getInitContent/193",
          {
            headers: {
              withCredentials: true,
            },
          }
        );
        this.data = response.data;
        this.maxCarouselSize = this.data.length;
        this.$nextTick(() => {
          this.carousel.setActiveItem(this.maxCarouselSize / 2);
        });
      } catch (err) {
        console.log(err);
      }
    },
    async loadPreviousContent() {
      try {
        this.shouldUpdateIndex = true;
        const response = await axios.get(
          "http://localhost:3000/getPreviousContent",
          {
            headers: {
              withCredentials: true,
            },
          }
        );
        if (response.data.length > 0) {
          this.data = response.data.concat(this.data);
          this.retrieveLength = response.data.length;
          this.maxCarouselSize = this.data.length;
        }
        this.inLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async loadNextContent() {
      try {
        const response = await axios.get(
          "http://localhost:3000/getNextContent",
          {
            headers: {
              withCredentials: true,
            },
          }
        );
        if (response.data.length > 0) {
          this.data = this.data.concat(response.data);
          this.maxCarouselSize = this.data.length;
        }
        this.inLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    rangeChange() {
      this.step = 3;
    },
    // Vitesse Max = 1 image toutes les 20ms
    changeImage(nextIndex) {
      this.currentSlide = nextIndex;
      switch (this.step) {
        case 0:
          if (nextIndex > this.maxCarouselSize - 80 && !this.inLoading) {
            this.inLoading = true;
            this.loadNextContent();
          }
          setTimeout(() => this.carousel.next(), 100);
          break;
        case 1:
          if (nextIndex > this.maxCarouselSize - 40 && !this.inLoading) {
            this.inLoading = true;
            this.loadNextContent();
          }
          setTimeout(() => this.carousel.next(), 500);
          break;
        case 2:
          if (nextIndex > this.maxCarouselSize - 20 && !this.inLoading) {
            this.inLoading = true;
            this.loadNextContent();
          }
          setTimeout(() => this.carousel.next(), 1000);
          break;
        case 3:
          break;
        case 4:
          if (nextIndex < 20 && !this.inLoading) {
            this.inLoading = true;
            this.loadPreviousContent();
          }
          setTimeout(() => this.carousel.prev(), 1000);
          break;
        case 5:
          if (nextIndex < 40 && !this.inLoading) {
            this.inLoading = true;
            this.loadPreviousContent();
          }
          setTimeout(() => this.carousel.prev(), 500);
          break;
        case 6:
          if (nextIndex < 80 && !this.inLoading) {
            this.inLoading = true;
            this.loadPreviousContent();
          }
          setTimeout(() => this.carousel.prev(), 100);
          break;
      }
    },
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    axios.defaults.withCredentials = true;
    this.carousel = this.$refs.myCarousel;
    this.initContent();
  },
};
</script>

<style>
.custom-image {
  height: 100%;
  width: 100%;
}

.custom-carousel {
  margin-top: 0%;
  margin-bottom: 0%;
}

.el-carousel__item {
  overflow: hidden !important;
}

.el-carousel__item.is-animating {
  -webkit-transition: -webkit-transform 0.1s ease-in-out;
  transition: -webkit-transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out, -webkit-transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out, -webkit-transform 0.1s ease-in-out;
}

.el-carousel__indicators--vertical {
  width: 0px;
  height: 0px;
}

.el-slider__bar {
  background-color: unset;
}

.el-slider__runway {
  background-color: unset;
}

.el-slider__button {
  -moz-border-radius: 30px;
  -webkit-border-radius: 30px;
  border-radius: 30px;

  border-color: #c0c4cc;
  border: 1px #c0c4cc;
  height: 700%;
  width: 100%;
  background-color: inherit;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;
}
</style>
