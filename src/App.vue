<template>
  <image-selection/>
</template>

<script>
import ImageSelection from "./components/ImageSelection.vue";
//import SliderComponent from "./components/shared/SliderComponent.vue"
//import ImageSelection from './components/TestNewIdea.vue';

import "bootstrap";
import "bootstrap/scss/bootstrap.scss";

export default {
  name: "App",
  components: {
    ImageSelection,
    //SliderComponent
    //TestNewIdea
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
