<template>
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
  <div @touchstart="touchStart" @touchend="changeSlide">
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
      @previous-slide="$emit('previousSlide')"
    />
    <el-row>
      <h2 class="collection-title-mobile mobile-margin">
        {{ item.title }}
      </h2>
    </el-row>
    <el-row class="completion-element-mobile mobile-margin">
      <documents-information
        class="completion-element clickable"
        :tagInfos="item.tag"
        @load-tag-view="$emit('loadTagView', item.tag)"
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
        :isMobile="true"
        :isFull="false"
        :text="
          index === information.collection.length - 1
            ? allTagText
            : information.collection[index + 1]
        "
        @next-slide="$emit('nextSlide')"
      />
    </el-row>
  </div>
</template>

<script>
import ArrowUp from "../Logo/ArrowUp.vue";
import ArrowDown from "../Logo/ArrowDown.vue";
import DocumentsInformation from "../Logo/DocumentsInformation.vue";

export default {
  components: { ArrowUp, ArrowDown, DocumentsInformation },
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
      startPosition: 0,
      startMoveTime: 0,
    };
  },
  methods: {
    touchStart(event) {
      this.startMoveTime = Date.now();
      this.startPosition = event.changedTouches[0].clientY;
    },
    changeSlide(event) {
      if (Date.now() - this.startMoveTime > 100) {
        const endPosition = event.changedTouches[0].clientY;
        if (this.startPosition < endPosition) {
          this.$emit("previousSlide");
        } else if (this.startPosition > endPosition) {
          this.$emit("nextSlide");
        }
      }
    },
  },
  computed: {
    collapseMobile() {
      return {
        "background-color": this.information.collection[this.index].color,
        height: "100vh",
        width: "100vw",
        transform: this.isCollapse ? "translateX(0)" : "translate(-100vw)",
      };
    },
  },
};
</script>

<style scoped>
@import "../onboarding.css";
@import "./mobile_slide.css";
@import "../../shared/pointer.css";
</style>
