<template>
  <img
    class="image-display"
    :src="`/v-museum/onboarding/${item.imagePath}`"
    @mousewheel="wheelMove"
    @touchstart="touchStart"
    @touchend="changeSlide"
  />
  <div
    class="collapse-transition"
    :style="collapse"
    style="position: absolute; left: 0px; top: 0px; height: 100vh; overflow-y:scroll"
  >
    <p class="collection-text collapse-text-align overflow">{{ item.text }}</p>
  </div>
  <logo
    style="position: absolute; left: 2vw; top: 2vh"
    @mousewheel="wheelMove"
    @touchstart="touchStart"
    @touchend="changeSlide"
  />
  <arrow-up
    :isFull="isFullSize"
    :isMobile="false"
    class="arrow-up"
    :text="index === 0 ? mainTitle : information.collection[index - 1]"
    @previous-slide="$emit('previousSlide')"
    @mousewheel="wheelMove"
    @touchstart="touchStart"
    @touchend="changeSlide"
  />
  <div
    class="collection-position"
    @mousewheel="wheelMove"
    @touchstart="touchStart"
    @touchend="changeSlide"
  >
    <el-row>
      <h2
        :class="
          isFullSize ? 'collection-title' : 'collection-title-intermediary'
        "
      >
        {{ item.title }}
      </h2>
    </el-row>
    <el-row>
      <p
        :class="isFullSize ? 'collection-text' : 'collection-text-intermediary'"
      >
        {{ item.text.slice(0, 180) }}
        <a class="more-link clickable" @click="isCollapse = !isCollapse"
          >MORE</a
        >
      </p>
    </el-row>
    <el-row style="height: 69px; width: 37vw">
      <documents-information
        class="completion-element clickable"
        :tagInfos="item.tag"
        @load-tag-view="$emit('loadTagView', item.tag)"
      />
    </el-row>
  </div>
  <arrow-down
    class="arrow-down"
    :isMobile="false"
    :isFull="isFullSize"
    :text="
      index === information.collection.length - 1
        ? allTagText
        : information.collection[index + 1]
    "
    @next-slide="$emit('nextSlide')"
    @mousewheel="wheelMove"
    @touchstart="touchStart"
    @touchend="changeSlide"
  />
</template>

<script>
import Logo from "../Logo/Logo.vue";
import ArrowUp from "../Logo/ArrowUp.vue";
import ArrowDown from "../Logo/ArrowDown.vue";
import DocumentsInformation from "../Logo/DocumentsInformation.vue";
export default {
  components: { Logo, ArrowUp, ArrowDown, DocumentsInformation },
  emits: ["loadTagView", "previousSlide", "nextSlide"],
  props: {
    index: Number,
    item: Object,
    isFullSize: Boolean,
    mainTitle: Object,
    allTagText: Object,
    information: Object,
  },
  data() {
    return {
      isCollapse: false,
      changeSlideInProgress: false,
      delayBeforeAction: 0,
      startMoveTime: 0,
      startPosition: 0,
    };
  },
  methods: {
    wheelMove(event) {
      if (event.deltaY > 0 && !this.changeSlideInProgress) {
        this.changeSlideInProgress = true;
        this.$emit("nextSlide");
        // This timeout is used to ensure that only one action is take into account when long wheel has been used.
        setTimeout(() => (this.changeSlideInProgress = false), 2000);
      }
      if (event.deltaY < 0 && !this.changeSlideInProgress) {
        this.changeSlideInProgress = true;
        this.$emit("previousSlide");
        // This timeout is used to ensure that only one action is take into account when long wheel has been used.
        setTimeout(() => (this.changeSlideInProgress = false), 2000);
      }
    },
    touchStart(event) {
      this.startMoveTime = Date.now();
      this.startPosition = event.changedTouches[0].clientY;
    },
    changeSlide(event) {
      if (Date.now() - this.startMoveTime > 100) {
        const endMove = event.changedTouches[0].clientY;
        if (this.startPosition < endMove) {
          this.$emit("previousSlide");
        } else if (this.startPosition > endMove) {
          this.$emit("nextSlide");
        }
      }
    },
  },
  computed: {
    collapse() {
      return {
        "background-color": this.information.collection[this.index].color,
        height: "100vh",
        width: "57vw",
        transform: this.isCollapse ? "translateX(0)" : "translate(-57vw)",
      };
    },
  },
};
</script>

<style scoped>
@import "../onboarding.css";
@import "./desktop_slide.css";
@import "../../shared/pointer.css";
</style>
