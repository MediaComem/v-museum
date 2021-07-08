<template>
  <image-selection/>
</template>

<script>
import ImageSelection from "./components/ImageSelection.vue";

export default {
  name: "App",
  components: {
    ImageSelection,
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
