<template>
  <div class="page-size" @touchstart="disableZoom">
    <Header :tag="tagValue" />
    <full-tag-page :tag="tagValue" />
  </div>
</template>

<script>
import Header from "../shared/components/Header.vue";
import FullTagPage from "./FullTagPage.vue";

export default {
  components: { Header, FullTagPage },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.tagValue = decodeURIComponent(to.query.tag);
    });
  },
  data() {
    return {
      tagValue: "",
    };
  },
  methods: {
    disableZoom(event) {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.page-size {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
</style>
