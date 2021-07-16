<template>
  <home/>
</template>

<script>
import Home from "./components/Home/Home.vue"
//import ImageSelector from "./components/ImageSelector/ImageSelector.vue";

export default {
  name: "App",
  components: {
    Home
    //ImageSelector,
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
