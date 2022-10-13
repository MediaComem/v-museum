<template>
  <div ref="intro" class="overflow" style="height: 100vh;">
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
    <el-row
      :gutter="20"
      :justify="'center'"
      class="margin-text"
      style="text-align: center"
    >
      <router-link to="/about" custom v-slot="{ navigate, href }">
        <a class="link" :href="href" @click="navigate">About this website</a>
      </router-link>
    </el-row>
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <h3 class="text-title">{{ information.header }}</h3>
    </el-row>
    <el-row :gutter="20" :justify="'center'" style="margin: 5px;">
      <p class="text">{{ information.body }}</p>
    </el-row>
    <el-row :justify="'center'" :style="padding">
      <arrow-down
        style="justify-content: center"
        :text="undefined"
        :isFull="true"
        :isMobile="false"
        @click="$emit('changeSlide', 'decade-0')"
      />
    </el-row>
  </div>
</template>

<script>
import ArrowDown from '../Logo/ArrowDown.vue';

export default {
  components: { ArrowDown },
  props: {
    information: Object,
  },
  emits: ['changeSlide'],
  computed: {
    padding() {
      return {
        'padding-bottom': this.isSafariIphone ? '100px' : '5vh',
      }
    },
  },
};
</script>

<style scoped>
@import '../onboarding.css';
@import './introduction_slide.css';
</style>
