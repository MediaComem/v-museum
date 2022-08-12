<template>
  <div class="y mandatory-scroll-snapping" dir="ltr" @scroll="scrollSlide" @touchstart="disableZoom">
    <section :ref="'Introduction'">
      <introduction-slide
        :information="information"
        @change-slide="changeSlide"
      />
    </section>

    <section
      v-for="(item, index) in information.collection"
      :key="index"
      :style="{ background: item.color }"
      :ref="`decade-${index}`"
    >
      <desktop-slide
        :ref="`slide-${index}`"
        v-if="!isMobile"
        :information="information"
        :index="index"
        :item="item"
        :isFullSize="isFullSize"
        :mainTitle="mainTitle"
        :allTagText="allTagText"
        @load-tag-view="loadTagView"
        @change-slide="changeSlide"
      />

      <mobile-slide
        :ref="`slide-${index}`"
        v-if="isMobile"
        :information="information"
        :index="index"
        :item="item"
        :isFullSize="isFullSize"
        :mainTitle="mainTitle"
        :allTagText="allTagText"
        @load-tag-view="loadTagView"
        @change-slide="changeSlide"
      />
    </section>
    <section :ref="'Tags'">
      <tags-slide
        :lastId="information.collection.length - 1"
        :isFullSize="isFullSize"
        :isMobile="isMobile"
        :arrowText="information.collection[information.collection.length - 1]"
        @load-tag-view="loadTagView"
        @change-slide="changeSlide"
      />
    </section>
  </div>
</template>

<script>
import { useWindowSize } from 'vue-window-size';

import IntroductionSlide from './Slide/IntroductionSlide.vue';
import DesktopSlide from './Slide/DesktopSlide.vue';
import MobileSlide from './Slide/MobileSlide.vue';
import TagsSlide from './Slide/TagsSlide.vue';

import text from '@/assets/onboarding/text.json';

export default {
  name: 'Onboarding',
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
        vm.loadSlide();
      }
    });
  },
  data() {
    return {
      mainTitle: { title: 'INTRODUCTION' },
      allTagText: { title: 'ALL TAGS' },
      information: text,
      isCollapse: false,
      slide: 0,
      tag: undefined,
      windowHeight: undefined,
      windowWidth: undefined,
      lastScroll: undefined,
    };
  },
  methods: {
    scrollSlide() {
      clearTimeout(this.lastScroll);
      this.lastScroll = setTimeout(() => {
        for (let i = 0; i < this.information.collection.length; i++) {
          this.$refs[`slide-${i}`].isCollapse = false;
        }
      }, 50);
    },
    disableZoom(event) {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    },
    changeSlide(event) {
      this.$refs[event].scrollIntoView({ behavior: 'smooth' });
    },
    loadTagView(tag) {
      this.$router.push({
        path: `/full_tag`,
        query: { tag: encodeURIComponent(tag.tag) },
      });
    },
    loadSlide() {
      if (this.tag) {
        let index = 0;
        index = this.information.collection.findIndex((e) => {
          return e.tag.tag == this.tag;
        });
        if (index === -1) {
          this.$refs['Tags'].scrollIntoView();
        } else {
          this.$refs[`decade-${index}`].scrollIntoView();
        }
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
  mounted() {
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;
  },
};
</script>

<style scoped>
@import './onboarding.css';

.y.mandatory-scroll-snapping {
  height: 100vh;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
}

@media only screen and (max-width: 599px) {
  section {
    height: 100vh;
    width: 100vw;
    scroll-snap-align: start;
    position: relative;
  } 
}

@media only screen and (min-width: 600px) {
  section {
    height: 100vh;
    width: 100vw;
    scroll-snap-align: start;
    position: relative;
  } 
}
</style>
