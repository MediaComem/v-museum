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
  height: 12px;
  width: 12px;
}

.text {
  font-size: clamp(10px,1vw,16px);
  text-align: left;
  text-transform: uppercase;
  text-align: center;
  margin: 0.7em 0;
}
</style>
