<template>
  <el-carousel
    ref="carousel"
    :height="windowHeight + 'px'"
    direction="vertical"
    :autoplay="false"
    style="background-color: lightgray"
  >
    <el-carousel-item v-for="item in 4" :key="item">
      <el-row :gutter="10" :align="'top'">
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <div
            class="unset-rectangle"
            :style="{
              height: windowHeight / 3 + 'px',
              width: windowWidth / 3 + 'px',
            }"
          >
          <div class="top-display">
            <p class="text-font">1930</p>
            <el-button
              class="scroll-button"
              type="info"
              @keyup.up="carousel.prev()"
              @click="carousel.prev()"
              ><i class="el-icon-top icon-arrow"></i
            ></el-button>
          </div>
            
          </div>
        </el-col>
        <el-col :span="8">
          <div
            class="unset-rectangle"
            :style="{
              height: windowHeight / 3 + 'px',
              width: windowWidth / 3 + 'px',
            }"
          >
            <div
              class="el-icon-info icon-infos"
              @mouseover="hover"
              @mouseleave="leave"
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" :align="'middle'">
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <el-button
            @click="loadDecade"
            @keypress.enter="loadDecade"
            class="rectangle"
            :style="{
              height: windowHeight / 3 + 'px',
              width: windowWidth / 3 + 'px',
            }"
          >
            <p class="rectangle-text">1940</p>
          </el-button>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row :gutter="10" :align="'bottom'">
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <div
            class="unset-rectangle"
            :style="{
              height: windowHeight / 3 + 'px',
              width: windowWidth / 3 + 'px',
            }"
          >
            <div class="bottom-display">
              <el-button
                class="scroll-button"
                type="info"
                @keyup.down="carousel.next()"
                @click="carousel.next()"
                ><i class="el-icon-bottom icon-arrow"></i
              ></el-button>
              <p class="text-font">1950</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-drawer title="I am the title" v-model="drawer" :with-header="false">
        <span>Hi there!</span>
      </el-drawer>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { useWindowSize } from "vue-window-size";
export default {
  name: "Home",
  data() {
    return {
      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      drawer: false,
    };
  },
  methods: {
    hover() {
      console.log(22);
      this.drawer = false;
    },
    loadDecade() {
      console.log(33);
    },
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    this.carousel = this.$refs.carousel;
  },
};
</script>

<style scoped>
@import "./home.css";
</style>
