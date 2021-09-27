<template>
  <el-carousel
    :height="getSliderHeight"
    direction="vertical"
    :autoplay="false"
    ref="slider"
    :loop="false"
  >
    <el-carousel-item>
      <div ref="intro" class="slider-effect">
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
        <el-row>
          <el-col :span="8" :offset="8">
            <arrow-down
              style="justify-content: center"
              :text="undefined"
              @click="nextSlide()"
            />
          </el-col>
        </el-row>
      </div>
    </el-carousel-item>

    <el-carousel-item
      v-for="(item, index) in information.collection"
      :key="index"
      :style="{ background: item.color }"
    >
      <img
        class="slider-effect image-display"
        :src="`/onboarding/${item.imagePath}`"
      />
      <div
        class="collapse-transition"
        :style="collapse"
        style="position: absolute; left: 0px; top: 0px;"
      >
        <p class="collection-text collapse-text-align">{{ item.text }}</p>
      </div>
      <logo style="position: absolute; left: 2vw; top: 2vh" />
      <arrow-up
        v-if="shouldDisplay"
        class="arrow-up"
        :text="index === 0 ? mainTitle : information.collection[index - 1]"
        @click="previousSlide()"
      />
      <div v-if="shouldDisplay" class="collection-position">
        <h2 class="collection-title">{{ item.title }}</h2>
        <p class="collection-text">
          {{ item.text.slice(0, 180) }}
          <a class="more-link" @click="isCollapse = !isCollapse">MORE</a>
        </p>
        <onboarding-completion
          class="completion-element"
          :decade="item.decade"
          @click="loadDecade(item.decade)"
        />
      </div>
      <arrow-down
        v-if="index !== information.collection.length - 1 && shouldDisplay"
        class="arrow-down"
        :text="information.collection[index + 1]"
        @click="nextSlide()"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import text from "@/assets/onboarding/text.json";
import Logo from "./Logo/Logo.vue";
import ArrowUp from "./Logo/ArrowUp.vue";
import ArrowDown from "./Logo/ArrowDown.vue";
import OnboardingCompletion from "./Logo/OnboadingCompletion.vue";

export default {
  name: "Onboarding",
  components: { Logo, ArrowUp, ArrowDown, OnboardingCompletion },
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
      move: false,
      shouldDisplay: true,
      windowHeight: undefined,
      windowWidth: undefined,
    };
  },
  methods: {
    previousSlide() {
      this.move = true;
      this.shouldDisplay = false;
      setTimeout(() => {
        this.$refs.slider.prev();
        setTimeout(() => {
          this.move = false;
          this.slide = this.slide - 1;
          this.shouldDisplay = true;
        }, 500);
      }, 500);
    },
    nextSlide() {
      this.move = true;
      this.shouldDisplay = false;
      setTimeout(() => {
        this.$refs.slider.next();
        setTimeout(() => {
          this.move = false;
          this.slide = this.slide + 1;
          this.shouldDisplay = true;
        }, 500);
      }, 500);
    },
    loadDecade(decade) {
      this.$router.push({
        path: `/selector/${decade}`,
        query: { comeFromOnboarding: true },
      });
    },
    calculateSliderHeight() {
      switch (true) {
        case this.windowWidth >= 2000 && this.windowHeight >= 1500:
          return "150vh";
        case this.windowWidth >= 1400 && this.windowHeight >= 1100:
          return "170vh";
        case this.windowWidth >= 1000 && this.windowHeight >= 920:
          return "210vh";
        case this.windowWidth >= 800 && this.windowHeight >= 300:
          return "650vh";
        case this.windowWidth >= 700 && this.windowHeight >= 400:
          return "600vh";
        case this.windowWidth >= 600 && this.windowHeight >= 300:
          return "700vh";
        case this.windowWidth >= 500 && this.windowHeight >= 300:
          return "900vh";
        default:
          return "700vh";
      }
    },
  },
  computed: {
    getSliderHeight() {
      if (this.slide !== 0) {
        return "100vh";
      } else {
        return this.calculateSliderHeight();
      }
    },
    collapse() {
      return {
        "background-color":
          this.slide > 0
            ? this.information.collection[this.slide - 1].color
            : "white",
        height: "100vh",
        width: "57vw",
        transform: this.isCollapse ? "translateX(0)" : "translate(-57vw)",
      };
    },
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
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
  object-fit: cover;
}

.image-display {
  width: 57vw; 
  height: 100%; 
  left: 0; 
  position: absolute; 
  z-index: -1; 
  object-fit: cover;
}

.completion-element {
  position: absolute;
  left: 0;
}

.arrow-up {
  position: absolute;
  top: 2vh;
  width: 98vw;
  justify-content: end;
}

.arrow-down {
  position: absolute;
  top: 90vh;
  width: 98vw;
  justify-content: end;
}

.more-link {
  font-weight: bold;
  text-decoration: underline;
}

.collapse-text-align {
  text-align: justify;
  position: absolute;
  top: 20vh;
  margin: 3vw;
}

.collapse-transition {
  transition: transform;
  transition-duration: 1s;
  transition-timing-function: linear;
}

.slider-effect {
  transition: height 0.5s linear;
}

.el-carousel__item.is-animating {
  transition: transform 0.5s linear;
}
</style>
