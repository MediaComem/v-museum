<template>
  <div class="display clickable-without-hover">
    <p class="text" :style="text">{{ tag }}</p>
    <img src="@/assets/canvas/40168.svg" alt="arrow" :style="arrowSize" />
  </div>
</template>

<script>
export default {
  props: {
    tag: String,
    rotation: Number,
    isSpecialDevice: Boolean,
  },
  computed: {
    arrowSize() {
      return {
        height: this.isSpecialDevice ? '48px' : '12px',
        width: this.isSpecialDevice ? '48px' : '12px',
      };
    },
    text() {
      return {
        'font-size': this.isSpecialDevice ? '26px' : 'clamp(10px,1vw,16px)',
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


.text {
  text-align: left;
  text-transform: uppercase;
  text-align: center;
  margin: 0.7em 0;
}
</style>
