<template>
  <svg height="2vh" width="300" :style="setPosition">
    <circle
      cx="10"
      cy="10"
      r="7"
      stroke="black"
      stroke-width="2"
      :fill="shouldFill ? 'black' : 'none'"
    ></circle>
  </svg>
</template>

<script>
export default {
  props: {
    top: String,
    left: String,
    shouldFill: Boolean,
  },
  computed: {
    setPosition() {
      return {
        position: 'absolute',
        left: this.left,
        top: this.top
      }
    }
  }
};
</script>

<style></style>
