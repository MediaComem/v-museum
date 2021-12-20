<template>
  <div class="title">
    <h1 class="justify-text">TAGS</h1>
    <arrow-up
      class="justify-arrow"
      :isFull="isFullSize"
      :isMobile="isMobile"
      :text="arrowText"
      @previous-slide="$emit('previousSlide')"
    />
  </div>
  <div class="canvas-display overflow">
    <div v-for="(tag, index) in tags.tags.sort()" :key="index" class="border">
      <div class="display-element">
        <p :class="fontSize">{{ tag }}</p>
      </div>
    </div>
  </div>
  <!-- It ensures the full display in any case -->
  <div style="padding-bottom: 2vh" />
</template>

<script>
import tags from "@/assets/onboarding/tags.json";
import ArrowUp from "../Logo/ArrowUp.vue";
export default {
  components: { ArrowUp },
  emits: ["previousSlide"],
  props: {
    isFullSize: Boolean,
    isMobile: Boolean,
    arrowText: Object,
  },
  data() {
    return {
      tags: tags,
    };
  },
  computed: {
    fontSize() {
      return {
        "desktop-font": !this.isMobile,
        "mobile-font": this.isMobile,
      };
    },
  },
};
</script>

<style scoped>
.title {
  height: 10vh;
  width: 100vw;
  padding-left: 2vw;
  padding-right: 2vw;
  display: flex;
  align-items: center;
}

.justify-arrow {
  width: 82vw;
  justify-content: flex-end;
}

.justify-text {
  width: 10vw;
  justify-content: flex-start;
}

.canvas-display {
  display: flex;
  flex-wrap: wrap;
  width: 96vw;
  height: 90vh;
  padding-left: 2vw;
  padding-right: 2vw;
}

.display-element {
  width: 23vw;
  display: flex;
  justify-content: left;
  align-items: center;
}

.desktop-font {
  font-size: normal;
}

.mobile-font {
  font-size: x-small;
}

.border {
  border-top: solid 1px black;
}
</style>
