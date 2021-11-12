<template>
  <div class="display">
    <div v-if="text">
      <div v-if="text.title === 'INTRODUCTION'">
        <h1 :class="textSize">{{ text.title }}</h1>
      </div>
      <div v-else>
        <h1 :class="textSize">{{ text.title.slice(0, 10) }}</h1>
        <h1 :class="textSize">{{ text.title.slice(11, 180) }}</h1>
      </div>
    </div>
    <svg
      class="pointer"
      :width="size"
      :height="size"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="28.5" stroke="#1C1C1C" stroke-width="3" />
      <path
        d="M31.0607 18.9393C30.4749 18.3536 29.5251 18.3536 28.9393 18.9393L19.3934 28.4853C18.8076 29.0711 18.8076 30.0208 19.3934 30.6066C19.9792 31.1924 20.9289 31.1924 21.5147 30.6066L30 22.1213L38.4853 30.6066C39.0711 31.1924 40.0208 31.1924 40.6066 30.6066C41.1924 30.0208 41.1924 29.0711 40.6066 28.4853L31.0607 18.9393ZM28.5 42C28.5 42.8284 29.1716 43.5 30 43.5C30.8284 43.5 31.5 42.8284 31.5 42L28.5 42ZM28.5 20L28.5 42L31.5 42L31.5 20L28.5 20Z"
        fill="black"
        fill-opacity="0.75"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    text: Object,
    isMobile: Boolean,
    isFull: Boolean,
  },
  computed: {
    textSize() {
      return {
        "align-mobile": this.isMobile,
        align: !this.isMobile && this.isFull,
        "align-intermediary": !this.isFull && !this.isMobile,
      };
    },
    size() {
      if (this.isMobile) {
        return 20;
      } else if (this.isFull) {
        return 60;
      } else {
        return 40;
      }
    },
  },
};
</script>

<style scoped>
@import "./arrow.css";
@import "../onboarding.css";
</style>
