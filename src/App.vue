<template>
  <router-view/>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
@font-face {
  font-family: "Certeau";
  src: local("WOFF2"),
   url(./fonts/Certeau/WOFF2/CerteauWeb-Regular.woff2) format("woff2");
}

#app {
  font-family: "Certeau";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: unset;
}
</style>
