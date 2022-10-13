<template>
  <div class="footer-canvas">
    <div v-if="nbLoadImages > 0">
      <div class="footer-loader-position">
        <div
          v-if="isMoreImagesLoading"
          class="loader"
          style="position: absolute"
        />
        <div v-if="isMoreImagesLoading" class="rotated-half-circle" />
      </div>

      <p>{{ nbLoadImages }} / {{ nbTotalImages }}</p>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Footer',
    props: {
        nbLoadImages: Number,
        nbTotalImages: Number,
        isMoreImagesLoading: Boolean
    },
};
</script>

<style scoped>
@import "./loader.css";

p {
  margin: 0;
  color: white;
}

.footer-canvas {
  height: 50px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-loader-position {
  position: relative;
  left: 1vw;
}
</style>