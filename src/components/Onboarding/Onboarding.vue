<template>
  <el-row :gutter="20" style="margin: 0;">
    <el-col :span="24" style="padding: 0;">
      <img class="first-image" src="@/assets/onboarding/first.png" />
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin: 0;">
    <el-col :span="12" :offset="6">
      <h1 class="page-title">{{ information.title }}</h1>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin: 0;">
    <el-col :span="12" :offset="6">
      <h2 class="page-subtitle">{{ information.subtitle }}</h2>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin: 0;">
    <el-col :span="8" :offset="8">
      <h3 class="text-title">{{ information.header }}</h3>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="margin: 0;">
    <el-col :span="8" :offset="8">
      <p class="text">{{ information.body }}</p>
    </el-col>
  </el-row>
  <el-carousel
    height="100vh"
    direction="vertical"
    :autoplay="false"
    ref="slider"
    :loop="false"
  >
    <el-carousel-item
      v-for="(item, index) in information.collection"
      :key="index"
    >
      <img
        style="height: 100vh; width: 100vw; z-index: -1;"
        :src="require(`../../assets/onboarding/${item.imagePath}`)"
      />
      <logo style="position: absolute; left: 2vw; top: 2vh" />
      <arrow-up class="arrow-up" @click="previousSlide()" />
      <div class="collection-position">
        <h2 class="collection-title">{{ item.title }}</h2>
        <p class="collection-text">{{ item.text }}</p>
        <onboarding-completion
          style="left: inherit"
          :decade="item.decade"
          @click="loadDecade(item.decade)"
        />
      </div>
      <arrow-down class="arrow-down" @click="nextSlide()" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import text from "@/assets/onboarding/text.json";
import Logo from "./Logo/Logo.vue";
import ArrowUp from "./Logo/ArrowUp.vue";
import ArrowDown from "./Logo/ArrowDown.vue";
import OnboardingCompletion from "./Logo/OnboadingCompletion.vue";

export default {
  name: "Onboarding",
  components: { Logo, ArrowUp, ArrowDown, OnboardingCompletion },
  data() {
    return {
      information: text,
    };
  },
  methods: {
    loadImage: function(path) {
      return require(path);
    },
    previousSlide() {
      this.$refs.slider.prev();
    },
    nextSlide() {
      this.$refs.slider.next();
    },
    loadDecade(decade) {
      this.$router.push({
        path: `/selector/${decade}`,
      });
    },
  },
};
</script>

<style scoped>
.page-title {
  font-size: 74.1515px;
}

.page-subtitle {
  font-size: 50px;
}

.text-title {
  font-size: 30px;
  text-align: left;
}

.text {
  font-size: 20px;
  text-align: left;
}

.collection-position {
  position: absolute;
  left: 60vw;
  top: 30vh;
}

.collection-title {
  font-size: 50px;
  text-align: left;
}

.collection-text {
  font-size: 22px;
  text-align: left;
}

.padding {
  padding: 0;
}

.first-image {
  width: 100vw;
  height: 75vh;
}

.collection-image {
  widows: 100vw;
}

.arrow-up {
  position: absolute;
  left: 95vw;
  top: 2vh;
}

.arrow-down {
  position: absolute;
  left: 95vw;
  top: 90vh;
}
</style>
