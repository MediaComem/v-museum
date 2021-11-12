<template>
  <el-carousel
    :height="'100vh'"
    direction="vertical"
    :autoplay="false"
    ref="slider"
    :indicator-position="'none'"
    :loop="false"
  >
    <el-carousel-item>
      <introduction-slide
        :information="information"
        @next-slide="nextSlide()"
      />
    </el-carousel-item>

    <el-carousel-item
      v-for="(item, index) in information.collection"
      :key="index"
      :style="{ background: item.color }"
    >
      <div v-if="!isMobile">
        <desktop-slide
          :information="information"
          :index="index"
          :item="item"
          :isFullSize="isFullSize"
          :mainTitle="mainTitle"
          @load-decade="loadDecade"
          @previous-slide="previousSlide()"
          @next-slide="nextSlide()"
        />
      </div>

      <div v-if="isMobile">
        <mobile-slide
          :information="information"
          :index="index"
          :item="item"
          :isFullSize="isFullSize"
          :mainTitle="mainTitle"
          @load-decade="loadDecade"
          @previous-slide="previousSlide()"
          @next-slide="nextSlide()"
        />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { useWindowSize } from "vue-window-size";

import IntroductionSlide from "./Slide/IntroductionSlide.vue";
import DesktopSlide from "./Slide/DesktopSlide.vue";
import MobileSlide from "./Slide/MobileSlide.vue";

import text from "@/assets/onboarding/text.json";

export default {
  name: "Onboarding",
  components: {
    IntroductionSlide,
    DesktopSlide,
    MobileSlide,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.decade = from.params.decade;
    });
  },
  data() {
    return {
      mainTitle: { title: "INTRODUCTION" },
      information: text,
      isCollapse: false,
      slide: 0,
      decade: undefined,
      windowHeight: undefined,
      windowWidth: undefined,
    };
  },
  methods: {
    previousSlide() {
      const animationDuration = this.isCollapse ? 300 : 0;
      this.isCollapse = false;
      setTimeout(() => {
        this.$refs.slider.prev();
        this.slide = this.slide - 1;
      }, animationDuration);
    },
    nextSlide() {
      const animationDuration = this.isCollapse ? 300 : 0;
      this.isCollapse = false;
      setTimeout(() => {
        this.slide = this.slide + 1;
        this.$refs.slider.next();
      }, animationDuration);
    },
    loadDecade(decade) {
      console.log("TEST")
      this.$router.push({
        path: `/selector/${decade}`,
      });
    },
    findAndUpdateDecade() {
      if (this.decade) {
        const index = this.information.collection.findIndex((e) => {
          return e.decade == this.decade;
        });
        this.$nextTick(() => {
          this.slide = index + 1;
          this.$refs.slider.setActiveItem(index + 1);
        });
      }
    },
  },
  computed: {
    isMobile() {
      return this.windowWidth < 600;
    },
    isFullSize() {
      return this.windowWidth > 1200;
    },
  },
  activated() {
    this.findAndUpdateDecade();
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    this.findAndUpdateDecade();
  },
};
</script>

<style scoped>
@import "./onboarding.css";
</style>
