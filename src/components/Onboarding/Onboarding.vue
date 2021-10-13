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
      <div ref="intro" style="height: 100vh; overflow-y: scroll">
        <el-row :gutter="20" style="margin: 0;">
          <el-col :span="24" style="padding: 0;">
            <img class="first-image" src="@/assets/onboarding/first.png" />
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          :justify="'center'"
          style="margin:5px; text-align: center"
        >
          <h1 class="page-title">{{ information.title }}</h1>
        </el-row>
        <el-row :gutter="20" :justify="'center'" style="margin:5px">
          <h2 class="page-subtitle">{{ information.subtitle }}</h2>
        </el-row>
        <el-row :gutter="20" :justify="'center'" style="margin:5px">
          <h3 class="text-title">{{ information.header }}</h3>
        </el-row>
        <el-row :gutter="20" :justify="'center'" style="margin:5px">
          <p class="text">{{ information.body }}</p>
        </el-row>
        <el-row :justify="'center'" style="padding-bottom: 10px">
          <arrow-down
            style="justify-content: center"
            :text="undefined"
            :isFull="true"
            :isMobile="false"
            @click="nextSlide()"
          />
        </el-row>
      </div>
    </el-carousel-item>

    <el-carousel-item
      v-for="(item, index) in information.collection"
      :key="index"
      :style="{ background: item.color }"
    >
      <div v-if="!isMobile">
        <img
          class="image-display"
          :src="`/v-museum/onboarding/${item.imagePath}`"
        />
        <div
          class="collapse-transition"
          :style="collapse"
          style="position: absolute; left: 0px; top: 0px; height: 100vh; overflow-y:scroll"
        >
          <p class="collection-text collapse-text-align">{{ item.text }}</p>
        </div>
        <logo style="position: absolute; left: 2vw; top: 2vh" />
        <arrow-up
          :isFull="isFullSize"
          :isMobile="false"
          class="arrow-up"
          :text="index === 0 ? mainTitle : information.collection[index - 1]"
          @click="previousSlide()"
        />
        <div class="collection-position">
          <el-row>
            <h2
              :class="
                isFullSize
                  ? 'collection-title'
                  : 'collection-title-intermediary'
              "
            >
              {{ item.title }}
            </h2>
          </el-row>
          <el-row>
            <p
              :class="
                isFullSize ? 'collection-text' : 'collection-text-intermediary'
              "
            >
              {{ item.text.slice(0, 180) }}
              <a class="more-link" @click="isCollapse = !isCollapse">MORE</a>
            </p>
          </el-row>
          <el-row style="height: 69px; width: 37vw">
            <onboarding-completion
              class="completion-element"
              :decade="item.decade"
              @click="loadDecade(item.decade)"
            />
          </el-row>
        </div>
        <arrow-down
          v-if="index !== information.collection.length - 1"
          class="arrow-down"
          :isMobile="false"
          :isFull="isFullSize"
          :text="information.collection[index + 1]"
          @click="nextSlide()"
        />
      </div>

      <div v-if="isMobile">
        <div
          class="collapse-transition"
          :style="collapseMobile"
          style="position: absolute; left: 0px; top: 0px; z-index:1;"
        >
          <el-row :align="'middle'">
            <el-col :span="21">
              <h2 class="collection-title-mobile mobile-margin">
                {{ item.title }}
              </h2>
            </el-col>
            <el-col :span="3">
              <img
                src="@/assets/shared/cross.svg"
                @click="isCollapse = !isCollapse"
              />
            </el-col>
          </el-row>
          <el-row>
            <div style="height: 85vh; overflow: scroll">
              <p class="collection-text-mobile collapse-text-align-mobile">
                {{ item.text }}
              </p>
            </div>
          </el-row>
        </div>
        <el-row>
          <img
            class="image-display-mobile"
            :src="`/v-museum/onboarding/${item.imagePath}`"
          />
        </el-row>
        <arrow-up
          :isMobile="true"
          :isFull="false"
          class="arrow-up"
          :text="index === 0 ? mainTitle : information.collection[index - 1]"
          @click="previousSlide()"
        />
        <el-row>
          <h2 class="collection-title-mobile mobile-margin">
            {{ item.title }}
          </h2>
        </el-row>
        <el-row class="completion-element-mobile mobile-margin">
          <onboarding-completion
            class="completion-element"
            :decade="item.decade"
            @click="loadDecade(item.decade)"
          />
        </el-row>
        <el-row>
          <p class="collection-text-mobile mobile-margin">
            {{ item.text.slice(0, 180) }}
            <a class="more-link" @click="isCollapse = !isCollapse">MORE</a>
          </p>
        </el-row>
        <el-row class="arrow-down-mobile">
          <arrow-down
            v-if="index !== information.collection.length - 1"
            :isMobile="true"
            :isFull="false"
            :text="information.collection[index + 1]"
            @click="nextSlide()"
          />
        </el-row>
      </div>
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
      this.$router.push({
        path: `/selector/${decade}`,
      });
    },
  },
  computed: {
    isMobile() {
      return this.windowWidth < 600;
    },
    isFullSize() {
      return this.windowWidth > 1200;
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
    collapseMobile() {
      return {
        "background-color":
          this.slide > 0
            ? this.information.collection[this.slide - 1].color
            : "white",
        height: "100vh",
        width: "100vw",
        transform: this.isCollapse ? "translateX(0)" : "translate(-100vw)",
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
h1 {
  font-weight: normal;
}

h2 {
  font-weight: normal;
}

h3 {
  font-weight: normal;
  margin-bottom: 0;
}

@media only screen and (min-width: 300px) and (max-width: 699px) {
  .page-title {
    font-size: 40px;
    max-width: 60rem;
  }

  .page-subtitle {
    font-size: 30px;
    max-width: 60rem;
    text-align: center;
  }

  .text-title {
    font-size: 20px;
    text-align: left;
    max-width: 35rem;
  }
}

@media only screen and (min-width: 700px) {
  .page-title {
    font-size: 74.1515px;
    max-width: 60rem;
  }

  .page-subtitle {
    font-size: 50px;
    max-width: 60rem;
    text-align: center;
  }

  .text-title {
    font-size: 30px;
    text-align: left;
    max-width: 35rem;
  }
}

.text {
  font-size: 20px;
  text-align: left;
  max-width: 35rem;
}

.collection-position {
  width: 37vw;
  height: 80vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  position: absolute;
  left: 60vw;
  top: 10vh;
}

.collection-title {
  font-size: 50px;
  text-align: left;
  max-width: 35em;
}

.collection-title-intermediary {
  font-size: 36px;
  text-align: left;
  max-width: 35em;
}

.collection-title-mobile {
  font-size: 22px;
  text-align: left;
  max-width: 35em;
}

.collection-text {
  font-size: 22px;
  text-align: left;
  max-width: 35em;
}

.collection-text-intermediary {
  font-size: 18px;
  text-align: left;
  max-width: 35em;
}

.collection-text-mobile {
  font-size: 15px;
  text-align: left;
  max-width: 35em;
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

.image-display-mobile {
  width: 100vw;
  height: 50vh;
  object-fit: cover;
}

.completion-element {
  position: absolute;
  left: 0;
}

.completion-element-mobile {
  height: 69px;
}

.mobile-margin {
  margin-left: 3vw;
  margin-right: 3vw;
}

.arrow-up {
  position: absolute;
  top: 2vh;
  width: 98vw;
  justify-content: flex-end;
}

.arrow-down {
  position: absolute;
  top: 90vh;
  width: 98vw;
  justify-content: flex-end;
}

.arrow-down-mobile {
  width: 98vw;
  justify-content: flex-end;
  position: absolute;
  top: 95vh;
}

.more-link {
  font-weight: bold;
  text-decoration: underline;
}

.collapse-text-align {
  text-align: left;
  position: absolute;
  top: 20vh;
  margin: 3vw;
  max-width: 35em;
}

.collapse-text-align-mobile {
  text-align: left;
  margin: 3vw;
  max-width: 35em;
}

.collapse-transition {
  transition: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.el-carousel__item.is-animating {
  transition: transform 0.5s ease-in-out;
}
</style>
