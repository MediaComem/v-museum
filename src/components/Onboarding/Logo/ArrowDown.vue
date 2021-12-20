<template>
  <div class="display">
    <div v-if="text">
      <div v-if="text.title === 'ALL TAGS'">
        <h1 :class="textSize">{{ text.title }}</h1>
      </div>
      <div v-else>
        <h1 :class="textSize">{{ text.title.slice(0, 10) }}</h1>
        <h1 :class="textSize">{{ text.title.slice(11, 180) }}</h1>
      </div>
    </div>
    <svg
      @click="$emit('nextSlide')"
      class="pointer"
      :width="size"
      :height="size"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="28.5" stroke="#1C1C1C" stroke-width="3" />
      <path
        d="M31.0607 41.0607C30.4749 41.6465 29.5251 41.6465 28.9393 41.0607L19.3934 31.5147C18.8076 30.9289 18.8076 29.9792 19.3934 29.3934C19.9792 28.8076 20.9289 28.8076 21.5147 29.3934L30 37.8787L38.4853 29.3934C39.0711 28.8076 40.0208 28.8076 40.6066 29.3934C41.1924 29.9792 41.1924 30.9289 40.6066 31.5147L31.0607 41.0607ZM28.5 18C28.5 17.1716 29.1716 16.5 30 16.5C30.8284 16.5 31.5 17.1716 31.5 18L28.5 18ZM28.5 40L28.5 18L31.5 18L31.5 40L28.5 40Z"
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
  emits: ['nextSlide'],
  computed: {
    textSize() {
      return {
        'align-mobile': this.isMobile,
        'align': !this.isMobile && this.isFull,
        'align-intermediary': !this.isFull && !this.isMobile,
      }
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
