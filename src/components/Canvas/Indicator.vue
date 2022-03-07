<template>
  <div class="display clickable-without-hover">
    <p class="text" :style="textRotation">{{ tag }}</p>
    <img src="@/assets/canvas/40168.svg" alt="arrow" class="arrow-size" />
  </div>
</template>

<script>
export default {
  props: {
    tag: String,
    rotation: Number,
  },
  computed: {
    textRotation() {
      return {
        'transform': `rotate(${this.rotation}deg)`,
      };
    },
  },
};
</script>

<style scoped>
@import '../shared/pointer.css';

.display {
  user-select: none;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  justify-content: center;
  width: 87px;
  transform: rotate(90deg);
}

.arrow-size {
  height: 20px;
  width: 20px;
}

.text {
  font-size: clamp(12px, 1vw, 16px);
  text-align: left;
  text-transform: uppercase;
  text-align: center;
}
</style>
