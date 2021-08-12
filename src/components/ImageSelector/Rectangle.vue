<template>
<svg :width="width" :height="height" :style="setPosition">
  <line x1="0" y1="0" :x2="20" y2="0" stroke="black" stroke-width="2"/>
  <line x1="0" y1="0" x2="0" y2="20" stroke="black" stroke-width="2"/>

  <line :x1="width - 20" y1="0" :x2="width" y2="0" stroke="black" stroke-width="2"/>
  <line :x1="width" y1="0" :x2="width" y2="20" stroke="black" stroke-width="2"/>

  <line x1="0" :y1="height - 20" x2="0" :y2="height" stroke="black" stroke-width="2"/>
  <line x1="0" :y1="height" x2="20" :y2="height" stroke="black" stroke-width="2"/>

  <line :x1="width" :y1="height - 20" :x2="width" :y2="height" stroke="black" stroke-width="2"/>
  <line :x1="width - 20" :y1="height" :x2="width" :y2="height" stroke="black" stroke-width="2"/>
</svg>
</template>

<script>
export default {
  props: {
      x: Number,
      y: Number,
      height: Number,
      width: Number,
      offsetX: Number,
      offsetY: Number,
  },
  name: 'Rectangle',
  computed: {
      setPosition() {
          return{
              left: ((this.offsetX - this.width) / 2),
              top: ((this.offsetY - this.height) / 2) + 30,
          }
      }
  }
}
</script>

<style>
svg {
    position: fixed;
    z-index: 1;
}
</style>
