<template>
  <el-carousel
    :height="windowHeight + 'px'"
    direction="vertical"
    :autoplay="false"
    style="background-color: lightgray"
  >
    <el-carousel-item v-for="item in 4" :key="item">
      <el-row :gutter="10" :align="'middle'">
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <el-button
            type="info"
            :style="{
              height: windowHeight / 6 + 'px',
              width: windowWidth / 4 + 'px',
            }"
            >1990</el-button
          >
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row :gutter="10" :align="'middle'">
        <el-col :span="8"> </el-col>
        <el-col :span="8" :justify="'center'">
          <el-button
            type="info"
            :style="{
              height: windowHeight / 6 + 'px',
              width: windowWidth / 4 + 'px',
            }"
            >1990</el-button
          >
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row :gutter="10" :align="'middle'">
        <el-col :span="8"> </el-col>
        <el-col :span="8">
          <div :style="{ heigth: windowHeight / 3 + 'px' }">
            <el-button
              type="info"
              :style="{
                height: windowHeight / 6 + 'px',
                width: windowWidth / 4 + 'px',
              }">1990</el-button>
          </div>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
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
    };
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    console.log(this.windowHeight);
  },
};
</script>

<style scoped>
@import "./home.css";
</style>
