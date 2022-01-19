<template>
  <div
    ref="intro"
    class="overflow"
    style="height: 100vh;"
    @scroll="scrollMove"
    @touchend="changeSlide"
    @mousewheel="wheelMove"
  >
    <el-row :gutter="20" style="margin: 0">
      <el-col :span="24" style="padding: 0">
        <img class="first-image" src="@/assets/onboarding/first.png" />
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      :justify="'center'"
      class="margin-text"
      style="text-align: center"
    >
      <h1 class="page-title">{{ information.title }}</h1>
    </el-row>
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <h2 class="page-subtitle">{{ information.subtitle }}</h2>
    </el-row>
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <h3 class="text-title">{{ information.header }}</h3>
    </el-row>
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <p class="text">{{ information.body }}</p>
    </el-row>
    <el-row :justify="'center'" style="padding-bottom: 5vh">
      <arrow-down
        style="justify-content: center"
        :text="undefined"
        :isFull="true"
        :isMobile="false"
        @next-slide="$emit('nextSlide')"
      />
    </el-row>
  </div>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import ArrowDown from "../Logo/ArrowDown.vue";
export default {
  components: { ArrowDown },
  emits: ["nextSlide"],
  props: {
    information: Object,
  },
  data() {
    return {
      windowHeight: undefined,
      couldLoadNextSlide: false,
      changeSlideInProgress: false,
      delayBeforeAction: 0,
    };
  },
  methods: {
    scrollMove() {
      if (
        this.$refs["intro"].scrollHeight ===
        this.$refs["intro"].scrollTop + this.windowHeight
      ) {
        this.couldLoadNextSlide = true;
        this.changeSlideInProgress = false;
        this.delayBeforeAction = Date.now();
      } else {
        this.couldLoadNextSlide = false;
      }
    },
    wheelMove(event) {
      const diffTime = Date.now() - this.delayBeforeAction;
      if (this.couldLoadNextSlide && event.deltaY > 0 && diffTime > 1000 && !this.changeSlideInProgress) {
        this.changeSlideInProgress = true;
        this.$emit("nextSlide");
        // This timeout is used to ensure that only one action is take into account when long wheel has been used.
        setTimeout(() => this.changeSlideInProgress = false, 2000)
      }
    },
    changeSlide() {
      const diffTime = Date.now() - this.delayBeforeAction;
      if (this.couldLoadNextSlide && diffTime > 1000) {
        this.$emit("nextSlide");
      }
    },
  },
  mounted() {
    const { height } = useWindowSize();
    this.windowHeight = height;
  },
};
</script>

<style scoped>
@import "../onboarding.css";
@import "./introduction_slide.css";
</style>
