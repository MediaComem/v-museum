<template>
  <image-selector/>
</template>

<script>
import ImageSelector from "./components/ImageSelector/ImageSelector.vue";

export default {
  name: "App",
  components: {
    ImageSelector,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: unset;
}
</style>
