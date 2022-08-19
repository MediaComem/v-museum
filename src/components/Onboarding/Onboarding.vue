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
          :allTagText="allTagText"
          @load-tag-view="loadTagView"
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
          :allTagText="allTagText"
          @load-tag-view="loadTagView"
          @previous-slide="previousSlide()"
          @next-slide="nextSlide()"
        />
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <tags-slide
        :isFullSize="isFullSize"
        :isMobile="isMobile"
        :arrowText="information.collection[information.collection.length - 1]"
        @previous-slide="previousSlide()"
        @load-tag-view="loadTagView"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { useWindowSize } from "vue-window-size";

import IntroductionSlide from "./Slide/IntroductionSlide.vue";
import DesktopSlide from "./Slide/DesktopSlide.vue";
import MobileSlide from "./Slide/MobileSlide.vue";
import TagsSlide from "./Slide/TagsSlide.vue";
import { mapGetters } from "vuex";

import text from "@/assets/onboarding/text.json";

export default {
  name: "Onboarding",
  components: {
    IntroductionSlide,
    DesktopSlide,
    MobileSlide,
    TagsSlide,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.query.tag) {
        vm.tag = decodeURIComponent(from.query.tag);
      }
    });
  },
  data() {
    return {
      mainTitle: { title: "INTRODUCTION" },
      allTagText: { title: "ALL TAGS" },
      information: text,
      isCollapse: false,
      slide: 0,
      tag: undefined,
      windowHeight: undefined,
      windowWidth: undefined,
      slideMoveDiffTime: 0,
    };
  },
  methods: {
    previousSlide() {
      // Process only one event and wait in case of multiple events are sent in short period of time
      const currentTime = Date.now();
      const diffTime = currentTime - this.slideMoveDiffTime;
      if (diffTime > 1000) {
        const animationDuration = this.isCollapse ? 300 : 0;
        this.isCollapse = false;
        setTimeout(() => {
          this.$refs.slider.prev();
          this.slide = this.slide - 1;
        }, animationDuration);
      }
    },
    nextSlide() {
      // Process only one event and wait in case of multiple events are sent in short period of time
      const diffTime = Date.now() - this.slideMoveDiffTime;
      if (diffTime > 1000) {
        const animationDuration = this.isCollapse ? 300 : 0;
        this.isCollapse = false;
        setTimeout(() => {
          this.slide = this.slide + 1;
          this.$refs.slider.next();
          this.slideMoveDiffTime = Date.now();
        }, animationDuration);
      }
    },
    loadTagView(tag) {
      this.$store.dispatch('setFullTagPageOrigin', '1900s_slide')
      this.$router.push({
        path: `/full_tag`,
        query: { tag: encodeURIComponent(tag.tag) },
      });
    },
    findAndUpdateTag() {
      if (this.tag) {
        let index = 0;
        index = this.information.collection.findIndex((e) => {
          return e.tag.tag == this.tag;
        });
        if (index === -1) {
          index = this.information.collection.length;
        }
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
    ...mapGetters({
      origin: "getFullTagPageOrigin",
    }),
  },
  activated() {
    //Hack to force tags_slide return from fullImage, if it was initiated by tags_slide exploration
    if(this.origin == 'tags_slide') {
      this.slide =  this.information.collection.length ;
      this.$refs.slider.setActiveItem(this.information.collection.length );
      this.nextSlide()
    } else {
      this.findAndUpdateTag();
    }
  },
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
    this.findAndUpdateTag();
  },
};
</script>

<style scoped>
@import "./onboarding.css";
</style>
